import * as chai from 'chai'
import * as _ from 'lodash'
import { LogZenMini } from '../../LogZenMini'
import { fillArrayEmptySlotsWithZeros } from '../../../test-utils/misc'
import { deepEqual, equalSetDeep } from '../../../test-utils/specHelpers'
import {
  a_Array_of_Tvalues,
  a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  a_childObj,
  a_Employee,
  a_Function_withProps,
  a_Generator_of_Tvalues,
  a_Generator_of_Tvalues_withCommonProps,
  a_Map_of_TMapKeys_Tvalues,
  a_Map_of_TMapKeys_Tvalues_WithCommonProps,
  a_Person,
  a_Set_of_Tvalues,
  a_Set_of_Tvalues_withCommonProps,
  a_sparseArray_of_Tvalues_and_extras_values,
  a_sparseArray_of_Tvalues_and_extras_withCommonAndExtraProps,
  a_TypedArray_BigInt64Array,
  a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps,
  a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
  add_CommonProps,
  arrayAndCommonStringProps_values,
  commonStringProps_values,
  commonSymbolProps_values,
  Employee,
  employee_stringNonEnumerablesInherited,
  employee_symbolNonEnumerablesInherited,
  employeeStringProps,
  employeeSymbolProps,
  get_Array_of_bigints,
  get_Array_of_numbers,
  get_arrayBuffer_Uint16,
  get_arrayBuffer_Uint8,
  get_TypedArray_Int32Array,
  noPropsKeysOptionsUntyped,
  person_stringNonEnumerablesInherited,
  person_stringNonEnumerablesInherited_values,
  person_symbolNonEnumerablesInherited,
  person_symbolNonEnumerablesInherited_values,
  personStringProps,
  personStringProps_values,
  personSymbolProps,
  personSymbolProps_values,
  symbolProp,
} from '../../../test-utils/test-data'
import { type } from '../../typezen/type'
import {
  array_prototype_stringNonEnumerablesInherited,
  array_prototype_stringNonEnumerablesInherited_ES2023,
  array_prototype_stringNonEnumerablesOwn,
  array_prototype_symbolNonEnumerablesInherited,
  map_prototype_stringNonEnumerablesInherited,
  map_prototype_symbolNonEnumerablesInherited,
  object_stringNonEnumerablesInheritedTop,
  object_stringNonEnumerablesInheritedTop_values,
  set_prototype_stringNonEnumerablesInherited,
  set_prototype_symbolNonEnumerablesInherited,
  typedArray_prototype_stringNonEnumerablesInherited,
  typedArray_prototype_stringNonEnumerablesInherited_ES2023,
  typedArray_prototype_stringNonEnumerablesOwn,
  typedArray_prototype_symbolNonEnumerablesInherited,
} from '../../typezen/types-info'
import { DATA_VIEW_TYPE_BYTES_USED } from '../ArrayBufferCursor'

import { IKeysOptions } from '../keys'
import { values } from '../values'

const { expect } = chai
const l = new LogZenMini()

// NOTE: defaults apply to all tests
const defaultOptions: IKeysOptions = {}

describe('values.spec - behavioural/implementation, no types check', () => {
  _.each(
    <[string, IKeysOptions, any, (string | symbol)[]][]>[
      // primitive values
      ['undefined', {}, undefined, []],
      ['null', {}, null, []],
      ['number', {}, 111, []],
      ['string', {}, 'a string', []],
      ['boolean', {}, true, []],
      ['symbol', {}, Symbol('someLabel'), []],
      // [
      //   `Symbol can't have extra props: TypeError: Cannot create property 'someProp' on symbol`,
      //   { symbol: true },
      //   (() => {
      //     const aSymbol = Symbol('someLabel')
      //     aSymbol['someProp'] = 'some value'
      //     aSymbol[Symbol.for('symbolKey')] = 'some value'
      //
      //     return aSymbol
      //   })(),
      //   ['someProp', Symbol.for('symbolKey')],
      // ],

      ['bigint', {}, BigInt(123_456_789), []],
      // [
      //   `bigint can't have extra props: TypeError: Cannot create property 'someProp' on bigint`,
      //   { symbol: true },
      //   (() => {
      //     const bigInt = BigInt(123_456_789)
      //     bigInt['someProp'] = 'some value'
      //     bigInt[Symbol.for('symbolKey')] = 'some value'
      //     return bigInt
      //   })(),
      //   ['someProp', Symbol.for('symbolKey')],
      // ],

      // Boxed values with no props

      ['Boolean', {}, new Boolean(true), []],
      ['Number', {}, new Number(111), []],
      ['String', {}, new String('aaaa'), []],

      // Boxed values with extra props

      [
        'Boolean, with extra props',
        { symbol: true },
        (() => {
          const b: any = new Boolean(true)
          b['someProp'] = 'some value 1'
          b[Symbol.for('symbolKey')] = 'some value 2'
          return b
        })(),
        ['some value 1', 'some value 2'],
      ],
      [
        'Number, with extra props',
        { symbol: true },
        (() => {
          const num: any = new Number(111)
          num['someProp'] = 'some value 1'
          num[Symbol.for('symbolKey')] = 'some value 2'
          return num
        })(),
        ['some value 1', 'some value 2'],
      ],
      [
        'String, with extra props',
        { symbol: true },
        (() => {
          const str: any = new String('someString')
          str['someProp'] = 'some value 1'
          str[Symbol.for('symbolKey')] = 'some value 2'
          const key: string = '1984'
          str[key] = 'stringKey value 3'
          return str
        })(),
        ['some value 1', 'some value 2', 'stringKey value 3'],
      ],

      // # Array, with or without props

      [
        'An Array, with extra props but props: false (default). Returns only natural values',
        {},
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        a_Array_of_Tvalues,
      ],
      [
        'An Array, with extra props but props: false, while all other options exist. Returns only numeric also, like above',
        noPropsKeysOptionsUntyped,
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        a_Array_of_Tvalues,
      ],
      [
        `An Array, with props: 'all', listing all natural array Tvalues & props (excluding symbols)`,
        { props: 'all' },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [...arrayAndCommonStringProps_values, ...a_Array_of_Tvalues],
      ],
      [
        `An Array, with props: true, props & symbol true`,
        { props: true, symbol: true },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [...arrayAndCommonStringProps_values, ...commonSymbolProps_values],
      ],

      // # Array, with extra props & nonEnumerables / inherited / top

      [
        `An Array with extra props: nonEnumerables brings 'length' {props: true, symbols: true, nonEnumerables: true, inherited: false | undefined }. Returns no base-type props except 'length' + Common Props (cause inherited: false)`,
        { props: true, symbol: true, nonEnumerables: true, inherited: false },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [
          ...arrayAndCommonStringProps_values,
          ...commonSymbolProps_values,
          ...array_prototype_stringNonEnumerablesOwn.map(
            (k) => a_Array_of_Tvalues_withCommonAndArrayExtraProps[k]
          ),
        ],
      ],
      [
        `An Array with extra props: nonEnumerables: false and inherited & top alone as true bring nothing extra {props: true, symbols: true, nonEnumerables: false, inherited: true, top: true}. Returns no extra base-type props, only Common Props (cause nonEnumerables: false)`,
        { props: true, symbol: true, nonEnumerables: false, inherited: true, top: true },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [...arrayAndCommonStringProps_values, ...commonSymbolProps_values],
      ],
      [
        `An Array with extra props: ALL string { props: true, symbols: false, nonEnumerables: true, inherited: true }. Returns all string keys including base-type inherited & non-enumerables props of Array`,
        { props: true, symbol: false, nonEnumerables: true, inherited: true },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [
          ...arrayAndCommonStringProps_values,
          ...array_prototype_stringNonEnumerablesInherited.map(
            (k) => a_Array_of_Tvalues_withCommonAndArrayExtraProps[k]
          ),
          ...(([] as any).findLastIndex
            ? array_prototype_stringNonEnumerablesInherited_ES2023.map(
                (k) => a_Array_of_Tvalues_withCommonAndArrayExtraProps[k]
              )
            : []), // optional, depending on runtime
        ],
      ],
      [
        `An Array with extra props: ALL (except top) { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Array`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [
          ...arrayAndCommonStringProps_values,
          ...commonSymbolProps_values,
          ...array_prototype_stringNonEnumerablesInherited.map(
            (k) => a_Array_of_Tvalues_withCommonAndArrayExtraProps[k]
          ),
          ...array_prototype_symbolNonEnumerablesInherited.map(
            (k) => a_Array_of_Tvalues_withCommonAndArrayExtraProps[k]
          ),
          ...(([] as any).findLastIndex
            ? array_prototype_stringNonEnumerablesInherited_ES2023.map(
                (k) => a_Array_of_Tvalues_withCommonAndArrayExtraProps[k]
              )
            : []), // optional, depending on runtime
        ],
      ],
      [
        `An Array with extra props: ALL & top { props: true, symbols: true, nonEnumerables: true, inherited: true, top: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Array`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true, top: true },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [
          ...arrayAndCommonStringProps_values,
          ...commonSymbolProps_values,
          ...array_prototype_stringNonEnumerablesInherited.map(
            (k) => a_Array_of_Tvalues_withCommonAndArrayExtraProps[k]
          ),
          ...array_prototype_symbolNonEnumerablesInherited.map(
            (k) => a_Array_of_Tvalues_withCommonAndArrayExtraProps[k]
          ),
          ...(([] as any).findLastIndex
            ? array_prototype_stringNonEnumerablesInherited_ES2023.map(
                (k) => a_Array_of_Tvalues_withCommonAndArrayExtraProps[k]
              )
            : []), // optional, depending on runtime
          ...object_stringNonEnumerablesInheritedTop.map(
            (k) => a_Array_of_Tvalues_withCommonAndArrayExtraProps[k]
          ),
        ],
      ],
      [
        `An Array with extra props: NOT own, only inherited { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Array`,
        { own: false, props: true, symbol: true, nonEnumerables: true, inherited: true },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [
          ...array_prototype_stringNonEnumerablesInherited.map(
            (k) => a_Array_of_Tvalues_withCommonAndArrayExtraProps[k]
          ),
          ...array_prototype_symbolNonEnumerablesInherited.map(
            (k) => a_Array_of_Tvalues_withCommonAndArrayExtraProps[k]
          ),
          ...(([] as any).findLastIndex
            ? array_prototype_stringNonEnumerablesInherited_ES2023.map(
                (k) => a_Array_of_Tvalues_withCommonAndArrayExtraProps[k]
              )
            : []), // optional, depending on runtime
        ],
      ],
      [
        `An Array with extra props: NOT own & non-enumerables, only inherited { props: true, symbols: true, nonEnumerables: false, inherited: true }. Returns empty array!`,
        { own: false, props: true, symbol: true, nonEnumerables: false, inherited: true },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [],
      ],

      // Sparse Arrays

      [
        'A sparse Array',
        {},
        a_sparseArray_of_Tvalues_and_extras_withCommonAndExtraProps,
        a_sparseArray_of_Tvalues_and_extras_values,
      ],
      [
        `An Array, with extra props & props: 'all'. Non positive numbers ones are considered as props`,
        { props: 'all' },
        a_sparseArray_of_Tvalues_and_extras_withCommonAndExtraProps,
        [...arrayAndCommonStringProps_values, ...a_sparseArray_of_Tvalues_and_extras_values],
      ],
      [
        `'An Array, with extra props & props: 'all', listing all keys including symbols`,
        { props: 'all', symbol: true },
        a_sparseArray_of_Tvalues_and_extras_withCommonAndExtraProps,
        [
          // props
          ...arrayAndCommonStringProps_values,
          ...commonSymbolProps_values,
          ...a_sparseArray_of_Tvalues_and_extras_values,
        ],
      ],
      [
        `An Array, with extra props & props: true, listing all keys including symbols`,
        { props: true, symbol: true },
        a_sparseArray_of_Tvalues_and_extras_withCommonAndExtraProps,
        [...arrayAndCommonStringProps_values, ...commonSymbolProps_values],
      ],

      // # TypedArray of number, with or without props

      ['A TypedArray of number', {}, get_TypedArray_Int32Array(), get_Array_of_numbers()],
      [
        'A TypedArray of number, with extra props but props: false. Non positive numbers ones are ignored because of props: false',
        {},
        a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        get_Array_of_numbers(),
      ],
      [
        `A TypedArray of number with props: 'all', listing all indexes & keys (excluding symbols)`,
        { props: 'all' },
        a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...get_Array_of_numbers(),
        ],
      ],
      [
        `A TypedArray of number with props: true (only), listing props: 'only' (including symbols)`,
        { props: true, symbol: true },
        a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...commonSymbolProps_values,
        ],
      ],

      // # TypedArray, with extra props & nonEnumerables / inherited / top

      [
        `A TypedArray with extra props: nonEnumerables brings 'length' {props: true, symbols: true, nonEnumerables: true, inherited: false | undefined }. Returns no base-type props except 'length' + Common Props (cause inherited: false)`,
        { props: true, symbol: true, nonEnumerables: true, inherited: false },
        a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...commonSymbolProps_values,
          ...typedArray_prototype_stringNonEnumerablesOwn,
        ],
      ],
      [
        `A TypedArray with extra props: nonEnumerables: false and inherited & top alone as true bring nothing extra {props: true, symbols: true, nonEnumerables: false, inherited: true, top: true}. Returns no extra base-type props, only Common Props (cause nonEnumerables: false)`,
        { props: true, symbol: true, nonEnumerables: false, inherited: true, top: true },
        a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...commonSymbolProps_values,
        ],
      ],
      [
        `A TypedArray with extra props: ALL string { props: true, symbols: false, nonEnumerables: true, inherited: true }. Returns all string keys including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: false, nonEnumerables: true, inherited: true },
        a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...[
            ...typedArray_prototype_stringNonEnumerablesInherited,
            ...(([] as any).findLastIndex // optional, depending on runtime
              ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
              : []),
          ].map((k) => a_TypedArray_Int32Array_withCommonAndArrayExtraProps[k]),
        ],
      ],
      [
        `A TypedArray with extra props: ALL (except top) { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true },
        a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...commonSymbolProps_values,
          ...[
            ...typedArray_prototype_stringNonEnumerablesInherited,
            ...typedArray_prototype_symbolNonEnumerablesInherited,
            ...(([] as any).findLastIndex // optional, depending on runtime
              ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
              : []),
          ].map((k) => a_TypedArray_Int32Array_withCommonAndArrayExtraProps[k]),
        ],
      ],
      [
        `A TypedArray with extra props: ALL & top { props: true, symbols: true, nonEnumerables: true, inherited: true, top: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true, top: true },
        a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...commonSymbolProps_values,
          ...[
            ...object_stringNonEnumerablesInheritedTop,
            ...typedArray_prototype_stringNonEnumerablesInherited,
            ...typedArray_prototype_symbolNonEnumerablesInherited,
            ...(([] as any).findLastIndex // optional, depending on runtime
              ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
              : []),
          ].map((k) => a_TypedArray_Int32Array_withCommonAndArrayExtraProps[k]),
        ],
      ],
      [
        `A TypedArray with extra props: NOT own, only inherited { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { own: false, props: true, symbol: true, nonEnumerables: true, inherited: true },
        a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        [
          ...typedArray_prototype_stringNonEnumerablesInherited,
          ...typedArray_prototype_symbolNonEnumerablesInherited,
          ...(([] as any).findLastIndex
            ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
            : []), // optional, depending on runtime
        ].map((k) => a_TypedArray_Int32Array_withCommonAndArrayExtraProps[k]),
      ],
      [
        `A TypedArray with extra props: NOT own & non-enumerables, only inherited { props: true, symbols: true, nonEnumerables: false, inherited: true }. Returns empty array!`,
        { own: false, props: true, symbol: true, nonEnumerables: false, inherited: true },
        a_TypedArray_Int32Array_withCommonAndArrayExtraProps,
        [],
      ],

      // # TypedArray of BigInt

      ['A TypedArray of bigint', {}, a_TypedArray_BigInt64Array, get_Array_of_bigints()],
      [
        'A TypedArray of bigint, with extra props but props: false. Non positive numbers ones are ignored because of props: false',
        {},
        a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps,
        get_Array_of_bigints(),
      ],
      [
        `A TypedArray of bigint with props: 'all', listing all indexes & keys (excluding symbols)`,
        { props: 'all' },
        a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...get_Array_of_bigints(),
        ],
      ],
      [
        `A TypedArray of bigint with props: true (only), listing props: true ('only'), including symbols`,
        { props: true, symbol: true },
        a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...commonSymbolProps_values,
        ],
      ],

      // # TypedArray, with extra props & nonEnumerables / inherited / top

      [
        `A TypedArray with extra props: nonEnumerables brings 'length' {props: true, symbols: true, nonEnumerables: true, inherited: false | undefined }. Returns no base-type props except 'length' + Common Props (cause inherited: false)`,
        { props: true, symbol: true, nonEnumerables: true, inherited: false },
        a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...commonSymbolProps_values,
          ...typedArray_prototype_stringNonEnumerablesOwn.map(
            (k) => a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps[k]
          ),
        ],
      ],
      [
        `A TypedArray with extra props: nonEnumerables: false and inherited & top alone as true bring nothing extra {props: true, symbols: true, nonEnumerables: false, inherited: true, top: true}. Returns no extra base-type props, only Common Props (cause nonEnumerables: false)`,
        { props: true, symbol: true, nonEnumerables: false, inherited: true, top: true },
        a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...commonSymbolProps_values,
        ],
      ],
      [
        `A TypedArray with extra props: ALL string { props: true, symbols: false, nonEnumerables: true, inherited: true }. Returns all string keys including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: false, nonEnumerables: true, inherited: true },
        a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...[
            ...typedArray_prototype_stringNonEnumerablesInherited,
            ...(([] as any).findLastIndex // optional, depending on runtime
              ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
              : []),
          ].map((k) => a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps[k]),
        ],
      ],
      [
        `A TypedArray with extra props: ALL (except top) { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true },
        a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...commonSymbolProps_values,
          ...[
            ...typedArray_prototype_stringNonEnumerablesInherited,
            ...typedArray_prototype_symbolNonEnumerablesInherited,
            ...(([] as any).findLastIndex // optional, depending on runtime
              ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
              : []),
          ].map((k) => a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps[k]),
        ],
      ],
      [
        `A TypedArray with extra props: ALL & top { props: true, symbols: true, nonEnumerables: true, inherited: true, top: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true, top: true },
        a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...commonSymbolProps_values,

          ...[
            ...object_stringNonEnumerablesInheritedTop,
            ...typedArray_prototype_stringNonEnumerablesInherited,
            ...typedArray_prototype_symbolNonEnumerablesInherited,
            ...(([] as any).findLastIndex // optional, depending on runtime
              ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
              : []),
          ].map((k) => a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps[k]),
        ],
      ],
      [
        `A TypedArray with extra props: NOT own, only inherited { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { own: false, props: true, symbol: true, nonEnumerables: true, inherited: true },
        a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps,
        [
          ...typedArray_prototype_stringNonEnumerablesInherited,
          ...typedArray_prototype_symbolNonEnumerablesInherited,
          ...(([] as any).findLastIndex // optional, depending on runtime
            ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
            : []),
        ].map((k) => a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps[k]),
      ],
      [
        `A TypedArray with extra props: NOT own & non-enumerables, only inherited { props: true, symbols: true, nonEnumerables: false, inherited: true }. Returns empty array!`,
        { own: false, props: true, symbol: true, nonEnumerables: false, inherited: true },
        a_TypedArray_BigInt64Array_withCommonAndArrayExtraProps,
        [],
      ],

      // # ArrayBuffer

      [
        'A ArrayBuffer - throws if no dataViewType is passed',
        {},
        get_arrayBuffer_Uint8(),
        new Error(
          `z.values(): options.dataViewType is required to loop over an ArrayBuffer to pick its nested values()`
        ),
      ],

      // A ArrayBuffer Uint8 (1 byte per number stored in the ArrayBuffer)

      [
        'A ArrayBuffer Uint8 - gets only the nested values of the ArrayBuffer',
        { dataViewType: 'Uint8', _exactEquality: true },
        get_arrayBuffer_Uint8(),
        fillArrayEmptySlotsWithZeros(
          get_Array_of_numbers(),
          get_arrayBuffer_Uint8().byteLength / DATA_VIEW_TYPE_BYTES_USED.Uint8
        ),
      ],
      [
        'A ArrayBuffer Uint8with props, but props: false, gets only the nested values of the ArrayBuffer',
        { dataViewType: 'Uint8', _exactEquality: true },
        add_CommonProps(get_arrayBuffer_Uint8()),
        fillArrayEmptySlotsWithZeros(
          get_Array_of_numbers(),
          get_arrayBuffer_Uint8().byteLength / DATA_VIEW_TYPE_BYTES_USED.Uint8
        ),
      ],
      [
        'A ArrayBuffer Uint8with props, with props: true, gets only props values',
        { props: true, dataViewType: 'Uint8', _exactEquality: true },
        add_CommonProps(get_arrayBuffer_Uint8()),
        [...commonStringProps_values],
      ],
      [
        `A ArrayBuffer Uint8with props, with props: 'all', gets only props values`,
        { props: 'all', dataViewType: 'Uint8', _exactEquality: true },
        add_CommonProps(get_arrayBuffer_Uint8()),
        [
          ...fillArrayEmptySlotsWithZeros(
            get_Array_of_numbers(),
            get_arrayBuffer_Uint8().byteLength / DATA_VIEW_TYPE_BYTES_USED.Uint8
          ),
          ...commonStringProps_values,
        ],
      ],

      // A ArrayBuffer Uint16 (2 bytes per number stored in the ArrayBuffer)

      [
        'A ArrayBuffer Uint16 - gets only the nested values of the ArrayBuffer',
        { dataViewType: 'Uint16', _exactEquality: true },
        get_arrayBuffer_Uint16(),
        fillArrayEmptySlotsWithZeros(
          get_Array_of_numbers(),
          get_arrayBuffer_Uint16().byteLength / DATA_VIEW_TYPE_BYTES_USED.Uint16
        ),
      ],
      [
        'A ArrayBuffer Uint16with props, but props: false, gets only the nested values of the ArrayBuffer',
        { dataViewType: 'Uint16', _exactEquality: true },
        add_CommonProps(get_arrayBuffer_Uint16()),
        fillArrayEmptySlotsWithZeros(
          get_Array_of_numbers(),
          get_arrayBuffer_Uint16().byteLength / DATA_VIEW_TYPE_BYTES_USED.Uint16
        ),
      ],
      [
        'A ArrayBuffer Uint16with props, with props: true, gets only props values',
        { props: true, dataViewType: 'Uint16', _exactEquality: true },
        add_CommonProps(get_arrayBuffer_Uint16()),
        [...commonStringProps_values],
      ],
      [
        `A ArrayBuffer Uint16with props, with props: 'all', gets only props values`,
        { props: 'all', dataViewType: 'Uint16', _exactEquality: true },
        add_CommonProps(get_arrayBuffer_Uint16()),
        [
          ...fillArrayEmptySlotsWithZeros(
            get_Array_of_numbers(),
            get_arrayBuffer_Uint16().byteLength / DATA_VIEW_TYPE_BYTES_USED.Uint16
          ),
          ...commonStringProps_values,
        ],
      ],

      // # Objects

      ['An empty object', {}, {}, []],
      ['A simple pojso', {}, { a: 11, b: 22 }, [11, 22]],
      [
        'A pojso created via Object.create(null)',
        { symbol: true },
        (() => {
          const obj = Object.create(null)
          obj.a = 11
          obj.b = 22
          obj[symbolProp] = 'some value'

          return obj
        })(),
        [11, 22, 'some value'],
      ],
      [
        'A pojso created via Object.create({})',
        { symbol: true },
        (() => {
          const obj = Object.create({ notOWN_wont_be_in_result: 3 }) // not OWN
          obj.a = 11
          obj.b = 22
          obj[symbolProp] = 'some value'

          return obj
        })(),
        [11, 22, 'some value'],
      ],
      [
        'A pojso object, defaults, only own string props values',
        {},
        a_childObj,
        [11, 22, 'A String', 'tooBad rejected child String'],
      ],
      [
        'A pojso object, iherited: true',
        { inherited: true },
        a_childObj,
        [
          // own
          11,
          22,
          'A String',
          'tooBad rejected child String',

          // parent, inherited
          1,
          2,
          'A String',
          'tooBad rejected parent String',
        ],
      ],
      [
        'A pojso object: inherited keys, including symbols',
        { inherited: true, symbol: true },
        a_childObj,
        [
          // own
          11,
          22,
          'A String',
          'tooBad rejected child String',
          'childObjSymbol1 Value',
          'tooBad_childObjSymbol2 rejected child Value',

          // parent, inherited
          1,
          2,
          'A String',
          'tooBad rejected parent String',
          'parentObjSymbol1 Value',
          'tooBad_parentObjSymbol rejected parent Value',
        ],
      ],
      [
        'A pojso object: only inherited keys, not own!',
        { inherited: true, own: false, symbol: true },
        a_childObj,
        [
          1,
          2,
          'A String',
          'tooBad rejected parent String',
          'parentObjSymbol1 Value',
          'tooBad_parentObjSymbol rejected parent Value',
        ],
      ],
      [
        'A pojso object: inherited keys & string: false & symbol: true gets only symbols',
        { inherited: true, string: false, symbol: true },
        a_childObj,
        [
          'childObjSymbol1 Value',
          'tooBad_childObjSymbol2 rejected child Value',
          'parentObjSymbol1 Value',
          'tooBad_parentObjSymbol rejected parent Value',
        ],
      ],

      // realObject with CommonProps

      // # A realObject with commonProps, with or without props

      [
        'A realObject with commonProps, with extra props but props: false - ignored and returns only commonProps',
        {},
        add_CommonProps({}),
        commonStringProps_values,
      ],
      [
        `A realObject with commonProps with props: 'all', makes no difference, returns commonProps`,
        { props: 'all' },
        add_CommonProps({}),
        commonStringProps_values,
      ],
      [
        `A realObject with commonProps with props: true (only) including symbols, just returns commonProps`,
        { props: true, symbol: true },
        add_CommonProps({}),
        [...commonStringProps_values, ...commonSymbolProps_values],
      ],

      // # a realObject, with Common Props & nonEnumerables / inherited / top

      [
        `A realObject with commonProps: nonEnumerables brings 'length' {props: true, symbols: true, nonEnumerables: true, inherited: false | undefined }. Returns no base-type props except 'length' + Common Props (cause inherited: false)`,
        { props: true, symbol: true, nonEnumerables: true, inherited: false },
        add_CommonProps({}),
        [...commonStringProps_values, ...commonSymbolProps_values],
      ],
      [
        `A realObject with commonProps: nonEnumerables: false and inherited & top alone as true bring nothing extra {props: true, symbols: true, nonEnumerables: false, inherited: true, top: true}. Returns no extra base-type props, only Common Props (cause nonEnumerables: false)`,
        { props: true, symbol: true, nonEnumerables: false, inherited: true, top: true },
        add_CommonProps({}),
        [...commonStringProps_values, ...commonSymbolProps_values],
      ],
      [
        `A realObject with commonProps: ALL string { props: true, symbols: false, nonEnumerables: true, inherited: true }. Returns all string keys including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: false, nonEnumerables: true, inherited: true },
        add_CommonProps({}),
        [...commonStringProps_values],
      ],
      [
        `A realObject with commonProps: ALL (except top) { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true },
        add_CommonProps({}),
        [...commonStringProps_values, ...commonSymbolProps_values],
      ],
      [
        `A realObject with commonProps: ALL & top { props: true, symbols: true, nonEnumerables: true, inherited: true, top: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true, top: true },
        add_CommonProps({}),
        [
          ...commonStringProps_values,
          ...commonSymbolProps_values,
          ...object_stringNonEnumerablesInheritedTop_values,
        ],
      ],
      [
        `A realObject with commonProps: NOT own, only inherited { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns no props, since all are own`,
        { own: false, props: true, symbol: true, nonEnumerables: true, inherited: true },
        add_CommonProps({}),
        [],
      ],
      [
        `A realObject with commonProps: NOT own & non-enumerables, only inherited { props: true, symbols: true, nonEnumerables: false, inherited: true }. Returns empty array!`,
        { own: false, props: true, symbol: true, nonEnumerables: false, inherited: true },
        add_CommonProps({}),
        [],
      ],

      // # instance of class objects: Base class

      [
        'A base-class instance object (aPerson), default',
        {},
        a_Person,
        [...personStringProps_values],
      ],

      [
        'A base-class instance object (aPerson), with symbols',
        { symbol: true },
        a_Person,
        [...personStringProps_values, ...personSymbolProps_values],
      ],
      [
        'A base-class instance object (aPerson), with inherited: true, still gives the same keys',
        { inherited: true, symbol: true },
        a_Person,
        [...personStringProps_values, ...personSymbolProps_values],
      ],
      [
        'A base-class instance object (aPerson), with inherited: true & nonEnumerables: true, gives all non-symbol props defined in super class / prototype, along with own',
        { inherited: true, nonEnumerables: true },
        a_Person,
        [...personStringProps_values, ...person_stringNonEnumerablesInherited_values],
      ],
      [
        'A base-class instance object (aPerson), with inherited: true & nonEnumerables: true & symbol: true',
        { inherited: true, nonEnumerables: true, symbol: true },
        a_Person,
        [
          ...personStringProps_values,
          ...personSymbolProps_values,
          ...person_stringNonEnumerablesInherited_values,
          ...person_symbolNonEnumerablesInherited_values,
        ],
      ],
      // SUITE: Not Own
      [
        `A base-class instance object (aPerson), with own: false, inherited: true & nonEnumerables: true. Brings only the non-own props, i.e only prototype's string props`,
        { own: false, inherited: true, nonEnumerables: true },
        a_Person,
        [...person_stringNonEnumerablesInherited_values],
      ],
      [
        `A base-class instance object (aPerson), with own: false, inherited: true & nonEnumerables: true & symbol: true. Brings only the non-own props, i.e only prototype's props`,
        { own: false, inherited: true, nonEnumerables: true, symbol: true },
        a_Person,
        [
          ...person_stringNonEnumerablesInherited_values,
          ...person_symbolNonEnumerablesInherited_values,
        ],
      ],

      // SUITE: Everything
      [
        'A base-class instance object (aPerson), with inherited: true & nonEnumerables: true & top: true & symbol: true',
        { inherited: true, nonEnumerables: true, top: true, symbol: true },
        a_Person,
        [
          ...personStringProps_values,
          ...personSymbolProps_values,
          ...person_stringNonEnumerablesInherited_values,
          ...person_symbolNonEnumerablesInherited_values,
          ...object_stringNonEnumerablesInheritedTop.map((k) => a_Person[k]),
        ],
      ],

      // # instance of sub-class instance objects (with inheritance)

      [
        'A sub-class instance object (anEmployee), default',
        {},
        a_Employee,
        _.uniq([...personStringProps, ...employeeStringProps]).map((k) => a_Employee[k]),
      ],
      [
        'A sub-class instance object (anEmployee), with symbols',
        { symbol: true },
        a_Employee,
        _.uniq([
          ...personStringProps,
          ...personSymbolProps,
          ...employeeStringProps,
          ...employeeSymbolProps,
        ]).map((k) => a_Employee[k]),
      ],
      [
        'A sub-class instance object (anEmployee), with inherited: true, still gives the same keys',
        { inherited: true, symbol: true },
        a_Employee,
        _.uniq([
          ...personStringProps,
          ...personSymbolProps,
          ...employeeStringProps,
          ...employeeSymbolProps,
        ]).map((k) => a_Employee[k]),
      ],
      [
        'A sub-class instance object (anEmployee), with inherited: true & nonEnumerables: true, gives all non-symbol props defined in super class / prototype',
        { inherited: true, nonEnumerables: true },
        a_Employee,
        _.uniq([
          ...personStringProps,
          ...person_stringNonEnumerablesInherited,
          ...employeeStringProps,
          ...employee_stringNonEnumerablesInherited,
        ]).map((k) => a_Employee[k]),
      ],
      [
        'A sub-class instance object (anEmployee), with inherited: true & nonEnumerables: true & symbol: true',
        { inherited: true, nonEnumerables: true, symbol: true },
        a_Employee,
        _.uniq([
          ...personStringProps,
          ...personSymbolProps,
          ...person_stringNonEnumerablesInherited,
          ...person_symbolNonEnumerablesInherited,
          ...employeeStringProps,
          ...employeeSymbolProps,
          ...employee_stringNonEnumerablesInherited,
          ...employee_symbolNonEnumerablesInherited,
        ]).map((k) => a_Employee[k]),
      ],
      // SUITE: Not Own
      [
        `A sub-class instance object (aPerson), with own: false, inherited: true & nonEnumerables: true. Brings only the non-own props, i.e only prototype's string props`,
        { own: false, inherited: true, nonEnumerables: true },
        a_Employee,
        _.uniq([
          ...person_stringNonEnumerablesInherited,
          ...employee_stringNonEnumerablesInherited,
        ]).map((k) => a_Employee[k]),
      ],
      [
        `A sub-class instance object (aPerson), with own: false, inherited: true & nonEnumerables: true & symbol: true. Brings only the non-own props, i.e only prototype's props`,
        { own: false, inherited: true, nonEnumerables: true, symbol: true },
        a_Employee,
        _.uniq([
          ...person_stringNonEnumerablesInherited,
          ...person_symbolNonEnumerablesInherited,
          ...employee_stringNonEnumerablesInherited,
          ...employee_symbolNonEnumerablesInherited,
        ]).map((k) => a_Employee[k]),
      ],

      // everything
      [
        'A sub-class instance object (anEmployee), with inherited: true & nonEnumerables: true & top: true & symbol: true',
        { inherited: true, nonEnumerables: true, top: true, symbol: true },
        a_Employee,
        _.uniq([
          ...personStringProps,
          ...personSymbolProps,
          ...person_stringNonEnumerablesInherited,
          ...person_symbolNonEnumerablesInherited,
          ...employeeStringProps,
          ...employeeSymbolProps,
          ...employee_stringNonEnumerablesInherited,
          ...employee_symbolNonEnumerablesInherited,
          ...object_stringNonEnumerablesInheritedTop,
        ]).map((k) => a_Employee[k]),
      ],

      // SUITE: class definitions (not instances)
      [
        `A class definition, only own static props`,
        {},
        Employee,
        ['staticChildProp', 'tooBad_staticChildProp'].map((k) => Employee[k]),
      ],
      [
        `A class definition, own + inherited static props`,
        { inherited: true },
        Employee,
        [
          'staticChildProp',
          'tooBad_staticChildProp',
          'staticParentProp',
          'tooBadParentProp',
        ].map((k) => Employee[k]),
      ],
      [
        `A class definition, only inherited static props`,
        { inherited: true, own: false, strict: true },
        Employee,
        ['staticParentProp', 'tooBadParentProp'].map((k) => Employee[k]),
      ],

      // SUITE: Function input, with function: undefined (default)
      [
        `A Function with props - gets non-symbol props`,
        {},
        a_Function_withProps,
        ['functionStringProp1', 'functionNumberProp2'].map((k) => a_Function_withProps[k]),
      ],
      [
        `A Function with props & symbol: true`,
        { symbol: true },
        a_Function_withProps,
        ['functionStringProp1', 'functionNumberProp2', Symbol.for('functionSymbolProp')].map(
          (k) => a_Function_withProps[k]
        ),
      ],
      [
        `Throws: A Function with props & symbol: true & inherited: true, nonEnumerables: true because of 'caller', 'callee', and 'arguments' properties`,
        { symbol: true, inherited: true, nonEnumerables: true },
        a_Function_withProps,
        new Error(
          `'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them`
        ),
      ],

      // WIP
      // # Set

      ['A Set', {}, new Set([1, 'b', true]), [1, 'b', true]],
      ['A less simple Set', { symbol: true }, a_Set_of_Tvalues, [...a_Array_of_Tvalues]],
      [
        'A Set, with extra props but props: false - only natural keys',
        { symbol: true },
        a_Set_of_Tvalues_withCommonProps,
        [...a_Array_of_Tvalues],
      ],
      [
        `A Set, with extra props & props: 'all'`,
        { props: 'all', symbol: true },
        a_Set_of_Tvalues_withCommonProps,
        [
          // props
          ...commonStringProps_values,
          ...commonSymbolProps_values,
          // Set keys
          ...a_Array_of_Tvalues,
        ],
      ],
      [
        'A Set, with extra props & props: true (i.e only)',
        { props: true, symbol: true },
        a_Set_of_Tvalues_withCommonProps,
        [...commonStringProps_values, ...commonSymbolProps_values],
      ],

      // # Set with enumerables / inherited / top

      [
        `A Set with extra props: ALL string { props: true, symbols: false, nonEnumerables: true, inherited: true }. Returns all string keys including base-type inherited & non-enumerables props of Set`,
        { props: true, symbol: false, nonEnumerables: true, inherited: true },
        a_Set_of_Tvalues_withCommonProps,
        [
          ...commonStringProps_values,
          ...set_prototype_stringNonEnumerablesInherited.map(
            (k) => a_Set_of_Tvalues_withCommonProps[k]
          ),
        ],
      ],
      [
        `A Set with extra props: ALL (except top) { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Set`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true },
        a_Set_of_Tvalues_withCommonProps,
        [
          ...commonStringProps_values,
          ...commonSymbolProps_values,
          ...set_prototype_stringNonEnumerablesInherited.map(
            (k) => a_Set_of_Tvalues_withCommonProps[k]
          ),
          ...set_prototype_symbolNonEnumerablesInherited.map(
            (k) => a_Set_of_Tvalues_withCommonProps[k]
          ),
        ],
      ],
      [
        `A Set with extra props: ALL & top { props: true, symbols: true, nonEnumerables: true, inherited: true, top: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Set`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true, top: true },
        a_Set_of_Tvalues_withCommonProps,
        [
          ...commonStringProps_values,
          ...commonSymbolProps_values,
          ...[
            ...object_stringNonEnumerablesInheritedTop,
            ...set_prototype_stringNonEnumerablesInherited,
            ...set_prototype_symbolNonEnumerablesInherited,
          ].map((k) => a_Set_of_Tvalues_withCommonProps[k]),
        ],
      ],
      [
        `A Set with extra props: NOT own, only inherited { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Set`,
        { own: false, props: true, symbol: true, nonEnumerables: true, inherited: true },
        a_Set_of_Tvalues_withCommonProps,
        [
          ...set_prototype_stringNonEnumerablesInherited,
          ...set_prototype_symbolNonEnumerablesInherited,
        ].map((k) => a_Set_of_Tvalues_withCommonProps[k]),
      ],
      [
        `A Set with extra props: NOT own & non-enumerables, only inherited { props: true, symbols: true, nonEnumerables: false, inherited: true }. Returns empty array!`,
        { own: false, props: true, symbol: true, nonEnumerables: false, inherited: true },
        a_Set_of_Tvalues_withCommonProps,
        [],
      ],

      // # Map

      ['A Map', {}, a_Map_of_TMapKeys_Tvalues, a_Array_of_Tvalues],
      [
        'A Map, with extra common props but `props: false` - props ignored',
        {},
        a_Map_of_TMapKeys_Tvalues_WithCommonProps,
        a_Array_of_Tvalues,
      ],
      [
        'A Map, with extra props & props: true (i.e only)',
        { props: true, symbol: true },
        a_Map_of_TMapKeys_Tvalues_WithCommonProps,
        [
          // extra props only
          ...commonStringProps_values,
          ...commonSymbolProps_values,
        ],
      ],
      [
        `A Map, with extra props but props: 'all'`,
        { props: 'all', symbol: true },
        a_Map_of_TMapKeys_Tvalues_WithCommonProps,
        [
          // extra props
          ...commonStringProps_values,
          ...commonSymbolProps_values,

          // Map values
          ...a_Array_of_Tvalues,
        ],
      ],

      // # Map with enumerables / inherited / top

      [
        `A Map with extra props: ALL string { props: true, symbols: false, nonEnumerables: true, inherited: true }. Returns all string keys including base-type inherited & non-enumerables props of Map`,
        { props: true, symbol: false, nonEnumerables: true, inherited: true },
        a_Map_of_TMapKeys_Tvalues_WithCommonProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...map_prototype_stringNonEnumerablesInherited.map(
            (k) => a_Map_of_TMapKeys_Tvalues_WithCommonProps[k]
          ),
        ],
      ],
      [
        `A Map with extra props: ALL (except top) { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Map`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true },
        a_Map_of_TMapKeys_Tvalues_WithCommonProps,
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps_values,
          ...commonSymbolProps_values,
          ...[
            ...map_prototype_stringNonEnumerablesInherited,
            ...map_prototype_symbolNonEnumerablesInherited,
          ].map((k) => a_Map_of_TMapKeys_Tvalues_WithCommonProps[k]),
        ],
      ],
      [
        `A Map with extra props: ALL & top { props: true, symbols: true, nonEnumerables: true, inherited: true, top: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Map`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true, top: true },
        a_Map_of_TMapKeys_Tvalues_WithCommonProps,
        [
          ...commonStringProps_values,
          ...commonSymbolProps_values,
          ...[
            ...object_stringNonEnumerablesInheritedTop,
            ...map_prototype_stringNonEnumerablesInherited,
            ...map_prototype_symbolNonEnumerablesInherited,
          ].map((k) => a_Map_of_TMapKeys_Tvalues_WithCommonProps[k]),
        ],
      ],
      [
        `A Map with extra props: NOT own, only inherited { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Map`,
        { own: false, props: true, symbol: true, nonEnumerables: true, inherited: true },
        a_Map_of_TMapKeys_Tvalues_WithCommonProps,
        [
          ...map_prototype_stringNonEnumerablesInherited,
          ...map_prototype_symbolNonEnumerablesInherited,
        ].map((k) => a_Map_of_TMapKeys_Tvalues_WithCommonProps[k]),
      ],
      [
        `A Map with extra props: NOT own & non-enumerables, only inherited { props: true, symbols: true, nonEnumerables: false, inherited: true }. Returns empty array!`,
        { own: false, props: true, symbol: true, nonEnumerables: false, inherited: true },
        a_Map_of_TMapKeys_Tvalues_WithCommonProps,
        [],
      ],
      [`A Generator with no extra props: `, {}, a_Generator_of_Tvalues, []],
      [
        `A Generator with extra props, own: false`,
        { own: false },
        a_Generator_of_Tvalues_withCommonProps,
        [],
      ],
      [
        `A Generator with extra props`,
        {},
        a_Generator_of_Tvalues_withCommonProps,
        commonStringProps_values,
      ],
      [
        `A Generator with extra props & symbol: true`,
        { symbol: true },
        a_Generator_of_Tvalues_withCommonProps,
        [...commonStringProps_values, ...commonSymbolProps_values],
      ],

      // SUITE: strict: true - throws Error
      //
      // Primitives throw
      [
        'undefined',
        { strict: true },
        undefined,
        new Error(
          `z.keys: strict: true works only for types passing _.isObject, but value = undefined`
        ),
      ],
      [
        'null',
        { strict: true },
        null,
        new Error(
          `z.keys: strict: true works only for types passing _.isObject, but value = [object Null]`
        ),
      ],
      [
        'number',
        { strict: true },
        123,
        new Error(
          `z.keys: strict: true works only for types passing _.isObject, but value = 123`
        ),
      ],
      [
        'string',
        { strict: true },
        'a string',
        new Error(
          `z.keys: strict: true works only for types passing _.isObject, but value = a string`
        ),
      ],
      [
        'boolean',
        { strict: true },
        true,
        new Error(
          `z.keys: strict: true works only for types passing _.isObject, but value = true`
        ),
      ],
      [
        'bigint',
        { strict: true },
        1234n,
        new Error(
          `z.keys: strict: true works only for types passing _.isObject, but value = 1234`
        ),
      ],
      [
        'symbol',
        { strict: true },
        Symbol('someLabel'),
        new Error(
          `z.keys: strict: true works only for types passing _.isObject, but value = Symbol(someLabel)`
        ),
      ],
    ],
    ([description, options, input, expected]: [
      string,
      IKeysOptions,
      any,
      (string | symbol)[],
    ]) => {
      describe(`z.values retrieves all values of: ${description}`, () => {
        let result: any

        before(() => {
          try {
            result = values(input, { ...defaultOptions, ...options })
          } catch (error) {
            result = error
          }
        })

        if (_.isError(expected))
          it(`throws the expected error`, () => {
            expect(result).to.be.an.instanceOf(Error)
            expect(result.message).to.equal(expected.message)
          })
        else
          it(`equals expected, irrespective of order`, () => {
            if (_.isError(result)) {
              l.error('Result is error:', result)
              expect(result).to.not.be.an.instanceOf(Error)
            }
            if ((options as any)._exactEquality) deepEqual(result, expected)
            else equalSetDeep(result, expected)
          })
      })
    }
  )
})
