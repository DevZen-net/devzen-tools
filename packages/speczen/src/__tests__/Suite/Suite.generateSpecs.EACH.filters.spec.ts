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

// BREAKS Too many SpecData for columns
genericTestHandler(
  'generateSpecs: EACH on root, nested, with filters in one or both',
  {
    resultAndExpectedPreprocess,
  },
  [
    // With Filters
    [
      'EACH on root: with filters on EACH root args, and inside data array',
      () =>
        new Suite(
          SUITE({ specHandlers: 'someSpecHandler' }, [
            COLUMNS('a', 'b', 'c'),
            [
              1,
              EACH(
                [2],
                SKIP(),
                [22],
                SKIP_END('reasons for SKIP_END'),
                [222],
                [BREAKS('semi-satanic number'), 333]
              ),
              3,
            ],
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
              suiteTitle: 'someSpecHandler',
              suiteFullTitle: 'someSpecHandler',
              nestingLevel: 0,
            },
            {
              isVisible: false,
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
            {
              isVisible: false,
              specData: {
                a: 1,
                b: 333,
                c: 3,
              },
            },
          ],
        },
      },
    ],
    [
      'THROWS: EACH on root: with filters on root pushing more Spec Params than columns',
      () =>
        new Suite(
          SUITE({ specHandlers: 'someSpecHandler' }, [
            COLUMNS('a', 'b', 'c'),
            [1, EACH([22], [BREAKS('Satanic number'), 333, 666]), 3],
          ])
        ).generateSpecs({ showSkipped: true }),
      `SpecZen: Suite::handleSpec: Too many SpecData params for columns: [  'a',  'b',  'c'] specData: [  1,  333,  666,  3]. Suite title: 'someSpecHandler'`,
    ],
    [
      'EACH multiple on root & nested both, with filters on both',
      () =>
        new Suite(
          SUITE({ specHandlers: 'someSpecHandler' }, [
            COLUMNS('a', 'b', 'cObject'),
            [
              EACH([1], [11], [111]),
              // 1,
              EACH([2],
                SKIP('SKIP 222'), [222],
                [BREAKS('BREAKS 666'), 666]
              ),
              {
                numba: EACH(3, SKIP('SKIP 333'), 333),
              },
            ],
          ])
        ).generateSpecs({ showSkipped: true }),
      {
        executableSpecsPerHandler: {
          // prettier-ignore
          someSpecHandler: _.flatMap([1, 11, 111], a => [
            { isVisible: true, specData: { a, b: 2, cObject: { numba: 3 } }, filter: null },

            { isVisible: false, specData: { a, b: 2, cObject: { numba: 333 } },
              filter: { reason: 'SKIP 333', priority: 6, priorityName: 'SKIP', __kind: 'Skipy' }},

            { isVisible: false, specData: { a, b: 222, cObject: { numba: 3 } },
              filter: { reason: 'SKIP 222', priority: 6, priorityName: 'SKIP', __kind: 'Skipy' }},

            {
              isVisible: false, specData: { a, b: 222, cObject: { numba: 333 } },
              filter: { reason: 'SKIP 333', priority: 6, priorityName: 'SKIP', __kind: 'Skipy' }},

            { isVisible: false, specData: { a, b: 666, cObject: { numba: 3 } },
              filter: { reason: 'BREAKS 666', priority: 3, priorityName: 'BREAKS', __kind: 'Skipy' }},

            { isVisible: false, specData: { a, b: 666, cObject: { numba: 333 }},
              filter: { reason: 'SKIP 333', priority: 6, priorityName: 'SKIP', __kind: 'Skipy' }},
          ]),
        },
      },
      {
        tinyLogTest: false,
      },
    ],
    [
      'EACH multiple on root & nested both, with filters on both',
      () =>
        new Suite(
          SUITE({ specHandlers: 'someSpecHandler' }, [
            COLUMNS('a', 'b', 'cObject'),
            [
              EACH([1], [11]),
              EACH(
                [2],
                [22],
                SKIP('SKIP 222'),
                [222],
                [BREAKS('BREAKS 666'), 666]
              ),
              {
                numba: EACH(
                  3,
                  33,
                  SKIP('SKIP 333'),
                  333,
                  BREAKS('BREAKS 999'),
                  999
                ),
              },
            ],
          ])
        ).generateSpecs({ showSkipped: true }),
      {
        // prettier-ignore
        executableSpecsPerHandler: {
          someSpecHandler: _.flatMap([1, 11], a => [
            { isVisible: true, specData: { a, b: 2, cObject: { numba: 3 }}, filter: null},
            { isVisible: true, specData: { a, b: 2, cObject: { numba: 33 }}, filter: null},
            { isVisible: false, specData: { a, b: 2, cObject: { numba: 333 }},
              filter: { reason: 'SKIP 333', priority: 6, priorityName: 'SKIP', __kind: 'Skipy' }},
            { isVisible: false, specData: { a, b: 2, cObject: { numba: 999 }},
              filter: { reason: 'BREAKS 999', priority: 3, priorityName: 'BREAKS', __kind: 'Skipy' }},
            { isVisible: true, specData: { a, b: 22, cObject: { numba: 3 }}, filter: null},
            { isVisible: true, specData: { a, b: 22, cObject: { numba: 33 }}, filter: null},
            { isVisible: false, specData: { a, b: 22, cObject: { numba: 333 }},
              filter: { reason: 'SKIP 333', priority: 6, priorityName: 'SKIP', __kind: 'Skipy' }},
            { isVisible: false, specData: { a, b: 22, cObject: { numba: 999 }},
              filter: { reason: 'BREAKS 999', priority: 3, priorityName: 'BREAKS', __kind: 'Skipy' }},
            { isVisible: false, specData: { a, b: 222, cObject: { numba: 3 }},
              filter: { reason: 'SKIP 222', priority: 6, priorityName: 'SKIP', __kind: 'Skipy' }},
            { isVisible: false, specData: { a, b: 222, cObject: { numba: 33 }},
              filter: { reason: 'SKIP 222', priority: 6, priorityName: 'SKIP', __kind: 'Skipy' }},
            { isVisible: false, specData: { a, b: 222, cObject: { numba: 333 }},
              filter: { reason: 'SKIP 333', priority: 6, priorityName: 'SKIP', __kind: 'Skipy' }},
            { isVisible: false, specData: { a, b: 222, cObject: { numba: 999 }},
              filter: { reason: 'BREAKS 999', priority: 3, priorityName: 'BREAKS', __kind: 'Skipy' }},
            { isVisible: false, specData: { a, b: 666, cObject: { numba: 3 }},
              filter: { reason: 'BREAKS 666', priority: 3, priorityName: 'BREAKS', __kind: 'Skipy' }},
            { isVisible: false, specData: { a, b: 666, cObject: { numba: 33 }},
              filter: { reason: 'BREAKS 666', priority: 3, priorityName: 'BREAKS', __kind: 'Skipy' }},
            { isVisible: false, specData: { a, b: 666, cObject: { numba: 333 }},
              filter: { reason: 'SKIP 333', priority: 6, priorityName: 'SKIP', __kind: 'Skipy' }},
            { isVisible: false, specData: { a, b: 666, cObject: { numba: 999 }},
              filter: { reason: 'BREAKS 999', priority: 3, priorityName: 'BREAKS', __kind: 'Skipy' }},
          ]),
        },
      },
      {
        tinyLogTest: false,
      },
    ],
  ]
)
