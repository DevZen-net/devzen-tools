// ******** maxFilters ********
import { COLUMNS, EACH, ONLY, SKIP, SKIP_END } from '../../code/types'
import { Suite } from '../../code/Suite'
import { genericTestHandler } from '../test-utils/genericTestHandler'

genericTestHandler('Suite.handleEachRoot()', {}, [
  [
    'no EACH in root - returns same Spec',
    () => (Suite as any).handleEachRoot([1, 2, 3]),
    [[1, 2, 3]],
  ],
  [
    'THROWS: an EACH in root - wrong arguments, not array!',
    () =>
      (Suite as any).handleEachRoot([
        1,
        // @ts-ignore
        EACH([2], 666),
        3,
      ]),
    `SpecZen: Error: EACH() called in Spec's root, with a non-array arg. Each arg in root Spec's EACH(...args) must be an array, of Spec parameters that will be added to the Spec params, potentially pushing other params defined in Columns towards the end!
Offending each argument: 666
EachTestArguments = [
  [
    2
  ],
  666
]`,
  ],
  [
    'EACH in root - returns expanded Specs',
    () => (Suite as any).handleEachRoot([1, EACH([2], [22], [222]), 3]),
    [
      [1, 2, 3],
      [1, 22, 3],
      [1, 222, 3],
    ],
  ],
  [
    'Multiple EACH in root - returns ALL permutations as expanded Specs',
    () =>
      (Suite as any).handleEachRoot([
        1,
        EACH([2], [22], [222]),
        EACH([3], [33], [333]),
      ]),
    [
      [1, 2, 3],
      [1, 2, 33],
      [1, 2, 333],
      [1, 22, 3],
      [1, 22, 33],
      [1, 22, 333],
      [1, 222, 3],
      [1, 222, 33],
      [1, 222, 333],
    ],
  ],
  [
    'EACH with more than arguments, pushes Spec params in expanded arrays',
    () =>
      (Suite as any).handleEachRoot([
        1,
        EACH([2, '2'], [22, '22', 'X22'], [222, '222', 'X222', 'Y2222']),
        3,
      ]),
    [
      [1, 2, '2', 3],
      [1, 22, '22', 'X22', 3],
      [1, 222, '222', 'X222', 'Y2222', 3],
    ],
  ],

  // __SUITE: Filters inside EACH()
  [
    `Filters inside EACH() root: in EACH root args`,
    () =>
      (Suite as any).handleEachRoot([
        1,
        EACH([2], SKIP, [22], SKIP_END('reasons for SKIP_END'), [222]),
        3,
      ]),
    [
      [1, 2, 3],
      [SKIP(), 1, 22, 3],
      [SKIP_END('reasons for SKIP_END'), 1, 222, 3],
    ],
  ],
  [
    `Filters inside EACH() root: inside EACH root array arg (of repeated User data). Stays as is (as Filter instance), to be picked by handleSpec.`,
    () =>
      (Suite as any).handleEachRoot([
        1,
        EACH(
          [2],
          [SKIP, 22], // <=== Using the SKIP function literal
          [SKIP_END('reasons for SKIP_END'), 222]
        ),
        3,
      ]),
    [
      [1, 2, 3],
      [SKIP(), 1, 22, 3], // <== SKIP becomes a Skipy instance
      [SKIP_END('reasons for SKIP_END'), 1, 222, 3],
    ],
  ],
  [
    `Throws: filters inside EACH() root: inside EACH root array arg, not in 1st place!`,
    () =>
      (Suite as any).handleEachRoot([
        1,
        EACH(
          [2],
          [
            22,
            // @ts-ignore
            COLUMNS('aa'),
          ], // <=== COLUMNS in wrong place! We check for SKIP in Suite.createConcreteSuiteFromSUITE
          [SKIP_END('reasons for SKIP_END'), 222]
        ),
        3,
      ]),
    `SpecZen: Suite::suiteCmdToConcrete: user's specData Array contains a Filter or other Command - this is not allowed! Only a Filter is allowed, but only in 1st place, which is already treated!
Offending Command = {
  'columnsNames':[
    'aa'
  ],
  '__kind':'ColumnsCmd'
}
eachArgument = [
  22,
  {
    'columnsNames':[
      'aa'
    ],
    '__kind':'ColumnsCmd'
  }
]`,
  ],
])
