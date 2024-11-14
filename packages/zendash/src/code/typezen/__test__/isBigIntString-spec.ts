import * as chai from 'chai'
import * as _ from 'lodash'
import { expectType, TypeEqual } from 'ts-expect'
import { BigIntString, isBigIntString } from '../isBigIntString'

const { expect } = chai

describe('isBigIntString', () => {
  _.each(
    [
      ['123n', true],
      ['123.456n', true],
      [
        '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890n',
        true,
      ], // @todo(121): restrict size ??

      // false
      ['foobar', false],
      ['123', false],
      ['123.456', false],
      [123456, false],
      // @ts-ignore OK Random error in WebStorm: TS2737: BigInt literals are not available when targeting lower than ES2020.
      [123_456n, false],
      [Infinity, false],
    ],
    ([value, expected]) =>
      it(`for ${value} returns ${expected}`, () => {
        expect(isBigIntString(value as any)).to.be.equal(expected)
      })
  )

  describe(`## Typings`, () => {
    it(`## BigIntString Typings`, () => {
      expectType<BigIntString>('123n')
      expectType<BigIntString>('123.456n')

      // @ts-expect-error OK: 123 is not a string
      expectType<BigIntString>(123)
      // @ts-expect-error OK: '123' is not matched
      expectType<BigIntString>(`123`)
      // @ts-expect-error OK: TS2345: Argument of type 'foobar' is not assignable to parameter of type `${number}`
      expectType<BigIntString>('foobar')
    })

    it(`## isNumberString Typings`, () => {
      let val
      if (isBigIntString(val)) expectType<TypeEqual<BigIntString, typeof val>>(true)
      // @ts-expect-error OK: TS2345: Argument of type string is not assignable to parameter of type `${number}`
      if (!isBigIntString(val)) expectType<TypeEqual<BigIntString, typeof val>>(true)
    })
  })
})
