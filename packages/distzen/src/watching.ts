/* eslint-disable no-use-before-define */
import * as upath from 'upath'
import * as _ from 'lodash'
import * as chokidar from 'chokidar'
import { WatchOptions, FSWatcher } from 'chokidar'
import { LogZen, ELogLevel } from '@neozen/logzen'
import { IdistZenConfigAndOptions } from './types'
import * as F from 'futil-js'

export const delaySecs = (secs = 1) =>
  new Promise((resolve) => setTimeout(() => resolve(secs), secs * 1000))

export const watch = async (
  cfg: IdistZenConfigAndOptions,
  runACycle: (cfg: IdistZenConfigAndOptions) => Promise<void>
) => {
  let changesStartedTime
  const l = new LogZen('DistZen:/[@]')

  const watchConfig: WatchOptions = {
    ignoreInitial: true,
    cwd: cfg.resolvedDir,
    ignorePermissionErrors: true,
    atomic: cfg.watch, // in milliseconds
  }
  const dirsToWatch = _.values(cfg.targets).map((t) =>
    upath.join(t.declaredPath, t.distDirName)
  )

  let watcher: FSWatcher
  let running = false
  let runAgain = false

  const restartWatchingOnChanges = true // chokidar loses track if false, when directories are removed

  const runACycleOnChange = F.debounceAsync(cfg.watch, async (): Promise<void> => {
    if (running) {
      runAgain = true
      l.debug(
        `Watching: runACycleOnChange() called, but last runACycle() still running... ignored, but will runAgain when done.`
      )
      return
    }

    if (changesStartedTime)
      l.debug(
        `Cycle started #[${cfg.cycles}]: changes & debouncing took: ${
          Date.now() - changesStartedTime
        }`
      )

    running = true
    await runACycle(cfg)
    running = false

    if (runAgain) {
      runAgain = false
      l.debug(`Watching: executing queued runACycleOnChange (once)!`)
      changesStartedTime = null
      await runACycleOnChange()
    } else {
      l.ok(
        `DistZen ${
          restartWatchingOnChanges ? 'RESTARTING' : 'CONTINUING'
        } watching for more changes [${cfg.cycles}]...`
      )
      if (restartWatchingOnChanges) {
        await stopWatching('restartWatchingOnChanges: runACycleOnChange finished')
        await startWatching()
      }
    }
  })

  const startWatching = async () => {
    l.verbose('\nStarting watching: dirsToWatch =', dirsToWatch)
    watcher = chokidar.watch(dirsToWatch, watchConfig)

    await new Promise((resolve) => watcher.on('ready', resolve))
    l.debug('Watcher is ready!')

    const informChangesStarted = _.once(() => {
      changesStartedTime = Date.now()
      l.log(`Changes detected! Debouncing for ${cfg.watch}ms`)
    })

    watcher
      .on('all', () => {
        informChangesStarted()
        runACycleOnChange()
      })
      .on('error', async (error) => {
        await stopWatching(`Chokidar watcher errored - waiting 2 secs and restarting:`, error)
        await delaySecs(1)
        await startWatching()
      })

    // check all dist dirs are watched, else stopWatching(), delay a bit and restart!
    const watchedDirs = _.keys(watcher.getWatched()).map(upath.normalize)
    l.log(`Watching for changes (with debounce=${cfg.watch})...`)
    // @ts-ignore
    if (l._options.logLevel !== ELogLevel[ELogLevel.silly])
      l.verbose('Watched dirs:', watchedDirs)
    l.silly('Watched all files:', watcher.getWatched())
    const notWatchedDirs = _.difference(dirsToWatch, watchedDirs)
    if (!_.isEmpty(notWatchedDirs)) {
      l.warn(`Missing watched dirs:`, ...notWatchedDirs)
      await stopWatching(`Missing watched dirs:`, ...notWatchedDirs)
      l.debug(`Waiting 2 secs and restarting`)
      await delaySecs(2)
      await startWatching()
    }
  }

  const stopWatching = async (reason?: string, ...details: any[]) => {
    await watcher.close()
    l.verbose('Stopped watching:', reason, ...details)
  }

  await startWatching()
}
