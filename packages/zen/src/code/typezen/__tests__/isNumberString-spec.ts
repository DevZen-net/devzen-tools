import * as chai from 'chai'
import * as _ from 'lodash'
import { expectType, TypeEqual } from 'ts-expect'
import { isNumberString, NumberString } from '../isNumberString'

const { expect } = chai

describe('isNumberString', () => {
  _.each(
    [
      ['123', true],
      ['123.456', true],
      [
        '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
        true,
      ], // @todo(121): restrict size

      // false
      ['foobar', false],
      ['123n', false],
      [123456, false],
      [123_456n, false],
      [Infinity, false],
    ],
    ([value, expected]) =>
      it(`for ${value} returns ${expected}`, () => {
        expect(isNumberString(value as any)).to.be.equal(expected)
      })
  )

  describe(`## Typings`, () => {
    it(`## NumberString Typings`, () => {
      expectType<NumberString>('123')
      expectType<NumberString>('123.456')

      // @ts-expect-error OK: 123 is not a string
      expectType<NumberString>(123)
      // @ts-expect-error OK: 123n is not matched
      expectType<NumberString>(`123n`)
      // @ts-expect-error OK: TS2345: Argument of type 'foobar' is not assignable to parameter of type `${number}`
      expectType<NumberString>('foobar')
    })

    it(`## isNumberString Typings`, () => {
      let val
      if (isNumberString(val)) expectType<TypeEqual<NumberString, typeof val>>(true)
      // @ts-expect-error OK: TS2345: Argument of type string is not assignable to parameter of type `${number}`
      if (!isNumberString(val)) expectType<TypeEqual<NumberString, typeof val>>(true)
    })
  })
})
