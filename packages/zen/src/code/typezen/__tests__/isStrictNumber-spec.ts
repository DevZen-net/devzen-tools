import * as chai from 'chai'
import * as _ from 'lodash'
import { isStrictNumber } from '../isStrictNumber'

const { expect } = chai

// Check isNumber() tests for reasoning
describe('isStrictNumber', () => {
  _.each(
    [
      [123, true],
      [123.456, true],

      // false
      // @ts-ignore
      [123_456n, false],
      // [Infinity, false],
      [BigInt('123456'), false],
      [new Number(123), false],
      [new Number('123'), false],
      [new Number('foobar'), false],
      [Number('foobar'), false],
      [Number.NaN, false],
    ],
    ([value, expected]) =>
      it(`for ${value} returns ${expected}`, () => {
        expect(isStrictNumber(value)).to.be.equal(expected)
      })
  )
})
