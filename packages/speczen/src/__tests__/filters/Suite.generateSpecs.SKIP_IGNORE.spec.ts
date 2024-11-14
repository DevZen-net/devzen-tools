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
  SKIP_MUTE,
} from '../../code/types'
import { Suite } from '../../code/Suite'
import {
  defaultSUITEOptions,
  genericTestHandler,
  resultSpecFromTitles,
  titlesFromResultSpec,
} from '../test-utils/genericTestHandler'

// ***** SKIP_MUTE *****
genericTestHandler(
  'SKIP_MUTE',
  { resultAndExpectedPreprocess: titlesFromResultSpec },
  [
    [
      `SKIP_MUTE: completely ignores any SKIP and higher (eg WIP), but not lower (eg NOPE), from this point forwards.

     No need to match an existing SKIP, it just ignores them when they appear, and subsequent SKIPs are ignored too.

     It's much more powerful than removing a SKIP or using SKIP_END.
     THE SKIP_END ends an incoming SKIP's effect, but doesnt stop SKIP from reappearing in this or nested SUITE.
     But SKIP_MUTE does, it completely ignores them from this point forwards, as if they didnt exist!

     It UNSKIPs everything, so be careful!

    A \`BREAKS_MUTE\` on the root SUITE is like \`$ rm -rf /\` on your system, it will break everything (but is just testing!)

    To understand SKIP_END, we need nested SUITs:

    SKIP_END does not necessarily match a previous direct SKIP, as it might have been in scope from a parent SUITE (like in JS, function in the scope of another function).

    Imagine a development scenario, where we SKIP the whole of "API V2 read" Suite, cause we're working on it.

    There are sub-SUITEs in there that completely BREAKS.
    Also other's we dont care, cause we've fixed or are irrelevant, so NOPE, we dont want to run them.

    When we issue our SKIP_END (for example we think we're fixed some code), only the sub-SUITES in SKIP level will be un-skipped. But not the NOPE & BREAKS ones!
   `,
      () =>
        new Suite(
          SUITE(
            SKIP({ reason: 'Working on "read" tests for API V2' }),
            { title: 'API', ...defaultSUITEOptions },
            [
              SKIP,
              ['Skipped cause of SKIP, and SKIP_MUTE not in effect yey'],

              SUITE([
                SKIP,
                [
                  'Skipped cause of SKIP in effect, and SKIP_MUTE not in effect yey',
                ],
              ]),

              SKIP_MUTE, // <==== Start ignoring all SKIPs & higher levels, and make those Specs visible!

              SKIP, // has no effect
              ['visible1'],

              [SKIP, 'visible2'],

              SUITE(SKIP, { title: 'read' }, [
                ['visible3'],

                // SKIP_MUTE can't eliminate skipping (i.e make Visible) the NOPE (or IGNORE, BREAKS etc.) below:
                SUITE(NOPE({ reason: 'Fixed and working, silence it!' }), [
                  [
                    'Skipped cause_it_is NOPE, lower than SKIP_END, so has no effect',
                  ],
                ]),

                ['visible4'],

                SUITE([
                  BREAKS({ reason: 'This will not be fixed now!' }),
                  [
                    'Skipped cause_it_is BREAKS, much lower than SKIP_END, so has no effect!',
                  ],
                ]),

                ['visible5'],

                // This is what we're working on, a WIP "soft" skip, with higher priority than SKIP.
                // It is visible cause WIP > SKIP and SKIP_MUTE kills it also
                SUITE({ title: 'ValidateRecord' }, [
                  WIP({ reason: 'This is what I am working on!' }),
                  ['visible6'],
                ]),

                SUITE([
                  TODO({
                    reason:
                      'I will come back to this after I fix ValidateRecord!',
                  }),

                  ['visible7'],
                ]),

                ['visible8'],

                [
                  BREAKS,
                  'Skipped, cause BREAKS in effect, and SKIP_MUTE cant ignore it!',
                ],
              ]),
            ]
          )
        ).generateSpecs(),

      resultSpecFromTitles({
        defaultSpecHandler: [
          'visible1',
          'visible2',
          'visible3',
          'visible4',
          'visible5',
          'visible6',
          'visible7',
          'visible8',
        ],
      }),
    ],
    [
      `SKIP_MUTE: it can be 1st arg on SUITEargs, applies to whole SUITE
    `,
      () =>
        new Suite(
          SUITE(SKIP_MUTE, defaultSUITEOptions, [
            ['Visible_NOTskippedYet'],

            SKIP, // SKIP is ignored, cause of SKIP_MUTE
            ['VisibleCauseSKIPisIgnored'],

            SUITE([
              ['Visible_NestedCauseSKIPisIgnored1'],
              [NOPE, 'skipped cause of NOPE, lower than ignored SKIP'],
              [TODO, 'VisibleTodo'], // SKIP and higher are ignored, TODO is higher than SKIP
              SKIP,
              ['Visible_NestedCauseSKIPisIgnored'],
            ]),
          ])
        ).generateSpecs(),
      resultSpecFromTitles({
        defaultSpecHandler: [
          'Visible_NOTskippedYet',
          'VisibleCauseSKIPisIgnored',
          'Visible_NestedCauseSKIPisIgnored1',
          'VisibleTodo',
          'Visible_NestedCauseSKIPisIgnored',
        ],
        // someSpecHandler2: resultSpecFromTitles('Visible_ParentWasSKIP_ENDed1', 'Visible_ParentWasSKIP_ENDed2'),
      }),
    ],
    [
      `SKIP_MUTE & SKIP_END: Cannot SKIP_END a higher level SKIP (eg BREAKS), that is in effect`,
      () =>
        new Suite(
          SUITE(SKIP_MUTE, defaultSUITEOptions, [
            ['visible1'],

            SKIP,
            ['visible2'], // cause SKIP is ignored
            [SKIP, 'visible3'], // cause SKIP is ignored

            SUITE(SKIP, [['visible4']]), // cause SKIP is ignored

            SUITE([SKIP, ['visible5']]), // cause SKIP is ignored

            SUITE([SKIP, [TODO, 'visible6']]), // cause SKIP is ignored & TODO is higher than SKIP

            BREAKS({ reason: `What's below is broken` }),
            ['Skipped cause of BREAK'],

            SKIP_END,
            [
              'Still skipped, cause BREAKS should still in effect, SKIP_END cant end it!',
            ],

            BREAKS_END,
            ['visible7'], // visible as BREAK_ENDed

            SKIP,
            ['visible8'], // cause SKIP_MUTE is in effect

            [SKIP, 'visible9'], // cause SKIP is ignored

            [TODO, 'visible10'], // cause SKIP & higher are ignored
          ])
        ).generateSpecs(),
      resultSpecFromTitles({
        defaultSpecHandler: [
          'visible1',
          'visible2',
          'visible3',
          'visible4',
          'visible5',
          'visible6',
          'visible7',
          'visible8',
          'visible9',
          'visible10',
        ],
      }),
    ],
  ]
)
