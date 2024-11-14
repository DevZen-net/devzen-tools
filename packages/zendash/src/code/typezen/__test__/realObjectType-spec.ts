import * as chai from 'chai'
import * as _ from 'lodash'
import { a_Employee, a_Person, get_plainIteratorPOJSO } from '../../../test-utils/test-data'
import { realObjectType } from '../realObjectType'

const { expect } = chai

describe('objectType', () => {
  _.each(
    [
      [undefined, undefined],
      [null, undefined],

      // POJSOs
      [{}, 'pojso'],
      [{ a: 1 }, 'pojso'],
      [Object.create({ a: 1 }), 'pojso'],
      [get_plainIteratorPOJSO(), 'pojso'],

      // instances
      [a_Person, 'instance'],
      [a_Employee, 'instance'],

      // Boxed and builtins are not considered objects / instances
      [new String('foobar'), undefined],
      [new Number(123), undefined],
      [new Date(), undefined],
      [new RegExp('foobar'), undefined],
      [new Boolean(true), undefined],
      [new Boolean(false), undefined],
      [BigInt(123), undefined],
    ],
    ([value, expected]) =>
      it(`for ${value} returns ${expected}`, () => {
        expect(realObjectType(value)).to.be.equal(expected)
      })
  )
})
