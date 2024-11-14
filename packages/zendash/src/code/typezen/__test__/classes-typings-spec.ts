import { expectType } from 'ts-expect'
import { Class } from 'type-fest'
import { Employee, Person } from '../../../test-utils/test-data'
import { isClass, isSystemClass, isUserClass, SystemClasses } from '../classes'

// # isUserClass - type guard
function typeTestIsUserClass(someValue: string) {
  if (isClass(someValue)) new someValue('sss') // overrides the arg's type!

  if (isUserClass(someValue)) new someValue('sss') // overrides the arg's type!

  if (isSystemClass(someValue)) new someValue('sss') // overrides the arg's type!

  // @ts-expect-error
  new someValue('sss')
}

// # Class

expectType<Class<Person>>(Person)
// @ts-expect-error
expectType<Class<Person>>(class Foo {})
expectType<Class<any>>(class Foo {})
expectType<Class<String>>(String)
const pr = Promise.resolve('foo')
expectType<Class<typeof pr>>(Promise<string>)
// @ts-expect-error
expectType<Class<typeof pr>>(Promise<number>)

const classes: Class<any>[] = [
  // user classes
  Person,
  Employee,
  class Foo {},

  // System classes
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
]

const a: SystemClasses = Promise

// @todo: @ts-expect-error: should not match user classes
const a2: SystemClasses = Person
const systemClasses: SystemClasses[] = [
  // user classes - @todo: should not match
  Person,
  Employee,
  class Foo {},

  // System classes
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
]
