import { expectType, TypeEqual, TypeOf } from 'ts-expect'
import { ReadonlyDeep } from 'type-fest'
import {
  a_Array_of_Tvalues,
  a_AsyncGenerator_of_Tvalues_withCommonProps,
  a_Employee,
  a_Generator_of_Tvalues_withCommonProps,
  a_Map_of_TMapKeys_Tvalues,
  a_Person,
  a_Set_of_Tvalues,
  a_WeakMap_of_Person_Employees,
  a_WeakSet_of_Person,
  Employee,
  get_arguments,
  get_AsyncGenerator_of_Tvalues,
  get_Generator_of_Tvalues,
  Person,
  symbolProp,
} from '../../../test-utils/test-data'
import { IsMany, Many } from '../isMany'
import { Primitive } from '../isPrimitive'
import { IsSingleOrWeak, Single } from '../isSingle'

expectType<Many<any, any>>(new Int8Array())
expectType<Many<any, any>>(new Uint8Array())
expectType<Many<any, any>>(new Uint8ClampedArray())
expectType<Many<any, any>>(new Int16Array())
expectType<Many<any, any>>(new Uint16Array())
expectType<Many<any, any>>(new Int32Array())
expectType<Many<any, any>>(new Uint32Array())
expectType<Many<any, any>>(new Float32Array())
expectType<Many<any, any>>(new Float64Array())
expectType<Many<any, any>>(new BigInt64Array())
expectType<Many<any, any>>(new BigUint64Array())
expectType<Many<any, any>>(new Array())
expectType<Many<any, any>>({})
expectType<Many<any, any>>(Object.create(null))
expectType<Many<any, any>>(Object.create({}))
expectType<Many<any, any>>(new Object())
expectType<Many<any, any>>(new Function())
expectType<Many<any, any>>(a_Person)
expectType<Many<any, any>>(a_Employee)
expectType<Many<any, any>>(get_Generator_of_Tvalues())
expectType<Many<any, any>>(get_AsyncGenerator_of_Tvalues())
expectType<Many<any, any>>(get_arguments())
expectType<Many<any, any>>(new Set())
expectType<Many<any, any>>(new Map())
expectType<Many<any, any>>(new ArrayBuffer(1))
expectType<Many<any, any>>(new SharedArrayBuffer(1))

// All `Single` are NOT `Many`

expectType<TypeOf<Many<any, any>, Single>>(false)
// All `Primitives` are NOT `Many`
expectType<TypeOf<Many<any, any>, Primitive>>(false)

// Testing all single VALUE INSTANCES are NOT `Many`

// # Primitives - are NOT `Many`

expectType<TypeOf<Many<any, any>, 'a string'>>(false)
expectType<TypeOf<Many<any, any>, 123>>(false)
expectType<TypeOf<Many<any, any>, 123n>>(false)
expectType<TypeOf<Many<any, any>, true>>(false)
expectType<TypeOf<Many<any, any>, undefined>>(false)
expectType<TypeOf<Many<any, any>, null>>(false)
expectType<TypeOf<Many<any, any>, typeof symbolProp>>(false)
expectType<TypeOf<Many<any, any>, typeof Number.NaN>>(false)

// Should NOT be `Many`, at Runtime they are NOT `isMany`, they are `isSingle`!

const anError = new Error()
const aDate = new Date()
const aRegex = /regex/
const aPromise = Promise.resolve()
const aBoolean = new Boolean(true)
const aString = new String('string')
const aNumber = new Number(123)
const aDataView = new DataView(new ArrayBuffer(8))

// @ts-expect-error: @todo(115): wish we could fix this!
expectType<TypeOf<Many<any, any>, typeof anError>>(false)
// @ts-expect-error: @todo(115): wish we could fix this!
expectType<TypeOf<Many<any, any>, typeof aDate>>(false)
// @ts-expect-error: @todo(115): wish we could fix this!
expectType<TypeOf<Many<any, any>, typeof aRegex>>(false)
const aFunction = function () {}
// @ts-expect-error: @todo(115): wish we could fix this!
expectType<TypeOf<Many<any, any>, typeof aFunction>>(false)
// @ts-expect-error: @todo(115): wish we could fix this!
expectType<TypeOf<Many<any, any>, typeof aPromise>>(false)
// @ts-expect-error: @todo(115): wish we could fix this!
expectType<TypeOf<Many<any, any>, typeof aBoolean>>(false)
// @ts-expect-error: @todo(115): wish we could fix this!
expectType<TypeOf<Many<any, any>, typeof aString>>(false)
// @ts-expect-error: @todo(115): wish we could fix this!
expectType<TypeOf<Many<any, any>, typeof aNumber>>(false)
// @ts-expect-error: @todo(115): wish we could fix this!
expectType<TypeOf<Many<any, any>, typeof aDataView>>(false)

// # Weak - these should NOT be either `Many` nor `Single`

// @ts-expect-error: @todo(115): wish we could fix this!
expectType<TypeOf<Many<any, any>, typeof a_WeakMap_of_Person_Employees>>(false)
// @ts-expect-error: @todo(115): wish we could fix this!
expectType<TypeOf<Many<any, any>, typeof a_WeakSet_of_Person>>(false)

// # IsMany works fine and returns true only for `Many` types

// Single Object types are correctly recognised as NOT `Many`
expectType<TypeEqual<IsMany<typeof anError>, false>>(true)
expectType<TypeEqual<IsMany<typeof aDate>, false>>(true)
expectType<TypeEqual<IsMany<typeof aRegex>, false>>(true)
expectType<TypeEqual<IsMany<typeof aFunction>, false>>(true)
expectType<TypeEqual<IsMany<typeof aPromise>, false>>(true)
expectType<TypeEqual<IsMany<typeof aBoolean>, false>>(true)
expectType<TypeEqual<IsMany<typeof aString>, false>>(true)
expectType<TypeEqual<IsMany<typeof aNumber>, false>>(true)
expectType<TypeEqual<IsMany<typeof aDataView>, false>>(true)

// Weak types are correctly recognised as NOT `Many`

expectType<TypeEqual<IsMany<typeof a_WeakMap_of_Person_Employees>, false>>(true)
expectType<TypeEqual<IsMany<typeof a_WeakSet_of_Person>, false>>(true)

// Many types are correctly recognised as `Many`

expectType<TypeEqual<IsMany<typeof a_Employee>, true>>(true)
expectType<TypeEqual<IsMany<typeof a_Person>, true>>(true)
expectType<TypeEqual<IsMany<typeof a_Generator_of_Tvalues_withCommonProps>, true>>(true)
expectType<TypeEqual<IsMany<typeof a_AsyncGenerator_of_Tvalues_withCommonProps>, true>>(true)

expectType<TypeEqual<IsMany<typeof a_Array_of_Tvalues>, true>>(true)
expectType<TypeEqual<IsMany<Person>, true>>(true)
expectType<TypeEqual<IsMany<Employee>, true>>(true)
expectType<TypeEqual<IsMany<typeof a_Set_of_Tvalues>, true>>(true)
expectType<TypeEqual<IsMany<typeof a_Map_of_TMapKeys_Tvalues>, true>>(true)
const a_Set_of_Tvalues_entries = a_Set_of_Tvalues.entries()
expectType<TypeEqual<IsMany<typeof a_Set_of_Tvalues_entries>, true>>(true)
const a_Map_of_TMapKeys_Tvalues_entries = a_Map_of_TMapKeys_Tvalues.entries()
expectType<TypeEqual<IsMany<typeof a_Map_of_TMapKeys_Tvalues_entries>, true>>(true)

// With const / ReadOnly, these used to break, but now they work fine

// Primitives
const constNumber = 123 as const
expectType<TypeEqual<IsMany<typeof constNumber>, false>>(true)
const constBigInt = 456n as const
expectType<TypeEqual<IsMany<typeof constBigInt>, false>>(true)

// realObject - instances
const constObject = { a: 1 } as const
expectType<TypeEqual<IsMany<typeof constObject>, true>>(true)

expectType<TypeEqual<IsMany<Readonly<typeof a_Employee>>, true>>(true)
expectType<TypeEqual<IsMany<ReadonlyDeep<typeof a_Employee>>, true>>(true)
expectType<TypeEqual<IsMany<Readonly<ReadonlyDeep<typeof a_Employee>>>, true>>(true)

expectType<TypeEqual<IsMany<Readonly<typeof a_Person>>, true>>(true)
expectType<TypeEqual<IsMany<ReadonlyDeep<typeof a_Person>>, true>>(true)
expectType<TypeEqual<IsMany<Readonly<ReadonlyDeep<typeof a_Person>>>, true>>(true)

// Arrays
const constArray = [1, 2, 3] as const
expectType<TypeEqual<IsSingleOrWeak<typeof constArray>, false>>(true)

expectType<TypeEqual<IsMany<Readonly<typeof a_Array_of_Tvalues>>, true>>(true)
expectType<TypeEqual<IsMany<ReadonlyDeep<typeof a_Array_of_Tvalues>>, true>>(true)
expectType<TypeEqual<IsMany<ReadonlyArray<typeof a_Array_of_Tvalues>>, true>>(true)
expectType<TypeEqual<IsMany<Readonly<ReadonlyDeep<typeof a_Array_of_Tvalues>>>, true>>(true)
expectType<
  TypeEqual<IsMany<Readonly<ReadonlyDeep<ReadonlyArray<typeof a_Array_of_Tvalues>>>>, true>
>(true)
