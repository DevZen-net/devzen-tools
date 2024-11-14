// clean & exit
import * as _ from 'lodash'
import * as upath from 'upath'
import { IdistZenConfigAndOptions, TDependencyResolved } from './types'
import { execAndPrint } from './execAndPrint'
import { LogZen } from '@devzen/logzen'
const readConfig = require('read-config-ng')

const l = new LogZen('DistZen:/[@]')

const isTypescriptProject = (target: TDependencyResolved) => {
  const pkgJson = readConfig(upath.joinSafe(target.absolutePath, './package.json'))
  return pkgJson.devDependencies.typescript || pkgJson.dependencies.typescript
}

/**
 *
 * @param cfg the config
 * @param forLib whether to execute for:
 *     a) target library (i.e. between its ./src and its ./dist)
 *  OR b) for your local app that uses the lib (i.e between its ./src and its you great-app/node_modules/great-lib/dist)
 */
export const tsCleanBuilt = async (cfg: IdistZenConfigAndOptions, forLib: boolean) => {
  l.verbose(`Starting ts-clean-built`)
  for (const targetName of _.keys(cfg.targets)) {
    const target = cfg.targets[targetName]

    if (!isTypescriptProject(target)) {
      l.ok(
        `Starting ts-clean-built: ${target.dependencyName} is not a TypeScript project - ts-clean-built not needed`
      )
    }

    const cmd = `npx ts-clean-built --old --files --dir ${target.absoluteSrcPath} --out ${
      forLib ? target.absoluteDistPath : target.installedDistPath
    }`
    l.debug(
      `Running ts-clean-built for ${targetName} ${
        forLib ? 'for lib it self.' : `inside your App's "${cfg.dependantName}" node_modules.`
      }`
    )
    await execAndPrint(cmd, cfg)
  }
}
