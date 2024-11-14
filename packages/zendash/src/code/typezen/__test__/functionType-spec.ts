import * as chai from 'chai'
import * as _ from 'lodash'
import {
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
  Employee,
  Person,
} from '../../../test-utils/test-data'
import { functionType } from '../functionType'

const { expect } = chai

describe('functionType', () => {
  _.each(
    [
      ['asyncNormalFunction', a_Function_async_normal_named, 'AsyncFunction'],
      ['a_Function_Async_normalAnonymous', a_Function_Async_normalAnonymous, 'AsyncFunction'],

      ['a_Function_async_arrow_named', a_Function_async_arrow_named, 'AsyncFunction'],
      ['a_Function_async_arrow_anonymous', a_Function_async_arrow_anonymous, 'AsyncFunction'],

      [
        'a_GeneratorFunction_async_named',
        a_GeneratorFunction_async_named,
        'AsyncGeneratorFunction',
      ],
      [
        'a_GeneratorFunction_async_anonymous',
        a_GeneratorFunction_async_anonymous,
        'AsyncGeneratorFunction',
      ],

      ['a_Function_normalNamed', a_Function_normalNamed, 'Function'],
      ['a_Function_normalAnonymous', a_Function_normalAnonymous, 'Function'],

      ['Symbol', Symbol, 'Function'],
      ['BigInt', BigInt, 'Function'],

      ['arrowFunction', a_Function_arrowNamed, 'ArrowFunction'],
      ['a_Function_arrows_anonymous', a_Function_arrows_anonymous, 'ArrowFunction'],

      ['a_GeneratorFunction_named', a_GeneratorFunction_named, 'GeneratorFunction'],
      ['a_GeneratorFunction_anonymous', a_GeneratorFunction_anonymous, 'GeneratorFunction'],

      [Promise.resolve, 'ArrowFunction'], // see https://stackoverflow.com/a/72326559/799502

      ['class', class MyClass {}, 'class'],
      ['class Person', Person, 'class'],
      ['subclass Employee', Employee, 'class'],

      ['Promise', Promise, 'class'],
      ['Object', Object, 'class'],
      ['Array', Array, 'class'],
      ['String', String, 'class'],
      ['Number', Number, 'class'],
      ['Boolean', Boolean, 'class'],
      ['Date', Date, 'class'],
      ['RegExp', RegExp, 'class'],
      ['Error', Error, 'class'],
      ['Function', Function, 'class'],
      ['Map', Map, 'class'],
      ['Set', Set, 'class'],
      ['WeakMap', WeakMap, 'class'],
      ['WeakSet', WeakSet, 'class'],
      ['ArrayBuffer', ArrayBuffer, 'class'],
      ['DataView', DataView, 'class'],
      ['Float32Array', Float32Array, 'class'],
      ['Float64Array', Float64Array, 'class'],
      ['Int8Array', Int8Array, 'class'],
      ['Int16Array', Int16Array, 'class'],
      ['Int32Array', Int32Array, 'class'],
      ['Uint8Array', Uint8Array, 'class'],
      ['Uint8ClampedArray', Uint8ClampedArray, 'class'],
      ['Uint16Array', Uint16Array, 'class'],
      ['Uint32Array', Uint32Array, 'class'],
      ['Promise', Promise, 'class'],

      ['Proxy', Proxy, 'ArrowFunction'], // Proxy is not a constructor, it can't be used as a class or be extended

      ['number', 1, undefined],
      ['string', 'foo', undefined],
    ],
    ([descr, value, expected]: [string, any, boolean]) =>
      it(`for ${value} returns ${expected}`, () => {
        expect(functionType(value)).to.be.equal(expected)
      })
  )
})
