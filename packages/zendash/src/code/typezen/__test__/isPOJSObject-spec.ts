import * as chai from 'chai'
import * as _ from 'lodash'
import { a_Employee, a_Person } from '../../../test-utils/test-data'
import { toStringSafe } from '../../utils'
import { isPOJSObject } from '../isPOJSObject'

const { expect } = chai

describe('isPOJSObject', () => {
  _.each(
    [
      [undefined, false],
      [null, false],
      [{}, true],
      [{ a: 1 }, true],
      [Object.create({ a: 1 }), true],
      [Object.create(null), true],

      // Instances are not considered POJSOs
      [a_Person, false],
      [a_Employee, false],
      [new (class A {})(), false],
      [new (function Foo() {})(), false],

      // Boxed and builtins are not considered POJSOs
      [new String('foobar'), false],
      [new Number(123), false],
      [new Date(), false],
      [new RegExp('foobar'), false],
      [new Boolean(true), false],
      [new Boolean(false), false],
      [BigInt(123), false],
    ],
    ([value, expected]) =>
      it(`for ${toStringSafe(value)} returns ${expected}`, () => {
        expect(isPOJSObject(value)).to.be.equal(expected)
      })
  )
})
