import * as _ from 'lodash'
import { Suite, GenerateSpecsOptions } from '../../code/Suite'

import {
  BREAKS,
  COLUMNS,
  EACH,
  EOnliesPriorities,
  ESkipiesPriorities,
  ONLY,
  ONLY_ABOVE,
  SKIP,
  SKIP_ABOVE,
  SUITE,
  SuiteCmd,
  SKIP_END,
  SKIP_MUTE,
  BREAKS_END,
} from '../../code/types'
import { genericTestHandler } from '../test-utils/genericTestHandler'

// NOTE: SpecZen SUITEs are NOT tested with SpecZen SUITEs! I wish I could eat my own dog-food here!
// Just a list of SUITEs (SUITE() returns a SuiteCmd!

function secondSpecHandlerFunction() {} // dummy function to test specHandlers as inline functions

// Filters in SUITE() args
const expectedSuiteWithFilterArg = {
  suiteArray: [
    {
      specData: {
        descr: 'SpecParam',
        num: 12,
      },
      filter: null,
      __kind: 'Spec',
    },
  ],
  specHandlers: ['firstSpecHandler', 'secondSpecHandler'],
  title: 'firstSpecHandler|secondSpecHandler',
  columnsCmd: {
    columnsNames: ['descr', 'num'],
    __kind: 'ColumnsCmd',
  },
  filter: {
    priority: 6,
    __kind: 'Skipy',
  },
  filterEnd: null,
}
// if (false) {
genericTestHandler(`Suite.createConcreteSuiteFromSUITE: general`, {}, [
  [
    `title: as string 1st arg, before Suite Array - only in nested SUITE()`,
    () =>
      // We can only do it in sub-suite, cause Top Level Suite needs specHandlers
      new Suite(
        SUITE({ specHandlers: ' firstSpecHandler |secondSpecHandler ' }, [
          COLUMNS('descr', 'num'),
          ['SpecParam', 12],
          SUITE(
            '________nested_SUITE_Title______', // <=== here's the test
            [['SpecParam', 12]]
          ),
        ])
      ),
    (() => {
      const nestedSuite = {
        ...expectedSuiteWithFilterArg,
        title: '________nested_SUITE_Title______',
        filter: null,
      }

      return {
        ...expectedSuiteWithFilterArg,
        suiteArray: [...expectedSuiteWithFilterArg.suiteArray, nestedSuite],
        filter: null,
      }
    })(),
  ],

  // SUITE: Filters in SUITEargs (not SUITEArray)
  // A filter can be the in suiteArgs of SUITE(...suiteArgs) call (outside the SUITEarray)
  // either as 1st before all other args, or after title or after options (always before SUITEarray).
  //
  // In all cases, it appears as filter/filterEnd prop of Suite, not in suiteArray`,

  // Filter as first arg

  // Filter As first arg, before options
  [
    `Function literal SKIP, as first arg of SUITE(), before all other args`,
    () =>
      new Suite(
        SUITE(SKIP, { specHandlers: ' firstSpecHandler |secondSpecHandler ' }, [
          COLUMNS('descr', 'num'),
          ['SpecParam', 12],
        ])
      ),
    expectedSuiteWithFilterArg,
  ],
  [
    `Function call SKIP(), as first arg of SUITE(), before all other args`,
    () =>
      new Suite(
        SUITE(
          SKIP({ reason: 'someSkipReason' }),
          { specHandlers: 'firstSpecHandler | secondSpecHandler' },
          [COLUMNS('descr', 'num'), ['SpecParam', 12]]
        )
      ),
    {
      ...expectedSuiteWithFilterArg,
      filter: {
        ...expectedSuiteWithFilterArg.filter,
        reason: 'someSkipReason',
      },
    },
  ],

  // Filter as first arg, before title
  // SUITE: Title
  [
    `Filter as 1st arg, before title as 2st arg - only in nested SUITE()`,
    () =>
      // We can only do it in sub-suite, cause Top Level Suite needs specHandlers
      new Suite(
        SUITE(SKIP, { specHandlers: ' firstSpecHandler |secondSpecHandler ' }, [
          COLUMNS('descr', 'num'),
          ['SpecParam', 12],
          SUITE(
            SKIP({ reason: 'someSkipReason' }), // <=== here's the test
            '________nested_SUITE_Title______',
            [['SpecParam', 12]]
          ),
        ])
      ),
    (() => {
      const nestedSuite = {
        ...expectedSuiteWithFilterArg,
        title: '________nested_SUITE_Title______',
        filter: {
          reason: 'someSkipReason',
        },
      }

      return {
        ...expectedSuiteWithFilterArg,
        suiteArray: [...expectedSuiteWithFilterArg.suiteArray, nestedSuite],
      }
    })(),
  ],

  [
    `A FilterEnd can be the first arg of SUITE(), before all other args`,
    () =>
      new Suite(
        SUITE(
          SKIP_END({ reason: 'someSkipEndReason' }),
          { specHandlers: ['firstSpecHandler', 'secondSpecHandler'] },
          [COLUMNS('descr', 'num'), ['SpecParam', 12]]
        )
      ),
    {
      ...expectedSuiteWithFilterArg,
      filter: null,
      filterEnd: {
        ...expectedSuiteWithFilterArg.filter,
        __kind: 'SkipyEnd',
        reason: 'someSkipEndReason',
      },
    },
  ],

  // FilterIgnore
  [
    `A FilterIgnore can be the first arg of SUITE(), before all other args.
     Also specHandler can be inlined function
    `,
    () =>
      new Suite(
        SUITE(
          SKIP_MUTE('someSkipMuteReason'),
          { specHandlers: ['firstSpecHandler', secondSpecHandlerFunction] },
          [COLUMNS('descr', 'num'), ['SpecParam', 12]]
        )
      ),
    {
      ...expectedSuiteWithFilterArg,
      filter: null,
      filterEnd: null,
      filterIgnore: {
        ...expectedSuiteWithFilterArg.filter,
        __kind: 'SkipyMute',
        reason: 'someSkipMuteReason',
      },
      title: 'firstSpecHandler|secondSpecHandlerFunction',
      specHandlers: ['firstSpecHandler', secondSpecHandlerFunction],
    },
  ],

  // SUITE: Filter as 2nd arg of SUITE(), between Options / title & SUITEArray.
  [
    `Filter as second, after options`,
    () =>
      new Suite(
        SUITE(
          { specHandlers: 'firstSpecHandler | secondSpecHandler' },
          SKIP({ reason: 'someSkipReason' }), // <=== here's the test
          [COLUMNS('descr', 'num'), ['SpecParam', 12]]
        )
      ),
    {
      ...expectedSuiteWithFilterArg,
      filter: {
        ...expectedSuiteWithFilterArg.filter,
        reason: 'someSkipReason',
      },
    },
  ],

  [
    `Filter as second, after options - only in nested SUITE()`,
    () =>
      // We can only do it in sub-suite, cause Top Level Suite needs specHandlers
      new Suite(
        SUITE({ specHandlers: ' firstSpecHandler |secondSpecHandler ' }, [
          COLUMNS('descr', 'num'),
          ['SpecParam', 12],
          SUITE(
            '________nested_SUITE_Title______',
            SKIP('reason is simple: SpecZen rules'), // <=== here's the test
            [['SpecParam', 12]]
          ),
        ])
      ),
    (() => {
      const nestedSuite = {
        ...expectedSuiteWithFilterArg,
        title: '________nested_SUITE_Title______',
        filter: {
          __kind: 'Skipy',
          reason: 'reason is simple: SpecZen rules',
          priority: 6,
          priorityName: 'SKIP',
        },
      }

      return {
        ...expectedSuiteWithFilterArg,
        suiteArray: [...expectedSuiteWithFilterArg.suiteArray, nestedSuite],
        filter: null,
      }
    })(),
  ],
])

genericTestHandler(
  `Suite.createConcreteSuiteFromSUITE: with specHandlers `,
  {},
  [
    [
      'Suite with specHandlers & title in Options, COLUMNS in SUITEargs',
      () =>
        new Suite(
          SUITE({ specHandlers: 'someSpecHandler', title: 'Suite Title' }, [
            COLUMNS('descr', 'num'),
            ['readSpec1', 1],
          ])
        ),
      {
        __kind: 'Suite',
        parentSuite: null,

        suiteArray: [
          {
            specData: {
              num: 1,
              descr: 'readSpec1',
            },
            filter: null,
            __kind: 'Spec',
          },
        ],
        title: 'Suite Title',
        specHandlers: ['someSpecHandler'],
        columnsCmd: { columnsNames: ['descr', 'num'], __kind: 'ColumnsCmd' },
        group: undefined,
      },
    ],
    [
      'Suite with columns & specHandlers as string[] in Options, along with specDataTransformer & result & expected Transform',
      () =>
        new Suite(
          SUITE(
            {
              title: 'Suite Title',
              columns: ['descr', 'num'],
              specHandlers: ['someSpecHandler'],
              // resultTransform: _.identity,
              // expectedTransform: _.identity,
              specDataTransformer: { foo: 'bar' },
            },
            [['readSpec1', 1]]
          )
        ),
      {
        __kind: 'Suite',
        specHandlers: ['someSpecHandler'],
        specDataTransformer: { foo: 'bar' },
        // resultTransform: _.identity,
        // expectedTransform: _.identity,
        title: 'Suite Title',
        columnsCmd: { columnsNames: ['descr', 'num'] },
        suiteArray: [
          {
            specData: { descr: 'readSpec1', num: 1 },
            filter: null,
            __kind: 'Spec',
          },
        ],
      },
    ],
    [
      'Suite with name, title & Column in 2nd ROW',
      () =>
        new Suite(
          SUITE(
            {
              specHandlers: ['someSpecHandler2'],
              title: 'Suite Title 2',
            },
            [SKIP, COLUMNS('descr', 'number'), ['readSpec1', 1]] // ONLY_ABOVE removed cause NOT IMPLEMENTED
          )
        ),
      {
        __kind: 'Suite',
        specHandlers: ['someSpecHandler2'],
        title: 'Suite Title 2',
        columnsCmd: { columnsNames: ['descr', 'number'] },
        suiteArray: [
          {
            __kind: 'Skipy',
            priority: ESkipiesPriorities.SKIP,
          },
          {
            specData: {
              number: 1,
              descr: 'readSpec1',
            },
            filter: null,
            __kind: 'Spec',
          },
          // THROWS NOT IMPLEMENTED
          // {
          //   __kind: 'OnlieAbove',
          //   priority: EOnliesPriorities.ONLY,
          // },
        ],
      },
    ],

    // THROW - WRONG ONES
    [
      'Throw: no COLUMNS() - Typings cant fail, cause nested SUITEs inherit and dont need columns',
      () =>
        new Suite(
          SUITE(
            {
              specHandlers: 'someSpecHandler3',
            },
            [['readSpec1', 1]]
          )
        ),
      `COLUMNS(...columnNames) OR {columns: ['column', 'names']} is mandatory on Top Level SUITE that contains Specs. COLUMNS must be first item or 2nd item after Filter in the SUITEarray.
suiteCmd = {
  'specHandlers':[
    'someSpecHandler3'
  ],`,
    ],
    [
      'Throw: COLUMNS() in wrong place: not 1st or 2nd row after Filter (Typings fail, for JS users)',
      () =>
        new Suite(
          SUITE(
            {
              specHandlers: 'someSpecHandler3',
              title: 'Suite Title 3',
            },
            [
              ['readSpec1', 1],
              COLUMNS('descr', 'num'),
              ['readSpec2', 2],
              ['readSpec3', 3],
            ] as any
          )
        ),
      `SpecZen: Suite::suiteCmdToConcrete: Columns found but not in first 2 rows`,
    ],
    [
      'Throw: we have Columns both in SUITEOptions & COLUMNS in SUITE, and they might conflict',
      () =>
        new Suite(
          SUITE(
            { specHandlers: ['someSpecHandler'], columns: ['descr1', 'num1'] },
            [COLUMNS('descr2', 'num2'), ['readSpec1', 1]]
          )
        ),
      `SpecZen: Suite::suiteCmdToConcrete: both columns in SUITEOptions & COLUMNS() in SUITE() found, remove one cause they conflict!
suiteCmd.columns = [
  'descr1',
  'num1'
]
suiteCmd.columnsCmd = {
  'columnsNames':[
    'descr2',
    'num2'
  ],
  '__kind':'ColumnsCmd'
}`,
    ],
    [
      'Throw: XXX_ABOVE SUITEargs, (Typings fail, for JS users)',
      () =>
        new Suite(
          SUITE(
            SKIP_ABOVE as any, // @todo: should need a ts-expect-error
            { specHandlers: ['someSpecHandler'], columns: ['title1', 'num1'] },
            [['readSpec1', 1]]
          )
        ),
      `SpecZen: FilterAbove commands like ONLY_ABOVE() are not allowed in SUITE(...args), but only in SUITE array, ie. SUITE([ ['spec'], ...,  ONLY_ABOVE(), ....  ])`,
    ],

    [
      'Throw: wrong signature of SUITEargs, (Typings fail, for JS users)',
      () =>
        new Suite(
          SUITE(
            'aHandlerInWrongPlace',
            SKIP,
            { specHandlers: 'SomeSpecHandler' },
            // @ts-expect-error
            [COLUMNS('descr', 'num'), ['readSpec1', 1]]
          )
        ),
      `SpecZen: Suite::suiteCmdToConcrete: suiteCmd.suiteArray is not an array!`,
    ],

    // *** SpecHandlers ***

    // specHandlers is mandatory with Specs, unless we inherit one
    [
      'SpecHandler(s) not mandatory, if we have no Specs',
      () =>
        new Suite(SUITE({ title: 'Suite Title' }, [COLUMNS('descr', 'num')])),
      {
        parentSuite: null,
        __kind: 'Suite',
        suiteArray: [],
        specHandlers: null,
        specDataTransformer: undefined,
        title: 'Suite Title',
        group: undefined,
        columnsCmd: {
          columnsNames: ['descr', 'num'],
          __kind: 'ColumnsCmd',
        },
        filter: null,
        filterEnd: null,
        filterIgnore: null,
      },
    ],
    [
      'Throw: SpecHandler(s) is mandatory, but missing in Suite & its parents',
      () =>
        new Suite(
          SUITE({ title: 'Suite Title' }, [
            COLUMNS('descr', 'num'),
            ['readSpec1', 1],
          ])
        ),
      `SpecZen: Suite::suiteCmdToConcrete: SpecHandlers is mandatory for SUITE that contains Specs, but missing in SUITE & its parents`,
    ],
    [
      'Throw: SpecHandler(s) are invalid - not string nor function',
      () =>
        new Suite(
          // @ts-expect-error
          SUITE({ title: 'Suite Title', specHandlers: [/notASpecHandler/] }, [
            COLUMNS('descr', 'num'),
            ['readSpec1', 1],
          ])
        ),
      `SpecZen: SUITE() called with invalid specHandlers[0]: /notASpecHandler/`,
    ],

    // *** specHandlers & columnsCmd are inherited from Parent Suite ***
    [
      'SpecHandlers & Columns are inherited from Parent Suite, and overridden!',
      () =>
        new Suite(
          SUITE(
            { title: 'Top Level Suite', specHandlers: 'TopLevelSpecHandler' },
            [
              COLUMNS('descr', 'optionalNum?'),
              ['root suite readSpec1', 1],

              // has no specHandlers nor columns, inherits em from parent
              SUITE({ title: 'Nested Suite 1, inheriting from parent' }, [
                // num is missing here, but we allow it cause `num?` is optional
                ['Nested Suite 1 Spec omitting 2nd param'],
                SUITE(
                  {
                    title: 'Nested Suite 2, overriding Columns & SpecHandlers!',
                    specHandlers: ['OverwrittenSpecHandler'],
                    columns: [
                      'overwrittenColumnName1',
                      'overwrittenColumnName2',
                    ],
                  },
                  [['Nested Suite 2 Spec', 13]]
                ),
              ]),
            ]
          )
        ),
      (() => {
        const nestedSuite2 = {
          title: 'Nested Suite 2, overriding Columns & SpecHandlers!',
          fullTitle:
            'Top Level Suite > Nested Suite 1, inheriting from parent > Nested Suite 2, overriding Columns & SpecHandlers!',
          specHandlers: ['OverwrittenSpecHandler'],
          columnsCmd: {
            columnsNames: ['overwrittenColumnName1', 'overwrittenColumnName2'],
            __kind: 'ColumnsCmd',
          },
          __kind: 'Suite',
          parentSuite: {}, // @todo: can't check its real one here
          suiteArray: [
            {
              specData: {
                overwrittenColumnName2: 13,
                overwrittenColumnName1: 'Nested Suite 2 Spec',
              },
              filter: null,
              __kind: 'Spec',
            },
          ],
          group: undefined,
        }

        const nestedSuite1 = {
          specHandlers: ['TopLevelSpecHandler'],
          fullTitle: 'Top Level Suite > Nested Suite 1, inheriting from parent',
          title: 'Nested Suite 1, inheriting from parent',
          columnsCmd: {
            columnsNames: ['descr', 'optionalNum?'],
            __kind: 'ColumnsCmd',
          },
          group: undefined,
          __kind: 'Suite',
          parentSuite: {}, // @todo: can't check its real one here
          suiteArray: [
            {
              specData: {
                descr: 'Nested Suite 1 Spec omitting 2nd param',
                // optionalNum: undefined, // @todo(171): test prop NOT be here as undefined, cause it's missing!
              },
              filter: null,
              __kind: 'Spec',
            },
            nestedSuite2,
          ],
        }

        const parentSuite = {
          fullTitle: 'Top Level Suite',
          title: 'Top Level Suite',
          specHandlers: ['TopLevelSpecHandler'],
          columnsCmd: {
            columnsNames: ['descr', 'optionalNum?'],
            __kind: 'ColumnsCmd',
          },
          group: undefined,
          __kind: 'Suite',
          parentSuite: null,
          suiteArray: [
            {
              specData: {
                optionalNum: 1,
                descr: 'root suite readSpec1',
              },
              filter: null,
              __kind: 'Spec',
            },
            nestedSuite1,
          ],
        }

        // @todo: need to check manually in another test: RangeError: Maximum call stack size exceeded,
        // nestedSuite1.parentSuite = parentSuite
        // nestedSuite2.parentSuite = nestedSuite1

        return parentSuite
      })(),
    ],

    // Specs: deal with Filters
    [
      `Handle Spec, create new Spec, with Filter added to it & removed from specData`,
      () =>
        new Suite(
          SUITE(
            { specHandlers: ['someSpecHandler'], columns: ['title2', 'num2'] },
            [
              ['readSpec1', 1],
              [SKIP, 'readSpec2', 1],
              [ONLY, 'readSpec3', 1],
            ]
          )
        ),
      {
        title: 'someSpecHandler',
        specHandlers: ['someSpecHandler'],
        columnsCmd: { columnsNames: ['title2', 'num2'], __kind: 'ColumnsCmd' },
        group: undefined,
        parentSuite: null,
        __kind: 'Suite',
        suiteArray: [
          {
            specData: { title2: 'readSpec1', num2: 1 },
            filter: null,
            __kind: 'Spec',
          },
          {
            specData: { title2: 'readSpec2', num2: 1 },
            filter: { priority: 6, __kind: 'Skipy' },
            __kind: 'Spec',
          },
          {
            specData: { title2: 'readSpec3', num2: 1 },
            filter: { priority: 3, __kind: 'Onlie' },
            __kind: 'Spec',
          },
        ],
      },
    ],

    [
      `Throw if Filter exist at wrong place in Spec (Typings fail, for JS users)`,
      () =>
        new Suite(
          SUITE(
            { specHandlers: 'someSpecHandler', columns: ['title2', 'num2'] },
            [['readSpec2', SKIP, 1]] as any
          )
        ),
      `SpecZen: Suite::suiteCmdToConcrete: Filter (ie SKIP/ONLY) found in wrong place, only first item in Spec can be a Filter`,
    ],
    [
      `Throw if FilterEnd exist at wrong place in Spec (Typings fail, for JS users)`,
      () =>
        new Suite(
          SUITE(
            { specHandlers: 'someSpecHandler', columns: ['title2', 'num2'] },
            [['readSpec2', SKIP_END, 1]] as any
          )
        ),
      `SpecZen: Suite::suiteCmdToConcrete: FilterEnd (ie SKIP_END/ONLY_END) found in wrong place, only first item in Spec can be a Filter`,
    ],
    [
      `Throw if FiltersAbove exist anywhere in Spec (Typings fail, for JS users)`,
      () =>
        new Suite(
          SUITE(
            { specHandlers: 'someSpecHandler', columns: ['title2', 'num2'] },
            [[SKIP_ABOVE, 'readSpec2', 1]] as any
          )
        ),
      `SpecZen: Suite::suiteCmdToConcrete: FilterAbove (eg ONLY_ABOVE / SKIP_ABOVE) found in in Spec`,
    ],
    [
      `Throw if FiltersAbove as 1st item in SUITE array (Typings DONT fail)`,
      () =>
        new Suite(
          SUITE({ specHandlers: 'someSpecHandler', columns: ['title'] }, [
            ONLY_ABOVE,
            ['no XXX_ABOVE as 1st SUITEarg'],
          ])
        ),
      `SpecZen: Suite::suiteCmdToConcrete: FilterAbove found as 1st item in SUITE array, but it should be after a Spec!`,
    ],
  ]
)

genericTestHandler(
  `Suite.createConcreteSuiteFromSUITE: Converting SpecArray to SpecObject`,
  {},
  [
    // Optional TestData arguments
    [
      'OPTIONAL param has correct name, removed ?',
      () =>
        new Suite(
          SUITE(
            { title: 'Top Level Suite', specHandlers: 'TopLevelSpecHandler' },
            [COLUMNS('title', 'optionalNum?'), ['Not missing param', 675]]
          )
        ),
      {
        __kind: 'Suite',
        title: 'Top Level Suite',
        columnsCmd: {
          __kind: 'ColumnsCmd',
          columnsNames: ['title', 'optionalNum?'],
        },
        suiteArray: [
          {
            __kind: 'Spec',
            filter: null,
            specData: {
              title: 'Not missing param',
              optionalNum: 675,
            },
          },
        ],
        group: undefined,
        specHandlers: ['TopLevelSpecHandler'],
        parentSuite: null,
      },
    ],

    [
      'Doesnt Throw if OPTIONAL param missing',
      () =>
        new Suite(
          SUITE(
            { title: 'Top Level Suite', specHandlers: 'TopLevelSpecHandler' },
            [
              COLUMNS('title', 'optionalNum?'),
              ['NOT missing optionalNum param, its OK'],
            ]
          )
        ),
      // /*
      {
        __kind: 'Suite',
        columnsCmd: {
          __kind: 'ColumnsCmd',
          columnsNames: ['title', 'optionalNum?'],
        },
        suiteArray: [
          {
            __kind: 'Spec',
            filter: null,
            specData: {
              title: 'NOT missing optionalNum param, its OK',
            },
          },
        ],
        group: undefined,
        specHandlers: ['TopLevelSpecHandler'],
        title: 'Top Level Suite',
        parentSuite: null,
      },
    ],
    [
      'Throw: NON OPTIONAL param missing',
      () =>
        new Suite(
          SUITE(
            { title: 'Top Level Suite', specHandlers: 'TopLevelSpecHandler' },
            [
              COLUMNS('title', 'NonOptionalParam'),
              ['NonOptionalParam is missing!'],
            ]
          )
        ),
      `SpecZen: Suite::suiteCmdToConcrete: Missing specData for column "NonOptionalParam". Suite title: "Top Level Suite" fullTitle: "Top Level Suite" specData: "[\n  'NonOptionalParam is missing!'\n]"`,
    ],
    [
      'Throw: Spec params are more than columns names',
      () =>
        new Suite(
          SUITE(
            { title: 'Top Level Suite', specHandlers: 'TopLevelSpecHandler' },
            [
              COLUMNS('title', 'anotherParam'),
              ['titleValue', 'anotherParamValue', 'extraneousParam'],
            ]
          )
        ),
      `SpecZen: Suite::handleSpec: Too many SpecData params for columns: [  'title',  'anotherParam'] specData: [  'titleValue',  'anotherParamValue',  'extraneousParam']. Suite title: 'Top Level Suite'`,
    ],
  ]
)

genericTestHandler(
  `Suite.createConcreteSuiteFromSUITE EACH_root_of_SpecArrayData - Processing`,
  {},
  [
    // Sanity checks
    [
      'Throw: an any EACH in root arg is not an Array of user param values',
      () =>
        new Suite(
          SUITE({ specHandlers: 'ReadDocument' }, [
            COLUMNS('@title', 'user', 'documentId', 'statusAndErrors'),
            [
              'Each is used with a non-array arg',
              // @todo(232): @ts-expect-error
              EACH(['simpleEmployee'], 'NOT VALID ARG'),
              { id: 999 },
              ['HttpStatus.FORBIDDEN', `ApiZen: FORBIDDEN (403)`],
            ],
          ])
        ),
      `SpecZen: Error: EACH() called in Spec's root, with a non-array arg. Each arg in root Spec's EACH(...args) must be an array, of Spec parameters that will be added to the Spec params, potentially pushing other params defined in Columns towards the end!
Offending each argument: NOT VALID ARG
EachTestArguments = [
  [
    'simpleEmployee'
  ],
  'NOT VALID ARG'
]`,
    ],
    [
      'Iterates over EACH params, with a single EACH',
      () =>
        new Suite(
          SUITE({ specHandlers: 'ReadDocument' }, [
            COLUMNS('@title', 'user', 'documentId', 'statusAndErrors'),
            [
              'Throws FORBIDDEN if user $user has no permissions to read document $documentId',
              EACH(['simpleEmployee'], ['managerEmployee']), // test all users we care about
              { id: 999 },
              ['HttpStatus.FORBIDDEN', `ApiZen: FORBIDDEN (403)`],
            ],
          ])
        ),
      {
        suiteArray: [
          {
            specData: {
              '@title':
                'Throws FORBIDDEN if user $user has no permissions to read document $documentId',
              user: 'simpleEmployee',
              documentId: { id: 999 },
              statusAndErrors: [
                'HttpStatus.FORBIDDEN',
                'ApiZen: FORBIDDEN (403)',
              ],
            },
            filter: null,
            __kind: 'Spec',
          },
          {
            specData: {
              '@title':
                'Throws FORBIDDEN if user $user has no permissions to read document $documentId',
              user: 'managerEmployee',
              documentId: { id: 999 },
              statusAndErrors: [
                'HttpStatus.FORBIDDEN',
                'ApiZen: FORBIDDEN (403)',
              ],
            },
            filter: null,
            __kind: 'Spec',
          },
        ],
      },
    ],
    [
      'Iterates over EACH params, with a MULTIPLE EACH. Returns all possible permutations',
      () =>
        new Suite(
          SUITE({ specHandlers: 'ReadDocument' }, [
            COLUMNS(
              '@title',
              'user',
              'userRole',
              'documentId',
              'statusAndErrors'
            ),
            [
              'Throws FORBIDDEN if user $user has no permissions to read document $documentId',
              // Generate permutations for all users we care about.
              EACH(
                // 'simpleEmployee' & 'EMPLOYEE' correspond to 'user' & 'userRole' columns
                ['simpleEmployee', 'EMPLOYEE'],
                ['managerEmployee', 'MANAGER']
              ),
              EACH([{ id: 666 }], [{ id: 999 }]), // against all classified documents (i.e 2x2 tests)
              ['HttpStatus.FORBIDDEN', `ApiZen: FORBIDDEN (403)`],
            ],
          ])
        ),
      {
        suiteArray: [
          {
            specData: {
              '@title':
                'Throws FORBIDDEN if user $user has no permissions to read document $documentId',
              user: 'simpleEmployee',
              userRole: 'EMPLOYEE',
              documentId: { id: 666 },
              statusAndErrors: [
                'HttpStatus.FORBIDDEN',
                'ApiZen: FORBIDDEN (403)',
              ],
            },
          },
          {
            specData: {
              '@title':
                'Throws FORBIDDEN if user $user has no permissions to read document $documentId',
              user: 'simpleEmployee',
              userRole: 'EMPLOYEE',
              documentId: { id: 999 },
              statusAndErrors: [
                'HttpStatus.FORBIDDEN',
                'ApiZen: FORBIDDEN (403)',
              ],
            },
          },
          {
            specData: {
              '@title':
                'Throws FORBIDDEN if user $user has no permissions to read document $documentId',
              user: 'managerEmployee',
              userRole: 'MANAGER',
              documentId: { id: 666 },
              statusAndErrors: [
                'HttpStatus.FORBIDDEN',
                'ApiZen: FORBIDDEN (403)',
              ],
            },
          },
          {
            specData: {
              '@title':
                'Throws FORBIDDEN if user $user has no permissions to read document $documentId',
              user: 'managerEmployee',
              userRole: 'MANAGER',
              documentId: { id: 999 },
              statusAndErrors: [
                'HttpStatus.FORBIDDEN',
                'ApiZen: FORBIDDEN (403)',
              ],
            },
          },
        ],
      },
    ],
    [
      'EACH params can overlap with params, pushing them out',
      () =>
        new Suite(
          SUITE({ specHandlers: 'DRYNormalNumbers2' }, [
            COLUMNS(
              'name',
              'targetArguments',
              'expected',
              'discardedExpected?'
            ),
            [
              '2 normal nums - EVEN or ODD',
              EACH(
                // All of these have the default  "expected" = 2
                [[4, 2]],
                [[8, 4]],

                // These have their own expected, pushing the default "expected" forward to "discardedExpected" optional COLUMN
                [[9, 3], 3], // "expected" = 3, "discardedExpected" = 2
                [[27, 3], 9] // "expected" = 9, "discardedExpected" = 2
              ),
              2, // The default "expected". But the ODD numbers replace it with
              // their own "expected", pushing this to "discardedExpected" when they are expanded.
            ],
          ])
        ),
      {
        suiteArray: [
          {
            specData: {
              name: '2 normal nums - EVEN or ODD',
              targetArguments: [4, 2],
              expected: 2,
            },
          },
          {
            specData: {
              name: '2 normal nums - EVEN or ODD',
              targetArguments: [8, 4],
              expected: 2,
            },
          },
          {
            specData: {
              name: '2 normal nums - EVEN or ODD',
              targetArguments: [9, 3],
              expected: 3,
              discardedExpected: 2,
            },
          },
          {
            specData: {
              name: '2 normal nums - EVEN or ODD',
              targetArguments: [27, 3],
              expected: 9,
              discardedExpected: 2,
            },
          },
        ],
        columnsCmd: {
          columnsNames: [
            'name',
            'targetArguments',
            'expected',
            'discardedExpected?',
          ],
        },
      },
    ],
  ]
)

genericTestHandler(
  `Suite.createConcreteSuiteFromSUITE: EACH_root_of_SpecArrayData - Accepts Filters`,
  {},
  [
    [
      'EACH in root, accepts Filters & FilterEnds, inside EACH args root',
      () =>
        new Suite(
          SUITE({ specHandlers: 'someSpecHandler' }, [
            COLUMNS('a', 'b', 'c'),
            [1, EACH([2], SKIP(), [22], SKIP_END, [222]), 3],
          ])
        ),
      {
        columnsCmd: {
          columnsNames: ['a', 'b', 'c'],
        },
        suiteArray: [
          {
            __kind: 'Spec',
            filter: null,
            specData: {
              a: 1,
              b: 2,
              c: 3,
            },
          },

          {
            __kind: 'Spec',
            filter: {
              __kind: 'Skipy',
              priority: 6,
              priorityName: 'SKIP',
            },
            specData: {
              a: 1,
              b: 22,
              c: 3,
            },
          },

          {
            __kind: 'Spec',
            filter: {
              __kind: 'SkipyEnd',
              priority: 6,
              priorityName: 'SKIP',
            },
            specData: {
              a: 1,
              b: 222,
              c: 3,
            },
          },
        ],
      },
    ],
    [
      'EACH in root, accepts Filters & FilterEnds, as first Item of EACH Array arg of user params. Becomes part of Spec ;-)',
      () =>
        new Suite(
          SUITE({ specHandlers: 'someSpecHandler' }, [
            COLUMNS('a', 'b', 'c'),
            [1, EACH([2], [SKIP, 22], [SKIP_END, 222]), 3],
          ])
        ),
      {
        columnsCmd: {
          columnsNames: ['a', 'b', 'c'],
        },
        suiteArray: [
          {
            __kind: 'Spec',
            filter: null,
            specData: {
              a: 1,
              b: 2,
              c: 3,
            },
          },
          {
            __kind: 'Spec',
            filter: {
              __kind: 'Skipy',
              priority: 6,
              priorityName: 'SKIP',
            },
            specData: {
              a: 1,
              b: 22,
              c: 3,
            },
          },
          {
            __kind: 'Spec',
            filter: {
              __kind: 'SkipyEnd',
              priority: 6,
              priorityName: 'SKIP',
            },
            specData: {
              a: 1,
              b: 222,
              c: 3,
            },
          },
        ],
      },
    ],
    [
      'THROWS: EACH in root, Filters not 1st first Item of EACH Array arg of user params',
      () =>
        new Suite(
          SUITE({ specHandlers: 'someSpecHandler' }, [
            COLUMNS('a', 'b', 'c'),
            [1, EACH([2], [22, ONLY], [SKIP_END, 222]), 3],
          ])
        ),

      `SpecZen: Suite::suiteCmdToConcrete: user's specData Array contains a Filter or other Command - this is not allowed! Only a Filter is allowed, but only in 1st place, which is already treated!
Offending Command = (...args) => new Onlie(EOnliesPriorities.ONLY, args)
eachArgument = [
  22,
  (...args) => new Onlie(EOnliesPriorities.ONLY, args)
]`,
    ],
  ]
)

genericTestHandler(
  `Suite.createConcreteSuiteFromSUITE: EACH nested - Processing`,
  {},
  [
    [
      'EACH nested: can appear inside Objects & Arrays, and it will be expanded. Single EACH',
      () =>
        new Suite(
          SUITE({ specHandlers: 'DRYNormalNumbers2' }, [
            COLUMNS('user', 'document', 'expected'),
            [
              { id: EACH('forbiddenUserId1', 'forbiddenUserId2') },
              { id: 999, name: 'document999' },
              'HttpStatus.FORBIDDEN',
            ],
          ])
        ),
      {
        columnsCmd: {
          columnsNames: ['user', 'document', 'expected'],
        },
        suiteArray: [
          ..._.map(['forbiddenUserId1', 'forbiddenUserId2'], (id) => ({
            __kind: 'Spec',
            filter: null,
            specData: {
              document: {
                id: 999,
                name: 'document999',
              },
              expected: 'HttpStatus.FORBIDDEN',
              user: {
                id,
              },
            },
          })),
        ],
      },
    ],
    [
      'EACH nested: can appear inside Objects & Arrays, and it will be expanded. Multiple EACHes',
      () =>
        new Suite(
          SUITE({ specHandlers: 'DRYNormalNumbers2' }, [
            COLUMNS('user', 'document', 'expected'),
            [
              { id: EACH('forbiddenUserId1', 'forbiddenUserId2') },
              { id: EACH(666, 999) },
              'HttpStatus.FORBIDDEN',
            ],
          ])
        ),
      {
        columnsCmd: {
          columnsNames: ['user', 'document', 'expected'],
        },
        suiteArray: [
          ..._.flatMap(['forbiddenUserId1', 'forbiddenUserId2'], (userId) => {
            return _.map([666, 999], (documentId) => {
              return {
                __kind: 'Spec',
                filter: null,
                specData: {
                  document: {
                    id: documentId,
                  },
                  expected: 'HttpStatus.FORBIDDEN',
                  user: {
                    id: userId,
                  },
                },
              }
            })
          }),
        ],
      },
    ],
  ]
)
// }

genericTestHandler(
  `Suite.createConcreteSuiteFromSUITE: EACH nested - Filters accepted`,
  {},
  [
    [
      'EACH nested: a filter can appear inside nested EACH - single EACH',
      () =>
        new Suite(
          SUITE({ specHandlers: 'DRYNormalNumbers2' }, [
            COLUMNS('user', 'document', 'expected'),
            [
              {
                id: EACH(
                  'forbiddenUserId1',
                  'forbiddenUserId2',
                  SKIP,
                  'forbiddenUserId3',
                  SKIP_END
                ),
              },
              { id: 999, name: 'document999' },
              'HttpStatus.FORBIDDEN',
            ],
          ])
        ),
      {
        columnsCmd: {
          columnsNames: ['user', 'document', 'expected'],
        },
        suiteArray: [
          {
            __kind: 'Spec',
            filter: null,
            specData: {
              document: {
                id: 999,
                name: 'document999',
              },
              expected: 'HttpStatus.FORBIDDEN',
              user: {
                id: 'forbiddenUserId1',
              },
            },
          },
          {
            __kind: 'Spec',
            filter: null,
            specData: {
              document: {
                id: 999,
                name: 'document999',
              },
              expected: 'HttpStatus.FORBIDDEN',
              user: {
                id: 'forbiddenUserId2',
              },
            },
          },
          {
            __kind: 'Spec',
            filter: {
              __kind: 'Skipy',
              priority: 6,
              priorityName: 'SKIP',
            },
            specData: {
              document: {
                id: 999,
                name: 'document999',
              },
              expected: 'HttpStatus.FORBIDDEN',
              user: {
                id: 'forbiddenUserId3',
              },
            },
          },
        ],
      },
    ],
  ]
)
