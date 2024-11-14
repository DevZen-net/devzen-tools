// @-ts-nocheck
import * as _ from 'lodash'
import { expectType, TypeEqual } from 'ts-expect'
import { IfAny, IfNever, IsBooleanLiteral, IsNever, IsStringLiteral } from 'type-fest'
import { each, isMapIterator, loop, map } from '../code'
import { NumberString } from '../code/typezen/isNumberString'
import { LogZenMini } from '../code/LogZenMini'
import { equalSetDeep } from './specHelpers'
import {
  a_Arguments,
  a_Array_of_Tvalues,
  a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  a_Array_ofKeys,
  a_arrayBuffer_Uint8,
  a_AsyncGenerator_of_Tvalues_withCommonProps,
  a_Generator_of_Tvalues,
  a_Generator_of_Tvalues_withCommonProps,
  a_Map_of_TMapKeys_Tvalues, a_Map_of_TMapKeys_Tvalues_WithCommonProps,
  a_Set_of_Tvalues,
  add_CommonProps,
  get_Array_of_numbers,
  get_arrayBuffer_Uint16,
  get_arrayBuffer_Uint8,
  get_Map_of_TMapKeys_Tvalues,
  getMapProjection,
  symbolProp,
  TarrayAndCommonStringProps,
  TarrayAndCommonStringProps_values,
  type TcommonStringProps,
  type TcommonStringProps_values,
  TcommonSymbolProps,
  type TcommonSymbolProps_values, TMapKeys,
  tooBadSymbolProp,
  Tvalues,
} from './test-data'
import * as _z from '../code'

// props  copied/mapped of map()

const options = { props: 'all' } as const

// const inputValue = add_CommonProps(new Date(`2024-06-08`))

// const inputValue =  add_CommonProps(new String('String Boxed Value'))
// const inputValue = new String('String Boxed Value')

// expectType<TypeEqual<typeof result, ExpectedLoopGenerator>>(true)

// const getInputWithExtraCommonProps = () => Promise.resolve('Promise resolved value')
// const getInputWithExtraCommonProps = () => add_CommonProps(Promise.resolve('Promise resolved value'))
// const getInputWithExtraCommonProps = () => add_CommonProps(new String('Promise resolved value'))

const inputValue1 = a_Array_of_Tvalues_withCommonAndArrayExtraProps
const mapResult = map(a_Array_of_Tvalues_withCommonAndArrayExtraProps, (item, idxOrKey) => {
  expectType<TypeEqual<typeof item, Tvalues>>(true)
  expectType<TypeEqual<typeof idxOrKey, number>>(true)

  // console.log(item)
  return item
})
// @ts-expect-error fix
expectType<TypeEqual<typeof mapResult, typeof inputValue1>>(true)

// ##### Array Simple

const a_arraySimple: number[] = [1, 2, 3]

type TarraySimple1 = Pick<typeof a_arraySimple, any>
type TarraySimple2 = Pick<typeof a_arraySimple, any> & number[]
type TarraySimple3 = Pick<typeof a_arraySimple, any> & Array<number>

// @ts-expect-error @todo(222): this could work, but doesnt!
expectType<TypeEqual<typeof a_arraySimple, TarraySimple1>>(true)
// @ts-expect-error @todo(222): this could work, but doesnt!
expectType<TypeEqual<typeof a_arraySimple, TarraySimple2>>(true)
// @ts-expect-error @todo(222): this could work, but doesnt!
expectType<TypeEqual<typeof a_arraySimple, TarraySimple3>>(true)

// # Array Vanilla - without ECP

type Tarray1 = Pick<typeof a_Array_of_Tvalues, any>
type Tarray2 = Pick<typeof a_Array_of_Tvalues, any> & Tvalues[]
type Tarray3 = Pick<typeof a_Array_of_Tvalues, any> & Array<Tvalues>

// @ts-expect-error @todo(222): this could work, but doesnt!
expectType<TypeEqual<typeof a_Array_of_Tvalues, Tarray1>>(true)
// @ts-expect-error @todo(222): this could work, but doesnt!
expectType<TypeEqual<typeof a_Array_of_Tvalues, Tarray2>>(true)
// @ts-expect-error @todo(222): this could work, but doesnt!
expectType<TypeEqual<typeof a_Array_of_Tvalues, Tarray3>>(true)

const arrayVarTest = (array1_0: typeof a_Array_of_Tvalues, array1_1: Tarray2) => {
  // Array prototype
  array1_0.push(123)
  array1_1.push(123)

  // @ts-expect-error OK - not a Tvalue!
  array1_0.push(777)
  // @ts-expect-error OK - not a Tvalue!
  array1_1.push(777)
}

// # Array with Common and Extra Common Props

type TOnlyProps = Pick<
  typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  TarrayAndCommonStringProps | TcommonSymbolProps
>
type TarrayWithAllProps2 = Pick<
  typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  TarrayAndCommonStringProps | TcommonSymbolProps
> &
  Tvalues[]
type TarrayWithAllProps3 = Pick<
  typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  TarrayAndCommonStringProps | TcommonSymbolProps
> &
  Array<Tvalues>

type TarrayWithSomeProps = Pick<
  typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  'stringProp' | typeof symbolProp
> &
  Array<Tvalues>

expectType<
  TypeEqual<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, TOnlyProps>
  // @ts-expect-error @todo(222): this could work, but doesnt!
>(true)
expectType<
  TypeEqual<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, TOnlyProps>
  // @ts-expect-error @todo(222): this could work, but doesnt!
>(true)
expectType<
  TypeEqual<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, TarrayWithAllProps2>
  // @ts-expect-error @todo(222): this could work, but doesnt!
>(true)

const arrayVarTestECP = (
  array1_0: typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  array1_1: TOnlyProps,
  array2_1: TarrayWithAllProps2,
  array3_1: TarrayWithAllProps3,
  arraWithSomeProps: TarrayWithSomeProps
) => {
  // Array prototype
  array1_0.push(123)
  // @ts-expect-error OK - not an Array[]!
  array1_1.push(123)
  array2_1.push(123)
  array3_1.push(123)

  // @ts-expect-error OK - not a Tvalue!
  array1_0.push(777)
  // @ts-expect-error OK - not a Tvalue!
  array1_1.push(777)

  // @ts-expect-error OK - not a prop
  array1_0.WRONG_PROP = 'commonStringProp'

  array1_0.stringProp = 'stringProp value'
  // @ts-expect-error OK - wrong value type
  array1_0.stringProp = 'WRONG value'

  expectType<TypeEqual<(typeof array1_1)[typeof symbolProp], 'symbolProp value'>>(true)
  // @ts-expect-error OK - readonly prop! TS2540: Cannot assign to [symbolProp] because it is a read-only property
  array1_1[symbolProp] = 'symbolProp value'

  expectType<
    TypeEqual<
      (typeof array1_1)[typeof tooBadSymbolProp],
      'tooBadSymbolPropValue - rejected by filter'
    >
  >(true)

  // @ts-expect-error OK - wrong value type
  array1_1[symbolProp] = 'WRONG value'

  // some props only
  expectType<TypeEqual<(typeof arraWithSomeProps)['stringProp'], 'stringProp value'>>(true)
  expectType<
    // @ts-expect-error OK - TS2339: Property tooBadProp does not exist on type
    TypeEqual<(typeof arraWithSomeProps)['tooBadProp'], 'tooBadPropValue - rejected by filter'>
  >(true)
}

const TestMap = () => {
  // const a_Map_WithSomeProps:
  //   Map<'key1' | 'key2', {   val: 1 } | {   val: 2 }> & { stringProp: 'stringProp value'}
  //
  //   = new Map([
  //   ['key1' as const, {val:1 as const}],
  //   ['key2' as const, {val:2 as const}]
  // ])
  
  const mapResult = map(a_Map_of_TMapKeys_Tvalues_WithCommonProps, (item, idxOrKey) => {
    expectType<TypeEqual<typeof item, Tvalues>>(true)
    expectType<TypeEqual<typeof idxOrKey, TMapKeys>>(true)

    // console.log(item)
    return item
  })
  // @ts-expect-error @todo(111): probably can't be fixed, we dont care about the exact thing
  expectType<TypeEqual<typeof mapResult, typeof inputValue1>>(true)

  // @ts-expect-error OK - symbols not copied by default!
  expectType<TypeEqual<(typeof mapResult)[typeof symbolProp], 'symbolProp value'>>(true)
  // @ts-expect-error OK - neither strings are, cause props: false by default
  expectType<TypeEqual<(typeof mapResult)['stringProp'], 'stringProp value'>>(true)

  // const mapResultWithProps = map(a_Array_of_Tvalues, (item, idxOrKey) => {
  const mapResultWithProps = map(
    a_Map_of_TMapKeys_Tvalues_WithCommonProps,
    (item, idxOrKey) => {
      // expectType<TypeEqual<typeof item, TarrayAndCommonStringProps_values>>(true)
      // expectType<TypeEqual<typeof idxOrKey, TarrayAndCommonStringProps>>(true)

      // console.log(item)
      return item as Tvalues
    },
    {
      // props: true,
      props: 'all',
      string: true,
      // symbol: true
    }
  )
  console.log(mapResultWithProps)
  
  type ExpectedProps = TcommonStringProps_values // | TcommonSymbolProps_values
  
  // @ts-expect-error OK - symbols not copied by default!
  expectType<TypeEqual<(typeof mapResultWithProps)[typeof symbolProp], ExpectedProps>>(
    true
  )
  expectType<
    // @ts-expect-error OK - symbols not copied by default!
    TypeEqual<(typeof mapResultWithProps)[TcommonSymbolProps], ExpectedProps >
  >(true)
  
  // But strings are copied, when props: true
  // @ts-expect-error @todo: should work with props: true
  expectType<TypeEqual<(typeof mapResultWithProps)['stringProp'], ExpectedProps>>(true)
  // @ts-expect-error @todo: should work with props: true
  expectType<TypeEqual<(typeof mapResultWithProps)[TcommonStringProps], ExpectedProps>>(true)
  
  
  // a_Array_of_Tvalues
  type Texpected_props = never
  type Texpected_props_values = never

  // a_Array_of_Tvalues_withCommonAndArrayExtraProps
  // type Texpected_props = TcommonStringProps
  // type Texpected_props_values = TcommonStringProps_values

  // But strings are, when props: true
  // expectType<TypeEqual<(typeof mapResultWithProps)['stringProp'], 'stringProp value'>>(true)
  expectType<
    TypeEqual<
      IfNever<Texpected_props, never, (typeof mapResultWithProps)[Texpected_props]>,
      IfNever<Texpected_props, never, Texpected_props_values>
    >
  >(true)

  // expectType<TypeEqual<(typeof mapResultWithProps)[never], typeof mapResultWithProps>>(true)
}

TestMap()
