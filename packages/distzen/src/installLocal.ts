// node
import * as fs from 'node:fs'

// 3rd
import * as _ from 'lodash'
import * as upath from 'upath'
import { LogZen } from '@neozen/logzen'
import { progress, LocalInstaller } from 'install-local'

// local
import { IdistZenConfigAndOptions } from './types'

const l = new LogZen('DistZen:/[@]')

export const installLocal = async (cfg: IdistZenConfigAndOptions) => {
  l.verbose('Starting installLocal()')

  if (cfg.skipInstallLocal) {
    l.ok('InstallLocal skipping due to `--skipInstallLocal`')
    return
  }
  let installLocalNeeded = false
  // check each target deps isn't installed OR is a linked one
  for (const localDepName of _.keys(cfg.localDependenciesResolved)) {
    const localDep = cfg.localDependenciesResolved[localDepName]

    let isSymbolicLink = false
    try {
      isSymbolicLink = fs.lstatSync(localDep.installedPath).isSymbolicLink()
    } catch (ignoreError) {}

    if (
      !fs.existsSync(localDep.installedPath) ||
      isSymbolicLink ||
      !fs.existsSync(upath.joinSafe(localDep.installedPath, 'package.json'))
      // we actually DONT want !fs.existsSync(target.installedDistPath), cause of clean, we can just quickly copy
    ) {
      installLocalNeeded = true
      l.warn(
        `InstallLocal: ${localDep.dependencyName} is ${
          isSymbolicLink ? 'a symbolic link' : 'not installed'
        } at ${localDep.installedPath} - installing properly through install-local!`
      )
    }
  }

  if (installLocalNeeded) {
    l.ok(
      `InstallLocal ${_.size(
        cfg.localDependencies
      )} localDependencies, as some are not installed in node_modules.`
    )
  } else {
    l.ok(
      `InstallLocal ${cfg.forceInstallLocal ? 'FORCING' : 'skipping'}: all ${_.size(
        cfg.localDependencies
      )} localDependencies seem to be installed in node_modules`
    )
    if (!cfg.forceInstallLocal) return
  }

  const sourcesByTarget = {
    [cfg.resolvedDir]: _.map(
      cfg.localDependenciesResolved,
      (localDep) => localDep.absolutePath
    ),
  }

  l.debug(
    `${cfg.dryRun ? '(--dryRun) ' : ''}Executing new LocalInstaller(sourcesByTarget =`,
    sourcesByTarget
  )
  if (!cfg.dryRun) {
    const localInstaller = new LocalInstaller(sourcesByTarget)
    progress(localInstaller)
    await localInstaller.install()
  }
}
