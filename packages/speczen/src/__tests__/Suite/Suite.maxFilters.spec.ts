// ******** maxFilters ********
import {
  COLUMNS,
  EOnliesPriorities,
  ESkipiesPriorities,
  ME,
  ONLY,
  SKIP,
  SUITE,
  TODO,
  WIP,
} from '../../code/types'
import { Suite } from '../../code/Suite'
import { genericTestHandler } from '../test-utils/genericTestHandler'

genericTestHandler('Suite.maxFilters', {}, [
  [
    'maxFilters: in SUITE array and in Specs',
    () =>
      new Suite(
        SUITE({ specHandlers: 'maxFilters' }, [
          COLUMNS('title', 'num'),
          [ONLY, 'readSpec1', 1],
          SKIP,
          SUITE([TODO, ['readSpec1', 1], SUITE([WIP, ['readSpec1', 1]])]),
        ])
      ).maxFilters(),
    {
      maxOnlie: {
        __kind: 'Onlie',
        priority: EOnliesPriorities.ONLY,
      },
      maxSkipy: {
        __kind: 'Skipy',
        priority: ESkipiesPriorities.WIP,
      },
    },
  ],
  [
    'maxFilters: in SUITE args, array and in Specs',
    () =>
      new Suite(
        SUITE({ specHandlers: 'maxFilters' }, [
          COLUMNS('title', 'num'),
          [ONLY, 'readSpec1', 1],
          SKIP,
          SUITE(
            ME, // <== max Onlie is ME, in SUITE args
            [
              TODO,
              ['readSpec1', 1],
              SUITE(WIP, [['readSpec1', 1]]), // <== max Skipy
            ]
          ),
        ])
      ).maxFilters(),
    {
      maxOnlie: {
        __kind: 'Onlie',
        priority: EOnliesPriorities.ME,
      },
      maxSkipy: {
        __kind: 'Skipy',
        priority: ESkipiesPriorities.WIP,
      },
    },
  ],
  // BREAKS('WIP_ABOVE & ME_ABOVE are NOT IMPLEMENTED'),
  // [
  //   'maxFilters: in FilterAbove in SUITE Array',
  //   () =>
  //     new Suite(
  //       SUITE({ specHandlers: 'maxFilters' }, [
  //         COLUMNS('title', 'num'),
  //         ['readSpec1', 1],
  //         SKIP,
  //         ME_ABOVE, // <== max Onlie is ME_ABOVE
  //         SUITE([
  //           ONLY,
  //           ['readSpec1', 1],
  //           SUITE([
  //             ['readSpec1', 1],
  //             WIP_ABOVE, // <== max Skipy is the WIP_ABOVE
  //           ]),
  //         ]),
  //       ])
  //     ).maxFilters(),
  //   {
  //     maxOnlie: {
  //       __kind: 'OnlieAbove',
  //       priority: EOnliesPriorities.ME,
  //     },
  //     maxSkipy: {
  //       __kind: 'SkipyAbove',
  //       priority: ESkipiesPriorities.WIP,
  //     },
  //   },
  // ],
])
