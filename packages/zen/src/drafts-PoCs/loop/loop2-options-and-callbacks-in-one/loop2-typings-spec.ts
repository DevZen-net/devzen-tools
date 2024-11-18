// @-ts-nocheck
import { expectType, TypeEqual } from 'ts-expect'
import { ILoopOptions } from '../../../code'
import { DataViewType } from '../../../code/loopzen/ArrayBufferCursor'
import { MapIteratorEntries } from '../../../code/typezen/isMapIterator'
import { SetIteratorEntries } from '../../../code/typezen/isSetIterator'
import {
  a_Employee,
  a_Map_of_TMapKeys_Tvalues_WithCommonProps,
  Employee,
  get_Generator_of_Tvalues,
  get_Generator_of_Tvalues_withCommonProps,
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

import { loop2 } from './loop2'

const emptyTypedIloopOptions: ILoopOptions<any, any, any> = {}

describe(`Loop Typings tests`, () => {
  it(`loop2() Typings tests`, async () => {
    // ### Options & wrong options ###

    // @ts-expect-error
    loop2({}, { WRONG_OPTION: true })

    loop2({}, { props: true, WRONG_OPTION: true })

    // ######## Single Values ########

    // ### Primitives ###

    // ### undefined ###

    const undefinedLoop = loop2(undefined)
    type TundefinedLoop = Generator<[undefined, never, 1]>
    expectType<TypeEqual<typeof undefinedLoop, TundefinedLoop>>(true)

    // instead, this works
    expectType<TypeEqual<typeof undefinedLoop, Generator<[undefined, never, 1]>>>(true)

    expectType<Generator<[undefined, never, 1]>>(undefinedLoop)
    for (const [item, idxKey, count] of undefinedLoop) {
      expectType<undefined>(item)
      expectType<void>(item)
      // expectType<TypeEqual<typeof val, undefined>>(true) // why fails?
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }
    // @ts-expect-error: Type undefined is not assignable to type number
    expectType<Generator<[number, null, 1]>>(undefinedLoop)

    // ### null ###

    const nullLoop = loop2(null)
    type TnullLoop = Generator<[null, never, 1]>
    expectType<TypeEqual<typeof nullLoop, TnullLoop>>(true)
    // instead, this works
    expectType<TypeEqual<typeof nullLoop, Generator<[null, never, 1]>>>(true)

    for (const [item, idxKey, count] of nullLoop) {
      expectType<null>(item)

      // expectType<TypeEqual<typeof val, null>>(true) // why fails?
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // @ts-expect-error: type null is not assignable to type number
    expectType<Generator<[number, null, number]>>(nullLoop)

    // ### A void with map callback & mapReturn type change

    const undefinedLoop_map = loop2(undefined, {
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, undefined>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, never>>(true)
        expectType<TypeEqual<typeof input, undefined>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    const undefinedLoop_map_fewer_args = loop2(undefined, {
      map: (item): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, undefined>>(true)
        return NEW_TYPE
      },
    })

    type TundefinedLoop_map = Generator<[T_NEW_TYPE, never, 1]>
    expectType<TypeEqual<typeof undefinedLoop_map, TundefinedLoop_map>>(true)
    for (const [item, idxKey, count] of undefinedLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Number ###

    const numberLoop = loop2(123 as const)
    type TnumberLoop = Generator<[123, never, 1]>
    expectType<TypeEqual<typeof numberLoop, TnumberLoop>>(true)
    expectType<Generator<[number, null, number]>>(numberLoop)
    for (const [item, idxKey, count] of numberLoop) {
      expectType<TypeEqual<typeof item, 123>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### bigint ###

    const bigIntLoop = loop2(456n as const)
    type TbigIntLoop = Generator<[456n, never, 1]>
    expectType<TypeEqual<typeof bigIntLoop, TbigIntLoop>>(true)
    expectType<Generator<[bigint | 456n, null, number]>>(bigIntLoop)
    for (const [item, idxKey, count] of bigIntLoop) {
      expectType<TypeEqual<typeof item, 456n>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // @ts-expect-error: Type bigint is not assignable to type number
    expectType<Generator<[number, null, 1]>>(bigIntLoop)

    // ### bigint with map callback & mapReturn type change, to a number ###
    const bigIntLoop_map = loop2(456n as const, {
      map: (item, idxKey, input, count): 123 => {
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, 456n>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, never>>(true)
        expectType<TypeEqual<typeof input, 456n>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return 123
      },
    })

    type TbigIntLoop_map = Generator<[123, never, 1]>
    expectType<TypeEqual<typeof bigIntLoop_map, TbigIntLoop_map>>(true)
    for (const [item, idxKey, count] of bigIntLoop_map) {
      expectType<TypeEqual<typeof item, 123>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### string ###

    const stringLoop = loop2('foobar' as const)
    type TstringLoop = Generator<['foobar', never, 1]>
    expectType<TypeEqual<typeof stringLoop, TstringLoop>>(true)
    expectType<Generator<[string, null, number]>>(stringLoop)
    for (const [item, idxKey, count] of stringLoop) {
      expectType<TypeEqual<typeof item, 'foobar'>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    expectType<Generator<[String, null, number]>>(stringLoop) // ts is not bothered by String VS string, should we?

    // ### boolean ###

    const booleanLoop = loop2(true as const)
    type TbooleanLoop = Generator<[true, never, 1]>
    expectType<TypeEqual<typeof booleanLoop, TbooleanLoop>>(true)
    expectType<Generator<[boolean, null, number]>>(booleanLoop)
    for (const [item, idxKey, count] of booleanLoop) {
      expectType<TypeEqual<typeof item, true>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // @ts-expect-error: Type boolean is not assignable to type string
    expectType<Generator<[string, null, number]>>(booleanLoop)

    // ### isSingle Primitive value with map callback & mapReturn type change

    const booleanLoop_map = loop2(true as const, {
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, true>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, never>>(true)
        expectType<TypeEqual<typeof input, true>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TbooleanLoop_map = Generator<[T_NEW_TYPE, never, 1]>
    expectType<TypeEqual<typeof booleanLoop_map, TbooleanLoop_map>>(true)
    for (const [item, idxKey, count] of booleanLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Symbol ###

    // const aSymbol: unique symbol = Symbol.for('aSymbol') // not working without unique symbol - how do we define it?
    const aUniqueSymbolLoop = loop2(Symbol.iterator)
    type TaUniqueSymbolLoop = Generator<[typeof Symbol.iterator, never, 1]>
    expectType<TypeEqual<typeof aUniqueSymbolLoop, TaUniqueSymbolLoop>>(true)

    expectType<Generator<[symbol | typeof Symbol.iterator, null, number]>>(loop2(Symbol.iterator))
    for (const [item, idxKey, count] of aUniqueSymbolLoop) {
      expectType<TypeEqual<typeof item, symbol>>(true)
      // @ts-expect-error: TS1335: 'unique symbol' types are not allowed here.
      expectType<unique symbol>(item) // not supported
      // expectType<typeof Symbol.iterator>(item) // breaks - ignore for now
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    type TsymbolLoop = Generator<[string, null, number]>
    // @ts-expect-error: Type typeof Symbol.iterator is not assignable to type string
    expectType<TsymbolLoop>(aUniqueSymbolLoop)

    const simpleSymbolLoop = loop2(Symbol('aSymbol'))
    // @ts-expect-error: Type symbol is not assignable to type string
    expectType<Generator<[string, null, 1]>>(simpleSymbolLoop)

    // @todo(111): is this a bug, or a feature? "Type symbol is not assignable to type string"
    // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
    expectType<Generator<[boolean, null, 1]>>(loop2(Symbol('anotherSymbol')))

    // ### Remaining isSingle Values ###

    // ### RegExp ###

    const aRegExp = /foobar/
    const regExpLoop = loop2(aRegExp)
    type TregExpLoop = Generator<[RegExp, never, 1]>
    expectType<TypeEqual<typeof regExpLoop, TregExpLoop>>(true)
    for (const [item, idxKey, count] of regExpLoop) {
      expectType<TypeEqual<typeof item, RegExp>>(true)
      // @ts-ignore
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }
    // @ts-expect-error: Type RegExp is not assignable to type string
    expectType<Generator<[string, null, number]>>(regExpLoop)

    // ### RegExp with map callback & mapReturn type change ###

    const regExpLoop_map = loop2(aRegExp, {
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, RegExp>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, never>>(true)
        expectType<TypeEqual<typeof input, RegExp>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TregExpLoop_map = Generator<[T_NEW_TYPE, never, 1]>
    expectType<TypeEqual<typeof regExpLoop_map, TregExpLoop_map>>(true)
    for (const [item, idxKey, count] of regExpLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### NaN ###

    const nanLoop = loop2(NaN)
    type TnanLoop = Generator<[typeof NaN, never, 1]>
    expectType<TypeEqual<typeof nanLoop, TnanLoop>>(true)
    for (const [item, idxKey, count] of nanLoop) {
      expectType<number>(item) // NaN is a number type ;-(
      expectType<TypeEqual<typeof item, typeof NaN>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Date, as single ###

    const dateLoop = loop2(new Date())
    type TdateLoop = Generator<[Date, never, 1]>
    expectType<TypeEqual<typeof dateLoop, TdateLoop>>(true)
    for (const [item, idxKey, count] of dateLoop) {
      expectType<TypeEqual<typeof item, Date>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Boxed Primitives ###

    // ### Boxed Boolean, as isSingle  ###

    const boxedBooleanLoop = loop2(new Boolean(false))
    type TboxedBooleanLoop = Generator<[Boolean, never, 1]>
    expectType<TypeEqual<typeof boxedBooleanLoop, TboxedBooleanLoop>>(true)
    for (const [item, idxKey, count] of boxedBooleanLoop) {
      expectType<TypeEqual<typeof item, Boolean>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Boxed Number, as isSingle  ###
    const boxedNumberLoop = loop2(new Number(123))
    type TboxedNumberLoop = Generator<[Number, never, 1]>
    expectType<TypeEqual<typeof boxedNumberLoop, TboxedNumberLoop>>(true)
    for (const [item, idxKey, count] of boxedNumberLoop) {
      expectType<TypeEqual<typeof item, Number>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Boxed String, as isSingle  ###

    const boxedStringLoop = loop2(new String('foobar'))
    type TboxedStringLoop = Generator<[String, never, 1]>
    expectType<TypeEqual<typeof boxedStringLoop, TboxedStringLoop>>(true)
    for (const [item, idxKey, count] of boxedStringLoop) {
      expectType<TypeEqual<typeof item, String>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Promise, as isSingle value ###
    const aPromise = Promise.resolve('a string')
    const promiseLoop = loop2(aPromise)
    type TpromiseLoop = Generator<[Promise<string>, never, 1]>
    expectType<TypeEqual<typeof promiseLoop, TpromiseLoop>>(true)
    for (const [item, idxKey, count] of promiseLoop) {
      expectType<TypeEqual<typeof item, Promise<string>>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Promise, as isSingle value with map callback & mapReturn type change ###
    const promiseLoop_map = loop2(aPromise, {
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, Promise<string>>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, never>>(true)
        expectType<TypeEqual<typeof input, Promise<string>>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TpromiseLoop_map = Generator<[T_NEW_TYPE, never, 1]>
    expectType<TypeEqual<typeof promiseLoop_map, TpromiseLoop_map>>(true)
    for (const [item, idxKey, count] of promiseLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Promise with props ###

    // const myPromiseWithProps = addCommonProps(Promise.resolve('a string'))
    //
    // const myPromiseLoop = loop2(myPromiseWithProps, { props: true })
    // type TmyPromiseLoop = Generator<
    //   [TcommonStringValues, TcommonStringProps, number]
    // >
    // expectType<TypeEqual<typeof myPromiseLoop, TmyPromiseLoop>>(true)

    interface IMyPromiseWithProps<T> extends Promise<T> {
      k: string
      l: boolean
      m: RegExp
    }

    type MyPromiseProps = 'k' | 'l' | 'm'
    type MyPromisePropsValues = string | boolean | RegExp

    const myPromise: IMyPromiseWithProps<string> = Promise.resolve('a string') as IMyPromiseWithProps<string>

    const myPromiseLoop = loop2(myPromise, { props: true })
    type TmyPromiseLoop = Generator<[MyPromisePropsValues, MyPromiseProps, number]>
    expectType<TypeEqual<typeof myPromiseLoop, TmyPromiseLoop>>(true)

    for (const [item, idxKey, count] of myPromiseLoop) {
      expectType<TypeEqual<typeof item, MyPromisePropsValues>>(true)
      expectType<TypeEqual<typeof idxKey, MyPromiseProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Error, as isSingle value ###

    const anError = new Error('a string')
    const errorLoop = loop2(anError)
    type TerrorLoop = Generator<[Error, never, 1]>
    expectType<TypeEqual<typeof errorLoop, TerrorLoop>>(true)
    for (const [item, idxKey, count] of errorLoop) {
      expectType<TypeEqual<typeof item, Error>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Error, as isSingle value with map callback & mapReturn type change ###

    const errorLoop_map = loop2(anError, {
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, Error>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, never>>(true)
        expectType<TypeEqual<typeof input, Error>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TerrorLoop_map = Generator<[T_NEW_TYPE, never, 1]>
    expectType<TypeEqual<typeof errorLoop_map, TerrorLoop_map>>(true)
    for (const [item, idxKey, count] of errorLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Error, as PropBag ###

    interface IMyErrorProps extends Error {
      k: string
      l: boolean
      m: RegExp
    }

    const myError: IMyErrorProps = new Error('a string') as IMyErrorProps

    type MyErrorProps = 'k' | 'l' | 'm'
    type MyErrorPropsValues = string | boolean | RegExp

    const myErrorLoop = loop2(myError, { props: true })
    type TmyErrorLoop = Generator<[MyErrorPropsValues, MyErrorProps, number]>
    expectType<TypeEqual<typeof myErrorLoop, TmyErrorLoop>>(true)

    for (const [item, idxKey, count] of myErrorLoop) {
      expectType<TypeEqual<typeof item, MyErrorPropsValues>>(true)
      expectType<TypeEqual<typeof idxKey, MyErrorProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### DataView as a single value ###

    const aDataView = new DataView(new ArrayBuffer(8))
    const dataViewLoop = loop2(aDataView)

    type TdataViewLoop = Generator<[DataView, never, 1]>
    expectType<TypeEqual<typeof dataViewLoop, TdataViewLoop>>(true)
    for (const [item, idxKey, count] of dataViewLoop) {
      expectType<TypeEqual<typeof item, DataView>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### DataView, as as PropBag ###

    interface IMyDataViewProps extends DataView {
      k: string
      l: boolean
      m: RegExp
    }

    const myDataView: IMyDataViewProps = new DataView(new ArrayBuffer(8)) as IMyDataViewProps

    type MyDataViewProps = 'k' | 'l' | 'm'
    type MyDataViewPropsValues = string | boolean | RegExp

    const myDataViewLoop = loop2(myDataView, { props: true })
    type TmyDataViewLoop = Generator<[MyDataViewPropsValues, MyDataViewProps, number]>
    expectType<TypeEqual<typeof myDataViewLoop, TmyDataViewLoop>>(true)

    // ### WeakMap as single value

    const aWeakMap = new WeakMap()
    const weakMapLoop = loop2(aWeakMap)
    type TweakMapLoop = Generator<[WeakMap<WeakKey, any>, never, 1]>
    expectType<TypeEqual<typeof weakMapLoop, TweakMapLoop>>(true)

    // ### WeakSet as single value

    const aWeakSet = new WeakSet()
    const weakSetLoop = loop2(aWeakSet)
    type TweakSetLoop = Generator<[WeakSet<WeakKey>, never, 1]>
    expectType<TypeEqual<typeof weakSetLoop, TweakSetLoop>>(true)

    // ### Function as isSingle value (default) ###

    const functionReturnType = 'function return type'
    type TfunctionReturnType = typeof functionReturnType
    const aFunction = (...args): TfunctionReturnType => functionReturnType
    type TaFunction = (...args) => TfunctionReturnType
    expectType<TypeEqual<typeof aFunction, TaFunction>>(true)

    const functionLoop = loop2(aFunction)
    type TfunctionLoop = Generator<[TaFunction, never, 1]>
    expectType<TypeEqual<typeof functionLoop, TfunctionLoop>>(true)

    for (const [item, idxKey, count] of functionLoop) {
      expectType<TypeEqual<typeof item, TaFunction>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Function as isSingle value (default)
    // with map callback & mapReturn type change ###

    const functionLoop_map = loop2(aFunction, {
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, TaFunction>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, never>>(true)
        expectType<TypeEqual<typeof input, TaFunction>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TfunctionLoop_map = Generator<[T_NEW_TYPE, never, 1]>
    expectType<TypeEqual<typeof functionLoop_map, TfunctionLoop_map>>(true)
    for (const [item, idxKey, count] of functionLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, 1>>(true)
    }

    // ### Function as isSingle value (default)
    // with mapKeys callback & mapKeysReturn type change ###

    const functionLoop_mapKeys = loop2(aFunction, {
      mapKeys: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, TaFunction>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, never>>(true)
        expectType<TypeEqual<typeof input, TaFunction>>(true)
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
    type MyFunctionWithPropsItems = string | bigint
    type MyFunctionWithPropsKeys = 'g' | 'h'

    let functionWithProps: MyFunctionWithProps = (() => functionReturnType) as MyFunctionWithProps
    expectType<TypeEqual<typeof functionWithProps, MyFunctionWithProps>>(true)
    const functionWithPropsLoop = loop2(functionWithProps, {
      props: true,
    })

    type TfunctionWithPropsLoop = Generator<[MyFunctionWithPropsItems, MyFunctionWithPropsKeys, number]>
    expectType<TypeEqual<typeof functionWithPropsLoop, TfunctionWithPropsLoop>>(true)

    for (const [item, idxKey, count] of functionWithPropsLoop) {
      expectType<TypeEqual<typeof item, MyFunctionWithPropsItems>>(true)
      expectType<TypeEqual<typeof idxKey, MyFunctionWithPropsKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Function as a PropBag, with props: true
    // with map callback & mapReturn type change ###

    const functionWithPropsLoop_map = loop2(functionWithProps, {
      props: true,
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAIL 1 2
        expectType<TypeEqual<typeof item, MyFunctionWithPropsItems>>(true)
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAIL 1 2
        expectType<TypeEqual<typeof idxKey, MyFunctionWithPropsKeys>>(true)
        expectType<TypeEqual<typeof input, MyFunctionWithProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TfunctionWithPropsLoop_map = Generator<[T_NEW_TYPE, MyFunctionWithPropsKeys, number]>
    // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
    expectType<TypeEqual<typeof functionWithPropsLoop_map, TfunctionWithPropsLoop_map>>(true)
    for (const [item, idxKey, count] of functionWithPropsLoop_map) {
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof idxKey, MyFunctionWithPropsKeys>>(true)
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Function as a PropBag, with props: true
    // with mapKeys callback & mapKeysReturn type change ###

    const functionWithPropsLoop_mapKeys = loop2(functionWithProps, {
      props: true,
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      mapKeys: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAIL 1 2
        expectType<TypeEqual<typeof item, MyFunctionWithPropsItems>>(true)
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAIL 1 2
        expectType<TypeEqual<typeof idxKey, MyFunctionWithPropsKeys>>(true)
        expectType<TypeEqual<typeof input, MyFunctionWithProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TfunctionWithPropsLoop_mapKeys = Generator<[MyFunctionWithPropsItems, T_NEW_TYPE,number]>
    // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
    expectType<TypeEqual<typeof functionWithPropsLoop_mapKeys, TfunctionWithPropsLoop_mapKeys>>(true)

    for (const [item, idxKey, count] of functionWithPropsLoop_mapKeys) {
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof item, MyFunctionWithPropsItems>>(true)
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ######## Many / Compound / Collection Values ########

    // ### Array ###

    // Normal numeric indexes & values, no props

    type Tarray123Items = 1 | 2 | 3
    type Tarray123Loop = Generator<[Tarray123Items, number, number]>

    // DONE: transferred to all-Many-INV-Array-typings-spec.ts`
    const array123Loop = loop2([1, 2, 3] as const, { props: false })
    expectType<TypeEqual<typeof array123Loop, Tarray123Loop>>(true)

    // DONE: transferred to all-Many-INV-Array-typings-spec.ts`
    const array123LoopEmptyOptions = loop2([1, 2, 3] as const, {})
    expectType<TypeEqual<typeof array123LoopEmptyOptions, Tarray123Loop>>(true)

    // @todo: transfer
    const array123LoopEmptyTypedOptions = loop2([1, 2, 3] as const, emptyTypedIloopOptions)
    expectType<TypeEqual<typeof array123LoopEmptyTypedOptions, Generator<[Tarray123Items, number, number], any, unknown>>>(true)

    type TarrayABCitems = 'a' | 'b' | 'c'
    type TarrayABCLoop = Generator<[TarrayABCitems, number, number]>

    // @todo: delete not needed
    const arrayABCLoop = loop2(['a', 'b', 'c'] as const)
    expectType<TypeEqual<typeof arrayABCLoop, TarrayABCLoop>>(true)

    // @todo: delete not needed
    for (const [item, idxKey, count] of arrayABCLoop) {
      expectType<TypeEqual<typeof item, TarrayABCitems>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // @todo: delete not needed
    const arrayMixedLoop = loop2([true, 'a string', 3] as const)
    type TarrayMixedItems = true | 'a string' | 3
    type TarrayMixedLoop = Generator<[TarrayMixedItems, number, number]>
    expectType<TypeEqual<typeof arrayMixedLoop, TarrayMixedLoop>>(true)
    for (const [item, idxKey, count] of arrayMixedLoop) {
      expectType<TypeEqual<typeof item, TarrayMixedItems>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // DONE: transferred to all-Many-INV-Array-typings-spec.ts`
    const arrayLoopMapTypeChange = loop2([1, 2, 3] as const, {
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, Tarray123Items>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, number>>(true)
        expectType<TypeEqual<typeof input, readonly [1, 2, 3]>>(true)
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
    type TMyArrayProps = 'e' | 'f' | 'g'
    type TMyArrayPropsValues = 'a string' | true | RegExp

    let arrayWithProps: MyArrayWithProps = [1n, 2n, 3n] as MyArrayWithProps
    const arrayPropsLoop = loop2(arrayWithProps, {
      props: true,
    })

    type TarrayPropsIterator = Generator<[TMyArrayPropsValues, TMyArrayProps, number]>
    expectType<TypeEqual<typeof arrayPropsLoop, TarrayPropsIterator>>(true)

    for (const [item, idxKey, count] of arrayPropsLoop) {
      expectType<TypeEqual<typeof item, TMyArrayPropsValues>>(true)
      expectType<TypeEqual<typeof idxKey, TMyArrayProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // Array props with map & mapReturn type change

    const arrayPropsLoopMapTypeChange = loop2(arrayWithProps, {
      props: true,
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAILS 1 2
        expectType<TypeEqual<typeof item, TMyArrayPropsValues>>(true)
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAILS 1 2
        expectType<TypeEqual<typeof idxKey, TMyArrayProps>>(true)
        expectType<TypeEqual<typeof input, MyArrayWithProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    // Generator<[bigint, number, number]>
    type TarrayPropsLoopMapTypeChange = Generator<[T_NEW_TYPE, TMyArrayProps, number]>
    // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
    expectType<TypeEqual<typeof arrayPropsLoopMapTypeChange, TarrayPropsLoopMapTypeChange>>(true)
    for (const [item, idxKey, count] of arrayPropsLoopMapTypeChange) {
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof idxKey, TMyArrayProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Array with mapKeys() & mapKeysReturn type change

    const arrayMapKeysTypeChange = loop2(arrayWithProps, {
      props: true,
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      mapKeys: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAILS 1 2
        expectType<TypeEqual<typeof item, TMyArrayPropsValues>>(true)
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAILS 1 2
        expectType<TypeEqual<typeof idxKey, TMyArrayProps>>(true)
        expectType<TypeEqual<typeof input, MyArrayWithProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TarrayMapKeysTypeChange = Generator<[TMyArrayPropsValues, T_NEW_TYPE,number]>
    // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
    expectType<TypeEqual<typeof arrayMapKeysTypeChange, TarrayMapKeysTypeChange>>(true)
    for (const [item, idxKey, count] of arrayMapKeysTypeChange) {
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof item, TMyArrayPropsValues>>(true)
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### TypedArray Numbers ###

    const aTypedArray = new Int8Array(8)
    const typedArrayLoop = loop2(aTypedArray)
    type TtypedArrayLoop = Generator<[number, number, number]>
    expectType<TypeEqual<typeof typedArrayLoop, TtypedArrayLoop>>(true)
    for (const [item, idxKey, count] of typedArrayLoop) {
      expectType<TypeEqual<typeof item, number>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### TypedArray Numbers with map callback & mapReturn type change NOT ALLOWED

    const typedArrayLoop_map = loop2(new Int8Array(8), {
      map: (item, idxKey, input, count) => {
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, number>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, number>>(true)
        expectType<TypeEqual<typeof input, Int8Array>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE // it will fail at runtime, cause TypedArrays have unchanged types!
      },
    })

    type TtypedArrayLoop_map = Generator<[T_NEW_TYPE, number, number]>
    expectType<TypeEqual<typeof typedArrayLoop_map, TtypedArrayLoop_map>>(true)
    for (const [item, idxKey, count] of typedArrayLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### TypedArray Numbers with mapKeys callback & mapKeysReturn type change NOT ALLOWED

    const typedArrayLoop_mapKeys = loop2(new Int8Array(8), {
      mapKeys: (item, idxKey, input, count) => {
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, number>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, number>>(true)
        expectType<TypeEqual<typeof input, Int8Array>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE // IGNORED & it will fail at runtime, otherwise it doesnt' match cause TypedArrays have unchanged types!
      },
    })

    type TtypedArrayLoop_mapKeys = Generator<[number, T_NEW_TYPE,number]>
    expectType<TypeEqual<typeof typedArrayLoop_mapKeys, TtypedArrayLoop_mapKeys>>(true)
    for (const [item, idxKey, count] of typedArrayLoop_mapKeys) {
      expectType<TypeEqual<typeof item, number>>(true)
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### TypedArray Numbers with props: true ###

    interface IMyTypedArrayWithExtraProps extends Int8Array {
      k: string
      l: boolean
      m: RegExp
    }

    const myTypedArray: IMyTypedArrayWithExtraProps = new Int8Array(8) as IMyTypedArrayWithExtraProps

    type MyTypedArrayProps = 'k' | 'l' | 'm'
    type MyTypedArrayPropValues = string | boolean | RegExp

    const myTypedArrayLoop = loop2(myTypedArray, {
      props: true,
    })
    type TmyTypedArrayLoop = Generator<[MyTypedArrayPropValues, MyTypedArrayProps, number]>
    expectType<TypeEqual<typeof myTypedArrayLoop, TmyTypedArrayLoop>>(true)

    for (const [item, idxKey, count] of myTypedArrayLoop) {
      expectType<TypeEqual<typeof item, MyTypedArrayPropValues>>(true)
      expectType<TypeEqual<typeof idxKey, MyTypedArrayProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### TypedArrayBigInt

    const aTypedArrayBigInt = new BigInt64Array(8)
    const typedArrayBigIntLoop = loop2(aTypedArrayBigInt)
    type TtypedArrayBigIntLoop = Generator<[bigint, number, number]>
    expectType<TypeEqual<typeof typedArrayBigIntLoop, TtypedArrayBigIntLoop>>(true)
    for (const [item, idxKey, count] of typedArrayBigIntLoop) {
      expectType<TypeEqual<typeof item, bigint>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### TypedArrayBigInt with map callback & mapReturn type change NOT ALLOWED

    const typedArrayBigIntLoop_map = loop2(new BigInt64Array(8), {
      map: (item, idxKey, input, count) => {
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, bigint>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, number>>(true)
        expectType<TypeEqual<typeof input, BigInt64Array>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE // it will fail at runtime, cause TypedArrays have unchanged types!
      },
    })

    type TtypedArrayBigIntLoop_map = Generator<[T_NEW_TYPE, number, number]>
    expectType<TypeEqual<typeof typedArrayBigIntLoop_map, TtypedArrayBigIntLoop_map>>(true)

    for (const [item, idxKey, count] of typedArrayBigIntLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### realObject / POJSO / Record<> / PropBag ###

    // String values & keys only
    type TpojsoCommonProps_DefaultOptions_loop = Generator<[TcommonStringProps_values, TcommonStringProps, number]>

    // ## no options
    const pojsoCommonProps_NoOptions_loop = loop2(pojsoCommonProps)

    // @-ts-expect-error: @todo: separate string & symbol props // WORKS 2 FAILS 1?
    expectType<TypeEqual<typeof pojsoCommonProps_NoOptions_loop, TpojsoCommonProps_DefaultOptions_loop>>(true)
    // @-ts-expect-error: @todo: separate string & symbol props // WORKS 2 FAILS 1?
    expectType<Generator<[TcommonStringProps_values, TcommonStringProps, number]>>(pojsoCommonProps_NoOptions_loop)

    for (const [item, idxKey, count] of pojsoCommonProps_NoOptions_loop) {
      // @-ts-expect-error: @todo: separate string & symbol props // WORKS 2 FAILS 1?
      expectType<TypeEqual<typeof item, TcommonStringProps_values>>(true)
      // @-ts-expect-error: @todo: separate string & symbol props // WORKS 2 FAILS 1?
      expectType<TypeEqual<typeof idxKey, TcommonStringProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // empty options
    const pojsoCommonProps_EmptyOptions_loop = loop2(pojsoCommonProps, {})

    // @-ts-expect-error: @todo: separate string & symbol props // WORKS 2 FAILS 1?
    expectType<TypeEqual<typeof pojsoCommonProps_EmptyOptions_loop, TpojsoCommonProps_DefaultOptions_loop>>(true)
    // @-ts-expect-error: @todo: separate string & symbol props // WORKS 2 FAILS 1?
    expectType<Generator<[TcommonStringProps_values, TcommonStringProps, number]>>(pojsoCommonProps_EmptyOptions_loop)

    for (const [item, idxKey, count] of pojsoCommonProps_EmptyOptions_loop) {
      // @-ts-expect-error: @todo: separate string & symbol props // WORKS 2 FAILS 1?
      expectType<TypeEqual<typeof item, TcommonStringProps_values>>(true)
      // @-ts-expect-error: @todo: separate string & symbol props // WORKS 2 FAILS 1?
      expectType<TypeEqual<typeof idxKey, TcommonStringProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // symbol: false
    const pojsoCommonProps_symbolFalse_loop = loop2(pojsoCommonProps, { symbol: false })

    // @-ts-expect-error: @todo: separate string & symbol props // WORKS 2 FAILS 1?
    expectType<TypeEqual<typeof pojsoCommonProps_symbolFalse_loop, TpojsoCommonProps_DefaultOptions_loop>>(true)
    // @-ts-expect-error: @todo: separate string & symbol props // WORKS 2 FAILS 1?
    expectType<Generator<[TcommonStringProps_values, TcommonStringProps, number]>>(pojsoCommonProps_symbolFalse_loop)

    for (const [item, idxKey, count] of pojsoCommonProps_symbolFalse_loop) {
      // @-ts-expect-error: @todo: separate string & symbol props // WORKS 2 FAILS 1?
      expectType<TypeEqual<typeof item, TcommonStringProps_values>>(true)
      // @-ts-expect-error: @todo: separate string & symbol props // WORKS 2 FAILS 1?
      expectType<TypeEqual<typeof idxKey, TcommonStringProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ## props: true, symbol: false WORKS!
    const pojsoCommonProps_propsTrueSymbolFalse_loop = loop2(pojsoCommonProps, { props: true, symbol: false })

    expectType<TypeEqual<typeof pojsoCommonProps_propsTrueSymbolFalse_loop, TpojsoCommonProps_DefaultOptions_loop>>(true)
    expectType<Generator<[TcommonStringProps_values, TcommonStringProps, number]>>(pojsoCommonProps_propsTrueSymbolFalse_loop)

    for (const [item, idxKey, count] of pojsoCommonProps_propsTrueSymbolFalse_loop) {
      expectType<TypeEqual<typeof item, TcommonStringProps_values>>(true)
      expectType<TypeEqual<typeof idxKey, TcommonStringProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // With symbol: true

    const pojsoWithSymbolLoop = loop2(pojsoCommonProps, {
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

    const objMapTypeChange = loop2(pojsoCommonProps, {
      symbol: true,
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAIL 1 2
        expectType<TypeEqual<typeof item, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAIL 1 2
        expectType<TypeEqual<typeof idxKey, TcommonStringProps | TcommonSymbolProps>>(true)
        expectType<TypeEqual<typeof input, typeof pojsoCommonProps>>(true)
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

    const objMapKeysTypeChange = loop2(pojsoCommonProps, {
      symbol: true,
      mapKeys: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAIL 1 2
        expectType<TypeEqual<typeof item, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAIL 1 2
        expectType<TypeEqual<typeof idxKey, TcommonStringProps | TcommonSymbolProps>>(true)
        expectType<TypeEqual<typeof input, typeof pojsoCommonProps>>(true)
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

    const simpleInstanceLoop = loop2(new SimpleClass())
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

    type TClassWithSymbol_stringValues = string | number
    type TClassWithSymbol_symbolValues = () => true
    type TClassWithSymbol_stringProps = 'aString' | 'aNumber'
    type TClassWithSymbol_symbolProps = typeof symbolProp2

    // string only props & values

    // no options
    const instanceWithSymbol_loop_NoOptions = loop2(new ClassWithSymbol())
    type TinstanceWithSymbol_loop_defaultStringOnlyPropsValues = Generator<[TClassWithSymbol_stringValues, TClassWithSymbol_stringProps, number]>

    expectType<TypeEqual<typeof instanceWithSymbol_loop_NoOptions, TinstanceWithSymbol_loop_defaultStringOnlyPropsValues>>(true)
    for (const [item, idxKey, count] of instanceWithSymbol_loop_NoOptions) {
      expectType<TypeEqual<typeof item, TClassWithSymbol_stringValues>>(true)
      expectType<TypeEqual<typeof idxKey, TClassWithSymbol_stringProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // options props: true (should not matter)
    const instanceWithSymbol_loop_PropsTrue = loop2(new ClassWithSymbol(), { props: true })
    expectType<TypeEqual<typeof instanceWithSymbol_loop_PropsTrue, TinstanceWithSymbol_loop_defaultStringOnlyPropsValues>>(true)
    for (const [item, idxKey, count] of instanceWithSymbol_loop_PropsTrue) {
      expectType<TypeEqual<typeof item, TClassWithSymbol_stringValues>>(true)
      expectType<TypeEqual<typeof idxKey, TClassWithSymbol_stringProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // options props: 'all' (should not matter)
    const instanceWithSymbol_loop_PropsAll = loop2(new ClassWithSymbol(), { props: 'all' })
    expectType<TypeEqual<typeof instanceWithSymbol_loop_PropsAll, TinstanceWithSymbol_loop_defaultStringOnlyPropsValues>>(true)
    for (const [item, idxKey, count] of instanceWithSymbol_loop_PropsAll) {
      expectType<TypeEqual<typeof item, TClassWithSymbol_stringValues>>(true)
      expectType<TypeEqual<typeof idxKey, TClassWithSymbol_stringProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // options props: false (should not matter)
    const instanceWithSymbol_loop_PropsFalse = loop2(new ClassWithSymbol(), { props: false })
    expectType<TypeEqual<typeof instanceWithSymbol_loop_PropsFalse, TinstanceWithSymbol_loop_defaultStringOnlyPropsValues>>(true)
    for (const [item, idxKey, count] of instanceWithSymbol_loop_PropsFalse) {
      expectType<TypeEqual<typeof item, TClassWithSymbol_stringValues>>(true)
      expectType<TypeEqual<typeof idxKey, TClassWithSymbol_stringProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // with symbol: true

    type TinstanceWithSymbol_loop_stringAndSymbolPropsValues = Generator<[TClassWithSymbol_stringValues | TClassWithSymbol_symbolValues, TClassWithSymbol_stringProps | TClassWithSymbol_symbolProps, number]>

    // symbol: true only - both string & symbol
    const instanceWithSymbol_loop_symbolTrue = loop2(new ClassWithSymbol(), { symbol: true })
    expectType<TypeEqual<typeof instanceWithSymbol_loop_symbolTrue, TinstanceWithSymbol_loop_stringAndSymbolPropsValues>>(true)
    for (const [item, idxKey, count] of instanceWithSymbol_loop_symbolTrue) {
      expectType<TypeEqual<typeof item, TClassWithSymbol_stringValues | TClassWithSymbol_symbolValues>>(true)
      expectType<TypeEqual<typeof idxKey, TClassWithSymbol_stringProps | TClassWithSymbol_symbolProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // symbol: true & props: true - both string & symbol
    const instanceWithSymbol_loop_PropsTrueSymbolTrue = loop2(new ClassWithSymbol(), { props: true, symbol: true })
    expectType<TypeEqual<typeof instanceWithSymbol_loop_PropsTrueSymbolTrue, TinstanceWithSymbol_loop_stringAndSymbolPropsValues>>(true)
    for (const [item, idxKey, count] of instanceWithSymbol_loop_PropsTrueSymbolTrue) {
      expectType<TypeEqual<typeof item, TClassWithSymbol_stringValues | TClassWithSymbol_symbolValues>>(true)
      expectType<TypeEqual<typeof idxKey, TClassWithSymbol_stringProps | TClassWithSymbol_symbolProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // symbol: true & props: false (should not matter) - both string & symbol
    const instanceWithSymbol_loop_PropsFalseSymbolTrue = loop2(new ClassWithSymbol(), { props: false, symbol: true })
    expectType<TypeEqual<typeof instanceWithSymbol_loop_PropsFalseSymbolTrue, TinstanceWithSymbol_loop_stringAndSymbolPropsValues>>(true)
    for (const [item, idxKey, count] of instanceWithSymbol_loop_PropsFalseSymbolTrue) {
      expectType<TypeEqual<typeof item, TClassWithSymbol_stringValues | TClassWithSymbol_symbolValues>>(true)
      expectType<TypeEqual<typeof idxKey, TClassWithSymbol_stringProps | TClassWithSymbol_symbolProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // A more real world instance - it looks complicated!

    expectType<Generator<[string | Person | (() => string) | ((classMethodArg: any) => void) | ((instanceMethodArg: any) => void), keyof Person, number]>>(loop2(new Person('foo')))

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
    > = loop2(a_Employee)

    // ### Set ###

    const aSetOfValuesWithCommonProps = get_Set_of_Tvalues_withCommonProps() // props ignored

    const setLoop = loop2(aSetOfValuesWithCommonProps)
    type TsetLoop = Generator<[Tvalues, Tvalues, number]>
    type TSetEntries = ReturnType<typeof aSetOfValuesWithCommonProps.entries>

    expectType<TypeEqual<typeof setLoop, TsetLoop>>(true)

    for (const [item, idxKey, count] of setLoop) {
      expectType<TypeEqual<typeof item, Tvalues>>(true)
      expectType<TypeEqual<typeof idxKey, Tvalues>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Set with map callback & mapReturn type change ###

    const setLoop_map = loop2(aSetOfValuesWithCommonProps, {
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, Tvalues>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, Tvalues>>(true)
        expectType<TypeEqual<typeof input, typeof aSetOfValuesWithCommonProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TsetLoop_map = Generator<[T_NEW_TYPE, T_NEW_TYPE,number]>
    // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAIL 1 2
    expectType<TypeEqual<typeof setLoop_map, TsetLoop_map>>(true)

    // ### Set entries() ###

    const setEntriesLoop = loop2(aSetOfValuesWithCommonProps.entries())
    type TsetEntriesLoop = Generator<[Tvalues, Tvalues, number]>
    expectType<TypeEqual<typeof setEntriesLoop, TsetEntriesLoop>>(true)
    for (const [item, idxKey, count] of setEntriesLoop) {
      expectType<TypeEqual<typeof item, Tvalues>>(true)
      expectType<TypeEqual<typeof idxKey, Tvalues>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Set entries() ###
    // with map callback & mapReturn type change

    const setEntries_map_loop = loop2(aSetOfValuesWithCommonProps.entries(), {
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, Tvalues>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, Tvalues>>(true)
        expectType<TypeEqual<typeof input, TSetEntries>>(true)
        expectType<TypeEqual<typeof input, IterableIterator<[Tvalues, Tvalues]>>>(true)
        expectType<TypeEqual<typeof input, SetIteratorEntries<Tvalues>>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    // @todo: Set is a special case, where Value & Key must be the same - this is not implemented in types
    type TsetEntries_map_loop = Generator<[T_NEW_TYPE, Tvalues, number]>
    expectType<TypeEqual<typeof setEntries_map_loop, TsetEntries_map_loop>>(true)
    for (const [item, idxKey, count] of setEntries_map_loop) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, Tvalues>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Set entries() ###
    // with mapKeys callback & mapKeysReturn type change

    const setEntries_mapKeys_loop = loop2(aSetOfValuesWithCommonProps.entries(), {
      mapKeys: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, Tvalues>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, Tvalues>>(true)
        expectType<TypeEqual<typeof input, TSetEntries>>(true)
        expectType<TypeEqual<typeof input, IterableIterator<[Tvalues, Tvalues]>>>(true)
        expectType<TypeEqual<typeof input, SetIteratorEntries<Tvalues>>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    // @todo(222): Set is a special case, where Value & Key must be the same - this is not implemented in types
    type TsetEntries_mapKeys_loop = Generator<[Tvalues, T_NEW_TYPE,number]>
    expectType<TypeEqual<typeof setEntries_mapKeys_loop, TsetEntries_mapKeys_loop>>(true)
    for (const [item, idxKey, count] of setEntries_mapKeys_loop) {
      expectType<TypeEqual<typeof item, Tvalues>>(true)
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Set with props: true ###

    const setWithPropsLoop = loop2(aSetOfValuesWithCommonProps, { props: true })
    type TsetWithPropsLoop = Generator<[TcommonStringProps_values, TcommonStringProps, number]>
    expectType<TypeEqual<typeof setWithPropsLoop, TsetWithPropsLoop>>(true)

    // ### Set with props: true & symbols: true ###

    const setWithPropsAndSymbolsLoop = loop2(aSetOfValuesWithCommonProps, { props: true, symbol: true })
    type TsetWithPropsAndSymbolsLoop = Generator<[TcommonStringProps_values | TcommonSymbolProps_values, TcommonStringProps | TcommonSymbolProps, number]>
    expectType<TypeEqual<typeof setWithPropsAndSymbolsLoop, TsetWithPropsAndSymbolsLoop>>(true)

    // ### Map ###

    type TaMapItems = 11 | true
    type TaMapKeys = 'aKey' | 999n
    const aMap = new Map(<[TaMapKeys, TaMapItems][]>[
      ['aKey', 11],
      [999n, true],
    ])
    type TaMapType = Map<TaMapKeys, TaMapItems>
    type TaMapEntries = ReturnType<typeof aMap.entries>

    const aMapLoop = loop2(aMap)
    type TaMapLoop = Generator<[TaMapItems, TaMapKeys, number]>
    expectType<TypeEqual<typeof aMapLoop, TaMapLoop>>(true)

    for (const [item, idxKey, count] of aMapLoop) {
      expectType<TypeEqual<typeof item, TaMapItems>>(true)
      expectType<TypeEqual<typeof idxKey, TaMapKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Map with map callback & mapReturn type change ###

    const aMapLoop_map = loop2(aMap, {
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, TaMapItems>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, TaMapKeys>>(true)
        expectType<TypeEqual<typeof input, TaMapType>>(true)
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

    const aMapLoop_mapKeys = loop2(aMap, {
      mapKeys: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, TaMapItems>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, TaMapKeys>>(true)
        expectType<TypeEqual<typeof input, TaMapType>>(true)
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

    const mapWithPropsLoop = loop2(a_Map_of_TMapKeys_Tvalues_WithCommonProps, { props: true })
    type TmapWithPropsLoop = Generator<[TcommonStringProps_values, TcommonStringProps, number]>
    expectType<TypeEqual<typeof mapWithPropsLoop, TmapWithPropsLoop>>(true)

    // ### Set with props: true & symbols: true ###

    const mapWithPropsAndSymbolsLoop = loop2(a_Map_of_TMapKeys_Tvalues_WithCommonProps, { props: true, symbol: true })
    type TmapWithPropsAndSymbolsLoop = Generator<[TcommonStringProps_values | TcommonSymbolProps_values, TcommonStringProps | TcommonSymbolProps, number]>
    expectType<TypeEqual<typeof mapWithPropsAndSymbolsLoop, TmapWithPropsAndSymbolsLoop>>(true)

    // ### Map entries() ###

    const aMapEntriesLoop = loop2(aMap.entries())

    type TaMapEntriesLoop = Generator<[TaMapItems, TaMapKeys, number]>
    expectType<TypeEqual<typeof aMapEntriesLoop, TaMapEntriesLoop>>(true)
    for (const [item, idxKey, count] of aMapEntriesLoop) {
      expectType<TypeEqual<typeof item, TaMapItems>>(true)
      expectType<TypeEqual<typeof idxKey, TaMapKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Map entries() with map callback & mapReturn type change ###
    const aMapEntriesLoop_map = loop2(aMap.entries(), {
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, TaMapItems>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, TaMapKeys>>(true)
        expectType<TypeEqual<typeof input, TaMapEntries>>(true)
        expectType<TypeEqual<typeof input, IterableIterator<[TaMapKeys, TaMapItems]>>>(true)
        expectType<TypeEqual<typeof input, MapIteratorEntries<TaMapKeys, TaMapItems>>>(true)
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
    const aMapEntriesLoop_mapKeys = loop2(aMap.entries(), {
      mapKeys: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, TaMapItems>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, TaMapKeys>>(true)
        expectType<TypeEqual<typeof input, TaMapEntries>>(true)
        expectType<TypeEqual<typeof input, IterableIterator<[TaMapKeys, TaMapItems]>>>(true)
        expectType<TypeEqual<typeof input, MapIteratorEntries<TaMapKeys, TaMapItems>>>(true)
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

    const generatorLoop = loop2(aGenerator)
    type TgeneratorLoop = Generator<[Tvalues, never, number]>
    expectType<TypeEqual<typeof generatorLoop, TgeneratorLoop>>(true)

    for (const [item, idxKey, count] of generatorLoop) {
      expectType<TypeEqual<typeof item, Tvalues>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Generators, with map callback & mapReturn type change ###

    const generatorLoop_map = loop2(aGenerator, {
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, Tvalues>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, never>>(true)
        expectType<TypeEqual<typeof input, TmyGenerator>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TgeneratorLoop_map = Generator<[T_NEW_TYPE, never, number]>
    expectType<TypeEqual<typeof generatorLoop_map, TgeneratorLoop_map>>(true)
    for (const [item, idxKey, count] of generatorLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Generators, with mapKeys callback & mapKeysReturn type change ###

    const generatorLoop_mapKeys = loop2(aGenerator, {
      mapKeys: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, Tvalues>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, never>>(true)
        expectType<TypeEqual<typeof input, TmyGenerator>>(true)
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
    const generatorWithPropsLoop = loop2(generatorWithProps, { props: true })

    type TgeneratorWithPropsLoop = Generator<[TcommonStringProps_values, TcommonStringProps, number]>
    expectType<TypeEqual<typeof generatorWithPropsLoop, TgeneratorWithPropsLoop>>(true)

    for (const [item, idxKey, count] of generatorWithPropsLoop) {
      expectType<TypeEqual<typeof item, TcommonStringProps_values>>(true)
      expectType<TypeEqual<typeof idxKey, TcommonStringProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // props: true but string: false - returns never

    let generatorWithPropsNever: TGeneratorWithCommonProps = get_Generator_of_Tvalues_withCommonProps()
    const generatorWithPropsLoopNever = loop2(generatorWithPropsNever, { props: true, string: false })

    type TgeneratorWithPropsLoopNever = Generator<[never, never, number]>
    expectType<TypeEqual<typeof generatorWithPropsLoopNever, TgeneratorWithPropsLoopNever>>(true)

    for (const [item, idxKey, count] of generatorWithPropsLoopNever) {
      expectType<TypeEqual<typeof item, never>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Generators, as property bag with map callback & mapReturn type change ###

    const generatorWithPropsLoop_map = loop2(generatorWithPropsNever, {
      props: true,
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAILS 1 2
        expectType<TypeEqual<typeof item, TcommonStringProps_values>>(true)
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAILS 1 2
        expectType<TypeEqual<typeof idxKey, TcommonStringProps>>(true)
        expectType<TypeEqual<typeof input, TGeneratorWithCommonProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TgeneratorWithPropsLoop_map = Generator<[T_NEW_TYPE, TcommonStringProps, number]>
    // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
    expectType<TypeEqual<typeof generatorWithPropsLoop_map, TgeneratorWithPropsLoop_map>>(true)
    for (const [item, idxKey, count] of generatorWithPropsLoop_map) {
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof idxKey, TcommonStringProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // // props:true & symbol: true

    let generatorWithPropsSymbol: TGeneratorWithCommonProps = get_Generator_of_Tvalues_withCommonProps()
    const generatorWithPropsSymbolLoop = loop2(generatorWithPropsSymbol, { props: true, symbol: true })

    type TgeneratorWithPropsSymbolLoop = Generator<[TcommonStringProps_values | TcommonSymbolProps_values, TcommonStringProps | TcommonSymbolProps, number]>
    expectType<TypeEqual<typeof generatorWithPropsSymbolLoop, TgeneratorWithPropsSymbolLoop>>(true)

    for (const [item, idxKey, count] of generatorWithPropsSymbolLoop) {
      expectType<TypeEqual<typeof item, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
      expectType<TypeEqual<typeof idxKey, TcommonStringProps | TcommonSymbolProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Generators, as property bag with map callback & mapReturn type change ###

    const generatorWithPropsSymbolLoop_map = loop2(get_Generator_of_Tvalues_withCommonProps(), {
      props: true,
      symbol: true,
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAILS 1 2
        expectType<TypeEqual<typeof item, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAILS 1 2
        expectType<TypeEqual<typeof idxKey, TcommonStringProps | TcommonSymbolProps>>(true)
        expectType<TypeEqual<typeof input, TGeneratorWithCommonProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TgeneratorWithPropsSymbolLoop_map = Generator<[T_NEW_TYPE, TcommonStringProps | TcommonSymbolProps, number]>
    // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
    expectType<TypeEqual<typeof generatorWithPropsSymbolLoop_map, TgeneratorWithPropsSymbolLoop_map>>(true)
    for (const [item, idxKey, count] of generatorWithPropsSymbolLoop_map) {
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof idxKey, TcommonStringProps | TcommonSymbolProps>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Generators, as property bag with mapKeys callback & mapKeysReturn type change ###

    const generatorWithPropsLoop_mapKeys = loop2(get_Generator_of_Tvalues_withCommonProps(), {
      props: true,
      symbol: true,
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      mapKeys: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAIL 1 2
        expectType<TypeEqual<typeof item, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAIL 1 2
        expectType<TypeEqual<typeof idxKey, TcommonStringProps | TcommonSymbolProps>>(true)
        expectType<TypeEqual<typeof input, TGeneratorWithCommonProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TgeneratorWithPropsLoop_mapKeys = Generator<[TcommonStringProps_values | TcommonSymbolProps_values, T_NEW_TYPE,number]>
    // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
    expectType<TypeEqual<typeof generatorWithPropsLoop_mapKeys, TgeneratorWithPropsLoop_mapKeys>>(true)
    for (const [item, idxKey, count] of generatorWithPropsLoop_mapKeys) {
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof item, TcommonStringProps_values | TcommonSymbolProps_values>>(true)
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
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

    const asyncGenLoop = loop2(asyncGen)
    type TasyncGenLoop = AsyncGenerator<[TasyncGenItems, never, number]>
    expectType<TypeEqual<typeof asyncGenLoop, TasyncGenLoop>>(true)

    for await (const [item, idxKey, count] of asyncGenLoop) {
      expectType<TypeEqual<typeof item, TasyncGenItems>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }
    //
    // // explicit typings also work
    // for await (const [item, idx, count] of loop2<
    //   true | string | number, // Titem
    //   AsyncGenerator<true | string | number>
    // >(asyncGen)) {
    //   expectType<TypeEqual<typeof item, true | string | number>>(true)
    //   expectType<TypeEqual<typeof idx, null>>(true)
    //   expectType<TypeEqual<typeof count, number>>(true)
    // }

    // ### Async Generators, with map callback & mapReturn type change ###

    const asyncGenLoop_map = loop2(asyncGen, {
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, TasyncGenItems>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, never>>(true)
        expectType<TypeEqual<typeof input, typeof asyncGen>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TasyncGenLoop_map = AsyncGenerator<[T_NEW_TYPE, never, number]>
    expectType<TypeEqual<typeof asyncGenLoop_map, TasyncGenLoop_map>>(true)
    for await (const [item, idxKey, count] of asyncGenLoop_map) {
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Async Generators, with mapKeys callback & mapKeysReturn type change ###

    const asyncGenLoop_mapKeys = loop2(asyncGen, {
      mapKeys: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof item, TasyncGenItems>>(true)
        // @-ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 2 FAIL 1
        expectType<TypeEqual<typeof idxKey, never>>(true)
        expectType<TypeEqual<typeof input, typeof asyncGen>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TasyncGenLoop_mapKeys = AsyncGenerator<[TasyncGenItems, never, number]>
    expectType<TypeEqual<typeof asyncGenLoop_mapKeys, TasyncGenLoop_mapKeys>>(true)
    for await (const [item, idxKey, count] of asyncGenLoop_mapKeys) {
      expectType<TypeEqual<typeof item, TasyncGenItems>>(true)
      expectType<TypeEqual<typeof idxKey, never>>(true)
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
    const asyncGeneratorPropsLoop = loop2(asyncGeneratorProps, { props: true })
    type TasyncGeneratorPropsLoop = Generator<[TMyAsyncGeneratorWithPropsItems, TMyAsyncGeneratorWithPropsKeys, number]>
    expectType<TypeEqual<typeof asyncGeneratorPropsLoop, TasyncGeneratorPropsLoop>>(true)

    for (const [item, idxKey, count] of asyncGeneratorPropsLoop) {
      expectType<TypeEqual<typeof item, TMyAsyncGeneratorWithPropsItems>>(true)
      expectType<TypeEqual<typeof idxKey, TMyAsyncGeneratorWithPropsKeys>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Async Generators, as property bag with map callback & mapReturn type change ###

    const asyncGeneratorPropsLoop_map = loop2(asyncGeneratorProps, {
      props: true,
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      map: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAIL 1 2
        expectType<TypeEqual<typeof item, TMyAsyncGeneratorWithPropsItems>>(true)
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAIL 1 2
        expectType<TypeEqual<typeof idxKey, TMyAsyncGeneratorWithPropsKeys>>(true)
        expectType<TypeEqual<typeof input, MyAsyncGeneratorWithProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TasyncGeneratorPropsLoop_map = Generator<[T_NEW_TYPE, TMyAsyncGeneratorWithPropsKeys, number]>
    // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
    expectType<TypeEqual<typeof asyncGeneratorPropsLoop_map, TasyncGeneratorPropsLoop_map>>(true)
    // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
    for (const [item, idxKey, count] of asyncGeneratorPropsLoop_map) {
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof idxKey, TMyAsyncGeneratorWithPropsKeys>>(true)
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### Async Generators, as property bag with mapKeys callback & mapKeysReturn type change ###
    const asyncGeneratorPropsLoop_mapKeys = loop2(asyncGeneratorProps, {
      props: true,
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      mapKeys: (item, idxKey, input, count): T_NEW_TYPE =>{
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAILS 1 2
        expectType<TypeEqual<typeof item, TMyAsyncGeneratorWithPropsItems>>(true)
        // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 0 FAILS 1 2
        expectType<TypeEqual<typeof idxKey, TMyAsyncGeneratorWithPropsKeys>>(true)
        expectType<TypeEqual<typeof input, MyAsyncGeneratorWithProps>>(true)
        expectType<TypeEqual<typeof count, number>>(true)

        return NEW_TYPE
      },
    })

    type TasyncGeneratorPropsLoop_mapKeys = Generator<[TMyAsyncGeneratorWithPropsItems, T_NEW_TYPE,number]>
    // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
    expectType<TypeEqual<typeof asyncGeneratorPropsLoop_mapKeys, TasyncGeneratorPropsLoop_mapKeys>>(true)
    // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
    for (const [item, idxKey, count] of asyncGeneratorPropsLoop_mapKeys) {
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof item, TMyAsyncGeneratorWithPropsItems>>(true)
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof idxKey, T_NEW_TYPE>>(true)
      // @ts-expect-error: @todo: fix props: true params for map/filter/callback typings // WORKS 1 FAILS 2
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // # ArrayBuffer ###

    const anArrayBuffer = new ArrayBuffer(8)
    const arrayBufferLoop = loop2(anArrayBuffer, {
      dataViewType: DataViewType.Float32,
    })
    type TarrayBufferLoop = Generator<[number, number, number]>
    expectType<TypeEqual<typeof arrayBufferLoop, TarrayBufferLoop>>(true)
    for (const [item, idxKey, count] of arrayBufferLoop) {
      expectType<TypeEqual<typeof item, number>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    // ### ArrayBuffer, as PropBag ###

    interface IMyArrayBufferWithProps extends ArrayBuffer {
      k: string
      l: boolean
      m: RegExp
    }

    const myArrayBuffer: IMyArrayBufferWithProps = new ArrayBuffer(8) as IMyArrayBufferWithProps

    const myArrayBufferLoop = loop2(myArrayBuffer, {
      dataViewType: DataViewType.Float32,
      props: true,
    })
    type MyArrayBufferWithPropsValues = string | boolean | RegExp
    type MyArrayBufferWithProps = 'k' | 'l' | 'm'
    type TmyArrayBufferLoop = Generator<[MyArrayBufferWithPropsValues, MyArrayBufferWithProps, number]>
    expectType<TypeEqual<typeof myArrayBufferLoop, TmyArrayBufferLoop>>(true)
    for (const [item, idxKey, count] of myArrayBufferLoop) {
      expectType<TypeEqual<typeof item, MyArrayBufferWithPropsValues>>(true)
      expectType<TypeEqual<typeof idxKey, MyArrayBufferWithProps>>(true)
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
    // const classWithStaticLoop = loop2(ClassWithStatic)
    // type TclassWithStaticLoop = Generator<[ClassWithStatic, never, 1]>
    // expectType<TypeEqual<typeof classWithStaticLoop, TclassWithStaticLoop>>(true)
    //
    // for (const [item, idxKey, count] of classWithStaticLoop) {
    //   expectType<TypeEqual<typeof item, string | number | (() => void)>>(true)
    //   expectType<TypeEqual<typeof idxKey, string>>(true)
    //   expectType<TypeEqual<typeof count, number>>(true)
    // }

    // ### Classes, with static member variables, treated like function
    // with map callback & mapReturn type change ###

    // ### LOW PRIORITY, HARD, NOT WORTH IT ###
    // ### Mixed value types: @todo(111): mixed item types dont work, unless type is known. We need to consolidate loop typings, which seems very hard! ###

    let arrayOrSet: number[] | Set<string | boolean>

    arrayOrSet = new Set(['1, 2, 3']) // commenting this BREAKS
    for (const [item, idxKey, count] of loop2(arrayOrSet)) {
      expectType<TypeEqual<typeof item, boolean | string>>(true)
      expectType<TypeEqual<typeof idxKey, boolean | string>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }

    arrayOrSet = [1, 2, 3] // commenting this BREAKS
    for (const [item, idxKey, count] of loop2(arrayOrSet)) {
      expectType<TypeEqual<typeof item, number>>(true)
      expectType<TypeEqual<typeof idxKey, number>>(true)
      expectType<TypeEqual<typeof count, number>>(true)
    }
  })
})
