import { IsEqual, ValueOf } from 'type-fest'
import { Props, typeIsTrue } from '../code'
import {
  Tarray_prototype_stringNonEnumerablesInherited,
  Tarray_prototype_stringNonEnumerablesOwn,
  Tarray_prototype_symbolNonEnumerablesInherited,
} from '../code/typezen/types-info'
import {
  a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  TarrayAndCommonStringProps,
  TarrayAndCommonStringProps_values,
  TcommonSymbolProps,
  TcommonSymbolProps_values,
} from '../test-utils/test-data'

// export type ValueOf2<ObjectType, ValueType extends ((keyof ObjectType) | string) = keyof ObjectType> = ObjectType[ValueType];
//
// type ValueOfProps<
//   TInput extends object,
//   TkeysOptions extends KeysOptions = Keys_DefaultOptions,
//   // > = ValueOf<TInput, PropsOfKnownPrototype<TInput, TkeysOptions, true>>
// > = ValueOf<TInput, Props<TInput, TkeysOptions>>

type NonNumericKeys<Tinput> = {
  [K in keyof Tinput]: Tinput extends { [P in K]: Tinput[K] }
    ? K extends number
      ? never
      : K
    : never
}[keyof Tinput]

/**
 * Similar to ValueOf, but get ONLY the values of string or symbol props, omitting the values of array elements with numeric indexes.
 */
export type ValueOfArrayNonIndexPropValues<Tinput> = Tinput[NonNumericKeys<Tinput>]

// test
type TestNonNumericKeys = Exclude<
  NonNumericKeys<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>,
  | Tarray_prototype_stringNonEnumerablesInherited
  | Tarray_prototype_symbolNonEnumerablesInherited
  | Tarray_prototype_stringNonEnumerablesOwn
>
typeIsTrue<IsEqual<TestNonNumericKeys, TarrayAndCommonStringProps | TcommonSymbolProps>>()

type TestValueOfNonNumericKeys = Exclude<
  ValueOf<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, TestNonNumericKeys>,
  never
>

// string prop values
const as2: TestValueOfNonNumericKeys = 'stringProp value'
const as3: TestValueOfNonNumericKeys = ['an', 'array prop value']
// symbol prop values
const as1: TestValueOfNonNumericKeys = 'symbolProp value'
const as4: TestValueOfNonNumericKeys = 128n

// @ts-expect-error OK
const asWrong: TestValueOfNonNumericKeys = 666n
// @ts-expect-error OK
const aswrong1: TestValueOfNonNumericKeys = 'WRONG'
// @ts-expect-error OK
const aswrong2: TestValueOfNonNumericKeys = ['anss', 'array prop value']

typeIsTrue<
  IsEqual<
    TestValueOfNonNumericKeys,
    TarrayAndCommonStringProps_values | TcommonSymbolProps_values
  >
>()

// type TestValueOfArrayNonIndexPropValues2 = ValueOfArrayNonIndexPropValues<
//   typeof a_Array_of_Tvalues_withCommonAndExtraProps>

type TinputArray = typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps
type TestValueOfProps = ValueOf<
  TinputArray,
  Exclude<Props<TinputArray, { symbol: true }>, number>
>

const as22: TestValueOfProps = 'stringProp value'
const as32: TestValueOfProps = ['an', 'array prop value']
const as12: TestValueOfProps = 'symbolProp value'
const as422: TestValueOfProps = 128n
// @ts-expect-error OK
const as2222: TestValueOfProps = 'WRONG'
// @ts-expect-error OK
const as42: TestValueOfProps = ['anss', 'array prop value']

typeIsTrue<
  IsEqual<TestValueOfProps, TarrayAndCommonStringProps_values | TcommonSymbolProps_values>
>()

typeIsTrue<IsEqual<TestValueOfProps, TestValueOfNonNumericKeys>>()
