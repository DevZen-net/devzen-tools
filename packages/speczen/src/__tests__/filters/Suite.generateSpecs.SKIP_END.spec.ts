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
  FUTURE,
  SKIP_MUTE,
} from '../../code/types'
import { Suite } from '../../code/Suite'
import {
  defaultSUITEOptions,
  genericTestHandler,
  resultSpecFromTitles,
  titlesFromResultSpec,
} from '../test-utils/genericTestHandler'

// ***** SKIP_END *****
genericTestHandler(
  'SKIP_END',
  {
    resultAndExpectedPreprocess: titlesFromResultSpec,
  },
  [
    [
      `SKIP_END: SKIP in SUITEargs in effect & SKIP_END blocks inside Suite array, multiple times`,
      () =>
        new Suite(
          SUITE(SKIP, defaultSUITEOptions, [
            ['SKipped1'], // cause SKIP in effect in SUITEargs
            SKIP_END,

            ['visible1'], // SKIP_ENDed, so visible
            ['visible2'],

            SKIP,
            ['SKipped2'], // SKIP in effect from just above
            SKIP_END,

            ['visible3'], // SKIP_ENDed again, so visible

            SKIP,
            ['Skipped4'], // SKIP in effect from just above
          ])
        ).generateSpecs(),
      resultSpecFromTitles({
        defaultSpecHandler: ['visible1', 'visible2', 'visible3'],
      }),
    ],
    [
      `SKIP_END: Cannot SKIP_END a higher level SKIP (eg BREAKS), that is in effect`,
      () =>
        new Suite(
          SUITE(defaultSUITEOptions, [
            ['visible'],

            BREAKS({ reason: 'The suite below is broken' }),
            ['Skipped cause of BREAK'],

            SKIP,
            ['Skipped cause of BREAK/SKIP'],
            SKIP_END,

            [
              'Still skipped, cause BREAKS should still in effect, SKIP_END cant end it!',
            ],

            BREAKS_END,
            ['Visible_I_was_BREAK_ENDed1'],

            SKIP,
            ['skipped cause of new SKIP'],
          ])
        ).generateSpecs(),

      resultSpecFromTitles({
        defaultSpecHandler: ['visible', 'Visible_I_was_BREAK_ENDed1'],
      }),
    ],
    [
      `SKIP_END: unskips SKIP or higher BUT not lower, in all Specs & SUITEs that follow`,
      () =>
        new Suite(
          SUITE(defaultSUITEOptions, [
            ['visible'],
            NOPE,

            ['Skipped cause NOPE'],
            SUITE([
              SKIP,
              ['Skipped cause NOPE, not SKIP'],
              SKIP_END, // SKIP_END can't eliminate NOPE, BREAKS etc from above

              ['SKipped still cause of NOPE still in effect'],
            ]),

            SKIP_END, // SKIP_END can't eliminate NOPE, BREAKS etc!
            ['Skipped cause NOPE is lower that SKIP'],

            NOPE_END,
            ['Visible_I_was_NOPE_ENDed1'],

            WIP,
            ['Skipped cause WIP'],
          ])
        ).generateSpecs(),

      resultSpecFromTitles({
        defaultSpecHandler: ['visible', 'Visible_I_was_NOPE_ENDed1'],
      }),
    ],
    [
      `SKIP_END: It stop the SKIP of SKIP or higher in effect for, that happened to come from above, which might be from a parent SUITE.
    Doesn't have to correspond to a SKIP in the same SUITE context.`,
      () =>
        new Suite(
          SUITE(defaultSUITEOptions, [
            SKIP,

            [SKIP_END, 'visible_cause_of_SKIP_END_in_Spec'],

            SUITE([
              ['Skipped cause SKIP'],

              SKIP_END, // unskip what coming from parent SUITE
              ['visible_SKIP_ENDed_nested'],
            ]),

            ['Skipped cause SKIP is still in effect at root SUITE'],

            SKIP_END,
            ['visible_SKIP_ENDed_root'],
          ])
        ).generateSpecs(),
      resultSpecFromTitles({
        defaultSpecHandler: [
          'visible_cause_of_SKIP_END_in_Spec',
          'visible_SKIP_ENDed_nested',
          'visible_SKIP_ENDed_root',
        ],
      }),
    ],

    [
      `SKIP_END: Stops the most recent SKIP priority, as well as all higher priorities like NOPE,
                 from being in effect in this scope.
                 It will make what follows visible, if other criteria are met.

                 It doesnt affect (unskip) NOPE, IGNORE, BREAKS etc of lower priority.
       `,
      () =>
        new Suite(
          SUITE(SKIP, defaultSUITEOptions, [
            ['SKipped_cause_SKIP in effect from SUITEargs'],

            SKIP_END, // SKIP_END can't eliminate below NOPE (or IGNORE, BREAKS etc.)

            ['Visible_because_of_SKIP_END1'],

            NOPE, // NOPE doesn't care about SKIP_END @todo: WTF is this, makes sense?
            ['Skipped_cause_it_is_NOPE, lower than SKIP_END, so has no effect'],

            SKIP_END, // SKIP_END again, just in case
            ['Skipped still! Cause_it_is_done and SKIP_END has no effect'],

            // Specs have their own mind?
            // Even if it is skipped with higher priority, it stays skipped?
            [WIP, 'Skipped_cause_it_is in Test Case'],

            // Let's get NOPE_END, and unskip NOPE!
            NOPE_END,
            ['Visible_because_of_NOPE_END'],
          ])
        ).generateSpecs(),
      resultSpecFromTitles({
        defaultSpecHandler: [
          'Visible_because_of_SKIP_END1',
          'Visible_because_of_NOPE_END',
        ],
      }),
    ],

    [
      `SKIP_END: complicated: many nested SUITES & using other priorities, like NOPE, IGNORE, BREAKS etc.

     SKIP in effect & then SKIP_END, inside Suite array, SKIP_ENDs the whole suite below, and sub suits

     @todo: explain better
     `,
      () =>
        new Suite(
          SUITE(defaultSUITEOptions, [
            ['Visible_NOTskippedYet'],

            // SKIPs the whole suite below, and sub suits
            SKIP,
            ['Skipped_CauseOfSkipAboveInSuite'],
            SUITE([
              ['Nested1_Still_Skipped'],
              SKIP_END, // SKIP_ENDs below only, stays in SUITE
              ['Visible_UnskippedCauseLocalSuiteSKIP_END1'],
              ['Visible_UnskippedCauseLocalSuiteSKIP_END2'],
              [TODO, 'skipped, unless ignored!'],
            ]),

            ['Skipped_CauseOfSkipAboveInSuite'],

            SUITE([
              ['Nested2_Still_Skipped_because_of_parent_suite_skip1'],
              ['Nested2_Still_Skipped_because_of_parent_suite_skip2'],
            ]),

            ['Skipped_CauseOfSkipAboveInSuite'],

            // SKIP_ENDs the whole suite below, and sub suits
            SKIP_END,

            ['Visible_wasSKIP_ENDed'],

            SUITE({ specHandlers: 'someSpecHandler2' }, [
              ['Visible_ParentWasSKIP_ENDed1'],
              ['Visible_ParentWasSKIP_ENDed2'],
              BREAKS,
              ['SKipped_cause_it_Breaks1'],
              SKIP_END, // SKIP_END can't eliminate BREAKS! @todo: should throw?
              ['SKipped_cause_it_Breaks2'],
              ['SKipped_cause_it_Breaks3'],

              BREAKS_END,
              ['Visible_I_was_BREAK_ENDed1'],
            ]),
          ])
        ).generateSpecs(),
      resultSpecFromTitles({
        defaultSpecHandler: [
          'Visible_NOTskippedYet',
          'Visible_UnskippedCauseLocalSuiteSKIP_END1',
          'Visible_UnskippedCauseLocalSuiteSKIP_END2',
          'Visible_wasSKIP_ENDed',
        ],
        someSpecHandler2: [
          'Visible_ParentWasSKIP_ENDed1',
          'Visible_ParentWasSKIP_ENDed2',
          'Visible_I_was_BREAK_ENDed1',
        ],
      }),
    ],
  ]
)
