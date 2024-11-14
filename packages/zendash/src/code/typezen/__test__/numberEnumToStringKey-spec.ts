import * as chai from 'chai'
import * as _ from 'lodash'
import { numberEnumToStringKey } from '../numberEnumToStringKey'

const { expect } = chai

enum AnimalsEnum {
  dog = 42,
  cat = 13,
}

describe('numberEnumToStringKey', () => {
  _.each(
    // prettier-ignore
    [
      [42, 'dog'],
      ['42', 'dog'],
      ['dog', 'dog'],
      ['cat', 'cat'],
      [13, 'cat'],
      ['DOG', 'dog'],
      ['Dog', 'dog'],
      ['foo'],
      [777],
      ['wrong'],
    ],
    ([value, expected]) =>
      it(`${expected ? `Works for ${value} returning ${expected}` : `Undefined for wrong value ${value}`}`, () => {
        expect(numberEnumToStringKey(AnimalsEnum, value)).to.be.equal(expected)
      })
  )
})
