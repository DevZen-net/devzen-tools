import { expectType, TypeEqual } from 'ts-expect'
import { Class, EmptyObject, IsEqual, Simplify, ValueOf } from 'type-fest'
import { MapEntries, SetEntries } from 'type-fest/source/entries'
import {
  a_Arguments,
  a_Array_of_Tvalues,
  a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  a_AsyncGenerator_of_Tvalues_withCommonProps,
  a_Employee,
  a_Generator_of_Tvalues_withCommonProps,
  a_instance_withCommonProps,
  a_Map_of_TMapKeys_Tvalues,
  a_Map_of_TMapKeys_Tvalues_WithCommonProps,
  a_Person,
  a_Set_of_Tvalues,
  a_Set_of_Tvalues_withCommonProps,
  a_TypedArray_BigInt64Array,
  a_TypedArray_Int32Array,
  a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
  a_WeakMap_of_Person_Employees,
  a_WeakSet_of_Person,
  add_CommonProps,
  aMap_of_Tvalues_Tvalues,
  ClassWithStaticCommonProps,
  Employee,
  get_AsyncGenerator_of_Tvalues,
  get_Generator_of_Tvalues,
  T_NEW_TYPE,
  Person,
  pojsoCommonProps,
  symbolPersonKey,
  symbolProp,
  TarrayAndCommonStringProps,
  TcommonStringProps,
  TcommonStringProps_values,
  TcommonSymbolProps,
  TcommonSymbolProps_values,
  TmyAsyncGenerator,
  TmyGenerator,
  Tvalues,
  a_Promise,
  PROMISE_RESOLVED_VALUE,
  T_PROMISE_RESOLVED_VALUE, ClassWithCommonProps, tooBadSymbolProp, symbolProp2, tooBadSymbolProp2,
} from '../../../test-utils/test-data'
import { IKeysOptions } from '../../loopzen/keys'
import { ILoop_DefaultOptions, loop, loop_DefaultOptions } from '../../loopzen/loop'
import { MapIteratorValues } from '../isMapIterator'
import { SetIteratorValues } from '../isSetIterator'
import {
  BasicProps,
  GeneratorType,
  InstanceTypeAll,
  IsAbsent,
  IsAnyOrUnknown,
  IsNestingObject,
  IsPropTrue,
  JustMethods,
  JustProps,
  MethodNames,
  InsideValues,
  PropNames,
  Props,
  PropsOfBaseType,
  PropsOfKnownPrototype,
  PropsString,
  PropsSymbol,
  typeIsFalse,
  typeIsTrue,
  Unliteral,
  BaseType,
  NO_TYPE_CHANGE,
} from '../type-utils'
import {
  Tarray_prototype_stringNonEnumerablesInherited,
  Tarray_prototype_stringNonEnumerablesOwn,
  Tarray_prototype_symbolNonEnumerablesInherited,
  Tmap_prototype_stringNonEnumerablesInherited,
  Tmap_prototype_stringNonEnumerablesOwn,
  Tset_prototype_stringNonEnumerablesInherited,
  Tset_prototype_stringNonEnumerablesOwn,
  TtypedArray_prototype_stringNonEnumerablesInherited,
  TtypedArray_prototype_stringNonEnumerablesOwn,
} from '../types-info'

describe(`Type Utils typing tests`, () => {
  describe(`Options checking PoC: Having a "TkeysOptions extends { string?: true }" is not enough! You need an "... & KeysOptions" to make it work!`, () => {
    it(`# TestOptionsDefaultTrue: check an option, that defaults to "true" (eg "string"), in all possible combinations:`, () => {
      type TestOptionsDefaultTrue<TkeysOptions extends IKeysOptions = {}> =
        // prettier-ignore!
        TkeysOptions extends {
          string?: true
        } & IKeysOptions
          ? 'string is true'
          : 'string is false'

      // # string: true

      type testNoOptionsStringDefaultTrue = TestOptionsDefaultTrue
      expectType<TypeEqual<testNoOptionsStringDefaultTrue, 'string is true'>>(true)

      type testEmptyOptionsStringDefaultTrue = TestOptionsDefaultTrue<{}>
      expectType<TypeEqual<testEmptyOptionsStringDefaultTrue, 'string is true'>>(true)

      type testIrrelevantOptions = TestOptionsDefaultTrue<{
        own: true
      }>
      expectType<TypeEqual<testIrrelevantOptions, 'string is true'>>(true)

      type testStringTrue = TestOptionsDefaultTrue<{
        string: true
      }>
      expectType<TypeEqual<testStringTrue, 'string is true'>>(true)

      type testStringTrueAndIrrelevantOptions = TestOptionsDefaultTrue<{
        string: true
        own: true
      }>
      expectType<TypeEqual<testStringTrueAndIrrelevantOptions, 'string is true'>>(true)

      // # string: false

      type testStringFalse = TestOptionsDefaultTrue<{
        string: false
      }>
      expectType<TypeEqual<testStringFalse, 'string is false'>>(true)

      type testStringFalseAndOtherOptions = TestOptionsDefaultTrue<{
        string: false
        own: true
      }>
      expectType<TypeEqual<testStringFalseAndOtherOptions, 'string is false'>>(true)
    })
    // NOTE: obsolete, we now use IsPropTrue
    it(`# TestOptionsDefaultFalse: check an option that defaults to "false" (eg "symbol"), in all possible combinations `, () => {
      type TestOptionsDefaultFalse<TkeysOptions extends IKeysOptions = {}> =
        // prettier-ignore
        TkeysOptions extends { symbol: true } & IKeysOptions
        ? 'symbol is true'
        : 'symbol is false'

      // // OR
      // TkeysOptions extends { symbol?: false } & KeysOptions
      //   ? 'symbol is false'
      //   : 'symbol is true'

      // # symbol: false

      type testNoOptionsSymbolDefaultFalse = TestOptionsDefaultFalse
      expectType<TypeEqual<testNoOptionsSymbolDefaultFalse, 'symbol is false'>>(true)

      type testEmptyOptionsSymbolDefaultFalse = TestOptionsDefaultFalse<{}>
      expectType<TypeEqual<testEmptyOptionsSymbolDefaultFalse, 'symbol is false'>>(true)

      type testIrrelevantOptionsSymbolDefaultFalse = TestOptionsDefaultFalse<{
        own: true
      }>
      expectType<TypeEqual<testIrrelevantOptionsSymbolDefaultFalse, 'symbol is false'>>(true)

      type testSymbolFalse = TestOptionsDefaultFalse<{
        symbol: false
      }>
      expectType<TypeEqual<testSymbolFalse, 'symbol is false'>>(true)

      type testSymbolFalseAndIrrelevantOptions = TestOptionsDefaultFalse<{
        symbol: false
        own: true
      }>
      expectType<TypeEqual<testSymbolFalseAndIrrelevantOptions, 'symbol is false'>>(true)

      // ## symbol: true

      type testSymbolTrue = TestOptionsDefaultFalse<{
        symbol: true
      }>
      expectType<TypeEqual<testSymbolTrue, 'symbol is true'>>(true)

      type testSymbolTrueAndIrrelevantOptions = TestOptionsDefaultFalse<{
        symbol: true
        own: true
      }>
      expectType<TypeEqual<testSymbolTrueAndIrrelevantOptions, 'symbol is true'>>(true)
    })
  })
  describe(`# PropsOfKnownPrototype`, () => {
    it(`Array`, () => {
      type noOptions_onlyOwnEnumerable = PropsOfKnownPrototype<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
      expectType<TypeEqual<noOptions_onlyOwnEnumerable, never>>(true)

      type emptyOptions_onlyOwnEnumerable = PropsOfKnownPrototype<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, {}>
      expectType<TypeEqual<emptyOptions_onlyOwnEnumerable, never>>(true)

      type onlyOwnEnumerable = PropsOfKnownPrototype<
        typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        {
          own: true
        }
      >
      expectType<TypeEqual<onlyOwnEnumerable, never>>(true)

      type nonEnumerablesOwn = PropsOfKnownPrototype<
        typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        {
          own: true
          nonEnumerables: true
        }
      >
      expectType<TypeEqual<nonEnumerablesOwn, Tarray_prototype_stringNonEnumerablesOwn>>(true)

      type simplifyBREAKS_gets_the_props_of_String_prototype = Simplify<
        PropsOfKnownPrototype<
          typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
          {
            own: true
            nonEnumerables: true
          }
        >
      >
      expectType<TypeEqual<simplifyBREAKS_gets_the_props_of_String_prototype, Tarray_prototype_stringNonEnumerablesOwn>>(true)

      type nonEnumerablesInherited = PropsOfKnownPrototype<
        typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        {
          inherited: true
          nonEnumerables: true
          string: true
        }
      >
      expectType<TypeEqual<nonEnumerablesInherited, Tarray_prototype_stringNonEnumerablesInherited | Tarray_prototype_stringNonEnumerablesOwn>>(true)

      type nonEnumerablesInherited_defaultString = PropsOfKnownPrototype<
        typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        {
          inherited: true
          nonEnumerables: true
        }
      >
      expectType<TypeEqual<nonEnumerablesInherited_defaultString, Tarray_prototype_stringNonEnumerablesInherited | Tarray_prototype_stringNonEnumerablesOwn>>(true)

      type nonEnumerablesInherited_defaultStringNoOwn = PropsOfKnownPrototype<
        typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        {
          inherited: true
          nonEnumerables: true
          own: false
        }
      >
      expectType<TypeEqual<nonEnumerablesInherited_defaultStringNoOwn, Tarray_prototype_stringNonEnumerablesInherited>>(true)

      type nonEnumerables_defaultOwn = PropsOfKnownPrototype<
        typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        {
          nonEnumerables: true
        }
      >
      expectType<TypeEqual<nonEnumerables_defaultOwn, Tarray_prototype_stringNonEnumerablesOwn>>(true)
    })
    it(`TypedArray`, () => {
      type noOptions_onlyOwnEnumerable = PropsOfKnownPrototype<typeof a_TypedArray_Int32Array_withCommonAndArrayExtraProps>
      expectType<TypeEqual<noOptions_onlyOwnEnumerable, never>>(true)

      type emptyOptions_onlyOwnEnumerable = PropsOfKnownPrototype<typeof a_TypedArray_Int32Array_withCommonAndArrayExtraProps, {}>
      expectType<TypeEqual<emptyOptions_onlyOwnEnumerable, never>>(true)

      type onlyOwnEnumerable = PropsOfKnownPrototype<
        typeof a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        {
          own: true
        }
      >
      expectType<TypeEqual<onlyOwnEnumerable, never>>(true)

      type nonEnumerablesOwn = PropsOfKnownPrototype<
        typeof a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        {
          own: true
          nonEnumerables: true
        }
      >
      expectType<TypeEqual<nonEnumerablesOwn, TtypedArray_prototype_stringNonEnumerablesOwn>>(true) // Typed arrays don't have own properties (no length)

      type simplifyBREAKS_gets_the_props_of_String_prototype = Simplify<
        PropsOfKnownPrototype<
          typeof a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
          {
            own: true
            nonEnumerables: true
          }
        >
      >
      expectType<TypeEqual<simplifyBREAKS_gets_the_props_of_String_prototype, TtypedArray_prototype_stringNonEnumerablesOwn>>(true) // Typed arrays don't have own properties (no length)

      type nonEnumerablesInherited = PropsOfKnownPrototype<
        typeof a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        {
          inherited: true
          nonEnumerables: true
          string: true
        }
      >
      expectType<TypeEqual<nonEnumerablesInherited, TtypedArray_prototype_stringNonEnumerablesInherited | TtypedArray_prototype_stringNonEnumerablesOwn>>(true)

      type nonEnumerablesInherited_defaultString = PropsOfKnownPrototype<
        typeof a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        {
          inherited: true
          nonEnumerables: true
        }
      >
      expectType<TypeEqual<nonEnumerablesInherited_defaultString, TtypedArray_prototype_stringNonEnumerablesInherited | TtypedArray_prototype_stringNonEnumerablesOwn>>(true)

      type nonEnumerablesInherited_defaultStringNoOwn = PropsOfKnownPrototype<
        typeof a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        {
          inherited: true
          nonEnumerables: true
          own: false
        }
      >
      expectType<TypeEqual<nonEnumerablesInherited_defaultStringNoOwn, TtypedArray_prototype_stringNonEnumerablesInherited>>(true)

      type nonEnumerables_defaultOwn = PropsOfKnownPrototype<
        typeof a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        {
          nonEnumerables: true
        }
      >
      expectType<TypeEqual<nonEnumerables_defaultOwn, TtypedArray_prototype_stringNonEnumerablesOwn>>(true)
    })
    it(`Set`, () => {
      type noOptions_onlyOwnEnumerable = PropsOfKnownPrototype<typeof a_Set_of_Tvalues_withCommonProps>
      expectType<TypeEqual<noOptions_onlyOwnEnumerable, never>>(true)

      type emptyOptions_onlyOwnEnumerable = PropsOfKnownPrototype<typeof a_Set_of_Tvalues_withCommonProps, {}>
      expectType<TypeEqual<emptyOptions_onlyOwnEnumerable, never>>(true)

      type onlyOwnEnumerable = PropsOfKnownPrototype<
        typeof a_Set_of_Tvalues_withCommonProps,
        {
          own: true
        }
      >
      expectType<TypeEqual<onlyOwnEnumerable, never>>(true)

      type nonEnumerablesOwn = PropsOfKnownPrototype<
        typeof a_Set_of_Tvalues_withCommonProps,
        {
          own: true
          nonEnumerables: true
        }
      >
      expectType<TypeEqual<nonEnumerablesOwn, Tset_prototype_stringNonEnumerablesOwn>>(true)

      type simplifyBREAKS_gets_the_props_of_String_prototype = Simplify<
        PropsOfKnownPrototype<
          typeof a_Set_of_Tvalues_withCommonProps,
          {
            own: true
            nonEnumerables: true
          }
        >
      >
      expectType<TypeEqual<simplifyBREAKS_gets_the_props_of_String_prototype, Tset_prototype_stringNonEnumerablesOwn>>(true)

      type nonEnumerablesInherited = PropsOfKnownPrototype<
        typeof a_Set_of_Tvalues_withCommonProps,
        {
          inherited: true
          nonEnumerables: true
          string: true
        }
      >
      expectType<TypeEqual<nonEnumerablesInherited, Tset_prototype_stringNonEnumerablesInherited | Tset_prototype_stringNonEnumerablesOwn>>(true)

      type nonEnumerablesInherited_defaultString = PropsOfKnownPrototype<
        typeof a_Set_of_Tvalues_withCommonProps,
        {
          inherited: true
          nonEnumerables: true
        }
      >
      expectType<TypeEqual<nonEnumerablesInherited_defaultString, Tset_prototype_stringNonEnumerablesInherited | Tset_prototype_stringNonEnumerablesOwn>>(true)

      type nonEnumerablesInherited_defaultStringNoOwn = PropsOfKnownPrototype<
        typeof a_Set_of_Tvalues_withCommonProps,
        {
          inherited: true
          nonEnumerables: true
          own: false
        }
      >
      expectType<TypeEqual<nonEnumerablesInherited_defaultStringNoOwn, Tset_prototype_stringNonEnumerablesInherited>>(true)

      type nonEnumerables_defaultOwn = PropsOfKnownPrototype<
        typeof a_Set_of_Tvalues_withCommonProps,
        {
          nonEnumerables: true
        }
      >
      expectType<TypeEqual<nonEnumerables_defaultOwn, Tset_prototype_stringNonEnumerablesOwn>>(true)
    })
    it(`Map`, () => {
      type noOptions_onlyOwnEnumerable = PropsOfKnownPrototype<typeof a_Map_of_TMapKeys_Tvalues_WithCommonProps>
      expectType<TypeEqual<noOptions_onlyOwnEnumerable, never>>(true)

      type emptyOptions_onlyOwnEnumerable = PropsOfKnownPrototype<typeof a_Map_of_TMapKeys_Tvalues_WithCommonProps, {}>
      expectType<TypeEqual<emptyOptions_onlyOwnEnumerable, never>>(true)

      type onlyOwnEnumerable = PropsOfKnownPrototype<
        typeof a_Map_of_TMapKeys_Tvalues_WithCommonProps,
        {
          own: true
        }
      >
      expectType<TypeEqual<onlyOwnEnumerable, never>>(true)

      type nonEnumerablesOwn = PropsOfKnownPrototype<
        typeof a_Map_of_TMapKeys_Tvalues_WithCommonProps,
        {
          own: true
          nonEnumerables: true
        }
      >
      expectType<TypeEqual<nonEnumerablesOwn, Tmap_prototype_stringNonEnumerablesOwn>>(true)

      type simplifyBREAKS_gets_the_props_of_String_prototype = Simplify<
        PropsOfKnownPrototype<
          typeof a_Map_of_TMapKeys_Tvalues_WithCommonProps,
          {
            own: true
            nonEnumerables: true
          }
        >
      >
      expectType<TypeEqual<simplifyBREAKS_gets_the_props_of_String_prototype, Tmap_prototype_stringNonEnumerablesOwn>>(true)

      type nonEnumerablesInherited = PropsOfKnownPrototype<
        typeof a_Map_of_TMapKeys_Tvalues_WithCommonProps,
        {
          inherited: true
          nonEnumerables: true
          string: true
        }
      >
      expectType<TypeEqual<nonEnumerablesInherited, Tmap_prototype_stringNonEnumerablesInherited | Tmap_prototype_stringNonEnumerablesOwn>>(true)

      type nonEnumerablesInherited_defaultString = PropsOfKnownPrototype<
        typeof a_Map_of_TMapKeys_Tvalues_WithCommonProps,
        {
          inherited: true
          nonEnumerables: true
        }
      >
      expectType<TypeEqual<nonEnumerablesInherited_defaultString, Tmap_prototype_stringNonEnumerablesInherited | Tmap_prototype_stringNonEnumerablesOwn>>(true)

      type nonEnumerablesInherited_defaultStringNoOwn = PropsOfKnownPrototype<
        typeof a_Map_of_TMapKeys_Tvalues_WithCommonProps,
        {
          inherited: true
          nonEnumerables: true
          own: false
        }
      >
      expectType<TypeEqual<nonEnumerablesInherited_defaultStringNoOwn, Tmap_prototype_stringNonEnumerablesInherited>>(true)

      type nonEnumerables_defaultOwn = PropsOfKnownPrototype<
        typeof a_Map_of_TMapKeys_Tvalues_WithCommonProps,
        {
          nonEnumerables: true
        }
      >
      expectType<TypeEqual<nonEnumerables_defaultOwn, Tmap_prototype_stringNonEnumerablesOwn>>(true)
    })
    // @todo: add the rest of the types
  })
  describe(`# BaseType - distinguishes specific type & returns the same BaseType without extra props`, () => {
    describe(`BaseType basic, without TypeChange of Nested Values`, () => {
      describe(`# Set & Family`, () => {
        it(`# Set`, () => {
          type Tresult = BaseType<typeof a_Set_of_Tvalues_withCommonProps>
          expectType<TypeEqual<Tresult, Set<Tvalues>>>(true)
        })
        it(`# Set Entries`, () => {
          const input = a_Set_of_Tvalues.entries()
          type Tresult = BaseType<typeof input>

          // Tinput must be assignable to Tresult
          const result: Tresult = input
          expectType<Tresult>(input)

          expectType<TypeEqual<Tresult, IterableIterator<[Tvalues, Tvalues]>>>(true)

          // variation, not working
          // expectType<TypeEqual<Tresult, SetEntries<Set<Tvalues>>>>(true)
          // @-ts-expect-error: OK SetEntries is not assignable to MapEntries
          // expectType<TypeEqual<Tresult, MapEntries<Set<Tvalues>>>>(true)
          // @-ts-expect-error: OK SetEntries is not assignable to MapEntries
          // expectType<TypeEqual<Tresult, MapEntries<Map<Tvalues>>>>(true)
        })
        it(`# Set Values`, () => {
          const input = a_Set_of_Tvalues.values()
          type Tresult = BaseType<typeof input>

          // Tinput must be assignable to Tresult
          const result: Tresult = input
          expectType<Tresult>(input)

          expectType<TypeEqual<Tresult, IterableIterator<Tvalues>>>(true)
          expectType<TypeEqual<Tresult, SetIteratorValues<Tvalues>>>(true)
          // @todo(000) COULD FAIL BUT DOESNT: SetIteratorValues should not be assignable to MapIteratorValues
          expectType<TypeEqual<Tresult, MapIteratorValues<Tvalues>>>(true)
        })
      })
      describe(`# Map & Family`, () => {
        it(`# Map`, () => {
          type Tresult = BaseType<typeof aMap_of_Tvalues_Tvalues>
          expectType<TypeEqual<Tresult, Map<Tvalues, Tvalues>>>(true)
        })
        it(`# Map Entries`, () => {
          const input = aMap_of_Tvalues_Tvalues.entries()
          type Tresult = BaseType<typeof input>

          // Tinput must be assignable to Tresult
          const result: Tresult = input
          expectType<Tresult>(input)

          expectType<TypeEqual<Tresult, IterableIterator<[Tvalues, Tvalues]>>>(true)
          // expectType<TypeEqual<Tresult, MapEntries<Map<Tvalues,Tvalues>>>>(true) // variation not working
        })
        it(`# Map Keys`, () => {
          const input = aMap_of_Tvalues_Tvalues.keys()
          type Tresult = BaseType<typeof input>

          // Tinput must be assignable to Tresult
          const result: Tresult = input
          expectType<Tresult>(input)

          expectType<TypeEqual<Tresult, IterableIterator<Tvalues>>>(true)
        })
        it(`# Map Values`, () => {
          const input = aMap_of_Tvalues_Tvalues.values()
          type Tresult = BaseType<typeof input>

          // Tinput must be assignable to Tresult
          const result: Tresult = input
          expectType<Tresult>(input)

          expectType<TypeEqual<Tresult, IterableIterator<Tvalues>>>(true)
          expectType<TypeEqual<Tresult, MapIteratorValues<Tvalues>>>(true)

          // @todo(000) COULD FAIL BUT DOESNT: SetIteratorValues should not be assignable to MapIteratorValues
          expectType<TypeEqual<Tresult, SetIteratorValues<Tvalues>>>(true)
        })
      })
      it(`# WeakSet`, () => {
        type Tresult = BaseType<typeof a_WeakSet_of_Person>
        expectType<TypeEqual<Tresult, WeakSet<Person>>>(true)
      })
      it(`# WeakMap`, () => {
        type Tresult = BaseType<typeof a_WeakMap_of_Person_Employees>
        expectType<TypeEqual<Tresult, WeakMap<Person, Employee>>>(true)
      })
      it(`# Array`, () => {
        type Tresult = BaseType<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
        expectType<TypeEqual<Tresult, Array<Tvalues>>>(true)
      })

      it(`# Promise`, () => {
        type Tresult = BaseType<typeof a_Promise>
        expectType<TypeEqual<Tresult, Promise<T_PROMISE_RESOLVED_VALUE>>>(true)
      })

      describe(`# TypedArray`, () => {
        it(`# Int32Array`, () => {
          type Tresult = BaseType<typeof a_TypedArray_Int32Array_withCommonAndArrayExtraProps>
          expectType<TypeEqual<Tresult, Int32Array>>(true)
        })
        it(`# BigInt64Array`, () => {
          type Tresult = BaseType<typeof a_TypedArray_BigInt64Array>
          expectType<TypeEqual<Tresult, BigInt64Array>>(true)
        })
        it(`# Int8Array`, () => {
          type Tresult = BaseType<typeof a_TypedArray_BigInt64Array>
          expectType<TypeEqual<Tresult, BigInt64Array>>(true)
        })
      })

      describe(`# Generator / AsyncGenerator`, () => {
        it(`# Generator`, () => {
          const input = get_Generator_of_Tvalues()
          type Tresult = BaseType<typeof input>

          // Tinput must be assignable to Tresult
          const result: Tresult = input
          expectType<Tresult>(input)
          expectType<TypeEqual<Tresult, Generator<Tvalues>>>(true)
        })
        it(`# AsyncGenerator`, () => {
          const input = get_AsyncGenerator_of_Tvalues()
          type Tresult = BaseType<typeof input>

          // Tinput must be assignable to Tresult
          const result: Tresult = input
          expectType<Tresult>(input)
          expectType<TypeEqual<Tresult, AsyncGenerator<Tvalues>>>(true)
        })
      })

      describe(`# Iterator /AsyncIterator`, () => {
        it(`# Iterator`, () => {
          const input = a_Array_of_Tvalues[Symbol.iterator]()
          type Tresult = BaseType<typeof input>

          // Tinput must be assignable to Tresult
          const result: Tresult = input
          expectType<Tresult>(input)
          expectType<TypeEqual<Tresult, IterableIterator<Tvalues>>>(true)
        })
        it(`# AsyncIterator`, () => {
          const input = a_AsyncGenerator_of_Tvalues_withCommonProps[Symbol.asyncIterator]()
          type Tresult = BaseType<typeof input>

          // Tinput must be assignable to Tresult
          const result: Tresult = input
          expectType<Tresult>(input)

          // @ts-expect-error: OK AsyncIterableIterator is a special case, it returns AsyncGenerator - still assignable ;-)
          expectType<TypeEqual<Tresult, AsyncIterableIterator<Tvalues>>>(true)
        })
      })

      it(`# Arguments`, () => {
        type Tresult = BaseType<typeof a_Arguments>
        expectType<TypeEqual<Tresult, IArguments>>(true)
      })

      it(`# Instance`, () => {
        type Tresult = BaseType<typeof a_instance_withCommonProps>
        // @ts-expect-error OK-ish - this should not even be allowed, maybe we should ban some types, like instances/classes!
        expectType<TypeEqual<Tresult, InstanceType<typeof ClassWithCommonProps>>>(true)
        // @ts-expect-error OK-ish - look above
        expectType<TypeEqual<Tresult, InstanceType<ClassWithCommonProps>>>(true)
        // @ts-expect-error OK-ish - look above
        expectType<TypeEqual<Tresult, ClassWithCommonProps>>(true)
        // @ts-expect-error OK-ish - look above
        expectType<TypeEqual<Tresult, typeof ClassWithCommonProps>>(true)
        
        expectType<TypeEqual<Tresult, {
          // [symbolProp]: ValueOf<ClassWithCommonProps>;
          // [tooBadSymbolProp]: ValueOf<ClassWithCommonProps>;
          // [symbolProp2]: ValueOf<ClassWithCommonProps>;
          // [tooBadSymbolProp2]: ValueOf<ClassWithCommonProps>;
          // stringProp: ValueOf<ClassWithCommonProps>;
          // tooBadProp: ValueOf<ClassWithCommonProps>;
          // stringProp2: ValueOf<ClassWithCommonProps>;
          // tooBadProp2: ValueOf<ClassWithCommonProps>;
          // stringProp3: ValueOf<ClassWithCommonProps>;
          // tooBadProp3: ValueOf<ClassWithCommonProps>;
        }>>(true)
      })

      it(`# Class - returns class it self!`, () => {
        type Tresult = BaseType<typeof ClassWithStaticCommonProps>
        expectType<TypeEqual<Tresult, typeof ClassWithStaticCommonProps>>(true)
      })

      describe(`# Primitives`, () => {
        it(`# Symbol`, () => {
          type Tresult = BaseType<typeof symbolPersonKey>
          expectType<TypeEqual<Tresult, typeof symbolPersonKey>>(true)
        })
        it(`# String`, () => {
          type Tresult = BaseType<'a string'>
          expectType<TypeEqual<Tresult, 'a string'>>(true)
        })
        it(`# Number`, () => {
          type Tresult = BaseType<123>
          expectType<TypeEqual<Tresult, 123>>(true)
        })
      })
    })
    describe(`BaseType with TypeChange of Item(s)/Value(S)`, () => {
      describe(`# Set & Family`, () => {
        it(`# Set`, () => {
          type Tresult = BaseType<typeof a_Set_of_Tvalues_withCommonProps, T_NEW_TYPE>
          expectType<TypeEqual<Tresult, Set<T_NEW_TYPE>>>(true)
        })
        it(`# Set Entries`, () => {
          const input = a_Set_of_Tvalues.entries()
          type Tresult = BaseType<typeof input, T_NEW_TYPE>

          // Tinput must NOT be assignable to Tresult
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          const result: Tresult = input
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          expectType<Tresult>(input)

          //  @todo|(222): should/could we change both sides to NEW_TYPE?
          expectType<TypeEqual<Tresult, IterableIterator<[Tvalues, T_NEW_TYPE]>>>(true)

          // variation, not working
          // expectType<TypeEqual<Tresult, SetEntries<Set<Tvalues>>>>(true)
          // @-ts-expect-error: OK SetEntries is not assignable to MapEntries
          // expectType<TypeEqual<Tresult, MapEntries<Set<Tvalues>>>>(true)
          // @-ts-expect-error: OK SetEntries is not assignable to MapEntries
          // expectType<TypeEqual<Tresult, MapEntries<Map<Tvalues>>>>(true)
        })
        it(`# Set Values`, () => {
          const input = a_Set_of_Tvalues.values()
          type Tresult = BaseType<typeof input, T_NEW_TYPE>

          // Tinput must NOT be assignable to Tresult
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          const result: Tresult = input
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          expectType<Tresult>(input)

          expectType<TypeEqual<Tresult, IterableIterator<T_NEW_TYPE>>>(true)
          expectType<TypeEqual<Tresult, SetIteratorValues<T_NEW_TYPE>>>(true)
          // @todo(000) COULD FAIL BUT DOESNT: SetIteratorValues should not be assignable to MapIteratorValues
          expectType<TypeEqual<Tresult, MapIteratorValues<T_NEW_TYPE>>>(true)
        })
      })

      describe(`# Map & Family`, () => {
        it(`# Map`, () => {
          type Tresult = BaseType<typeof aMap_of_Tvalues_Tvalues, T_NEW_TYPE>
          expectType<TypeEqual<Tresult, Map<Tvalues, T_NEW_TYPE>>>(true)
        })
        it(`# Map Entries`, () => {
          const input = aMap_of_Tvalues_Tvalues.entries()
          type Tresult = BaseType<typeof input, T_NEW_TYPE>

          // Tinput must be assignable to Tresult
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          const result: Tresult = input
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          expectType<Tresult>(input)

          expectType<TypeEqual<Tresult, IterableIterator<[Tvalues, T_NEW_TYPE]>>>(true)
          // expectType<TypeEqual<Tresult, MapEntries<Map<Tvalues,Tvalues>>>>(true) // variation not working
        })
        it(`# Map Keys - NOTE: Chang Type as part of Iterator<T>`, () => {
          const input = aMap_of_Tvalues_Tvalues.keys()
          type Tresult = BaseType<typeof input, T_NEW_TYPE>

          // Tinput must be assignable to Tresult
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          const result: Tresult = input
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          expectType<Tresult>(input)

          expectType<TypeEqual<Tresult, IterableIterator<T_NEW_TYPE>>>(true)
        })
        it(`# Map Values`, () => {
          const input = aMap_of_Tvalues_Tvalues.values()
          type Tresult = BaseType<typeof input>

          // Tinput must be assignable to Tresult
          const result: Tresult = input
          expectType<Tresult>(input)

          expectType<TypeEqual<Tresult, IterableIterator<Tvalues>>>(true)
          expectType<TypeEqual<Tresult, MapIteratorValues<Tvalues>>>(true)

          // @todo(000) COULD FAIL BUT DOESNT: SetIteratorValues should not be assignable to MapIteratorValues
          expectType<TypeEqual<Tresult, SetIteratorValues<Tvalues>>>(true)
        })
      })
      // @todo: NO type change for WeakSet
      // it(`# WeakSet`, () => {
      //   type Tresult = BaseType<typeof a_WeakSet_of_Person>
      //   expectType<TypeEqual<Tresult, WeakSet<Person>>>(true)
      // })
      it(`# WeakMap`, () => {
        type Tresult = BaseType<typeof a_WeakMap_of_Person_Employees, T_NEW_TYPE>
        expectType<TypeEqual<Tresult, WeakMap<Person, T_NEW_TYPE>>>(true)
      })
      it(`# Array`, () => {
        type Tresult = BaseType<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, T_NEW_TYPE>
        expectType<TypeEqual<Tresult, Array<T_NEW_TYPE>>>(true)
      })

      it(`# Promise`, () => {
        type Tresult = BaseType<typeof a_Promise, T_NEW_TYPE>
        expectType<TypeEqual<Tresult, Promise<T_NEW_TYPE>>>(true)

        type Tresult2 = BaseType<typeof a_Promise, NO_TYPE_CHANGE>
        expectType<TypeEqual<Tresult2, Promise<T_PROMISE_RESOLVED_VALUE>>>(true)

        // Lets also change Keys Type @todo: do for all types
        type Tresult3 = BaseType<typeof a_Promise, NO_TYPE_CHANGE, 'KEYS CHANGE IS IRRELEVANT'>
        expectType<TypeEqual<Tresult3, Promise<T_PROMISE_RESOLVED_VALUE>>>(true)

        type Tresult4 = BaseType<typeof a_Promise, NO_TYPE_CHANGE, never>
        expectType<TypeEqual<Tresult4, Promise<T_PROMISE_RESOLVED_VALUE>>>(true)

        // type Tresult5 = BaseType<typeof a_Promise, never>
        // expectType<TypeEqual<Tresult5, Promise<T_PROMISE_RESOLVED_VALUE>>>(true)
      })

      // @todo: No change type for TypedArray?
      // describe(`# TypedArray`, () => {
      //   it(`# Int32Array`, () => {
      //     type Tresult = BaseType<typeof a_TypedArray_Int32Array_withCommonAndArrayExtraProps>
      //     expectType<TypeEqual<Tresult, Int32Array>>(true)
      //   })
      //   it(`# BigInt64Array`, () => {
      //     type Tresult = BaseType<typeof a_TypedArray_BigInt64Array>
      //     expectType<TypeEqual<Tresult, BigInt64Array>>(true)
      //   })
      //   it(`# Int8Array`, () => {
      //     type Tresult = BaseType<typeof a_TypedArray_BigInt64Array>
      //     expectType<TypeEqual<Tresult, BigInt64Array>>(true)
      //   })
      // })

      describe(`# Generator / AsyncGenerator`, () => {
        it(`# Generator`, () => {
          const input = get_Generator_of_Tvalues()
          type Tresult = BaseType<typeof input, T_NEW_TYPE>

          // Tinput must NOT be assignable to Tresult, due to NEW_TYPE
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          const result: Tresult = input
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          expectType<Tresult>(input)

          expectType<TypeEqual<Tresult, Generator<T_NEW_TYPE>>>(true)
        })
        it(`# AsyncGenerator`, () => {
          const input = get_AsyncGenerator_of_Tvalues()
          type Tresult = BaseType<typeof input, T_NEW_TYPE>

          // Tinput must be assignable to Tresult
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          const result: Tresult = input
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          expectType<Tresult>(input)

          expectType<TypeEqual<Tresult, AsyncGenerator<T_NEW_TYPE>>>(true)
        })
      })

      describe(`# Iterator /AsyncIterator`, () => {
        it(`# Iterator`, () => {
          const input = a_Array_of_Tvalues[Symbol.iterator]()
          type Tresult = BaseType<typeof input, T_NEW_TYPE>

          // Tinput must be assignable to Tresult
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          const result: Tresult = input
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          expectType<Tresult>(input)
          expectType<TypeEqual<Tresult, IterableIterator<T_NEW_TYPE>>>(true)
        })
        it(`# AsyncIterator`, () => {
          const input = a_AsyncGenerator_of_Tvalues_withCommonProps[Symbol.asyncIterator]()
          type Tresult = BaseType<typeof input, T_NEW_TYPE>

          // Tinput must be assignable to Tresult
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          const result: Tresult = input
          // @ts-expect-error: OK Type Tvalues is not assignable to type 'NEW_TYPE'
          expectType<Tresult>(input)

          // @ts-expect-error: OK AsyncIterableIterator is a special case, it returns AsyncGenerator - still assignable ;-)
          expectType<TypeEqual<Tresult, AsyncIterableIterator<T_NEW_TYPE>>>(true)
        })
      })

      // @todo(222): how to treat IArguments type  change?
      // it(`# Arguments`, () => {
      //   type Tresult = BaseType<typeof a_Arguments>
      //   expectType<TypeEqual<Tresult, IArguments>>(true)
      // })

      // @todo(222): how to treat instance type  change?
      // it(`# Instance`, () => {
      //   type Tresult = BaseType<typeof a_instance_withCommonProps>
      //   expectType<TypeEqual<Tresult, InstanceType<typeof ClassWithStaticCommonProps>>>(true)
      // })

      // @todo(222): how to treat class type  change?
      // it(`# Class - returns class it self!`, () => {
      //   type Tresult = BaseType<typeof ClassWithStaticCommonProps>
      //   expectType<TypeEqual<Tresult, typeof ClassWithStaticCommonProps>>(true)
      // })

      describe(`# Primitives stay the same`, () => {
        it(`# Symbol`, () => {
          type Tresult = BaseType<typeof symbolPersonKey, T_NEW_TYPE>
          expectType<TypeEqual<Tresult, typeof symbolPersonKey>>(true)
        })
        it(`# String`, () => {
          type Tresult = BaseType<'a string', T_NEW_TYPE>
          expectType<TypeEqual<Tresult, 'a string'>>(true)
        })
        it(`# Number`, () => {
          type Tresult = BaseType<123, T_NEW_TYPE>
          expectType<TypeEqual<Tresult, 123>>(true)
        })
      })
    })
  })

  describe(`# PropsOfBaseType`, () => {
    it(`# Returns all keyof Tbase props for known system classes`, () => {
      type TkeysOfBaseSet = PropsOfBaseType<typeof a_Set_of_Tvalues_withCommonProps>
      expectType<TypeEqual<TkeysOfBaseSet, keyof Set<any>>>(true)

      type TkeysOfBaseMap = PropsOfBaseType<typeof a_Map_of_TMapKeys_Tvalues_WithCommonProps>
      expectType<TypeEqual<TkeysOfBaseMap, keyof Map<any, any>>>(true)
      // and so on
    })
    it(`# Returns never (due to lack of ownKeyof in TS) for unknown user classes`, () => {
      type TkeysOfParentNever = PropsOfBaseType<typeof a_Person>
      expectType<TypeEqual<TkeysOfParentNever, never>>(true)

      type TkeysOfSubclassNever = PropsOfBaseType<typeof a_Employee>
      expectType<TypeEqual<TkeysOfSubclassNever, never>>(true)
    })
  })
  describe(`# PropsString & # PropsSymbol: Get Props Filtered By PropType`, () => {
    it(`# PropsString`, () => {
      type TestPojsoStringProps = PropsString<typeof pojsoCommonProps>
      expectType<TypeEqual<TestPojsoStringProps, TcommonStringProps>>(true)

      type TestArrayStringProps = PropsString<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
      // @todo: ExcludePrototypeKeys not working, these dont get excluded, but they should!
      type TestArrayStringPropsExtraOnly = Exclude<TestArrayStringProps, keyof []>
      expectType<TypeEqual<TestArrayStringPropsExtraOnly, TarrayAndCommonStringProps>>(true)

      type TestGeneratorStringProps = PropsString<typeof a_Generator_of_Tvalues_withCommonProps>
      // @todo: ExcludePrototypeKeys not working, these dont get excluded, but they should!
      type TestGeneratorStringPropsExtraOnly = Exclude<TestGeneratorStringProps, keyof Generator>
      expectType<TypeEqual<TestGeneratorStringPropsExtraOnly, TcommonStringProps>>(true)

      expectType<TypeEqual<PropsString<123>, never>>(true)
      expectType<TypeEqual<PropsString<'foobar'>, never>>(true)
      expectType<TypeEqual<PropsString<123n>, never>>(true)
      expectType<TypeEqual<PropsString<true>, never>>(true)
      expectType<TypeEqual<PropsString<false>, never>>(true)

      type TBoxedNumberStringProps = PropsString<Number>
      expectType<
        TypeEqual<
          TBoxedNumberStringProps,
          // @todo: ExcludePrototypeKeys not working, these dont get excluded, but they should!
          'toExponential' | 'toFixed' | 'toPrecision' | 'toString' | 'valueOf' | 'toLocaleString'
        >
      >(true)
      // @todo: add Boolean & String etc
    })
    it(`# PropsSymbol`, () => {
      type TestObjSymbolProps = PropsSymbol<typeof pojsoCommonProps>
      expectType<TypeEqual<TestObjSymbolProps, TcommonSymbolProps>>(true)

      type TestArraySymbolProps = PropsSymbol<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
      type TestArraySymbolPropsExtraOnly = Exclude<TestArraySymbolProps, keyof []>
      expectType<TypeEqual<TestArraySymbolPropsExtraOnly, TcommonSymbolProps>>(true)

      type TestGeneratorSymbolProps = PropsSymbol<typeof a_Generator_of_Tvalues_withCommonProps>
      type TestGeneratorSymbolPropsExtraOnly = Exclude<TestGeneratorSymbolProps, keyof Generator>
      expectType<TypeEqual<TestGeneratorSymbolPropsExtraOnly, TcommonSymbolProps>>(true)

      expectType<TypeEqual<PropsSymbol<123>, never>>(true)
      expectType<TypeEqual<PropsSymbol<'foobar'>, never>>(true)
      expectType<TypeEqual<PropsSymbol<123n>, never>>(true)
      expectType<TypeEqual<PropsSymbol<true>, never>>(true)
      expectType<TypeEqual<PropsSymbol<false>, never>>(true)
      expectType<TypeEqual<PropsSymbol<Number>, never>>(true)
      type TPropsSymbolString = PropsSymbol<String>
      // @ts-expect-error @todo: fix this - miss-reported in WebStorm 2024.1 / ES2023 /TS5.4.2
      expectType<TypeEqual<TPropsSymbolString, never>>(true)
      expectType<TypeEqual<PropsSymbol<Boolean>, never>>(true)
    })
  })
  describe(`# Props - gets ONLY the Props of an object, based on KeyOptions`, () => {
    describe('# Array', () => {
      describe('# Array - own: true (default)', () => {
        it(`# Array - default - string only`, () => {
          type TpropsNoOptionsStringOnly = Props<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>
          expectType<TypeEqual<TpropsNoOptionsStringOnly, TarrayAndCommonStringProps>>(true)

          type TpropsEmptyOptionsStringOnly = Props<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, {}>
          expectType<TypeEqual<TpropsEmptyOptionsStringOnly, TarrayAndCommonStringProps>>(true)

          type TpropsEmptyOptionsStringOnly2 = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              own: true
            }
          >
          expectType<TypeEqual<TpropsEmptyOptionsStringOnly2, TarrayAndCommonStringProps>>(true)

          type TpropsStringOnly = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              string: true
            }
          >
          expectType<TypeEqual<TpropsStringOnly, TarrayAndCommonStringProps>>(true)

          type TpropsStringOnly2 = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              string: true
              own: true
            }
          >
          expectType<TypeEqual<TpropsStringOnly2, TarrayAndCommonStringProps>>(true)

          type TpropsStringOnlySymbolFalse = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              symbol: false
            }
          >
          expectType<TypeEqual<TpropsStringOnlySymbolFalse, TarrayAndCommonStringProps>>(true)

          type TpropsStringOnlySymbolFalseOwn = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              symbol: false
              own: true
            }
          >
          expectType<TypeEqual<TpropsStringOnlySymbolFalseOwn, TarrayAndCommonStringProps>>(true)

          type TpropsStringOnlySymbolFalseStringTrue = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              string: true
              symbol: false
            }
          >
          expectType<TypeEqual<TpropsStringOnlySymbolFalseStringTrue, TarrayAndCommonStringProps>>(true)

          type TpropsStringOnlySymbolFalseStringTrueOwn = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              string: true
              symbol: false
              own: true
            }
          >
          expectType<TypeEqual<TpropsStringOnlySymbolFalseStringTrueOwn, TarrayAndCommonStringProps>>(true)
        })
        it(`# Array - symbol only`, () => {
          type TpropsSymbolOnly = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              string: false
              symbol: true
            }
          >
          expectType<TypeEqual<TpropsSymbolOnly, TcommonSymbolProps>>(true)

          type TpropsSymbolOnlyOwn = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              string: false
              symbol: true
              own: true
            }
          >
          expectType<TypeEqual<TpropsSymbolOnlyOwn, TcommonSymbolProps>>(true)
        })
        it(`# Array - own & nonEnumerables: true`, () => {
          type TpropsEnumerableTrue = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              nonEnumerables: true
            }
          >
          expectType<TypeEqual<TpropsEnumerableTrue, TarrayAndCommonStringProps | Tarray_prototype_stringNonEnumerablesOwn>>(true)

          type TpropsEnumerableTrue2 = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              nonEnumerables: true
              own: true
              string: true
            }
          >
          expectType<TypeEqual<TpropsEnumerableTrue, TarrayAndCommonStringProps | Tarray_prototype_stringNonEnumerablesOwn>>(true)
        })
        it(`# Array - own & nonEnumerables & inherited: true`, () => {
          type TpropsEnumerableInherited = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              nonEnumerables: true
              inherited: true
            }
          >
          expectType<TypeEqual<TpropsEnumerableInherited, Tarray_prototype_stringNonEnumerablesInherited | Tarray_prototype_stringNonEnumerablesOwn | TarrayAndCommonStringProps>>(true)

          type TpropsEnumerableInherited2 = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              nonEnumerables: true
              inherited: true
              own: true
              string: true
              symbol: false
            }
          >
          expectType<TypeEqual<TpropsEnumerableInherited2, Tarray_prototype_stringNonEnumerablesInherited | Tarray_prototype_stringNonEnumerablesOwn | TarrayAndCommonStringProps>>(true)
        })
      })
      describe('# Array - own: false', () => {
        it(`# Array - own: false = always never`, () => {
          type TpropsOwnFalseStringOnly = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              own: false
            }
          >
          expectType<TypeEqual<TpropsOwnFalseStringOnly, never>>(true)

          type TpropsOwnFalseStringOnly2 = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              own: false
              string: true
            }
          >
          expectType<TypeEqual<TpropsOwnFalseStringOnly2, never>>(true)

          type TpropsOwnFalseStringOnly3 = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              own: false
              string: true
              symbol: false
            }
          >
          expectType<TypeEqual<TpropsOwnFalseStringOnly3, never>>(true)
        })
        it(`# Array - own: false & nonEnumerables/inherited: true`, () => {
          type TpropsOwnFalseStringOnly = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            { own: false; nonEnumerables: true } //  string: true;
          >
          expectType<TypeEqual<TpropsOwnFalseStringOnly, never>>(true)

          type TpropsOwnFalseNonEnumerablesInherited = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              own: false
              nonEnumerables: true
              inherited: true
            }
          >
          expectType<TypeEqual<TpropsOwnFalseNonEnumerablesInherited, Tarray_prototype_stringNonEnumerablesInherited>>(true)

          type TpropsOwnFalseNonEnumerablesInherited2 = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              own: false
              nonEnumerables: true
              inherited: true
              string: true
              symbol: false
            }
          >
          expectType<TypeEqual<TpropsOwnFalseNonEnumerablesInherited2, Tarray_prototype_stringNonEnumerablesInherited>>(true)

          type TpropsOwnFalseNonEnumerablesInheritedSymbols = Props<
            typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps,
            {
              own: false
              nonEnumerables: true
              inherited: true
              string: true
              symbol: true
            }
          >
          expectType<TypeEqual<TpropsOwnFalseNonEnumerablesInheritedSymbols, Tarray_prototype_stringNonEnumerablesInherited | Tarray_prototype_symbolNonEnumerablesInherited>>(true)
        })
      })
    })
    // @todo: add the rest!
  })

  describe(`# JustMethods & MethodNames`, () => {
    it(`# JustMethods`, () => {
      type TmethodsOfPerson = JustMethods<typeof a_Person>
      expectType<TypeEqual<TmethodsOfPerson, { toString(): string; parentClassMethod(classMethodArg: any): void; parentInstanceMethod: (instanceMethodArg: any) => void }>>(true)
    })
    it(`# MethodNames`, () => {
      type TmethodsOfPerson = MethodNames<typeof a_Person>
      expectType<TypeEqual<TmethodsOfPerson, 'toString' | 'parentClassMethod' | 'parentInstanceMethod'>>(true)
    })
  })

  describe(`# JustProps & PropNames`, () => {
    it(`# JustProps`, () => {
      type TpropsOfPerson = JustProps<typeof a_Person>
      expectType<TypeEqual<TpropsOfPerson, { name: string; [symbolProp]: string; [symbolPersonKey]: string; tooBadParentInstanceProp: string; circularPerson: Person }>>(true)
    })
    it(`# PropNames`, () => {
      type TpropsOfPerson = PropNames<typeof a_Person>
      expectType<TypeEqual<TpropsOfPerson, 'name' | typeof symbolProp | typeof symbolPersonKey | 'tooBadParentInstanceProp' | 'circularPerson'>>(true)
    })
  })

  describe(`# BasicProps`, () => {
    it(`# BasicProps`, () => {
      expectType<TypeEqual<BasicProps<{}>, string>>(true)
      expectType<TypeEqual<BasicProps<{ symbol: false }>, string>>(true)
      expectType<TypeEqual<BasicProps<{ string: true; symbol: false }>, string>>(true)
      expectType<TypeEqual<BasicProps<{ string: true }>, string>>(true)
      expectType<TypeEqual<BasicProps<{ string: false }>, never>>(true)
      expectType<TypeEqual<BasicProps<{ string: false; symbol: true }>, symbol>>(true)
      expectType<TypeEqual<BasicProps<{ symbol: true }>, symbol | string>>(true)
      expectType<TypeEqual<BasicProps<{ symbol: true; string: true }>, symbol | string>>(true)
    })
  })

  describe(`# IsAnyOrUnknown / IsAbsent`, () => {
    it(`# IsAnyOrUnknown matches both & only any & unknown`, () => {
      expectType<TypeEqual<IsAnyOrUnknown<unknown>, true>>(true)
      expectType<TypeEqual<IsAnyOrUnknown<any>, true>>(true)

      // false
      expectType<TypeEqual<IsAnyOrUnknown<''>, false>>(true)
      expectType<TypeEqual<IsAnyOrUnknown<void>, false>>(true)
      expectType<TypeEqual<IsAnyOrUnknown<undefined>, false>>(true)
      expectType<TypeEqual<IsAnyOrUnknown<null>, false>>(true)
      expectType<TypeEqual<IsAnyOrUnknown<0>, false>>(true)
      expectType<TypeEqual<IsAnyOrUnknown<{}>, false>>(true)
      expectType<TypeEqual<IsAnyOrUnknown<never>, false>>(true)
      expectType<TypeEqual<IsAnyOrUnknown<EmptyObject>, false>>(true)
      expectType<TypeEqual<IsAnyOrUnknown<Object>, false>>(true)
      expectType<TypeEqual<IsAnyOrUnknown<object>, false>>(true)
    })
    it(`# IsAbsent matches all "missing types", making type it useful to skip inference in options-like situations (& use defaults instead)`, () => {
      expectType<TypeEqual<IsAbsent<unknown>, true>>(true)
      expectType<TypeEqual<IsAbsent<any>, true>>(true)
      expectType<TypeEqual<IsAbsent<void>, true>>(true)
      expectType<TypeEqual<IsAbsent<undefined>, true>>(true)
      expectType<TypeEqual<IsAbsent<null>, true>>(true)
      expectType<TypeEqual<IsAbsent<never>, true>>(true)

      // false
      expectType<TypeEqual<IsAbsent<''>, false>>(true)
      expectType<TypeEqual<IsAbsent<0>, false>>(true)
      expectType<TypeEqual<IsAbsent<{}>, false>>(true)
      expectType<TypeEqual<IsAbsent<EmptyObject>, false>>(true)
      expectType<TypeEqual<IsAbsent<Object>, false>>(true)
      expectType<TypeEqual<IsAbsent<object>, false>>(true)
    })

    it(`# IsAbsent is useful to skip inference in options-like situations (& use defaults instead)`, () => {
      // Mimicking the structure of loop()
      type FakeLoop<Tinput, Toptions> =
        // prettier stay here!
        IsAbsent<Toptions> extends true
          ? 'IsAbsent Toptions' | FakeLoop<Tinput, ILoop_DefaultOptions>
          : // prettier-ignore
            | (IsAnyOrUnknown<Tinput> extends true ? 'IsAnyOrUnknown Tinput' : 'Normal Tinput')
          | (Toptions extends ILoop_DefaultOptions ? 'ILoop_DefaultOptions Toptions' : 'Custom Toptions')

      function fakeLoop<Tinput, Toptions>(input: Tinput, options?: Toptions): FakeLoop<Tinput, Toptions> {
        return undefined as any
      }

      const unknownOptions: unknown = { foo: 'bar' } as unknown
      const anyOptions: any = { foo: 'bar' } as any

      const resNormalInputDefaultAsCustomOptions = fakeLoop(123, loop_DefaultOptions)
      expectType<TypeEqual<typeof resNormalInputDefaultAsCustomOptions, 'Normal Tinput' | 'ILoop_DefaultOptions Toptions'>>(true)

      const resCustomOptionsNormalInput = fakeLoop(123, { strict: true })
      expectType<TypeEqual<typeof resCustomOptionsNormalInput, 'Normal Tinput' | 'Custom Toptions'>>(true)

      const resAbsentOptionsMissingNormalInput = fakeLoop(123)
      expectType<TypeEqual<typeof resAbsentOptionsMissingNormalInput, 'IsAbsent Toptions' | 'Normal Tinput' | 'ILoop_DefaultOptions Toptions'>>(true)

      const resAbsentOptionsNullNormalInput = fakeLoop(123, null)
      expectType<TypeEqual<typeof resAbsentOptionsNullNormalInput, 'IsAbsent Toptions' | 'Normal Tinput' | 'ILoop_DefaultOptions Toptions'>>(true)

      const resAbsentOptionsUndefinedNormalInput = fakeLoop(123, undefined)
      expectType<TypeEqual<typeof resAbsentOptionsUndefinedNormalInput, 'IsAbsent Toptions' | 'Normal Tinput' | 'ILoop_DefaultOptions Toptions'>>(true)

      const resAbsentOptionsWrongUnknownNormalInput = fakeLoop(123, unknownOptions)
      expectType<TypeEqual<typeof resAbsentOptionsWrongUnknownNormalInput, 'IsAbsent Toptions' | 'Normal Tinput' | 'ILoop_DefaultOptions Toptions'>>(true)

      const resAbsentOptionsWrongAnyNormalInput = fakeLoop(123, anyOptions)
      expectType<TypeEqual<typeof resAbsentOptionsWrongAnyNormalInput, 'IsAbsent Toptions' | 'Normal Tinput' | 'ILoop_DefaultOptions Toptions'>>(true)

      // any/unknown input
      const anyInput = 'foobar' as any
      const resAnyInputDefaultAsCustomOptions = fakeLoop(anyInput, loop_DefaultOptions)
      expectType<TypeEqual<typeof resAnyInputDefaultAsCustomOptions, 'IsAnyOrUnknown Tinput' | 'ILoop_DefaultOptions Toptions'>>(true)

      const resAnyInputCustomOptions = fakeLoop(anyInput, { strict: true })
      expectType<TypeEqual<typeof resAnyInputCustomOptions, 'IsAnyOrUnknown Tinput' | 'Custom Toptions'>>(true)

      const resAnyInputAbsentOptionsMissing = fakeLoop(anyInput)
      expectType<TypeEqual<typeof resAnyInputAbsentOptionsMissing, 'IsAbsent Toptions' | 'IsAnyOrUnknown Tinput' | 'ILoop_DefaultOptions Toptions'>>(true)

      const resAnyInputAbsentOptionsNull = fakeLoop(anyInput, null)
      expectType<TypeEqual<typeof resAnyInputAbsentOptionsNull, 'IsAbsent Toptions' | 'IsAnyOrUnknown Tinput' | 'ILoop_DefaultOptions Toptions'>>(true)

      const resAnyInputAbsentOptionsUndefined = fakeLoop(anyInput, undefined)
      expectType<TypeEqual<typeof resAnyInputAbsentOptionsUndefined, 'IsAbsent Toptions' | 'IsAnyOrUnknown Tinput' | 'ILoop_DefaultOptions Toptions'>>(true)

      const resAnyInputAbsentOptionsWrongUnknown = fakeLoop(anyInput, unknownOptions)
      expectType<TypeEqual<typeof resAnyInputAbsentOptionsWrongUnknown, 'IsAbsent Toptions' | 'IsAnyOrUnknown Tinput' | 'ILoop_DefaultOptions Toptions'>>(true)

      const resAnyInputAbsentOptionsWrongAny = fakeLoop(anyInput, anyOptions)
      expectType<TypeEqual<typeof resAnyInputAbsentOptionsWrongAny, 'IsAbsent Toptions' | 'IsAnyOrUnknown Tinput' | 'ILoop_DefaultOptions Toptions'>>(true)
    })
  })

  describe(`# Unliteral`, () => {
    it(`# Unliteral converts literal types to base types`, () => {
      // single
      typeIsTrue<IsEqual<Unliteral<'foobar'>, string>>()
      typeIsTrue<IsEqual<Unliteral<123>, number>>()
      typeIsTrue<IsEqual<Unliteral<true>, boolean>>()
      typeIsTrue<IsEqual<Unliteral<symbol>, symbol>>()
      // many
      typeIsTrue<IsEqual<Unliteral<'foobar' | 123>, string | number>>()
      typeIsTrue<IsEqual<Unliteral<'foobar' | 123 | true | symbol>, string | number | boolean | symbol>>()
    })
  })

  describe(`# typeIsTrue & typeIsFalse`, () => {
    it(`# typeIsTrue`, () => {
      typeIsTrue<IsEqual<string, string>>()
      typeIsTrue<IsEqual<'foobar', 'foobar'>>()
      // @ts-expect-error OK
      typeIsTrue<IsEqual<string, 'foobar'>>()
      // @ts-expect-error OK
      typeIsTrue<IsEqual<'foobar', string>>()
    })
    it(`# typeIsFalse`, () => {
      // @ts-expect-error OK
      typeIsFalse<IsEqual<string, string>>()
      // @ts-expect-error OK
      typeIsFalse<IsEqual<'foobar', 'foobar'>>()
      typeIsFalse<IsEqual<string, 'foobar'>>()
      typeIsFalse<IsEqual<'foobar', string>>()
    })
  })

  describe(`# IsPropTrue`, () => {
    const optionsTypedPropTrue: { prop: boolean } = { prop: true }
    const optionsTypedPropFalse: { prop: boolean } = { prop: false } // should make no difference, it's a boolean! Default is picked in any case
    const optionsTypedPropOptional: { prop?: boolean } = { prop: undefined }
    const optionsTypedPropOptional2: { prop?: boolean } = {}
    const optionsUndefined = undefined
    const optionsWrongUnknown = { wrong: 'options' } as unknown

    it(`# IsPropTrue, with default... the default (false)`, () => {
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsTypedPropTrue>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsTypedPropFalse>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsTypedPropOptional>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsTypedPropOptional2>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsUndefined>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsWrongUnknown>, false>>(true)

      expectType<TypeEqual<IsPropTrue<'prop', { prop: true }>, true>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', { prop: false }>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', {}>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', { prop: 'foo' }>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', { prop: null }>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', { prop: 123 }>, false>>(true)
    })
    it(`# IsPropTrue, with default explicit false`, () => {
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsTypedPropTrue, false>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsTypedPropFalse, false>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsTypedPropOptional, false>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsTypedPropOptional2, false>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsUndefined, false>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsWrongUnknown, false>, false>>(true)

      expectType<TypeEqual<IsPropTrue<'prop', { prop: true }, false>, true>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', { prop: false }, false>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', {}, false>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', { prop: 'foo' }, false>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', { prop: null }, false>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', { prop: 123 }, false>, false>>(true)
    })
    it(`# IsPropTrue, with default true`, () => {
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsTypedPropTrue, true>, true>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsTypedPropFalse, true>, true>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsTypedPropOptional, true>, true>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsTypedPropOptional2, true>, true>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsUndefined, true>, true>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', typeof optionsWrongUnknown, true>, true>>(true)

      expectType<TypeEqual<IsPropTrue<'prop', { prop: true }, true>, true>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', { prop: true }, true>, true>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', { prop: false }, true>, false>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', {}, true>, true>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', { prop: 'foo' }, true>, true>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', { prop: null }, true>, true>>(true)
      expectType<TypeEqual<IsPropTrue<'prop', { prop: 123 }, true>, true>>(true)
    })
  })

  describe(`# InstanceTypeAll`, () => {
    it(`Class With Private Constructor`, () => {
      class ClassPrivateConstructor {
        private constructor() {}

        aMethod(arg: string): string {
          return 'foo'
        }

        anotherMethod(num: number): number {
          return 42
        }

        aField = 'foo'
        anotherField = 42
      }

      // @ts-expect-error Error: TS2344: Type typeof ClassPrivateConstructor does not satisfy the constraint abstract new (...args: any) => any, Cannot assign a private constructor type to a public constructor type.
      type InstanceTypeOfClassPrivateConstructor = InstanceType<typeof ClassPrivateConstructor>

      //> OK: Type is equal to ClassWithPrivateConstructor
      type InstanceTypeAllOfClassPrivateConstructor = InstanceTypeAll<typeof ClassPrivateConstructor>
      expectType<TypeEqual<InstanceTypeAllOfClassPrivateConstructor, ClassPrivateConstructor>>(true)

      expectType<
        TypeEqual<
          InstanceTypeAllOfClassPrivateConstructor,
          {
            aMethod: (arg: string) => string
            anotherMethod: (num: number) => number
            aField: string
            anotherField: number
          }
        >
      >(true)

      // ### Methods only

      type MethodNamesClassPrivateConstructor = MethodNames<InstanceTypeAllOfClassPrivateConstructor>
      expectType<TypeEqual<MethodNamesClassPrivateConstructor, 'aMethod' | 'anotherMethod'>>(true) //> Type contains methods from ClassPrivateConstructor

      type MethodsOfPrivateConstructor = JustMethods<InstanceTypeAllOfClassPrivateConstructor>

      expectType<
        TypeEqual<
          MethodsOfPrivateConstructor,
          {
            aMethod: (arg: string) => string
            anotherMethod: (num: number) => number
          }
        >
      >(true)

      //> OK: Class must implement methods from ClassPrivateConstructor
      class MockClassPrivateConstructorConcrete implements MethodsOfPrivateConstructor {
        aMethod(arg: string): string {
          return 'foo'
        }

        anotherMethod(num: number): number {
          return 42
        }
      }

      //> Error: Class 'SomeClassMockError' incorrectly implements interface 'SomeClassMethods'.
      // @ts-expect-error Property 'someMethod' is missing in type 'SomeClassMockError' but required in type 'SomeClassMethods'
      class ErrorMockClassPrivateConstructorConcrete implements MethodsOfPrivateConstructor {
        aMethod(arg: string): string {
          return 'foo'
        }

        MISSING_anotherMethod(num: number): number {
          return 42
        }
      }
    })
    it(`Abstract Class, with constructor`, () => {
      abstract class AbstractClass {
        constructor() {}
        aMethod(arg: string): string {
          return 'foo'
        }
        anotherMethod(num: number): number {
          return 42
        }
        aField = 'foo'
        anotherField = 42
      }

      type InstanceTypeOfAbstractClass = InstanceType<typeof AbstractClass>
      expectType<TypeEqual<InstanceTypeOfAbstractClass, AbstractClass>>(true)

      type InstanceTypeAllOfAbstractClass = InstanceTypeAll<typeof AbstractClass>
      expectType<TypeEqual<InstanceTypeAllOfAbstractClass, AbstractClass>>(true)

      expectType<
        TypeEqual<
          InstanceTypeAllOfAbstractClass,
          {
            aMethod: (arg: string) => string
            anotherMethod: (num: number) => number
            aField: string
            anotherField: number
          }
        >
      >(true)

      // ### Methods only

      type MethodNamesAbstractClass = MethodNames<AbstractClass>
      expectType<TypeEqual<MethodNamesAbstractClass, 'aMethod' | 'anotherMethod'>>(true)

      type MethodsAbstractClass = JustMethods<AbstractClass>
      expectType<
        TypeEqual<
          MethodsAbstractClass,
          {
            aMethod: (arg: string) => string
            anotherMethod: (num: number) => number
          }
        >
      >(true)
    })
    it(`Normal Class, with constructor`, () => {
      class MyClass {
        constructor() {}
        aMethod(arg: string): string {
          return 'foo'
        }
        anotherMethod(num: number): number {
          return 42
        }
        aField = 'foo'
        anotherField = 42
      }

      type InstanceTypeOfNormalClass = InstanceType<typeof MyClass>
      expectType<TypeEqual<InstanceTypeOfNormalClass, MyClass>>(true)

      type InstanceTypeAllOfNormalClass = InstanceTypeAll<typeof MyClass>
      expectType<TypeEqual<InstanceTypeAllOfNormalClass, MyClass>>(true)

      expectType<TypeEqual<InstanceTypeAllOfNormalClass, { aMethod: (arg: string) => string; anotherMethod: (num: number) => number; aField: string; anotherField: number }>>(true)

      // ### Methods only

      type MethodNamesMyClass = MethodNames<MyClass>
      expectType<TypeEqual<MethodNamesMyClass, 'aMethod' | 'anotherMethod'>>(true)

      type MethodsMyClass = JustMethods<MyClass>
      expectType<TypeEqual<MethodsMyClass, { aMethod: (arg: string) => string; anotherMethod: (num: number) => number }>>(true)
    })
    describe(`Assignments & Matching`, () => {
      describe(`instances assignments: to sub/super class and vice versa`, () => {
        it(`InstanceType<Class<MyClass>`, () => {
          expectType<InstanceType<Class<Person>>>(a_Person)
          expectType<InstanceType<Class<Person>>>(a_Employee)
          expectType<InstanceTypeAll<Class<Person>>>(a_Person)
          expectType<InstanceTypeAll<Class<Person>>>(a_Employee)

          // @ts-expect-error OK TS2345: Argument of type Person is not assignable to parameter of type Employee. Type Person is missing the following properties from type Employee: childClassMethod, childInstanceMethod, tooBadChildInstanceProp, [symbolProp2]
          expectType<InstanceType<Class<Employee>>>(a_Person)
          expectType<InstanceType<Class<Employee>>>(a_Employee)
          // @ts-expect-error OK (missing full error!) TS2345: Argument of type Person is not assignable to parameter of type Employee
          expectType<InstanceTypeAll<Class<Employee>>>(a_Person)
          expectType<InstanceTypeAll<Class<Employee>>>(a_Employee)
        })
        it(`InstanceType<typeof MyClass>`, () => {
          expectType<InstanceType<typeof Person>>(a_Person)
          expectType<InstanceType<typeof Person>>(a_Employee)
          expectType<InstanceTypeAll<typeof Person>>(a_Person)
          expectType<InstanceTypeAll<typeof Person>>(a_Employee)

          // @ts-expect-error OK TS2345: Argument of type Person is not assignable to parameter of type Employee. Type Person is missing the following properties from type Employee: childClassMethod, childInstanceMethod, tooBadChildInstanceProp, [symbolProp2]
          expectType<InstanceType<typeof Employee>>(a_Person)
          expectType<InstanceType<typeof Employee>>(a_Employee)
          // @ts-expect-error OK (missing full error!) TS2345: Argument of type Person is not assignable to parameter of type Employee
          expectType<InstanceTypeAll<typeof Employee>>(a_Person)
          expectType<InstanceTypeAll<typeof Employee>>(a_Employee)
        })
        it(`empty objects`, () => {
          // @ts-expect-error OK TS2345: Argument of type {} is not assignable to parameter of type Employee // Type {} is missing the following properties from type Employee:          // childClassMethod, childInstanceMethod, tooBadChildInstanceProp, [symbolProp2] expectType<InstanceType<Class<Employee>>>({})
          expectType<InstanceType<Class<Employee>>>({})
          // @ts-expect-error OK TS2345: Argument of type {} is not assignable to parameter of type Employee // Type {} is missing the following properties from type Employee:          // childClassMethod, childInstanceMethod, tooBadChildInstanceProp, [symbolProp2] expectType<InstanceType<Class<Employee>>>({})
          expectType<InstanceTypeAll<Class<Employee>>>({})

          // These dont fail!
          expectType<InstanceType<Class<Employee>>>(Object.create({}))
          expectType<InstanceTypeAll<Class<Employee>>>(Object.create({}))
        })
      })
      describe(`Assignment to EmptyClass`, () => {
        class EmptyClass {
          // foo = 'Extra props breaks it'
        }
        it(`any instance`, () => {
          expectType<InstanceType<Class<EmptyClass>>>(a_Person)
          expectType<InstanceTypeAll<Class<EmptyClass>>>(a_Person)
          expectType<InstanceType<Class<EmptyClass>>>(a_Employee)
          expectType<InstanceTypeAll<Class<EmptyClass>>>(a_Employee)
        })
        it(`a pojso is matched, which means we can't use it to separate them ;-(`, () => {
          expectType<InstanceType<Class<EmptyClass>>>({})
          expectType<InstanceTypeAll<Class<EmptyClass>>>({})

          expectType<InstanceType<Class<any>>>({})
          expectType<InstanceTypeAll<Class<any>>>({})

          expectType<InstanceType<any>>({})
          expectType<InstanceTypeAll<any>>({})
        })
        it(`an Object.create({}) pojso is matched, which means we can't use it to separate them ;-(`, () => {
          expectType<InstanceType<Class<EmptyClass>>>(Object.create({}))
          expectType<InstanceTypeAll<Class<EmptyClass>>>(Object.create({}))

          expectType<InstanceType<Class<any>>>(Object.create({}))
          expectType<InstanceTypeAll<Class<any>>>(Object.create({}))

          expectType<InstanceType<any>>(Object.create({}))
          expectType<InstanceTypeAll<any>>(Object.create({}))
        })
      })
    })
  })

  it(`## GeneratorType`, () => {
    expectType<TypeEqual<GeneratorType<TmyGenerator>, Tvalues>>(true)
    // which is essentially
    expectType<TypeEqual<GeneratorType<ReturnType<typeof get_Generator_of_Tvalues>>, Tvalues>>(true)

    expectType<TypeEqual<GeneratorType<TmyAsyncGenerator>, Tvalues>>(true)
    // which is essentially
    expectType<TypeEqual<GeneratorType<ReturnType<typeof get_AsyncGenerator_of_Tvalues>>, Tvalues>>(true)

    expectType<TypeEqual<Awaited<Promise<Tvalues>>, Tvalues>>(true)
  })
  it(`## IsNestingObject`, () => {
    // IsNestingObject Iterables
    expectType<IsNestingObject<Set<any>>>(true)
    expectType<IsNestingObject<Map<any, any>>>(true)
    expectType<IsNestingObject<Array<any>>>(true)
    expectType<IsNestingObject<any[]>>(true) // array 2
    expectType<IsNestingObject<Generator<any>>>(true)
    expectType<IsNestingObject<Iterator<any>>>(true)
    expectType<IsNestingObject<AsyncGenerator<any>>>(true)
    expectType<IsNestingObject<AsyncIterator<any>>>(true)

    // Boxed Primitives: .valueOf() returns the "nested" value, the primitive
    expectType<IsNestingObject<Number>>(true)
    expectType<IsNestingObject<Boolean>>(true)
    expectType<IsNestingObject<String>>(true)

    // NOT an IsNestingObject
    expectType<IsNestingObject<{}>>(false)
    expectType<IsNestingObject<Record<any, any>>>(false)
    expectType<IsNestingObject<WeakMap<any, any>>>(false)
    expectType<IsNestingObject<WeakSet<any>>>(false)
  })

  describe(`## InsideValues`, () => {
    describe(`Real Nested Types (non necessarily Inspectable, like Generators)`, () => {
      it(`Generators`, () => {
        expectType<TypeEqual<InsideValues<TmyGenerator>, Tvalues>>(true)
        expectType<TypeEqual<InsideValues<TmyAsyncGenerator>, Tvalues>>(true)
        expectType<TypeEqual<InsideValues<typeof a_Generator_of_Tvalues_withCommonProps>, Tvalues>>(true)
        expectType<TypeEqual<InsideValues<typeof a_AsyncGenerator_of_Tvalues_withCommonProps>, Tvalues>>(true)
      })
      it(`Iterators`, () => {
        expectType<TypeEqual<InsideValues<Iterator<Tvalues>>, Tvalues>>(true)
        expectType<TypeEqual<InsideValues<IterableIterator<Tvalues>>, Tvalues>>(true)
      })
      it(`Promise`, () => {
        expectType<TypeEqual<InsideValues<Promise<Tvalues>>, Tvalues>>(true)
        expectType<TypeEqual<InsideValues<Promise<1>>, 1>>(true)
        expectType<TypeEqual<InsideValues<Promise<number>>, number>>(true)
      })
      it(`Function - i.e ReturnType`, () => {
        const anFn = (a) => 123n
        expectType<TypeEqual<InsideValues<typeof anFn>, bigint>>(true)
        expectType<TypeEqual<ReturnType<typeof anFn>, bigint>>(true)
      })
      it(`Array`, () => {
        expectType<TypeEqual<InsideValues<typeof a_Array_of_Tvalues>, Tvalues>>(true)
        expectType<TypeEqual<InsideValues<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps>, Tvalues>>(true)
      })
      it(`TypedArray - number or bigint`, () => {
        expectType<TypeEqual<InsideValues<typeof a_TypedArray_Int32Array>, number>>(true)
        expectType<TypeEqual<InsideValues<typeof a_TypedArray_BigInt64Array>, bigint>>(true)
      })
      it(`Map`, () => {
        expectType<TypeEqual<InsideValues<typeof a_Map_of_TMapKeys_Tvalues>, Tvalues>>(true)
        expectType<TypeEqual<InsideValues<typeof a_Set_of_Tvalues>, Tvalues>>(true)
      })
      it(`realObject: POJSO - i.e ValueOf`, () => {
        expectType<TypeEqual<ValueOf<typeof pojsoCommonProps>, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
        expectType<TypeEqual<InsideValues<typeof pojsoCommonProps>, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
      })
      it(`realObject: Instance - i.e ValueOf`, () => {
        expectType<TypeEqual<ValueOf<typeof a_instance_withCommonProps>, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
        expectType<TypeEqual<InsideValues<typeof a_instance_withCommonProps>, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
      })
    })

    describe(`non-Nested types`, () => {
      it(`Class with static common props - IS IT WRONG?`, () => {
        // this is wrong, we dont need the typeof the instances, but the type of the constructor somehow
        type valueOfTypeOf_ClassWithStaticCommonProps = Simplify<ValueOf<typeof ClassWithStaticCommonProps>>

        expectType<
          TypeEqual<valueOfTypeOf_ClassWithStaticCommonProps, TcommonStringProps_values | TcommonSymbolProps_values>
          // @ts-expect-error @todo(233): valueOfTypeOf_ClassWithStaticCommonProps is unknown
        >(true)

        // this is wrong, we dont need the typeof the instances, but the type of the constructor somehow
        type NestedValueTypeof_ClassWithStaticCommonProps = Simplify<InsideValues<typeof ClassWithStaticCommonProps>>
        expectType<
          TypeEqual<NestedValueTypeof_ClassWithStaticCommonProps, TcommonStringProps_values | TcommonSymbolProps_values>
          // @ts-expect-error @todo(222): NestedValueTypeof_ClassWithStaticCommonProps is unknown
        >(true)
      })
      it(`Arguments`, () => {
        expectType<TypeEqual<ValueOf<typeof a_Arguments>, any>>(true) // Fails: this is TS/JS!
        expectType<TypeEqual<InsideValues<typeof a_Arguments>, any>>(true) // Fails: this is TS/JS!
      })
      it(`WeakSet & WeakMap are a special case: They are neither Single nor Many really: they have Nested values, but are not iterable. So what are they? Who knows. But we can always get the "NestedType" of them, which is the nested value type!`, () => {
        expectType<TypeEqual<InsideValues<typeof a_WeakSet_of_Person>, Person>>(true)
        expectType<TypeEqual<InsideValues<typeof a_WeakMap_of_Person_Employees>, Employee>>(true)
      })
      it(`non-nested isSingle types: Primitives`, () => {
        expectType<TypeEqual<InsideValues<number>, number>>(true)
        expectType<TypeEqual<InsideValues<123>, 123>>(true)
        expectType<TypeEqual<InsideValues<bigint>, bigint>>(true)
        expectType<TypeEqual<InsideValues<123n>, 123n>>(true)
        expectType<TypeEqual<InsideValues<'foobar'>, string>>(true)
        expectType<TypeEqual<InsideValues<string>, string>>(true)
        expectType<TypeEqual<InsideValues<true>, true>>(true)
        expectType<TypeEqual<InsideValues<false>, false>>(true)
        expectType<TypeEqual<InsideValues<symbol>, symbol>>(true)
        expectType<TypeEqual<InsideValues<undefined>, undefined>>(true)
        expectType<TypeEqual<InsideValues<null>, null>>(true)
      })
      it(`non-nested TSingle / TSystemSingle types & System Classes`, () => {
        expectType<TypeEqual<InsideValues<Date>, number>>(true) // number, because of .valueOf()
        const date = new Date()
        expectType<TypeEqual<InsideValues<typeof date>, number>>(true)
        expectType<TypeEqual<InsideValues<RegExp>, RegExp>>(true)
        expectType<TypeEqual<InsideValues<Function>, Function>>(true) // constructor, not an actual function!
        expectType<TypeEqual<InsideValues<typeof Number.NaN>, typeof Number.NaN>>(true)
        expectType<TypeEqual<InsideValues<Error>, string>>(true)
        expectType<TypeEqual<InsideValues<DataView>, DataView>>(true)
      })
      it(`Boxed Primitives, return their primitive type`, () => {
        expectType<TypeEqual<InsideValues<Boolean>, boolean>>(true)
        expectType<TypeEqual<InsideValues<String>, string>>(true) // TS is lying here!
        expectType<TypeEqual<InsideValues<Number>, number>>(true)
      })
    })
  })
})
