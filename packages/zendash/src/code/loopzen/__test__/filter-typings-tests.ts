import * as _ from 'lodash'

import { a_Person, Person } from '../../../test-utils/test-data'

import { Any, ObjectPropTypes } from '../../typezen/type-utils'
import { filter } from '../filter'
import { FilterCallback } from '../loop'

// ##### Typings tests - Inspect Hints in IDE / WebStorm:

// Explicit Map Callbacks
// hint should be (val: string | RegExp, idx: Tany) => val
const filterStringAndRegExp: FilterCallback<string | RegExp, any, any> = (val, key) => false
// Hint should be (val: string | number | RegExp, idx: number | string) => val
const filterStringRegExpNumber: FilterCallback<string | RegExp | number, number | string, any> = (
  val,
  idx
) => true

// ### Array ###
const strOrRegExpArray: (string | RegExp)[] = ['foo', /./]

// Hint should be ` array: (string | RegExp)[]` & mapCb: (val: string | RegExp, idx: number) => val
const filteredArray = filter(strOrRegExpArray, (val, idx) => !val)
const filteredArray_Typed: (string | RegExp)[] = filter(strOrRegExpArray, (val, idx) => !val)

// Hint should be `filteredArray2: (string | RegExp)[]` & `mapCb`: (val: string | RegExp, idx: number) => val
const filteredArray2 = filter(strOrRegExpArray, (val, idx) => !val)

const filteredArray2_Typed: (string | RegExp)[] = filter(
  strOrRegExpArray,
  (val, idx) => !_.size(val as any),
  {}
)

const filteredArray2_Typed2 = filter(
  strOrRegExpArray,
  filterStringRegExpNumber,
  {}
)

// @ts-expect-error: array type is wrong, must be (string | RegExp)
const filteredArray_Typed_Wrong: (string | number)[] = filter(strOrRegExpArray, (val) => !val)
// @ts-expect-error: type is wrong, must be (string | RegExp)[]
const filteredArray_Typed_Wrong2: (string | number)[] = filter(strOrRegExpArray, (val) => !val)

// ### RealObject / Pojso ###
const objectNumberString = { a: 1111, b: 'aaaa' }
// Hint should be `pojso: Record<TObjectKeys, string | number>` & `mapCb`: (val: string | number, key: TObjectKeys) => val
const filteredObject = filter(objectNumberString, (val, key) => !!val)

// Hint should be ` pojso: Record<TObjectKeys, RegExp>`, `options`  & `mapCb`: (val: string | number, key: TObjectKeys) => val
const filteredObject2 = filter(objectNumberString, filterStringRegExpNumber, {})

const filteredObject_Typed: Record<ObjectPropTypes, any> = filter(
  objectNumberString,
  (val, key) => !!val,
  {}
)
const filteredObject_Typed2: Record<ObjectPropTypes, any> = filter(
  objectNumberString,
  (val, key) => !!val
)

// @ts-expect-error: wrong callback type, doesnt accept numbers (like a: 1111)
const filteredObject_Callback_Wrong = filter(objectNumberString, filterStringAndRegExp, {})

// @ts-expect-error: Record type is wrong, must be TObjectKeys
const filteredObject_Typed_Wrong: Record<object, number> = filter(
  objectNumberString,
  (val) => !!val
)

// Instance

// Hint should be `instance: Person` & `mapCb`: (val: Person, key: TObjectKeys) => val
const filteredInstance = filter(a_Person, (val, key) => !!val)
// Hint should be `instance: Person`, `mapCb`: (val: Person, key: TObjectKeys) => val & `options: {}`
const filteredInstance2 = filter(a_Person, (val, key) => !!val, {})

type PersonRecordType = Record<'toString' | 'name' | 'parentClassMethod' | 'parentInstanceMethod' | 'tooBadParentInstanceProp' | 'circularPerson', string | Person | (() => string) | ((classMethodArg: any) => void) | ((instanceMethodArg: any) => void)>

const filteredInstance_Typed: PersonRecordType = filter(a_Person, (val, key) => !!val, {})
const filteredInstance_Typed2: PersonRecordType = filter(a_Person, (val, key) => !!val)

// @ts-expect-error: Record type is wrong, must be TObjectKeys
const filteredInstance_Typed_Wrong: Record<object, number> = filter(a_Person, (val) => !!val)

// Generator
const generator: Generator<number> = (function* () {
  yield 11
  yield 22
  yield 33
})()

const filterCb: FilterCallback<number, number | null, any> = (val: number) => !val

// @ts-expect-error: wrong return type
const filterCb_wrongReturnType: FilterCallback<number, number> = (val: number) => val & 2

const filteredGenerator = filter(generator, filterCb)

// Promise
const promise = Promise.resolve(42)
// Hint should be `promise: Promise<number>` & `mapCb`: (val) => val
const filteredPromise = filter(promise, (val: number) => !val)

const filteredPromise_Typed: Promise<number> = filter(promise, (val: number) => !val)

const filteredPromise_WrongReturnType: Promise<number> = filter(
  promise,
  // @ts-expect-error: Type number is not assignable to type TfilterReturn
  (val: number) => val * 2
)

// Function
const func = (arg1: number, arg2: string) => 42
// Hint should be `func: Function` & `mapCb`: (val) => val
const filteredFunc = filter(func, (val) => !!val)
// const filteredFunc_Typed: Function = filter(func, (val) => !!val)

// Map
// Map hint should be Map<string, number>
const aMap = new Map([
  ['a', 1],
  ['b', 2],
])
// Hint should be `filteredMap: Map<string, number>` & `mapCb`: (val: number, key: string) => val
const filteredMap = filter(aMap, (val, key) => !!val)

// Function
const aFunction = (aNumber: number) => 42
// Hint should be `func: Function` & `mapCb`: (val: number) => val
const filteredFunction = filter(aFunction, (val) => !!val)
// Hint should be number
const val = filteredFunction(42)

const filteredFunction2: (aNumber) => number = filter(aFunction, (val) => !!val)
const val2: number = filteredFunction(42)
const filteredFunction_Typed: Function = filter(aFunction, (val) => !!val)
