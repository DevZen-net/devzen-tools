import * as chai from 'chai'
import * as _ from 'lodash'
import { get_Map_of_TMapKeys_Tvalues, get_Set_of_Tvalues } from '../../../test-utils/test-data'
import { isMapIterator } from '../isMapIterator'

const { expect } = chai

const aSimpleMap = get_Map_of_TMapKeys_Tvalues()
const aSimpleSet = get_Set_of_Tvalues()

describe('isMapIterator / isMapEntries', () => {
  describe('isMapIterator', () => {
    _.each(
      [
        [aSimpleMap.entries(), true],
        [aSimpleMap.values(), true],
        [aSimpleMap.keys(), true],
        [aSimpleMap[Symbol.iterator](), true],
        [aSimpleMap, false],

        [aSimpleSet.entries(), false],
        [aSimpleSet.values(), false],
        [aSimpleSet.keys(), false],
        [aSimpleSet[Symbol.iterator](), false],
      ],
      ([value, expected]) =>
        it(`for ${value} returns ${expected}`, () => {
          expect(isMapIterator(value)).to.be.equal(expected)
        })
    )
  })

  // @todo: not working
  // describe('isMapEntries', () => {
  //   _.each(
  //     [
  //       [aSimpleMap.entries(), true], // fails
  //
  //       [aSimpleMap.values(), false],
  //       [aSimpleMap.keys(), false],
  //       [aSimpleMap, false],
  //
  //       [aSimpleSet.entries(), false],
  //       [aSimpleSet.values(), false],
  //       [aSimpleSet.keys(), false],
  //       [aSimpleSet[Symbol.iterator](), false],
  //     ],
  //     ([value, expected]) =>
  //       it(`for ${value} returns ${expected}`, () => {
  //         expect(isMapEntries(value)).to.be.equal(expected)
  //       })
  //   )
  // })
})
