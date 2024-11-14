#!/usr/bin/env node
import { LogZen, ELogLevel } from '@devzen/logzen'

LogZen.addPathReplacements({
  'node_modules/@devzen/distzen/dist': 'DistZen',
})

// 3rd party
import * as _ from 'lodash'
import { Command } from 'commander'

// local
import { IdistZenCliOptions } from './types'

import { getFinalConfig } from './getFinalConfig'
import { runACycle } from './cycle'
import { watch } from './watching'

const l = new LogZen('DistZen:/[@]')

const program = new Command()
program
  .arguments('[cmds...]')
  .description(
    `Usage: distzen [options]

Install & watch clean/copy/sync multiple local packages, production-level via \`npm i\`, without symlinks, in a snap!

All options can be used on cli or config (except "localDependencies" which is config-only).

Config (optional) looks like:

      # file: .distzen.yml

      # The "localDependencies" can also reside in package.json and they are merged. You need to have ALL localDependencies declared somewhere, cause npm can't do partial installs.

      "localDependencies":
        "great-lib1": "../path/to/great-lib1"
        "great-lib2": "../other/path/to/great-lib2"
        "great-lib3": "../other/path/to/great-lib3"

      # A string[] of the dependency names you only care about (to watch, clean, copy, ts-clean-build etc).
      # If omitted, all "localDependencies" become targets. Can be used in CLI

      "targetDepNames":
        - "great-lib1"
        - "great-lib2"

Examples:

      $ distzen --watch                                  # executes & watches, using default config ".distzen.yml"

      $ distzen --config some-config.json                # executes, using "some-config.json"
  `
  )
  // .arguments('[cmds...]')
  .option(
    '-c --config <config>',
    'Use given config filename, relative to cwd (not workDir). Errors if not given file not found. Defaults to `.distzen.yml`, no error or warning if that is not found.'
  )
  .option(
    '-w --watch [debounce]',
    `Watch all target dist directories for changes, trigger a DistZen cycle on changes. Note that clean & deepClean is only running on 1st run, so it's not participating on watch cycles. Debounce in milliseconds, defaults to 1000 - learn debounce here https://css-tricks.com/debouncing-throttling-explained-examples/. A Debounce of 2000 is recommended, if you are seeing many DistZen restarts while updating.
    `
  )
  .option(
    '-d --workDir <workDir>',
    `Specify working directory, which is relative to CWD unless it starts with '/' or '~' where it becomes absolute. Default is CWD. All target apps are relative to this resolved directory. Defaults to './'`
  )
  .option(
    '-l --logLevel <logLevel>',
    `A LogLevel, using LogZen ELogLevel: [${_.filter(_.keys(ELogLevel), (v: any) =>
      _.isNaN(v * 1)
    ).join(', ')}]. Defaults to 'info'.`
  )
  .option('-d --debug', 'Same as logLevel=DEBUG, outputs the command(s) before executing')
  .option(
    '-y --dryRun',
    'Enables debugging but it doesnt actually execute anything, only logs it'
  )
  .option('-k --skipInstallLocal', 'Skip install-local, even if needed - might cause issues')
  .option(
    '-f --forceInstallLocal',
    'Force install-local, even if not needed - it takes a while!'
  )
  .option(
    '-t --targetDepNames [libs...]',
    `Target specific libraries for clean, copy, watching etc. `
  )
  .option(
    '-n --clean [libs...]',
    `Clean libs dist directory contents (inside the local App's node_modules) and exits.

    Filter specific libs using "$ distzen --clean my-lib" to clean my-lib only, i.e directory "great-app/node_modules/my-lib/dist".

    If [libs...] is completelly omitted, it deletes all "localDependencies" declared.

    By default it exits after cleaning, but you can avoid exiting with --noCleanExit`
  )
  .option(
    '-N --deepClean [libs...]',
    `Like --clean, but it deletes the whole lib directory, i.e "great-app/node_modules/my-lib"`
  )
  .option('-z --noCleanExit', 'Do not exit after clean/deepClean (default is to exit)')
  .action(async (cmds, cliOptions: IdistZenCliOptions) => {
    const cfg = await getFinalConfig(cliOptions)
    LogZen.updateLogPathOptions({ '[~]': { logLevel: cfg.logLevel as any } })
    l.ok('DistZen starting!')

    await runACycle(cfg)

    if (cfg.watch) {
      await watch(cfg, runACycle)
    } else {
      l.ok('DistZen done!')
    }
  })
  .parse(process.argv)
