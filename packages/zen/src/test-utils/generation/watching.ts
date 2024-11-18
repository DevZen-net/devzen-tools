/* eslint-disable no-use-before-define */
import * as upath from 'upath'
import * as _ from 'lodash'
import * as chokidar from 'chokidar'
import { WatchOptions, FSWatcher } from 'chokidar'
import * as F from 'futil-js'
import * as c from 'ansi-colors'
import { ISubstituteOptionsAndState } from './types'

export const delaySecs = (secs = 1) =>
  new Promise((resolve) => setTimeout(() => resolve(secs), secs * 1000))

export const watch = async (
  o: ISubstituteOptionsAndState,
  runACycle: (options: ISubstituteOptionsAndState) => Promise<void>
) => {
  let changesStartedTime

  const watchConfig: WatchOptions = {
    ignoreInitial: true,
    cwd: o.resolvedWorkDir,
    ignorePermissionErrors: true,
    atomic: o.watch, // in milliseconds
  }
  const dirsAndFilesToWatch = _.uniq([
    o.resolvedTemplatesDir,
    ..._.values(o.substitutions).map((s) => s.sourceFile.fullFilename),
  ])

  let watcher: FSWatcher
  let running = false
  let runAgain = false

  const restartWatchingOnChanges = true // chokidar loses track if false, when directories are removed

  const runACycleOnChange = F.debounceAsync(o.watch, async (): Promise<void> => {
    if (running) {
      runAgain = true
      o.l.debug(
        `Watching: runACycleOnChange() called, but last runACycle() still running... ignored, but will runAgain when done.`
      )
      return
    }

    if (changesStartedTime)
      o.l.debug(
        `Cycle started #[${o.cycles}]: changes & debouncing took: ${
          Date.now() - changesStartedTime
        }`
      )

    running = true
    await runACycle(o)
    running = false

    if (runAgain) {
      runAgain = false
      o.l.debug(`Watching: executing queued runACycleOnChange (once)!`)
      changesStartedTime = null
      await runACycleOnChange()
    } else {
      o.l.silly(
        `substitute ${
          restartWatchingOnChanges ? 'RESTARTING' : 'CONTINUING'
        } watching for more changes [${o.cycles}]...`
      )
      if (restartWatchingOnChanges) {
        await stopWatching('restartWatchingOnChanges: runACycleOnChange finished')
        await startWatching()
      }
    }
  })

  const startWatching = async () => {
    o.l.debug('\nStarting watching: dirsAndFilesToWatch =', dirsAndFilesToWatch)
    watcher = chokidar.watch(dirsAndFilesToWatch, watchConfig)

    await new Promise((resolve) => watcher.on('ready', resolve))
    o.l.debug('Watcher is ready!')

    const informChangesStarted = _.once(() => {
      changesStartedTime = Date.now()
      o.l.verbose(`Changes detected! Debouncing for ${o.watch}ms`)
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
    o.l.verbose(
      `Watching for changes (debounce=${o.watch}) - in "${c.blueBright(o.resolvedWorkDir)}" watched dirs:`,
      watchedDirs
    )
    
    o.l.debug('Watched all files:', watcher.getWatched())
    // const notWatchedDirs = _.difference(dirsAndFilesToWatch, watchedDirs)
    // if (!_.isEmpty(notWatchedDirs)) {
    //   l.warn(`Missing watched dirs:`, ...notWatchedDirs)
    //   await stopWatching(`Missing watched dirs:`, ...notWatchedDirs)
    //   l.debug(`Waiting 10 secs and restarting`)
    //   await delaySecs(10)
    //   await startWatching()
    // }
  }

  const stopWatching = async (reason?: string, ...details: any[]) => {
    await watcher.close()
    o.l.verbose('Stopped watching:', reason, ...details)
  }

  await startWatching()
}
