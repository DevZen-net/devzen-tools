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

genericTestHandler('ONLY (alone)', {}, [
  [
    'Nested Suites with their own specDataTransformer - with objects that merge or function that returns whatever:',
    () =>
      new Suite(
        SUITE(
          {
            title: 'Top Level Suite',
            specHandlers: 'defaultSpecHandler',
            columns: ['descr', 'specDataOptions'],
            specDataTransformer: {
              addedByTopLevelSuite: true,
              specDataOptions: {
                addedByTopLevelSuite: 'value addedByTopLevelSuite',
              },
            },
          },
          [
            [
              'topLevelItem0.1',
              {
                value: 'value for topLevelItem1',
              },
            ],
            SUITE(
              {
                title: 'Nested Suite 1',
                specDataTransformer: {
                  addedByNestedSuite: true,
                  specDataOptions: {
                    addedByNestedSuite: 'value addedByNestedSuite',
                  },
                },
              },
              [
                [
                  'NestedItem1.1',
                  {
                    value: 'value for NestedItem1.1',
                  },
                ],

                SUITE(
                  {
                    title: 'Nested Suite 2',
                    specDataTransformer: (specData) => {
                      return {
                        changedByNestedSuiteSpecDataTransformerFunction:
                          specData,
                      }
                    },
                  },
                  [
                    [
                      'NestedItem2.1',
                      {
                        value: 'value for NestedItem2.1',
                      },
                    ],
                  ]
                ),

                [
                  'NestedItem1.2',
                  {
                    value: 'value for NestedItem1.2',
                  },
                ],
              ]
            ),
            [
              'topLevelItem0.2',
              {
                value: 'value for topLevelItem0.2',
              },
            ],
          ]
        )
      ).generateSpecs({ showSkipped: true }),
    {
      executableSpecsPerHandler: {
        defaultSpecHandler: [
          {
            specData: {
              addedByTopLevelSuite: true,
              descr: 'topLevelItem0.1',
              specDataOptions: {
                value: 'value for topLevelItem1',
                addedByTopLevelSuite: 'value addedByTopLevelSuite',
              },
            },
            nestingLevel: 0,
          },
          {
            specData: {
              addedByNestedSuite: true,
              descr: 'NestedItem1.1',
              specDataOptions: {
                value: 'value for NestedItem1.1',
                addedByTopLevelSuite: 'value addedByTopLevelSuite',
                addedByNestedSuite: 'value addedByNestedSuite',
              },
            },
            nestingLevel: 1,
          },
          {
            specData: {
              changedByNestedSuiteSpecDataTransformerFunction: {
                addedByNestedSuite: true,
                descr: 'NestedItem2.1',
                specDataOptions: {
                  value: 'value for NestedItem2.1',
                  addedByTopLevelSuite: 'value addedByTopLevelSuite',
                  addedByNestedSuite: 'value addedByNestedSuite',
                },
              },
            },
            nestingLevel: 2,
          },
          {
            isVisible: true,
            specData: {
              addedByTopLevelSuite: true,
              addedByNestedSuite: true,
              descr: 'NestedItem1.2',
              specDataOptions: {
                value: 'value for NestedItem1.2',
                addedByTopLevelSuite: 'value addedByTopLevelSuite',
                addedByNestedSuite: 'value addedByNestedSuite',
              },
            },
            nestingLevel: 1,
          },
          {
            specData: {
              addedByTopLevelSuite: true,
              descr: 'topLevelItem0.2',
              specDataOptions: {
                value: 'value for topLevelItem0.2',
                addedByTopLevelSuite: 'value addedByTopLevelSuite',
              },
            },
            nestingLevel: 0,
          },
        ],
      },
      inlineSpecHandlers: {},
    },
  ],
])
