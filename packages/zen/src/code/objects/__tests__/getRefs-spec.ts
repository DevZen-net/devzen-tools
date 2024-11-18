import { equalSetStrict } from '../../../test-utils/specHelpers'
import { a_Person } from '../../../test-utils/test-data'
import * as z from '../../index'

const get_anArray = (): any[] => [
  0,
  1,
  {
    p: [
      {
        PP: 3,
        level3: { some: 'value' },
      },
    ],
  },
  {
    a: {
      b: () => {},
    },
  },
  4,
]

const anArray = get_anArray()
const anArrayCircular = get_anArray()
anArrayCircular[2].p[0].level3.circular = anArrayCircular[2].p[0]

const anObject: any = {
  p0: 0,
  p1: 1,
  p2: {
    p: [
      {
        PP: 3,
        level3: { some: 'value' },
      },
    ],
  },
  p3: {
    a: {
      b: () => {},
    },
  },
  p4: 4,
}

describe('getRefs:', () => {
  it('from array, depth = false, get only 0 level refs', () =>
    equalSetStrict(z.getRefs(anArray, { depth: false }), [anArray[3], anArray[2]]))

  it('from array, depth = 0, get only 0 level refs', () =>
    equalSetStrict(z.getRefs(anArray, { depth: 0 }), [anArray[3], anArray[2]]))

  describe('depth = true (get all refs, irrespective of depth):', () => {
    it('from array', () =>
      equalSetStrict(
        z.getRefs(anArray, {
          // depth: true, // default
        }),
        // @ts-ignore-next-line
        [
          anArray[2],
          anArray[2].p,
          anArray[2].p[0],
          anArray[2].p[0].level3,
          anArray[3],
          anArray[3].a,
          anArray[3].a.b,
        ]
      ))

    it('from object:', () =>
      equalSetStrict(
        z.getRefs(anObject, {
          // depth: true, // default
        }),
        [
          anObject.p2.p,
          anObject.p2.p[0],
          anObject.p2.p[0].level3,
          anObject.p2, // order doesn't matter
          anObject.p3,
          anObject.p3.a,
          anObject.p3.a.b,
        ]
      ))

    describe('Map', () => {
      const aSimpleMap = new Map(<[any, any][]>[
        ['a', 1],
        ['aPerson', a_Person],
        ['b', 2],
        ['aPerson.parentInstanceMethod', a_Person.parentInstanceMethod],
        ['c', 'foobar'],
        ['aPerson.aSymbol', Symbol.for('symbolValueRef')],
      ])

      it('from Map', () => {
        equalSetStrict(
          z.getRefs(aSimpleMap, {
            // depth: true, // default
          }),
          [a_Person, a_Person.parentInstanceMethod, Symbol.for('symbolValueRef')]
        )
      })
    })

    describe('Set', () => {
      const aSimpleSet = new Set([
        1,
        a_Person,
        2,
        a_Person.parentInstanceMethod,
        'foobar',
        Symbol.for('symbolKeyForSet'),
      ])
      it(`gets the Set's refs`, () => {
        equalSetStrict(z.getRefs(aSimpleSet), [
          a_Person,
          a_Person.parentInstanceMethod,
          Symbol.for('symbolKeyForSet'),
        ])
      })

      it('from Set, with filter, filters whole branches', () => {
        equalSetStrict(z.getRefs(aSimpleSet, { filter: (v) => v !== a_Person }), [
          // filtered out: aPerson
          a_Person.parentInstanceMethod,
          Symbol.for('symbolKeyForSet'),
        ])
      })
    })
  })

  describe('depth is numeric', () => {
    describe('from array', () => {
      it('depth = 0:', () => {
        return equalSetStrict(
          z.getRefs(anArray, {
            depth: 0,
          }),
          // @ts-ignore-next-line
          [anArray[2], anArray[3]]
        )
      })

      it('depth = 1:', () => {
        return equalSetStrict(
          z.getRefs(anArray, {
            depth: 1,
          }),
          // @ts-ignore-next-line
          [anArray[2], anArray[2].p, anArray[3], anArray[3].a]
        )
      })

      it('depth = 2:', () => {
        return equalSetStrict(
          z.getRefs(anArray, {
            depth: 2,
          }),
          // @ts-ignore-next-line
          [anArray[2], anArray[2].p, anArray[2].p[0], anArray[3], anArray[3].a, anArray[3].a.b]
        )
      })

      it('depth = 3:', () => {
        return equalSetStrict(
          z.getRefs(anArray, {
            depth: 3,
          }),
          // @ts-ignore-next-line
          [
            anArray[2],
            anArray[2].p,
            anArray[2].p[0],
            anArray[2].p[0].level3,
            anArray[3],
            anArray[3].a,
            anArray[3].a.b,
          ]
        )
      })
    })

    describe('from object', () => {
      it('depth = 0:', () => {
        return equalSetStrict(
          z.getRefs(anObject, {
            depth: 0,
          }),
          [anObject.p3, anObject.p2]
        )
      })
      it('depth = 1:', () => {
        return equalSetStrict(
          z.getRefs(anObject, {
            depth: 1,
          }),
          [anObject.p2.p, anObject.p2, anObject.p3, anObject.p3.a]
        )
      })
      it('depth = 2:', () => {
        return equalSetStrict(
          z.getRefs(anObject, {
            depth: 2,
          }),
          [
            anObject.p2.p,
            anObject.p2.p[0],
            anObject.p2, // order doesn't matter
            anObject.p3,
            anObject.p3.a,
            anObject.p3.a.b,
          ]
        )
      })
    })
  })
})
