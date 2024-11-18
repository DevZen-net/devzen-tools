import { expectType, TypeEqual, TypeOf } from 'ts-expect'
import { ReadonlyDeep } from 'type-fest'
import { Primitive as Primitive_TypeFest } from 'type-fest/source/primitive'

import {
  a_Arguments,
  a_Array_of_Tvalues,
  a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  a_Employee,
  a_Map_of_TMapKeys_Tvalues_WithCommonProps,
  a_Person,
  a_Set_of_Tvalues_withCommonProps,
  a_WeakMap_of_Person_Employees,
  a_WeakSet_of_Person,
  get_arguments,
  get_AsyncGenerator_of_Tvalues,
  get_Generator_of_Tvalues,
  pojsoCommonProps,
  TmyAsyncGenerator,
  TmyAsyncGeneratorWithProps,
  TmyGenerator,
} from '../../../test-utils/test-data'
import { Many } from '../isMany'
import { Primitive } from '../isPrimitive'
import { IsSingleOrWeak, Single, SingleOrWeak } from '../isSingle'

// Overview

expectType<Single[]>([
  1,
  true,
  false,
  null,
  undefined,
  Symbol('a'),
  BigInt(1),

  new Date(),
  /aaaa/,
  // Function & class
  (a: any) => a,
  class A {},
  'a string',
  new String('a string'),
  new Promise((r) => r(1)),
  Number.NaN,
  new Boolean(true),
  new String('a string'),
  new Number(1),
  new Error(),
  new DataView(new ArrayBuffer(8)),
])

// Primitive

// NOTE: WebStorm this @ts-expect-error WORKS fine (the following line should FAIL), but sometimes TS in WebStorm goes funky and thinks it's the other way around (and @ts-expect-error is TS2578: Unused '@ts-expect-error' directive. Just uncomment/comment again and it should work!
// @ts-expect-error: OK Primitive from TypeFest doesnt recognise void
expectType<Primitive_TypeFest>((function () {})())
expectType<Primitive>((function () {})())

expectType<Primitive>('string')
expectType<Primitive>(123)
expectType<Primitive>(123n)
expectType<Primitive>(true)
expectType<Primitive>(undefined)
expectType<Primitive>(null)
expectType<Primitive>(Symbol('symbol'))

// Primitive singles

expectType<Single>('string')
expectType<Single>(123)
expectType<Single>(123n)
expectType<Single>(true)
expectType<Single>(undefined)
expectType<Single>(null)
expectType<Single>(Symbol('symbol'))

// Object / ref singles

expectType<Single>(new Date())
expectType<Single>(new Error())
expectType<Single>(/regex/)
expectType<Single>(function () {})
expectType<Single>(Promise.resolve())
expectType<Single>(Number.NaN)
expectType<Single>(new Boolean(true))
expectType<Single>(new String('string'))
expectType<Single>(new Number(123))
expectType<Single>(new DataView(new ArrayBuffer(8)))

// All `Many` are NOT `Single` or `Primitive`
expectType<TypeOf<Single, Many<any, any>>>(false)
expectType<TypeOf<Primitive, Many<any, any>>>(false)

// All `Primitives` are also `Single`
expectType<TypeOf<Single, Primitive>>(true)

// Special cases, not recognised as Single at compile time

// Testing all `Many` VALUE INSTANCES are NOT Tsingle

const aTypedArray = new Int8Array()
expectType<TypeOf<Single, typeof aTypedArray>>(false)
expectType<TypeOf<Single, typeof a_Arguments>>(false)
expectType<TypeOf<Single, typeof a_Array_of_Tvalues>>(false)
expectType<TypeOf<Single, typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>>(false)
expectType<TypeOf<Single, typeof pojsoCommonProps>>(false)
expectType<TypeOf<Single, typeof a_Person>>(false)
expectType<TypeOf<Single, typeof a_Employee>>(false)
expectType<TypeOf<Single, TmyGenerator>>(false)
expectType<TypeOf<Single, ReturnType<typeof get_Generator_of_Tvalues>>>(false)

expectType<TypeOf<Single, TmyAsyncGenerator>>(false)
expectType<TypeOf<Single, ReturnType<typeof get_AsyncGenerator_of_Tvalues>>>(false)

expectType<TypeOf<Single, TmyAsyncGeneratorWithProps>>(false)

expectType<TypeOf<Single, IArguments>>(false)
expectType<TypeOf<Single, ReturnType<typeof get_arguments>>>(false)

expectType<TypeOf<Single, ArrayBuffer>>(false)
expectType<TypeOf<Single, SharedArrayBuffer>>(false)

expectType<TypeOf<Single, Set<any>>>(false)
expectType<TypeOf<Single, WeakSet<any>>>(false)
expectType<TypeOf<Single, Map<any, any>>>(false)
expectType<TypeOf<Single, WeakMap<any, any>>>(false)

// ### WeakXxx are special:
expectType<TypeOf<Single, typeof a_WeakMap_of_Person_Employees>>(false)
expectType<TypeOf<Single, typeof a_WeakSet_of_Person>>(false)

// ### SingleOrWeak

// All `Single` are also `SingleOrWeak`
expectType<TypeOf<SingleOrWeak, Single>>(true)

// All `Weak` are SingleOrWeak
expectType<TypeOf<SingleOrWeak, typeof a_WeakMap_of_Person_Employees>>(true)
expectType<TypeOf<SingleOrWeak, WeakMap<any, any>>>(true)
expectType<TypeOf<SingleOrWeak, typeof a_WeakSet_of_Person>>(true)
expectType<TypeOf<SingleOrWeak, WeakSet<any>>>(true)

// Normal Set & Map are NOT SingleOrWeak
// @ts-expect-error: @todo(111): we can't fix this
expectType<TypeOf<SingleOrWeak, Set<any>>>(false)
// @ts-expect-error: @todo(111): we can't fix this
expectType<TypeOf<SingleOrWeak, Map<any, any>>>(false)

// ### IsSingleOrWeak - works fine, unlike SingleOrWeak

// Single or Weak values

expectType<TypeEqual<IsSingleOrWeak<1>, true>>(true)
expectType<TypeEqual<IsSingleOrWeak<Number>, true>>(true)
expectType<TypeEqual<IsSingleOrWeak<'foo'>, true>>(true)
expectType<TypeEqual<IsSingleOrWeak<String>, true>>(true)
expectType<TypeEqual<IsSingleOrWeak<WeakSet<any>>, true>>(true)
expectType<TypeEqual<IsSingleOrWeak<WeakMap<any, any>>, true>>(true)
expectType<TypeEqual<IsSingleOrWeak<typeof a_WeakSet_of_Person>, true>>(true)
expectType<TypeEqual<IsSingleOrWeak<typeof a_WeakMap_of_Person_Employees>, true>>(true)

// Not Single or Weak

const a_Set_of_Tvalues_withCommonProps_entries = a_Set_of_Tvalues_withCommonProps.entries()
const a_Map_of_TMapKeys_TvaluesWithCommonProps_entries = a_Map_of_TMapKeys_Tvalues_WithCommonProps.entries()

expectType<TypeEqual<IsSingleOrWeak<Set<any>>, false>>(true)
expectType<TypeEqual<IsSingleOrWeak<typeof a_Set_of_Tvalues_withCommonProps>, false>>(true)
expectType<TypeEqual<IsSingleOrWeak<typeof a_Set_of_Tvalues_withCommonProps_entries>, false>>(true)
expectType<TypeEqual<IsSingleOrWeak<Map<any, any>>, false>>(true)
expectType<TypeEqual<IsSingleOrWeak<typeof a_Map_of_TMapKeys_Tvalues_WithCommonProps>, false>>(true)
expectType<TypeEqual<IsSingleOrWeak<typeof a_Map_of_TMapKeys_TvaluesWithCommonProps_entries>, false>>(true)
expectType<TypeEqual<IsSingleOrWeak<{ a: 'foo' }>, false>>(true)

expectType<TypeEqual<IsSingleOrWeak<Array<any>>, false>>(true)

// With const / ReadOnly, these used to break, but now they work fine

// Primitives
const constNumber = 123 as const
expectType<TypeEqual<IsSingleOrWeak<typeof constNumber>, true>>(true)
const constBigInt = 456n as const
expectType<TypeEqual<IsSingleOrWeak<typeof constBigInt>, true>>(true)

// realObject - instances
const constObject = { a: 1 } as const
expectType<TypeEqual<IsSingleOrWeak<typeof constObject>, false>>(true)

expectType<TypeEqual<IsSingleOrWeak<Readonly<typeof a_Employee>>, false>>(true)
expectType<TypeEqual<IsSingleOrWeak<ReadonlyDeep<typeof a_Employee>>, false>>(true)
expectType<TypeEqual<IsSingleOrWeak<Readonly<ReadonlyDeep<typeof a_Employee>>>, false>>(true)

expectType<TypeEqual<IsSingleOrWeak<Readonly<typeof a_Person>>, false>>(true)
expectType<TypeEqual<IsSingleOrWeak<ReadonlyDeep<typeof a_Person>>, false>>(true)
expectType<TypeEqual<IsSingleOrWeak<Readonly<ReadonlyDeep<typeof a_Person>>>, false>>(true)

// Arrays
const constArray = [1, 2, 3] as const
expectType<TypeEqual<IsSingleOrWeak<typeof constArray>, false>>(true)

expectType<TypeEqual<IsSingleOrWeak<Readonly<typeof a_Array_of_Tvalues>>, false>>(true)
expectType<TypeEqual<IsSingleOrWeak<ReadonlyDeep<typeof a_Array_of_Tvalues>>, false>>(true)
expectType<TypeEqual<IsSingleOrWeak<ReadonlyArray<typeof a_Array_of_Tvalues>>, false>>(true)
expectType<TypeEqual<IsSingleOrWeak<Readonly<ReadonlyDeep<typeof a_Array_of_Tvalues>>>, false>>(true)
expectType<TypeEqual<IsSingleOrWeak<Readonly<ReadonlyDeep<ReadonlyArray<typeof a_Array_of_Tvalues>>>>, false>>(true)
