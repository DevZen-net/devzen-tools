import * as chai from 'chai'
import * as _ from 'lodash'
import { isNumber } from '../isNumber'

const { expect } = chai

describe('isNumber', () => {
  _.each(
    [
      [123.456, true],
      [123_456n, true],
      [Number('123'), true],
      [BigInt('123456'), true],
      [Number.POSITIVE_INFINITY, true],

      // false
      [new Number(456), false],
      [new Number('789'), false],
      [new Number('foobar'), false],
      [Number('foobar'), false],
      [Number.NaN, false],
    ],
    ([value, expected]) =>
      it(`for ${value} returns ${expected}`, () => {
        expect(isNumber(value)).to.be.equal(expected)
      })
  )

  describe('isNumber background / reasoning', () => {
    it('typeof NaN === "number"', () => {
      expect(typeof Number.NaN).to.be.equal('number')
    })

    it('_.isNumber(NaN) === true', () => {
      expect(_.isNumber(Number.NaN)).to.be.equal(true)
    })

    it('_.isNumber(Number("foo")) === true', () => {
      expect(_.isNumber(Number('foo'))).to.be.equal(true)
    })

    it('_.isNumber(new Number("foo")) === true', () => {
      expect(_.isNumber(new Number('foo'))).to.be.equal(true)
    })

    it('_.isNumber(new Number("123")) === true', () => {
      expect(_.isNumber(new Number('123'))).to.be.equal(true)
    })

    it('_.isNumber(BigInt(123)) === false', () => {
      expect(_.isNumber(BigInt(123))).to.be.equal(false)
    })
  })
})
