import * as _f from 'lodash/fp'
import * as _ from 'lodash'

import {
  BREAKS,
  COLUMNS,
  NOPE,
  EOnliesPriorities,
  ESkipiesPriorities,
  FOCUS,
  ME,
  ONLY,
  SKIP,
  SUITE,
  TODO,
  BREAKS_END,
  NOPE_END,
  FEAT_END,
  FOCUS_END,
  ONLY_END,
  SKIP_END,
  LOOK_END,
  WIP,
  LOOK,
  ONLY_ABOVE,
  WIP_ABOVE,
  ME_ABOVE,
  EACH,
} from '../../code/types'
import { Suite } from '../../code/Suite'
import { genericTestHandler } from '../test-utils/genericTestHandler'

const resultAndExpectedPreprocess = (
  generateSpecsResult: ReturnType<Suite<any>['generateSpecs']>
) =>
  _.mapValues(
    generateSpecsResult.executableSpecsPerHandler,
    (specHandlerArray) =>
      _.map(
        specHandlerArray,
        _f.omit(['suiteTitle', 'suiteFullTitle', 'nestingLevel', 'testRunner'])
      )
  )

genericTestHandler(
  'generateSpecs: EACH: on root & nested - no filters',
  { resultAndExpectedPreprocess },
  [
    [
      'EACH on root: simple',
      () =>
        new Suite(
          SUITE({ specHandlers: 'someSpecHandler' }, [
            COLUMNS('a', 'b', 'c'),
            [1, EACH([2], [22], [222]), 3],
          ])
        ).generateSpecs({ showSkipped: true }),
      {
        executableSpecsPerHandler: {
          someSpecHandler: [
            {
              isVisible: true,
              specData: {
                a: 1,
                b: 2,
                c: 3,
              },
            },
            {
              isVisible: true,
              specData: {
                a: 1,
                b: 22,
                c: 3,
              },
            },
            {
              isVisible: true,
              specData: {
                a: 1,
                b: 222,
                c: 3,
              },
            },
          ],
        },
      },
    ],
    [
      'EACH on root & nested both',
      () =>
        new Suite(
          SUITE({ specHandlers: 'someSpecHandler' }, [
            COLUMNS('a', 'b', 'cObject'),
            [1, EACH([2], [22]), { numba: EACH(3, 33) }],
          ])
        ).generateSpecs({ showSkipped: true }),
      {
        executableSpecsPerHandler: {
          someSpecHandler: [
            {
              isVisible: true,
              specData: {
                a: 1,
                b: 2,
                cObject: {
                  numba: 3,
                },
              },
            },
            {
              isVisible: true,
              specData: {
                a: 1,
                b: 2,
                cObject: {
                  numba: 33,
                },
              },
            },
            {
              isVisible: true,
              specData: {
                a: 1,
                b: 22,
                cObject: {
                  numba: 3,
                },
              },
            },
            {
              isVisible: true,
              specData: {
                a: 1,
                b: 22,
                cObject: {
                  numba: 33,
                },
              },
            },
          ],
        },
      },
    ],
  ]
)
