// @-ts-nocheck
import { expectType, TypeEqual } from 'ts-expect'
import { ValueOf } from 'type-fest'
import {
  a_Employee,
  Employee,
  get_Generator_of_Tvalues,
  get_Generator_of_Tvalues_withCommonProps,
  get_Map_of_TMapKeys_Tvalues_WithCommonProps,
  get_Set_of_Tvalues_withCommonProps,
  Person,
  pojsoCommonProps,
  symbolProp2,
  TcommonStringProps,
  TcommonStringProps_values,
  TcommonSymbolProps,
  TcommonSymbolProps_values,
  TGeneratorWithCommonProps,
  TmyGenerator,
  Tvalues,
} from '../../../test-utils/test-data'

import { loop } from './loop-legacy'
import { AsyncIteratorOrGenerator, DataViewType, ILoopOptions, MapIteratorEntries, SetIteratorEntries } from '../../../code'

const emptyTypedIloopOptions: ILoopOptions<any, any, any> = {}

describe(`Loop Typings tests`, () => {
  it(`Loop Typings tests`, async () => {
    // ### Options & wrong options ###

    // @ts-expect-error
    loop({}, { WRONG_OPTION: true })
    // @ts-expect-error
    loop({}, { props: true, WRONG_OPTION: true })

    // ######## Single Values ########

    // ### Primitives ###

    // ### undefined ###

    const undefinedLoop = loop(undefined)
    type TundefinedLoop = Generator<[undefined, null, 1]>
    expectType<TypeEqual<typeof undefinedLoop, TundefinedLoop>>(true)

    // instead, this works
    expectType<TypeEqual<typeof undefinedLoop, Generator<[undefined, null, 1]>>>(true)

    expectType<Generator<[undefined, null, 1]>>(undefinedLoop)
    for (const [item, key, count] of undefinedLoop) {
      expectType<undefined>(item)
      expectType<void>(item)
      // expectType<TypeEqual<typeof val, undefined>>(true) // why fails?
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }
    // @ts-expect-error: Type undefined is not assignable to type number
    expectType<Generator<[number, null, 1]>>(undefinedLoop)

    // ### null ###

    const nullLoop = loop(null)
    type TnullLoop = Generator<[null, null, 1]>
    expectType<TypeEqual<typeof nullLoop, TnullLoop>>(true)
    // instead, this works
    expectType<TypeEqual<typeof nullLoop, Generator<[null, null, 1]>>>(true)

    for (const [item, key, count] of nullLoop) {
      expectType<null>(item)

      // expectType<TypeEqual<typeof val, null>>(true) // why fails?
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // @ts-expect-error: type null is not assignable to type number
    expectType<Generator<[number, null, number]>>(nullLoop)

    // ### A void with map callback & mapReturn type change

    const undefinedLoop_map = loop(undefined, {
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, undefined>>(true)
        expectType<TypeEqual<typeof idxOrKey, null>>(true)
        expectType<TypeEqual<typeof value, undefined>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    const undefinedLoop_map_fewer_args = loop(undefined, {
      map: (item): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, undefined>>(true)
        return NEW_TYPE
      },
    })

    type TundefinedLoop_map = Generator<[T_NEW_TYPE, null, 1]>
    expectType<TypeEqual<typeof undefinedLoop_map, TundefinedLoop_map>>(true)
    for (const [item, idxKey, count] of undefinedLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Number ###

    const numberLoop = loop(123)
    type TnumberLoop = Generator<[123, null, 1]>
    expectType<TypeEqual<typeof numberLoop, TnumberLoop>>(true)
    expectType<Generator<[number, null, number]>>(numberLoop)
    for (const [item, key, count] of numberLoop) {
      expectType<TypeEqual<typeof item, 123>>(true)
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### bigint ###

    const bigIntLoop = loop(456n)
    type TbigIntLoop = Generator<[456n, null, 1]>
    expectType<TypeEqual<typeof bigIntLoop, TbigIntLoop>>(true)
    expectType<Generator<[bigint | 456n, null, number]>>(bigIntLoop)
    for (const [item, key, count] of bigIntLoop) {
      expectType<TypeEqual<typeof item, 456n>>(true)
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // @ts-expect-error: Type bigint is not assignable to type number
    expectType<Generator<[number, null, 1]>>(bigIntLoop)

    // ### bigint with map callback & mapReturn type change, to a number ###
    const bigIntLoop_map = loop(456n, {
      map: (item, idxOrKey, value, count): 123 => {
        expectType<TypeEqual<typeof item, 456n>>(true)
        expectType<TypeEqual<typeof idxOrKey, null>>(true)
        expectType<TypeEqual<typeof value, 456n>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return 123
      },
    })

    type TbigIntLoop_map = Generator<[123, null, 1]>
    expectType<TypeEqual<typeof bigIntLoop_map, TbigIntLoop_map>>(true)
    for (const [item, idxKey, count] of bigIntLoop_map) {
      expectType<TypeEqual<typeof item, 123>>(true)
      expectType<TypeEqual<typeof idxKey, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### string ###

    const stringLoop = loop('foobar')
    type TstringLoop = Generator<['foobar', null, 1]>
    expectType<TypeEqual<typeof stringLoop, TstringLoop>>(true)
    expectType<Generator<[string, null, number]>>(stringLoop)
    for (const [item, key, count] of stringLoop) {
      expectType<TypeEqual<typeof item, 'foobar'>>(true)
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    expectType<Generator<[String, null, number]>>(stringLoop) // ts is not bothered by String VS string, should we?

    // ### boolean ###

    const booleanLoop = loop(true)
    type TbooleanLoop = Generator<[true, null, 1]>
    expectType<TypeEqual<typeof booleanLoop, TbooleanLoop>>(true)
    expectType<Generator<[boolean, null, number]>>(booleanLoop)
    for (const [item, key, count] of booleanLoop) {
      expectType<TypeEqual<typeof item, true>>(true)
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // @ts-expect-error: Type boolean is not assignable to type string
    expectType<Generator<[string, null, number]>>(booleanLoop)

    // ### isSingle Primitive value with map callback & mapReturn type change

    const booleanLoop_map = loop(true, {
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, true>>(true)
        expectType<TypeEqual<typeof idxOrKey, null>>(true)
        expectType<TypeEqual<typeof value, true>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TbooleanLoop_map = Generator<[T_NEW_TYPE, null, 1]>
    expectType<TypeEqual<typeof booleanLoop_map, TbooleanLoop_map>>(true)
    for (const [item, idxKey, count] of booleanLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Symbol ###

    // const aSymbol: unique symbol = Symbol.for('aSymbol') // not working without unique symbol - how do we define it?
    const aUniqueSymbolLoop = loop(Symbol.iterator)
    type TaUniqueSymbolLoop = Generator<[typeof Symbol.iterator, null, 1]>
    expectType<TypeEqual<typeof aUniqueSymbolLoop, TaUniqueSymbolLoop>>(true)

    expectType<Generator<[symbol | typeof Symbol.iterator, null, number]>>(loop(Symbol.iterator))
    for (const [item, key, count] of aUniqueSymbolLoop) {
      expectType<TypeEqual<typeof item, symbol>>(true)
      // @ts-expect-error: TS1335: 'unique symbol' types are not allowed here.
      expectType<unique symbol>(item) // not supported
      // expectType<typeof Symbol.iterator>(item) // breaks - ignore for now
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    type TsymbolLoop = Generator<[string, null, number]>
    // @ts-expect-error: Type typeof Symbol.iterator is not assignable to type string
    expectType<TsymbolLoop>(aUniqueSymbolLoop)

    const simpleSymbolLoop = loop(Symbol('aSymbol'))
    // @ts-expect-error: Type symbol is not assignable to type string
    expectType<Generator<[string, null, 1]>>(simpleSymbolLoop)

    // @todo: is this a bug, or a feature? @-ts-expect-error: Type symbol is not assignable to type string
    expectType<Generator<[boolean, null, 1]>>(loop(Symbol('anotherSymbol')))

    // ### Remaining isSingle Values ###

    // ### RegExp ###

    const aRegExp = /foobar/
    const regExpLoop = loop(aRegExp)
    type TregExpLoop = Generator<[RegExp, null, 1]>
    expectType<TypeEqual<typeof regExpLoop, TregExpLoop>>(true)
    for (const [item, key, count] of regExpLoop) {
      expectType<TypeEqual<typeof item, RegExp>>(true)
      // @ts-ignore
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }
    // @ts-expect-error: Type RegExp is not assignable to type string
    expectType<Generator<[string, null, number]>>(regExpLoop)

    // ### RegExp with map callback & mapReturn type change ###

    const regExpLoop_map = loop(aRegExp, {
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, RegExp>>(true)
        expectType<TypeEqual<typeof idxOrKey, null>>(true)
        expectType<TypeEqual<typeof value, RegExp>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TregExpLoop_map = Generator<[T_NEW_TYPE, null, 1]>
    expectType<TypeEqual<typeof regExpLoop_map, TregExpLoop_map>>(true)
    for (const [item, idxKey, count] of regExpLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### NaN ###

    const nanLoop = loop(NaN)
    type TnanLoop = Generator<[typeof NaN, null, 1]>
    expectType<TypeEqual<typeof nanLoop, TnanLoop>>(true)
    for (const [item, key, count] of nanLoop) {
      expectType<number>(item) // NaN is a number type ;-(
      expectType<TypeEqual<typeof item, typeof NaN>>(true)
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Date, as single ###

    const dateLoop = loop(new Date())
    type TdateLoop = Generator<[Date, null, 1]>
    expectType<TypeEqual<typeof dateLoop, TdateLoop>>(true)
    for (const [item, key, count] of dateLoop) {
      expectType<TypeEqual<typeof item, Date>>(true)
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Boxed Primitives ###

    // ### Boxed Boolean, as isSingle  ###

    const boxedBooleanLoop = loop(new Boolean(false))
    type TboxedBooleanLoop = Generator<[Boolean, null, 1]>
    expectType<TypeEqual<typeof boxedBooleanLoop, TboxedBooleanLoop>>(true)
    for (const [item, key, count] of boxedBooleanLoop) {
      expectType<TypeEqual<typeof item, Boolean>>(true)
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Boxed Number, as isSingle  ###
    const boxedNumberLoop = loop(new Number(123))
    type TboxedNumberLoop = Generator<[Number, null, 1]>
    expectType<TypeEqual<typeof boxedNumberLoop, TboxedNumberLoop>>(true)
    for (const [item, key, count] of boxedNumberLoop) {
      expectType<TypeEqual<typeof item, Number>>(true)
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Boxed String, as isSingle  ###

    const boxedStringLoop = loop(new String('foobar'))
    type TboxedStringLoop = Generator<[String, null, 1]>
    expectType<TypeEqual<typeof boxedStringLoop, TboxedStringLoop>>(true)
    for (const [item, key, count] of boxedStringLoop) {
      expectType<TypeEqual<typeof item, String>>(true)
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Promise, as isSingle value ###
    const aPromise = Promise.resolve('a string')
    const promiseLoop = loop(aPromise)
    type TpromiseLoop = Generator<[Promise<string>, null, 1]>
    expectType<TypeEqual<typeof promiseLoop, TpromiseLoop>>(true)
    for (const [item, key, count] of promiseLoop) {
      expectType<TypeEqual<typeof item, Promise<string>>>(true)
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Promise, as isSingle value with map callback & mapReturn type change ###
    const promiseLoop_map = loop(aPromise, {
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, Promise<string>>>(true)
        expectType<TypeEqual<typeof idxOrKey, null>>(true)
        expectType<TypeEqual<typeof value, Promise<string>>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TpromiseLoop_map = Generator<[T_NEW_TYPE, null, 1]>
    expectType<TypeEqual<typeof promiseLoop_map, TpromiseLoop_map>>(true)
    for (const [item, idxKey, count] of promiseLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Promise with props ###

    // @todo: exclude Promise props
    // const myPromiseWithProps = addCommonProps(Promise.resolve('a string'))
    //
    // const myPromiseLoop = loop(myPromiseWithProps, { props: true })
    // type TmyPromiseLoop = Generator<
    //   [TcommonStringValues, TcommonStringProps, number]
    // >
    // expectType<TypeEqual<typeof myPromiseLoop, TmyPromiseLoop>>(true)

    interface IMyPromiseProps<T> extends Promise<T> {
      k: string
      l: boolean
      m: RegExp
    }

    const myPromise: IMyPromiseProps<string> = Promise.resolve('a string') as IMyPromiseProps<string>

    const myPromiseLoop = loop(myPromise, { props: true })
    type TmyPromiseLoop = Generator<[ValueOf<IMyPromiseProps<string>>, keyof IMyPromiseProps<string>, number]>
    expectType<TypeEqual<typeof myPromiseLoop, TmyPromiseLoop>>(true)

    for (const [item, idxKey, count] of myPromiseLoop) {
      expectType<TypeEqual<typeof item, ValueOf<IMyPromiseProps<string>>>>(true)
      expectType<TypeEqual<typeof idxKey, keyof IMyPromiseProps<string>>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Error, as isSingle value ###

    const anError = new Error('a string')
    const errorLoop = loop(anError)
    type TerrorLoop = Generator<[Error, null, 1]>
    expectType<TypeEqual<typeof errorLoop, TerrorLoop>>(true)
    for (const [item, key, count] of errorLoop) {
      expectType<TypeEqual<typeof item, Error>>(true)
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Error, as isSingle value with map callback & mapReturn type change ###

    const errorLoop_map = loop(anError, {
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, Error>>(true)
        expectType<TypeEqual<typeof idxOrKey, null>>(true)
        expectType<TypeEqual<typeof value, Error>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TerrorLoop_map = Generator<[T_NEW_TYPE, null, 1]>
    expectType<TypeEqual<typeof errorLoop_map, TerrorLoop_map>>(true)
    for (const [item, idxKey, count] of errorLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Error, as PropBag ###

    interface IMyErrorProps extends Error {
      k: string
      l: boolean
      m: RegExp
    }

    const myError: IMyErrorProps = new Error('a string') as IMyErrorProps

    const myErrorLoop = loop(myError, { props: true })
    type TmyErrorLoop = Generator<[ValueOf<IMyErrorProps>, keyof IMyErrorProps, number]>
    expectType<TypeEqual<typeof myErrorLoop, TmyErrorLoop>>(true)

    for (const [item, idxKey, count] of myErrorLoop) {
      expectType<TypeEqual<typeof item, ValueOf<IMyErrorProps>>>(true)
      expectType<TypeEqual<typeof idxKey, keyof IMyErrorProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### DataView as a single value ###

    const aDataView = new DataView(new ArrayBuffer(8))
    const dataViewLoop = loop(aDataView)

    type TdataViewLoop = Generator<[DataView, null, 1]>
    expectType<TypeEqual<typeof dataViewLoop, TdataViewLoop>>(true)
    for (const [item, key, count] of dataViewLoop) {
      expectType<TypeEqual<typeof item, DataView>>(true)
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### DataView, as as PropBag ###

    interface IMyDataViewProps extends DataView {
      k: string
      l: boolean
      m: RegExp
    }

    const myDataView: IMyDataViewProps = new DataView(new ArrayBuffer(8)) as IMyDataViewProps

    const myDataViewLoop = loop(myDataView, { props: true })
    type TmyDataViewLoop = Generator<[ValueOf<IMyDataViewProps>, keyof IMyDataViewProps, number]>
    expectType<TypeEqual<typeof myDataViewLoop, TmyDataViewLoop>>(true)

    // ### WeakMap as single value

    const aWeakMap = new WeakMap()
    const weakMapLoop = loop(aWeakMap)
    type TweakMapLoop = Generator<[WeakMap<WeakKey, any>, null, 1]>
    expectType<TypeEqual<typeof weakMapLoop, TweakMapLoop>>(true)

    // ### WeakSet as single value

    const aWeakSet = new WeakSet()
    const weakSetLoop = loop(aWeakSet)
    type TweakSetLoop = Generator<[WeakSet<WeakKey>, null, 1]>
    expectType<TypeEqual<typeof weakSetLoop, TweakSetLoop>>(true)

    // ### Function as isSingle value (default) ###

    const functionReturnType = 'function return type'
    type TfunctionReturnType = typeof functionReturnType
    const aFunction = (...args): TfunctionReturnType => functionReturnType
    type TaFunction = (...args) => TfunctionReturnType
    expectType<TypeEqual<typeof aFunction, TaFunction>>(true)

    const functionLoop = loop(aFunction)
    type TfunctionLoop = Generator<[TaFunction, null, 1]>
    expectType<TypeEqual<typeof functionLoop, TfunctionLoop>>(true)

    for (const [item, key, count] of functionLoop) {
      expectType<TypeEqual<typeof item, TaFunction>>(true)
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Function as isSingle value (default)
    // with map callback & mapReturn type change ###

    const functionLoop_map = loop(aFunction, {
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TaFunction>>(true)
        expectType<TypeEqual<typeof idxOrKey, null>>(true)
        expectType<TypeEqual<typeof value, TaFunction>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TfunctionLoop_map = Generator<[T_NEW_TYPE, null, 1]>
    expectType<TypeEqual<typeof functionLoop_map, TfunctionLoop_map>>(true)
    for (const [item, idxKey, count] of functionLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, null>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Function as isSingle value (default)
    // with mapKeys callback & mapKeysReturn type change ###

    const functionLoop_mapKeys = loop(aFunction, {
      mapKeys: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TaFunction>>(true)
        expectType<TypeEqual<typeof idxOrKey, null>>(true)
        expectType<TypeEqual<typeof value, TaFunction>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TfunctionLoop_mapKeys = Generator<[TaFunction, T_NEW_TYPE,1]>
    expectType<TypeEqual<typeof functionLoop_mapKeys, TfunctionLoop_mapKeys>>(true)
    for (const [item, idxKey, count] of functionLoop_mapKeys) {
      expectType<TypeEqual<typeof item, TaFunction>>(true)
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Function as a PropBag, with props: true ###

    interface MyFunctionWithProps {
      g: string
      h: bigint
      (): TfunctionReturnType
    }
    type TMyFunctionWithPropsItems = string | bigint
    type TMyFunctionWithPropsKeys = 'g' | 'h'

    let functionWithProps: MyFunctionWithProps = (() => functionReturnType) as MyFunctionWithProps
    expectType<TypeEqual<typeof functionWithProps, MyFunctionWithProps>>(true)
    const functionWithPropsLoop = loop(functionWithProps, {
      props: true,
    })

    type TfunctionWithPropsLoop = Generator<[TMyFunctionWithPropsItems, TMyFunctionWithPropsKeys, number]>
    expectType<TypeEqual<typeof functionWithPropsLoop, TfunctionWithPropsLoop>>(true)

    for (const [item, idxKey, count] of functionWithPropsLoop) {
      expectType<TypeEqual<typeof item, TMyFunctionWithPropsItems>>(true)
      expectType<TypeEqual<typeof idxKey, TMyFunctionWithPropsKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Function as a PropBag, with props: true
    // with map callback & mapReturn type change ###

    const functionWithPropsLoop_map = loop(functionWithProps, {
      props: true,
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TMyFunctionWithPropsItems>>(true)
        expectType<TypeEqual<typeof idxOrKey, TMyFunctionWithPropsKeys>>(true)
        expectType<TypeEqual<typeof value, MyFunctionWithProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TfunctionWithPropsLoop_map = Generator<[T_NEW_TYPE, TMyFunctionWithPropsKeys, number]>
    expectType<TypeEqual<typeof functionWithPropsLoop_map, TfunctionWithPropsLoop_map>>(true)
    for (const [item, idxKey, count] of functionWithPropsLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, TMyFunctionWithPropsKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Function as a PropBag, with props: true
    // with mapKeys callback & mapKeysReturn type change ###

    const functionWithPropsLoop_mapKeys = loop(functionWithProps, {
      props: true,
      mapKeys: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TMyFunctionWithPropsItems>>(true)
        expectType<TypeEqual<typeof idxOrKey, TMyFunctionWithPropsKeys>>(true)
        expectType<TypeEqual<typeof value, MyFunctionWithProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TfunctionWithPropsLoop_mapKeys = Generator<[TMyFunctionWithPropsItems, T_NEW_TYPE,number]>
    expectType<TypeEqual<typeof functionWithPropsLoop_mapKeys, TfunctionWithPropsLoop_mapKeys>>(true)

    for (const [item, idxKey, count] of functionWithPropsLoop_mapKeys) {
      expectType<TypeEqual<typeof item, TMyFunctionWithPropsItems>>(true)
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ######## Many / Compound / Collection Values ########

    // ### Array ###

    // Normal numeric indexes & values, no props

    type Tarray123Items = 1 | 2 | 3
    type Tarray123Loop = Generator<[Tarray123Items, number, number]>

    // DONE: transferred to all-Many-INV-Array-typings-spec.ts`
    const array123Loop = loop([1, 2, 3] as const)
    expectType<TypeEqual<typeof array123Loop, Tarray123Loop>>(true)

    // DONE: transferred to all-Many-INV-Array-typings-spec.ts`
    const array123LoopEmptyOptions = loop([1, 2, 3] as const, {})
    expectType<TypeEqual<typeof array123LoopEmptyOptions, Tarray123Loop>>(true)

    // @todo: transfer
    const array123LoopEmptyTypedOptions = loop([1, 2, 3] as const, emptyTypedIloopOptions)
    expectType<TypeEqual<typeof array123LoopEmptyTypedOptions, Generator<[any, any, number], any, unknown>>>(true)

    type TarrayABCitems = 'a' | 'b' | 'c'
    type TarrayABCLoop = Generator<[TarrayABCitems, number, number]>

    // @todo: delete not needed
    const arrayABCLoop = loop(['a', 'b', 'c'] as const)
    expectType<TypeEqual<typeof arrayABCLoop, TarrayABCLoop>>(true)

    // @todo: delete not needed
    for (const [item, idxKey, count] of arrayABCLoop) {
      expectType<TypeEqual<typeof item, TarrayABCitems>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // @todo: delete not needed
    const arrayMixedLoop = loop([true, 'a string', 3] as const)
    type TarrayMixedItems = true | 'a string' | 3
    type TarrayMixedLoop = Generator<[TarrayMixedItems, number, number]>
    expectType<TypeEqual<typeof arrayMixedLoop, TarrayMixedLoop>>(true)
    for (const [item, idxKey, count] of arrayMixedLoop) {
      expectType<TypeEqual<typeof item, TarrayMixedItems>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // DONE: transferred to all-Many-INV-Array-typings-spec.ts`
    const arrayLoopMapTypeChange = loop([1, 2, 3] as const, {
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, Tarray123Items>>(true)
        expectType<TypeEqual<typeof idxOrKey, number>>(true)
        expectType<TypeEqual<typeof value, Tarray123Items[]>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    // DONE: transferred to all-Many-INV-Array-typings-spec.ts`
    type TarrayLoopMapTypeChange = Generator<[T_NEW_TYPE, number, number]>

    // DONE: transferred to all-Many-INV-Array-typings-spec.ts`
    expectType<TypeEqual<typeof arrayLoopMapTypeChange, TarrayLoopMapTypeChange>>(true)
    for (const [item, idxKey, count] of arrayLoopMapTypeChange) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // Array with props: true

    interface MyArrayWithProps extends Array<bigint> {
      e: 'a string'
      f: true
      g: RegExp
    }
    type TMyArrayWithPropsKeys = 'e' | 'f' | 'g'
    type TMyArrayWithPropsItems = 'a string' | true | RegExp

    let arrayWithProps: MyArrayWithProps = [1n, 2n, 3n] as MyArrayWithProps
    const arrayPropsLoop = loop(arrayWithProps, {
      props: true,
    })

    type TarrayPropsIterator = Generator<[TMyArrayWithPropsItems, TMyArrayWithPropsKeys, number]>
    expectType<TypeEqual<typeof arrayPropsLoop, TarrayPropsIterator>>(true)

    for (const [item, idxKey, count] of arrayPropsLoop) {
      expectType<TypeEqual<typeof item, TMyArrayWithPropsItems>>(true)
      expectType<TypeEqual<typeof idxKey, TMyArrayWithPropsKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // Array props with map & mapReturn type change

    const arrayPropsLoopMapTypeChange = loop(arrayWithProps, {
      props: true,
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TMyArrayWithPropsItems>>(true)
        expectType<TypeEqual<typeof idxOrKey, TMyArrayWithPropsKeys>>(true)
        expectType<TypeEqual<typeof value, MyArrayWithProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TarrayPropsLoopMapTypeChange = Generator<[T_NEW_TYPE, TMyArrayWithPropsKeys, number]>
    expectType<TypeEqual<typeof arrayPropsLoopMapTypeChange, TarrayPropsLoopMapTypeChange>>(true)
    for (const [item, idxKey, count] of arrayPropsLoopMapTypeChange) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, TMyArrayWithPropsKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Array with mapKeys() & mapKeysReturn type change

    const arrayMapKeysTypeChange = loop(arrayWithProps, {
      props: true,
      mapKeys: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TMyArrayWithPropsItems>>(true)
        expectType<TypeEqual<typeof idxOrKey, TMyArrayWithPropsKeys>>(true)
        expectType<TypeEqual<typeof value, MyArrayWithProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TarrayMapKeysTypeChange = Generator<[TMyArrayWithPropsItems, T_NEW_TYPE,number]>
    expectType<TypeEqual<typeof arrayMapKeysTypeChange, TarrayMapKeysTypeChange>>(true)
    for (const [item, idxKey, count] of arrayMapKeysTypeChange) {
      expectType<TypeEqual<typeof item, TMyArrayWithPropsItems>>(true)
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### TypedArray Numbers ###

    const aTypedArray = new Int8Array(8)
    const typedArrayLoop = loop(aTypedArray)
    type TtypedArrayLoop = Generator<[number, number, number]>
    expectType<TypeEqual<typeof typedArrayLoop, TtypedArrayLoop>>(true)
    for (const [item, idxKey, count] of typedArrayLoop) {
      expectType<TypeEqual<typeof item, number>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### TypedArray Numbers with map callback & mapReturn type change NOT ALLOWED

    const typedArrayLoop_map = loop(new Int8Array(8), {
      map: (item, idxOrKey, value, count) => {
        expectType<TypeEqual<typeof item, number>>(true)
        expectType<TypeEqual<typeof idxOrKey, number>>(true)
        expectType<TypeEqual<typeof value, Int8Array>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE // IGNORED & it will fail at runtime - TypedArrays have unchanged types!
      },
    })

    type TtypedArrayLoop_map = Generator<[number, number, number]>
    expectType<TypeEqual<typeof typedArrayLoop_map, TtypedArrayLoop_map>>(true)
    for (const [item, idxKey, count] of typedArrayLoop_map) {
      expectType<TypeEqual<typeof item, number>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### TypedArray Numbers with mapKeys callback & mapKeysReturn type change NOT ALLOWED

    const typedArrayLoop_mapKeys = loop(new Int8Array(8), {
      mapKeys: (item, idxOrKey, value, count) => {
        expectType<TypeEqual<typeof item, number>>(true)
        expectType<TypeEqual<typeof idxOrKey, number>>(true)
        expectType<TypeEqual<typeof value, Int8Array>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE // IGNORED & it will fail at runtime, otherwise it doesnt' match cause TypedArrays have unchanged types!
      },
    })

    type TtypedArrayLoop_mapKeys = Generator<[number, number, number]>
    expectType<TypeEqual<typeof typedArrayLoop_mapKeys, TtypedArrayLoop_mapKeys>>(true)
    for (const [item, idxKey, count] of typedArrayLoop_mapKeys) {
      expectType<TypeEqual<typeof item, number>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### TypedArray Numbers with props: true ###

    interface IMyTypedArrayProps extends Int8Array {
      k: string
      l: boolean
      m: RegExp
    }

    const myTypedArray: IMyTypedArrayProps = new Int8Array(8) as IMyTypedArrayProps

    const myTypedArrayLoop = loop(myTypedArray, {
      props: true,
    })
    type TmyTypedArrayLoop = Generator<[ValueOf<IMyTypedArrayProps>, keyof IMyTypedArrayProps, number]>
    expectType<TypeEqual<typeof myTypedArrayLoop, TmyTypedArrayLoop>>(true)

    for (const [item, idxKey, count] of myTypedArrayLoop) {
      expectType<TypeEqual<typeof item, ValueOf<IMyTypedArrayProps>>>(true)
      expectType<TypeEqual<typeof idxKey, keyof IMyTypedArrayProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### TypedArrayBigInt

    const aTypedArrayBigInt = new BigInt64Array(8)
    const typedArrayBigIntLoop = loop(aTypedArrayBigInt)
    type TtypedArrayBigIntLoop = Generator<[bigint, number, number]>
    expectType<TypeEqual<typeof typedArrayBigIntLoop, TtypedArrayBigIntLoop>>(true)
    for (const [item, idxKey, count] of typedArrayBigIntLoop) {
      expectType<TypeEqual<typeof item, bigint>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### TypedArrayBigInt with map callback & mapReturn type change NOT ALLOWED

    const typedArrayBigIntLoop_map = loop(new BigInt64Array(8), {
      map: (item, idxOrKey, value, count) => {
        expectType<TypeEqual<typeof item, bigint>>(true)
        expectType<TypeEqual<typeof idxOrKey, number>>(true)
        expectType<TypeEqual<typeof value, BigInt64Array>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE // IGNORED & it will fail at runtime, otherwise it doesnt' match cause TypedArrays have unchanged types!
      },
    })

    type TtypedArrayBigIntLoop_map = Generator<[bigint, number, number]>
    expectType<TypeEqual<typeof typedArrayBigIntLoop_map, TtypedArrayBigIntLoop_map>>(true)

    for (const [item, idxKey, count] of typedArrayBigIntLoop_map) {
      expectType<TypeEqual<typeof item, bigint>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### realObject / POJSO / Record<> / PropBag ###

    const pojsoLoop = loop(pojsoCommonProps)

    // String values & keys only

    type TobjLoop = Generator<[TcommonStringProps_values, TcommonStringProps, number]>

    // @ts-expect-error: @todo: separate string & symbol props
    expectType<TypeEqual<typeof pojsoLoop, TobjLoop>>(true)
    // @ts-expect-error: @todo: separate string & symbol props
    expectType<Generator<[TcommonStringProps_values, TcommonStringProps, number]>>(pojsoLoop)

    const objLoopEmptyOptions = loop(pojsoCommonProps, {})
    // @ts-expect-error: @todo: separate string & symbol props
    expectType<TypeEqual<typeof objLoopEmptyOptions, TobjLoop>>(true)

    const objLoopEmptyTypedOptions = loop(pojsoCommonProps, emptyTypedIloopOptions)
    // @todo: this should work
    // expectType<
    //   TypeEqual<typeof objLoopEmptyTypedOptions, Generator<[TcommonALLValues, TcommonStringProps | TcommonSymbolProps, number], any, unknown>>
    // >(true)

    for (const [item, idxKey, count] of pojsoLoop) {
      // @ts-expect-error: @todo: separate string & symbol props
      expectType<TypeEqual<typeof item, TcommonStringProps_values>>(true)
      // @ts-expect-error: @todo: separate string & symbol props
      expectType<TypeEqual<typeof idxKey, TcommonStringProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // With symbol: true

    const pojsoWithSymbolLoop = loop(pojsoCommonProps, {
      symbol: true,
    })
    type TobjWithSymbolLoop = Generator<[TcommonStringProps_values | TcommonSymbolProps_values, TcommonStringProps | TcommonSymbolProps, number]>
    expectType<TypeEqual<typeof pojsoWithSymbolLoop, TobjWithSymbolLoop>>(true)

    for (const [item, idxKey, count] of pojsoWithSymbolLoop) {
      expectType<TypeEqual<typeof item, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
      expectType<TypeEqual<typeof idxKey, TcommonStringProps | TcommonSymbolProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Real Object / Record<> / PropBag
    // with map callback & mapReturn type change ###

    const objMapTypeChange = loop(pojsoCommonProps, {
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
        expectType<TypeEqual<typeof idxOrKey, TcommonStringProps | TcommonSymbolProps>>(true)
        expectType<TypeEqual<typeof value, typeof pojsoCommonProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TobjMapTypeChange = Generator<[T_NEW_TYPE, TcommonStringProps | TcommonSymbolProps, number]>
    expectType<TypeEqual<typeof objMapTypeChange, TobjMapTypeChange>>(true)
    for (const [item, idxKey, count] of objMapTypeChange) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, TcommonStringProps | TcommonSymbolProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Real Object / Record<> / PropBag
    // with mapKeys callback & mapKeysReturn type change ###

    const objMapKeysTypeChange = loop(pojsoCommonProps, {
      mapKeys: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
        expectType<TypeEqual<typeof idxOrKey, TcommonStringProps | TcommonSymbolProps>>(true)
        expectType<TypeEqual<typeof value, typeof pojsoCommonProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TobjMapKeysTypeChange = Generator<[TcommonStringProps_values | TcommonSymbolProps_values, T_NEW_TYPE,number]>
    expectType<TypeEqual<typeof objMapKeysTypeChange, TobjMapKeysTypeChange>>(true)

    for (const [item, idxKey, count] of objMapKeysTypeChange) {
      expectType<TypeEqual<typeof item, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Class Instances ###

    // Simple class, no symbol or methods
    class SimpleClass {
      aString: string = 'foo'
      aNumber: number = 123
    }
    type TSimpleClassItems = string | number
    type TSimpleClassKeys = 'aString' | 'aNumber'

    const simpleInstanceLoop = loop(new SimpleClass())
    type TfooClassIterator = Generator<[TSimpleClassItems, TSimpleClassKeys, number]>
    expectType<TypeEqual<typeof simpleInstanceLoop, TfooClassIterator>>(true)

    for (const [item, idxKey, count] of simpleInstanceLoop) {
      expectType<TypeEqual<typeof item, TSimpleClassItems>>(true)
      expectType<TypeEqual<typeof idxKey, TSimpleClassKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // Simple class, with symbol

    class ClassWithSymbol {
      aString: string = 'aaa'
      aNumber: number = 123;
      [symbolProp2] = (): true => true
    }

    type TClassWithSymbolItems = string | number | (() => true)
    type TClassWithSymbolKeys = 'aString' | 'aNumber' | typeof symbolProp2

    const instanceWithSymbolLoop = loop(new ClassWithSymbol())
    console.log('instanceWithSymbolLoop', instanceWithSymbolLoop)
    type TfooClass2Iterator = Generator<[TClassWithSymbolItems, TClassWithSymbolKeys, number]>

    expectType<TypeEqual<typeof instanceWithSymbolLoop, TfooClass2Iterator>>(true)

    for (const [item, idxKey, count] of instanceWithSymbolLoop) {
      expectType<TypeEqual<typeof item, TClassWithSymbolItems>>(true)
      expectType<TypeEqual<typeof idxKey, TClassWithSymbolKeys>>(true)
      expectType<TypeEqual<typeof idxKey, keyof ClassWithSymbol>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // A more real world instance - it looks complicated!

    expectType<Generator<[string | Person | (() => string) | ((classMethodArg: any) => void) | ((instanceMethodArg: any) => void), keyof Person, number]>>(loop(new Person('foo')))

    const iteratorClassInstance_Typed_WRONG: Generator<
      [
        (
          | string
          | Person // @todo: this is fishy: why Person and not Employee?
          | (() => string)
          | ((classMethodArg: any) => void)
          | ((instanceMethodArg: any) => void)
        ),
        keyof Employee,
        number,
      ]
    > = loop(a_Employee)

    // ### Set ###

    const aSetOfValuesWithCommonProps = get_Set_of_Tvalues_withCommonProps() // props ignored

    const setLoop = loop(aSetOfValuesWithCommonProps)
    type TsetLoop = Generator<[Tvalues, Tvalues, number]>
    type TSetEntries = ReturnType<typeof aSetOfValuesWithCommonProps.entries>

    expectType<TypeEqual<typeof setLoop, TsetLoop>>(true)

    for (const [item, key, count] of setLoop) {
      expectType<TypeEqual<typeof item, Tvalues>>(true)
      expectType<TypeEqual<typeof key, Tvalues>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Set with map callback & mapReturn type change ###

    const setLoop_map = loop(aSetOfValuesWithCommonProps, {
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, Tvalues>>(true)
        expectType<TypeEqual<typeof idxOrKey, Tvalues>>(true)
        expectType<TypeEqual<typeof value, Set<Tvalues>>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TsetLoop_map = Generator<[T_NEW_TYPE, T_NEW_TYPE,number]>
    expectType<TypeEqual<typeof setLoop_map, TsetLoop_map>>(true)

    // ### Set entries() ###

    const setEntriesLoop = loop(aSetOfValuesWithCommonProps.entries())
    type TsetEntriesLoop = Generator<[Tvalues, Tvalues, number]>
    expectType<TypeEqual<typeof setEntriesLoop, TsetEntriesLoop>>(true)
    for (const [item, key, count] of setEntriesLoop) {
      expectType<TypeEqual<typeof item, Tvalues>>(true)
      expectType<TypeEqual<typeof key, Tvalues>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Set entries() ###
    // with map callback & mapReturn type change

    const setEntries_map_loop = loop(aSetOfValuesWithCommonProps.entries(), {
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, Tvalues>>(true)
        expectType<TypeEqual<typeof idxOrKey, Tvalues>>(true)
        expectType<TypeEqual<typeof value, TSetEntries>>(true)
        expectType<TypeEqual<typeof value, IterableIterator<[Tvalues, Tvalues]>>>(true)
        expectType<TypeEqual<typeof value, SetIteratorEntries<Tvalues>>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TsetEntries_map_loop = Generator<[T_NEW_TYPE, T_NEW_TYPE,number]>
    expectType<TypeEqual<typeof setEntries_map_loop, TsetEntries_map_loop>>(true)
    for (const [item, idxKey, count] of setEntries_map_loop) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Set entries() ###
    // with mapKeys callback & mapKeysReturn type change

    const setEntries_mapKeys_loop = loop(aSetOfValuesWithCommonProps.entries(), {
      mapKeys: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, Tvalues>>(true)
        expectType<TypeEqual<typeof idxOrKey, Tvalues>>(true)
        expectType<TypeEqual<typeof value, TSetEntries>>(true)
        expectType<TypeEqual<typeof value, IterableIterator<[Tvalues, Tvalues]>>>(true)
        expectType<TypeEqual<typeof value, SetIteratorEntries<Tvalues>>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TsetEntries_mapKeys_loop = Generator<[T_NEW_TYPE, T_NEW_TYPE,number]>
    expectType<TypeEqual<typeof setEntries_mapKeys_loop, TsetEntries_mapKeys_loop>>(true)
    for (const [item, idxKey, count] of setEntries_mapKeys_loop) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Set with props: true ###

    const setWithPropsLoop = loop(aSetOfValuesWithCommonProps, { props: true })
    type TsetWithPropsLoop = Generator<[TcommonStringProps_values, TcommonStringProps, number]>
    // @ts-expect-error: @todo: separate string & symbol props & exclude methods & standard Set props
    expectType<TypeEqual<typeof setWithPropsLoop, TsetWithPropsLoop>>(true)

    // ### Set with props: true & symbols: true ###

    const setWithPropsAndSymbolsLoop = loop(aSetOfValuesWithCommonProps, { props: true, symbol: true })
    type TsetWithPropsAndSymbolsLoop = Generator<[TcommonStringProps_values | TcommonSymbolProps_values, TcommonStringProps | TcommonSymbolProps, number]>
    // @ts-expect-error: @todo: exclude methods & standard Set props
    expectType<TypeEqual<typeof setWithPropsAndSymbolsLoop, TsetWithPropsAndSymbolsLoop>>(true)

    // // @todo: remove me - temp testing
    // type TsetWithPropsAndSymbolsLoop2 = Generator<[TcommonALLValues & ValueOf<Set<any>>, TcommonStringProps | TcommonSymbolProps & keyof Set<any>, number], any, unknown>
    // expectType<TypeEqual<typeof setWithPropsAndSymbolsLoop, TsetWithPropsAndSymbolsLoop2>>(true)

    // ### Map ###

    type TaMapItems = 11 | true
    type TaMapKeys = 'aKey' | 999n
    const aMap = new Map(<[TaMapKeys, TaMapItems][]>[
      ['aKey', 11],
      [999n, true],
    ])
    type TaMapType = Map<TaMapKeys, TaMapItems>
    type TaMapEntries = ReturnType<typeof aMap.entries>

    const aMapLoop = loop(aMap)
    type TaMapLoop = Generator<[TaMapItems, TaMapKeys, number]>
    expectType<TypeEqual<typeof aMapLoop, TaMapLoop>>(true)

    for (const [item, key, count] of aMapLoop) {
      expectType<TypeEqual<typeof item, TaMapItems>>(true)
      expectType<TypeEqual<typeof key, TaMapKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Map with map callback & mapReturn type change ###

    const aMapLoop_map = loop(aMap, {
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TaMapItems>>(true)
        expectType<TypeEqual<typeof idxOrKey, TaMapKeys>>(true)
        expectType<TypeEqual<typeof value, TaMapType>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TaMapLoop_map = Generator<[T_NEW_TYPE, TaMapKeys, number]>
    expectType<TypeEqual<typeof aMapLoop_map, TaMapLoop_map>>(true)
    for (const [item, idxKey, count] of aMapLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, TaMapKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Map with mapKeys callback & mapKeysReturn type change ###

    const aMapLoop_mapKeys = loop(aMap, {
      mapKeys: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TaMapItems>>(true)
        expectType<TypeEqual<typeof idxOrKey, TaMapKeys>>(true)
        expectType<TypeEqual<typeof value, TaMapType>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TaMapLoop_mapKeys = Generator<[TaMapItems, T_NEW_TYPE,number]>
    expectType<TypeEqual<typeof aMapLoop_mapKeys, TaMapLoop_mapKeys>>(true)
    for (const [item, idxKey, count] of aMapLoop_mapKeys) {
      expectType<TypeEqual<typeof item, TaMapItems>>(true)
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Map with props: true ###

    // @todo:

    const mapWithProps = get_Map_of_TMapKeys_Tvalues_WithCommonProps()
    // const mapWithPropsLoop = loop(mapWithProps, { props: true })
    // type TmapWithPropsLoop = Generator<[ValueOf<MapWithCommonProps<TaMapKeys, TaMapItems>>, TcommonStringProps | TcommonSymbolProps, number]>
    // expectType<TypeEqual<typeof mapWithPropsLoop, TmapWithPropsLoop>>(true)

    // ### Map entries() ###

    const aMapEntriesLoop = loop(aMap.entries())

    type TaMapEntriesLoop = Generator<[TaMapItems, TaMapKeys, number]>
    expectType<TypeEqual<typeof aMapEntriesLoop, TaMapEntriesLoop>>(true)
    for (const [item, key, count] of aMapEntriesLoop) {
      expectType<TypeEqual<typeof item, TaMapItems>>(true)
      expectType<TypeEqual<typeof key, TaMapKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Map entries() with map callback & mapReturn type change ###
    const aMapEntriesLoop_map = loop(aMap.entries(), {
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TaMapItems>>(true)
        expectType<TypeEqual<typeof idxOrKey, TaMapKeys>>(true)
        expectType<TypeEqual<typeof value, TaMapEntries>>(true)
        expectType<TypeEqual<typeof value, IterableIterator<[TaMapKeys, TaMapItems]>>>(true)
        expectType<TypeEqual<typeof value, MapIteratorEntries<TaMapKeys, TaMapItems>>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TaMapEntriesLoop_map = Generator<[T_NEW_TYPE, TaMapKeys, number]>
    expectType<TypeEqual<typeof aMapEntriesLoop_map, TaMapEntriesLoop_map>>(true)
    for (const [item, idxKey, count] of aMapEntriesLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, TaMapKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Map entries() with mapKeys callback & mapKeysReturn type change ###
    const aMapEntriesLoop_mapKeys = loop(aMap.entries(), {
      mapKeys: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TaMapItems>>(true)
        expectType<TypeEqual<typeof idxOrKey, TaMapKeys>>(true)
        expectType<TypeEqual<typeof value, TaMapEntries>>(true)
        expectType<TypeEqual<typeof value, IterableIterator<[TaMapKeys, TaMapItems]>>>(true)
        expectType<TypeEqual<typeof value, MapIteratorEntries<TaMapKeys, TaMapItems>>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TaMapEntriesLoop_mapKeys = Generator<[TaMapItems, T_NEW_TYPE,number]>
    expectType<TypeEqual<typeof aMapEntriesLoop_mapKeys, TaMapEntriesLoop_mapKeys>>(true)
    for (const [item, idxKey, count] of aMapEntriesLoop_mapKeys) {
      expectType<TypeEqual<typeof item, TaMapItems>>(true)
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // @todo(111): Map keys() & Map values() not supported, since they return iterators

    // ### Generators ###

    const aGenerator = get_Generator_of_Tvalues()
    expectType<TypeEqual<typeof aGenerator, TmyGenerator>>(true)

    const generatorLoop = loop(aGenerator)
    type TgeneratorLoop = Generator<[Tvalues, null, number]>
    expectType<TypeEqual<typeof generatorLoop, TgeneratorLoop>>(true)

    for (const [item, idxOrKey, count] of generatorLoop) {
      expectType<TypeEqual<typeof item, Tvalues>>(true)
      expectType<TypeEqual<typeof idxOrKey, null>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Generators, with map callback & mapReturn type change ###

    const generatorLoop_map = loop(aGenerator, {
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, Tvalues>>(true)
        expectType<TypeEqual<typeof idxOrKey, null>>(true)
        expectType<TypeEqual<typeof value, TmyGenerator>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TgeneratorLoop_map = Generator<[T_NEW_TYPE, null, number]>
    expectType<TypeEqual<typeof generatorLoop_map, TgeneratorLoop_map>>(true)
    for (const [item, idxKey, count] of generatorLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, null>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Generators, with mapKeys callback & mapKeysReturn type change ###

    const generatorLoop_mapKeys = loop(aGenerator, {
      mapKeys: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, Tvalues>>(true)
        expectType<TypeEqual<typeof idxOrKey, null>>(true)
        expectType<TypeEqual<typeof value, TmyGenerator>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TgeneratorLoop_mapKeys = Generator<[Tvalues, T_NEW_TYPE,number]>
    expectType<TypeEqual<typeof generatorLoop_mapKeys, TgeneratorLoop_mapKeys>>(true)
    for (const [item, idxKey, count] of generatorLoop_mapKeys) {
      expectType<TypeEqual<typeof item, Tvalues>>(true)
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Generators, as property bag ###

    // props: true (& string: true default)

    let generatorWithProps: TGeneratorWithCommonProps = get_Generator_of_Tvalues_withCommonProps()
    const generatorWithPropsLoop = loop(generatorWithProps, { props: true })

    type TgeneratorWithPropsLoop = Generator<[TcommonStringProps_values, TcommonStringProps, number]>
    expectType<TypeEqual<typeof generatorWithPropsLoop, TgeneratorWithPropsLoop>>(true)

    for (const [item, idxKey, count] of generatorWithPropsLoop) {
      expectType<TypeEqual<typeof item, TcommonStringProps_values>>(true)
      expectType<TypeEqual<typeof idxKey, TcommonStringProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // props: true but string: false - returns never

    let generatorWithPropsNever: TGeneratorWithCommonProps = get_Generator_of_Tvalues_withCommonProps()
    const generatorWithPropsLoopNever = loop(generatorWithPropsNever, { props: true, string: false })

    type TgeneratorWithPropsLoopNever = Generator<[never, null, number]>
    expectType<TypeEqual<typeof generatorWithPropsLoopNever, TgeneratorWithPropsLoopNever>>(true)

    for (const [item, idxKey, count] of generatorWithPropsLoopNever) {
      expectType<TypeEqual<typeof item, never>>(true)
      expectType<TypeEqual<typeof idxKey, null>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Generators, as property bag with map callback & mapReturn type change ###

    const generatorWithPropsLoop_map = loop(generatorWithPropsNever, {
      props: true,
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
        expectType<TypeEqual<typeof item, TcommonStringProps_values>>(true)
        // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
        expectType<TypeEqual<typeof idxOrKey, TcommonStringProps>>(true)
        // @ts-expect-error: @todo: pass the types on map/filter etc callbacks)
        expectType<TypeEqual<typeof value, TGeneratorWithCommonProps>>(true)
        // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TgeneratorWithPropsLoop_map = Generator<[T_NEW_TYPE, TcommonStringProps, number]>
    // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
    expectType<TypeEqual<typeof generatorWithPropsLoop_map, TgeneratorWithPropsLoop_map>>(true)
    for (const [item, idxKey, count] of generatorWithPropsLoop_map) {
      // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, TcommonStringProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // // props:true & symbol: true

    let generatorWithPropsSymbol: TGeneratorWithCommonProps = get_Generator_of_Tvalues_withCommonProps()
    const generatorWithPropsSymbolLoop = loop(generatorWithPropsSymbol, { props: true, symbol: true })

    type TgeneratorWithPropsSymbolLoop = Generator<[TcommonStringProps_values | TcommonSymbolProps_values, TcommonStringProps | TcommonSymbolProps, number]>
    expectType<TypeEqual<typeof generatorWithPropsSymbolLoop, TgeneratorWithPropsSymbolLoop>>(true)

    for (const [item, idxKey, count] of generatorWithPropsSymbolLoop) {
      expectType<TypeEqual<typeof item, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
      expectType<TypeEqual<typeof idxKey, TcommonStringProps | TcommonSymbolProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Generators, as property bag with map callback & mapReturn type change ###

    const generatorWithPropsSymbolLoop_map = loop(get_Generator_of_Tvalues_withCommonProps(), {
      props: true,
      symbol: true,
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
        expectType<TypeEqual<typeof item, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
        // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
        expectType<TypeEqual<typeof idxOrKey, TcommonStringProps | TcommonSymbolProps>>(true)
        // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
        expectType<TypeEqual<typeof value, TGeneratorWithCommonProps>>(true)
        // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TgeneratorWithPropsSymbolLoop_map = Generator<[T_NEW_TYPE, TcommonStringProps | TcommonSymbolProps, number]>
    // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
    expectType<TypeEqual<typeof generatorWithPropsSymbolLoop_map, TgeneratorWithPropsSymbolLoop_map>>(true)
    for (const [item, idxKey, count] of generatorWithPropsSymbolLoop_map) {
      // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, TcommonStringProps | TcommonSymbolProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Generators, as property bag with mapKeys callback & mapKeysReturn type change ###

    const generatorWithPropsLoop_mapKeys = loop(get_Generator_of_Tvalues_withCommonProps(), {
      props: true,
      symbol: true,
      mapKeys: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
        expectType<TypeEqual<typeof item, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
        // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
        expectType<TypeEqual<typeof idxOrKey, TcommonStringProps | TcommonSymbolProps>>(true)
        // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
        expectType<TypeEqual<typeof value, TGeneratorWithCommonProps>>(true)
        // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TgeneratorWithPropsLoop_mapKeys = Generator<[TcommonStringProps_values | TcommonSymbolProps_values, T_NEW_TYPE,number]>

    // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
    expectType<TypeEqual<typeof generatorWithPropsLoop_mapKeys, TgeneratorWithPropsLoop_mapKeys>>(true)
    for (const [item, idxKey, count] of generatorWithPropsLoop_mapKeys) {
      expectType<TypeEqual<typeof item, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
      // @ts-expect-error: @todo: pass the types on map/filter etc callbacks
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Async Generators ###

    const asyncGen = (async function* () {
      yield 'foo'
      yield true
      yield 123
    })()
    type TasyncGenItems = true | 'foo' | 123
    type TasyncGen = AsyncGenerator<TasyncGenItems, void>

    expectType<TypeEqual<typeof asyncGen, TasyncGen>>(true)

    const asyncGenLoop = loop(asyncGen)
    type TasyncGenLoop = AsyncGenerator<[TasyncGenItems, null, number]>
    expectType<TypeEqual<typeof asyncGenLoop, TasyncGenLoop>>(true)

    for await (const [item, key, count] of asyncGenLoop) {
      expectType<TypeEqual<typeof item, TasyncGenItems>>(true)
      expectType<TypeEqual<typeof key, null>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // explicit typings also work
    for await (const [item, idx, count] of loop<
      true | string | number, // Titem
      AsyncGenerator<true | string | number>
    >(asyncGen)) {
      expectType<TypeEqual<typeof item, true | string | number>>(true)
      expectType<TypeEqual<typeof idx, null>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Async Generators, with map callback & mapReturn type change ###

    const asyncGenLoop_map = loop(asyncGen, {
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TasyncGenItems>>(true)
        expectType<TypeEqual<typeof idxOrKey, null>>(true)
        // expectType<TypeEqual<typeof value, TasyncGen>>(true) // @todo: fails, ignore for now
        expectType<TypeEqual<typeof value, AsyncIteratorOrGenerator<TasyncGenItems, void, unknown>>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TasyncGenLoop_map = AsyncGenerator<[T_NEW_TYPE, null, number]>
    expectType<TypeEqual<typeof asyncGenLoop_map, TasyncGenLoop_map>>(true)
    for await (const [item, idxKey, count] of asyncGenLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, null>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Async Generators, with mapKeys callback & mapKeysReturn type change ###

    const asyncGenLoop_mapKeys = loop(asyncGen, {
      mapKeys: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TasyncGenItems>>(true)
        expectType<TypeEqual<typeof idxOrKey, null>>(true)
        // expectType<TypeEqual<typeof value, TasyncGen>>(true) // @todo: fails, ignore for now
        expectType<TypeEqual<typeof value, AsyncIteratorOrGenerator<TasyncGenItems, void, unknown>>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TasyncGenLoop_mapKeys = AsyncGenerator<[TasyncGenItems, T_NEW_TYPE,number]>
    expectType<TypeEqual<typeof asyncGenLoop_mapKeys, TasyncGenLoop_mapKeys>>(true)
    for await (const [item, idxKey, count] of asyncGenLoop_mapKeys) {
      expectType<TypeEqual<typeof item, TasyncGenItems>>(true)
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Async Generators, as property bag ###

    interface MyAsyncGeneratorWithProps extends AsyncGenerator<true | 'foo' | 123, void> {
      a: string
      b: bigint
    }
    type TMyAsyncGeneratorWithPropsItems = string | bigint
    type TMyAsyncGeneratorWithPropsKeys = 'a' | 'b'

    let asyncGeneratorProps: MyAsyncGeneratorWithProps = (async function* () {})() as MyAsyncGeneratorWithProps
    const asyncGeneratorPropsLoop = loop(asyncGeneratorProps, { props: true })
    type TasyncGeneratorPropsLoop = Generator<[TMyAsyncGeneratorWithPropsItems, TMyAsyncGeneratorWithPropsKeys, number]>
    expectType<TypeEqual<typeof asyncGeneratorPropsLoop, TasyncGeneratorPropsLoop>>(true)

    for (const [item, idxKey, count] of asyncGeneratorPropsLoop) {
      expectType<TypeEqual<typeof item, TMyAsyncGeneratorWithPropsItems>>(true)
      expectType<TypeEqual<typeof idxKey, TMyAsyncGeneratorWithPropsKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Async Generators, as property bag with map callback & mapReturn type change ###

    const asyncGeneratorPropsLoop_map = loop(asyncGeneratorProps, {
      props: true,
      map: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TMyAsyncGeneratorWithPropsItems>>(true)
        expectType<TypeEqual<typeof idxOrKey, TMyAsyncGeneratorWithPropsKeys>>(true)
        expectType<TypeEqual<typeof value, MyAsyncGeneratorWithProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TasyncGeneratorPropsLoop_map = Generator<[T_NEW_TYPE, TMyAsyncGeneratorWithPropsKeys, number]>
    expectType<TypeEqual<typeof asyncGeneratorPropsLoop_map, TasyncGeneratorPropsLoop_map>>(true)
    for (const [item, idxKey, count] of asyncGeneratorPropsLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, TMyAsyncGeneratorWithPropsKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Async Generators, as property bag with mapKeys callback & mapKeysReturn type change ###
    const asyncGeneratorPropsLoop_mapKeys = loop(asyncGeneratorProps, {
      props: true,
      mapKeys: (item, idxOrKey, value, count): T_NEW_TYPE =>{
        expectType<TypeEqual<typeof item, TMyAsyncGeneratorWithPropsItems>>(true)
        expectType<TypeEqual<typeof idxOrKey, TMyAsyncGeneratorWithPropsKeys>>(true)
        expectType<TypeEqual<typeof value, MyAsyncGeneratorWithProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TasyncGeneratorPropsLoop_mapKeys = Generator<[TMyAsyncGeneratorWithPropsItems, T_NEW_TYPE,number]>

    expectType<TypeEqual<typeof asyncGeneratorPropsLoop_mapKeys, TasyncGeneratorPropsLoop_mapKeys>>(true)

    for (const [item, idxKey, count] of asyncGeneratorPropsLoop_mapKeys) {
      expectType<TypeEqual<typeof item, TMyAsyncGeneratorWithPropsItems>>(true)
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // # ArrayBuffer ###

    const anArrayBuffer = new ArrayBuffer(8)
    const arrayBufferLoop = loop(anArrayBuffer, {
      dataViewType: DataViewType.Float32,
    })
    type TarrayBufferLoop = Generator<[number, number, number]>
    expectType<TypeEqual<typeof arrayBufferLoop, TarrayBufferLoop>>(true)
    for (const [item, key, count] of arrayBufferLoop) {
      expectType<TypeEqual<typeof item, number>>(true)
      expectType<TypeEqual<typeof key, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### ArrayBuffer, as PropBag ###

    interface IMyArrayBufferProps extends ArrayBuffer {
      k: string
      l: boolean
      m: RegExp
    }

    const myArrayBuffer: IMyArrayBufferProps = new ArrayBuffer(8) as IMyArrayBufferProps

    const myArrayBufferLoop = loop(myArrayBuffer, {
      dataViewType: DataViewType.Float32,
      props: true,
    })
    type TmyArrayBufferLoop = Generator<[ValueOf<IMyArrayBufferProps>, keyof IMyArrayBufferProps, number]>
    expectType<TypeEqual<typeof myArrayBufferLoop, TmyArrayBufferLoop>>(true)
    for (const [item, key, count] of myArrayBufferLoop) {
      expectType<TypeEqual<typeof item, ValueOf<IMyArrayBufferProps>>>(true)
      expectType<TypeEqual<typeof key, keyof IMyArrayBufferProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // // @todo: WIP
    // // ### Classes, with static member variables, treated like a single Value (unlike function) ###
    //
    // class ClassWithStatic {
    //   static aString: string = 'a string'
    //   static aNumber: number = 123
    //   static aMethod = () => {}
    // }
    //
    // const classWithStaticLoop = loop(ClassWithStatic)
    // type TclassWithStaticLoop = Generator<[ClassWithStatic, null, 1]>
    // expectType<TypeEqual<typeof classWithStaticLoop, TclassWithStaticLoop>>(true)
    //
    // for (const [item, key, count] of classWithStaticLoop) {
    //   expectType<TypeEqual<typeof item, string | number | (() => void)>>(true)
    //   expectType<TypeEqual<typeof key, string>>(true)
    //   expectType<TypeEqual<typeof count, number>>(true)
    // }

    // ### Classes, with static member variables, treated like function
    // with map callback & mapReturn type change ###

    // ### LOW PRIORITY, HARD, NOT WORTH IT ###
    // ### Mixed value types: @todo(111): mixed item types dont work, unless type is known. We need to consolidate loop typings, which seems very hard! ###

    let arrayOrSet: number[] | Set<string | boolean>

    arrayOrSet = new Set(['1, 2, 3']) // commenting this BREAKS
    for (const [item, key, count] of loop(arrayOrSet)) {
      expectType<TypeEqual<typeof item, boolean | string>>(true)
      expectType<TypeEqual<typeof key, boolean | string>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    arrayOrSet = [1, 2, 3] // commenting this BREAKS
    for (const [item, key, count] of loop(arrayOrSet)) {
      expectType<TypeEqual<typeof item, number>>(true)
      expectType<TypeEqual<typeof key, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }
  })
})
