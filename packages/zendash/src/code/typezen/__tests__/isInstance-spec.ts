import * as chai from 'chai'
import * as _ from 'lodash'
import {
  a_Employee,
  a_Function_arrowNamed,
  a_Function_arrows_anonymous,
  a_Function_async_arrow_anonymous,
  a_Function_async_arrow_named,
  a_Function_async_normal_named,
  a_Function_Async_normalAnonymous,
  a_Function_normalAnonymous,
  a_Function_normalNamed,
  a_GeneratorFunction_anonymous,
  a_GeneratorFunction_async_anonymous,
  a_GeneratorFunction_async_named,
  a_GeneratorFunction_named,
  a_Person,
  add_CommonProps,
  Employee,
  Person,
} from '../../../test-utils/test-data'
import { toStringSafe } from '../../utils'
import { isInstance } from '../isInstance'

const { expect } = chai

describe('isInstance', () => {
  _.each(
    [
      // true for all isRealObject instances, created with new MyClass of a user-defined class only, or new FunctionConstructor
      ['a simple instance', new (class MyClass {})(), true],
      ['aPerson', a_Person, true],
      ['aPerson', a_Employee, true],
      [
        'FunctionConstructor with new Function()',
        new (function FunctionConstructor() {} as any)(),
        true,
      ],

      // false for pojsos
      ['pojso', {}, false],
      ['pojso 2', { a: 1 }, false],

      // false for pojsos with prototype
      ['Object.create({})', Object.create({ b: 1 }), false],
      ['Object.create({}) with common props', add_CommonProps(Object.create({ b: 1 })), false],
      ['Object.create(null)', Object.create(null), false],
      ['Object.create(null) with common props', add_CommonProps(Object.create(null)), false],
      ['new Object()', new Object(), false],
      ['new Object()', add_CommonProps(new Object()), false],

      // Errors are excluded
      ['Error', new Error(), false],
      ['TypeError', new TypeError(), false],
      ['SyntaxError', new SyntaxError(), false],
      ['ReferenceError', new ReferenceError(), false],
      ['RangeError', new RangeError(), false],
      ['EvalError', new EvalError(), false],

      // false for all other values
      // primitives
      ['string', 'aaa', false],
      ['number', 1, false],
      ['boolean', true, false],
      ['null', null, false],
      ['undefined', undefined, false],
      ['symbol', Symbol(), false],

      ['array', [], false],
      ['new Array', [], false],
      ['String', new String(''), false],
      ['Number', new Number(1), false],
      ['Boolean', new Boolean(true), false],
      ['date', new Date(), false],
      ['regexp', /a/, false],
      ['RegExp', new RegExp(/a/), false],
      ['map', new Map(), false],
      ['set', new Set(), false],
      ['weakmap', new WeakMap(), false],
      ['weakset', new WeakSet(), false],
      ['promise.resolve', Promise.resolve, false], // see https://stackoverflow.com/a/72326559/799502
      ['promise.reject', Promise.reject, false],
      ['Promise', Promise, false],
      ['promise', new Promise(() => {}), false],
      ['promise', Promise.resolve('foo'), false],
      ['function', Function, false],
      ['generator', a_GeneratorFunction_named, false],
      ['generator', a_GeneratorFunction_anonymous, false],
      ['asyncGenerator', a_GeneratorFunction_async_named, false],
      ['asyncGenerator', a_GeneratorFunction_async_anonymous, false],
      ['asyncFunction', a_Function_async_normal_named, false],
      ['asyncFunction', a_Function_Async_normalAnonymous, false],
      ['asyncFunction', a_Function_async_arrow_named, false],
      ['asyncFunction', a_Function_async_arrow_anonymous, false],
      ['function', a_Function_normalNamed, false],
      ['function', a_Function_normalAnonymous, false],
      ['function', a_Function_arrowNamed, false],
      ['function', a_Function_arrows_anonymous, false],
      ['class Person', Person, false],
      ['subclass Employee', Employee, false],
    ],
    ([descr, value, expected]: [string, any, boolean]) =>
      it(`${descr}: for ${toStringSafe(value)} returns ${expected}`, () => {
        expect(isInstance(value)).to.be.equal(expected)
      })
  )
})
