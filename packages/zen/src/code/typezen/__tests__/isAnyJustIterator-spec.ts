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
import { isAnyJustIterator } from '../isAnyJustIterator'
import { type } from '../type'

const { expect } = chai

const aSimpleMap = get_Map_of_TMapKeys_Tvalues()
const aSimpleSet = get_Set_of_Tvalues()

describe('isAnyJustIterator', () => {
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

      [loop([1, 2, 3]), true],
      [get_plainIteratorPOJSO(), true],

      // generators only - true
      [a_GeneratorFunction_named(), true],
      [a_GeneratorFunction_anonymous(), true],

      // async generators only - true
      [a_GeneratorFunction_async_named(), true],
      [a_GeneratorFunction_async_anonymous(), true],

      // NOT Any Just Iterator
      [aSimpleMap, false],
      [aSimpleSet, false],
      [[1, 2, 3], false],
      [{ a: 1 }, false],
    ],
    ([value, expected]) =>
      it(`for type = '${type(value)}' value = ${value} returns ${expected}`, () => {
        expect(isAnyJustIterator(value)).to.be.equal(expected)
      })
  )
})
