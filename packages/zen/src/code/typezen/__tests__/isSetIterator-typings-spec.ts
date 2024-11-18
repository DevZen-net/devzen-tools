import { expectType, TypeEqual } from 'ts-expect'
import { SetIteratorEntries, SetIteratorKeys, SetIteratorValues } from '../isSetIterator'

const setValues = <(string | number | boolean)[]>[123, true, 'aKey']

type TvaluesType = string | number | boolean
const aSet = new Set(setValues)

// ### Set Entries ###

const aSetEntries = aSet.entries()

type setEntriesType = SetIterator<[TvaluesType, TvaluesType]>
expectType<TypeEqual<typeof aSetEntries, setEntriesType>>(true)
for (const entries of aSetEntries) {
  expectType<TypeEqual<typeof entries, [TvaluesType, TvaluesType]>>(true)
}

// ### Set Values ###

const aSetValues = aSet.values()
type setValuesType = SetIterator<TvaluesType>
expectType<TypeEqual<typeof aSetValues, setValuesType>>(true)
for (const val of aSetValues) {
  expectType<TypeEqual<typeof val, TvaluesType>>(true)
}

// ### Set Keys ###
const aSetKeys = aSet.keys()
type setKeysType = SetIterator<TvaluesType>
expectType<TypeEqual<typeof aSetKeys, setKeysType>>(true)
for (const key of aSetKeys) {
  expectType<TypeEqual<typeof key, TvaluesType>>(true)
}

// TSetIteratorEntries fail on the other two (correctly so)

// @ts-expect-error Type string is not assignable to type [any, any]
const aSetEntriesWrongKeys: SetIteratorEntries<any> = aSet.keys()
// @ts-expect-error
const aSetEntriesWrongValues: SetIteratorEntries<any> = aSet.values()

// TSetIteratorKeys should fail on the other two (but they don't)

// @todo: @ts-expect-error
const aSetKeysWrongEntries_SHOULD_BE_FAILING: SetIteratorKeys<any> = aSet.entries()

// @todo: @ts-expect-error
const aSetKeysWrongValues_SHOULD_BE_FAILING: SetIteratorKeys<any> = aSet.values()

// TSetIteratorValues should fail on the other two (but they don't)

// @ts-expect-error Type string is not assignable to type number | boolean
const aSetValuesWrongKeys: SetIteratorValues<string> = aSet.keys()

// @todo: @ts-expect-error
const aSetValuesWrongEntries_SHOULD_BE_FAILING: SetIteratorValues<any> = aSet.entries()
// @todo: @ts-expect-error
const aSetValuesWrongKeys_SHOULD_BE_FAILING: SetIteratorValues<any> = aSet.keys()
