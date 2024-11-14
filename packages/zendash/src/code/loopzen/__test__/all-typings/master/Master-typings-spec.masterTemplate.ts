// @-ts-nocheck  only applies to master template - use the specific template one for each one

/**
 This is the master template for all all-typings tests
 - ** Process is controlled by `src/test-utils/generate.ts` & `npm run generate!` script. **
 - It tests across all options, input types & all functions (keys, values, loop, each etc).
 - There's only one master template, this one.
 - All templates inside ./templates, get their file generated based on this one.

 WARNING: This Suite requires a LOT of RAM - node's 4GB limit simply crashes - use more RAM, eg export NODE_OPTIONS="--max-old-space-size=12288". It might work with less also, try 8192.
 */

// Master/Source - it's OK to reside in generated files once!
/*{ common-imports-in-tests-templates BEGIN }*/

// These are NOT used by spec templates in ./templates, only in output files in _generated

import * as __ from 'lodash' // double underscore, so its private ;-)
import { expectType, TypeEqual } from 'ts-expect'
import { IfAny, IfNever, IfUnknown, IsUnknown, Or, TypedArray } from 'type-fest'
import {
  IfAnyOrUnknown,
  LoopGenerator,
  keys,
  values,
  loop,
  ValueOfStrict as _ValueOfStrict,
  If,
  isNestingObject,
  isSingle,
  IfAnd,
  IfNestingObject,
  Not,
  IfExtends,
  each,
  map,
  mapKeys,
  BaseType,
  isSingleOrWeak,
  InsideValues,
  type,
  isBigInt,
  NO_TYPE_CHANGE,
  isStrictNumber,
  clone,
  isAnyJustIterator,
  take,
  filter,
  IfOr,
  TypedArrayBigInt,
  IsRealObject,
  reduce,
  ReduceCallback, Unliteral, find, NOTHING, findKey,
} from '../../../../index'
import { equalSetDeep } from '../../../../../test-utils/specHelpers'

// These common imports are imported as private (with _Xxx), so we can re-import them as Xxx in the test source templates

import {
  noPropsKeysOptionsAsConst,
  noPropsKeysOptionsTyped,
  noPropsKeysOptionsUntyped,
  commonSymbolProps as _commonSymbolProps,
  commonSymbolProps_values as _commonSymbolProps_values,
  commonStringProps as _commonStringProps,
  commonStringProps_values as _commonStringProps_values,
  TcommonStringProps as _TcommonStringProps,
  TcommonSymbolProps as _TcommonSymbolProps,
  TcommonStringProps_values as _TcommonStringProps_values,
  TcommonSymbolProps_values as _TcommonSymbolProps_values,
  // used by all inputs that emit Tvalues
  a_Array_of_Tvalues as _a_Array_of_Tvalues,
  Tvalues as _Tvalues,
  T_NEW_TYPE,
  NEW_TYPE,
} from '../../../../../test-utils/test-data'
import { isAsyncIterator } from '../../../../typezen/isAsyncIterator'
import { IfSingleOrWeak, IsSingle, IsSingleOrWeak } from '../../../../typezen/isSingle'
import { IsPromise, UnwrapPromise } from '../../../../typezen/isPromise'

import {
  object_stringNonEnumerablesInheritedTopHidden as _object_stringNonEnumerablesInheritedTopHidden,
  object_stringNonEnumerablesInheritedTop as _object_stringNonEnumerablesInheritedTop,
  Tobject_stringNonEnumerablesInheritedTop as _Tobject_stringNonEnumerablesInheritedTop,
  Tobject_stringNonEnumerablesInheritedTopHidden as _Tobject_stringNonEnumerablesInheritedTopHidden,
} from '../../../../typezen/types-info'

/*{ common-imports-in-tests-templates END }*/

// these are needed only in Source template, other templates defines their own

import { ReadonlyDeep, ValueOf } from 'type-fest'
import {
  a_Array_of_Tvalues_indexes,
  a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  arrayAndCommonStringProps,
  arrayAndCommonStringProps_values,
  TarrayAndCommonStringProps,
  TarrayAndCommonStringProps_values,
} from '../../../../../test-utils/test-data'
import {
  array_prototype_stringNonEnumerablesInherited,
  array_prototype_stringNonEnumerablesInherited_ES2023,
  array_prototype_stringNonEnumerablesOwn,
  array_prototype_symbolNonEnumerablesInherited,
  Tarray_prototype_stringNonEnumerablesInherited,
  Tarray_prototype_stringNonEnumerablesInherited_values,
  Tarray_prototype_stringNonEnumerablesOwn,
  Tarray_prototype_stringNonEnumerablesOwn_values,
  Tarray_prototype_symbolNonEnumerablesInherited,
  Tarray_prototype_symbolNonEnumerablesInherited_values,
} from '../../../../typezen/types-info'

// Master template based on array + actual generic test blocks
describe(`Source/Master Template`, () => {
  const inputTitle = `Array<Tvalues>`
  describe(inputTitle, () => {
    const getInputVanilla = () => _a_Array_of_Tvalues // set to the "input value" under test, eg `a_Array_of_Tvalues`, `aSetOfValues`, `a_Map_of_TMapKeys_Tvalues`, `aPojso`, `instance` etc
    const getInputWithExtraCommonProps = () => a_Array_of_Tvalues_withCommonAndArrayExtraProps // like above, with ECP
    let inputVanilla = getInputVanilla()
    let inputWithExtraCommonProps = getInputWithExtraCommonProps()

    // **Nested Keys/Values** are items nested inside the value, separate from their props/values. For example Array has **indexes** against elements (values), Maps have **keys** against **values** in pairs and so on.

    // But only Map, Set, Array, TypedArray & Arguments etc have Nested Keys / values that can be Inspected (i.e iterated), without affecting the input value it self - so set this to `true` for them.
    // On the other hand `Set.entries()`, `Map.entries()` and other Iterators/Generators can't get iterated to inspect their keys (since they can't be restarted), so their Nested Keys /Values are NOT inspectable. For these, along with POJSO/instances, Singles etc, set this to `false`.
    // All Objects in JS also have props, which can be separate from Nested Keys /Values. All POJSO/instances (including Set & Map Iterators or normal Iterators/Generators), don't have Inspectable Nested Keys, so ONLY their props are the keys (therefore set this to `false` for these ones)!
    const isInspectableNested = true

    // if isInspectableNested is true, set the actual Nested Keys type, eg `number` for Array indexes, or Map/Set actual keys. If false, set to never.
    type Texpected_nested_keys = IsInspectableNested extends false ? never : number

    // ### Keys / Props ###
    const expected_nested_keys: Texpected_nested_keys[] = a_Array_of_Tvalues_indexes // An array of the actual natural keys of the value, eg for indexes [0,1,2,3], or Map/Set actual keys used. Leave as empty array, if `!isInspectableNested`

    // Master/Source - it's OK to reside in generated files once!
    /*{ common-own-inherited-enumerable-props  BEGIN }*/
    type IsInspectableNested = typeof isInspectableNested

    // own enumerable props (for With Common Extra Props values)

    // These are the common props that are common to all objects (except Array, which has its own common props)
    type Texpected_stringOwnProps = _TcommonStringProps // set to TcommonStringProps, or change to `TarrayAndCommonStringProps` eg for arrays with extra prop `-10` or something else
    type Texpected_symbolOwnProps = _TcommonSymbolProps // set to TcommonSymbolProps, or change to other
    const expected_stringOwnProps: Readonly<Texpected_stringOwnProps[]> = _commonStringProps // set to `commonStringProps`, or something else
    const expected_symbolOwnProps: Readonly<Texpected_symbolOwnProps[]> = _commonSymbolProps // set to `commonSymbolProps`, or something else

    type Texpected_stringOwnProps_values = _TcommonStringProps_values // set to TcommonStringProps, or change to `TarrayAndCommonStringProps` eg for arrays with extra prop `-10` or something else
    type Texpected_symbolOwnProps_values = _TcommonSymbolProps_values // set to TcommonSymbolProps, or change to other
    const expected_stringOwnProps_values: Readonly<Texpected_stringOwnProps_values[]> = _commonStringProps_values // set to `commonStringProps_values`, or something else
    const expected_symbolOwnProps_values: Readonly<Texpected_symbolOwnProps_values[]> = _commonSymbolProps_values // set to `commonSymbolProps_values`, or something else

    // top props - common to all objects
    const expected_stringNonEnumerablesInheritedTop = _object_stringNonEnumerablesInheritedTop
    type Texpected_stringNonEnumerablesInheritedTop = _Tobject_stringNonEnumerablesInheritedTop
    const expected_stringNonEnumerablesInheritedTopHidden = _object_stringNonEnumerablesInheritedTopHidden
    type Texpected_stringNonEnumerablesInheritedTopHidden = _Tobject_stringNonEnumerablesInheritedTopHidden

    /*{ common-own-inherited-enumerable-props END }*/

    // prototype / base-type props

    // own nonEnumerable props
    type Texpected_stringNonEnumerablesOwn = Tarray_prototype_stringNonEnumerablesOwn
    const expected_stringNonEnumerablesOwn = array_prototype_stringNonEnumerablesOwn
    type Texpected_symbolNonEnumerablesOwn = never
    const expected_symbolNonEnumerablesOwn = []

    // inherited props
    type Texpected_stringNonEnumerablesInherited = Tarray_prototype_stringNonEnumerablesInherited
    const expected_stringNonEnumerablesInherited = [...array_prototype_stringNonEnumerablesInherited, ...(([] as any).findLastIndex ? array_prototype_stringNonEnumerablesInherited_ES2023 : [])]
    type Texpected_symbolNonEnumerablesInherited = Tarray_prototype_symbolNonEnumerablesInherited
    const expected_symbolNonEnumerablesInherited = array_prototype_symbolNonEnumerablesInherited

    // ### Items / Values ###
    type Texpected_nested_items = IsInspectableNested extends false ? never : _Tvalues // if isInspectableNested is true, set the actual Nested Values type, eg Tvalues. If false, set to never.
    const expected_nested_items: Texpected_nested_items[] = !isInspectableNested ? [] : _a_Array_of_Tvalues // An array of the actual Nested Values of the value, eg array elements or Map values / Set keys  used. Leave as empty array, if `!isInspectableNested`

    // prototype / base-type values

    // own nonEnumerables values
    type Texpected_stringNonEnumerablesOwn_values = Tarray_prototype_stringNonEnumerablesOwn_values
    const expected_stringNonEnumerablesOwn_values = expected_stringNonEnumerablesOwn.map((k) => inputVanilla[k])
    type Texpected_symbolNonEnumerablesOwn_values = never
    const expected_symbolNonEnumerablesOwn_values = []

    // inherited values
    type Texpected_stringNonEnumerablesInherited_values = Tarray_prototype_stringNonEnumerablesInherited_values<typeof inputVanilla>
    type Texpected_symbolNonEnumerablesInherited_values = Tarray_prototype_symbolNonEnumerablesInherited_values<typeof inputVanilla>

    // top values
    type Texpected_stringNonEnumerablesInheritedTop_values = _ValueOfStrict<Object, Exclude<keyof Object, keyof Array<any>>> // @todo: should be ValueOfStrict & generic with a GetBaseType<typeof inputVanilla>, to exclude the base type

    // Master/Source - it's OK to reside in generated files once!
    /*{ default-expected-keys-values-iteration  BEGIN }*/
    const expected_stringNonEnumerablesInherited_values /*: Texpected_stringNonEnumerablesInherited_values[] */ = expected_stringNonEnumerablesInherited.map((value) => inputVanilla[value])
    const expected_symbolNonEnumerablesInherited_values /*: Texpected_symbolNonEnumerablesInherited_values[] */ = expected_symbolNonEnumerablesInherited.map((value) => inputVanilla[value])

    const expected_stringNonEnumerablesInheritedTop_values = _object_stringNonEnumerablesInheritedTop.map((v) => inputVanilla[v])

    // # Defaults Expected - ?all we need to perform a test? - overridden where needed

    // keys()
    type Texpected_keys = IsInspectableNested extends true ? Texpected_nested_keys : Texpected_stringNonEnumerablesOwn
    const expected_keys = isInspectableNested ? expected_nested_keys : [...expected_stringNonEnumerablesOwn]
    // values()
    type Texpected_values = IsInspectableNested extends true ? Texpected_nested_items : Texpected_stringNonEnumerablesOwn_values
    const expected_values = isInspectableNested ? expected_nested_items : [...expected_stringNonEnumerablesOwn_values]

    // Iteration keys & items/values i.e loop(), each() etc
    type Texpected_iteration_keys = Texpected_nested_keys
    const expected_iteration_keys: Texpected_nested_keys[] = expected_nested_keys
    type Texpected_iteration_items = Texpected_nested_items
    const expected_iteration_items = expected_nested_items

    // project() callback keys / values (i.e map(), filter() etc): These are similar to iteration_keys & values, but with few twists:
    // - `nonEnumerables` & `hidden` props are NOT allowed in project callbacks, considered dangerous (unlike `loop` & `each`). So only `own` & `enumerable` are returned (when props: true / 'all')
    // - Internal values are returned in most cases:
    //    - Boxed Primitives are unboxed (callback receives the primitive)
    //    - Functions pass their return value to project callback
    //    - ??anything else?
    type Texpected_callback_keys = Texpected_nested_keys
    const expected_callback_keys: Texpected_nested_keys[] = expected_nested_keys
    type Texpected_callback_items = Texpected_nested_items
    const expected_callback_items = expected_nested_items

    // When we map() or filter() etc, we can return a new type for the Internal items or keys, so we set it here. They can change for 2 reasons:
    // - We explicitly return a "new type", from map()/mapKeys()
    // - We get `never` as the internal value, if we map()/filter() etc with props: true
    // Otherwise, set to the original type
    type Texpected_internal_items = Texpected_nested_items
    type Texpected_internal_keys = Texpected_nested_keys

    type Tcount = If<IsSingle<typeof inputVanilla>, 1, number> // this isn't entirely correct, when props: true, we should have number for Singles (reason: consistency)

    /*{ default-expected-keys-values-iteration END }*/

    describe(`all-typings-tests overrides`, () => {
      // default overrides here, eg for Array (see Many-INV-Array-typings-spec.template.ts)

      // Master/Source - it's OK to reside in generated files once!
      /*{ all-typings-tests-vanilla BEGIN }*/
      describe(`# ${inputTitle} Vanilla values, without Extra Common Props`, () => {
        const getInput = getInputVanilla
        type Tinput = ReturnType<typeof getInput>
        type Tcount = IfSingleOrWeak<Tinput, 1, number>

        // so we can reuse `Expecting: ...` that includes ECP
        type Texpected_stringOwnProps = never
        type Texpected_symbolOwnProps = never
        type Texpected_stringOwnProps_values = never
        type Texpected_symbolOwnProps_values = never
        const expected_stringOwnProps = []
        const expected_symbolOwnProps = []
        const expected_stringOwnProps_values = []
        const expected_symbolOwnProps_values = []

        type Texpected_props = Texpected_stringOwnProps
        type Texpected_props_values = Texpected_stringOwnProps_values

        //** Async BEGIN **// - replacing with `AsyncLoopGenerator` & await on `AsyncGenerator` input
        describe(`props: false - for keys()/values() it returns "Nested Keys/Values" if IsInspectableNested, requested props otherwise. For loop() it goes over Nested Keys/Values if IsNestingObject, props otherwise`, () => {
          describe('props: false with default/absent/non-deterministic options. Returns Inspectable NestedKeys OR own enumerable props', () => {
            describe(`EmptyOptions & @expecting-defaults-or-overridden Master/Source`, () => {
              const options = {} as const
              // Master/Source - it's OK to reside in generated files once!
              /*{ expecting-defaults-or-overridden BEGIN }*/
              describe(`Expecting: defaults OR overridden`, () => {
                // basic info
                it(`keys()`, () => {
                  // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                  const result = keys(getInput(), options)
                  expectType<TypeEqual<typeof result, Texpected_keys[]>>(true)
                  equalSetDeep(result, expected_keys)
                })
                it(`values()`, () => {
                  // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                  const result = values(getInput(), options)
                  expectType<TypeEqual<typeof result, Texpected_values[]>>(true)
                  equalSetDeep(result, expected_values)
                })
                // iterations
                describe(`loop()`, () => {
                  it(`loop() plain`, async () => {
                    // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                    const result = loop(getInput(), options)
                    type ExpectedLoopGenerator = IfAny<
                      typeof options,
                      /**Async**/ LoopGenerator<[any, any, Tcount], Texpected_iteration_items, Texpected_iteration_keys, Tinput, any, any>,
                      /**Async**/ LoopGenerator<
                        [Texpected_iteration_items, Texpected_iteration_keys, Tcount],
                        Texpected_iteration_items,
                        Texpected_iteration_keys,
                        Tinput,
                        Texpected_iteration_items,
                        Texpected_iteration_keys
                      >
                    >

                    expectType<TypeEqual<typeof result, ExpectedLoopGenerator>>(true)

                    const result_values: Texpected_iteration_items[] = []
                    const result_keys: Texpected_iteration_keys[] = []

                    // prettier-ignore
                    for /**await**/ (const [item, idxKey, count] of result) {
                      expectType<
                        TypeEqual<
                          typeof item,
                          IfAny<typeof options, any, Texpected_iteration_items>
                        >
                      >(true)
                      expectType<
                        TypeEqual<
                          typeof idxKey,
                          IfAny<typeof options, any, Texpected_iteration_keys>
                        >
                      >(true)
                      expectType<TypeEqual<typeof count, Tcount>>(true)

                      result_values.push(item)
                      result_keys.push(idxKey)
                    }
                    equalSetDeep(result_values, expected_iteration_items)
                    equalSetDeep(result_keys, expected_iteration_keys)
                  })
                  it(`loop() map`, async () => {
                    // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                    const result = loop(getInput(), options, {
                      map: (item, idxOrKey, input, count) => {
                        expectType<TypeEqual<typeof item, Texpected_iteration_items>>(true)
                        expectType<TypeEqual<typeof idxOrKey, Texpected_iteration_keys>>(true)
                        expectType<TypeEqual<typeof input, Tinput>>(true)
                        expectType<TypeEqual<typeof count, number>>(true) // @todo: should be Tcount (1 for Singles)

                        return NEW_TYPE
                      },
                    })

                    type ExpectedLoopGenerator = IfAnyOrUnknown<
                      typeof options,
                      /**Async**/ LoopGenerator<[any, any, Tcount], Texpected_iteration_items, Texpected_iteration_keys, Tinput, any, any>,
                      /**Async**/ LoopGenerator<[T_NEW_TYPE, Texpected_iteration_keys, Tcount], Texpected_iteration_items, Texpected_iteration_keys, Tinput, T_NEW_TYPE, Texpected_iteration_keys>
                    >
                    // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                    expectType<TypeEqual<typeof result, ExpectedLoopGenerator>>(true)
                  })
                  it(`loop() mapKeys`, async () => {
                    // prettier-ignore
                    const result = loop(
                      // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                      getInput(), { ...options }, {
                        mapKeys: (item, idxOrKey, input, count) => {
                          expectType<TypeEqual<typeof item, Texpected_iteration_items>>(true)
                          expectType<TypeEqual<typeof idxOrKey, Texpected_iteration_keys>>(true)
                          expectType<TypeEqual<typeof input, Tinput>>(true)
                          expectType<TypeEqual<typeof count, number>>(true) // @todo: should be Tcount (1 for Singles)

                          return NEW_TYPE
                        },
                      },
                    )

                    type ExpectedLoopGenerator = IfAnyOrUnknown<
                      typeof options,
                      /**Async**/ LoopGenerator<[any, any, Tcount], Texpected_iteration_items, Texpected_iteration_keys, Tinput, any, any>,
                      /**Async**/ LoopGenerator<[Texpected_iteration_items, T_NEW_TYPE, Tcount], Texpected_iteration_items, Texpected_iteration_keys, Tinput, Texpected_iteration_items, T_NEW_TYPE>
                    >

                    expectType<TypeEqual<typeof result, ExpectedLoopGenerator>>(true)
                  })
                  it(`loop() filter`, async () => {
                    // prettier-ignore
                    const result = loop(
                      // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                      getInput(), { ...options }, {
                        filter: (item, idxOrKey, input, count) => {
                          expectType<TypeEqual<typeof item, Texpected_iteration_items>>(true)
                          expectType<TypeEqual<typeof idxOrKey, Texpected_iteration_keys>>(true)
                          expectType<TypeEqual<typeof input, Tinput>>(true)
                          expectType<TypeEqual<typeof count, number>>(true) // @todo: should be Tcount (1 for Singles)

                          return true
                        },
                      },
                    )

                    type ExpectedLoopGenerator = IfAnyOrUnknown<
                      typeof options,
                      /**Async**/ LoopGenerator<[any, any, Tcount], Texpected_iteration_items, Texpected_iteration_keys, Tinput, any, any>,
                      /**Async**/ LoopGenerator<
                        [Texpected_iteration_items, Texpected_iteration_keys, Tcount],
                        Texpected_iteration_items,
                        Texpected_iteration_keys,
                        Tinput,
                        Texpected_iteration_items,
                        Texpected_iteration_keys
                      >
                    >

                    expectType<TypeEqual<typeof result, ExpectedLoopGenerator>>(true)
                  })
                  it(`loop() take`, async () => {
                    // prettier-ignore
                    const result = loop(
                      // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                      getInput(), { ...options }, {
                        take: (item, idxOrKey, input, count) => {
                          expectType<TypeEqual<typeof item, Texpected_iteration_items>>(true)
                          expectType<TypeEqual<typeof idxOrKey, Texpected_iteration_keys>>(true)
                          expectType<TypeEqual<typeof input, Tinput>>(true)
                          expectType<TypeEqual<typeof count, number>>(true) // @todo: should be Tcount (1 for Singles)

                          return true
                        },
                      },
                    )

                    type ExpectedLoopGenerator = IfAnyOrUnknown<
                      typeof options,
                      /**Async**/ LoopGenerator<[any, any, Tcount], Texpected_iteration_items, Texpected_iteration_keys, Tinput, any, any>,
                      /**Async**/ LoopGenerator<
                        [Texpected_iteration_items, Texpected_iteration_keys, Tcount],
                        Texpected_iteration_items,
                        Texpected_iteration_keys,
                        Tinput,
                        Texpected_iteration_items,
                        Texpected_iteration_keys
                      >
                    >

                    expectType<TypeEqual<typeof result, ExpectedLoopGenerator>>(true)
                  })
                })
                describe(`each()`, async () => {
                  it(`each() normal`, async () => {
                    const result_values: Texpected_iteration_items[] = []
                    const result_keys: Texpected_iteration_keys[] = []

                    // prettier-ignore
                    const result = each(
                      getInput(),
                      (item, idxKey, input, count) => {
                        expectType<TypeEqual<typeof item, Texpected_iteration_items>>(true)
                        expectType<TypeEqual<typeof idxKey, Texpected_iteration_keys>>(true)
                        expectType<TypeEqual<typeof input, Tinput>>(true)
                        expectType<TypeEqual<typeof count, number>>(true) // @todo: should be Tcount (1 for Singles)

                        result_values.push(item)
                        result_keys.push(idxKey)
                        return true
                        // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                      }, options,
                    )

                    /**await**/ result

                    equalSetDeep(result_values, expected_iteration_items)
                    equalSetDeep(result_keys, expected_iteration_keys)

                    // NOTE: when we have unknown options, `each()` returns Promise<Tinput> instead of Tinput, won't fix now. But we DO have a Promise<Tinput> when input AsyncGenerator, so leave it as is
                    type ExpectedEachResult = IfAnd<
                      IfUnknown<typeof options>, // (forced) options unknown messes up the result
                      Not<IfExtends<Tinput, AsyncGenerator>>,
                      UnwrapPromise<typeof result>, // because it's WRONGLY a Promise<Tinput>, cause of options unknown
                      typeof result
                    >

                    expectType<TypeEqual<ExpectedEachResult, /**Promise**/ Tinput>>(true)
                  })
                })

                // projections
                describe(`map()`, async () => {
                  it(`map() _.identity`, async () => {
                    // const result_values: Texpected_iteration_items[] = []
                    // const result_keys: Texpected_iteration_keys[] = []

                    // prettier-ignore
                    const result = map(getInput(), (item, idxOrKey) => {
                      expectType<TypeEqual<typeof item, Texpected_callback_items>>(true)
                      expectType<TypeEqual<typeof idxOrKey, Texpected_callback_keys>>(true)
                      // console.log(item)
                      return item
                      // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                    }, options)

                    // @-ts-expect-error @todo(111): this can never work, we dont get back / care about the exact thing
                    // expectType<TypeEqual<typeof result, Tinput>>(true)

                    // @todo(222): We can't really test the exact return type, since it's mapped
                    // // We could have TinputType extends TresultType sometime, but messes up when props: true
                    // type Tresult = typeof result
                    // type InputType = ReturnType<typeof getInput>
                    // expectType<InputType extends Tresult ? true: false>(true)

                    // // @todo(222): formulate tthis: Tinput can be assignable to Tresult, only if we dont deal with props: true
                    // const a: Tresult = getInput()
                    // expectType<Tresult>(getInput())

                    // What we can check, are BaseType as container, has the correct type (ignoring internal items)
                    expectType<TypeEqual<BaseType<typeof result, Texpected_internal_items>, BaseType<Tinput, Texpected_internal_items>>>(true)

                    // and any Internal Items have not changed (only if we're dealing with props: false)
                    // @todo(222): same test for props, not inside values
                    // @todo(333): Add it to filter, clone, take
                    expectType<
                      IfExtends<
                        typeof options,
                        { props: 'all' | true },
                        true,
                        IfAnd<
                          // specieal cases: these types work with options: unknown
                          IfOr<IfSingleOrWeak<Tinput>, IfOr<TypeEqual<BaseType<Tinput>, ArrayBuffer>, IfOr<IfExtends<BaseType<Tinput>, TypedArray>, IsRealObject<Tinput>>>>,
                          IfUnknown<typeof options>,
                          false, // so it wrongs with below "ONLY FOR WrongUnknownOptions test @-ts-expect-error"

                          // actual test for all other types & options!
                          TypeEqual<BaseType<typeof result>, BaseType<Tinput, IfNever<InsideValues<typeof result>, never, InsideValues<Tinput>>>>
                        >
                      >
                      // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                    >(true)

                    // the props the result (mapped input) holds are the requested props
                    expectType<TypeEqual<IfNever<Texpected_props, never, (typeof result)[Texpected_props]>, IfNever<Texpected_props, never, Texpected_props_values>>>(true)
                  })
                  it(`map() project items/values to NEW_TYPE`, async () => {
                    // const result_values: Texpected_iteration_items[] = []
                    // const result_keys: Texpected_iteration_keys[] = []

                    // prettier-ignore
                    const result = map(getInput(), (item, idxOrKey): T_NEW_TYPE => {
                      expectType<TypeEqual<typeof item, Texpected_callback_items>>(true)
                      expectType<TypeEqual<typeof idxOrKey, Texpected_callback_keys>>(true)

                      if (type(getInput()) === 'TypedArray') // `SyntaxError: Cannot convert NEW_TYPE to a BigInt` if we return NEW_TYPE
                        // @ts-expect-error fails, ignore, we only need this for runtime!
                        return ((item as number | bigint) * (isBigInt(item) ? 2n : 2) as any) as any
                      else
                        return NEW_TYPE
                      // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                    }, options)

                    // @-ts-expect-error @todo(111): this can never work, we dont get back / care about the exact thing
                    // expectType<TypeEqual<typeof result, Tinput>>(true)

                    // @todo(222): We can't really test the exact return type, since it's mapped
                    // // We could have TinputType extends TresultType sometime, but messes up when props: true
                    // type Tresult = typeof result
                    // type InputType = ReturnType<typeof getInput>
                    // expectType<InputType extends Tresult ? true: false>(true)

                    // // Tinput can be assignable to Tresult, only if we dont deal with props: true
                    // const a: Tresult = getInput()
                    // expectType<Tresult>(getInput())

                    // What we can check, are BaseType as container, has the correct type (ignoring internal items)
                    expectType<TypeEqual<BaseType<typeof result, Texpected_internal_items>, BaseType<Tinput, Texpected_internal_items>>>(true)

                    // and the internal items have changed to NEW_TYPE
                    // expectType<TypeEqual<InsideValues<typeof result>, NEW_TYPE>>(true) // @todo: this test fails with Singles / Boxed that hold one kind of value only
                    expectType<TypeEqual<BaseType<typeof result>, BaseType<Tinput, T_NEW_TYPE>>>(true)

                    // the props the result (mapped input) holds are the requested props
                    expectType<TypeEqual<IfNever<Texpected_props, never, (typeof result)[Texpected_props]>, IfNever<Texpected_props, never, Texpected_props_values>>>(true)
                  })
                })
                describe(`clone()`, async () => {
                  if (!isAnyJustIterator(getInput()))
                    it(`clone() - like map() _.identity()`, async () => {
                      // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                      const result = clone(getInput(), options)

                      expectType<IfExtends<typeof options, { props: 'all' | true }, true, TypeEqual<BaseType<typeof result>, BaseType<Tinput, IfNever<InsideValues<typeof result>, never, InsideValues<Tinput>>>>>>(
                        true
                      )

                      // What we can check, are BaseType as container, has the correct type (ignoring internal items)
                      expectType<TypeEqual<BaseType<typeof result, Texpected_internal_items>, BaseType<Tinput, Texpected_internal_items>>>(true)

                      // the props the result (cloned input) holds are the requested props
                      expectType<TypeEqual<IfNever<Texpected_props, never, (typeof result)[Texpected_props]>, IfNever<Texpected_props, never, Texpected_props_values>>>(true)
                    })
                })
                describe(`take() - like map() _.identity()`, async () => {
                  it(`take() - numeric take`, async () => {
                    if (isSingleOrWeak(getInput()) && !((options || {}) as any).filterSingles) return // take breaks

                    // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                    const result = take(getInput(), 100, options)

                    expectType<IfExtends<typeof options, { props: 'all' | true }, true, TypeEqual<BaseType<typeof result>, BaseType<Tinput, IfNever<InsideValues<typeof result>, never, InsideValues<Tinput>>>>>>(
                      true
                    )

                    // What we can check, are BaseType as container, has the correct type (ignoring internal items)
                    expectType<TypeEqual<BaseType<typeof result, Texpected_internal_items>, BaseType<Tinput, Texpected_internal_items>>>(true)

                    // the props the result (cloned input) holds are the requested props
                    expectType<TypeEqual<IfNever<Texpected_props, never, (typeof result)[Texpected_props]>, IfNever<Texpected_props, never, Texpected_props_values>>>(true)
                  })
                  it(`take() - callback take`, async () => {
                    if (isSingleOrWeak(getInput()) && !((options || {}) as any).filterSingles) return // take breaks

                    const result = take(getInput(), (item, idxOrKey, input) => {
                      expectType<TypeEqual<typeof item, Texpected_callback_items>>(true)
                      expectType<TypeEqual<typeof idxOrKey, Texpected_callback_keys>>(true)
                      expectType<TypeEqual<typeof input, Tinput>>(true)

                      return true
                      // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                    }, options)

                    expectType<IfExtends<typeof options, { props: 'all' | true }, true, TypeEqual<BaseType<typeof result>, BaseType<Tinput, IfNever<InsideValues<typeof result>, never, InsideValues<Tinput>>>>>>(
                      true
                    )

                    // What we can check, are BaseType as container, has the correct type (ignoring internal items)
                    expectType<TypeEqual<BaseType<typeof result, Texpected_internal_items>, BaseType<Tinput, Texpected_internal_items>>>(true)

                    // the props the result (cloned input) holds are the requested props
                    expectType<TypeEqual<IfNever<Texpected_props, never, (typeof result)[Texpected_props]>, IfNever<Texpected_props, never, Texpected_props_values>>>(true)
                  })
                })
                describe(`filter()`, async () => {
                  it(`filter() - like map() _.identity()`, async () => {
                    if (isSingleOrWeak(getInput()) && !((options || {}) as any).filterSingles) return // take breaks

                    const result = filter(
                      getInput(),
                      (item, idxOrKey, input) => {
                        expectType<TypeEqual<typeof item, Texpected_callback_items>>(true)
                        expectType<TypeEqual<typeof idxOrKey, Texpected_callback_keys>>(true)
                        expectType<TypeEqual<typeof input, Tinput>>(true)

                        return true
                      },
                      // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                      options
                    )

                    const wrongReturnValue = filter(
                      getInput(),
                      // @ts-expect-error OK 'WRONG_RETURN' not boolean
                      () => 'WRONG_RETURN',
                      options
                    )

                    expectType<IfExtends<typeof options, { props: 'all' | true }, true, TypeEqual<BaseType<typeof result>, BaseType<Tinput, IfNever<InsideValues<typeof result>, never, InsideValues<Tinput>>>>>>(
                      true
                    )

                    // What we can check, are BaseType as container, has the correct type (ignoring internal items)
                    expectType<TypeEqual<BaseType<typeof result, Texpected_internal_items>, BaseType<Tinput, Texpected_internal_items>>>(true)

                    // the props the result (cloned input) holds are the requested props
                    expectType<TypeEqual<IfNever<Texpected_props, never, (typeof result)[Texpected_props]>, IfNever<Texpected_props, never, Texpected_props_values>>>(true)
                  })
                })
                describe(`mapKeys()`, async () => {
                  it(`mapKeys() project keys to NEW_TYPE`, async () => {
                    // const result_values: Texpected_iteration_items[] = []
                    // const result_keys: Texpected_iteration_keys[] = []

                    // prettier-ignore
                    const result = mapKeys(getInput(), (item, idxOrKey): T_NEW_TYPE => {
                      expectType<TypeEqual<typeof item, Texpected_callback_items>>(true)
                      expectType<TypeEqual<typeof idxOrKey, Texpected_callback_keys>>(true)

                      if (isStrictNumber(idxOrKey))
                        return idxOrKey * 2 as any // only affects arrays with options.sparse = true
                      else if (__.isString(idxOrKey)) return `${NEW_TYPE}_${idxOrKey}` as any

                      return idxOrKey as any
                      // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                    }, options)

                    // @-ts-expect-error @todo(111): this can never work, we dont get back / care about the exact thing
                    // expectType<TypeEqual<typeof result, Tinput>>(true)

                    // @todo(222): We can't really test the exact return type, since it's mapped
                    // // We could have TinputType extends TresultType sometime, but messes up when props: true
                    // type Tresult = typeof result
                    // type InputType = ReturnType<typeof getInput>
                    // expectType<InputType extends Tresult ? true: false>(true)

                    // // Tinput can be assignable to Tresult, only if we dont deal with props: true
                    // const a: Tresult = getInput()
                    // expectType<Tresult>(getInput())

                    // What we can check, are BaseType as container, has the correct type (ignoring internal items)
                    expectType<TypeEqual<BaseType<typeof result, Texpected_internal_items>, BaseType<Tinput, Texpected_internal_items>>>(true)

                    // and the internal items have changed to NEW_TYPE
                    // @todo: this test fails with Singles / Boxed that hold one kind of value only
                    // expectType<TypeEqual<InsideValues<typeof result>, NEW_TYPE>>(true)

                    // this test makes NO sense with inputs like Array etc, where the keys type is fixed (number / index)
                    expectType<TypeEqual<BaseType<typeof result>, BaseType<Tinput, NO_TYPE_CHANGE, T_NEW_TYPE>>>(true)

                    // the props the result (mapped input) holds are the requested props
                    expectType<TypeEqual<IfNever<Texpected_props, never, (typeof result)[Texpected_props]>, IfNever<Texpected_props, never, Texpected_props_values>>>(true)
                  })
                })

                // reducing
                describe(`reduce()`, async () => {
                  it(`reduce()`, async () => {
                    // if (isSingleOrWeak(getInput()) && !((options || {}) as any).filterSingles) return // take breaks

                    const result = /**await**/ reduce(
                      getInput(),
                      (acc, item, idxOrKey, input, count) => {
                        expectType<TypeEqual<typeof acc, typeof NEW_TYPE>>(true)
                        expectType<TypeEqual<typeof item, Texpected_callback_items>>(true)
                        expectType<TypeEqual<typeof idxOrKey, Texpected_callback_keys>>(true)
                        expectType<TypeEqual<typeof input, Tinput>>(true)
                        // expectType<TypeEqual<typeof count, Tcount>>(true)

                        return NEW_TYPE
                      },
                      NEW_TYPE,
                      // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                      options
                    )

                    expectType<TypeEqual<typeof result, Unliteral<typeof NEW_TYPE>>>(true)

                    const wrongReturnValue = reduce(
                      getInput(),
                      // @ts-expect-error OK 'WRONG_RETURN' not boolean
                      () => 'WRONG_RETURN',
                      NEW_TYPE,
                      options
                    )
                  })
                })
                describe(`find()`, async () => {
                  it(`find()`, async () => {
                    // if (isSingleOrWeak(getInput()) && !((options || {}) as any).filterSingles) return // take breaks

                    const result = /**await**/ find(
                      getInput(),
                      (item, idxOrKey, input, count) => {
                        expectType<TypeEqual<typeof item, Texpected_callback_items>>(true)
                        expectType<TypeEqual<typeof idxOrKey, Texpected_callback_keys>>(true)
                        expectType<TypeEqual<typeof input, Tinput>>(true)
                        // expectType<TypeEqual<typeof count, Tcount>>(true)

                        return true
                      },
                      // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                      options
                    )

                    // expectType<TypeEqual<typeof result, (Texpected_callback_items | typeof NOTHING)>>(true)
                    // expectType<Texpected_callback_items | typeof NOTHING>(result)

                    // let expected_callback_items: Texpected_callback_items
                    // if (result !== NOTHING) expected_callback_items = result

                    // @todo: why above fail, only in some cases (when Texpected_callback_items is never) ? In effect, typeof NOTHING is converted erroneously to just `symbol` instead of `typeof NOTHING` i.e unique symbol

                    expectType<Texpected_callback_items | symbol>(result)

                    const wrongReturnValue = find(
                      getInput(),
                      // @ts-expect-error OK 'WRONG_RETURN' not boolean
                      () => 'WRONG_RETURN',
                      options
                    )
                  })
                })
                describe(`findKey()`, async () => {
                  it(`find()`, async () => {
                    // if (isSingleOrWeak(getInput()) && !((options || {}) as any).filterSingles) return // take breaks

                    const result = /**await**/ findKey(
                      getInput(),
                      (item, idxOrKey, input, count) => {
                        expectType<TypeEqual<typeof item, Texpected_callback_items>>(true)
                        expectType<TypeEqual<typeof idxOrKey, Texpected_callback_keys>>(true)
                        expectType<TypeEqual<typeof input, Tinput>>(true)
                        // expectType<TypeEqual<typeof count, Tcount>>(true)

                        return true
                      },
                      // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions
                      options
                    )

                    // expectType<TypeEqual<typeof result, (Texpected_callback_keys | typeof NOTHING)>>(true)
                    // expectType<Texpected_callback_keys | typeof NOTHING>(result)

                    // let expected_callback_keys: Texpected_callback_keys
                    // if (result !== NOTHING) expected_callback_keys = result

                    // @todo: why above fail, only in some cases (when Texpected_callback_items is never) ? In effect, typeof NOTHING is converted erroneously to just `symbol` instead of `typeof NOTHING` i.e unique symbol

                    expectType<Texpected_callback_keys | symbol>(result)

                    const wrongReturnValue = find(
                      getInput(),
                      // @ts-expect-error OK 'WRONG_RETURN' not boolean
                      () => 'WRONG_RETURN',
                      options
                    )
                  })
                })
              })

              /*{ expecting-defaults-or-overridden END }*/

              // // meta info
              // it(`meta()`, async () => {})
            })
            describe(`NoOptions (replacing options in @expecting-defaults-or-overridden)`, () => {
              const options = undefined // needed only in typing decisions, not on calls
              // "Expecting: defaults OR overridden" replace in generate.ts:
              //    - ", options)"                    ->          ")"
              //    - ", { ...options }, {"           ->          ", undefined, {"

              //** NoOptions BEGIN **//
              /*{ @expecting-defaults-or-overridden }*/
              //** NoOptions END **//
            })
            describe(`Options non-literal, can't determine actual values`, () => {
              const options = {
                enumerables: true,
                own: true,
                strict: false,
                inherited: false,
                top: false,
                nonEnumerables: false,
              }
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`Options untyped`, () => {
              const options = noPropsKeysOptionsUntyped
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`Options as const`, () => {
              const options = noPropsKeysOptionsAsConst
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`Options Typed`, () => {
              const options = noPropsKeysOptionsTyped
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`Options string: true (ignored for Nesting Objects)`, () => {
              const options = {
                ...noPropsKeysOptionsUntyped,
                string: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`Options string: false (ignored for Nesting Objects & no difference on others)`, () => {
              const options = {
                ...noPropsKeysOptionsUntyped,
                string: false,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`Wrong Options (any) - use defaults`, () => {
              const options = { foo: 'bar' } as any
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`# WrongUnknownOptions (unknown) - use defaults (replacing to ts-expect-error)`, () => {
              const options = { foo: 'bar' } as unknown
              // "Expecting: defaults OR overridden" replace in generate.ts:
              // ts-expect-error OK WrongUnknownOptions become active

              type T_NEW_TYPE = any // cause of unknown map return type, which is messed up!

              //** WrongUnknownOptions BEGIN **//
              /*{ @expecting-defaults-or-overridden }*/
              //** WrongUnknownOptions END **//
            })
          })
          describe('props: false/undefined(default) - returns Inspectable NestedKeys OR own enumerable props', () => {
            describe(`PropsUndefined`, () => {
              const options = { props: undefined } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`PropsFalse`, () => {
              const options = { props: false } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`PropsFalseStringSymbols`, () => {
              const options = {
                props: false,
                string: false,
                symbol: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`PropsUndefined`, () => {
              const options = { props: undefined } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`NoPropsSymbolIgnored`, () => {
              const options = { symbol: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`NoPropsSymbolFalseIgnored`, () => {
              const options = { symbol: false } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`NoPropsStringIgnored`, () => {
              const options = { string: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`NoPropsStringFalseIgnored`, () => {
              const options = { string: false } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe('props: false, while most options are true - returns Nested Keys/Values for inputs with InspectableKeys, inherited props otherwise', () => {
            describe(`props: false, other options true (except symbol & top) - returns Nested Keys/Values for inputs with InspectableKeys, string inherited props otherwise`, () => {
              const options = {
                props: false,
                string: true,
                symbol: false,
                inherited: true,
                nonEnumerables: true,
                enumerables: true,
              } as const

              // keys()
              type Texpected_keys = IsInspectableNested extends true ? Texpected_nested_keys : Texpected_stringNonEnumerablesOwn | Texpected_stringNonEnumerablesInherited
              const expected_keys = isInspectableNested ? expected_nested_keys : [...expected_stringNonEnumerablesOwn, ...expected_stringNonEnumerablesInherited]

              // values()
              type Texpected_values = IsInspectableNested extends true ? Texpected_nested_items : Texpected_stringNonEnumerablesOwn_values | Texpected_stringNonEnumerablesInherited_values
              const expected_values = isInspectableNested ? expected_nested_items : [...expected_stringNonEnumerablesOwn_values, ...expected_stringNonEnumerablesInherited_values]

              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: false, other options true (except top) - returns Nested Keys/Values for inputs with InspectableKeys, all inherited props otherwise`, () => {
              const options = {
                props: false,
                string: true,
                symbol: true,
                inherited: true,
                nonEnumerables: true,
                enumerables: true,
              } as const

              // keys()
              type Texpected_keys = IsInspectableNested extends true
                ? Texpected_nested_keys
                : Texpected_stringNonEnumerablesOwn | Texpected_stringNonEnumerablesInherited | Texpected_symbolNonEnumerablesOwn | Texpected_symbolNonEnumerablesInherited
              const expected_keys = isInspectableNested
                ? expected_nested_keys
                : [...expected_stringNonEnumerablesOwn, ...expected_stringNonEnumerablesInherited, ...expected_symbolNonEnumerablesOwn, ...expected_symbolNonEnumerablesInherited]

              // values()
              type Texpected_values = IsInspectableNested extends true
                ? Texpected_nested_items
                : Texpected_stringNonEnumerablesOwn_values | Texpected_stringNonEnumerablesInherited_values | Texpected_symbolNonEnumerablesOwn_values | Texpected_symbolNonEnumerablesInherited_values
              const expected_values = isInspectableNested
                ? expected_nested_items
                : [...expected_stringNonEnumerablesOwn_values, ...expected_stringNonEnumerablesInherited_values, ...expected_symbolNonEnumerablesOwn_values, ...expected_symbolNonEnumerablesInherited_values]

              /*{ @expecting-defaults-or-overridden }*/
            })
          })
        })

        describe(`props: 'all' - for keys()/values() it returns "Nested Keys/Values" if IsInspectableNested, and requested props always. For loop() it goes over Nested Keys/Values if IsNestingObject & props always`, () => {
          describe('props: "all" with defaults and/or values that have no effect on props (on a vanilla value) - returns "Nested Keys & Values"', () => {
            // keys()
            type Texpected_keys = If<IsInspectableNested, Texpected_nested_keys, never>
            const expected_keys = isInspectableNested ? [...expected_nested_keys] : []

            // values()
            type Texpected_values = If<IsInspectableNested, Texpected_nested_items, never>
            const expected_values = isInspectableNested ? [...expected_nested_items] : []

            // Iteration keys & items/values i.e loop(), each() etc
            // type Texpected_iteration_keys = Texpected_nested_keys
            // const expected_iteration_keys: Texpected_nested_keys[] = expected_nested_keys
            // type Texpected_iteration_items = Texpected_nested_items
            // const expected_iteration_items = expected_nested_items
            //
            // type Texpected_callback_keys = Texpected_iteration_keys
            // const expected_callback_keys = expected_iteration_keys
            // type Texpected_callback_items = Texpected_iteration_items
            // const expected_callback_items = expected_iteration_items

            describe(`props: "all" - defaults`, () => {
              const options = { props: 'all' } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: "all", symbol: true`, () => {
              const options = { props: 'all', symbol: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: "all", symbol: true, string: false`, () => {
              const options = {
                props: 'all',
                symbol: true,
                string: false,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: "all", symbol: false, string: false`, () => {
              const options = {
                props: 'all',
                symbol: true,
                string: false,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: "all", nonEnumerables: true, string: false`, () => {
              const options = {
                props: 'all',
                nonEnumerables: true,
                string: false,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: "all", nonEnumerables: false, inherited: true, string: false`, () => {
              const options = {
                props: 'all',
                nonEnumerables: false,
                inherited: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: "all", nonEnumerables: undefined, inherited: true, string: false`, () => {
              const options = { props: 'all', inherited: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: "all", nonEnumerables: true, inherited: true, string: false`, () => {
              const options = {
                props: 'all',
                nonEnumerables: true,
                inherited: true,
                string: false,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe(`props: "all" - nonEnumerables own - returns Nested Values & only own string props (like 'length')`, () => {
            // keys()
            type Texpected_keys = If<IsInspectableNested, Texpected_nested_keys, never> | Texpected_stringNonEnumerablesOwn
            const expected_keys = [...(isInspectableNested ? [...expected_nested_keys] : []), ...expected_stringNonEnumerablesOwn]

            // values()
            type Texpected_values = If<IsInspectableNested, Texpected_nested_items, never> | Texpected_stringNonEnumerablesOwn_values
            const expected_values = [...(isInspectableNested ? [...expected_nested_items] : []), ...expected_stringNonEnumerablesOwn_values]

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = IfSingleOrWeak<Tinput, null, never> | Texpected_nested_keys | Texpected_stringNonEnumerablesOwn
            const expected_iteration_keys = [...(isSingleOrWeak(inputVanilla) ? [null] : isNestingObject(inputVanilla) ? expected_nested_keys : []), ...expected_stringNonEnumerablesOwn]
            type Texpected_iteration_items = IfSingleOrWeak<Tinput, Tinput, never> | Texpected_nested_items | Texpected_stringNonEnumerablesOwn_values
            const expected_iteration_items = [...(isSingleOrWeak(inputVanilla) ? [inputVanilla] : isNestingObject(inputVanilla) ? expected_nested_items : []), ...expected_stringNonEnumerablesOwn_values]

            describe(`props: 'all' & nonEnumerables BUT inherited: undefined`, () => {
              const options = { props: 'all', nonEnumerables: true } as const // inherited: false // default
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all' & nonEnumerables BUT inherited: false`, () => {
              const options = {
                props: 'all',
                nonEnumerables: true,
                inherited: false,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all' & nonEnumerables & top BUT inherited: false`, () => {
              const options = {
                props: 'all',
                nonEnumerables: true,
                top: true,
                inherited: false,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe('props: "all" - nonEnumerables own & symbol - returns Nested Values & only own string & symbol props (like \'length\')', () => {
            // keys()
            type Texpected_keys = If<IsInspectableNested, Texpected_nested_keys, never> | Texpected_stringNonEnumerablesOwn | Texpected_symbolNonEnumerablesOwn
            const expected_keys = [...(isInspectableNested ? [...expected_nested_keys] : []), ...expected_stringNonEnumerablesOwn]

            // values()
            type Texpected_values = If<IsInspectableNested, Texpected_nested_items, never> | Texpected_stringNonEnumerablesOwn_values | Texpected_symbolNonEnumerablesOwn_values
            const expected_values = [...(isInspectableNested ? [...expected_nested_items] : []), ...expected_stringNonEnumerablesOwn_values, ...expected_symbolNonEnumerablesOwn_values]

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = IfSingleOrWeak<Tinput, null, never> | Texpected_nested_keys | Texpected_stringNonEnumerablesOwn | Texpected_symbolNonEnumerablesOwn
            const expected_iteration_keys = [...(isSingleOrWeak(inputVanilla) ? [null] : isNestingObject(inputVanilla) ? expected_nested_keys : []), ...expected_stringNonEnumerablesOwn]
            type Texpected_iteration_items = IfSingleOrWeak<Tinput, Tinput, Texpected_nested_items> | Texpected_stringNonEnumerablesOwn_values | Texpected_symbolNonEnumerablesOwn_values
            const expected_iteration_items = [
              ...(isSingleOrWeak(inputVanilla) ? [inputVanilla] : isNestingObject(inputVanilla) ? expected_nested_items : []),
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesOwn_values,
            ]

            // calback_items are default (Nested Items / Keys)

            describe(`props: 'all' & nonEnumerables BUT inherited: undefined`, () => {
              const options = {
                props: 'all',
                nonEnumerables: true,
                symbol: true,
              } as const // inherited: false // default
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all' & nonEnumerables BUT inherited: false`, () => {
              const options = {
                props: 'all',
                nonEnumerables: true,
                symbol: true,
                inherited: false,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe(`props: 'all' & both nonEnumerables inherited: true - returns all string keys, including base-type inherited & non-enumerables props`, () => {
            const options = {
              props: 'all',
              nonEnumerables: true,
              inherited: true,
            } as const
            // keys()
            type Texpected_keys = If<IsInspectableNested, Texpected_nested_keys, never> | Texpected_stringNonEnumerablesOwn | Texpected_stringNonEnumerablesInherited // @todo(999): match runtime
            const expected_keys = [...(isInspectableNested ? [...expected_nested_keys] : []), ...expected_stringNonEnumerablesOwn, ...expected_stringNonEnumerablesInherited]

            // values()
            type Texpected_values = If<IsInspectableNested, Texpected_nested_items, never> | Texpected_stringNonEnumerablesOwn_values | Texpected_stringNonEnumerablesInherited_values // @todo(999): match runtime
            const expected_values = [...(isInspectableNested ? [...expected_nested_items] : []), ...expected_stringNonEnumerablesOwn_values, ...expected_stringNonEnumerablesInherited_values]

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = IfSingleOrWeak<Tinput, null, never> | Texpected_nested_keys | Texpected_stringNonEnumerablesOwn | Texpected_stringNonEnumerablesInherited // @todo(999): match runtime
            const expected_iteration_keys = [...(isSingleOrWeak(inputVanilla) ? [null] : []), ...expected_nested_keys, ...expected_stringNonEnumerablesOwn, ...expected_stringNonEnumerablesInherited]

            type Texpected_iteration_items = IfSingleOrWeak<Tinput, Tinput, never> | Texpected_nested_items | Texpected_stringNonEnumerablesOwn_values | Texpected_stringNonEnumerablesInherited_values
            const expected_iteration_items = [
              ...(isSingleOrWeak(inputVanilla) ? [inputVanilla] : isNestingObject(inputVanilla) ? expected_nested_items : []),
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
            ]

            // calback_items are default (Nested Items / Keys)

            /*{ @expecting-defaults-or-overridden }*/
          })
          describe(`props: 'all' & symbol nonEnumerables inherited: true - returns all keys (string & symbol), including base-type inherited & non-enumerables props`, () => {
            const options = {
              props: 'all',
              symbol: true,
              nonEnumerables: true,
              inherited: true,
            } as const
            // keys()
            type Texpected_keys =
              | If<IsInspectableNested, Texpected_nested_keys, never> // @todo(999): match runtime
              | Texpected_stringNonEnumerablesOwn
              | Texpected_symbolNonEnumerablesOwn
              | Texpected_stringNonEnumerablesInherited
              | Texpected_symbolNonEnumerablesInherited
            const expected_keys = [
              ...(isInspectableNested ? [...expected_nested_keys] : []),
              ...expected_stringNonEnumerablesOwn,
              ...expected_symbolNonEnumerablesOwn,
              ...expected_stringNonEnumerablesInherited,
              ...expected_symbolNonEnumerablesInherited,
            ]

            // values()
            type Texpected_values =
              | If<IsInspectableNested, Texpected_nested_items, never> // @todo(999): match runtime
              | Texpected_stringNonEnumerablesOwn_values
              | Texpected_symbolNonEnumerablesOwn_values
              | Texpected_stringNonEnumerablesInherited_values
              | Texpected_symbolNonEnumerablesInherited_values
            const expected_values = [
              ...(isInspectableNested ? [...expected_nested_items] : []),
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
              ...expected_symbolNonEnumerablesInherited_values,
            ]

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys =
              | IfSingleOrWeak<Tinput, null, never>
              | Texpected_nested_keys
              | Texpected_stringNonEnumerablesOwn
              | Texpected_symbolNonEnumerablesOwn
              | Texpected_stringNonEnumerablesInherited
              | Texpected_symbolNonEnumerablesInherited
            const expected_iteration_keys = [
              ...(isSingleOrWeak(inputVanilla) ? [null] : []),
              ...expected_nested_keys,
              ...expected_stringNonEnumerablesOwn,
              ...expected_symbolNonEnumerablesOwn,
              ...expected_stringNonEnumerablesInherited,
              ...expected_symbolNonEnumerablesInherited,
            ]
            type Texpected_iteration_items =
              | IfSingleOrWeak<Tinput, Tinput, never>
              | Texpected_nested_items
              | Texpected_stringNonEnumerablesOwn_values
              | Texpected_symbolNonEnumerablesOwn_values
              | Texpected_stringNonEnumerablesInherited_values
              | Texpected_symbolNonEnumerablesInherited_values
            const expected_iteration_items = [
              ...(isSingleOrWeak(inputVanilla) ? [inputVanilla] : []),
              ...expected_nested_items,
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
              ...expected_symbolNonEnumerablesInherited_values,
            ]

            /*{ @expecting-defaults-or-overridden }*/
          })
          describe(`props: 'all' & symbol nonEnumerables inherited top: true - returns all keys (string & symbol), including base-type inherited & non-enumerables props`, () => {
            const options = {
              props: 'all',
              symbol: true,
              nonEnumerables: true,
              inherited: true,
              top: true,
            } as const
            // keys()
            type Texpected_keys =
              | If<IsInspectableNested, Texpected_nested_keys, never>
              | Texpected_stringNonEnumerablesOwn
              | Texpected_symbolNonEnumerablesOwn
              | Texpected_stringNonEnumerablesInherited
              | Texpected_symbolNonEnumerablesInherited
              | Texpected_stringNonEnumerablesInheritedTop
            const expected_keys = [
              ...(isInspectableNested ? [...expected_nested_keys] : []),
              ...expected_stringNonEnumerablesOwn,
              ...expected_symbolNonEnumerablesOwn,
              ...expected_stringNonEnumerablesInherited,
              ...expected_symbolNonEnumerablesInherited,
              ...expected_stringNonEnumerablesInheritedTop,
            ]

            // values()
            type Texpected_values =
              | If<IsInspectableNested, Texpected_nested_items, never> // @todo(999): match runtime
              | Texpected_stringNonEnumerablesOwn_values
              | Texpected_symbolNonEnumerablesOwn_values
              | Texpected_stringNonEnumerablesInherited_values
              | Texpected_symbolNonEnumerablesInherited_values
              | Texpected_stringNonEnumerablesInheritedTop_values
            const expected_values = [
              ...(isInspectableNested ? [...expected_nested_items] : []),
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
              ...expected_symbolNonEnumerablesInherited_values,
              ...expected_stringNonEnumerablesInheritedTop_values,
            ]

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys =
              | IfSingleOrWeak<Tinput, null, never>
              | Texpected_nested_keys
              | Texpected_stringNonEnumerablesOwn
              | Texpected_symbolNonEnumerablesOwn
              | Texpected_stringNonEnumerablesInherited
              | Texpected_symbolNonEnumerablesInherited
              | Texpected_stringNonEnumerablesInheritedTop
            const expected_iteration_keys = [
              ...(isSingleOrWeak(inputVanilla) ? [null] : []),
              ...expected_nested_keys,
              ...expected_stringNonEnumerablesOwn,
              ...expected_symbolNonEnumerablesOwn,
              ...expected_stringNonEnumerablesInherited,
              ...expected_symbolNonEnumerablesInherited,
              ...expected_stringNonEnumerablesInheritedTop,
            ]
            type Texpected_iteration_items =
              | IfSingleOrWeak<Tinput, Tinput, never>
              | Texpected_nested_items
              | Texpected_stringNonEnumerablesOwn_values
              | Texpected_symbolNonEnumerablesOwn_values
              | Texpected_stringNonEnumerablesInherited_values
              | Texpected_symbolNonEnumerablesInherited_values
              | Texpected_stringNonEnumerablesInheritedTop_values
            const expected_iteration_items = [
              ...(isSingleOrWeak(inputVanilla) ? [inputVanilla] : []),
              ...expected_nested_items,
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
              ...expected_symbolNonEnumerablesInherited_values,
              ...expected_stringNonEnumerablesInheritedTop_values,
            ]

            // calback_items are default (Nested Items / Keys)

            /*{ @expecting-defaults-or-overridden }*/
          })
        })
        //** Async END **//

        // props: true is always sync
        describe(`props: true, vanilla - ignores "Nested Keys/Values" if IsInspectableNested/IsNestingObject, always goes over props/propsValues only`, () => {
          describe(`props: true - leading to never[], cause vanilla values have no props & nonEnumerables/inherited are false `, () => {
            type Texpected_keys = never
            type Texpected_values = never
            const expected_keys = []
            const expected_values = []
            type Texpected_iteration_items = never
            type Texpected_iteration_keys = never
            const expected_iteration_keys = []
            const expected_iteration_items = []

            // callback values & keys -  never  for props:true / vanilla
            type Texpected_callback_keys = never
            const expected_callback_keys = []
            type Texpected_callback_items = never
            const expected_callback_items = []

            type Tcount = number

            type Texpected_internal_items = never

            describe(`props: true - returns never[]`, () => {
              const options = { props: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props:true symbol: true - returns never[]`, () => {
              const options = { props: true, symbol: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props:true string: false & symbols: true - returns never[]`, () => {
              const options = {
                props: true,
                string: false,
                symbol: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props:true string: false - returns never[]`, () => {
              const options = {
                props: true,
                string: false,
                symbol: false,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props:true string: false & symbols: false - returns never[]`, () => {
              const options = {
                props: true,
                string: false,
                symbol: false,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`symbol inherited top, but nonEnumerables: undefined - returns never: no extra BaseType props (cause nonEnumerables: false)`, () => {
              const options = {
                props: true,
                symbol: true,
                // nonEnumerables: false, // default
                inherited: true,
                top: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`symbol inherited top, but nonEnumerables: false - returns never: no extra BaseType props (cause nonEnumerables: false)`, () => {
              const options = {
                props: true,
                symbol: true,
                nonEnumerables: false, // explicit
                inherited: true,
                top: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe(`props: true - nonEnumerables & own true, inherited: false/undefined - returns own nonEnumerable string symbol`, () => {
            type Texpected_keys = Texpected_stringNonEnumerablesOwn | Texpected_symbolNonEnumerablesOwn | Texpected_stringOwnProps | Texpected_symbolOwnProps
            const expected_keys = [...expected_stringNonEnumerablesOwn, ...expected_symbolNonEnumerablesOwn, ...expected_stringOwnProps, ...expected_symbolOwnProps]

            type Texpected_values = Texpected_stringNonEnumerablesOwn_values | Texpected_symbolNonEnumerablesOwn_values | Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values
            const expected_values = [...expected_stringNonEnumerablesOwn_values, ...expected_symbolNonEnumerablesOwn_values, ...expected_stringOwnProps_values, ...expected_symbolOwnProps_values]

            type Texpected_iteration_keys = Texpected_keys
            const expected_iteration_keys = expected_keys
            type Texpected_iteration_items = Texpected_values
            const expected_iteration_items = expected_values

            type Texpected_callback_keys = Texpected_stringOwnProps | Texpected_symbolOwnProps
            const expected_callback_keys = [...expected_stringOwnProps, ...expected_symbolOwnProps]
            type Texpected_callback_items = Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values
            const expected_callback_items = [...expected_stringOwnProps_values, ...expected_symbolOwnProps_values]

            type Tcount = number

            describe(`own symbol nonEnumerables: true & inherited: undefined (default)`, () => {
              const options = {
                props: true,
                own: true,
                symbol: true,
                nonEnumerables: true,
                // inherited: false // default
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`symbol nonEnumerables: true & inherited: undefined (default)`, () => {
              const options = {
                props: true,
                // own: true // default
                symbol: true,
                nonEnumerables: true,
                // inherited: false // default
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`symbol nonEnumerables: true & inherited: false (explicit)`, () => {
              const options = {
                props: true,
                // own: true // default
                symbol: true,
                nonEnumerables: true,
                inherited: false, // explicit
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe(`props: true - also nonEnumerables inherited true`, () => {
            describe(`props: true & symbol nonEnumerables inherited - returns all keys, including base-type inherited & non-enumerables props`, () => {
              type Texpected_keys =
                | Texpected_stringOwnProps
                | Texpected_symbolOwnProps
                | Texpected_stringNonEnumerablesOwn
                | Texpected_symbolNonEnumerablesOwn
                | Texpected_stringNonEnumerablesInherited
                | Texpected_symbolNonEnumerablesInherited

              const expected_keys = [
                ...expected_stringOwnProps,
                ...expected_symbolOwnProps,
                ...expected_stringNonEnumerablesOwn,
                ...expected_symbolNonEnumerablesOwn,
                ...expected_stringNonEnumerablesInherited,
                ...expected_symbolNonEnumerablesInherited,
              ]

              type Texpected_values =
                | Texpected_stringOwnProps_values
                | Texpected_symbolOwnProps_values
                | Texpected_stringNonEnumerablesOwn_values
                | Texpected_symbolNonEnumerablesOwn_values
                | Texpected_stringNonEnumerablesInherited_values
                | Texpected_symbolNonEnumerablesInherited_values

              const expected_values = [
                ...expected_stringOwnProps_values,
                ...expected_symbolOwnProps_values,
                ...expected_stringNonEnumerablesOwn_values,
                ...expected_symbolNonEnumerablesOwn_values,
                ...expected_stringNonEnumerablesInherited_values,
                ...expected_symbolNonEnumerablesInherited_values,
              ]

              type Texpected_iteration_keys = Texpected_keys
              const expected_iteration_keys = expected_keys
              type Texpected_iteration_items = Texpected_values
              const expected_iteration_items = expected_values

              type Texpected_callback_keys = Texpected_stringOwnProps | Texpected_symbolOwnProps
              const expected_callback_keys = [...expected_stringOwnProps, ...expected_symbolOwnProps]
              type Texpected_callback_items = Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values
              const expected_callback_items = [...expected_stringOwnProps_values, ...expected_symbolOwnProps_values]

              type Tcount = number

              const options = {
                props: true,
                symbol: true,
                nonEnumerables: true,
                inherited: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })

            describe(`props: true & symbol nonEnumerables inherited & top: true - returns all keys, including base-type inherited & non-enumerables props & top`, () => {
              const options = {
                props: true,
                symbol: true,
                nonEnumerables: true,
                inherited: true,
                top: true,
              } as const

              type Texpected_keys =
                | Texpected_stringOwnProps
                | Texpected_symbolOwnProps
                | Texpected_stringNonEnumerablesOwn
                | Texpected_symbolNonEnumerablesOwn
                | Texpected_stringNonEnumerablesInherited
                | Texpected_symbolNonEnumerablesInherited
                | Texpected_stringNonEnumerablesInheritedTop

              const expected_keys = [
                ...expected_stringOwnProps,
                ...expected_symbolOwnProps,
                ...expected_stringNonEnumerablesOwn,
                ...expected_symbolNonEnumerablesOwn,
                ...expected_stringNonEnumerablesInherited,
                ...expected_symbolNonEnumerablesInherited,
                ...expected_stringNonEnumerablesInheritedTop,
              ]

              type Texpected_values =
                | Texpected_stringOwnProps_values
                | Texpected_symbolOwnProps_values
                | Texpected_stringNonEnumerablesOwn_values
                | Texpected_symbolNonEnumerablesOwn_values
                | Texpected_stringNonEnumerablesInherited_values
                | Texpected_symbolNonEnumerablesInherited_values
                | Texpected_stringNonEnumerablesInheritedTop_values

              const expected_values = [
                ...expected_stringOwnProps_values,
                ...expected_symbolOwnProps_values,
                ...expected_stringNonEnumerablesOwn_values,
                ...expected_symbolNonEnumerablesOwn_values,
                ...expected_stringNonEnumerablesInherited_values,
                ...expected_symbolNonEnumerablesInherited_values,
                ...expected_stringNonEnumerablesInheritedTop_values,
              ]

              type Texpected_iteration_keys = Texpected_keys
              const expected_iteration_keys = expected_keys
              type Texpected_iteration_items = Texpected_values
              const expected_iteration_items = expected_values

              type Texpected_callback_keys = Texpected_stringOwnProps | Texpected_symbolOwnProps
              const expected_callback_keys = [...expected_stringOwnProps, ...expected_symbolOwnProps]
              type Texpected_callback_items = Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values
              const expected_callback_items = [...expected_stringOwnProps_values, ...expected_symbolOwnProps_values]

              type Tcount = number

              /*{ @expecting-defaults-or-overridden }*/
            })
          })
        })
      })
      /*{ all-typings-tests-vanilla END }*/

      // Master/Source - it's OK to reside in generated files once!
      /*{ all-typings-tests-WECP BEGIN }*/
      describe(`# ${inputTitle} ECP (with Extra Common Props)`, () => {
        const getInput = getInputWithExtraCommonProps
        type Tinput = ReturnType<typeof getInput>

        // @todo: use the right ones
        type Texpected_props = never
        type Texpected_props_values = never

        const expected_stringNonEnumerablesOwn_values = expected_stringNonEnumerablesOwn.map((k) => (__.isObject(inputWithExtraCommonProps) ? inputWithExtraCommonProps : {})[k])
        const expected_stringNonEnumerablesInherited_values = expected_stringNonEnumerablesInherited.map((k) => (__.isObject(inputWithExtraCommonProps) ? inputWithExtraCommonProps : {})[k])
        const expected_stringNonEnumerablesInheritedTop_values = expected_stringNonEnumerablesInheritedTop.map((k) => (__.isObject(inputWithExtraCommonProps) ? inputWithExtraCommonProps : {})[k])

        //** Async BEGIN **// - replacing with `AsyncLoopGenerator` & await on `AsyncGenerator` input
        describe(`props: false - for keys()/values() it returns "Nested Keys/Values" if IsInspectableNested, requested props otherwise. For loop() it goes over Nested Keys/Values if IsNestingObject, props otherwise`, () => {
          // Test helpers, factoring out only what is changing: the props & props values
          // keys()
          type getFinal_Texpected_keys<TexpectedProps> = IfAnd<IsInspectableNested, Not<IfExtends<Tinput, AsyncGenerator>>, Texpected_nested_keys, TexpectedProps>
          const getFinal_expected_keys = (expectedProps) => (isInspectableNested && !isAsyncIterator(inputWithExtraCommonProps) ? expected_nested_keys : expectedProps)
          // values()
          type getFinal_Texpected_values<TexpectedProps_values> = IfAnd<IsInspectableNested, Not<IfExtends<Tinput, AsyncGenerator>>, Texpected_nested_items, TexpectedProps_values>
          const getFinal_expected_values = (expectedProps_values) => (isInspectableNested && !isAsyncIterator(inputWithExtraCommonProps) ? expected_nested_items : expectedProps_values)

          // Iteration keys & items/values i.e loop(), each() etc
          type getFinal_Texpected_iteration_keys<TexpectedProps> = If<IsSingleOrWeak<Tinput>, null, IfNestingObject<Tinput, Texpected_nested_keys, TexpectedProps>>
          const getFinal_expected_iteration_keys = (expectedProps) => (isSingle(inputWithExtraCommonProps) ? [null] : isNestingObject(inputWithExtraCommonProps) ? expected_nested_keys : expectedProps)
          type getFinal_Texpected_iteration_items<TexpectedProps_values> = If<IsSingleOrWeak<Tinput>, Tinput, IfNestingObject<Tinput, Texpected_nested_items, TexpectedProps_values>>
          const getFinal_expected_iteration_values = (expectedProps_values) =>
            isSingle(inputWithExtraCommonProps) ? [inputWithExtraCommonProps] : isNestingObject(inputWithExtraCommonProps) ? expected_nested_items : expectedProps_values

          type getFinal_Texpected_callback_items<TexpectedProps_values> = If<IsSingleOrWeak<Tinput>, InsideValues<Tinput>, IfNestingObject<Tinput, Texpected_nested_items, TexpectedProps_values>>
          const getFinal_expected_callback_values = (
            expectedProps_values // @todo(888): should follow the above type
          ) => (isSingle(inputWithExtraCommonProps) ? [inputWithExtraCommonProps] : isNestingObject(inputWithExtraCommonProps) ? expected_nested_items : expectedProps_values)

          describe('props: false/undefined (default) & own string props only', () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_stringOwnProps>
            const expected_keys = getFinal_expected_keys([...expected_stringOwnProps])

            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_stringOwnProps_values>
            const expected_values = getFinal_expected_values([...expected_stringOwnProps_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values])

            type Texpected_callback_keys = Texpected_iteration_keys
            const expected_callback_keys = expected_iteration_keys
            type Texpected_callback_items = getFinal_Texpected_callback_items<Texpected_stringOwnProps_values>
            const expected_callback_items = getFinal_expected_callback_values([...expected_stringOwnProps_values])

            describe(`props: falsey with default/absent/non-deterministic options. Returns Inspectable NestedKeys OR own enumerable props`, () => {
              describe(`NoOptions (replacing options in @expecting-defaults-or-overridden)`, () => {
                const options = undefined // needed only in typing decisions, not on calls
                // "Expecting: defaults OR overridden" replace in generate.ts:
                //    - ", options)"                    ->          ")"
                //    - ", { ...options }, {"           ->          ", undefined, {"

                //** NoOptions BEGIN **//
                /*{ @expecting-defaults-or-overridden }*/
                //** NoOptions END **//
              })
              describe(`EmptyOptions`, () => {
                const options = {} as const
                /*{ @expecting-defaults-or-overridden }*/
              })
              describe(`Options non-literal, can't determine actual values`, () => {
                const options = {
                  enumerables: true,
                  own: true,
                  strict: false,
                  inherited: false,
                  top: false,
                  nonEnumerables: false,
                }
                /*{ @expecting-defaults-or-overridden }*/
              })
              describe(`Options untyped`, () => {
                const options = noPropsKeysOptionsUntyped
                /*{ @expecting-defaults-or-overridden }*/
              })
              describe(`Options as const`, () => {
                const options = noPropsKeysOptionsAsConst
                /*{ @expecting-defaults-or-overridden }*/
              })
              describe(`Options Typed`, () => {
                const options = noPropsKeysOptionsTyped
                /*{ @expecting-defaults-or-overridden }*/
              })
              describe(`Options string: true (ignored for Nesting Objects)`, () => {
                const options = {
                  ...noPropsKeysOptionsUntyped,
                  string: true,
                } as const
                /*{ @expecting-defaults-or-overridden }*/
              })
              describe(`Wrong Options (any) - use defaults`, () => {
                const options = { foo: 'bar' } as any
                /*{ @expecting-defaults-or-overridden }*/
              })
              describe(`# WrongUnknownOptions (unknown) - use defaults (replacing to ts-expect-error)`, () => {
                const options = { foo: 'bar' } as unknown
                // "Expecting: defaults OR overridden" replace in generate.ts:
                // ts-expect-error OK WrongUnknownOptions become active
                type T_NEW_TYPE = any // cause of unknown map return type
                //** WrongUnknownOptions BEGIN **//
                /*{ @expecting-defaults-or-overridden }*/
                //** WrongUnknownOptions END **//
              })
            })
            describe('props: false/undefined(default) - returns Inspectable NestedKeys OR own enumerable props', () => {
              describe(`PropsUndefined`, () => {
                const options = { props: undefined } as const
                /*{ @expecting-defaults-or-overridden }*/
              })
              describe(`PropsFalse`, () => {
                const options = { props: false } as const
                /*{ @expecting-defaults-or-overridden }*/
              })
              describe(`PropsUndefined`, () => {
                const options = { props: undefined } as const
                /*{ @expecting-defaults-or-overridden }*/
              })
              describe(`NoPropsSymbolFalseIgnored`, () => {
                const options = { symbol: false } as const
                /*{ @expecting-defaults-or-overridden }*/
              })
              describe(`NoPropsStringIgnored`, () => {
                const options = { string: true } as const
                /*{ @expecting-defaults-or-overridden }*/
              })
              describe(`props: false & all others default/dont matter (inherited: true is useless, cause nonEnumerables is false)`, () => {
                const options = {
                  props: false,
                  string: true,
                  symbol: false,
                  own: true,
                  inherited: true,
                } as const
                /*{ @expecting-defaults-or-overridden }*/
              })
            })
          })
          describe('props: false & symbol: true - symbol & string own props', () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_stringOwnProps | Texpected_symbolOwnProps>
            const expected_keys = getFinal_expected_keys([...expected_stringOwnProps, ...expected_symbolOwnProps])

            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values>
            const expected_values = getFinal_expected_values([...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps | Texpected_symbolOwnProps>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps, ...expected_symbolOwnProps])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])

            type Texpected_callback_keys = Texpected_iteration_keys
            const expected_callback_keys = expected_iteration_keys
            type Texpected_callback_items = getFinal_Texpected_callback_items<Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values>
            const expected_callback_items = getFinal_expected_callback_values([...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])

            describe(`props: false & symbol: true`, () => {
              const options = { props: false, symbol: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: undefined & symbol: true`, () => {
              const options = { symbol: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: undefined & symbol: true & string: true`, () => {
              const options = { symbol: true, string: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: false & symbol: true & string: true`, () => {
              const options = {
                props: false,
                symbol: true,
                string: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe('props: false & string: false & symbol: true - symbol own props only', () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_symbolOwnProps>
            const expected_keys = getFinal_expected_keys([...expected_symbolOwnProps])

            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_symbolOwnProps_values>
            const expected_values = getFinal_expected_values([...expected_symbolOwnProps_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_symbolOwnProps>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_symbolOwnProps])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_symbolOwnProps_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_symbolOwnProps_values])

            type Texpected_callback_keys = Texpected_iteration_keys
            const expected_callback_keys = expected_iteration_keys
            type Texpected_callback_items = getFinal_Texpected_callback_items<Texpected_symbolOwnProps_values>
            const expected_callback_items = getFinal_expected_callback_values([...expected_symbolOwnProps_values])

            describe(`props: false, string: false, symbol: true`, () => {
              const options = {
                props: false,
                string: false,
                symbol: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: undefined, string: false, symbol: true`, () => {
              const options = { string: false, symbol: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe('props: false/undefined (default) & inherited & nonEnumerables true - all string props', () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_stringOwnProps | Texpected_stringNonEnumerablesOwn | Texpected_stringNonEnumerablesInherited>
            const expected_keys = getFinal_expected_keys([...expected_stringOwnProps, ...expected_stringNonEnumerablesOwn, ...expected_stringNonEnumerablesInherited])

            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_stringOwnProps_values | Texpected_stringNonEnumerablesOwn_values | Texpected_stringNonEnumerablesInherited_values>
            const expected_values = getFinal_expected_values([...expected_stringOwnProps_values, ...expected_stringNonEnumerablesOwn_values, ...expected_stringNonEnumerablesInherited_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps | Texpected_stringNonEnumerablesOwn | Texpected_stringNonEnumerablesInherited>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps, ...expected_stringNonEnumerablesOwn, ...expected_stringNonEnumerablesInherited])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values | Texpected_stringNonEnumerablesInherited_values | Texpected_stringNonEnumerablesOwn_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values, ...expected_stringNonEnumerablesOwn_values, ...expected_stringNonEnumerablesInherited_values])

            // Callback keys (i.e map(), filter() etc)
            type Texpected_callback_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps>
            const expected_callback_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps])
            type Texpected_callback_items = getFinal_Texpected_callback_items<Texpected_stringOwnProps_values>
            const expected_callback_items = getFinal_expected_callback_values([...expected_stringOwnProps_values])

            describe(`PropsUndefined`, () => {
              const options = {
                props: undefined,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`PropsFalse`, () => {
              const options = {
                props: false,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`PropsUndefined`, () => {
              const options = {
                props: undefined,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`NoPropsSymbolFalseIgnored`, () => {
              const options = {
                symbol: false,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`NoPropsStringIgnored`, () => {
              const options = {
                string: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: false & all others default/dont matter`, () => {
              const options = {
                props: false,
                string: true,
                symbol: false,
                own: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe('props: false/undefined (default) & symbol & inherited & nonEnumerables true - all symbol & string props', () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<
              | Texpected_stringOwnProps
              | Texpected_stringNonEnumerablesOwn
              | Texpected_stringNonEnumerablesInherited
              | Texpected_symbolOwnProps
              | Texpected_symbolNonEnumerablesOwn
              | Texpected_symbolNonEnumerablesInherited
            >
            const expected_keys = getFinal_expected_keys([
              ...expected_stringOwnProps,
              ...expected_stringNonEnumerablesOwn,
              ...expected_stringNonEnumerablesInherited,
              ...expected_symbolOwnProps,
              ...expected_symbolNonEnumerablesOwn,
              ...expected_symbolNonEnumerablesInherited,
            ])
            // values()
            type Texpected_values = getFinal_Texpected_values<
              | Texpected_stringOwnProps_values
              | Texpected_stringNonEnumerablesOwn_values
              | Texpected_stringNonEnumerablesInherited_values
              | Texpected_symbolOwnProps_values
              | Texpected_symbolNonEnumerablesOwn_values
              | Texpected_symbolNonEnumerablesInherited_values
            >
            const expected_values = getFinal_expected_values([
              ...expected_stringOwnProps_values,
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
              ...expected_symbolOwnProps_values,
              ...expected_symbolNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesInherited_values,
            ])
            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<
              | Texpected_stringOwnProps
              | Texpected_stringNonEnumerablesOwn
              | Texpected_stringNonEnumerablesInherited
              | Texpected_symbolOwnProps
              | Texpected_symbolNonEnumerablesOwn
              | Texpected_symbolNonEnumerablesInherited
            >
            const expected_iteration_keys = getFinal_expected_iteration_keys([
              ...expected_stringOwnProps,
              ...expected_stringNonEnumerablesOwn,
              ...expected_stringNonEnumerablesInherited,
              ...expected_symbolOwnProps,
              ...expected_symbolNonEnumerablesOwn,
              ...expected_symbolNonEnumerablesInherited,
            ])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<
              | Texpected_stringOwnProps_values
              | Texpected_stringNonEnumerablesInherited_values
              | Texpected_stringNonEnumerablesOwn_values
              | Texpected_symbolOwnProps_values
              | Texpected_symbolNonEnumerablesInherited_values
              | Texpected_symbolNonEnumerablesOwn_values
            >
            const expected_iteration_items = getFinal_expected_iteration_values([
              ...expected_stringOwnProps_values,
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
              ...expected_symbolOwnProps_values,
              ...expected_symbolNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesInherited_values,
            ])

            // Callback keys (i.e map(), filter() etc)
            type Texpected_callback_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps | Texpected_symbolOwnProps>
            const expected_callback_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps, ...expected_symbolOwnProps])
            // Callback keys (i.e map(), filter() etc)
            type Texpected_callback_items = getFinal_Texpected_callback_items<Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values>
            const expected_callback_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])

            describe(`PropsUndefined`, () => {
              const options = {
                props: undefined,
                symbol: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`PropsFalse`, () => {
              const options = {
                props: false,
                symbol: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`PropsUndefined`, () => {
              const options = {
                props: undefined,
                symbol: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`NoPropsSymbolFalseIgnored`, () => {
              const options = {
                symbol: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`NoPropsStringIgnored`, () => {
              const options = {
                symbol: true,
                string: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: false & all others default/dont matter`, () => {
              const options = {
                symbol: true,
                props: false,
                string: true,
                own: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
        })
        describe(`props: 'all' - for keys()/values() it returns "Nested Keys/Values" if IsInspectableNested, and requested props always. For loop() it goes over Nested Keys/Values if IsNestingObject & props always`, () => {
          // Test helpers, factoring out only what is changing: the props & props values
          // keys()
          type getFinal_Texpected_keys<TexpectedProps> = IfAnd<IsInspectableNested, Not<IfExtends<Tinput, AsyncGenerator>>, Texpected_nested_keys, never> | TexpectedProps
          const getFinal_expected_keys = (expectedProps) => [...(isInspectableNested && !isAsyncIterator(inputWithExtraCommonProps) ? expected_nested_keys : []), ...expectedProps]
          // values()
          type getFinal_Texpected_values<TexpectedProps_values> = IfAnd<IsInspectableNested, Not<IfExtends<Tinput, AsyncGenerator>>, Texpected_nested_items, never> | TexpectedProps_values
          const getFinal_expected_values = (expectedProps_values) => [...(isInspectableNested && !isAsyncIterator(inputWithExtraCommonProps) ? expected_nested_items : []), ...expectedProps_values]

          // Iteration keys & items/values i.e loop(), each() etc
          type getFinal_Texpected_iteration_keys<TexpectedProps> = If<IsSingleOrWeak<Tinput>, null, never> | Texpected_nested_keys | TexpectedProps
          const getFinal_expected_iteration_keys = (expectedProps) => [
            ...(isSingleOrWeak(inputWithExtraCommonProps) ? [null] : isNestingObject(inputWithExtraCommonProps) ? expected_nested_keys : []),
            ...expectedProps,
          ]
          type getFinal_Texpected_iteration_items<TexpectedProps_values> = If<IsSingleOrWeak<Tinput>, Tinput, never> | Texpected_nested_items | TexpectedProps_values
          const getFinal_expected_iteration_values = (expectedProps_values) => [
            ...(isSingleOrWeak(inputWithExtraCommonProps) ? [inputWithExtraCommonProps] : isNestingObject(inputWithExtraCommonProps) ? expected_nested_items : []),
            ...expectedProps_values,
          ]

          type getFinal_Texpected_callback_items<TexpectedProps_values> = If<IsSingleOrWeak<Tinput>, InsideValues<Tinput>, never> | Texpected_nested_items | TexpectedProps_values
          // @todo: make function follow the type above
          const getFinal_expected_callback_values = (expectedProps_values) => [...(isNestingObject(inputWithExtraCommonProps) ? expected_nested_items : []), ...expectedProps_values]

          describe(`props: 'all', own string props only`, () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_stringOwnProps>
            const expected_keys = getFinal_expected_keys([...expected_stringOwnProps])

            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_stringOwnProps_values>
            const expected_values = getFinal_expected_values([...expected_stringOwnProps_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = Texpected_iteration_keys
            const expected_callback_keys = expected_iteration_keys
            type Texpected_callback_items = getFinal_Texpected_callback_items<Texpected_stringOwnProps_values>
            const expected_callback_items = getFinal_expected_callback_values([...expected_stringOwnProps_values])

            describe(`props: 'all'`, () => {
              const options = { props: 'all' } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all', Symbol False Ignored`, () => {
              const options = { props: 'all', symbol: false } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all', String true Ignored`, () => {
              const options = { props: 'all', string: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all', & all others default/dont matter (inherited: true is useless, cause nonEnumerables is false)`, () => {
              const options = {
                props: 'all',
                string: true,
                symbol: false,
                own: true,
                inherited: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe(`props: 'all', & symbol: true - symbol & string own props`, () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_stringOwnProps | Texpected_symbolOwnProps>
            const expected_keys = getFinal_expected_keys([...expected_stringOwnProps, ...expected_symbolOwnProps])

            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values>
            const expected_values = getFinal_expected_values([...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps | Texpected_symbolOwnProps>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps, ...expected_symbolOwnProps])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = Texpected_iteration_keys
            const expected_callback_keys = expected_iteration_keys
            type Texpected_callback_items = getFinal_Texpected_callback_items<Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values>
            const expected_callback_items = getFinal_expected_callback_values([...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])

            describe(`props: 'all', symbol: true`, () => {
              const options = { props: 'all', symbol: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all', symbol: true, string: true`, () => {
              const options = {
                props: 'all',
                symbol: true,
                string: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe(`props: 'all', string: false & symbol: true - symbol own props only`, () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_symbolOwnProps>
            const expected_keys = getFinal_expected_keys([...expected_symbolOwnProps])

            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_symbolOwnProps_values>
            const expected_values = getFinal_expected_values([...expected_symbolOwnProps_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_symbolOwnProps>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_symbolOwnProps])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_symbolOwnProps_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_symbolOwnProps_values])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = Texpected_iteration_keys
            const expected_callback_keys = expected_iteration_keys
            type Texpected_callback_items = getFinal_Texpected_callback_items<Texpected_symbolOwnProps_values>
            const expected_callback_items = getFinal_expected_callback_values([...expected_symbolOwnProps_values])

            describe(`props: 'all', string: false, symbol: true`, () => {
              const options = {
                props: 'all',
                string: false,
                symbol: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: undefined, string: false, symbol: true`, () => {
              const options = {
                props: 'all',
                string: false,
                symbol: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe(`ONLY OWN: props: 'all' & nonEnumerables true, but inherited: false - returns no base props except own nonEnumerbales (eg 'length') + Common Props`, () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_stringOwnProps | Texpected_stringNonEnumerablesOwn>
            const expected_keys = getFinal_expected_keys([...expected_stringOwnProps, ...expected_stringNonEnumerablesOwn])

            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_stringOwnProps_values | Texpected_stringNonEnumerablesOwn_values>
            const expected_values = getFinal_expected_values([...expected_stringOwnProps_values, ...expected_stringNonEnumerablesOwn_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps | Texpected_stringNonEnumerablesOwn>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps, ...expected_stringNonEnumerablesOwn])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values | Texpected_stringNonEnumerablesOwn_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values, ...expected_stringNonEnumerablesOwn_values])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps>
            const expected_callback_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps])
            type Texpected_callback_items = getFinal_Texpected_callback_items<Texpected_stringOwnProps_values>
            const expected_callback_items = getFinal_expected_callback_values([...expected_stringOwnProps_values])

            describe(`props: 'all'`, () => {
              const options = {
                props: 'all',
                inherited: false,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all', string: true ignored`, () => {
              const options = {
                props: 'all',
                string: true,
                inherited: false,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all' & all others default/dont matter`, () => {
              const options = {
                props: 'all',
                string: true,
                symbol: false,
                own: true,
                inherited: false,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe(`props: 'all' & inherited & nonEnumerables true - all string props`, () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_stringOwnProps | Texpected_stringNonEnumerablesOwn | Texpected_stringNonEnumerablesInherited>
            const expected_keys = getFinal_expected_keys([...expected_stringOwnProps, ...expected_stringNonEnumerablesOwn, ...expected_stringNonEnumerablesInherited])

            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_stringOwnProps_values | Texpected_stringNonEnumerablesOwn_values | Texpected_stringNonEnumerablesInherited_values>
            const expected_values = getFinal_expected_values([...expected_stringOwnProps_values, ...expected_stringNonEnumerablesOwn_values, ...expected_stringNonEnumerablesInherited_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps | Texpected_stringNonEnumerablesOwn | Texpected_stringNonEnumerablesInherited>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps, ...expected_stringNonEnumerablesOwn, ...expected_stringNonEnumerablesInherited])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values | Texpected_stringNonEnumerablesInherited_values | Texpected_stringNonEnumerablesOwn_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values, ...expected_stringNonEnumerablesOwn_values, ...expected_stringNonEnumerablesInherited_values])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps>
            const expected_callback_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps])
            type Texpected_callback_items = getFinal_Texpected_callback_items<Texpected_stringOwnProps_values>
            const expected_callback_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values])

            describe(`props: 'all'`, () => {
              const options = {
                props: 'all',
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all', string: true ignored`, () => {
              const options = {
                props: 'all',
                string: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all' & all others default/dont matter`, () => {
              const options = {
                props: 'all',
                string: true,
                symbol: false,
                own: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe(`props: 'all' & symbol & inherited & nonEnumerables true - all symbol & string props (except top)`, () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<
              | Texpected_stringOwnProps
              | Texpected_stringNonEnumerablesOwn
              | Texpected_stringNonEnumerablesInherited
              | Texpected_symbolOwnProps
              | Texpected_symbolNonEnumerablesOwn
              | Texpected_symbolNonEnumerablesInherited
            >
            const expected_keys = getFinal_expected_keys([
              ...expected_stringOwnProps,
              ...expected_stringNonEnumerablesOwn,
              ...expected_stringNonEnumerablesInherited,
              ...expected_symbolOwnProps,
              ...expected_symbolNonEnumerablesOwn,
              ...expected_symbolNonEnumerablesInherited,
            ])
            // values()
            type Texpected_values = getFinal_Texpected_values<
              | Texpected_stringOwnProps_values
              | Texpected_stringNonEnumerablesOwn_values
              | Texpected_stringNonEnumerablesInherited_values
              | Texpected_symbolOwnProps_values
              | Texpected_symbolNonEnumerablesOwn_values
              | Texpected_symbolNonEnumerablesInherited_values
            >
            const expected_values = getFinal_expected_values([
              ...expected_stringOwnProps_values,
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
              ...expected_symbolOwnProps_values,
              ...expected_symbolNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesInherited_values,
            ])
            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<
              | Texpected_stringOwnProps
              | Texpected_stringNonEnumerablesOwn
              | Texpected_stringNonEnumerablesInherited
              | Texpected_symbolOwnProps
              | Texpected_symbolNonEnumerablesOwn
              | Texpected_symbolNonEnumerablesInherited
            >
            const expected_iteration_keys = getFinal_expected_iteration_keys([
              ...(isSingleOrWeak(inputWithExtraCommonProps) ? [null] : []),
              ...expected_stringOwnProps,
              ...expected_stringNonEnumerablesOwn,
              ...expected_stringNonEnumerablesInherited,
              ...expected_symbolOwnProps,
              ...expected_symbolNonEnumerablesOwn,
              ...expected_symbolNonEnumerablesInherited,
            ])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<
              | Texpected_stringOwnProps_values
              | Texpected_stringNonEnumerablesInherited_values
              | Texpected_stringNonEnumerablesOwn_values
              | Texpected_symbolOwnProps_values
              | Texpected_symbolNonEnumerablesInherited_values
              | Texpected_symbolNonEnumerablesOwn_values
            >
            const expected_iteration_items = getFinal_expected_iteration_values([
              ...(isSingleOrWeak(inputWithExtraCommonProps) ? [inputWithExtraCommonProps] : []),
              ...expected_stringOwnProps_values,
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
              ...expected_symbolOwnProps_values,
              ...expected_symbolNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesInherited_values,
            ])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps | Texpected_symbolOwnProps>
            const expected_callback_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps, ...expected_symbolOwnProps])
            type Texpected_callback_items = getFinal_Texpected_callback_items<Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values>
            const expected_callback_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])

            describe(`props: 'all'`, () => {
              const options = {
                props: 'all',
                symbol: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all', string: true (no matter)`, () => {
              const options = {
                props: 'all',
                symbol: true,
                string: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all' & all others default/dont matter`, () => {
              const options = {
                props: 'all',
                symbol: true,
                string: true,
                own: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe(`props: 'all' & symbol & top & inherited & nonEnumerables true - all symbol & string props (including top)`, () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<
              | Texpected_stringOwnProps
              | Texpected_stringNonEnumerablesOwn
              | Texpected_stringNonEnumerablesInherited
              | Texpected_stringNonEnumerablesInheritedTop
              | Texpected_symbolOwnProps
              | Texpected_symbolNonEnumerablesOwn
              | Texpected_symbolNonEnumerablesInherited
            >
            const expected_keys = getFinal_expected_keys([
              ...expected_stringOwnProps,
              ...expected_stringNonEnumerablesOwn,
              ...expected_stringNonEnumerablesInherited,
              ...expected_stringNonEnumerablesInheritedTop,
              ...expected_symbolOwnProps,
              ...expected_symbolNonEnumerablesOwn,
              ...expected_symbolNonEnumerablesInherited,
            ])
            // values()
            type Texpected_values = getFinal_Texpected_values<
              | Texpected_stringOwnProps_values
              | Texpected_stringNonEnumerablesOwn_values
              | Texpected_stringNonEnumerablesInherited_values
              | Texpected_stringNonEnumerablesInheritedTop_values
              | Texpected_symbolOwnProps_values
              | Texpected_symbolNonEnumerablesOwn_values
              | Texpected_symbolNonEnumerablesInherited_values
            >
            const expected_values = getFinal_expected_values([
              ...expected_stringOwnProps_values,
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
              ...expected_stringNonEnumerablesInheritedTop_values,
              ...expected_symbolOwnProps_values,
              ...expected_symbolNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesInherited_values,
            ])
            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<
              | Texpected_stringOwnProps
              | Texpected_stringNonEnumerablesOwn
              | Texpected_stringNonEnumerablesInherited
              | Texpected_stringNonEnumerablesInheritedTop
              | Texpected_symbolOwnProps
              | Texpected_symbolNonEnumerablesOwn
              | Texpected_symbolNonEnumerablesInherited
            >
            const expected_iteration_keys = getFinal_expected_iteration_keys([
              ...(isSingleOrWeak(inputWithExtraCommonProps) ? [null] : []),
              ...expected_stringOwnProps,
              ...expected_stringNonEnumerablesOwn,
              ...expected_stringNonEnumerablesInherited,
              ...expected_stringNonEnumerablesInheritedTop,
              ...expected_symbolOwnProps,
              ...expected_symbolNonEnumerablesOwn,
              ...expected_symbolNonEnumerablesInherited,
            ])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<
              | Texpected_stringOwnProps_values
              | Texpected_stringNonEnumerablesInherited_values
              | Texpected_stringNonEnumerablesInheritedTop_values
              | Texpected_stringNonEnumerablesOwn_values
              | Texpected_symbolOwnProps_values
              | Texpected_symbolNonEnumerablesInherited_values
              | Texpected_symbolNonEnumerablesOwn_values
            >
            const expected_iteration_items = getFinal_expected_iteration_values([
              ...(isSingleOrWeak(inputWithExtraCommonProps) ? [inputWithExtraCommonProps] : []),
              ...expected_stringOwnProps_values,
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
              ...expected_stringNonEnumerablesInheritedTop_values,
              ...expected_symbolOwnProps_values,
              ...expected_symbolNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesInherited_values,
            ])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps | Texpected_symbolOwnProps>
            const expected_callback_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps, ...expected_symbolOwnProps])
            type Texpected_callback_items = getFinal_Texpected_callback_items<Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values>
            const expected_callback_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])

            describe(`props: 'all'`, () => {
              const options = {
                props: 'all',
                top: true,
                symbol: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all', string: true (no matter)`, () => {
              const options = {
                props: 'all',
                top: true,
                symbol: true,
                string: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all' & all others default/dont matter`, () => {
              const options = {
                props: 'all',
                top: true,
                symbol: true,
                string: true,
                own: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe(`ONLY Inherited: props: 'all' but own: false, only inherited { own: false, symbols nonEnumerables inherited: true }. Returns all **but own** keys (string & symbol), including native inherited & non-enumerables props of input`, () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_stringNonEnumerablesInherited | Texpected_symbolNonEnumerablesInherited>
            const expected_keys = getFinal_expected_keys([...expected_stringNonEnumerablesInherited, ...expected_symbolNonEnumerablesInherited])
            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_stringNonEnumerablesInherited_values | Texpected_symbolNonEnumerablesInherited_values>
            const expected_values = getFinal_expected_values([...expected_stringNonEnumerablesInherited_values, ...expected_symbolNonEnumerablesInherited_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_stringNonEnumerablesInherited | Texpected_symbolNonEnumerablesInherited>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_stringNonEnumerablesInherited, ...expected_symbolNonEnumerablesInherited])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_stringNonEnumerablesInherited_values | Texpected_symbolNonEnumerablesInherited_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_stringNonEnumerablesInherited_values, ...expected_symbolNonEnumerablesInherited_values])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = getFinal_Texpected_iteration_keys<never>
            const expected_callback_keys = getFinal_expected_keys([])
            type Texpected_callback_items = getFinal_Texpected_callback_items<never>
            const expected_callback_items = getFinal_expected_values([])

            describe(`props: 'all'`, () => {
              const options = {
                props: 'all',
                own: false,
                symbol: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all', string: true (no matter)`, () => {
              const options = {
                props: 'all',
                own: false,
                symbol: true,
                string: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: 'all' & all others default/dont matter`, () => {
              const options = {
                props: 'all',
                own: false,
                symbol: true,
                string: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
        })
        //** Async END **//

        // props: true is always sync
        describe(`props: true - ignores "Nested Keys/Values" if IsInspectableNested/IsNestingObject, always goes over props/propsValues only`, () => {
          // These Test helpers are dummy, but kept anyway, so we can reuse props: false tests ;-)
          // keys()
          type getFinal_Texpected_keys<TexpectedProps> = TexpectedProps
          const getFinal_expected_keys = (expectedProps) => expectedProps
          // values()
          type getFinal_Texpected_values<TexpectedProps_values> = TexpectedProps_values
          const getFinal_expected_values = (expectedProps_values) => expectedProps_values

          // Iteration keys & items/values i.e loop(), each() etc
          type getFinal_Texpected_iteration_keys<TexpectedProps> = TexpectedProps
          const getFinal_expected_iteration_keys = (expectedProps) => expectedProps
          type getFinal_Texpected_iteration_items<TexpectedProps_values> = TexpectedProps_values
          const getFinal_expected_iteration_values = (expectedProps_values) => expectedProps_values

          type Tcount = number // always, even for singles, since we iterate on props

          describe('props: true, own string props only', () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_stringOwnProps>
            const expected_keys = getFinal_expected_keys([...expected_stringOwnProps])

            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_stringOwnProps_values>
            const expected_values = getFinal_expected_values([...expected_stringOwnProps_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = Texpected_iteration_keys
            const expected_callback_keys = expected_iteration_keys
            type Texpected_callback_items = Texpected_iteration_items
            const expected_callback_items = expected_iteration_items

            describe(`props: true`, () => {
              const options = { props: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: true, Symbol False Ignored`, () => {
              const options = { props: true, symbol: false } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: true, String true Ignored`, () => {
              const options = { props: true, string: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: true, & all others default/dont matter (inherited: true is useless, cause nonEnumerables is false)`, () => {
              const options = {
                props: true,
                string: true,
                symbol: false,
                own: true,
                inherited: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe('props: true, & symbol: true - symbol & string own props', () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_stringOwnProps | Texpected_symbolOwnProps>
            const expected_keys = getFinal_expected_keys([...expected_stringOwnProps, ...expected_symbolOwnProps])

            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values>
            const expected_values = getFinal_expected_values([...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps | Texpected_symbolOwnProps>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps, ...expected_symbolOwnProps])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = Texpected_iteration_keys
            const expected_callback_keys = expected_iteration_keys
            type Texpected_callback_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values>
            const expected_callback_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])

            describe(`props: true, symbol: true`, () => {
              const options = { props: true, symbol: true } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: true, symbol: true, string: true`, () => {
              const options = {
                props: true,
                symbol: true,
                string: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe('props: true, string: false & symbol: true - symbol own props only', () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_symbolOwnProps>
            const expected_keys = getFinal_expected_keys([...expected_symbolOwnProps])

            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_symbolOwnProps_values>
            const expected_values = getFinal_expected_values([...expected_symbolOwnProps_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_symbolOwnProps>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_symbolOwnProps])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_symbolOwnProps_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_symbolOwnProps_values])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = getFinal_Texpected_iteration_keys<Texpected_symbolOwnProps>
            const expected_callback_keys = getFinal_expected_iteration_keys([...expected_symbolOwnProps])
            type Texpected_callback_items = getFinal_Texpected_iteration_items<Texpected_symbolOwnProps_values>
            const expected_callback_items = getFinal_expected_iteration_values([...expected_symbolOwnProps_values])

            describe(`props: true, string: false, symbol: true`, () => {
              const options = {
                props: true,
                string: false,
                symbol: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: undefined, string: false, symbol: true`, () => {
              const options = {
                props: true,
                string: false,
                symbol: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe('ONLY OWN: props: true & nonEnumerables true, but inherited: false - returns no base props except own nonEnumerbales (eg `length`) + Common Props', () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_stringOwnProps | Texpected_stringNonEnumerablesOwn>
            const expected_keys = getFinal_expected_keys([...expected_stringOwnProps, ...expected_stringNonEnumerablesOwn])

            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_stringOwnProps_values | Texpected_stringNonEnumerablesOwn_values>
            const expected_values = getFinal_expected_values([...expected_stringOwnProps_values, ...expected_stringNonEnumerablesOwn_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps | Texpected_stringNonEnumerablesOwn>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps, ...expected_stringNonEnumerablesOwn])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values | Texpected_stringNonEnumerablesOwn_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values, ...expected_stringNonEnumerablesOwn_values])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps>
            const expected_callback_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps])
            type Texpected_callback_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values>
            const expected_callback_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values])

            describe(`props: true`, () => {
              const options = {
                props: true,
                inherited: false,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: true, string: true ignored`, () => {
              const options = {
                props: true,
                string: true,
                inherited: false,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: true & all others default/dont matter`, () => {
              const options = {
                props: true,
                string: true,
                symbol: false,
                own: true,
                inherited: false,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe('props: true & inherited & nonEnumerables true - all string props', () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_stringOwnProps | Texpected_stringNonEnumerablesOwn | Texpected_stringNonEnumerablesInherited>
            const expected_keys = getFinal_expected_keys([...expected_stringOwnProps, ...expected_stringNonEnumerablesOwn, ...expected_stringNonEnumerablesInherited])

            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_stringOwnProps_values | Texpected_stringNonEnumerablesOwn_values | Texpected_stringNonEnumerablesInherited_values>
            const expected_values = getFinal_expected_values([...expected_stringOwnProps_values, ...expected_stringNonEnumerablesOwn_values, ...expected_stringNonEnumerablesInherited_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps | Texpected_stringNonEnumerablesOwn | Texpected_stringNonEnumerablesInherited>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps, ...expected_stringNonEnumerablesOwn, ...expected_stringNonEnumerablesInherited])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values | Texpected_stringNonEnumerablesInherited_values | Texpected_stringNonEnumerablesOwn_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values, ...expected_stringNonEnumerablesOwn_values, ...expected_stringNonEnumerablesInherited_values])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps>
            const expected_callback_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps])
            type Texpected_callback_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values>
            const expected_callback_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values])

            describe(`props: true`, () => {
              const options = {
                props: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: true, string: true ignored`, () => {
              const options = {
                props: true,
                string: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: true & all others default/dont matter`, () => {
              const options = {
                props: true,
                string: true,
                symbol: false,
                own: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe('props: true & symbol & inherited & nonEnumerables true - all symbol & string props (except top)', () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<
              | Texpected_stringOwnProps
              | Texpected_stringNonEnumerablesOwn
              | Texpected_stringNonEnumerablesInherited
              | Texpected_symbolOwnProps
              | Texpected_symbolNonEnumerablesOwn
              | Texpected_symbolNonEnumerablesInherited
            >
            const expected_keys = getFinal_expected_keys([
              ...expected_stringOwnProps,
              ...expected_stringNonEnumerablesOwn,
              ...expected_stringNonEnumerablesInherited,
              ...expected_symbolOwnProps,
              ...expected_symbolNonEnumerablesOwn,
              ...expected_symbolNonEnumerablesInherited,
            ])
            // values()
            type Texpected_values = getFinal_Texpected_values<
              | Texpected_stringOwnProps_values
              | Texpected_stringNonEnumerablesOwn_values
              | Texpected_stringNonEnumerablesInherited_values
              | Texpected_symbolOwnProps_values
              | Texpected_symbolNonEnumerablesOwn_values
              | Texpected_symbolNonEnumerablesInherited_values
            >
            const expected_values = getFinal_expected_values([
              ...expected_stringOwnProps_values,
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
              ...expected_symbolOwnProps_values,
              ...expected_symbolNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesInherited_values,
            ])
            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<
              | Texpected_stringOwnProps
              | Texpected_stringNonEnumerablesOwn
              | Texpected_stringNonEnumerablesInherited
              | Texpected_symbolOwnProps
              | Texpected_symbolNonEnumerablesOwn
              | Texpected_symbolNonEnumerablesInherited
            >
            const expected_iteration_keys = getFinal_expected_iteration_keys([
              ...expected_stringOwnProps,
              ...expected_stringNonEnumerablesOwn,
              ...expected_stringNonEnumerablesInherited,
              ...expected_symbolOwnProps,
              ...expected_symbolNonEnumerablesOwn,
              ...expected_symbolNonEnumerablesInherited,
            ])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<
              | Texpected_stringOwnProps_values
              | Texpected_stringNonEnumerablesInherited_values
              | Texpected_stringNonEnumerablesOwn_values
              | Texpected_symbolOwnProps_values
              | Texpected_symbolNonEnumerablesInherited_values
              | Texpected_symbolNonEnumerablesOwn_values
            >
            const expected_iteration_items = getFinal_expected_iteration_values([
              ...expected_stringOwnProps_values,
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
              ...expected_symbolOwnProps_values,
              ...expected_symbolNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesInherited_values,
            ])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps | Texpected_symbolOwnProps>
            const expected_callback_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps, ...expected_symbolOwnProps])
            type Texpected_callback_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values>
            const expected_callback_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])

            describe(`props: true`, () => {
              const options = {
                props: true,
                symbol: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: true, string: true (no matter)`, () => {
              const options = {
                props: true,
                symbol: true,
                string: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: true & all others default/dont matter`, () => {
              const options = {
                props: true,
                symbol: true,
                string: true,
                own: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe('props: true & symbol & top & inherited & nonEnumerables true - all symbol & string props (including top)', () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<
              | Texpected_stringOwnProps
              | Texpected_stringNonEnumerablesOwn
              | Texpected_stringNonEnumerablesInherited
              | Texpected_stringNonEnumerablesInheritedTop
              | Texpected_symbolOwnProps
              | Texpected_symbolNonEnumerablesOwn
              | Texpected_symbolNonEnumerablesInherited
            >
            const expected_keys = getFinal_expected_keys([
              ...expected_stringOwnProps,
              ...expected_stringNonEnumerablesOwn,
              ...expected_stringNonEnumerablesInherited,
              ...expected_stringNonEnumerablesInheritedTop,
              ...expected_symbolOwnProps,
              ...expected_symbolNonEnumerablesOwn,
              ...expected_symbolNonEnumerablesInherited,
            ])
            // values()
            type Texpected_values = getFinal_Texpected_values<
              | Texpected_stringOwnProps_values
              | Texpected_stringNonEnumerablesOwn_values
              | Texpected_stringNonEnumerablesInherited_values
              | Texpected_stringNonEnumerablesInheritedTop_values
              | Texpected_symbolOwnProps_values
              | Texpected_symbolNonEnumerablesOwn_values
              | Texpected_symbolNonEnumerablesInherited_values
            >
            const expected_values = getFinal_expected_values([
              ...expected_stringOwnProps_values,
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
              ...expected_stringNonEnumerablesInheritedTop_values,
              ...expected_symbolOwnProps_values,
              ...expected_symbolNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesInherited_values,
            ])
            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<
              | Texpected_stringOwnProps
              | Texpected_stringNonEnumerablesOwn
              | Texpected_stringNonEnumerablesInherited
              | Texpected_stringNonEnumerablesInheritedTop
              | Texpected_symbolOwnProps
              | Texpected_symbolNonEnumerablesOwn
              | Texpected_symbolNonEnumerablesInherited
            >
            const expected_iteration_keys = getFinal_expected_iteration_keys([
              ...expected_stringOwnProps,
              ...expected_stringNonEnumerablesOwn,
              ...expected_stringNonEnumerablesInherited,
              ...expected_stringNonEnumerablesInheritedTop,
              ...expected_symbolOwnProps,
              ...expected_symbolNonEnumerablesOwn,
              ...expected_symbolNonEnumerablesInherited,
            ])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<
              | Texpected_stringOwnProps_values
              | Texpected_stringNonEnumerablesInherited_values
              | Texpected_stringNonEnumerablesInheritedTop_values
              | Texpected_stringNonEnumerablesOwn_values
              | Texpected_symbolOwnProps_values
              | Texpected_symbolNonEnumerablesInherited_values
              | Texpected_symbolNonEnumerablesOwn_values
            >
            const expected_iteration_items = getFinal_expected_iteration_values([
              ...expected_stringOwnProps_values,
              ...expected_stringNonEnumerablesOwn_values,
              ...expected_stringNonEnumerablesInherited_values,
              ...expected_stringNonEnumerablesInheritedTop_values,
              ...expected_symbolOwnProps_values,
              ...expected_symbolNonEnumerablesOwn_values,
              ...expected_symbolNonEnumerablesInherited_values,
            ])

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = getFinal_Texpected_iteration_keys<Texpected_stringOwnProps | Texpected_symbolOwnProps>
            const expected_callback_keys = getFinal_expected_iteration_keys([...expected_stringOwnProps, ...expected_symbolOwnProps])
            type Texpected_callback_items = getFinal_Texpected_iteration_items<Texpected_stringOwnProps_values | Texpected_symbolOwnProps_values>
            const expected_callback_items = getFinal_expected_iteration_values([...expected_stringOwnProps_values, ...expected_symbolOwnProps_values])

            describe(`props: true`, () => {
              const options = {
                props: true,
                top: true,
                symbol: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: true, string: true (no matter)`, () => {
              const options = {
                props: true,
                top: true,
                symbol: true,
                string: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: true & all others default/dont matter`, () => {
              const options = {
                props: true,
                top: true,
                symbol: true,
                string: true,
                own: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe(`ONLY Inherited: props: true but own: false, only inherited { own: false, symbols nonEnumerables inherited: true }. Returns all **but own** keys (string & symbol), including native inherited & non-enumerables props of input`, () => {
            // keys()
            type Texpected_keys = getFinal_Texpected_keys<Texpected_stringNonEnumerablesInherited | Texpected_symbolNonEnumerablesInherited>
            const expected_keys = getFinal_expected_keys([...expected_stringNonEnumerablesInherited, ...expected_symbolNonEnumerablesInherited])
            // values()
            type Texpected_values = getFinal_Texpected_values<Texpected_stringNonEnumerablesInherited_values | Texpected_symbolNonEnumerablesInherited_values>
            const expected_values = getFinal_expected_values([...expected_stringNonEnumerablesInherited_values, ...expected_symbolNonEnumerablesInherited_values])

            // Iteration keys & items/values i.e loop(), each() etc
            type Texpected_iteration_keys = getFinal_Texpected_iteration_keys<Texpected_stringNonEnumerablesInherited | Texpected_symbolNonEnumerablesInherited>
            const expected_iteration_keys = getFinal_expected_iteration_keys([...expected_stringNonEnumerablesInherited, ...expected_symbolNonEnumerablesInherited])
            type Texpected_iteration_items = getFinal_Texpected_iteration_items<Texpected_stringNonEnumerablesInherited_values | Texpected_symbolNonEnumerablesInherited_values>
            const expected_iteration_items = getFinal_expected_iteration_values([...expected_stringNonEnumerablesInherited_values, ...expected_symbolNonEnumerablesInherited_values])

            // Callback keys / values (i.e map(), filter() etc), cause of own: false
            type Texpected_callback_keys = never
            const expected_callback_keys = []
            type Texpected_callback_items = never
            const expected_callback_items = []

            describe(`props: true`, () => {
              const options = {
                props: true,
                own: false,
                symbol: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: true, string: true (no matter)`, () => {
              const options = {
                props: true,
                own: false,
                symbol: true,
                string: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props: true & all others default/dont matter`, () => {
              const options = {
                props: true,
                own: false,
                symbol: true,
                string: true,
                inherited: true,
                nonEnumerables: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
          describe(`props: true - expecting never[]`, () => {
            type Texpected_keys = never
            type Texpected_values = never
            const expected_keys = []
            const expected_values = []
            type Texpected_iteration_items = never
            type Texpected_iteration_keys = never
            const expected_iteration_keys = []
            const expected_iteration_items = []

            // Callback keys / values (i.e map(), filter() etc)
            type Texpected_callback_keys = Texpected_iteration_keys
            const expected_callback_keys = expected_iteration_keys
            type Texpected_callback_items = Texpected_iteration_items
            const expected_callback_items = expected_iteration_items

            type Tcount = number

            describe(`props:true but string: false, symbol: undefined - returns never[]`, () => {
              const options = {
                props: true,
                string: false,
                // symbol: false, // default
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`props:true but string: false, symbol: false - returns never[]`, () => {
              const options = {
                props: true,
                string: false,
                symbol: false, // explicit
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
            describe(`Empty never[] array: NOT own, only inherited { own: false, symbols nonEnumerables: false, inherited: true }. Returns empty array, because non-own are non-enumerables & non-enumerables: false!`, () => {
              const options = {
                own: false,
                props: true,
                symbol: true,
                nonEnumerables: false,
                inherited: true,
              } as const
              /*{ @expecting-defaults-or-overridden }*/
            })
          })
        })
      })
      /*{ all-typings-tests-WECP END }*/

      // Master/Source - it's OK to reside in generated files once!
      /*{ all-typings-tests-options-wrong  BEGIN }*/
      it('# Options Wrong: extra unknown keys are accepted, wrong value types are not', () => {
        const anyValueWrongOptions2 = values(inputVanilla, {
          props: false,
          WRONG_OPTIONS: true,
        })

        // @ts-expect-error OK
        const anyValueWrongOptions1 = values(inputVanilla, { WRONG_OPTIONS: true })

        // @ts-expect-error OK
        const anyValueWrongOptions3 = values(inputVanilla, { props: 'WRONG_VALUE' })
      })
      /*{ all-typings-tests-options-wrong END }*/
    })
  })
})
