/* eslint-disable @typescript-eslint/naming-convention */
import * as assert from 'assert'
import * as _ from 'lodash'
import { expectType, TypeEqual } from 'ts-expect'
import { TypedArray, ValueOf } from 'type-fest'
import {
  IKeysOptions,
  ILoopOptions,
  ManyNames,
  realObjectType,
  Single,
  SingleNames,
  type,
  TypeNames,
  ValueOfStrict,
} from '../code'
import { NumberString } from '../code/typezen/isNumberString'

import { isTypedArrayNumber } from '../code/typezen/isTypedArray'
import { STOP } from '../code/typezen/utils' // @todo: why breaks if above?
import { delay } from './misc'

// import {
//   object_stringNonEnumerablesInheritedTop
// } from '../code/typezen/types-info';

// ## Legacy test data @todo: clean up legacy test data

// Common Symbols

export const symbolProp: unique symbol = Symbol.for('symbolProp')
export const tooBadSymbolProp: unique symbol = Symbol.for('tooBadSymbolProp')
export const symbolProp2: unique symbol = Symbol.for('symbolProp2')
export const tooBadSymbolProp2: unique symbol = Symbol.for('tooBadSymbolProp2')

/* Inheritance (simple): A simple object, with :
    - 2 shallow clones,
    - 2 deep clones
    - 2 inherited
 */
export const prop1 = {
  'aProp1.1': 'o1.aVal1.1',
  'aProp1.2': 'o1.aVal1.2',
}
export const object1 = {
  aProp2: 'o1.aVal2',
}
;(object1 as any).aProp1 = Object.create(prop1)

export const object2 = Object.create(object1)
object2.aProp2 = 'o2.aVal2-1'

export const object3 = Object.create(object2)

_.extend(object3, {
  aProp2: 'o3.aVal2-2',
  aProp3: [
    1,
    '2',
    3,
    {
      aProp4: 'o3.aVal3',
    },
  ],
})
export const objectWithProtoInheritedProps = Object.create(object3)
objectWithProtoInheritedProps.aProp0 = 'o0.aVal0'

export const Class0 = class Class0 {
  constructor() {
    // @ts-ignore-next-line
    this.aProp0 = 'o0.aVal0'
  }
}

export class Class1 extends Class0 {
  aProp1 = prop1

  aProp2 = 'o1.aVal2'
}

export class Class2 extends Class1 {}

Class2.prototype.aProp2 = 'o2.aVal2-1'

export class Class3 extends Class2 {
  aProp3: any[] = []
}

Class3.prototype.aProp2 = 'o3.aVal2-2'

Class3.prototype.aProp3 = [
  1,
  '2',
  3,
  {
    aProp4: 'o3.aVal3',
  },
]

export const c3 = new Class3()
export const expectedPropertyValues = {
  aProp0: 'o0.aVal0',
  aProp1: {
    'aProp1.1': 'o1.aVal1.1',
    'aProp1.2': 'o1.aVal1.2',
  },
  aProp2: 'o3.aVal2-2',
  aProp3: [
    1,
    '2',
    3,
    {
      aProp4: 'o3.aVal3',
    },
  ],
}
export const object = {
  p1: 1,
  p2: {
    p2_2: 3,
  },
}
export const objectShallowClone1 = {
  p1: 1,
  p2: object.p2,
}
export const objectShallowClone2 = _.clone(object)
export const objectDeepClone1 = {
  p1: 1,
  p2: {
    p2_2: 3,
  },
}
export const objectDeepClone2 = _.cloneDeep(object)
// shallow inherited
export const inheritedShallowCloneParent = {
  p2: object.p2,
}
// can't do this in IE : `inheritedShallowClone.__proto__ = inheritedShallowCloneParent`
export const inheritedShallowClone = Object.create(inheritedShallowCloneParent)
inheritedShallowClone.p1 = 1

// deep inherited
export const inheritedDeepCloneParent = {
  p2: {
    p2_2: 3,
  },
}
// inheritedDeepClone.__proto__ = inheritedDeepCloneParent
export const inheritedDeepClone = Object.create(inheritedDeepCloneParent)
inheritedDeepClone.p1 = 1
export const earth = {
  name: 'earthDefaults',
  environment: {
    temperature: 20,
    gravity: 9.8,
    moisture: {
      min: 10,
    },
  },
  life: true,
}

// eslint-disable-next-line import/no-default-export
export default {
  objectWithProtoInheritedProps,
  Class3,
  c3,
  expectedPropertyValues,
  // simple object with 2+2+2 clones
  object,
  objectShallowClone1,
  objectShallowClone2,
  objectDeepClone1,
  objectDeepClone2,
  inheritedShallowClone,
  inheritedDeepClone,
  // various data
  obj: {
    ciba: 4,
    aaa: 7,
    b: 2,
    c: -1,
  },
  arrInt: [4, 7, 2, -1],
  arrInt2: [7, -1, 3, 5],
  arrStr: ['Pikoulas', 'Anodynos', 'Babylon', 'Agelos'],
}

// Class & Instances

export const symbolPersonKey = Symbol.for('personKey')

export class Person {
  constructor(public name: string) {}

  [symbolProp] = 'symbolKeyForObj1 value';

  [symbolPersonKey] = 'symbol key value'

  toString() {
    return `PersonToString(${this.name})`
  }

  parentClassMethod(classMethodArg) {}

  parentInstanceMethod = (instanceMethodArg) => {}

  static staticParentProp = 'staticParentProp value'
  static tooBadParentProp = 'tooBadParentProp Value - rejected by filter'

  static staticParentMethod(staticMethodArg) {}

  tooBadParentInstanceProp = 'tooBadParentInstanceProp value - rejected by filter'

  circularPerson: Person = this
}

export const a_Person = new Person('Angelos')
// aPerson.circularPerson = aPerson // @todo(911) circular reference not needed here

export const personStringProps = [
  'name',
  'parentInstanceMethod',
  'tooBadParentInstanceProp',
  'circularPerson',
  // 'toString', 'parentClassMethod', 'constructor' // are prototype methods
] as const
export const personSymbolProps = [symbolProp, symbolPersonKey] as const
export const personStringProps_values = personStringProps.map((k) => a_Person[k])
export const personSymbolProps_values = personSymbolProps.map((k) => a_Person[k])

export type TpersonStringProps = (typeof personStringProps)[number]
export type TpersonSymbolProps = (typeof personSymbolProps)[number]

export const person_stringNonEnumerablesInherited = [
  'constructor',
  'toString',
  'parentClassMethod',
] as const
export const person_stringNonEnumerablesInherited_values =
  person_stringNonEnumerablesInherited.map((k) => a_Person[k])
// export type Tperson_stringNonEnumerablesInherited = typeof person_stringNonEnumerablesInherited[number]
export type Tperson_stringNonEnumerablesInherited = 'toString' | 'parentClassMethod' // @todo: where is constructor? It breaks if we add it!

export const person_symbolNonEnumerablesInherited: never[] = [] as const
export type Tperson_symbolNonEnumerablesInherited =
  (typeof person_symbolNonEnumerablesInherited)[number]

export const person_symbolNonEnumerablesInherited_values =
  person_symbolNonEnumerablesInherited.map((k) => a_Person[k])

export type TpersonStringProps_values = ValueOfStrict<Person, TpersonStringProps>
export type TpersonSymbolProps_values = ValueOfStrict<Person, TpersonSymbolProps>
export type Tperson_stringNonEnumerablesInherited_values = ValueOfStrict<
  Person,
  Tperson_stringNonEnumerablesInherited
>
export type Tperson_symbolNonEnumerablesInherited_values = ValueOfStrict<
  Person,
  Tperson_symbolNonEnumerablesInherited
>

// # Sub class & instances

export class Employee extends Person {
  [symbolProp2] = 'symbolKeyForObj2 value' // @todo(111): rename symbolChild or symbolEmployeeKey

  static staticChildProp = 'staticChildProp value'
  static tooBad_staticChildProp = 'tooBad_staticChildProp Value - rejected by filter'

  static staticChildMethod(staticMethodArg) {}

  childClassMethod(classMethodArg): string {
    return 'childClassMethod return value'
  }

  childInstanceMethod = (instanceMethodArg): bigint => {
    return 777n
  }

  // instance variable
  tooBadChildInstanceProp = 'tooBadChildInstanceProp value - rejected by filter'
}

export const a_Employee = new Employee('Elpida')

export const employeeStringProps = ['childInstanceMethod', 'tooBadChildInstanceProp'] as const
export type TemployeeStringProps = (typeof employeeStringProps)[number]
export const employeeStringProps_values = employeeStringProps.map((k) => a_Employee[k])

export const employeeSymbolProps = [symbolProp2] as const
export type TemployeeSymbolProps = (typeof employeeSymbolProps)[number]
export const employeeSymbolProps_values = employeeSymbolProps.map((k) => a_Employee[k])

export const employee_stringNonEnumerablesInherited = ['childClassMethod'] as const
export type Temployee_stringNonEnumerablesInherited =
  (typeof employee_stringNonEnumerablesInherited)[number]

export const employee_symbolNonEnumerablesInherited: never[] = [] as const
export type Temployee_symbolNonEnumerablesInherited =
  (typeof employee_symbolNonEnumerablesInherited)[number]

export type TemployeeStringProps_values = ValueOfStrict<Employee, TemployeeStringProps>
export type TemployeeSymbolProps_values = ValueOfStrict<Employee, TemployeeSymbolProps>
export type Temployee_stringNonEnumerablesInherited_values = ValueOfStrict<
  Employee,
  Temployee_stringNonEnumerablesInherited
>
export type Temployee_symbolNonEnumerablesInherited_values = ValueOfStrict<
  Employee,
  Temployee_symbolNonEnumerablesInherited
>

// ## POJSO objects & prototypical inheritance

export const get_parentObj = () => {
  const parentObj = {
    parentObjKeyNum_rejected: 1,
    parentObjKeyNum: 2,
    parentObjKeyStr: 'A String',
    parentObjKeyStr_Rejected: 'tooBad rejected parent String',
    [Symbol.for('parentObjSymbolLabel1')]: 'parentObjSymbol1 Value',
    [Symbol.for(`badKey_parentObjSymbolLabel2 with quotes ' " and \n new line`)]:
      'tooBad_parentObjSymbol rejected parent Value',
  }
  return parentObj
}

export const a_parentObj = get_parentObj()

export const get_childObj = (withParent = true) => {
  const childObj = withParent ? Object.create(a_parentObj) : {}

  childObj.childObjKeyNum_rejected = 11
  childObj.childObjKeyNum = 22
  childObj.childObjKeyStr = 'A String'
  childObj.childObjKeyStr_Rejected = 'tooBad rejected child String'
  childObj[Symbol.for('childObjSymbolLabel1')] = 'childObjSymbol1 Value'
  childObj[Symbol.for('badKey_childObjSymbolLabel2 with quotes \' " and \n new line')] =
    'tooBad_childObjSymbol2 rejected child Value'

  return childObj
}

export const a_childObj = get_childObj()

// Common props

// @todo: Make stricter: add `as const` / use literals values as types

// Value / Key pairs

export type TcommonStringProps =
  | 'stringProp'
  | 'tooBadProp'
  | 'stringProp2'
  | 'tooBadProp2'
  | 'stringProp3'
  | 'tooBadProp3'

export const commonStringValuePropTuples: [TcommonStringProps_values, TcommonStringProps][] = [
  ['stringProp value', 'stringProp'],
  ['tooBadPropValue - rejected by filter', 'tooBadProp'], // rejected by filter
  [['an', 'array prop value'], 'stringProp2'],
  [['tooBad', 'an', 'array prop value'], 'tooBadProp2'], // rejected by filter
  [22, 'stringProp3'],
  [13, 'tooBadProp3'], // rejected by filter
]

export const commonStringProps = commonStringValuePropTuples.map(([_, key]) => key)
export const commonStringProps_values = commonStringValuePropTuples.map(([val]) => val)

export interface IcommonStringProps {
  stringProp: 'stringProp value'
  tooBadProp: 'tooBadPropValue - rejected by filter'
  stringProp2: ['an', 'array prop value']
  tooBadProp2: ['tooBad', 'an', 'array prop value']
  stringProp3: 22
  tooBadProp3: 13
}

export type TcommonStringProps_values =
  | 'stringProp value'
  | 'tooBadPropValue - rejected by filter'
  | ['an', 'array prop value']
  | ['tooBad', 'an', 'array prop value']
  | 22
  | 13

export type TcommonSymbolProps =
  | typeof symbolProp
  | typeof tooBadSymbolProp
  | typeof symbolProp2
  | typeof tooBadSymbolProp2

export type TcommonSymbolProps_values =
  | 'symbolProp value'
  | 'tooBadSymbolPropValue - rejected by filter'
  | 222n
  | 133n

export const commonSymbolValuePropTuples: [TcommonSymbolProps_values, TcommonSymbolProps][] = [
  ['symbolProp value', symbolProp],
  ['tooBadSymbolPropValue - rejected by filter', tooBadSymbolProp], // rejected by filter
  [222n, symbolProp2],
  [133n, tooBadSymbolProp2], // rejected by filter
]

export const commonSymbolProps = commonSymbolValuePropTuples.map(([_, key]) => key)

export const commonSymbolProps_values = commonSymbolValuePropTuples.map(([val]) => val)

export interface IcommonSymbolProps {
  readonly [symbolProp]: 'symbolProp value'
  readonly [tooBadSymbolProp]: 'tooBadSymbolPropValue - rejected by filter'
  readonly [symbolProp2]: 222n
  readonly [tooBadSymbolProp2]: 133n
}

export const commonAllValuePropTuples = [
  ...commonStringValuePropTuples,
  ...commonSymbolValuePropTuples,
]

expectType<TypeEqual<ValueOf<IcommonStringProps>, TcommonStringProps_values>>(true)
expectType<TypeEqual<ValueOf<IcommonSymbolProps>, TcommonSymbolProps_values>>(true)

const defaultOptions = {
  map: _.identity,
  filter: _.constant(true),
  string: true,
  symbol: true,
} satisfies ILoopOptions<any, any, any, any>

// Add common props, mimicking options as simply as possible
export const add_CommonProps = <T extends object>(
  obj: T,
  options: ILoopOptions<any, any, any> = {}
): T & IcommonStringProps & IcommonSymbolProps => {
  const { map, filter, string, symbol, take } = { ...defaultOptions, ...options }

  const commonValuePropTuples = (string ? commonStringValuePropTuples : []).concat(
    symbol ? (commonSymbolValuePropTuples as any) : []
  )

  let count = 0
  _.each(commonValuePropTuples, ([item, key]) => {
    if (filter(item, key, commonValuePropTuples, -1)) {
      if (take === undefined || (_.isNumber(take) && count < take)) {
        count++
        obj[key] = map(item, key, commonValuePropTuples, -1)
      }
    }
  })

  return obj as any
}

// # POJSO keys

export const pojsoCommonProps: IcommonStringProps & IcommonSymbolProps = add_CommonProps({})

export class ClassWithCommonProps implements IcommonStringProps, IcommonSymbolProps {
  constructor() {
    // addCommonProps(this) // copy real values, can't avoid definitions
  }

  readonly stringProp = 'stringProp value'
  readonly tooBadProp = 'tooBadPropValue - rejected by filter'
  readonly stringProp2: ['an', 'array prop value'] = ['an', 'array prop value'] as const
  readonly tooBadProp2: ['tooBad', 'an', 'array prop value'] = [
    'tooBad',
    'an',
    'array prop value',
  ] as const
  readonly stringProp3 = 22
  readonly tooBadProp3 = 13;

  // symbols
  readonly [symbolProp] = 'symbolProp value';
  readonly [tooBadSymbolProp] = 'tooBadSymbolPropValue - rejected by filter';
  readonly [symbolProp2] = 222n;
  readonly [tooBadSymbolProp2] = 133n
}

export const a_instance_withCommonProps = new ClassWithCommonProps()

export class ClassWithStaticCommonProps {
  static readonly stringProp = 'stringProp value'
  static readonly tooBadProp = 'tooBadPropValue - rejected by filter'
  static readonly stringProp2: ['an', 'array prop value'] = ['an', 'array prop value'] as const
  static readonly tooBadProp2: ['tooBad', 'an', 'array prop value'] = [
    'tooBad',
    'an',
    'array prop value',
  ] as const
  static readonly stringProp3 = 22
  static readonly tooBadProp3 = 13

  // symbols
  static readonly [symbolProp] = 'symbolProp value'
  static readonly [tooBadSymbolProp] = 'tooBadSymbolPropValue - rejected by filter'
  static readonly [symbolProp2] = 222n
  static readonly [tooBadSymbolProp2] = 133n
}

add_CommonProps(ClassWithStaticCommonProps)

// # Array & common values

/**
 * Note: it returns the full IcommonProps & { ['-10']: number | bigint } (depending on array type)
 */
export const add_CommonAndArrayExtraProps = <Tarray extends any[] | TypedArray>(
  arr: Tarray,
  options: ILoopOptions<any, any, any> = {}
): Tarray &
  (Tarray extends TypedArray // negative numbers are
    ? {} // ignored in typed arrays
    : { ['-10']: 128n }) & // interpreted as strings/props in array,
  IcommonStringProps &
  IcommonSymbolProps => {
  const { map } = { ...defaultOptions, ...options } as any

  arr[-10] = isTypedArrayNumber(arr) ? map(128) : map(128n) // negative numbers are interpreted as strings/props in array, ignored in typed arrays

  if (_.isNumber(options.take)) options.take--

  return add_CommonProps(arr, options) as any
}

export type TarrayAndCommonStringProps = '-10' | TcommonStringProps
export const arrayAndCommonStringProps: TarrayAndCommonStringProps[] = [
  '-10',
  ...commonStringProps,
]
export type TarrayAndCommonStringProps_values = 128n | TcommonStringProps_values
export const arrayAndCommonStringProps_values: TarrayAndCommonStringProps_values[] = [
  128n,
  ...commonStringProps_values,
]
expectType<TarrayAndCommonStringProps_values>(128n)
expectType<TarrayAndCommonStringProps_values>('stringProp value')
expectType<TarrayAndCommonStringProps_values>(['an', 'array prop value'])
// @ts-expect-error OK
expectType<TarrayAndCommonStringProps_values>(666n)
// @ts-expect-error OK
expectType<TarrayAndCommonStringProps_values>('foobar')

export type Tvalues =
  | 222
  | 123
  | 'A string Tvalue'
  | 'tooBad string Tvalue'
  | true
  | false // note: merged with true as `boolean`
  | ['an', 'array Tvalue']
  | ['tooBad', 'an', 'array Tvalue']
  | { prop: 'Tvalue' }
  | { tooBad: true; eliminatedByFilter: 'Tvalue' }

export const get_Array_of_Tvalues = (): Tvalues[] => [
  222, // accepted by filter
  123, // rejected by filter

  'A string Tvalue',
  'tooBad string Tvalue', // rejected by filter

  true,
  false, // rejected by filter

  ['an', 'array Tvalue'],
  ['tooBad', 'an', 'array Tvalue'], // rejected by filter

  { prop: 'Tvalue' },
  { tooBad: true, eliminatedByFilter: 'Tvalue' }, // rejected by filter
] // as const

// with loop sparse: true & filter
export const get_ArrayOf_TvaluesSparseFiltered = () => [
  // accepted by filter
  222, // rejected by filter
  ,
  'A string Tvalue', // rejected by filter
  ,
  true, // rejected by filter
  ,
  ['an', 'array Tvalue'], // rejected by filter
  ,
  { prop: 'Tvalue' }, // rejected by filter
  ,
] // as const

// export type Tvalues = Exclude<ReturnType<typeof get_ArrayOf_Tvalues>[number], never>

export const a_Array_of_Tvalues: Tvalues[] = get_Array_of_Tvalues() // as any
export const a_Array_of_Tvalues_indexes = _.times(a_Array_of_Tvalues.length) // array indexes [0,1,2,3...,9] with 10 items

export const get_ArrayOf_Tvalues_withCommonAndArrayExtraProps = () =>
  add_CommonAndArrayExtraProps(get_Array_of_Tvalues())

export const a_Array_of_Tvalues_withCommonAndArrayExtraProps =
  get_ArrayOf_Tvalues_withCommonAndArrayExtraProps()

expectType<
  TypeEqual<
    typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
    Tvalues[] & { '-10': 128n } & IcommonStringProps & IcommonSymbolProps
  >
>(true)

// Sparse Arrays

export const get_sparseArray_of_Tvalues_and_extras = (
  map: <T>(val: T, ...args) => T = _.identity
) => {
  const arr = [
    // accepted by filter
    map(222),
    map(123), // rejected by filter
    ,
    ,
    // sparse value
    map('A string Tvalue'),
    map('tooBad string Tvalue'), // rejected by filter
    ,
    ,
    // sparse value
    map(true),
    map(false), // rejected by filter
    ,
    ,
    // sparse value
    map(['an', 'array Tvalue']),
    map(['tooBad', 'an', 'array Tvalue']), // rejected by filter
    ,
    ,
    // sparse value
    map({ prop: 'Tvalue' }),
    map({ tooBad: true, eliminatedByFilter: 'Tvalue' }), // rejected by filter
  ]

  // these are sparse values, as indexes
  arr[100] = map('sparse value for idx 100')
  arr['1984'] = map('stringNumber key is interpreted as number, i.e an index')

  return arr
}

export const get_sparseArray_of_Tvalues_and_extras_filtered = (
  map: <T>(val: T, ...args) => T = _.identity
) => {
  const arr = [
    // accepted by filter
    map(222), // rejected by filter
    ,
    ,
    ,
    // sparse value
    map('A string Tvalue'), // rejected by filter
    ,
    ,
    ,
    // sparse value
    map(true), // rejected by filter
    ,
    ,
    ,
    // sparse value
    map(['an', 'array Tvalue']), // rejected by filter
    ,
    ,
    ,
    // sparse value
    map({ prop: 'Tvalue' }), // rejected by filter
    ,
  ]

  // these are sparse values, as indexes
  arr[100] = map('sparse value for idx 100')
  arr['1984'] = map('stringNumber key is interpreted as number, i.e an index')

  return arr
}

export const a_sparseArray_of_Tvalues_and_extras_indexes = [
  0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 100, 1984,
]
export const a_sparseArray_of_Tvalues_and_extras_valuesAndIndexTuples = [
  [222, 0],
  [123, 1],
  // 2 & 3 are sparse
  ['A string Tvalue', 4],
  ['tooBad string Tvalue', 5],
  // 6 & 7 are sparse
  [true, 8],
  [false, 9],
  // 10 & 11 are sparse
  [['an', 'array Tvalue'], 12],
  [['tooBad', 'an', 'array Tvalue'], 13],
  // 14 & 15 are sparse
  [{ prop: 'Tvalue' }, 16],
  [{ tooBad: true, eliminatedByFilter: 'Tvalue' }, 17],
  // 18...99 are sparse
  ['sparse value for idx 100', 100],
  ['stringNumber key is interpreted as number, i.e an index', 1984],
]

export const a_sparseArray_of_Tvalues_and_extras_values =
  a_sparseArray_of_Tvalues_and_extras_valuesAndIndexTuples.map(([val]) => val)

export const get_sparseArray_of_Tvalues_and_extras_withCommonAndArrayExtraProps = () =>
  add_CommonAndArrayExtraProps(get_sparseArray_of_Tvalues_and_extras(), {
    string: true,
    symbol: true,
  })

export const a_sparseArray_of_Tvalues_and_extras_withCommonAndExtraProps =
  get_sparseArray_of_Tvalues_and_extras_withCommonAndArrayExtraProps()

// Array class extension

interface IArrayWithCommonProps extends IcommonStringProps, IcommonSymbolProps {
  ['-10']: 128n
}

export class ArrayOfValuesWithCommonProps
  extends Array<Tvalues>
  implements IArrayWithCommonProps
{
  constructor() {
    super()
    this.push(...a_Array_of_Tvalues)
    add_CommonAndArrayExtraProps(this)
  }

  // @ts-expect-error OKish: TS2411: Property '-10' of type number is not assignable to number index type Tvalues
  '-10' = 128n as const

  // common props
  readonly stringProp = 'stringProp value'
  readonly tooBadProp = 'tooBadPropValue - rejected by filter'
  readonly stringProp2: ['an', 'array prop value'] = ['an', 'array prop value'] as const
  readonly tooBadProp2: ['tooBad', 'an', 'array prop value'] = [
    'tooBad',
    'an',
    'array prop value',
  ] as const
  readonly stringProp3 = 22
  readonly tooBadProp3 = 13;

  // symbols
  readonly [symbolProp] = 'symbolProp value';
  readonly [tooBadSymbolProp] = 'tooBadSymbolPropValue - rejected by filter';
  readonly [symbolProp2] = 222n;
  readonly [tooBadSymbolProp2] = 133n
}

// # TypedArrays

// These need to be alternating odd/even for tests to work with idx & count
export const get_Array_of_numbers = (): number[] => [10, 21, 30, 41, 50, 61]
export const get_Array_of_bigints = (): bigint[] => [10n, 21n, 30n, 41n, 50n, 61n]

// # Int16Array

export const get_TypedArray_Int16Array = () => new Int16Array(get_Array_of_numbers())

export const a_TypedArray_Int16Array = get_TypedArray_Int16Array()
export const a_TypedArray_Int16Array_indexes = _.times(a_TypedArray_Int16Array.length) // array indexes [0,1,2,3...,9] with 10 items

export const get_TypedArray_Int16Array_number_withCommonAndArrayExtraProps = () =>
  add_CommonAndArrayExtraProps(get_TypedArray_Int16Array())

export const a_TypedArray_Int16Array_withCommonAndArrayExtraProps =
  get_TypedArray_Int16Array_number_withCommonAndArrayExtraProps()

// # Int32Array

export const get_TypedArray_Int32Array = () => new Int32Array(get_Array_of_numbers())

export const a_TypedArray_Int32Array = get_TypedArray_Int32Array()
export const a_TypedArray_Int32Array_indexes = _.times(a_TypedArray_Int32Array.length) // array indexes [0,1,2,3...,9] with 10 items

export const get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps = () =>
  add_CommonAndArrayExtraProps(get_TypedArray_Int32Array())

export const a_TypedArray_Int32Array_withCommonAndArrayExtraProps =
  get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps()

// # BigInt64Array

export const get_TypedArray_BigInt64Array = () => new BigInt64Array(get_Array_of_bigints())

export const a_TypedArray_BigInt64Array = get_TypedArray_BigInt64Array()
export const a_TypedArray_BigInt64Array_indexes = _.times(a_TypedArray_BigInt64Array.length) // array indexes [0,1,2,3...,9] with 10 items

export const get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps = () =>
  add_CommonAndArrayExtraProps(get_TypedArray_BigInt64Array())

export const a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps =
  get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps()

// # Set

export const get_Set_of_Tvalues = () => new Set(get_Array_of_Tvalues())
export const get_Set_of_Tvalues_withCommonProps = () => add_CommonProps(get_Set_of_Tvalues())
export const a_Set_of_Tvalues = get_Set_of_Tvalues()
export const a_Set_of_Tvalues_withCommonProps = get_Set_of_Tvalues_withCommonProps()

// # Map

const symbolKeyForMap: unique symbol = Symbol.for('symbolKeyForMap')
const symbolKeyForMap_rejected: unique symbol = Symbol.for('tooBad_symbolKeyForMap_rejected')

// some values used as keys in Map
export type TMapKeys =
  | 'aStringKey_num_accepted' // accepted by filter
  | 'tooBad_aStringKey_num_rejected' // rejected by filter
  | { anObject: 'key for string accepted' }
  | { tooBad: true; anObject: 'key for string rejected by filter' }
  | 42 // numeric key - even, so accepted by filter
  | 555 // odd, rejected by filter
  | typeof symbolKeyForMap
  | typeof symbolKeyForMap_rejected
  | Person
  | { tooBad: true; rejected: 'key for tooBad object' }

export const get_arrayOfKeys = (): TMapKeys[] => [
  // keys accepted & rejected must interleave, eg:
  'aStringKey_num_accepted', // accepted by filter
  'tooBad_aStringKey_num_rejected', // rejected by filter

  { anObject: 'key for string accepted' },
  { tooBad: true, anObject: 'key for string rejected by filter' },

  42, // numeric key - even, so accepted by filter
  555, // odd, rejected by filter

  symbolKeyForMap,
  symbolKeyForMap_rejected,

  a_Person,
  { tooBad: true, rejected: 'key for tooBad object' },
] // as const

assert.equal(get_arrayOfKeys().length, get_Array_of_Tvalues().length) // keep in par with values

export const a_Array_ofKeys: TMapKeys[] = get_arrayOfKeys()

export const get_Map_of_TMapKeys_Tvalues = (
  arrayOfKeys = a_Array_ofKeys,
  a_Array_of_Tvalues = get_Array_of_Tvalues()
) => {
  const aMap = new Map<TMapKeys, Tvalues>()

  _.each(arrayOfKeys, (key, idx) => aMap.set(key, a_Array_of_Tvalues[idx]))

  return aMap
}

export const get_Map_of_TMapKeys_Tvalues_WithCommonProps = (
  arrayOfKeys = a_Array_ofKeys,
  a_Array_of_Tvalues = get_Array_of_Tvalues()
) => add_CommonProps(get_Map_of_TMapKeys_Tvalues(arrayOfKeys, a_Array_of_Tvalues))

export const a_Map_of_TMapKeys_Tvalues = get_Map_of_TMapKeys_Tvalues()
export const aMap_of_Tvalues_Tvalues = new Map<Tvalues, Tvalues>()
export const a_Map_of_TMapKeys_Tvalues_WithCommonProps =
  get_Map_of_TMapKeys_Tvalues_WithCommonProps()

// # WeakMap & # WeakSet

export const a_WeakMap_of_Person_Employees = new WeakMap<Person, Employee>()
export const a_WeakSet_of_Person = new WeakSet<Person>()

// fixtures - initially copied from: logzen/src/__tests__/print.spec.ts

// # Functions

// Sync functions

// prettier-ignore
export function a_Function_normalNamed(arg1?, arg2?) { return "double quotes" + 'single quotes' + `backtick quotes` }
// prettier-ignore
export const a_Function_normalAnonymous = (() => function(arg1?, arg2?) { return "double quotes" + 'single quotes' + `backtick quotes` })()

// prettier-ignore
export const a_Function_arrowNamed = (arg1?, arg2?) => "double quotes" + 'single quotes' + `backtick quotes`
// prettier-ignore
export const a_Function_arrows_anonymous = (()=> (arg1?, arg2?) => "double quotes" + 'single quotes' + `backtick quotes`)()

// Async functions

// prettier-ignore
export async function a_Function_async_normal_named(arg1?, arg2?) { return "double quotes" + 'single quotes' + `backtick quotes` }
// prettier-ignore
export const a_Function_Async_normalAnonymous = (() => async function(arg1?, arg2?) { return "double quotes" + 'single quotes' + `backtick quotes` })()

// prettier-ignore
export const a_Function_async_arrow_named = async (arg1?, arg2?) => "double quotes" + 'single quotes' + `backtick quotes`
// prettier-ignore
export const a_Function_async_arrow_anonymous = (() => async (arg1?, arg2?) => "double quotes" + 'single quotes' + `backtick quotes`)()

// Generator functions

// prettier-ignore
export const a_GeneratorFunction_named = function* a_GeneratorFunction_named(arg1?, arg2?) {
  yield "double quotes" + 'single quotes' + `backtick quotes`
}

// prettier-ignore
export const a_GeneratorFunction_anonymous = (() => function* (arg1?, arg2?) {
  yield "double quotes" + 'single quotes' + `backtick quotes`
})()

// Async Generator functions

// prettier-ignore
export async function* a_GeneratorFunction_async_named(arg1?, arg2?) {
  await delay()
  yield await Promise.resolve("double quotes" + 'single quotes' + `backtick quotes`)
}

// prettier-ignore
export const a_GeneratorFunction_async_anonymous = (() => async function* (arg1?: any, arg2?: any) {
  await delay()
  yield await Promise.resolve("double quotes" + 'single quotes' + `backtick quotes`)
})()

// function with props
// prettier-ignore
export function a_Function_withProps(arg1?: any, arg2?: any) {
  return "double quotes" + 'single quotes' + `backtick quotes`
}
// @todo: add Common props
a_Function_withProps.functionStringProp1 = 'functionStringProp value'
a_Function_withProps.functionNumberProp2 = 123
;(a_Function_withProps as any)[Symbol.for('functionSymbolProp')] = 'functionSymbolProp value'

// Arguments

export const get_arguments = () =>
  (function (...args: (number | string | Record<string, string>)[]) {
    return arguments // beware of TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
  })(10, 'string argument', 'tooBad argument rejected by filter', { prop: 'val' })

export const a_Arguments = get_arguments()
export const a_Arguments_indexes: NumberString[] = _.times(
  a_Arguments.length,
  _.toString
) as NumberString[] // argmument indexes NumberString ['0', '1' ,'2']

export const a_Arguments_values = [
  10,
  'string argument',
  'tooBad argument rejected by filter',
  { prop: 'val' },
] as const
// export type TArguments_values = typeof a_Arguments_values[number] // They are ignored by TypeScript!

// # Generators

export const get_Generator_of_Tvalues = (): Generator<Tvalues, 'Generator_TReturn', any> => // return type needed for TS@5.6.x
  (function* () {
    for (const val of a_Array_of_Tvalues) {
      yield val
    }

    return 'Generator_TReturn' as const
  })()

export const a_Generator_of_Tvalues = get_Generator_of_Tvalues()

export type TmyGenerator = ReturnType<typeof get_Generator_of_Tvalues>

export const get_Generator_of_Tvalues_withCommonProps = () =>
  add_CommonProps(get_Generator_of_Tvalues())

export type TGeneratorWithCommonProps = ReturnType<
  typeof get_Generator_of_Tvalues_withCommonProps
>

export const a_Generator_of_Tvalues_withCommonProps = get_Generator_of_Tvalues_withCommonProps()

// # AsyncGenerator

export const get_AsyncGenerator_of_Tvalues = (): AsyncGenerator<Tvalues, 'AsyncGenerator_TReturn', any> => // return type needed for TS@5.6.x
  (async function* () {
    for (const val of a_Array_of_Tvalues) {
      await delay()
      yield val
    }

    return 'AsyncGenerator_TReturn' as const
  })()

export type TmyAsyncGenerator = ReturnType<typeof get_AsyncGenerator_of_Tvalues>

export const get_AsyncGenerator_of_Tvalues_withCommonProps = () =>
  add_CommonProps(get_AsyncGenerator_of_Tvalues())

export type TmyAsyncGeneratorWithProps = ReturnType<
  typeof get_AsyncGenerator_of_Tvalues_withCommonProps
>

export const a_AsyncGenerator_of_Tvalues = get_AsyncGenerator_of_Tvalues()
export const a_AsyncGenerator_of_Tvalues_withCommonProps =
  get_AsyncGenerator_of_Tvalues_withCommonProps()

export function get_plainIteratorPOJSO(): Iterator<Tvalues> {
  let counter = 0

  const _iterator = {
    [Symbol.iterator]() {
      return _iterator
    },

    next() {
      const value = a_Array_of_Tvalues[counter]
      counter++
      const done = counter > a_Array_of_Tvalues.length

      return { done, value }
    },

    // @todo: use common props
    someOtherProp1: 'someOtherValue',
    someOtherProp2: ['someOther', 'ArrayValue'],
    tooBadProp: 'tooBadPropValue - rejected by filter',
    [Symbol.for('someSymbolProp')]: { someOther: 'SymbolObjectValue' },
  }

  return _iterator
}

export function get_plainAsyncIteratorPOJSO() {
  let counter = 0

  const _iterator = {
    [Symbol.asyncIterator]() {
      return _iterator
    },

    async next() {
      const value = a_Array_of_Tvalues[counter]
      counter++
      const done = counter > a_Array_of_Tvalues.length

      await delay()
      return { done, value }
    },

    // @todo: use common props
    someOtherProp1: 'someOtherValue',
    someOtherProp2: ['someOther', 'ArrayValue'],
    tooBadProp: 'tooBadPropValue - rejected by filter',
    [Symbol.for('someSymbolProp')]: { someOther: 'SymbolObjectValue' },
  }

  return _iterator
}

// # ArrayBuffer

export const get_arrayBuffer_Uint8 = (data: number[] = get_Array_of_numbers()): ArrayBuffer => {
  const arrayBuffer = new ArrayBuffer(8)
  const dataView = new DataView(arrayBuffer)
  _.each(data, (value, idx) => dataView.setUint8(idx, value))

  return arrayBuffer
}

export const a_arrayBuffer_Uint8 = get_arrayBuffer_Uint8()

export const get_arrayBuffer_Uint16 = (data?: number[]): ArrayBuffer => {
  const arrayBuffer = new ArrayBuffer(16)
  const dataView = new DataView(arrayBuffer)
  data ||= get_Array_of_numbers()
  _.each(data, (value, idx) => dataView.setUint16(idx * 2, value, true))

  return arrayBuffer
}

// # Promise
export const PROMISE_RESOLVED_VALUE = 'Promise resolved value' as const
export type T_PROMISE_RESOLVED_VALUE = typeof PROMISE_RESOLVED_VALUE
export const a_Promise = Promise.resolve(PROMISE_RESOLVED_VALUE)
export const a_Promise_withCommonProps = add_CommonProps(
  Promise.resolve(PROMISE_RESOLVED_VALUE)
)

export const manyTypesAndPossibleValues: Record<ManyNames, any[]> = {
  Array: [
    ['this', 'is', 1, 'array'],
    get_sparseArray_of_Tvalues_and_extras_withCommonAndArrayExtraProps(),
    a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  ],
  TypedArray: [
    new Float32Array(12),
    new Float64Array(12),
    new Int8Array(12),
    new Int16Array(12),
    new Int32Array(12),
    new Uint8Array(12),
    new Uint8ClampedArray(12),
    new Uint16Array(12),
    new Uint32Array(12),
  ],
  ArrayBuffer: [new ArrayBuffer(12)],
  arguments: [a_Arguments],
  class: [
    // Classes are function constructors, but are recognised by _z.type
    class A {},
    Person,
    Employee,

    // System classes
    ArrayBuffer,
    Uint32Array,
    Float32Array,
    Array,
    Object,
  ],
  realObject: [
    {
      someProp: 'SomeVal',
    },
    a_instance_withCommonProps,
    new Object(),
    Object.create({}),
    Object.create(a_instance_withCommonProps),
    new (function () {} as any)(), // also works for plain objects {}, BUT NOT for Function and Array
  ],

  Set: [
    get_Set_of_Tvalues(),
    get_Set_of_Tvalues_withCommonProps(),
    new (class MySet extends Set {})(),
  ],
  Map: [
    get_Map_of_TMapKeys_Tvalues(),
    get_Map_of_TMapKeys_Tvalues_WithCommonProps(),
    new (class MyMap extends Map {})(),
  ],
  SetIterator: [
    get_Set_of_Tvalues().entries(),
    get_Set_of_Tvalues().values(),
    get_Set_of_Tvalues().keys(),
  ],
  MapIterator: [
    get_Map_of_TMapKeys_Tvalues().entries(),
    get_Map_of_TMapKeys_Tvalues().values(),
    get_Map_of_TMapKeys_Tvalues().keys(),
  ],
}

export const iteratorsGenerators = {
  Iterator: [
    get_Set_of_Tvalues(),
    get_Map_of_TMapKeys_Tvalues(),
    get_Set_of_Tvalues().entries(),
    get_Map_of_TMapKeys_Tvalues().entries(),
    get_plainIteratorPOJSO(),
  ],
  Generator: [
    a_GeneratorFunction_named('foobar'),
    get_AsyncGenerator_of_Tvalues_withCommonProps(),
  ],
  AsyncGenerator: [a_GeneratorFunction_async_named('foobar')],
  AsyncIterator: [get_plainAsyncIteratorPOJSO()],
}

export const singleTypesAndPossibleValues: Record<SingleNames, Single[]> = {
  string: ['I am a String!', String('I am yet another String')],
  String: [new String('I am another String')],
  number: [667, 123.456, Number(`123`)],
  Number: [new Number(668.13), new Number(-1), new Number(0)],
  NaN: [Number.NaN, NaN, Number('foobar')],
  bigint: [BigInt(123_456_789), 1_243_567n],

  DataView: [new DataView(new ArrayBuffer(13))],
  Date: [new Date()],
  RegExp: [/./g, new RegExp('/./')],
  boolean: [true, false],
  Boolean: [new Boolean(true), new Boolean(false)],
  null: [null],

  undefined: [undefined, void 0, (function () {})()],

  function: [
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
    Promise.resolve, // see https://stackoverflow.com/a/72326559/799502
  ],
  symbol: [Symbol('aSymbol'), Symbol.for('aSymbol')],
  // Symbol: [Symbol('anotherSymbol'), Symbol.for('anotherSymbol'), ],

  Promise: [(async function waitAminute() {})(), Promise.resolve(123)],
  Error: [
    new Error('An error message'),
    new TypeError('A type error message'),
    new (class MyError extends Error {})(),
  ],
}

export const allTypesAndPossibleValues: Record<TypeNames, any[]> = _.extend(
  {},
  singleTypesAndPossibleValues,
  manyTypesAndPossibleValues,
  {
    WeakSet: [a_WeakSet_of_Person],
    WeakMap: [a_WeakMap_of_Person_Employees],
  }
)

export const allRealTypesAndPossibleValues = _.extend({}, allTypesAndPossibleValues, {
  // object
  userInstance: [a_instance_withCommonProps, a_Person, a_Employee],
  systemInstance: [
    process,
    get_Generator_of_Tvalues(),
    get_AsyncGenerator_of_Tvalues(),
    // Not many systemInstances resulted from _z.realType() ;-(
    //
    // These are POJSOs
    // global
    // console

    // These have their own type (Date, RegExp etc) hence not denominated as `systemInstance`,
    // although their classType being a `systemClass`
    // new Date(),
    // new RegExp('aRegExp'),
    // new DataView(new ArrayBuffer(8)),
    // new ArrayBuffer(8),
    // new WeakSet(),
  ],
  pojso: [{}, { foo: 'bar' }, Object.create(null), Object.create({}), global, console],

  // class
  userClass: [Person, Employee, class MyArray extends Array {}],
  systemClass: [
    Boolean,
    Number,
    String,
    Date,
    Function,
    Error,
    RegExp,
    Array,
    Promise,
    DataView,
    WeakSet,
    WeakMap,
    Int32Array,
    Int16Array,
    Uint8Array,
    Float32Array,
    Map,
    Set,
  ],

  // function
  ArrowFunction: [a_Function_arrows_anonymous, a_Function_arrowNamed],
  Function: [a_Function_normalAnonymous, a_Function_normalNamed],
  AsyncFunction: [a_Function_Async_normalAnonymous, a_Function_async_normal_named],
  GeneratorFunction: [a_GeneratorFunction_anonymous, a_GeneratorFunction_named],
  AsyncGeneratorFunction: [
    a_GeneratorFunction_async_anonymous,
    a_GeneratorFunction_async_named,
  ],

  // TypedArrays
  Float32Array: [new Float32Array(12)],
  Float64Array: [new Float64Array(12)],
  Int8Array: [new Int8Array(12)],
  Int16Array: [new Int16Array(12)],
  Int32Array: [new Int32Array(12)],
  Uint8Array: [new Uint8Array(12)],
  Uint8ClampedArray: [new Uint8ClampedArray(12)],
  Uint16Array: [new Uint16Array(12)],
  Uint32Array: [new Uint32Array(12)],
})

export const getMapProjection =
  (mapProjectionId: number = 1) =>
  (item, idxOrKey?, input?, count?) => {
    const projectType: { [Property in TypeNames]?: Function } = {
      number: (item, idxOrKey) => item + 100 * mapProjectionId,
      bigint: (item, idxOrKey) => item + 100n * BigInt(mapProjectionId),
      string: (item, idxOrKey) => `${item} !changeByMapProjectionId#${mapProjectionId}!`,
      boolean: (item, idxOrKey) => !item,
      realObject: (item, idxOrKey) =>
        realObjectType(item) === 'instance'
          ? item
          : {
              ...item,
              [`changeByMapProjectionId${mapProjectionId}`]: mapProjectionId,
            },
      symbol: (item, idxOrKey) =>
        Symbol.for(`${Symbol.keyFor(item)} !changeByMapProjectionId#${mapProjectionId}!`),
      undefined: (item, idxOrKey) => null,
      null: (item, idxOrKey) => {},
      function: _.identity,
      class: _.identity,
      Promise: _.identity,
      Array: (item) => [`!changeByMapProjectionId#${mapProjectionId}!`, ...item],
      Date: (val) => new Date(val.getTime() + 1000 * 60 * 60 * 24),
      RegExp: (item) => {
        const flags = item.flags
        return new RegExp(`${item.source}!changeByMapProjectionId#${mapProjectionId}!`, flags)
      },
    }

    if (!_.isFunction(projectType[type(item)])) projectType[type(item)] = _.identity
    // throw new TypeError(`getMapProjection(): type(item) '${type(item)}' is not supported. Value = ` + item,)

    return (projectType[type(item)] as any)(item, idxOrKey)
  }

export const filterValues = (item, idxOrKey?) => {
  const projectType: { [Property in TypeNames]?: Function } = {
    number: (item, idxOrKey) => item % 2 === 0,
    bigint: (item: bigint, idxOrKey) => item % BigInt(2) === BigInt(0),
    string: (item, idxOrKey) => !_.startsWith(item, 'tooBad'),
    boolean: (item, idxOrKey) => item,
    realObject: (item, idxOrKey) => !item['tooBad'],
    symbol: (item, idxOrKey) => !_.startsWith(Symbol.keyFor(item), 'tooBad'),
    undefined: (item, idxOrKey) => true,
    null: (item, idxOrKey) => false,
    // function: _.identity,
    // class: _.identity,
    // Promise: _.identity,
    Array: (item) => item[0] !== 'tooBad',
    Date: (val) => !_.isEqual(new Date(2048, 0, 1), val),
    Error: (val) => val.message !== 'tooBad',
    RegExp: (item) => item.source !== 'tooBad',
  }

  if (!_.isFunction(projectType[type(item)])) projectType[type(item)] = () => true
  // throw new TypeError(`getMapProjection(): type(item) '${type(item)}' is not supported. Value = ` + item,)

  return (projectType[type(item)] as any)(item, idxOrKey)
}

export const filter_takeN = (n: number) => {
  return (item, idxKey, value, count?) => {
    // console.log('filter_takeN', {count, item, idxKey})
    if (count > n) return STOP

    return true
  }
}

export const filter_takeN_returnValue = (n: number) => {
  return (item, idxKey, value, count?) => {
    // console.log('filter_takeN', {count, item, idxKey})
    if (count >= n) return STOP(item)

    return true
  }
}

export const map_takeN = (n: number) => {
  let counter = 0
  return (item) => {
    counter++
    if (counter > n) {
      counter = 0 // reset counter
      return STOP
    }
    // @todo: if (counter >= n) STOP(item)

    return item
  }
}

export const falsiesNotFalse = ['', null, undefined, 0]

/**
 * Without `props: true`, all non-realObjects ignore these options and don't bring props, but their native keys.
 */
export const noPropsKeysOptionsUntyped = {
  enumerables: true,
  own: true,
  strict: false,
  inherited: false,
  top: false,
  nonEnumerables: false,
} // NO satisfies KeysOptions, we want the non-literal types (eg boolean instead of true)

export const noPropsKeysOptionsAsConst = {
  enumerables: true,
  own: true,
  strict: false,
  inherited: false,
  top: false,
  nonEnumerables: false,
} as const satisfies IKeysOptions

export const noPropsKeysOptionsTyped: IKeysOptions = {
  enumerables: true,
  own: true,
  strict: false,
  inherited: false,
  top: false,
  nonEnumerables: false,
} // as const

export type T_NEW_TYPE = 'NEW_TYPE'
export const NEW_TYPE: T_NEW_TYPE = 'NEW_TYPE'

process.stdout.write('\u001b[2J') // https://github.com/mochajs/mocha/issues/2312#issuecomment-1976329612
