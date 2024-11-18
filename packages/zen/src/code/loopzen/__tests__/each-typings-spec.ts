// @-ts-nocheck
import * as _ from 'lodash'
import { expectType, TypeEqual } from 'ts-expect'
import { equalSetDeep } from '../../../test-utils/specHelpers'
import {
  a_Array_of_Tvalues,
  a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  a_Employee,
  a_Map_of_TMapKeys_Tvalues_WithCommonProps,
  Employee,
  get_Generator_of_Tvalues,
  get_Generator_of_Tvalues_withCommonProps,
  get_Set_of_Tvalues_withCommonProps, NEW_TYPE,
  Person,
  pojsoCommonProps,
  symbolProp2, T_NEW_TYPE,
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
import { each } from '../each'

import { ILoopOptions, loop, LOOP_SYMBOL, AsyncLoopGenerator, LoopGenerator, LoopKeys, LoopValues } from '../loop'

const emptyTypedIloopOptions: ILoopOptions = {}

/**
 * The **real typings tests**, for all functions (keys, values, loop, each, map, clone, filter, take), across all options, and across all different inputs, are in `__tests__/all-typings`.
 *
 * These are auxiliary smoke tests for internals, like `LoopValues` and `LoopKeys`, and/or for open issues/specific cases/docs that are not covered in the main tests.
 *
 * @todo(111): move to all-typings also?
 */
describe(`Each Typings tests`, () => {
  it(`@todo(333): fails to pass types of mapped items/keys `, () => {
    const inputValue1 = a_Array_of_Tvalues_withCommonAndArrayExtraProps
    const result_values: any[] = []
    const result_keys: any[] = []
    const eachResultArray = each(
      inputValue1,
      (item, idxKey, initialValue) => {
        // @ts-expect-error // @todo(333): fix this
        expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
        result_values.push(item) // item is T_NEW_TYPE here, cause of map() below
        result_keys.push(idxKey)
      },
      {
        map: (item, idx, input) => {
          expectType<TypeEqual<typeof item, Tvalues>>(true)
          return NEW_TYPE
        },
      }
    )
    expectType<TypeEqual<typeof eachResultArray, typeof inputValue1>>(true)

    equalSetDeep(
      result_values,
      a_Array_of_Tvalues.map(() => NEW_TYPE)
    ) // actual runtime values work fine!
    equalSetDeep(result_keys, _.times(a_Array_of_Tvalues.length))

    // When fixed, it should work in all-typings like this:
    //
    //
    // it(`each() @todo(333): fails to pass types of mapped items/keys`, async () => {
    //   const result_values: any[] = []
    //   const result_keys: any[] = []
    //   const result = each(
    //     getInput(),
    //     (item, idxKey, initialValue) => {
    //       // @ts-expect-error // @todo(333): fix this
    //       expectType<TypeEqual<typeof item, T_NEW_TYPE>>(true)
    //       result_values.push(item) // item is T_NEW_TYPE here, cause of map() below
    //       result_keys.push(idxKey)
    //     },
    //     {
    //       map: (item, idxKey, input, count) => {
    //         expectType<TypeEqual<typeof item, Texpected_iteration_items>>(true)
    //         expectType<TypeEqual<typeof idxKey, Texpected_iteration_keys>>(true)
    //         expectType<TypeEqual<typeof input, Tinput>>(true)
    //         expectType<TypeEqual<typeof count, number>>(true) // @todo: should be Tcount (1 for Singles)
    //
    //         return NEW_TYPE
    //       },
    //     }
    //   )
    //   expectType<TypeEqual<typeof result, /**Promise**/ Tinput>>(true)
    //
    //   /**await**/ result
    //
    //   equalSetDeep(
    //     result_values,
    //     expected_iteration_items.map(() => NEW_TYPE)
    //   ) // actual runtime values work fine!
    //   equalSetDeep(result_keys, expected_iteration_keys)
    // })
  })
})
