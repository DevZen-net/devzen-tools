import { expectType } from 'ts-expect'
import {
  Tarray_prototype_stringNonEnumerablesInherited_values,
  TdataView_prototype_stringNonEnumerablesInherited,
  Tdate_prototype_stringNonEnumerablesInherited,
  Terror_prototype_stringNonEnumerablesInherited,
  Tfunction_prototype_stringNonEnumerablesInherited,
  Tfunction_prototype_stringNonEnumerablesOwn,
  Tfunction_prototype_symbolNonEnumerablesInherited,
  Tpromise_prototype_stringNonEnumerablesInherited,
  Tpromise_prototype_symbolNonEnumerablesInherited,
  TregExp_prototype_stringNonEnumerablesOwn,
  TtypedArray_prototype_stringNonEnumerablesInherited,
} from '../types-info'

describe('types-info smoke tests', () => {
  describe('Array', () => {
    expectType<Tarray_prototype_stringNonEnumerablesInherited_values<[]>>(() => [])
    expectType<Tarray_prototype_stringNonEnumerablesInherited_values<[]>>(() => 'a string')
    expectType<Tarray_prototype_stringNonEnumerablesInherited_values<[]>>(() => true)
    expectType<Tarray_prototype_stringNonEnumerablesInherited_values<[]>>([].fill)
    expectType<Tarray_prototype_stringNonEnumerablesInherited_values<[]>>([].findLastIndex)

    // @ts-expect-error OK
    expectType<Tarray_prototype_stringNonEnumerablesInherited_values<[]>>(true)
    // @ts-expect-error OK
    expectType<Tarray_prototype_stringNonEnumerablesInherited_values<[]>>(1)
    // @ts-expect-error OK
    expectType<Tarray_prototype_stringNonEnumerablesInherited_values<[]>>(1n)
  })
  describe('TypedArray', () => {
    expectType<TtypedArray_prototype_stringNonEnumerablesInherited>('findLastIndex')
    expectType<TtypedArray_prototype_stringNonEnumerablesInherited>('subarray')
  })
  describe('DataView', () => {
    expectType<TdataView_prototype_stringNonEnumerablesInherited>('setBigUint64')
  })
  describe('Date', () => {
    expectType<Tdate_prototype_stringNonEnumerablesInherited>('toUTCString')
    // @ts-expect-error OK 'toGMTString' missing in keyof, but returned at runtime
    expectType<Tdate_prototype_stringNonEnumerablesInherited>('toGMTString')
  })
  describe('Error', () => {
    expectType<Terror_prototype_stringNonEnumerablesInherited>('message')
  })
  describe('Promise', () => {
    expectType<Tpromise_prototype_stringNonEnumerablesInherited>('then')
    expectType<Tpromise_prototype_symbolNonEnumerablesInherited>(Symbol.toStringTag)
  })
  describe('RegExp', () => {
    expectType<TregExp_prototype_stringNonEnumerablesOwn>('lastIndex')
  })
  describe('Function', () => {
    expectType<Tfunction_prototype_stringNonEnumerablesOwn>('length')
    // expectType<Tfunction_prototype_stringNonEnumerablesInherited>('prototype')
    expectType<Tfunction_prototype_stringNonEnumerablesInherited>('arguments')
    expectType<Tfunction_prototype_symbolNonEnumerablesInherited>(Symbol.hasInstance)
  })
})
