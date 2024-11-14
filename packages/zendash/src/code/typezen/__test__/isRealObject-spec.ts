import * as chai from 'chai'
import * as _ from 'lodash'
import { expectType, TypeEqual } from 'ts-expect'
import { ReadonlyDeep } from 'type-fest'
import {
  a_Array_of_Tvalues,
  a_Array_ofKeys,
  a_childObj,
  a_Employee,
  a_instance_withCommonProps,
  a_parentObj,
  a_Person,
  Employee,
  Person,
  singleTypesAndPossibleValues,
} from '../../../test-utils/test-data'
// local
import * as _z from '../../index'
import { IsRealObject } from '../isRealObject'

const { expect } = chai

describe('isRealObject & its usage:', () => {
  describe('`_z.isRealObject` distinquishes any kind of {} from any other types (->, [], Map, Set), even if {} is an instance (unlike lodashes functions that dont empower it).', () => {
    it('`_z.isRealObject` recognises all {} as Objects', () => {
      expect(_z.isRealObject({})).to.be.true
      expect(_z.isRealObject(new (function Foo() {})())).to.be.true // unlike lodash _.isPlainObject
      expect(_z.isRealObject(new (class FooBar {})())).to.be.true // unlike lodash _.isPlainObject
      expect(_z.isRealObject(a_parentObj)).to.be.true // unlike lodash _.isPlainObject
      expect(_z.isRealObject(a_childObj)).to.be.true // unlike lodash _.isPlainObject
      expect(_z.isRealObject(a_Person)).to.be.true // unlike lodash _.isPlainObject
      expect(_z.isRealObject(a_Employee)).to.be.true // unlike lodash _.isPlainObject
      expect(_z.isRealObject(a_instance_withCommonProps)).to.be.true // unlike lodash _.isPlainObject
      expect(_z.isRealObject(Object.create(null))).to.be.true
      expect(_z.isRealObject(Object.create({}))).to.be.true // unlike lodash _.isPlainObject
    })

    it('`_z.isRealObject` recognises all Arrays & Functions and Boxed items as NON Real Object', () => {
      expect(_z.isRealObject([])).to.be.false
      expect(_z.isRealObject(() => {})).to.be.false
      expect(_z.isRealObject(Boolean(true))).to.be.false
      expect(_z.isRealObject(new Boolean(true))).to.be.false
      expect(_z.isRealObject(Number(12))).to.be.false
      expect(_z.isRealObject(new Number(12))).to.be.false

      // Reconsider those to be true!
      // They are not real isPojso, but they are not arrays or functions either
      // @todo: isPojso: these are all false
      expect(_z.isRealObject(new Map())).to.be.false
      expect(_z.isRealObject(new Set())).to.be.false
      expect(_z.isRealObject(new RegExp(/./))).to.be.false
      expect(_z.isRealObject(new RegExp(/./))).to.be.false
      expect(_z.isRealObject(/./)).to.be.false
    })

    it('`lodash _.isObject` is too broad - considers Array, Function, Set, Map, RegExp as `Object`', () => {
      expect(_.isObject(a_instance_withCommonProps)).to.be.true
      expect(_.isObject({})).to.be.true

      // lodash bad parts starting: _.isObject is too broad, it forces us to explicitly use isArray, isFunction, isXxx...
      expect(_.isObject([])).to.be.true
      expect(_.isObject(() => {})).to.be.true
      expect(_.isObject(new Map())).to.be.true
      expect(_.isObject(new Set())).to.be.true
      expect(_.isObject(new RegExp(/./))).to.be.true
      expect(_.isObject(/./)).to.be.true
      expect(_.isObject(new Boolean(true))).to.be.true
      expect(_.isObject(new Number(111))).to.be.true
    })

    it('`lodash _.isPlainObject` (lodash) is too strict - non `Object` constructed {} with a proto, are not plainObjects!', () => {
      expect(_.isPlainObject({})).to.be.true // ok... but
      expect(_.isPlainObject(a_parentObj)).to.be.true // ok... but!

      expect(_.isPlainObject(a_childObj)).to.be.false // ... very bad!
      expect(_.isPlainObject(a_instance_withCommonProps)).to.be.false // ... very bad!
      expect(_.isPlainObject(a_Person)).to.be.false // ... very bad!
      expect(_.isPlainObject(a_Employee)).to.be.false // ... very bad!

      expect(_.isPlainObject(Object.create(null))).to.be.true // ... ok... but!
      expect(_.isPlainObject(Object.create({}))).to.be.false // ... very bad!

      expect(_.isPlainObject([])).to.be.false // ok, but still wobbly
      expect(_.isPlainObject(() => {})).to.be.false // ok, but still wobbly
    })
  })

  describe('`_Β.isRealObject` returns false for all single values:', () => {
    for (const typeName in singleTypesAndPossibleValues) {
      for (const value of singleTypesAndPossibleValues[typeName]) {
        it(`\`_z.isRealObject\` for '${typeName}':`, () => {
          expect(_z.isRealObject(value)).to.be.false
        })
      }
    }
  })

  describe(`IsRealObject typing tests:`, () => {
    describe(`IsRealObject is false for all Primitives, 'SystemClasses' etc:`, () => {
      it(`normal non-RealObjects:`, () => {
        expectType<IsRealObject<1>>(false)
        expectType<IsRealObject<null>>(false)
        expectType<IsRealObject<'a string'>>(false)
        // expectType<IsRealObject<typeof 'a string'>>(false)
        expectType<IsRealObject<String>>(false)
        expectType<IsRealObject<symbol>>(false)
        expectType<IsRealObject<Symbol>>(false)
        expectType<IsRealObject<typeof a_Array_ofKeys>>(false)
        expectType<IsRealObject<Set<any>>>(false)
        expectType<IsRealObject<WeakSet<any>>>(false)
        expectType<IsRealObject<Function>>(false)
        expectType<IsRealObject<Array<any>>>(false)
        expectType<IsRealObject<typeof a_Array_ofKeys>>(false)
        const const_ReadOnly_Array = [1, 2, 3] as const
        expectType<IsRealObject<typeof const_ReadOnly_Array>>(false)
      })
      it(`ReadOnly / const non-RealObjects:`, () => {
        const constNumber = 123 as const
        expectType<TypeEqual<IsRealObject<typeof constNumber>, false>>(true)
        const constBigInt = 456n as const
        expectType<TypeEqual<IsRealObject<typeof constBigInt>, false>>(true)

        const constArray = [1, 2, 3] as const
        expectType<TypeEqual<IsRealObject<typeof constArray>, false>>(true)

        expectType<TypeEqual<IsRealObject<Readonly<typeof a_Array_of_Tvalues>>, false>>(true)
        expectType<TypeEqual<IsRealObject<ReadonlyDeep<typeof a_Array_of_Tvalues>>, false>>(
          true
        )
        expectType<TypeEqual<IsRealObject<ReadonlyArray<typeof a_Array_of_Tvalues>>, false>>(
          true
        )
        expectType<
          TypeEqual<IsRealObject<Readonly<ReadonlyDeep<typeof a_Array_of_Tvalues>>>, false>
        >(true)
        expectType<
          TypeEqual<
            IsRealObject<Readonly<ReadonlyDeep<ReadonlyArray<typeof a_Array_of_Tvalues>>>>,
            false
          >
        >(true)
      })
    })
    describe(`IsRealObject is true for all realObjects:`, () => {
      it(`normal realObjects:`, () => {
        expectType<IsRealObject<typeof a_Person>>(true)
        expectType<IsRealObject<Person>>(true)
        expectType<IsRealObject<typeof a_Employee>>(true)
        expectType<IsRealObject<Employee>>(true)

        expectType<IsRealObject<typeof a_childObj>>(true)
        expectType<IsRealObject<typeof a_parentObj>>(true)
        expectType<IsRealObject<{}>>(true)
        expectType<IsRealObject<{ a: number }>>(true)

        const anObjectWithProto = Object.create(a_childObj)
        expectType<IsRealObject<typeof anObjectWithProto>>(true)

        // ### playground
        // const temp: IsRealObject<Person> = null as any
      })
      it(`ReadOnly & const realObjects:`, () => {
        // realObject - instances
        const constObject = { a: 1 } as const
        expectType<TypeEqual<IsRealObject<typeof constObject>, true>>(true)

        expectType<TypeEqual<IsRealObject<Readonly<typeof a_Employee>>, true>>(true)
        expectType<TypeEqual<IsRealObject<ReadonlyDeep<typeof a_Employee>>, true>>(true)
        expectType<TypeEqual<IsRealObject<Readonly<ReadonlyDeep<typeof a_Employee>>>, true>>(
          true
        )

        expectType<TypeEqual<IsRealObject<Readonly<typeof a_Person>>, true>>(true)
        expectType<TypeEqual<IsRealObject<ReadonlyDeep<typeof a_Person>>, true>>(true)
        expectType<TypeEqual<IsRealObject<Readonly<ReadonlyDeep<typeof a_Person>>>, true>>(true)
      })
    })
  })
})
