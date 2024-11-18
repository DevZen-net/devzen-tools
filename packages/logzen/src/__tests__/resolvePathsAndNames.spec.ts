import * as _ from 'lodash'
import { LogZen, getTinyLog, TPathReplacements } from '../code'

const _log = getTinyLog(false, 'LogZen.resolvePathsAndNames')

describe('LogZen.resolvePathsAndNames', () => {
  _.each(
    [
      // without path replacements, not matching up
      [
        {
          fullPathToResolve:
            '/mnt/projects/projects/neozen/packages/logzen/src/examples-docs/temp/',
          cwd: '/mnt/projects/projects/neozen/packages/logzen/',
        },
        {
          distanceFromReplacedPath: '',
          matchedPath: null,
          relativePath: 'src/examples-docs/temp',
          replacedPath: null,
          resolvedName: 'src/examples-docs/temp',
        },
      ],

      // with complete pathReplacements
      [
        {
          fullPathToResolve:
            '/mnt/projects/projects/neozen/packages/logzen/src/examples-docs/playground/logzen-examples-docs-tests-playground',
          pathReplacements: {
            'src/examples-docs/something/': 'Something',
            './src/examples-docs/playground/logzen-examples-docs-tests-playground':
              'LogZenPlayground',
            'src/examples-docs/': 'LogZenExample',
          },
          cwd: '/mnt/projects/projects/neozen/packages/logzen/',
        },
        {
          resolvedName: 'LogZenPlayground',
          replacedPath: 'src/examples-docs/playground/logzen-examples-docs-tests-playground',
          distanceFromReplacedPath: '',
          matchedPath: 'src/examples-docs/playground/logzen-examples-docs-tests-playground',
          relativePath: 'src/examples-docs/playground/logzen-examples-docs-tests-playground',
        },
      ],
      // with partial pathReplacements
      [
        {
          fullPathToResolve:
            '/mnt/projects/projects/neozen/packages/logzen/src/examples-docs/anotherPath/someOtherFile',
          pathReplacements: {
            'src/examples-docs/temp': 'TEMP',
            'src/examples-docs/logzen-examples-docs-tests-playground': 'LogZenPlayground',
            'src/examples-docs': 'LogZenExample',
          },
          cwd: '/mnt/projects/projects/neozen/packages/logzen',
        },
        {
          resolvedName: 'LogZenExample@/anotherPath/someOtherFile',
          replacedPath: 'src/examples-docs',
          distanceFromReplacedPath: 'anotherPath/someOtherFile',
          matchedPath: 'src/examples-docs/anotherPath/someOtherFile',
          relativePath: 'src/examples-docs/anotherPath/someOtherFile',
        },
      ],
      [
        {
          fullPathToResolve:
            '/mnt/projects/projects/neozen/packages/apizen-example/node_modules/@neozen/apizen/dist/entity/genAbstractEntityService',
          pathReplacements: {
            'node_modules/@neozen/apizen/dist': 'ApiZen',
          },
          cwd: '/mnt/projects/projects/neozen/packages/apizen-example',
        },
        {
          resolvedName: 'ApiZen@/entity/genAbstractEntityService',
          replacedPath: 'node_modules/@neozen/apizen/dist',
          distanceFromReplacedPath: 'entity/genAbstractEntityService',
          matchedPath: 'node_modules/@neozen/apizen/dist/entity/genAbstractEntityService',
          relativePath: 'node_modules/@neozen/apizen/dist/entity/genAbstractEntityService',
        },
      ],

      [
        {
          cwd: '/mnt/projects/projects/neozen/packages/logzen',
          fullPathToResolve:
            '/mnt/projects/projects/neozen/packages/logzen/src/logzen/LogZen-spec',
          pathReplacements: {
            node_modules: '',
            src: '',
            dist: '',
            source: '',
            build: '',
          },
        },
        {
          resolvedName: 'logzen/LogZen-spec',
          replacedPath: 'src',
          distanceFromReplacedPath: 'logzen/LogZen-spec',
          matchedPath: 'src/logzen/LogZen-spec',
          relativePath: 'src/logzen/LogZen-spec',
        },
      ],
    ] as any,
    // ].slice(4, 5) as any,
    ([{ fullPathToResolve, pathReplacements, cwd }, expectedResult]: [
      {
        fullPathToResolve: string
        pathReplacements: TPathReplacements
        cwd: string
      },
      {
        resolvedName: string
        replacedPath: string
        relativePath: string
        distanceFromReplacedPath: string
        matchedPath: string
      },
    ]) =>
      it(`correctly resolves paths and names`, () => {
        const result = (LogZen as any)._resolvePathsAndNames({
          fullPathToResolve,
          pathReplacements,
          cwd,
        })
        expect(result).toEqual(expectedResult)
      })
  )
})
