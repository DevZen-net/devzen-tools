import * as upath from 'upath'
import * as _ from 'lodash'
import { LogZen, ELogLevel } from '@devzen/logzen'

const readConfig = require('read-config-ng')

// local
import {
  defaultConfigFilename,
  distZenDefaults,
  IdistZenCliOptions,
  IdistZenCommonOptions,
  IdistZenConfigAndOptions,
  TDependencies,
  TDependenciesResolved,
} from './types'

const l = new LogZen('DistZen:/[@]')

// paths starting with "driveLetter:\xxx" or Unix home "~" or Unix path "/xxx..."
export const absolutePathRegExp = /^(\w:[/\\].*)|(^[/~]\/?.*)/ // original, before eslint = /^(\w:[\\\/].*)|(^[~\/]\/?.*)/

// get first path item before first slash (eg "dist" from "dist/index.js") or (eg "./dist" from "./dist/index.js")
export const firstPathItem = (pathStr: string): string => {
  const pathItems = pathStr.split('/')
  let firstRealSlashIndex = 0

  while (pathItems[firstRealSlashIndex] === '' || pathItems[firstRealSlashIndex] === '.') {
    firstRealSlashIndex++
  }

  if (firstRealSlashIndex + 1 === pathItems.length)
    throw new Error(
      `DistZen: package.json "main" field must point to a directory, not a file! main: ${pathStr}`
    )

  return pathItems.slice(0, firstRealSlashIndex + 1).join('/')
}

const projectDependenciesToTargets = (
  cfg: IdistZenConfigAndOptions,
  dependencies: TDependencies
): TDependenciesResolved =>
  // @todo: filter to only targetDepNames
  _.mapValues(dependencies, (declaredPath, dependencyName) => {
    let distDirName: string
    let main
    try {
      main = readConfig(upath.joinSafe(cfg.resolvedDir, declaredPath, `./package.json`)).main
      if (!main) throw new Error('DistZen: "main" property not found in package.json')
      distDirName = firstPathItem(main)
    } catch (err) {
      l.error(
        `DistZen: Error reading property "main" from ${upath.joinSafe(
          cfg.resolvedDir,
          declaredPath,
          `./package.json`
        )}. This is needed to resolve "distDirName" that must be a directory, not a file!`,
        err
      )
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1)
    }

    let srcDirName: string
    try {
      srcDirName = readConfig(upath.joinSafe(cfg.resolvedDir, declaredPath, `./tsconfig.json`))
        .compilerOptions.baseUrl
    } catch (err) {
      // prettier-ignore
      l.error(`DistZen: Error reading property "compilerOptions.baseUrl" from ${upath.joinSafe(cfg.resolvedDir, declaredPath, './tsconfig.json')}. This is needed to resolve "srcDirName"`, err)
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1)
    }

    return {
      dependencyName,
      declaredPath,
      declaredPathDist: upath.joinSafe(declaredPath, distDirName),
      absolutePath: upath.joinSafe(cfg.resolvedDir, dependencies[dependencyName]),
      absoluteSrcPath: upath.joinSafe(
        cfg.resolvedDir,
        dependencies[dependencyName],
        srcDirName
      ),
      absoluteDistPath: upath.joinSafe(
        cfg.resolvedDir,
        dependencies[dependencyName],
        distDirName
      ),
      installedPath: upath.joinSafe(cfg.resolvedDir, 'node_modules', dependencyName),
      installedDistPath: upath.joinSafe(
        cfg.resolvedDir,
        'node_modules',
        dependencyName,
        distDirName
      ),
      distDirName,
      srcDirName,
    }
  })

const adjustLogLevel = (cfg: IdistZenCommonOptions) => {
  if (cfg.dryRun) cfg.debug = true

  if (cfg.debug) {
    if (!cfg.logLevel) cfg.logLevel = 'debug'
    else if (Number(ELogLevel[cfg.logLevel]) < Number(ELogLevel.debug)) {
      cfg.logLevel = 'debug'
    }
  }

  if (Number(ELogLevel[cfg.logLevel]) >= Number(ELogLevel.debug)) cfg.debug = true
}

export const getFinalConfig = async (
  cliOptions: IdistZenCliOptions
): Promise<IdistZenConfigAndOptions> => {
  const rawCliOptions = _.clone(cliOptions)
  adjustLogLevel(cliOptions)

  LogZen.updateLogPathOptions({
    '/': {
      debugLevel: 1,
      logLevel: (cliOptions.logLevel as any) || 'info',
    },
  })
  // prettier-ignore
  l.debug('Starting getFinalConfig with RAW cliOptions / adjusted cliOptions =', rawCliOptions, cliOptions)

  let cfg: IdistZenConfigAndOptions = null
  const configFilename = upath.joinSafe(
    process.cwd(),
    cliOptions.config || defaultConfigFilename
  )
  try {
    l.silly('Loading configFilename:', configFilename)
    cfg = readConfig(configFilename)
    l.debug('Loaded RAW config =', cfg)
  } catch (err) {
    if (cliOptions.config)
      throw new Error(
        `Error: cliOptions.config "${configFilename}" can't be loaded! Reason=${err}`
      )
    else l.debug(`Error: "${configFilename}" can't be loaded - using defaults! Reason=`, err)
  }

  cfg = _.extend({}, distZenDefaults, cfg, cliOptions) // use only cfg from here on

  adjustLogLevel(cfg)
  LogZen.updateLogPathOptions({
    '/': {
      debugLevel: 1,
      logLevel: (cfg.logLevel as any) || 'info',
    },
  })

  cfg.resolvedDir = absolutePathRegExp.test(cfg.workDir)
    ? cfg.workDir
    : upath.joinSafe(process.cwd(), cfg.workDir)

  // blend localDependencies & final targets
  const packageJson = readConfig(upath.joinSafe(cfg.resolvedDir, `./package.json`))

  cfg.localDependencies = _.isEmpty(cfg.localDependencies)
    ? packageJson.localDependencies
    : _.extend(cfg.localDependencies, packageJson.localDependencies)

  if (_.isEmpty(cfg.localDependencies)) {
    l.error(`Both config targetDependencies & packageJsonLocalDependencies empty - exiting!`)
    l.debug('Final config & cliOptions blend = ', cfg)

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  } else {
    cfg.localDependenciesResolved = projectDependenciesToTargets(cfg, cfg.localDependencies)
    if (!(_.isArray(cfg.targetDepNames) || _.isUndefined(cfg.targetDepNames)))
      throw new Error(
        'DistZen error: targetDepNames in config is NOT a string Array (eg ["myLibDep1", "myLibDep2"]).'
      )

    cfg.targets = projectDependenciesToTargets(
      cfg,
      _.pickBy(cfg.localDependencies, (v, depName) =>
        cfg.targetDepNames ? cfg.targetDepNames.includes(depName) : true
      )
    )
  }

  // misc
  cfg.dependantName = packageJson.name

  // clean & deepClean
  // @ts-ignore
  if (cfg.clean === true) cfg.clean = _.keys(cfg.targets)
  else if (!cfg.clean) cfg.clean = []

  // @ts-ignore
  if (cfg.deepClean === true) cfg.deepClean = _.keys(cfg.targets)
  else if (!cfg.deepClean) cfg.deepClean = []

  // omit "clean" ones that will be "deepClean"-ed
  for (const dependencyName of _.clone(cfg.clean))
    if (cfg.deepClean.includes(dependencyName)) _.remove(cfg.clean, (v) => v === dependencyName)

  if (cfg.watch) {
    const watch = cfg.watch
    cfg.watch = cfg.watch === true ? 1000 : _.parseInt(`${watch}`)

    if (_.isNaN(cfg.watch)) throw new Error(`Wrong watch value${watch}`)
  }

  l.debug('Final config & cliOptions blend = ', cfg)

  return cfg
}
