import * as chai from 'chai'
import * as _ from 'lodash'
import { isBoxedPrimitive } from '../isBoxedPrimitive'

const { expect } = chai

describe('isBoxedPrimitive', () => {
  _.each(
    [
      ['normal string', false],
      [new String('boxed string'), true],
      [new String('boxed string').toString(), false],

      [123, false],
      [new Number(123), true],
      [new Number(123).valueOf(), false],

      [true, false],
      [new Boolean(true), true],
      [new Boolean(true).valueOf(), false],
    ],
    ([value, expected]) =>
      it(`for ${value} returns ${expected}`, () => {
        expect(isBoxedPrimitive(value)).to.be.equal(expected)
      })
  )
})
