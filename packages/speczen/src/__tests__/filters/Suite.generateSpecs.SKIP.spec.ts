// ******** maxFilters ********
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
} from '../../code/types'
import { Suite } from '../../code/Suite'
import {
  defaultSUITEOptions,
  genericTestHandler,
  resultSpecFromTitles,
  titlesFromResultSpec,
} from '../test-utils/genericTestHandler'

// ***** SKIP (alone) *****
genericTestHandler(
  'SKIP (alone)',
  {
    // resultAndExpectedPreprocess: titlesFromResultSpec,
  },
  [
    [
      'SKIP a whole suite, & one test',
      () =>
        new Suite(
          SUITE(defaultSUITEOptions, [
            ['Not skipped 1'],
            ['Not skipped 2'],
            [SKIP, 'skippedCauseOfSkip'],
            SUITE([
              SKIP,
              ['skipped because of local Suite SKIP 1'],
              ['skipped because of local Suite SKIP 2'],
            ]),
            SUITE({ specHandlers: 'someSpecHandler2' }, [
              ['NOT skipped, no SKIP in effect'],
            ]),
          ])
        ).generateSpecs(),
      resultSpecFromTitles({
        defaultSpecHandler: ['Not skipped 1', 'Not skipped 2'],
        someSpecHandler2: ['NOT skipped, no SKIP in effect'],
      }),
    ] as any,
    [
      'SKIP in effect, skips all following Specs & SUITES:',
      () =>
        new Suite(
          SUITE(defaultSUITEOptions, [
            ['Not skipped 1'],
            ['Not skipped 2'],
            SKIP,
            ['skippedCauseOfSkip'],
            SUITE([
              ['skippedCauseOfParent Suite SKIP 1'],
              ['skippedCauseOfParent Suite SKIP 2'],
            ]),
          ])
        ).generateSpecs(),
      resultSpecFromTitles({
        defaultSpecHandler: ['Not skipped 1', 'Not skipped 2'],
      }),
    ],
    [
      'SKIP in effect, is contained only inside SUITE and below:',
      () =>
        new Suite(
          SUITE(defaultSUITEOptions, [
            ['Not skipped Root 1'],
            ['Not skipped Root 2'],
            SUITE({ specHandlers: 'someSpecHandler2' }, [
              ['Not Skipped Nested 1'],
              SKIP,
              ['skippedCauseOfSkipAbove'],
              ['skippedCauseOfSkipAbove2'],
            ]),
            SUITE([['Not Skipped Nested 2']]),
            ['Not skipped Root 3'],
          ])
        ).generateSpecs(),
      resultSpecFromTitles({
        defaultSpecHandler: [
          'Not skipped Root 1',
          'Not skipped Root 2',
          'Not Skipped Nested 2',
          'Not skipped Root 3',
        ],
        someSpecHandler2: ['Not Skipped Nested 1'],
      }),
    ],
  ]
)
