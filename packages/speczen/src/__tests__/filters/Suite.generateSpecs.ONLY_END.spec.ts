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
  SOLO_END,
} from '../../code/types'
import { Suite } from '../../code/Suite'
import {
  defaultSUITEOptions,
  genericTestHandler,
  resultSpecFromTitles,
  titlesFromResultSpec,
} from '../test-utils/genericTestHandler'

// ****** ONLY_END ********
genericTestHandler(
  'ONLY_END',
  {
    resultAndExpectedPreprocess: titlesFromResultSpec,
  },
  [
    [
      `ONLY_END: when an ONLY exists, it makes all Specs that follow (within its scope) exclusive (in that priority).
     But when an ONLY_END comes, the following items in the Suite scope are no longer included in this exclusive group!

     Rule of thumb: ONLY_END ends the ONLY group, and stops the following from participating in it!
     `,
      () =>
        new Suite(
          SUITE(defaultSUITEOptions, [
            ['skipped cause ONLY exclusive group exists!'],

            ONLY, // exclusive group ONLY starts here
            ['visible1'],
            ONLY_END, // exclusive group ONLY ends here, and stops the following from participating in it!

            ['skipped cause ONLY exclusive group exists, not part of it!'],

            ONLY, // another exclusive group ONLY restarts here
            ['visible2'],

            SUITE([
              ['visible3'],

              ONLY_END,
              [
                'skipped cause ONLY_END for this nested suite, not part of the ONLY exclusive group',
              ],
            ]),
            ['visible4'], // ONLY exclusive group still in effect, cause no ONLY_END was in a nested Suite!

            ONLY_END,
            ['skipped cause ONLY exclusive group exists, not part of it!'],
          ])
        ).generateSpecs(),
      resultSpecFromTitles({
        defaultSpecHandler: ['visible1', 'visible2', 'visible3', 'visible4'],
      }),
    ],
    [
      `ONLY: in a Nested SUITE, makes the Specs within it exclusive.
     But it can gets ONLY_ENDed in parent SUITE, and following items are no longer excluded`,
      () =>
        new Suite(
          SUITE(defaultSUITEOptions, [
            [
              'skipped cause ONLY in nested SUITE below, Spec not in exclusive group',
            ],

            SUITE([
              ['skipped cause ONLY in below, this Spec not in exclusive group'],

              ONLY,
              ['Visible_NestedInONLYGroup'],
              ONLY_END,
              [
                'skipped cause ONLY_END above, this Spec not in exclusive group',
              ],
            ]),

            [
              'skipped cause of ONLY exclusive group in nested SUITE scope, not part of it!',
            ],

            ONLY,
            ['Visible_part_of_ONLY_exclusive_group'],
            ONLY_END,

            [
              'skipped cause of ONLY exclusive group in nested SUITE scope, not part of it!',
            ],

            ONLY_END, // @todo(933): should warn?, cause no matching ONLY in effect!
          ])
        ).generateSpecs(),
      resultSpecFromTitles({
        defaultSpecHandler: [
          'Visible_NestedInONLYGroup',
          'Visible_part_of_ONLY_exclusive_group',
        ],
      }),
    ],
    [
      `ONLY in parent SUIT applies to Nested SUITEs:
     Also ONLY applies in as-you-read sequence,
     until it gets ONLY_END, and thus stops ONLYing the remaining!`,
      () =>
        new Suite(
          SUITE(defaultSUITEOptions, [
            ['skipped cause ONLY in below, this Spec not in exclusive group'],

            ONLY, // ***** ONLY block starts here, in parent (and stops below)

            ['Visible_InFocus1'],
            ['Visible_InFocus2'],
            SUITE([['Visible_NestedInFocus1'], ['Visible_NestedInFocus2']]),
            ['Visible_InFocus3'],

            ONLY_END, // ***** ONLY block stops here (stops the above ONLY)

            SUITE([['Skipped because of ONLY_END above in parent SUITE']]),

            ['skippedCauseOfONLYBlockStopsAbove'],
          ])
        ).generateSpecs(),
      resultSpecFromTitles({
        defaultSpecHandler: [
          'Visible_InFocus1',
          'Visible_InFocus2',
          'Visible_NestedInFocus1',
          'Visible_NestedInFocus2',
          'Visible_InFocus3',
        ],
      }),
    ],
    [
      `ONLY_END: If there a FOCUS in effect, ONLY is ignored, in parent and nested SUITEs!`,
      () =>
        new Suite(
          SUITE(defaultSUITEOptions, [
            ['skippedCauseOfFOCUSbelow'],

            ONLY, // ***** ONLY is ignored, cause of FOCUS
            ['skippedCauseOfFOCUSbelow'],

            SUITE([
              ONLY, // ***** ONLY is ignored, cause of FOCUS
              ['skippedCauseOfFOCUSInParentSuite'], // ***** ONLY is ignored, cause of FOCUS in effect

              [FOCUS, 'Visible_NestedInFocus1'], // ***** FOCUS Spec is visible, ONLY is ignored
            ]),

            ['skippedCauseOfFOCUSabove'],

            FOCUS, // ***** FOCUS block starts here (and stops below)
            ['Visible_InFocus1'],
            ['Visible_InFocus2'],
            SUITE([['Visible_NestedInFocus1'], ['Visible_NestedInFocus2']]),

            SOLO_END, // SOLO can't end FOCUS, it is higher, it is IGNORED. Should warn?
            ['Visible_InFocus3'],

            FOCUS_END, // ***** FOCUS block stops here (stops the above FOCUS)
            ['skippedCauseOf FOCUS_END above'],

            [FOCUS, 'visibleInFocusSpec'], // The Spec doesnt care about FOCUS_END of the Suite, it is in FOCUS anyway

            ['still skippedCauseOf FOCUS_END above'],

            ONLY, // ***** ONLY block starts here, in parent (and stops below)
            ['skippedCauseOf of FOCUS in effect above, ONLY is not active'],

            [
              ONLY,
              'skippedCauseOf of FOCUS in effect above, ONLY is not active',
            ],
          ])
        ).generateSpecs(),
      resultSpecFromTitles({
        defaultSpecHandler: [
          'Visible_NestedInFocus1',
          'Visible_InFocus1',
          'Visible_InFocus2',
          'Visible_NestedInFocus1',
          'Visible_NestedInFocus2',
          'Visible_InFocus3',
          'visibleInFocusSpec',
        ],
      }),
    ],
  ]
)
