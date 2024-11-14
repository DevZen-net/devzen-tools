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
} from '../test-utils/genericTestHandler'

// ***** SKIP & ONLY & siblings Together *****
genericTestHandler('SKIP & ONLY & siblings Together', {}, [
  [
    'ONLY & SKIP in effect: SKIP skips despite an ONLY with right priority:',
    () =>
      new Suite(
        SUITE(defaultSUITEOptions, [
          ['Skipped cause of ONLY in effect 1'],

          SUITE([
            [ONLY, 'visible_Onlied_Nested_1'],
            ['Skipped Cause of ONLY in effect, not part of it'],
            [ONLY, 'visible_Onlied_Nested_2'],

            ONLY,
            ['visible_Onlied_Nested_3'], // part of ONLY above

            // The SKIP & ONLY wars: SKIP wins!
            SKIP,
            ['skippedCauseOfSkipAbove'],
            [ONLY, 'Skipped despite the ONLY, cause of SKIP above'],
          ]),

          SUITE({ specHandlers: 'someSpecHandler2' }, [
            ['Not allowed, ONLY in effect globally 1'],
            [ONLY, 'Only allowed 1'],
            ['Not allowed, ONLY in effect globally 2'],
            [ONLY, 'Only allowed 2'],
          ]),

          ['Skipped cause of ONLY in effect 2'],
        ])
      ).generateSpecs(),
    resultSpecFromTitles({
      defaultSpecHandler: [
        'visible_Onlied_Nested_1',
        'visible_Onlied_Nested_2',
        'visible_Onlied_Nested_3',
      ],
      someSpecHandler2: ['Only allowed 1', 'Only allowed 2'],
    }),
  ],
])
