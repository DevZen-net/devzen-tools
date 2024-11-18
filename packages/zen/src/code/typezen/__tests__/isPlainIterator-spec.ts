import * as chai from 'chai'
import * as _ from 'lodash'
import {
  a_GeneratorFunction_anonymous,
  a_GeneratorFunction_async_anonymous,
  a_GeneratorFunction_async_named,
  a_GeneratorFunction_named,
  get_Map_of_TMapKeys_Tvalues,
  get_plainIteratorPOJSO,
  get_Set_of_Tvalues,
} from '../../../test-utils/test-data'
import { loop } from '../../loopzen/loop'
import { isPlainIterator } from '../isPlainIterator'
import { type } from '../type'

const { expect } = chai

const aSimpleMap = get_Map_of_TMapKeys_Tvalues()
const aSimpleSet = get_Set_of_Tvalues()

describe('isPlainIterator', () => {
  _.each(
    [
      [aSimpleSet.entries(), true],
      [aSimpleSet.values(), true],
      [aSimpleSet.keys(), true],
      [aSimpleSet[Symbol.iterator](), true],

      [aSimpleMap.entries(), true],
      [aSimpleMap.values(), true],
      [aSimpleMap.keys(), true],
      [aSimpleMap[Symbol.iterator](), true],

      [get_plainIteratorPOJSO(), true],

      // Generators are NOT plain Iterators

      [loop([1, 2, 3]), false],
      [a_GeneratorFunction_named(), false],
      [a_GeneratorFunction_anonymous(), false],
      [a_GeneratorFunction_async_named(), false],
      [a_GeneratorFunction_async_anonymous(), false],

      // These have their own z.type - not plain Iterators
      [aSimpleMap, false],
      [aSimpleSet, false],
      [[1, 2, 3], false],
      [{ a: 1 }, false],

      // TypedArray is not a plain Iterator
      [new Uint8Array([1, 2, 3]), false],
      [new Int8Array([1, 2, 3]), false],
      [new Uint8ClampedArray([1, 2, 3]), false],
      [new Int16Array([1, 2, 3]), false],
      [new Uint16Array([1, 2, 3]), false],
      [new Int32Array([1, 2, 3]), false],
      [new Uint32Array([1, 2, 3]), false],
      [new Float32Array([1, 2, 3]), false],
      [new Float64Array([1, 2, 3]), false],
      [new BigInt64Array([1n, 2n, 3n]), false],
      [new BigUint64Array([1n, 2n, 3n]), false],
    ],
    ([value, expected]) =>
      it(`for type = '${type(value)}' value = ${value} returns ${expected}`, () => {
        expect(isPlainIterator(value)).to.be.equal(expected)
      })
  )
})
