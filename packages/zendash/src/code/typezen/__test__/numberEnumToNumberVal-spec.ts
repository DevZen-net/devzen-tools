import * as chai from 'chai'
import * as _ from 'lodash'
import { numberEnumToNumberVal } from '../numberEnumToNumberVal'

const { expect } = chai

enum AnimalsEnum {
  dog = 42,
  cat = 13,
}

describe('numberEnumToNumberVal', () => {
  _.each(
    // prettier-ignore
    [
      [42, 42],
      ['42', 42],
      ['dog', 42],
      ['cat', 13],
      ['DOG', 42],
      ['Dog', 42],
      ['foo'],
      [777],
    ],
    ([value, expected]) =>
      it(`${expected ? `Works for ${value} returning ${expected}` : `Undefined for wrong value ${value}`}`, () => {
        expect(numberEnumToNumberVal(AnimalsEnum, value)).to.be.equal(expected)
      })
  )
})
