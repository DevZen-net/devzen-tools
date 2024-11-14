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

// ***** ONLY (alone) *****
genericTestHandler('ONLY (alone)', {}, [
  [
    'A nested Specs with ONLY & 2 specHandlers, with { showSkipped: true } & full results:',
    () =>
      new Suite(
        SUITE(defaultSUITEOptions, [
          ['skippedCauseOfOnly1'],
          SUITE(
            { specHandlers: ['defaultSpecHandler', 'andAnotherSpecHandler'] },
            [
              ['Nested skippedCauseOfOnly1'],
              [ONLY, 'ONLY ME nested'],
              ['Nested skippedCauseOfOnly2'],
            ]
          ),
          ['skippedCauseOfOnly2'],
        ])
      ).generateSpecs({ showSkipped: true }),
    {
      inlineSpecHandlers: {},
      executableSpecsPerHandler: {
        defaultSpecHandler: [
          {
            isVisible: false,
            suiteFullTitle: defaultSUITEOptions.title,
            suiteTitle: defaultSUITEOptions.title,
            specData: {
              descr: 'skippedCauseOfOnly1',
            },
          },
          {
            isVisible: false,
            suiteFullTitle:
              'defaultSuiteTitle > defaultSpecHandler|andAnotherSpecHandler',
            suiteTitle: 'defaultSpecHandler|andAnotherSpecHandler',
            specData: {
              descr: 'Nested skippedCauseOfOnly1',
            },
          },
          {
            isVisible: true,
            suiteFullTitle:
              'defaultSuiteTitle > defaultSpecHandler|andAnotherSpecHandler',
            suiteTitle: 'defaultSpecHandler|andAnotherSpecHandler',
            specData: {
              descr: 'ONLY ME nested',
            },
          },
          {
            isVisible: false,
            suiteFullTitle:
              'defaultSuiteTitle > defaultSpecHandler|andAnotherSpecHandler',
            suiteTitle: 'defaultSpecHandler|andAnotherSpecHandler',
            specData: {
              descr: 'Nested skippedCauseOfOnly2',
            },
          },
          {
            isVisible: false,
            suiteFullTitle: defaultSUITEOptions.title,
            suiteTitle: defaultSUITEOptions.title,
            specData: {
              descr: 'skippedCauseOfOnly2',
            },
          },
        ],
        andAnotherSpecHandler: [
          {
            isVisible: false,
            suiteFullTitle:
              'defaultSuiteTitle > defaultSpecHandler|andAnotherSpecHandler',
            suiteTitle: 'defaultSpecHandler|andAnotherSpecHandler',
            specData: {
              descr: 'Nested skippedCauseOfOnly1',
            },
          },
          {
            isVisible: true,
            suiteFullTitle:
              'defaultSuiteTitle > defaultSpecHandler|andAnotherSpecHandler',
            suiteTitle: 'defaultSpecHandler|andAnotherSpecHandler',
            specData: {
              descr: 'ONLY ME nested',
            },
          },
          {
            isVisible: false,
            suiteFullTitle:
              'defaultSuiteTitle > defaultSpecHandler|andAnotherSpecHandler',
            suiteTitle: 'defaultSpecHandler|andAnotherSpecHandler',
            specData: {
              descr: 'Nested skippedCauseOfOnly2',
            },
          },
        ],
      },
    },
  ],
  [
    `ONLY in Spec is local to that test case, but is visible cause ONLY
    is the Onlie priority effective in the whole suite.

    A nested LOOK is ignored, cause it is lower priority than ONLY,
    but ONLY items are not
    `,
    () =>
      new Suite(
        SUITE(defaultSUITEOptions, [
          ['Skipped cause of ONLY below'],

          SUITE([
            ['Nested - skippedCauseOfOnlyBelow1'],
            [ONLY, 'Only Me 1'],
            ['Nested - skippedCauseOfOnlyAbove1'],
          ]),

          SUITE({ specHandlers: 'someSpecHandler2' }, [
            [
              LOOK,
              `Nested skippedCauseOfOnlyBelow,
                      although we have a LOOK onlie in Spec.
                      If this was FOCUS, it would steal the ONLY priority
                      and only it would be visible!`,
            ],
            LOOK,
            ['Skipped - skipped because LOOK is lower priority than ONLY'],

            ONLY,
            ['Visible cause of ONLY above 1'],
            ['Visible cause of ONLY above 2'],
          ]),

          ['Skipped cause of ONLY above'],
        ])
      ).generateSpecs(),
    resultSpecFromTitles({
      defaultSpecHandler: ['Only Me 1'],
      someSpecHandler2: [
        'Visible cause of ONLY above 1',
        'Visible cause of ONLY above 2',
      ],
    }),
  ],
  [
    'Nested SUITEs: with different specHandlers, and ONLYies in effect are picked, but lower LOOK priority are omitted',
    () =>
      new Suite(
        SUITE(defaultSUITEOptions, [
          ['skippedCauseOfOnly1'],
          [
            LOOK,
            'I have LOOK, I will NOT be included, cause ONLY is higher priority!',
          ],
          [ONLY, 'ONLY ME'],
          ['skippedCauseOfOnly2'],
          SUITE({ specHandlers: 'someSpecHandler2' }, [
            ['skippedCauseOfOnly11'],
            [ONLY, 'I have ONLY, I will be included'],
            [LOOK, 'I have LOOK, I will NOT be included'],
            ['skippedCauseOfOnly21'],
          ]),
        ])
      ).generateSpecs(),
    resultSpecFromTitles({
      defaultSpecHandler: ['ONLY ME'],
      someSpecHandler2: ['I have ONLY, I will be included'],
    }),
  ],
  [
    'Nested SUITEs: with different specHandlers, ' +
      'and only ME in effect are picked, but lower ONLY & FOCUS priorities are omitted',
    () =>
      new Suite(
        SUITE(defaultSUITEOptions, [
          ['skippedCauseOfOnly1'],
          [
            FOCUS,
            'I have FOCUS, I will NOT be included, cause ME is higher priority!',
          ],
          [ME, 'ONLY ME'],
          ['skippedCauseOfOnly2'],
          SUITE({ specHandlers: 'someSpecHandler2' }, [
            ['skippedCauseOfOnly11'],
            ME,
            [ONLY, 'I have ONLY, I will NOT be included, cause of ME above'],
            [
              'I have no priority, but ME above in effect, so I will be included',
            ],
          ]),
        ])
      ).generateSpecs(),
    resultSpecFromTitles({
      defaultSpecHandler: ['ONLY ME'],
      someSpecHandler2: [
        'I have no priority, but ME above in effect, so I will be included',
      ],
    }),
  ],
  [
    `ONLY in Nested SUITEs: ONLY applies in sequence,
     as it is read by humans, like a book with chapters, sub-chapters etc!
     Not like the Mocha/Jest nested mess!`,
    () =>
      new Suite(
        SUITE(defaultSUITEOptions, [
          ['skippedCauseOfONLYbelow'],
          ONLY,
          ['Visible_InFocus1'],
          ['Visible_InFocus2'],
          SUITE([['Visible_NestedInFocus1'], ['Visible_NestedInFocus2']]),
          ['Visible_InFocus3'],
          ['Visible_InFocus4'],
        ])
      ).generateSpecs(),
    resultSpecFromTitles({
      defaultSpecHandler: [
        'Visible_InFocus1',
        'Visible_InFocus2',
        'Visible_NestedInFocus1',
        'Visible_NestedInFocus2',
        'Visible_InFocus3',
        'Visible_InFocus4',
      ],
    }),
  ],
  [
    `ONLY in a nested SUITEargs: ONLY steals focus, only nested Suit visible`,
    () =>
      new Suite(
        SUITE(defaultSUITEOptions, [
          ['skippedCauseOfONLYbelowInNestedSuite'],
          SUITE(ONLY, [['Visible_NestedInFocus1'], ['Visible_NestedInFocus2']]),
          ['skippedCauseOfONLYAboveInNestedSuite'],
        ])
      ).generateSpecs(),
    resultSpecFromTitles({
      defaultSpecHandler: ['Visible_NestedInFocus1', 'Visible_NestedInFocus2'],
    }),
  ],
])
