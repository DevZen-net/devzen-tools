import * as jetpack from 'fs-jetpack'
import { LogZen } from '@devzen/logzen'

// local
import { IdistZenConfigAndOptions } from './types'

const l = new LogZen('DistZen:/[@]')

const doClean = async (cfg: IdistZenConfigAndOptions, deep = false) => {
  l.debug(`Actual (${deep ? 'deepClean' : 'clean'}):`, deep ? cfg.deepClean : cfg.clean)

  for (const targetName of deep ? cfg.deepClean : cfg.clean) {
    if (!cfg.targets[targetName])
      throw new Error(
        `DistZen error: ${
          deep ? 'deepClean' : 'clean'
        } target "${targetName}" doesnt exist on config.targets`
      )

    const target = cfg.targets[targetName]
    const targetPath = deep ? target.installedPath : target.installedDistPath

    l.debug(
      `${cfg.dryRun ? '(--dryRun) ' : ''}Executing ${
        deep ? 'deepClean' : 'clean'
      }-ing ${targetName}: $ rimraf "${targetPath}"`
    )

    // if (!cfg.dryRun) await rimraf(targetPath) // OLD way
    if (!cfg.dryRun) await jetpack.removeAsync(targetPath)
  }
}

export const clean = async (cfg: IdistZenConfigAndOptions) => {
  l.ok(`Cleaning starting: clean =`, cfg.clean, `deepClean =`, cfg.deepClean)
  await doClean(cfg)
  await doClean(cfg, true)
}
