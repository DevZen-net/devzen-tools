import * as _ from 'lodash'
import { expectType, TypeEqual } from 'ts-expect'
import { Writable } from 'type-fest'
import { DataViewType, IfAbsent, IsAbsent } from '../code'

const options: undefined = undefined

// extend & retain the Absent value

export function extend_TypeRetainAbsent<TObject, TSource>(
  object: TObject,
  source: TSource
): IfAbsent<TObject, TObject, IfAbsent<TSource, TSource, TObject & TSource>>

export function extend_TypeRetainAbsent(object: any, source: any) {
  return _.extend(object, source)
}

const res_absent = extend_TypeRetainAbsent({ dataViewType: DataViewType.Uint8 }, options)
expectType<TypeEqual<typeof res_absent, undefined>>(true)

const res_absent1 = extend_TypeRetainAbsent(options, { dataViewType: DataViewType.Uint8 })
expectType<TypeEqual<typeof res_absent1, undefined>>(true)

const res_absent2 = extend_TypeRetainAbsent(
  { dataViewType: DataViewType.Uint8 },
  { foo: 'bar' }
)
expectType<TypeEqual<typeof res_absent2, { dataViewType: DataViewType } & { foo: string }>>(
  true
)

const res_absent3 = extend_TypeRetainAbsent({ dataViewType: DataViewType.Uint8 }, {
  foo: 'bar',
} as const)
expectType<
  TypeEqual<typeof res_absent3, { dataViewType: DataViewType } & { readonly foo: 'bar' }>
>(true)

export function extend_TypeRetainEachOrBoth<TObject, TSource>(
  object: TObject,
  source: TSource
): IfAbsent<TObject, TSource, IfAbsent<TSource, TObject, TObject & TSource>>

export function extend_TypeRetainEachOrBoth(object: any, source: any) {
  return _.extend(object, source)
}

// extend & retain either non-Absent value

const res = extend_TypeRetainEachOrBoth({ dataViewType: DataViewType.Uint8 }, options)
expectType<TypeEqual<typeof res, { dataViewType: DataViewType }>>(true)

const res1 = extend_TypeRetainEachOrBoth(options, { dataViewType: DataViewType.Uint8 })
expectType<TypeEqual<typeof res1, { dataViewType: DataViewType }>>(true)

const res2 = extend_TypeRetainEachOrBoth({ dataViewType: DataViewType.Uint8 }, { foo: 'bar' })
expectType<TypeEqual<typeof res2, { dataViewType: DataViewType } & { foo: string }>>(true)

const res3 = extend_TypeRetainEachOrBoth({ dataViewType: DataViewType.Uint8 }, {
  foo: 'bar',
} as const)
expectType<TypeEqual<typeof res3, { dataViewType: DataViewType } & { readonly foo: 'bar' }>>(
  true
)
