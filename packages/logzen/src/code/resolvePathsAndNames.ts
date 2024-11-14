// find shortest path from CWD, auto consume src & dist.
// import { getTinyLog } from './tiny-log'
import * as upath from 'upath'
import * as _ from 'lodash'
import { TPathReplacements } from './types'

// const _log = getTinyLog(false, 'resolvePathsAndNames')

export const resolvePathsAndNames = ({
  fullPathToResolve,
  cwd,
  pathReplacements = {},
}: {
  /**
    The full path fo creating/calling file to resolve.
      eg '/mnt/project/node_modules/@devzen/apizen/dist/entity/create',
   */
  fullPathToResolve: string
  /**
    An object keyed with candidate paths, and values the replacement that should take place for each one
    { 'node_modules/@devzen/apizen/dist': 'ApiZen', ... },
  */
  pathReplacements: TPathReplacements
  /**
    The working directory,
    eg '/mnt/projects/projects/devzen/packages/apizen-example',
   */
  cwd: string
}): {
  /**
    The resolved name for this pathToResolve, incorporating replacements
      eg 'ApiZen@/entity/genAbstractEntityService',
   */
  resolvedName: string
  /**
     The path that effectively matched and was replaced,
      eg 'node_modules/@devzen/apizen/dist',
   */
  replacedPath: string

  /**
  The re
   */
  relativePath: string

  /**
    The extra distance from replacedPath to pathToResolve, eg
    eg 'entity/genAbstractEntityService'
   */
  distanceFromReplacedPath: string
  /**
    The full matched path of the library, relative to CWD
    eg 'node_modules/@devzen/apizen/dist/entity/genAbstractEntityService',
   */
  matchedPath: string
} => {
  // _log('resolvePath(', { cwd, fullPathToResolve: fullPathToResolve, pathReplacements })

  const relativePath = upath.relative(cwd, fullPathToResolve)

  // @ts-ignore
  const candidates: {
    /**
      The path from the replacementPath candidate (relative to cwd), to get the pathToResolve.
        eg [ 'anotherPath', 'someOtherFile' ]
     */
    pathDistance: string[]
    /**
      The actual candidate replacedPath, eg `src/examples-docs`
    */
    replacedPath: string
    /**
    The actual replacement that matched, eg `LogZenExample`
     */
    replacement: string
  }[] = _.values(
    _.mapValues(pathReplacements, (replacement, replacedPath) => {
      const pathDistance = upath
        .relative(upath.join(cwd, replacedPath), fullPathToResolve)
        .split('/')
        .filter((p) => !!p)

      return { pathDistance, replacedPath: upath.join(replacedPath), replacement }
    })
  )
    // discard if chosen path doesn't match (upath.relative gives ['..', '..', ..., ...nameOrPath])
    .filter((candidate) => candidate.pathDistance[0] !== '..')
    .sort((a, b) => b.pathDistance.length - a.pathDistance.length)

  // _log('candidates =', candidates)

  const {
    pathDistance = [],
    replacedPath = null,
    replacement = null,
  } = candidates.length > 0 ? _.last(candidates) : {}

  const result = {
    // prettier-ignore
    resolvedName: _.isString(replacement)
      ? `${replacement}${pathDistance.length > 0 && replacement ? '@/' : ''}${pathDistance.join('/')}`
      : relativePath,
    replacedPath,
    distanceFromReplacedPath: pathDistance.join('/'),
    matchedPath: replacedPath
      ? `${replacedPath}${pathDistance.length > 0 ? `/${pathDistance.join('/')}` : ''}`
      : null,
    relativePath,
  }
  // _log('resolvePathsAndNames() result:', result)

  return result
}
