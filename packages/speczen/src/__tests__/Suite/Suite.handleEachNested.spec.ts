import { BREAKS, BREAKS_END, EACH, SKIP, SKIP_END } from '../../code/types'
import { Suite } from '../../code/Suite'
import { genericTestHandler } from '../test-utils/genericTestHandler'

class Foo {
  constructor(public bar: any) {}
}

genericTestHandler('Suite.handleEachNested()', {}, [
  [
    'no nested EACH - returns same Spec',
    () => (Suite as any).handleEachNested([{ a: 1 }, { b: 2 }, { c: 3 }]),
    [[{ a: 1 }, { b: 2 }, { c: 3 }]],
  ],
  [
    'A simple nested EACH - returns expanded Specs',
    () =>
      (Suite as any).handleEachNested(
        // @ts-ignore
        [{ a: 1 }, { b: EACH(2, 22, 222) }, { c: 3 }]
      ),
    [
      [{ a: 1 }, { b: 2 }, { c: 3 }],
      [{ a: 1 }, { b: 22 }, { c: 3 }],
      [{ a: 1 }, { b: 222 }, { c: 3 }],
    ],
  ],

  [
    'Multiple nested EACHes',
    () =>
      (Suite as any).handleEachNested([
        { a: 1 },
        { b: EACH(2, 22) },
        { c: EACH(3, 33) },
      ]),
    [
      [{ a: 1 }, { b: 2 }, { c: 3 }],
      [{ a: 1 }, { b: 2 }, { c: 33 }],
      [{ a: 1 }, { b: 22 }, { c: 3 }],
      [{ a: 1 }, { b: 22 }, { c: 33 }],
    ],
  ],
  [
    'Multiple deep nested EACHes',
    () =>
      (Suite as any).handleEachNested([
        { a: 1 },
        { b: EACH(2, 22) },
        { deep: { nested: { c: EACH(3, 33) } } },
      ]),
    [
      [{ a: 1 }, { b: 2 }, { deep: { nested: { c: 3 } } }],
      [{ a: 1 }, { b: 2 }, { deep: { nested: { c: 33 } } }],
      [{ a: 1 }, { b: 22 }, { deep: { nested: { c: 3 } } }],
      [{ a: 1 }, { b: 22 }, { deep: { nested: { c: 33 } } }],
    ],
  ],
  [
    'Nested EACH in Array ',
    () =>
      (Suite as any).handleEachNested([
        { a: 1 },
        [200, EACH(2, 22), 222],
        { deep: { nested: { c: [300, EACH(3, 33), 333] } } },
      ]),
    [
      [{ a: 1 }, [200, 2, 222], { deep: { nested: { c: [300, 3, 333] } } }],
      [{ a: 1 }, [200, 2, 222], { deep: { nested: { c: [300, 33, 333] } } }],
      [{ a: 1 }, [200, 22, 222], { deep: { nested: { c: [300, 3, 333] } } }],
      [{ a: 1 }, [200, 22, 222], { deep: { nested: { c: [300, 33, 333] } } }],
    ],
  ],

  // WIP WORKS
  [
    'Nested EACH in Array, with Filters - filters go inside Spec',
    () =>
      (Suite as any).handleEachNested([
        { a: 1 },
        { b: EACH(2, SKIP('SKIP -22'), -22, SKIP_END('SKIP_END -22'), 22) },
        // { b: EACH(2, -22, 22) },
        { deep: { nested: { c: EACH(3, 33) } } },
      ]),
    [
      [{ a: 1 }, { b: 2 }, { deep: { nested: { c: 3 } } }],
      [{ a: 1 }, { b: 2 }, { deep: { nested: { c: 33 } } }],

      [SKIP('SKIP -22'), { a: 1 }, { b: -22 }, { deep: { nested: { c: 3 } } }],
      [SKIP('SKIP -22'), { a: 1 }, { b: -22 }, { deep: { nested: { c: 33 } } }],

      // [{ a: 1 }, { b: -22 }, { deep: { nested: { c: 3 } } }],
      // [{ a: 1 }, { b: -22 }, { deep: { nested: { c: 33 } } }],

      [
        SKIP_END('SKIP_END -22'),
        { a: 1 },
        { b: 22 },
        { deep: { nested: { c: 3 } } },
      ],
      [
        SKIP_END('SKIP_END -22'),
        { a: 1 },
        { b: 22 },
        { deep: { nested: { c: 33 } } },
      ],
    ],
  ],

  [
    `Nested EACH in a class Instance, throws Cloning Instances is NOT IMPLEMENTED`,
    () =>
      (Suite as any).handleEachNested([
        { a: 1 },
        { b: [200, new Foo({ bbEach: EACH(2, 22) }), 222] },
      ]),
    `SpecZen: Error: EACH() called in a nested object or array, that has an Instance as a parent. This is NOT IMPLEMENTED!
Offending:
- Instance path: [
  '1',
  'b',
  '1'
]
- Instance Value: {
  'bar':{
    'bbEach':{
      EACH(2, 22)
    }
  }
}
- Instance Class: Foo`,
  ],
])

describe('Suite.handleEachNested() - instances tests', () => {
  it(`Instances in Spec, NOT as parents of EACHes, are NOT cloned`, () => {
    const foo1 = new Foo(1)
    const foo333 = new Foo(333)
    const spec = [
      foo1,
      [200, EACH(2, 22), 222],
      { deep: { nested: { c: [300, EACH(3, 33), foo333] } } },
    ]

    const resultSpecs = (Suite as any).handleEachNested(spec)

    const expectedExpandedSpecs = [
      [foo1, [200, 2, 222], { deep: { nested: { c: [300, 3, foo333] } } }],
      [foo1, [200, 2, 222], { deep: { nested: { c: [300, 33, foo333] } } }],
      [foo1, [200, 22, 222], { deep: { nested: { c: [300, 3, foo333] } } }],
      [foo1, [200, 22, 222], { deep: { nested: { c: [300, 33, foo333] } } }],
    ]

    expect(resultSpecs).toMatchObject(expectedExpandedSpecs)

    resultSpecs.forEach((spec) => {
      expect(spec[0]).toBe(foo1)
      expect(spec[0]).toBeInstanceOf(Foo)
      expect(spec[2].deep.nested.c[2]).toBe(foo333)
      expect(spec[2].deep.nested.c[2]).toBeInstanceOf(Foo)
    })
  })

  it(`Instances in Spec, as EACH args, they are permuted normally`, () => {
    const foo1 = new Foo(1)
    const foo2 = new Foo(2)
    const foo22 = new Foo(22)
    const foo333 = new Foo(333)
    const spec = [
      foo1,
      [200, EACH(foo2, foo22), 222],
      { deep: { nested: { c: [300, EACH(3, 33), foo333] } } },
    ]

    const resultSpecs = (Suite as any).handleEachNested(spec)

    const expectedExpandedSpecs = [
      [foo1, [200, foo2, 222], { deep: { nested: { c: [300, 3, foo333] } } }],
      [foo1, [200, foo2, 222], { deep: { nested: { c: [300, 33, foo333] } } }],
      [foo1, [200, foo22, 222], { deep: { nested: { c: [300, 3, foo333] } } }],
      [foo1, [200, foo22, 222], { deep: { nested: { c: [300, 33, foo333] } } }],
    ]

    expect(resultSpecs).toMatchObject(expectedExpandedSpecs)

    resultSpecs.forEach((spec) => {
      expect(spec[0]).toBe(foo1)
      expect(spec[0]).toBeInstanceOf(Foo)
      expect(spec[2].deep.nested.c[2]).toBe(foo333)
      expect(spec[2].deep.nested.c[2]).toBeInstanceOf(Foo)
    })
  })

  it.skip(`BREAKS - NOT IMPLEMENTED Nested EACH in instance`, () => {
    const foo1 = new Foo(1)

    const spec = [foo1, { b: [200, new Foo({ bbEach: EACH(2, 22) }), 222] }]

    const resultSpecs = (Suite as any).handleEachNested(spec)

    const expectedExpandedSpecs = [
      [foo1, [200, { b: { bbEach: 2 } }, 222]],
      [foo1, [200, { b: { bbEach: 22 } }, 222]],
    ]

    expect(resultSpecs).toMatchObject(expectedExpandedSpecs)

    resultSpecs.forEach((spec) => {
      expect(spec[0]).toBe(foo1)
      expect(spec[0]).toBeInstanceOf(Foo)
      expect(spec[2].b[1].bbEach).toBeInstanceOf(Foo)
    })
  })
})
