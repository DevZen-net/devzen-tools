import * as chai from 'chai'
import * as _ from 'lodash'
import data from '../../../test-utils/test-data'

import * as z from '../../index'

const { expect } = chai
// clone to check mutability

const { obj, arrInt, arrStr } = _.cloneDeep(data)

describe('z.isSetEqual :', () => {
  describe('should compare Arrays of primitives & references by Reference', () => {
    const arr = [1, { b: 2 }, 'three']
    const testCases = [
      [arr, arr, true],
      [[1, 2, 3], [3, 2, 1], true],
      [[1, 2, 3, 4], [3, 2, 1], false],
      [[1, 2, 3], [4, 3, 2, 1], false],
      [[1, 2, 3, 'John', 'Doe'], ['John', 3, 'Doe', 2, 1], true],
      [
        [obj, arrInt, arrStr, 2, 3, 'John', 'Doe'],
        [obj, 'John', arrInt, 3, arrStr, 'Doe', 2],
        true,
      ],
    ]

    _.each(testCases, ([a, b, expected]: [any[], any[], boolean]) =>
      it('using Default Comparator', () => expect(z.isSetEqual(a, b)).equal(expected))
    )

    const refComparator = (a, b) => a === b
    _.each(testCases, ([a, b, expected]: [any[], any[], boolean]) =>
      it('using Custom Comparator', () =>
        expect(z.isSetEqual(a, b, refComparator)).equal(expected))
    )

    _.each(
      [
        [[{ a: 1 }, { b: 2 }, { c: 3 }], [{ c: 3 }, { b: 2 }, { a: 1 }], false],
        [
          [{ a: 1 }, { b: 2 }, { c: 3 }],
          [{ d: 4 }, { c: 3 }, { b: 2 }, { a: 1 }],
          false,
          _.isEqual,
        ],
        [
          [{ a: 1 }, { b: 'bbb' }, { c: { d: 4 } }],
          [{ c: { d: 4 } }, { b: 'bbb' }, { a: 1 }],
          true,
          _.isEqual,
        ],
        [
          [{ a: 1 }, { b: 2 }, { c: 3 }],
          [{ c: 3 }, { b: 2 }, { a: 1, extraPropButObjectIn1stArray_isLikeThis: 111 }],
          true,
          z.isLike,
        ],
        [
          [{ a: 1 }, { b: 2 }, { c: 3 }],
          [{ c: 3 }, { b: 2 }, { a: 1, extraPropButObjectIn1stArray_isLikeThis: 111 }],
          true,
          z.isLike,
          _.flip(z.isLike),
        ],
        [
          [{ a: 1, extraPropButObjectIn2ndArray_isFlipLikeThis: 111 }, { b: 2 }, { c: 3 }],
          [{ c: 3 }, { b: 2 }, { a: 1 }],
          true,
          _.flip(z.isLike),
        ],
      ],
      ([a, b, expected, comparator]: [any[], any[], boolean, any]) => {
        it('should compare as Arrays', () =>
          expect(z.isSetEqual(a, b, comparator)).equal(expected))

        it('should compare as Sets ', () =>
          expect(z.isSetEqual(new Set(a), new Set(b), comparator)).equal(expected))
      }
    )
  })
})
