// 3rd party
import * as _ from 'lodash'
import * as jetpack from 'fs-jetpack'
import { LogZen } from '@devzen/logzen'

// local
import { IdistZenConfigAndOptions } from './types'

const l = new LogZen('DistZen:/[@]')

export const copy = async (cfg: IdistZenConfigAndOptions) => {
  l.verbose(`Starting copy (recursive & update):`)
  for (const targetName of _.keys(cfg.targets)) {
    const target = cfg.targets[targetName]
    l.info(`Copying ${target.absoluteDistPath} -> ${target.installedDistPath}`)
    await jetpack.copyAsync(target.absoluteDistPath, target.installedDistPath, {
      overwrite: (srcInspectData, destInspectData) => {
        return srcInspectData.modifyTime > destInspectData.modifyTime
      },
    })
  }
}
