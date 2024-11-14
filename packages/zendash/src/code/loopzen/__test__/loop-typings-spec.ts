// @-ts-nocheck
import * as _ from 'lodash'
import { expectType, TypeEqual } from 'ts-expect'
import {
  a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  a_Employee,
  a_Map_of_TMapKeys_Tvalues_WithCommonProps,
  Employee,
  get_Generator_of_Tvalues,
  get_Generator_of_Tvalues_withCommonProps,
  get_Set_of_Tvalues_withCommonProps,
  Person,
  pojsoCommonProps,
  symbolProp2,
  TarrayAndCommonStringProps,
  TarrayAndCommonStringProps_values,
  TcommonStringProps,
  TcommonStringProps_values,
  TcommonSymbolProps,
  TcommonSymbolProps_values,
  TGeneratorWithCommonProps,
  TmyGenerator,
  Tvalues,
} from '../../../test-utils/test-data'
import { MapIteratorEntries } from '../../typezen/isMapIterator'
import { SetIteratorEntries } from '../../typezen/isSetIterator'
import { DataViewType } from '../ArrayBufferCursor'

import { ILoopOptions, loop, LOOP_SYMBOL, AsyncLoopGenerator, LoopGenerator, LoopKeys, LoopValues } from '../loop'

const emptyTypedIloopOptions: ILoopOptions = {}

/**
 * The **real typings tests**, for all functions (keys, values, loop, each, map, clone, filter, take), across all options and across all different inputs, are in `__test__/all-typings`.
 *
 * These are auxiliary smoke tests for internals, like `LoopValues` and `LoopKeys`, and/or for open issues/specific cases/docs that are not covered in the main tests.
 */
describe(`Loop Typings tests`, () => {
  // @todo(111): move to all-typings also? Probably not needed/matters
  describe(`type LoopKeys / LoopValues`, () => {
    describe(`props: false: Nested Keys & Values`, () => {
      it(`empty options, defaults`, () => {
        type ResultedLoopKeys = LoopKeys<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, {}>
        expectType<TypeEqual<ResultedLoopKeys, number>>(true)

        type ResultedLoopValues = LoopValues<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, {}>
        expectType<TypeEqual<ResultedLoopValues, Tvalues>>(true)
      })

      it(`props: false - default`, () => {
        type ResultedLoopKeys = LoopKeys<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, { props: false }>
        expectType<TypeEqual<ResultedLoopKeys, number>>(true)

        type ResultedLoopValues = LoopValues<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, { props: false }>
        expectType<TypeEqual<ResultedLoopValues, Tvalues>>(true)
      })

      it(`props: undefined - default`, () => {
        type ResultedLoopKeys = LoopKeys<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, { props: undefined }>
        expectType<TypeEqual<ResultedLoopKeys, number>>(true)

        type ResultedLoopValues = LoopValues<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, { props: undefined }>
        expectType<TypeEqual<ResultedLoopValues, Tvalues>>(true)
      })
    })

    describe(`props: true: props & props values`, () => {
      it(`props: true`, () => {
        type ResultedLoopKeys = LoopKeys<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, { props: true }>
        expectType<TypeEqual<ResultedLoopKeys, TarrayAndCommonStringProps>>(true)

        type ResultedLoopValues = LoopValues<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, { props: true }>
        expectType<TypeEqual<ResultedLoopValues, TarrayAndCommonStringProps_values>>(true)
      })

      it(`props: true, symbol: true`, () => {
        type ResultedLoopKeys = LoopKeys<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, { props: true; symbol: true }>
        expectType<TypeEqual<ResultedLoopKeys, TarrayAndCommonStringProps | TcommonSymbolProps>>(true)

        type ResultedLoopValues = LoopValues<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, { props: true; symbol: true }>
        expectType<TypeEqual<ResultedLoopValues, TarrayAndCommonStringProps_values | TcommonSymbolProps_values>>(true)
      })
    })

    describe(`props: 'all': Nested Keys & Values & props & props values`, () => {
      it(`props: 'all'`, () => {
        type ResultedLoopKeys = LoopKeys<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, { props: 'all' }>
        expectType<TypeEqual<ResultedLoopKeys, TarrayAndCommonStringProps | number>>(true)

        type ResultedLoopValues = LoopValues<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, { props: 'all' }>
        expectType<TypeEqual<ResultedLoopValues, TarrayAndCommonStringProps_values | Tvalues>>(true)
      })

      it(`props: 'all', symbol: true`, () => {
        type ResultedLoopKeys = LoopKeys<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, { props: 'all'; symbol: true }>
        expectType<TypeEqual<ResultedLoopKeys, TarrayAndCommonStringProps | TcommonSymbolProps | number>>(true)

        type ResultedLoopValues = LoopValues<typeof a_Array_of_Tvalues_withCommonAndArrayExtraProps, { props: 'all'; symbol: true }>
        expectType<TypeEqual<ResultedLoopValues, TarrayAndCommonStringProps_values | TcommonSymbolProps_values | Tvalues>>(true)
      })
    })
  })
})
