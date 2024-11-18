import { expectType, TypeEqual } from 'ts-expect'
import { TypedArray, ValueOf } from 'type-fest'
import { IKeys_DefaultOptions, IKeysOptions, Props } from '../code'
import { values } from '../code/loopzen/values'
import {
  PropsOfKnownPrototype_stringNonEnumerablesInherited,
  PropsOfKnownPrototype_stringNonEnumerablesOwn,
  PropsOfKnownPrototype_symbolNonEnumerablesInherited,
  PropsOfKnownPrototype_symbolNonEnumerablesOwn,
} from '../code/typezen/types-info'
import {
  a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  a_TypedArray_BigInt64Array,
  TarrayAndCommonStringProps_values,
} from '../test-utils/test-data'

type ValuesOfTypedArray<Tinput extends TypedArray> = ValueOf<Tinput, 'buffer'>
type ValuesOfArray<Tinput extends Array<any>> = ValueOf<Tinput, 'forEach'>

// type ValuesOfAllArrays<Tinput extends Array<any> | TypedArray> = ValueOf<
//   Tinput,
//   Tinput extends Array<any>
//     ? 'forEach'
//     : Tinput extends TypedArray
//       ? 'buffer' // fails
//       : never
// >

type ValuesOfSet<Tinput extends Set<any>> = ValueOf<Tinput, 'has'>
type ValuesOfObject<Tinput extends Object> = ValueOf<
  Tinput,
  | 'toLocaleString'
  | 'toString'
  | 'valueOf'
  | 'hasOwnProperty'
  | 'isPrototypeOf'
  | 'propertyIsEnumerable'
  | 'constructor'
  | 'should'
>
type ValuesOfMap<Tinput extends Map<any, any>> = ValueOf<Tinput, 'set'>

// type ValuesOfSetOrMap<Tinput extends Set<any> | Map<any, any>> = ValueOf< // fails
// type ValuesOfSetOrMap<Tinput> = ValueOf<
//   Tinput,
//   Tinput extends Set<any>
//     ? 'has'
//     : Tinput extends Map<any, any>
//       ? 'set' // fails
//       : never
// >

// WORKS
// type ValuesOfSetOrMap3<Tinput extends Set<any> | Map<any, any>> =
type ValuesOfSetOrMap3<Tinput> =
  Tinput extends Set<any>
    ? ValueOf<Tinput, 'add'>
    : Tinput extends Map<any, any>
      ? ValueOf<Tinput, 'set'>
      : never

type PropsOfType<Tinput> =
  Tinput extends Set<any> ? 'add' : Tinput extends Map<any, any> ? 'set' : never

expectType<TypeEqual<PropsOfType<Set<any>>, 'add'>>(true)
expectType<TypeEqual<PropsOfType<Set<any>>, string>>(false)

expectType<TypeEqual<PropsOfType<Map<any, any>>, 'set'>>(true)
expectType<TypeEqual<PropsOfType<Map<any, any>>, string>>(false)

// type ValuesOfSetOrMap4<Tinput extends object> =
type ValuesOfSetOrMap4<Tinput, TkeysOptions extends IKeysOptions = IKeys_DefaultOptions> =
  Tinput extends Set<any>
    ? ValueOf<Tinput, PropsOfKnownPrototype_stringNonEnumerablesInherited<Tinput>>
    : Tinput extends Map<any, any>
      ? ValueOf<Tinput, PropsOfKnownPrototype_stringNonEnumerablesInherited<Tinput>>
      : never

// type ValuesOfSetOrMap5<Tinput extends object> =
//   ValueOf<Tinput, PropsOfKnownPrototype_stringNonEnumerablesInherited<Tinput>>

type PropsOfKnownPrototype_stringNonEnumerablesOwn_typedArray =
  PropsOfKnownPrototype_stringNonEnumerablesOwn<typeof a_TypedArray_BigInt64Array>

type ValuesTemp<
  Tinput extends TypedArray,
  // Tinput extends Array<any>,
  // Tinput extends Set<any>
  // Tinput extends Map<any, any>,
  // Tinput extends TypedArray | Array<any>,
  // Tinput extends Set<any> | Map<any, any>,
  // Tinput extends SystemClasses,
> = ValueOf<
  Tinput,
  | PropsOfKnownPrototype_stringNonEnumerablesInherited<Tinput>
  // | PropsOfKnownPrototype_stringNonEnumerablesOwn<Tinput> // fails TypedArray
  // | PropsOfKnownPrototype_stringNonEnumerablesOwn<typeof aTypedArray_bigint> // works
  // | PropsOfKnownPrototype_stringNonEnumerablesOwn_typedArray // works
  // | Exclude<PropsOfKnownPrototype_stringNonEnumerablesOwn<Tinput>, 'callee'> // works
  // | Exclude<PropsOfKnownPrototype_stringNonEnumerablesOwn<Tinput>, 'message'> // works !!!! If either of these is excluded, it works!
  // | Exclude<PropsOfKnownPrototype_stringNonEnumerablesOwn<Tinput>, 0> // works !!!! ?????
  // | Exclude<PropsOfKnownPrototype_stringNonEnumerablesOwn<Tinput>, null> // works !!!! Even if null is excluded, it works!
  | Exclude<PropsOfKnownPrototype_stringNonEnumerablesOwn<Tinput>, 'FOOBAR_USELESS'> // works !!!! if anything stupid is excluded, it works!
  | PropsOfKnownPrototype_symbolNonEnumerablesInherited<Tinput>
  | PropsOfKnownPrototype_symbolNonEnumerablesOwn<Tinput>
>

// type ValuesTempTest = ValuesTemp<typeof aTypedArray_bigint>
// type ValuesTempTest2 = ValuesTemp<Array<any>>

type Valuea_Array_of_Tvalues_withCommonAndExtraPropsOfoptionsPropsTrue = ValueOf<
  typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  // never // any //
  Props<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, { props: true }> //| number
>

expectType<
  TypeEqual<
    Valuea_Array_of_Tvalues_withCommonAndExtraPropsOfoptionsPropsTrue,
    // Tvalues
    // | number // length, when nonEnumerables: true
    TarrayAndCommonStringProps_values
  >
>(true)

// props: true
const valuesProps = values(a_Array_of_Tvalues_withCommonAndArrayExtraProps, { props: true })
