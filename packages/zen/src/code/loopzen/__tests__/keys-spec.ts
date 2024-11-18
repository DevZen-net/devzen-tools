import * as chai from 'chai'
import * as _ from 'lodash'
import { LogZenMini } from '../../LogZenMini'
import { deepEqual, equalSetDeep } from '../../../test-utils/specHelpers'
import {
  a_Array_of_Tvalues,
  a_Array_of_Tvalues_indexes,
  a_Array_of_Tvalues_withCommonAndArrayExtraProps,
  a_childObj,
  a_Employee,
  a_Function_withProps,
  a_Person,
  a_sparseArray_of_Tvalues_and_extras_indexes,
  a_sparseArray_of_Tvalues_and_extras_withCommonAndExtraProps,
  add_CommonProps,
  arrayAndCommonStringProps,
  commonStringProps,
  commonSymbolProps,
  Employee,
  employee_stringNonEnumerablesInherited,
  employee_symbolNonEnumerablesInherited,
  employeeStringProps,
  employeeSymbolProps,
  get_Array_of_Tvalues,
  get_arrayBuffer_Uint16,
  get_arrayBuffer_Uint8,
  get_arrayOfKeys,
  get_Map_of_TMapKeys_Tvalues,
  get_Map_of_TMapKeys_Tvalues_WithCommonProps,
  get_Set_of_Tvalues,
  get_Set_of_Tvalues_withCommonProps,
  get_TypedArray_BigInt64Array,
  get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps,
  get_TypedArray_Int32Array,
  get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps,
  noPropsKeysOptionsUntyped,
  person_stringNonEnumerablesInherited,
  person_symbolNonEnumerablesInherited,
  personStringProps,
  personSymbolProps,
  symbolProp,
} from '../../../test-utils/test-data'
import {
  array_prototype_stringNonEnumerablesInherited,
  array_prototype_stringNonEnumerablesInherited_ES2023,
  array_prototype_stringNonEnumerablesOwn,
  array_prototype_symbolNonEnumerablesInherited,
  arrayBuffer_prototype_stringNonEnumerablesInherited,
  arrayBuffer_prototype_symbolNonEnumerablesInherited,
  map_prototype_stringNonEnumerablesInherited,
  map_prototype_symbolNonEnumerablesInherited,
  object_stringNonEnumerablesInheritedTop,
  object_stringNonEnumerablesInheritedTopHidden,
  set_prototype_stringNonEnumerablesInherited,
  set_prototype_symbolNonEnumerablesInherited,
  typedArray_prototype_stringNonEnumerablesInherited,
  typedArray_prototype_stringNonEnumerablesInherited_ES2023,
  typedArray_prototype_stringNonEnumerablesOwn,
  typedArray_prototype_symbolNonEnumerablesInherited,
} from '../../typezen/types-info'

import { IKeysOptions, keys } from '../keys'

const { expect } = chai
const l = new LogZenMini()

// NOTE: defaults apply to all tests
const defaultOptions: IKeysOptions = {}

describe('keys.spec - behavioural/implementation, no types check', () => {
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
        'Boolean, with extra keys',
        { symbol: true },
        (() => {
          const b: any = new Boolean(true)
          b['someProp'] = 'some value'
          b[Symbol.for('symbolKey')] = 'some value'
          return b
        })(),
        ['someProp', Symbol.for('symbolKey')],
      ],
      [
        'Number, with extra keys',
        { symbol: true },
        (() => {
          const num: any = new Number(111)
          num['someProp'] = 'some value'
          num[Symbol.for('symbolKey')] = 'some value'
          return num
        })(),
        ['someProp', Symbol.for('symbolKey')],
      ],
      [
        'String, with extra keys',
        { symbol: true },
        (() => {
          const str: any = new String('someString')
          str['someProp'] = 'some value'
          str[Symbol.for('symbolKey')] = 'some value'
          const key: string = '1984'
          str[key] = 'stringKey value'
          return str
        })(),
        ['1984', 'someProp', Symbol.for('symbolKey')],
      ],

      // # Array, with or without props

      [
        'An Array, with extra props but props: false. Returns only numeric, while non positive numbers ones are considered props and ignored because of props: false',
        {},
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        a_Array_of_Tvalues_indexes,
      ],
      [
        'An Array, with extra props but props: false, while all other options exist. Returns only numeric also, like above',
        noPropsKeysOptionsUntyped,
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        a_Array_of_Tvalues_indexes,
      ],
      [
        `An Array, with props: 'all', listing all indexes & keys (excluding symbols)`,
        { props: 'all' },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [...arrayAndCommonStringProps, ...a_Array_of_Tvalues_indexes],
      ],
      [
        `An Array, with props: true, props & symbol true`,
        { props: true, symbol: true },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [...arrayAndCommonStringProps, ...commonSymbolProps],
      ],

      // # Array, with extra props & nonEnumerables / inherited / top
      [
        `An Array with extra props: nonEnumerables brings 'length' {props: true, symbols: true, nonEnumerables: true, inherited: false | undefined }. Returns no base-type props except 'length' + Common Props (cause inherited: false)`,
        { props: true, symbol: true, nonEnumerables: true, inherited: false },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [
          ...arrayAndCommonStringProps,
          ...commonSymbolProps,
          ...array_prototype_stringNonEnumerablesOwn,
        ],
      ],
      [
        `An Array with extra props: nonEnumerables: false and inherited & top alone as true bring nothing extra {props: true, symbols: true, nonEnumerables: false, inherited: true, top: true}. Returns no extra base-type props, only Common Props (cause nonEnumerables: false)`,
        { props: true, symbol: true, nonEnumerables: false, inherited: true, top: true },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [...arrayAndCommonStringProps, ...commonSymbolProps],
      ],
      [
        `An Array with extra props: ALL string { props: true, symbols: false, nonEnumerables: true, inherited: true }. Returns all string keys including base-type inherited & non-enumerables props of Array`,
        { props: true, symbol: false, nonEnumerables: true, inherited: true },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [
          ...arrayAndCommonStringProps,
          ...array_prototype_stringNonEnumerablesInherited,
          ...(([] as any).findLastIndex
            ? array_prototype_stringNonEnumerablesInherited_ES2023
            : []), // optional, depending on runtime
        ],
      ],
      [
        `An Array with extra props: ALL (except top) { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Array`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [
          ...arrayAndCommonStringProps,
          ...commonSymbolProps,
          ...array_prototype_stringNonEnumerablesInherited,
          ...array_prototype_symbolNonEnumerablesInherited,
          ...(([] as any).findLastIndex
            ? array_prototype_stringNonEnumerablesInherited_ES2023
            : []), // optional, depending on runtime
        ],
      ],
      [
        `An Array with extra props: ALL & top { props: true, symbols: true, nonEnumerables: true, inherited: true, top: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Array`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true, top: true },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [
          ...object_stringNonEnumerablesInheritedTop,
          ...arrayAndCommonStringProps,
          ...commonSymbolProps,
          ...array_prototype_stringNonEnumerablesInherited,
          ...array_prototype_symbolNonEnumerablesInherited,
          ...(([] as any).findLastIndex
            ? array_prototype_stringNonEnumerablesInherited_ES2023
            : []), // optional, depending on runtime
        ],
      ],
      [
        `An Array with ALL extra props, including top & hidden { props: true, symbols: true, nonEnumerables: true, inherited: true, top: true, hidden: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Array`,
        {
          props: true,
          symbol: true,
          nonEnumerables: true,
          inherited: true,
          top: true,
          hidden: true,
        },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [
          ...object_stringNonEnumerablesInheritedTop,
          ...object_stringNonEnumerablesInheritedTopHidden,
          ...arrayAndCommonStringProps,
          ...commonSymbolProps,
          ...array_prototype_stringNonEnumerablesInherited,
          ...array_prototype_symbolNonEnumerablesInherited,
          ...(([] as any).findLastIndex
            ? array_prototype_stringNonEnumerablesInherited_ES2023
            : []), // optional, depending on runtime
        ],
      ],
      [
        `An Array with extra props: NOT own, only inherited { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Array`,
        { own: false, props: true, symbol: true, nonEnumerables: true, inherited: true },
        a_Array_of_Tvalues_withCommonAndArrayExtraProps,
        [
          ...array_prototype_stringNonEnumerablesInherited,
          ...array_prototype_symbolNonEnumerablesInherited,
          ...(([] as any).findLastIndex
            ? array_prototype_stringNonEnumerablesInherited_ES2023
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
        a_sparseArray_of_Tvalues_and_extras_indexes,
      ],
      [
        `An Array, with extra props & props: 'all'. Non positive numbers ones are considered as props`,
        { props: 'all' },
        a_sparseArray_of_Tvalues_and_extras_withCommonAndExtraProps,
        [...arrayAndCommonStringProps, ...a_sparseArray_of_Tvalues_and_extras_indexes],
      ],
      [
        `'An Array, with extra props & props: 'all', listing all keys including symbols`,
        { props: 'all', symbol: true },
        a_sparseArray_of_Tvalues_and_extras_withCommonAndExtraProps,
        [
          // props
          ...arrayAndCommonStringProps,
          ...commonSymbolProps,
          ...a_sparseArray_of_Tvalues_and_extras_indexes,
        ],
      ],
      [
        `An Array, with extra props & props: true, listing all keys including symbols`,
        { props: true, symbol: true },
        a_sparseArray_of_Tvalues_and_extras_withCommonAndExtraProps,
        [...arrayAndCommonStringProps, ...commonSymbolProps],
      ],

      // # TypedArray of number, with or without props

      [
        'A TypedArray - Int32Array',
        {},
        get_TypedArray_Int32Array(),
        _.times(get_TypedArray_Int32Array().length),
      ],
      [
        'A TypedArray - Int32Array, with extra props but props: false. Non positive numbers ones are ignored because of props: false',
        {},
        get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps(),
        _.times(get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps().length),
      ],
      [
        `A TypedArray - Int32Array, with props: 'all', listing all indexes & keys (excluding symbols)`,
        { props: 'all' },
        get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ..._.times(get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps().length),
        ],
      ],
      [
        `A TypedArray - Int32Array, with props: true (only), listing props: 'only' (including symbols)`,
        { props: true, symbol: true },
        get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ...commonSymbolProps,
        ],
      ],

      [
        `A TypedArray - Int32Array, with extra props: nonEnumerables brings 'length' {props: true, symbols: true, nonEnumerables: true, inherited: false | undefined }. Returns no base-type props except 'length' + Common Props (cause inherited: false)`,
        { props: true, symbol: true, nonEnumerables: true, inherited: false },
        get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ...commonSymbolProps,
          ...typedArray_prototype_stringNonEnumerablesOwn,
        ],
      ],
      [
        `A TypedArray - Int32Array with extra props: nonEnumerables: false and inherited & top alone as true bring nothing extra {props: true, symbols: true, nonEnumerables: false, inherited: true, top: true}. Returns no extra base-type props, only Common Props (cause nonEnumerables: false)`,
        { props: true, symbol: true, nonEnumerables: false, inherited: true, top: true },
        get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ...commonSymbolProps,
        ],
      ],
      [
        `A TypedArray - Int32Array, with extra props: ALL string { props: true, symbols: false, nonEnumerables: true, inherited: true }. Returns all string keys including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: false, nonEnumerables: true, inherited: true },
        get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ...typedArray_prototype_stringNonEnumerablesInherited,
          ...(([] as any).findLastIndex
            ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
            : []), // optional, depending on runtime
        ],
      ],
      [
        `A TypedArray - Int32Array, with extra props: ALL (except top) { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true },
        get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ...commonSymbolProps,
          ...typedArray_prototype_stringNonEnumerablesInherited,
          ...typedArray_prototype_symbolNonEnumerablesInherited,
          ...(([] as any).findLastIndex
            ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
            : []), // optional, depending on runtime
        ],
      ],
      [
        `A TypedArray - Int32Array, with extra props: ALL & top { props: true, symbols: true, nonEnumerables: true, inherited: true, top: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true, top: true },
        get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ...commonSymbolProps,
          ...object_stringNonEnumerablesInheritedTop,
          ...typedArray_prototype_stringNonEnumerablesInherited,
          ...typedArray_prototype_symbolNonEnumerablesInherited,
          ...(([] as any).findLastIndex
            ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
            : []), // optional, depending on runtime
        ],
      ],
      [
        `A TypedArray - Int32Array, with extra props: NOT own, only inherited { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { own: false, props: true, symbol: true, nonEnumerables: true, inherited: true },
        get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps(),
        [
          ...typedArray_prototype_stringNonEnumerablesInherited,
          ...typedArray_prototype_symbolNonEnumerablesInherited,
          ...(([] as any).findLastIndex
            ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
            : []), // optional, depending on runtime
        ],
      ],
      [
        `A TypedArray - Int32Array, with extra props: NOT own & non-enumerables, only inherited { props: true, symbols: true, nonEnumerables: false, inherited: true }. Returns empty array!`,
        { own: false, props: true, symbol: true, nonEnumerables: false, inherited: true },
        get_TypedArray_Int32Array_number_withCommonAndArrayExtraProps(),
        [],
      ],

      // # TypedArray of BigInt

      [
        'A TypedArray - BigInt64Array',
        {},
        get_TypedArray_BigInt64Array(),
        _.times(get_TypedArray_BigInt64Array().length),
      ],
      [
        'A TypedArray - BigInt64Array, with extra props but props: false. Non positive numbers ones are ignored because of props: false',
        {},
        get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps(),
        _.times(get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps().length),
      ],
      [
        `A TypedArray - BigInt64Array with props: 'all', listing all indexes & keys (excluding symbols)`,
        { props: 'all' },
        get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ..._.times(get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps().length), // array indexes
        ],
      ],
      [
        `A TypedArray - BigInt64Array with props: true (only), listing props: true ('only'), including symbols`,
        { props: true, symbol: true },
        get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ...commonSymbolProps,
        ],
      ],

      // # TypedArray, with extra props & nonEnumerables / inherited / top

      [
        `A TypedArray - BigInt64Array, with extra props: nonEnumerables brings 'length' {props: true, symbols: true, nonEnumerables: true, inherited: false | undefined }. Returns no base-type props except 'length' + Common Props (cause inherited: false)`,
        { props: true, symbol: true, nonEnumerables: true, inherited: false },
        get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ...commonSymbolProps,
          ...typedArray_prototype_stringNonEnumerablesOwn,
        ],
      ],
      [
        `A TypedArray - BigInt64Array, with extra props: nonEnumerables: false and inherited & top alone as true bring nothing extra {props: true, symbols: true, nonEnumerables: false, inherited: true, top: true}. Returns no extra base-type props, only Common Props (cause nonEnumerables: false)`,
        { props: true, symbol: true, nonEnumerables: false, inherited: true, top: true },
        get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ...commonSymbolProps,
        ],
      ],
      [
        `A TypedArray - BigInt64Array, with extra props: ALL string { props: true, symbols: false, nonEnumerables: true, inherited: true }. Returns all string keys including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: false, nonEnumerables: true, inherited: true },
        get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ...typedArray_prototype_stringNonEnumerablesInherited,
          ...(([] as any).findLastIndex
            ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
            : []), // optional, depending on runtime
        ],
      ],
      [
        `A TypedArray - BigInt64Array, with extra props: ALL (except top) { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true },
        get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ...commonSymbolProps,
          ...typedArray_prototype_stringNonEnumerablesInherited,
          ...typedArray_prototype_symbolNonEnumerablesInherited,
          ...(([] as any).findLastIndex
            ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
            : []), // optional, depending on runtime
        ],
      ],
      [
        `A TypedArray - BigInt64Array, with extra props: ALL & top { props: true, symbols: true, nonEnumerables: true, inherited: true, top: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true, top: true },
        get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ...commonSymbolProps,
          ...object_stringNonEnumerablesInheritedTop,
          ...typedArray_prototype_stringNonEnumerablesInherited,
          ...typedArray_prototype_symbolNonEnumerablesInherited,
          ...(([] as any).findLastIndex
            ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
            : []), // optional, depending on runtime
        ],
      ],
      [
        `A TypedArray - BigInt64Array, with extra props: NOT own, only inherited { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { own: false, props: true, symbol: true, nonEnumerables: true, inherited: true },
        get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps(),
        [
          ...typedArray_prototype_stringNonEnumerablesInherited,
          ...typedArray_prototype_symbolNonEnumerablesInherited,
          ...(([] as any).findLastIndex
            ? typedArray_prototype_stringNonEnumerablesInherited_ES2023
            : []), // optional, depending on runtime
        ],
      ],
      [
        `A TypedArray - BigInt64Array, with extra props: NOT own & non-enumerables, only inherited { props: true, symbols: true, nonEnumerables: false, inherited: true }. Returns empty array!`,
        { own: false, props: true, symbol: true, nonEnumerables: false, inherited: true },
        get_TypedArray_BigInt64Array_withCommonAndArrayExtraProps(),
        [],
      ],

      // ArrayBuffer - no indexes/keys, only props if any exist

      // # ArrayBuffer of number, with or without props

      [
        'A ArrayBuffer - throws if no dataViewType is passed',
        {},
        get_arrayBuffer_Uint8(),
        new Error(
          `z.keys(): options.dataViewType is required to loop over an ArrayBuffer to calculate its nested keys()`
        ),
      ],

      // A ArrayBuffer Uint8 (1 byte per number stored in the ArrayBuffer)

      [
        'A ArrayBuffer Uint8 - gets only the nested values of the ArrayBuffer',
        { dataViewType: 'Uint8', _exactEquality: true },
        get_arrayBuffer_Uint8(),
        // _.times(get_arrayBuffer_Uint8().byteLength), // [ 0, 1, 2, 3, 4, 5, 6, 7 ]
        _.times(get_arrayBuffer_Uint8().byteLength), // [ 0, 1, 2, 3, 4, 5, 6, 7 ]
      ],
      [
        'A ArrayBuffer Uint8with props, but props: false, gets only the nested values of the ArrayBuffer',
        { dataViewType: 'Uint8', _exactEquality: true },
        add_CommonProps(get_arrayBuffer_Uint8()),
        _.times(get_arrayBuffer_Uint8().byteLength), // [ 0, 1, 2, 3, 4, 5, 6, 7 ]
      ],
      [
        'A ArrayBuffer Uint8with props, with props: true, gets only props values',
        { props: true, dataViewType: 'Uint8', _exactEquality: true },
        add_CommonProps(get_arrayBuffer_Uint8()),
        [...commonStringProps],
      ],
      [
        `A ArrayBuffer Uint8with props, with props: 'all', gets only props values`,
        { props: 'all', dataViewType: 'Uint8', _exactEquality: true },
        add_CommonProps(get_arrayBuffer_Uint8()),
        [..._.times(get_arrayBuffer_Uint8().byteLength), ...commonStringProps],
      ],

      // A ArrayBuffer Uint16 (1 byte per number stored in the ArrayBuffer)

      [
        'A ArrayBuffer Uint16 - gets only the nested values of the ArrayBuffer',
        { dataViewType: 'Uint16', _exactEquality: true },
        get_arrayBuffer_Uint16(),
        // _.times(get_arrayBuffer_Uint16().byteLength), // [ 0, 1, 2, 3, 4, 5, 6, 7 ]
        _.times(get_arrayBuffer_Uint16().byteLength / 2), // [ 0, 1, 2, 3, 4, 5, 6, 7 ]
      ],
      [
        'A ArrayBuffer Uint16with props, but props: false, gets only the nested values of the ArrayBuffer',
        { dataViewType: 'Uint16', _exactEquality: true },
        add_CommonProps(get_arrayBuffer_Uint16()),
        _.times(get_arrayBuffer_Uint16().byteLength / 2), // [ 0, 1, 2, 3, 4, 5, 6, 7 ]
      ],
      [
        'A ArrayBuffer Uint16with props, with props: true, gets only props values',
        { props: true, dataViewType: 'Uint16', _exactEquality: true },
        add_CommonProps(get_arrayBuffer_Uint16()),
        [...commonStringProps],
      ],
      [
        `A ArrayBuffer Uint16with props, with props: 'all', gets only props values`,
        { props: 'all', dataViewType: 'Uint16', _exactEquality: true },
        add_CommonProps(get_arrayBuffer_Uint16()),
        [..._.times(get_arrayBuffer_Uint16().byteLength / 2), ...commonStringProps],
      ],

      // # Objects

      ['An empty object', {}, {}, []],
      ['A simple pojso', {}, { a: 1, b: 2 }, ['a', 'b']],
      [
        'A pojso created via Object.create(null)',
        { symbol: true },
        (() => {
          const obj = Object.create(null)
          obj.a = 1
          obj.b = 2
          obj[symbolProp] = 'some value'

          return obj
        })(),
        ['a', 'b', symbolProp],
      ],
      [
        'A pojso created via Object.create({})',
        { symbol: true },
        (() => {
          const obj = Object.create({ notOWN_wont_be_in_result: 3 }) // not OWN
          obj.a = 1
          obj.b = 2
          obj[symbolProp] = 'some value'

          return obj
        })(),
        ['a', 'b', symbolProp],
      ],

      [
        'A pojso object, defaults',
        {},
        a_childObj,
        [
          'childObjKeyNum_rejected',
          'childObjKeyNum',
          'childObjKeyStr',
          'childObjKeyStr_Rejected',
        ],
      ],
      [
        'A pojso object, iherited: true',
        { inherited: true },
        a_childObj,
        [
          'childObjKeyNum_rejected',
          'childObjKeyNum',
          'childObjKeyStr',
          'childObjKeyStr_Rejected',

          // parent, inherited
          'parentObjKeyNum_rejected',
          'parentObjKeyNum',
          'parentObjKeyStr',
          'parentObjKeyStr_Rejected',
        ],
      ],
      [
        'A pojso object: inherited keys',
        { inherited: true, symbol: true },
        a_childObj,
        [
          'childObjKeyNum_rejected',
          'childObjKeyNum',
          'childObjKeyStr',
          'childObjKeyStr_Rejected',
          Symbol.for('childObjSymbolLabel1'),
          Symbol.for('badKey_childObjSymbolLabel2 with quotes \' " and \n new line'),

          // parent, inherited
          'parentObjKeyNum_rejected',
          'parentObjKeyNum',
          'parentObjKeyStr',
          'parentObjKeyStr_Rejected',
          Symbol.for('parentObjSymbolLabel1'),
          Symbol.for(`badKey_parentObjSymbolLabel2 with quotes ' " and \n new line`),
        ],
      ],
      [
        'A pojso object: only inherited keys, not own!',
        { inherited: true, own: false, symbol: true },
        a_childObj,
        [
          'parentObjKeyNum_rejected',
          'parentObjKeyNum',
          'parentObjKeyStr',
          'parentObjKeyStr_Rejected',
          Symbol.for('parentObjSymbolLabel1'),
          Symbol.for(`badKey_parentObjSymbolLabel2 with quotes ' " and \n new line`),
        ],
      ],
      [
        'A pojso object: inherited keys & string: false & symbol: true gets only symbols',
        { inherited: true, string: false, symbol: true },
        a_childObj,
        [
          Symbol.for('childObjSymbolLabel1'),
          Symbol.for('badKey_childObjSymbolLabel2 with quotes \' " and \n new line'),
          Symbol.for('parentObjSymbolLabel1'),
          Symbol.for(`badKey_parentObjSymbolLabel2 with quotes ' " and \n new line`),
        ],
      ],

      // realObject with CommonProps

      // # A realObject with commonProps, with or without props

      [
        'A realObject with commonProps, with extra props but props: false - ignored and returns only commonProps',
        {},
        add_CommonProps({}),
        commonStringProps,
      ],
      [
        `A realObject with commonProps with props: 'all', makes no difference, returns commonProps`,
        { props: 'all' },
        add_CommonProps({}),
        commonStringProps,
      ],
      [
        `A realObject with commonProps with props: true (only) including symbols, just returns commonProps`,
        { props: true, symbol: true },
        add_CommonProps({}),
        [...commonStringProps, ...commonSymbolProps],
      ],

      // # a realObject, with Common Props & nonEnumerables / inherited / top

      [
        `A realObject with commonProps: nonEnumerables brings 'length' {props: true, symbols: true, nonEnumerables: true, inherited: false | undefined }. Returns no base-type props except 'length' + Common Props (cause inherited: false)`,
        { props: true, symbol: true, nonEnumerables: true, inherited: false },
        add_CommonProps({}),
        [...commonStringProps, ...commonSymbolProps],
      ],
      [
        `A realObject with commonProps: nonEnumerables: false and inherited & top alone as true bring nothing extra {props: true, symbols: true, nonEnumerables: false, inherited: true, top: true}. Returns no extra base-type props, only Common Props (cause nonEnumerables: false)`,
        { props: true, symbol: true, nonEnumerables: false, inherited: true, top: true },
        add_CommonProps({}),
        [...commonStringProps, ...commonSymbolProps],
      ],
      [
        `A realObject with commonProps: ALL string { props: true, symbols: false, nonEnumerables: true, inherited: true }. Returns all string keys including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: false, nonEnumerables: true, inherited: true },
        add_CommonProps({}),
        [...commonStringProps],
      ],
      [
        `A realObject with commonProps: ALL (except top) { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true },
        add_CommonProps({}),
        [...commonStringProps, ...commonSymbolProps],
      ],
      [
        `A realObject with commonProps: ALL & top { props: true, symbols: true, nonEnumerables: true, inherited: true, top: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of TypedArray`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true, top: true },
        add_CommonProps({}),
        [
          ...commonStringProps,
          ...commonSymbolProps,
          ...object_stringNonEnumerablesInheritedTop,
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

      ['A base-class instance object (aPerson), default', {}, a_Person, [...personStringProps]],
      [
        'A base-class instance object (aPerson), with symbols',
        { symbol: true },
        a_Person,
        [...personStringProps, ...personSymbolProps],
      ],
      [
        'A base-class instance object (aPerson), with inherited: true, still gives the same keys',
        { inherited: true, symbol: true },
        a_Person,
        [...personStringProps, ...personSymbolProps],
      ],
      [
        'A base-class instance object (aPerson), with inherited: true & nonEnumerables: true, gives all non-symbol props defined in super class / prototype, along with own',
        { inherited: true, nonEnumerables: true },
        a_Person,
        [...personStringProps, ...person_stringNonEnumerablesInherited],
      ],
      [
        'A base-class instance object (aPerson), with inherited: true & nonEnumerables: true & symbol: true',
        { inherited: true, nonEnumerables: true, symbol: true },
        a_Person,
        [
          ...personStringProps,
          ...personSymbolProps,
          ...person_stringNonEnumerablesInherited,
          ...person_symbolNonEnumerablesInherited,
        ],
      ],
      // SUITE: Not Own
      [
        `A base-class instance object (aPerson), with own: false, inherited: true & nonEnumerables: true. Brings only the non-own props, i.e only prototype's string props`,
        { own: false, inherited: true, nonEnumerables: true },
        a_Person,
        [...person_stringNonEnumerablesInherited],
      ],
      [
        `A base-class instance object (aPerson), with own: false, inherited: true & nonEnumerables: true & symbol: true. Brings only the non-own props, i.e only prototype's props`,
        { own: false, inherited: true, nonEnumerables: true, symbol: true },
        a_Person,
        [...person_stringNonEnumerablesInherited, ...person_symbolNonEnumerablesInherited],
      ],

      // SUITE: Everything
      [
        'A base-class instance object (aPerson), with inherited: true & nonEnumerables: true & top: true & symbol: true',
        { inherited: true, nonEnumerables: true, top: true, symbol: true },
        a_Person,
        [
          ...personStringProps,
          ...personSymbolProps,
          ...person_stringNonEnumerablesInherited,
          ...person_symbolNonEnumerablesInherited,
          ...object_stringNonEnumerablesInheritedTop,
        ],
      ],

      // # instance of sub-class instance objects (with inheritance)

      [
        'A sub-class instance object (anEmployee), default',
        {},
        a_Employee,
        [...personStringProps, ...employeeStringProps],
      ],
      [
        'A sub-class instance object (anEmployee), with symbols',
        { symbol: true },
        a_Employee,
        [
          ...personStringProps,
          ...personSymbolProps,
          ...employeeStringProps,
          ...employeeSymbolProps,
        ],
      ],
      [
        'A sub-class instance object (anEmployee), with inherited: true, still gives the same keys',
        { inherited: true, symbol: true },
        a_Employee,
        [
          ...personStringProps,
          ...personSymbolProps,
          ...employeeStringProps,
          ...employeeSymbolProps,
        ],
      ],
      [
        'A sub-class instance object (anEmployee), with inherited: true & nonEnumerables: true, gives all non-symbol props defined in super class / prototype',
        { inherited: true, nonEnumerables: true },
        a_Employee,
        [
          ...personStringProps,
          ...person_stringNonEnumerablesInherited,
          ...employeeStringProps,
          ...employee_stringNonEnumerablesInherited,
        ],
      ],
      [
        'A sub-class instance object (anEmployee), with inherited: true & nonEnumerables: true & symbol: true',
        { inherited: true, nonEnumerables: true, symbol: true },
        a_Employee,
        [
          ...personStringProps,
          ...personSymbolProps,
          ...person_stringNonEnumerablesInherited,
          ...person_symbolNonEnumerablesInherited,
          ...employeeStringProps,
          ...employeeSymbolProps,
          ...employee_stringNonEnumerablesInherited,
          ...employee_symbolNonEnumerablesInherited,
        ],
      ],
      // SUITE: Not Own
      [
        `A sub-class instance object (aPerson), with own: false, inherited: true & nonEnumerables: true. Brings only the non-own props, i.e only prototype's string props`,
        { own: false, inherited: true, nonEnumerables: true },
        a_Employee,
        [...person_stringNonEnumerablesInherited, ...employee_stringNonEnumerablesInherited],
      ],
      [
        `A sub-class instance object (aPerson), with own: false, inherited: true & nonEnumerables: true & symbol: true. Brings only the non-own props, i.e only prototype's props`,
        { own: false, inherited: true, nonEnumerables: true, symbol: true },
        a_Employee,
        [
          ...person_stringNonEnumerablesInherited,
          ...person_symbolNonEnumerablesInherited,
          ...employee_stringNonEnumerablesInherited,
          ...employee_symbolNonEnumerablesInherited,
        ],
      ],

      // everything
      [
        'A sub-class instance object (anEmployee), with inherited: true & nonEnumerables: true & top: true & symbol: true',
        { inherited: true, nonEnumerables: true, top: true, symbol: true },
        a_Employee,
        [
          ...personStringProps,
          ...personSymbolProps,
          ...person_stringNonEnumerablesInherited,
          ...person_symbolNonEnumerablesInherited,
          ...employeeStringProps,
          ...employeeSymbolProps,
          ...employee_stringNonEnumerablesInherited,
          ...employee_symbolNonEnumerablesInherited,
          ...object_stringNonEnumerablesInheritedTop,
        ],
      ],

      // SUITE: class definitions (not instances)
      [
        `A class definition, only own static props`,
        {},
        Employee,
        ['staticChildProp', 'tooBad_staticChildProp'],
      ],
      [
        `A class definition, own + inherited static props`,
        { inherited: true },
        Employee,
        ['staticChildProp', 'tooBad_staticChildProp', 'staticParentProp', 'tooBadParentProp'],
      ],
      [
        `A class definition, only inherited static props`,
        { inherited: true, own: false, strict: true },
        Employee,
        ['staticParentProp', 'tooBadParentProp'],
      ],

      // SUITE: Function input, with function: undefined (default)
      [
        `A Function with props - gets non-symbol props`,
        {},
        a_Function_withProps,
        ['functionStringProp1', 'functionNumberProp2'],
      ],
      [
        `A Function with props & symbol: true`,
        { symbol: true },
        a_Function_withProps,
        ['functionStringProp1', 'functionNumberProp2', Symbol.for('functionSymbolProp')],
      ],

      // # Set

      ['A Set', {}, new Set([1, 'b', true]), [1, 'b', true]],
      ['A less simple Set', { symbol: true }, get_Set_of_Tvalues(), get_Array_of_Tvalues()],
      [
        'A Set, with extra props but props: false - only natural keys',
        { symbol: true },
        get_Set_of_Tvalues_withCommonProps(),
        [...a_Array_of_Tvalues],
      ],
      [
        `A Set, with extra props & props: 'all'`,
        { props: 'all', symbol: true },
        get_Set_of_Tvalues_withCommonProps(),
        [
          // props
          ...commonStringProps,
          ...commonSymbolProps,
          // Set keys
          ...a_Array_of_Tvalues,
        ],
      ],
      [
        'A Set, with extra props & props: true (i.e only)',
        { props: true, symbol: true },
        get_Set_of_Tvalues_withCommonProps(),
        [...commonStringProps, ...commonSymbolProps],
      ],

      // # Set with enumerables / inherited / top

      [
        `A Set with extra props: ALL string { props: true, symbols: false, nonEnumerables: true, inherited: true }. Returns all string keys including base-type inherited & non-enumerables props of Set`,
        { props: true, symbol: false, nonEnumerables: true, inherited: true },
        get_Set_of_Tvalues_withCommonProps(),
        [...commonStringProps, ...set_prototype_stringNonEnumerablesInherited],
      ],
      [
        `A Set with extra props: ALL (except top) { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Set`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true },
        get_Set_of_Tvalues_withCommonProps(),
        [
          ...commonStringProps,
          ...commonSymbolProps,
          ...set_prototype_stringNonEnumerablesInherited,
          ...set_prototype_symbolNonEnumerablesInherited,
        ],
      ],
      [
        `A Set with extra props: ALL & top { props: true, symbols: true, nonEnumerables: true, inherited: true, top: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Set`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true, top: true },
        get_Set_of_Tvalues_withCommonProps(),
        [
          ...commonStringProps,
          ...commonSymbolProps,
          ...object_stringNonEnumerablesInheritedTop,
          ...set_prototype_stringNonEnumerablesInherited,
          ...set_prototype_symbolNonEnumerablesInherited,
        ],
      ],
      [
        `A Set with extra props: NOT own, only inherited { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Set`,
        { own: false, props: true, symbol: true, nonEnumerables: true, inherited: true },
        get_Set_of_Tvalues_withCommonProps(),
        [
          ...set_prototype_stringNonEnumerablesInherited,
          ...set_prototype_symbolNonEnumerablesInherited,
        ],
      ],
      [
        `A Set with extra props: NOT own & non-enumerables, only inherited { props: true, symbols: true, nonEnumerables: false, inherited: true }. Returns empty array!`,
        { own: false, props: true, symbol: true, nonEnumerables: false, inherited: true },
        get_Set_of_Tvalues_withCommonProps(),
        [],
      ],

      // # Map

      ['A Map', {}, get_Map_of_TMapKeys_Tvalues(), get_arrayOfKeys()],
      [
        'A Map, with extra common props but `props: false` - props ignored',
        {},
        get_Map_of_TMapKeys_Tvalues_WithCommonProps(),
        get_arrayOfKeys(),
      ],
      [
        'A Map, with extra props & props: true (i.e only)',
        { props: true, symbol: true },
        get_Map_of_TMapKeys_Tvalues_WithCommonProps(),
        [
          // extra props only
          ...commonStringProps,
          ...commonSymbolProps,
        ],
      ],
      [
        `A Map, with extra props but props: 'all'`,
        { props: 'all', symbol: true },
        get_Map_of_TMapKeys_Tvalues_WithCommonProps(),
        [
          // extra props
          ...commonStringProps,
          ...commonSymbolProps,

          // Map keys
          ...get_arrayOfKeys(),
        ],
      ],

      // # Map with enumerables / inherited / top

      [
        `A Map with extra props: ALL string { props: true, symbols: false, nonEnumerables: true, inherited: true }. Returns all string keys including base-type inherited & non-enumerables props of Map`,
        { props: true, symbol: false, nonEnumerables: true, inherited: true },
        get_Map_of_TMapKeys_Tvalues_WithCommonProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ...map_prototype_stringNonEnumerablesInherited,
        ],
      ],
      [
        `A Map with extra props: ALL (except top) { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Map`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true },
        get_Map_of_TMapKeys_Tvalues_WithCommonProps(),
        [
          // prop '-10', ignored in JS - typeArray['-1'] = 1 is not written to the array
          ...commonStringProps,
          ...commonSymbolProps,
          ...map_prototype_stringNonEnumerablesInherited,
          ...map_prototype_symbolNonEnumerablesInherited,
        ],
      ],
      [
        `A Map with extra props: ALL & top { props: true, symbols: true, nonEnumerables: true, inherited: true, top: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Map`,
        { props: true, symbol: true, nonEnumerables: true, inherited: true, top: true },
        get_Map_of_TMapKeys_Tvalues_WithCommonProps(),
        [
          ...commonStringProps,
          ...commonSymbolProps,
          ...object_stringNonEnumerablesInheritedTop,
          ...map_prototype_stringNonEnumerablesInherited,
          ...map_prototype_symbolNonEnumerablesInherited,
        ],
      ],
      [
        `A Map with extra props: NOT own, only inherited { props: true, symbols: true, nonEnumerables: true, inherited: true }. Returns all keys (string & symbol), including base-type inherited & non-enumerables props of Map`,
        { own: false, props: true, symbol: true, nonEnumerables: true, inherited: true },
        get_Map_of_TMapKeys_Tvalues_WithCommonProps(),
        [
          ...map_prototype_stringNonEnumerablesInherited,
          ...map_prototype_symbolNonEnumerablesInherited,
        ],
      ],
      [
        `A Map with extra props: NOT own & non-enumerables, only inherited { props: true, symbols: true, nonEnumerables: false, inherited: true }. Returns empty array!`,
        { own: false, props: true, symbol: true, nonEnumerables: false, inherited: true },
        get_Map_of_TMapKeys_Tvalues_WithCommonProps(),
        [],
      ],

      // SUITE: strict: true - throws Error

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
      describe(`z.keys retrieves all keys of: ${description}`, () => {
        let result: any

        before(() => {
          try {
            result = keys(input, { ...defaultOptions, ...options })
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
