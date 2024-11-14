import { Suite } from '../../code/Suite'
import {
  BREAKS,
  COLUMNS,
  EACH,
  ONLY,
  SKIP,
  SUITE,
  SKIP_END,
  SKIP_MUTE,
  BREAKS_END,
} from '../../code/types'
import { genericTestHandler } from '../test-utils/genericTestHandler'

genericTestHandler(
  `Suite.createConcreteSuiteFromSUITE: EACH nested - Filters accepted`,
  {},
  [
    // BREAKS Too many SpecData for columns
    [
      'EACH nested: a filter can appear inside nested EACH - multiple EACHes',
      () =>
        new Suite(
          SUITE({ specHandlers: 'DRYNormalNumbers2' }, [
            COLUMNS('user', 'document', 'expected'),
            [
              // @todo:rename to userId, documentId
              {
                id: EACH(
                  'forbiddenUserId1',
                  SKIP('reason_SKIPed_forbiddenUserId2'),
                  'SKIPed_forbiddenUserId2',
                  SKIP_END
                ),
              },
              { id: EACH(999, BREAKS('BREAKS 666'), 666, BREAKS_END) },
              'HttpStatus.FORBIDDEN',
            ],
          ])
        ),
      {
        parentSuite: null,
        __kind: 'Suite',
        suiteArray: [
          {
            specData: {
              user: {
                id: 'forbiddenUserId1',
              },
              document: {
                id: 999,
              },
              expected: 'HttpStatus.FORBIDDEN',
            },
            filter: null,
            __kind: 'Spec',
          },
          {
            specData: {
              user: {
                id: 'forbiddenUserId1',
              },
              document: {
                id: 666,
              },
              expected: 'HttpStatus.FORBIDDEN',
            },
            filter: {
              priority: 3,
              priorityName: 'BREAKS',
              __kind: 'Skipy',
              reason: 'BREAKS 666',
            },
            __kind: 'Spec',
          },
          {
            specData: {
              user: {
                id: 'SKIPed_forbiddenUserId2',
              },
              document: {
                id: 999,
              },
              expected: 'HttpStatus.FORBIDDEN',
            },
            filter: {
              priority: 6,
              priorityName: 'SKIP',
              __kind: 'Skipy',
              reason: 'reason_SKIPed_forbiddenUserId2',
            },
            __kind: 'Spec',
          },
          {
            specData: {
              user: {
                id: 'SKIPed_forbiddenUserId2',
              },
              document: {
                id: 666,
              },
              expected: 'HttpStatus.FORBIDDEN',
            },

            filter: {
              priority: 3,
              priorityName: 'BREAKS',
              __kind: 'Skipy',
              reason: 'BREAKS 666',
            },
            __kind: 'Spec',
          },
        ],
        specHandlers: ['DRYNormalNumbers2'],
        specDataTransformer: undefined,
        resultTransform: undefined,
        expectedTransform: undefined,
        title: 'DRYNormalNumbers2',
        group: undefined,
        columnsCmd: {
          columnsNames: ['user', 'document', 'expected'],
          __kind: 'ColumnsCmd',
        },
        filter: null,
        filterEnd: null,
        filterIgnore: null,
        fullTitle: 'DRYNormalNumbers2',
      },
      // { tinyLog: true },
    ],
  ]
)
