import * as chai from 'chai'
import * as _ from 'lodash'
import { isBigInt } from '../isBigInt'

const { expect } = chai

// @ts-ignore-next-line
const previouslyMaxSafeInteger = 9_007_199_254_740_991n

const alsoHuge = BigInt(9_007_199_254_740_991)
// 9007199254740991n

const hugeString = BigInt('9007199254740991')
// 9007199254740991n

const hugeHex = BigInt('0x1fffffffffffff')
// 9007199254740991n

const hugeOctal = BigInt('0o377777777777777777')
// 9007199254740991n

const hugeBin = BigInt('0b11111111111111111111111111111111111111111111111111111')

describe('isBigInt', () => {
  _.each(
    [
      [previouslyMaxSafeInteger, true],
      [alsoHuge, true],
      [hugeString, true],
      [hugeHex, true],
      [hugeOctal, true],
      [hugeBin, true],
      [BigInt(1), true],
      [BigInt(987_654_321), true],
      [987_654_321, false],
      // @ts-ignore-next-line
      [987_654_321n, true],
    ],
    ([value, expected]) =>
      it(`for ${value} returns ${expected}`, () => {
        expect(isBigInt(value)).to.be.equal(expected)
      })
  )
})
