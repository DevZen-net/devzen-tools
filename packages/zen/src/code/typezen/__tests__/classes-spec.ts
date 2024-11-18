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
  Employee,
  Person,
} from '../../../test-utils/test-data'

import { classType, constructor, isClass, isUserClass } from '../classes'

const { expect } = chai

describe('classes', () => {
  describe('isClass', () => {
    _.each(
      [
        [Person, true],
        [Employee, true],

        ...[
          a_Function_arrows_anonymous,
          a_Function_arrowNamed,
          a_Function_async_arrow_anonymous,
          a_Function_async_arrow_named,
          a_GeneratorFunction_async_anonymous,
          a_GeneratorFunction_async_named,
          a_Function_Async_normalAnonymous,
          a_Function_async_normal_named,
          a_GeneratorFunction_anonymous,
          a_GeneratorFunction_named,
          a_Function_normalAnonymous,
          a_Function_normalNamed,
        ].map((f) => [f, false]),

        // Built in native "classes" - might not all be extendable though
        [Promise, true],
        [Object, true],
        [Array, true],
        [String, true],
        [Number, true],
        [Boolean, true],
        [Date, true],
        [RegExp, true],
        [Error, true],
        [Function, true],
        [Map, true],
        [Set, true],
        [WeakMap, true],
        [WeakSet, true],
        [ArrayBuffer, true],
        [DataView, true],
        [Float32Array, true],
        [Float64Array, true],
        [Int8Array, true],
        [Int16Array, true],
        [Int32Array, true],
        [Uint8Array, true],
        [Uint8ClampedArray, true],
        [Uint16Array, true],
        [Uint32Array, true],
        [BigInt64Array, true],
        [BigUint64Array, true],
        [Promise, true],

        // Proxy is not a constructor, it can't be used as a class or be extended, compile error
        [Proxy, false],
        // These 2 are not classes, they can't be new-ed
        [Symbol, false],
        [BigInt, false],
      ],
      ([value, expected]) =>
        it(`for ${value} returns ${expected}`, () => {
          expect(isClass(value)).to.be.equal(expected)
        })
    )
  })

  describe('isUserClass', () => {
    _.each(
      [
        [class Foo {}, true],
        [Person, true],
        [Employee, true],

        // Everything else is not a "user Class"
        ...[
          a_Function_arrows_anonymous,
          a_Function_arrowNamed,
          a_Function_async_arrow_anonymous,
          a_Function_async_arrow_named,
          a_GeneratorFunction_async_anonymous,
          a_GeneratorFunction_async_named,
          a_Function_Async_normalAnonymous,
          a_Function_async_normal_named,
          a_GeneratorFunction_anonymous,
          a_GeneratorFunction_named,
          a_Function_normalAnonymous,
          a_Function_normalNamed,
        ].map((f) => [f, false]),

        ...[
          // Built in native "classes" are not userClasses
          Promise,
          Object,
          Array,
          String,
          Number,
          Boolean,
          Date,
          RegExp,
          Error,
          Function,
          Map,
          Set,
          WeakMap,
          WeakSet,
          ArrayBuffer,
          DataView,
          Float32Array,
          Float64Array,
          Int8Array,
          Int16Array,
          Int32Array,
          Uint8Array,
          Uint8ClampedArray,
          Uint16Array,
          Uint32Array,
          BigInt64Array,
          BigUint64Array,
          Promise,

          // not classes
          Symbol,
          BigInt,
        ].map((f) => [f, false]),

        // Proxy is not a constructor anyway, it can't be used as a class or be extended, compile error
        [Proxy, false],
      ],
      ([value, expected]) =>
        it(`for ${value} returns ${expected}`, () => {
          expect(isUserClass(value)).to.be.equal(expected)
        })
    )
  })

  describe('classType', () => {
    _.each(
      [
        // functions are not classes!
        ['asyncNormalFunction', a_Function_async_normal_named, undefined],
        ['a_Function_Async_normalAnonymous', a_Function_Async_normalAnonymous, undefined],

        ['a_Function_async_arrow_named', a_Function_async_arrow_named, undefined],
        ['a_Function_async_arrow_anonymous', a_Function_async_arrow_anonymous, undefined],

        ['a_GeneratorFunction_async_named', a_GeneratorFunction_async_named, undefined],
        ['a_GeneratorFunction_async_anonymous', a_GeneratorFunction_async_anonymous, undefined],

        ['a_Function_normalNamed', a_Function_normalNamed, undefined],
        ['a_Function_normalAnonymous', a_Function_normalAnonymous, undefined],

        ['arrowFunction', a_Function_arrowNamed, undefined],
        ['a_Function_arrows_anonymous', a_Function_arrows_anonymous, undefined],

        ['a_GeneratorFunction_named', a_GeneratorFunction_named, undefined],
        ['a_GeneratorFunction_anonymous', a_GeneratorFunction_anonymous, undefined],

        [Promise.resolve, undefined], // see https://stackoverflow.com/a/72326559/799502

        ['class Person', Person, 'userClass'],
        ['subclass Employee', Employee, 'userClass'],

        ['Promise', Promise, 'systemClass'],
        ['Object', Object, 'systemClass'],
        ['Array', Array, 'systemClass'],
        ['String', String, 'systemClass'],
        ['Number', Number, 'systemClass'],
        ['Boolean', Boolean, 'systemClass'],
        ['Date', Date, 'systemClass'],
        ['RegExp', RegExp, 'systemClass'],
        ['Error', Error, 'systemClass'],
        ['Function', Function, 'systemClass'],
        ['Map', Map, 'systemClass'],
        ['Set', Set, 'systemClass'],
        ['WeakMap', WeakMap, 'systemClass'],
        ['WeakSet', WeakSet, 'systemClass'],
        ['ArrayBuffer', ArrayBuffer, 'systemClass'],
        ['DataView', DataView, 'systemClass'],
        ['Float32Array', Float32Array, 'systemClass'],
        ['Float64Array', Float64Array, 'systemClass'],
        ['Int8Array', Int8Array, 'systemClass'],
        ['Int16Array', Int16Array, 'systemClass'],
        ['Int32Array', Int32Array, 'systemClass'],
        ['Uint8Array', Uint8Array, 'systemClass'],
        ['Uint8ClampedArray', Uint8ClampedArray, 'systemClass'],
        ['Uint16Array', Uint16Array, 'systemClass'],
        ['Uint32Array', Uint32Array, 'systemClass'],
        ['Promise', Promise, 'systemClass'],

        ['Proxy', Proxy, undefined], // Proxy is not a constructor, it can't be used as a class or be extended

        ['Symbol', Symbol, undefined],
        ['BigInt', BigInt, undefined],

        ['number', 1, undefined],
        ['string', 'foo', undefined],
      ],
      ([descr, value, expected]: [string, any, boolean]) =>
        it(`${descr}: for ${value} returns ${expected}`, () => {
          expect(classType(value)).to.be.equal(expected)
        })
    )
  })

  describe('constructor', () => {
    const AsyncFunctionConstructor = async function () {}.constructor
    const AsyncGeneratorFunctionConstructor = async function* () {}.constructor
    const GeneratorFunctionConstructor = function* () {}.constructor

    _.each(
      [
        // functions have a constructor!
        ['asyncNormalFunction', a_Function_async_normal_named, AsyncFunctionConstructor],
        [
          'a_Function_Async_normalAnonymous',
          a_Function_Async_normalAnonymous,
          AsyncFunctionConstructor,
        ],
        //
        [
          'a_Function_async_arrow_named',
          a_Function_async_arrow_named,
          AsyncFunctionConstructor,
        ],
        [
          'a_Function_async_arrow_anonymous',
          a_Function_async_arrow_anonymous,
          AsyncFunctionConstructor,
        ],

        [
          'a_GeneratorFunction_async_named',
          a_GeneratorFunction_async_named,
          AsyncGeneratorFunctionConstructor,
        ],
        [
          'a_GeneratorFunction_async_anonymous',
          a_GeneratorFunction_async_anonymous,
          AsyncGeneratorFunctionConstructor,
        ],
        //
        ['a_Function_normalNamed', a_Function_normalNamed, Function],
        ['a_Function_normalAnonymous', a_Function_normalAnonymous, Function],

        ['arrowFunction', a_Function_arrowNamed, Function],
        ['a_Function_arrows_anonymous', a_Function_arrows_anonymous, Function],

        ['a_GeneratorFunction_named', a_GeneratorFunction_named, GeneratorFunctionConstructor],
        [
          'a_GeneratorFunction_anonymous',
          a_GeneratorFunction_anonymous,
          GeneratorFunctionConstructor,
        ],

        // User classes
        ['a Person instance', a_Person, Person],
        ['an Employee sub-instance', a_Employee, Employee],

        // System classes
        ['Promise.resolve()', Promise.resolve('foo'), Promise],
        ['new Promise()', new Promise((resolve) => resolve('foo')), Promise],
        ['new Object()', new Object(), Object],
        ['new Array()', new Array(), Array],
        ['new String()', new String(), String],
        ['new Number()', new Number(), Number],
        ['new Boolean()', new Boolean(), Boolean],
        ['new Date()', new Date(), Date],
        ['new RegExp()', new RegExp(''), RegExp],
        ['new Error()', new Error(), Error],
        ['new Function()', new Function(), Function],
        ['new Map()', new Map(), Map],
        ['new Set()', new Set(), Set],

        ['new WeakMap()', new WeakMap(), WeakMap],
        ['new WeakSet()', new WeakSet(), WeakSet],

        ['new Promise()', new Promise(() => {}), Promise],

        ['new ArrayBuffer()', new ArrayBuffer(8), ArrayBuffer],
        ['new DataView()', new DataView(new ArrayBuffer(8)), DataView],

        ['new Float32Array()', new Float32Array(), Float32Array],
        ['new Float64Array()', new Float64Array(), Float64Array],
        ['new Int8Array()', new Int8Array(), Int8Array],
        ['new Int16Array()', new Int16Array(), Int16Array],
        ['new Int32Array()', new Int32Array(), Int32Array],
        ['new Uint8Array()', new Uint8Array(), Uint8Array],
        ['new Uint8ClampedArray()', new Uint8ClampedArray(), Uint8ClampedArray],
        ['new Uint16Array()', new Uint16Array(), Uint16Array],
        ['new Uint32Array()', new Uint32Array(), Uint32Array],
        ['new BigInt64Array()', new BigInt64Array(), BigInt64Array],
        ['new BigUint64Array()', new BigUint64Array(), BigUint64Array],

        // Proxy is not a constructor, it can't be used as a class or be extended
        ['new Proxy()', new Proxy({}, {}), Object],

        // These 2 are not classes, they can't be new-ed or extended
        ['Symbol', Symbol('foo'), Symbol],
        ['BigInt', BigInt(123n), BigInt],

        // Primitives
        ['number', 1, Number],
        ['string', 'foo', String],
        ['boolean', true, Boolean],
        ['null', null, undefined],
        ['undefined', undefined, undefined],
        ['symbol', Symbol('foo'), Symbol],
        ['bigint', 123n, BigInt],
      ],
      ([descr, value, expected]: [string, any, boolean]) =>
        it(`${descr}: for ${_.isSymbol(value) ? String(value) : value} returns ${expected}`, () => {
          expect(constructor(value)).to.be.equal(expected)
        })
    )
  })
})
