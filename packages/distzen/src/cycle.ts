import * as _ from 'lodash'
import { LogZen } from '@neozen/logzen'

// local
import { clean } from './clean'
import { installLocal } from './installLocal'
import { copy } from './copy'
import { tsCleanBuilt } from './tsCleanBuilt'
import { IdistZenConfigAndOptions } from './types'

const l = new LogZen('DistZen:/[@]')

export const runACycle = async (cfg: IdistZenConfigAndOptions) => {
  const startTimeMillis = Date.now()
  cfg.cycles = cfg.cycles + 1
  l.debug(`Starting runACycle() #${cfg.cycles}`)

  // cleaning if needed, 1st time only
  const needsCleaning = !_.isEmpty(cfg.clean) || !_.isEmpty(cfg.deepClean)
  if (needsCleaning && cfg.cycles === 1) await clean(cfg)

  if (!needsCleaning || cfg.noCleanExit || cfg.watch) {
    await installLocal(cfg)
    await tsCleanBuilt(cfg, true)
    await copy(cfg)
    await tsCleanBuilt(cfg, false)
  } else l.ok('DistZen cleaned and now exits - use --noCleanExit or --watch to continue!')

  l.debug(`Finished runACycle() #${cfg.cycles} in ${Date.now() - startTimeMillis}ms`)
}
