import * as chai from 'chai'
import * as _ from 'lodash'
import { get_Map_of_TMapKeys_Tvalues, get_Set_of_Tvalues } from '../../../test-utils/test-data'
import { isSetIterator } from '../isSetIterator'

const { expect } = chai

const aSimpleMap = get_Map_of_TMapKeys_Tvalues()
const aSimpleSet = get_Set_of_Tvalues()

describe('isSetIterator', () => {
  _.each(
    [
      [aSimpleSet.entries(), true],
      [aSimpleSet.values(), true],
      [aSimpleSet.keys(), true],
      [aSimpleSet[Symbol.iterator](), true],
      [aSimpleSet, false],

      [aSimpleMap.entries(), false],
      [aSimpleMap.values(), false],
      [aSimpleMap.keys(), false],
      [aSimpleMap[Symbol.iterator](), false],
      [aSimpleMap, false],
    ],
    ([value, expected]) =>
      it(`for ${value} returns ${expected}`, () => {
        expect(isSetIterator(value)).to.be.equal(expected)
      })
  )
})
