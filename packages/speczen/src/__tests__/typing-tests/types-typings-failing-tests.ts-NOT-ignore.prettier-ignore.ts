/**
 Failing Typing Tests
 ALL OF THEM NEED TO FAIL TYPING!

 These aren't executable tests, just type tests. Uncomment to inspect the failing typings visually!

 Workflow hack:

 In the typings-failing-tests test file, initially we used todos but switched to // @ts-expect-error!

 While developing types you replace it with a `// @DISABLED-ts-expect-error` since we want to examine the errors produced by our bad-example tests. Also, you can "disable" TS compilation errors via "ts-ignore", just rename your file to `typings-failing-tests.ts-ignore.prettier-ignore` to disable TypeScript errors you know exist and reduce noise on the terminal (you have the type errors in the IDE).

 When done (developing typings) you replace it back to `// @ts-expect-error`, the way it should be when you check it in.
 You also stick a NOT in "ts-NOT-ignore" & rename your file to `typings-failing-tests.ts-NOT-ignore.prettier-ignore` to get it back onto TS compilation errors ;-)

 If something breaks you will know. But if you want to investigate the errors you replace those back ;-)

 @see https://stackoverflow.com/questions/49296151/how-to-write-tests-for-typescript-typing-definition/58831534#58831534

 @todo(132): Check https://github.com/qurhub/qur-typetest && https://github.com/TypeStrong/ts-expect
 */

// @ts-nocheck-DISABLED

import {
  SUITE,
  BREAKS,
  COLUMNS,
  ONLY,
  SKIP,
  TSpec,
  T_SUITEArray,
  EACH,
  ONLY_ABOVE,
  SKIP_ABOVE,
} from '../../code/types'

// Commands

// @ts-expect-error
COLUMNS(['foo']) // <<< SHOULD FAIL: args is ...columnsNames: string[]
// @ts-expect-error
COLUMNS(1) // <<< SHOULD FAIL:  args is ...columnsNames: string[]

// Array cases

// Specs Failing - All lines SHOULD FAIL typing!
if (1 + 1 === 1) {
  const specs_failingTyping: TSpec[] = [
    // @ts-expect-error
    SKIP,
    // @ts-expect-error
    SKIP({ reason: 'Reasons...' }),
    // @ts-expect-error
    BREAKS,
    // @ts-expect-error
    ONLY,
    // @ts-expect-error
    ONLY({ reason: 'some reason' }),
    // @ts-expect-error
    COLUMNS,
    // @ts-expect-error
    'BLAH',
    // @ts-expect-error
    15,
    // @ts-expect-error
    [COLUMNS],
    // @ts-expect-error
    [COLUMNS('id', 'name')],
    // @ts-expect-error
    [COLUMNS, 3, 5],
    // @ts-expect-error
    [COLUMNS('id', 'name'), 3, 5],
    // @ts-expect-error
    [1, COLUMNS, 3],
    // @ts-expect-error
    [1, COLUMNS('id', 'name'), 5],
    // @ts-expect-error
    [1, 2, COLUMNS, 3],
    // @ts-expect-error
    [1, 2, COLUMNS('id', 'name'), 5],

    // FIlters not in 1st place
    // @ts-expect-error
    [1, ONLY, 3, 5],
    // @ts-expect-error
    [1, SKIP, 3, 5],
    // @ts-expect-error
    [1, ONLY(), 3, 5],
    // @ts-expect-error
    [1, ONLY({ reason: 'foo' }), 3, 5],
    // @ts-expect-error
    [1, SKIP(), 3, 5],
    // @ts-expect-error
    [1, SKIP({ reason: 'foo' }), 3, 5],

    // SUITE
    // @ts-expect-error
    [SUITE([]), 3],
    // @ts-expect-error
    [1, SUITE([])],
    // @ts-expect-error
    [1, 5, SUITE([])],

    // with SUITE
    // @ts-expect-error
    [SUITE([]), 3],
    // @ts-expect-error
    [1, SUITE([])],
    // @ts-expect-error
    [1, 5, SUITE([])],
  ]
}

// Specs with COLUMNS('id', 'name') - All SHOULD FAIL typing!
// @ts-expect-error
const specWithColumnsCall1: TSpec = [COLUMNS('id', 'name'), 3, 5] // <<< SHOULD FAIL: COLUMNS in 1st place
// @ts-expect-error
const specWithColumnsCall2: TSpec = [3, COLUMNS('id', 'name'), 5] // <<< SHOULD FAIL: COLUMNS in 2nd place
// @ts-expect-error
const specWithColumnsCall3: TSpec = [3, 5, COLUMNS('id', 'name')] // <<< SHOULD FAIL: COLUMNS in 3nd place

// Specs with COLUMNS without call
// @ts-expect-error
const specWithColumns1: TSpec = [COLUMNS, 3, 5] // <<< SHOULD FAIL: COLUMNS in 1st place
// @ts-expect-error
const specWithColumns2: TSpec = [3, COLUMNS, 5] // <<< SHOULD FAIL: COLUMNS in 2nd place
// @ts-expect-error
const specWithColumns3: TSpec = [3, 5, COLUMNS] // <<< SHOULD FAIL: COLUMNS in 3nd place

// Suites Array Failing

// With COLUMNS('id', 'name')
// @ts-expect-error
const suite2: T_SUITEArray = [
  ['readTest1', 23],
  COLUMNS('description', 'numba'),
]

// @ts-expect-errorCOLUMNS('id', 'name') 3rd place
const suite1: T_SUITEArray = [
  ['readTest1', 23],
  SKIP,
  COLUMNS('description', 'numba'),
]

// With COLUMNS without call - should fail everywhere!

const suite3: T_SUITEArray = [
  ['foo', 4, Infinity, () => {}, {}],
  // @ts-expect-errorCOLUMNS 2nd, after Spec NOT ALLOWED
  COLUMNS,
]

// @ts-expect-errorColumns 3rd place NOT ALLOWED
const suite31: T_SUITEArray = [
  ['readTest1', 23],
  SKIP(),
  COLUMNS,
]

// Inside a Spec

const suite4: T_SUITEArray = [
  // @ts-expect-error
  ['specArg', 'foo', 1, 2, 3,
    // @ts-expect-error
    COLUMNS('description', 'numba')], // <<< SHOULD FAIL: Columns inside Spec
]

const suite5: T_SUITEArray = [
  // @ts-expect-error
  [SKIP, 'specArg', COLUMNS], // <<< SHOULD FAIL:
]

const nestedSuite: T_SUITEArray = [
  COLUMNS('id', 'name'),
  ['foo', 4, Infinity, () => {}, {}],
  SUITE( // Nested
    // @ts-expect-errorCOLUMNS('id', 'name') cant be in a Spec
    [
      ONLY,
      [2, 3, 5],
      COLUMNS('id', 'name'), // <<< SHOULD FAIL: COLUMNS('id', 'name') cant be in a Spec, in nested SUITE
    ],
  ),
]

// Real SUITE() - User land

// @ts-expect-error
SUITE() // <<< SHOULD FAIL: SUITE needs at least 1 arg
// @ts-expect-error
SUITE([SUITE()]) // <<< SHOULD FAIL: SUITE needs at least 1 arg

// @ignore-ts-expect-error
// SUITE([])  // <<< SHOULD FAIL: SUITEArray needs at least 1 valid item!

const suiteWrongColumnIndex =
  SUITE(
    // @ts-expect-error
    [
      ['foo', 4, Infinity, () => {}, {}],
      COLUMNS('id', 'name'),  // <<< SHOULD FAIL: COLUMNS in wrong index
      [ONLY, 2, 3, 5]],
  )

// @ts-expect-error
SUITE([
  ['foo', 4, Infinity, () => {}, {}],
  COLUMNS('id', 'name'), // <<< SHOULD FAIL // Columns 2nd, after Spec NOT ALLOWED
])

SUITE(
  // @ts-expect-error
  [
    SKIP,
    ['foo', 4, Infinity, () => {}, {}],
    COLUMNS('id', 'name')]) // <<< SHOULD FAIL // Columns 3rd, after Spec NOT ALLOWED

// SUITE([SKIP, COLUMNS('id', 'name')) // <<< SHOULD PASS

// Nested SUITE - User land

const suiteWithWrongNestedSuite= SUITE([
  ONLY,
  COLUMNS('id', 'name'),
  ['foo', 4, Infinity, () => {}, {}],
  SUITE(
    // @ts-expect-error
    [
      ONLY,
      ['foo', 4, Infinity, () => {}, {}],
      [ONLY, 2, 3, 5],

      COLUMNS('id', 'name'), // <<< SHOULD FAIL: COLUMNS in wrong place in nested
    ]),
])

// COLUMNS without a call, not allowed Anywhere!

// In Suite
SUITE([
  // @ts-expect-error
  COLUMNS,
  ['foo', 4, Infinity, () => {}, {}],
]) // <<< SHOULD FAIL // Columns no call NOT ALLOWED in SUITE
// @ts-expect-error
SUITE([SKIP, COLUMNS, ['foo', 4, Infinity, () => {}, {}]]) // <<< SHOULD FAIL // Columns no call NOT ALLOWED in SUITE
// @ts-expect-error
SUITE([['foo', 4, Infinity, () => {}, {}], COLUMNS]) // <<< SHOULD FAIL // COLUMNS no call 2nd, NOT ALLOWED in SUITE

// in SUITE => Spec
// @ts-expect-error
SUITE([[COLUMNS, 4, Infinity, () => {}, {}]]) // <<< SHOULD FAIL // Columns no call NOT ALLOWED in Spec
// @ts-expect-error
SUITE([['foo', COLUMNS, 4, Infinity, () => {}, {}]]) // <<< SHOULD FAIL // Columns no call NOT ALLOWED in Spec
// @ts-expect-error
SUITE([['foo', 4, Infinity, COLUMNS, () => {}, {}]]) // <<< SHOULD FAIL // COLUMNS no call 2nd, NOT ALLOWED in Spec

// COLUMNS cant be in Spec

const wrongSuiteColumnsInSpec =
  SUITE([
    // @ts-expect-error
    [COLUMNS('id', 'name'), Infinity, () => {}, {}],
  ]) // <<< SHOULD FAIL: COLUMNS('id', 'name') cant be in Spec
// @ts-expect-error
SUITE([[COLUMNS('id', 'name'), Infinity, () => {}, {}]]) // <<< SHOULD FAIL: COLUMNS('id', 'name') cant be in Spec

// @ts-expect-error
SUITE([COLUMNS('id', 'name'), [COLUMNS('id', 'name'), 'foo', 4, Infinity, () => {}]]) // <<< SHOULD FAIL: COLUMNS('id', 'name') cant be in Spec
// @ts-expect-error
SUITE([['foo', 4, Infinity, () => {}, {}, COLUMNS('id', 'name')]]) // <<< SHOULD FAIL // COLUMNS('id', 'name') in Spec
// @ts-expect-error
SUITE([COLUMNS('id', 'name'), ['foo', 4, Infinity, () => {}, COLUMNS('id', 'name')]]) // <<< SHOULD FAIL: COLUMNS('id', 'name') cant be in Spec
// @ts-expect-error
SUITE([ONLY, ['foo', 4, Infinity, () => {}, {}], COLUMNS('id', 'name')]) // <<< SHOULD FAIL // COLUMNS('id', 'name') 2nd, after Spec NOT ALLOWED

// COLUMNS without call, inside Spec
// @ts-expect-error COLUMNS no call, inside Spec NOT ALLOWED
SUITE([ONLY, [COLUMNS, 'foo', 4, Infinity, () => {}, {}]])
// @ts-expect-error COLUMNS no call, inside Spec NOT ALLOWED
SUITE([ONLY, [SKIP, COLUMNS, 'foo', 4, Infinity, () => {}, {}]])
// @ts-expect-error COLUMNS no call, inside Spec NOT ALLOWED
SUITE([ONLY, ['foo', 4, Infinity, () => {}, {}, COLUMNS]])
// SUITE([ONLY,['foo', 4, Infinity, () => {}, {}]) // <<< SHOULD PASS

// SUITE cant be in Spec

// @ts-expect-error SUITE in Spec NOT ALLOWED
SUITE([ONLY, [SUITE, 'foo', 4, Infinity, () => {}, {}]])
// @ts-expect-error SUITE in Spec NOT ALLOWED
SUITE([ONLY, [SKIP, SUITE, 'foo', 4, Infinity, () => {}, {}]]) // <<< SHOULD FAIL // SUITE in Spec NOT ALLOWED
// @ts-expect-error SUITE in Spec NOT ALLOWED
SUITE([ONLY, ['foo', 4, Infinity, () => {}, {}, SUITE]])

// Filter Commands cant be in Spec, beyond 1st position
// @ts-expect-error SKIP 2nd in Spec NOT ALLOWED
SUITE([ONLY, ['foo', ONLY, 4, Infinity, () => {}, {}]])
// SUITE([ONLY, [ONLY, 'foo', 4, Infinity, () => {}, {}]]) // <<< SHOULD PASS

// @ts-expect-error SKIP 2nd in Spec NOT ALLOWED
SUITE([ONLY, ['foo', ONLY({ reason: 'foo' }), 4, Infinity, () => {}, {}]])
// SUITE([ONLY, [ONLY({reason:'foo'}), 4, Infinity, () => {}, {}]]) // <<< SHOULD PASS

// SUITE name & description

// @ts-expect-error wrong SUITE() signature
SUITE(123, [['foo', 4, Infinity, () => {}, {}]])
// @ts-expect-error wrong SUITE() signature
SUITE({ wrongKey: 'name', description: 'description' }, [['foo', 4, Infinity, () => {}, {}]])


// Wrong types:
// @ts-expect-error wrong SUITE() signature - {} is not a Suite nor string
SUITE([{}])
// @ts-expect-error wrong SUITE() signature - {} is not a Suite nor string
SUITE('name', {}) // <== SHOULD FAIL because {} is not a Suite nor string
// @ts-expect-error wrong SUITE() signature - {} is not a Suite nor string
SUITE('name', 'description', {}) // <== SHOULD FAIL because {} is not a Suite nor string
// @ts-expect-error wrong SUITE() signature - a Function is not a TUserSuite arg
SUITE(() => {})
// @ts-expect-error wrong SUITE() signature - a Function is not a TUserSuite arg
SUITE('name', () => {})
// @ts-expect-error wrong SUITE() signature - a Function is not a TUserSuite arg
SUITE('name', 'description', () => {}) // <== SHOULD FAIL because function is not a Suite nor string

// @ts-expect-error needs at least 1 column name
COLUMNS()

// #### EACH ####

// SUITE with EACH not allowed
SUITE(
  // @ts-expect-error
  [
    COLUMNS('name', 'targetArguments', 'expected', 'error?'),
    ['foo', 4, Infinity, () => {}, {}],
    EACH([4, 2], [8, 4], [16, 8]), // <<< SHOULD FAIL: EACH cant be in a Suite
  ])

// Each can not contain anything but Other Commands, except Filters, FilterEnds, FilterAboves

// @ts-expect-error
SUITE([[EACH(COLUMNS(), 1, 'foo')]])
// @ts-expect-error
SUITE([[EACH(EACH(), 1, 'foo')]])
// @ts-expect-error
SUITE([[EACH(SUITE([]), 1, 'foo')]])
// @ts-expect-error
SUITE([[EACH(1, SUITE([]), 'foo')]])

// @todo(232): SHOULD FAIL with ts-expect-error when used on Spec Root, you can only have Arrays as eachArgs, and anything else would fail
SUITE([[EACH('notAnArray', ['foo'])]])

// But when used in deep nested Object, then this requirement is lifted, and you can have anything:
// @wip: This is not yet implemented
SUITE([[{specArray: {nested: EACH('notAnArray', 'anything')}}]])

// This is now enforced in code (not in types) and it works as expected (with tests)

// ONLY_ABOVE
// @ts-expect-error
SUITE(ONLY_ABOVE, [ ['no XXX_ABOVE as 1st SUITEarg']])
// @ts-expect-error
SUITE([ [ONLY_ABOVE, 'no XXX_ABOVE as 1st arg in Spec']])
// @ts-expect-error
SUITE([ ['no XXX_ABOVE in Spec at all', ONLY_ABOVE]])

// SKIP_ABOVE
// @ts-expect-error
SUITE(SKIP_ABOVE, [ ['no XXX_ABOVE as 1st SUITEarg']])
// @ts-expect-error
SUITE([ [SKIP_ABOVE, 'no XXX_ABOVE as 1st arg in Spec']])
// @ts-expect-error
SUITE([ ['no XXX_ABOVE in Spec at all', SKIP_ABOVE]])

// @NOT_WORKING_ts-expect-error but it throws in code!
SUITE([ ONLY_ABOVE, ['no XXX_ABOVE as 1st SUITEarg']])
SUITE([ SKIP_ABOVE, ['no XXX_ABOVE as 1st SUITEarg']])
