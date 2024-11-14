import * as util from 'node:util'
import { exec } from 'node:child_process'

// local
import { IdistZenConfigAndOptions } from './types'
import { LogZen } from '@devzen/logzen'
import { delaySecs } from './watching'

const execP = util.promisify(exec)

const l = new LogZen('DistZen:/[@]')

export const execAndPrint = async (cmd: string, cfg: IdistZenConfigAndOptions) => {
  let completed = false
  let waitSecs = 0
  if (!cfg.dryRun)
    while (!completed) {
      try {
        l.debug(`${cfg.dryRun ? '(--dryRun) ' : ''}Executing: $`, cmd)
        const { stdout, stderr } = await execP(cmd)
        if (stderr) {
          l.error('execAndPrint stderr error:', stderr)
          break
        }
        if (stdout) l.info(stdout)
        completed = true
      } catch (error) {
        l.error('DistZen: execAndPrint threw error:', error)
      }

      if (!completed) {
        waitSecs = waitSecs + 1
        l.debug(`Delaying ${waitSecs} sec and retrying`)
        await delaySecs(waitSecs)
      }
    }
}
