// Typing Tests for Spec & Suite
// Passing tests only
// These aren't executable tests, just type tests you can observe in your IDE!
import {
  SUITE,
  COLUMNS,
  EACH,
  ONLY,
  SKIP,
  SKIP_END,
  T_SUITEArray,
  TSpec,
  SKIP_ABOVE,
  ONLY_ABOVE,
  BREAKS,
  SKIP_MUTE,
  ONLY_END,
} from '../../code/types'

export class FooClass {
  fooField = 'fooValue'
}

COLUMNS('foo')
COLUMNS('foo', 'bar')

// Specs - Should ALL PASS - NOT FAIL

const simpleUserSpec: TSpec = [1, BigInt(2), 3]
const simpleUserSpec2: TSpec = [ONLY, 1, 2, 3]
const simpleUserSpec3: TSpec = [ONLY(), 1, 2n, 3]

const specs_PassingTypingTest: TSpec[] = [
  [1, 2, function foo() {}, new FooClass(), {}],
  [SKIP],
  [SKIP, 'foo', 2, () => {}, {}],
  [SKIP(), 'foo', 2, () => {}, {}],
  [SKIP({ reason: 'Reasons...' }), 'foo', 2, () => {}, {}],
  [ONLY, () => {}],
  [ONLY, 'foo', 2, () => {}, {}],
  [ONLY({ reason: 'some reason' }), 'foo', 2, () => {}, {}],
  ['foo', 4, Infinity, () => {}, {}],
  [4, Infinity, 'foo', () => {}, {}],
]

// Suites - Should ALL PASS - NOT FAIL
const suites_PassingTypingTest: T_SUITEArray[] = [
  // Just a Spec
  [['foo', 4, Infinity, () => {}, {}]],
  // Suite with Columns first
  [COLUMNS('id', 'name'), ['foo', 4, Infinity, () => {}, {}], [ONLY, 2, 3, 5]],
  // Suite with Columns first, and Filter in the middle
  [
    COLUMNS('id', 'name'),
    ['foo', 4, Infinity, () => {}, {}],
    ONLY({ reason: 'foo' }),
    [SKIP({ reason: 'foo' }), 'foo', 4, Infinity, () => {}, {}],
    ['foo', 4, Infinity, () => {}, {}],
  ],
  // Suite with Filters first, and Filter in the middle
  [
    ONLY,
    ['foo', 4, Infinity, () => {}, {}],
    [SKIP, 'foo', 4, Infinity, () => {}, {}],
    ['foo', 4, Infinity, () => {}, {}],
    SKIP,
    ['foo', 4, Infinity, () => {}, {}],
  ],
  // Allows COLUMN second, with a Filter first (for convenience)
  [
    ONLY,
    COLUMNS('id', 'name'),
    ['foo', 4, Infinity, () => {}, {}],
    [ONLY, 2, 3, 5],
  ],

  // // A nested SUITE - mixed Array & Suite
  [
    ONLY,
    COLUMNS('id', 'name'),
    ['foo', 4, Infinity, () => {}, {}],
    [ONLY, 2, 3, 5],
    SUITE([
      ONLY,
      // COLUMNS('id', 'name'),
      ['foo', 4, Infinity, () => {}, {}],
      [ONLY, 2, 3, 5],
    ]),
  ],
]

// Using SUITE() as a function

SUITE([])
SUITE([ONLY])
SUITE([SKIP])
SUITE([ONLY()])
SUITE([SKIP()])
SUITE([COLUMNS('id', 'name')])
SUITE([COLUMNS('id', 'name'), ['foo', 1, () => {}, new FooClass, {}]])
SUITE([['foo', 1, () => {}, new FooClass, {}], SKIP])
SUITE([['foo', 1, () => {}, new FooClass, {}], SKIP()])
SUITE([['foo', 1, () => {}, new FooClass, {}]])
SUITE([SKIP, ['foo', 1, () => {}, new FooClass, {}]])
SUITE([SKIP(), ['foo', 1, () => {}, new FooClass, {}]])

// ABOVE
SUITE([['foo', 1, () => {}, new FooClass, {}], SKIP_ABOVE])
SUITE([['foo', 1, () => {}, new FooClass, {}], SKIP_ABOVE()])
SUITE([['foo', 1, () => {}, new FooClass, {}], ONLY_ABOVE])
SUITE([['foo', 1, () => {}, new FooClass, {}], ONLY_ABOVE()])

// Suite with Columns first
SUITE([
  COLUMNS('id', 'name'),
  ['foo', 4, Infinity, () => {}, {}],
  [ONLY, 2, 3, 5],
])

SUITE(
  'Suite title', [
    COLUMNS('id', 'name'),
    ['foo', 4, Infinity, () => {}, {}],
    [ONLY, 2, 3, 5],
  ],
)

// With SKIP Filter before title
SUITE(
  SKIP, 'Suite title', [
    COLUMNS('id', 'name'),
    ['foo', 4, Infinity, () => {}, {}],
    [ONLY('I only want this Spec to run'), 2, 3, 5],
  ],
)

// With SKIP Filter after title
SUITE(
  'Suite title', SKIP('Skip the whole SUITE'), [
    COLUMNS('id', 'name'),
    ['foo', 4, Infinity, () => {}, {}],
    [ONLY, 2, 3, 5],
  ],
)

// With options
SUITE(
  { title: 'Suite Title' }, [
    COLUMNS('id', 'name'),
    ['foo', 4, Infinity, () => {}, {}],
    [ONLY, 2, 3, 5],
  ],
)

// With SKIP Filter before options
SUITE(
  SKIP, { title: 'Suite Title' }, [
    COLUMNS('id', 'name'),
    ['foo', 4, Infinity, () => {}, {}],
    [ONLY, 2, 3, 5],
  ],
)

// With SKIP Filter AFTER options
SUITE(
   { title: 'Suite Title' }, SKIP, [
    COLUMNS('id', 'name'),
    ['foo', 4, Infinity, () => {}, {}],
    [ONLY, 2, 3, 5],
  ],
)

// Suite with FilterEnd in call arguments
SUITE(
  SKIP_END, { title: 'Suite Title' }, [
    COLUMNS('id', 'name'),
    ['foo', 4, Infinity, () => {}, {}],
    [ONLY, 2, 3, 5],
  ],
)

// Suite with FilterIgnore in call arguments
SUITE(
  SKIP_MUTE, { title: 'Suite Title' }, [
    COLUMNS('id', 'name'),
    ['foo', 4, Infinity, () => {}, {}],
    [ONLY, 2, 3, 5],
  ],
)

// Suite with Columns first, and Filter in the middle
SUITE([
  COLUMNS('id', 'name'),
  ['foo', 4, Infinity, () => {}, {}],
  ONLY,
  [SKIP, 'foo', 4, Infinity, () => {}, {}],
  ['foo', 4, Infinity, () => {}, {}],
])

// Allows COLUMN second, with a Filter first (for convenience)
SUITE([
  ONLY,
  COLUMNS('id', 'name'),
  ['foo', 4, Infinity, () => {}, {}],
  [ONLY, 2, 3, 5],
])

// Allows COLUMN second, with a FilterEnd first (for convenience)
SUITE([
  ONLY_END,
  COLUMNS('id', 'name'),
  ['foo', 4, Infinity, () => {}, {}],
  [ONLY, 2, 3, 5],
])

// Suite with FilterIgnore in SUITE array, before columns
SUITE(
  { title: 'Suite Title' }, [
    SKIP_MUTE,
    COLUMNS('id', 'name'),
    ['foo', 4, Infinity, () => {}, {}],
    SKIP_MUTE,
    [ONLY, 2, 3, 5],
  ],
)

// EACH
//
// Can be in Spec only, in the root of the Spec Array, at any position.
// It can contain
// - Arrays with anything except any Command except Filters (i.e EACH, COLUMNS, SUITE are not allowed, SKIP, SKIP_END etc allowed)

// In first position
SUITE([
  [EACH([4, 2], [8], ['a'], [{ foo: 'bar' }], [() => {}],[new FooClass()])],
])
// In non first position
SUITE([
  [[1], EACH([4, 2], [8], ['a'], [{ foo: 'bar' }], [() => {}],[new FooClass()])],
])

// Suite with Columns first, and Filter in the middle
SUITE({ title: 'API V2' }, [
  ['someSpec'],
  SUITE(BREAKS(), { title: 'Broken API V2 stuff' }, [
    ['someBrokenSpec'],
  ]),
])

// EACH in the Spec Array Root, can have Filters. Inside this EACH, only Spec Params Arrays are allowed and Filters. In the Spec Params Arrays, we can have Filters, but only in first place (each Spec Params Array is referring to one Spec)

SUITE({ specHandlers: 'someSpecHandler' }, [
  COLUMNS('a', 'b', 'c'),
  [
    1,
    EACH(
      ['specRootItem'],
      [2],
      SKIP,
      [22],
      SKIP_END,
      [222],
      [ONLY, 333],

      ['notAllowedInNon1stPlace', ONLY] // @todo: this should fail in typing - fails in code!
    ),
    3,
  ],
])

// EACH can have Filters in the nested Spec Array items
// @wip: This is not yet implemented
SUITE([['specRootItem', {deep: {nested: EACH(1, SKIP(), 'foo')}}]])
