import { expectType, TypeEqual } from 'ts-expect'
import { MapIteratorEntries, MapIteratorKeys, MapIteratorValues } from '../isMapIterator'

const keyValues = <[string, number | boolean][]>[
  ['aKey', 123],
  ['aKey2', true],
]

const aMap = new Map(keyValues)

type aMapType = Map<string, number | boolean>
expectType<TypeEqual<typeof aMap, aMapType>>(true)

// ### Map Entries ###

const aMapEntries = aMap.entries()
type mapEntriesType = MapIterator<[string, number | boolean]>
expectType<TypeEqual<typeof aMapEntries, mapEntriesType>>(true)
for (const entries of aMapEntries) {
  expectType<TypeEqual<typeof entries, [string, number | boolean]>>(true)
}

// ### Map Values ###

const aMapValues = aMap.values()
type mapValuesType = MapIterator<number | boolean>
expectType<TypeEqual<typeof aMapValues, mapValuesType>>(true)
for (const val of aMapValues) {
  expectType<TypeEqual<typeof val, number | boolean>>(true)
}

// ### Map Keys ###

const aMapKeys = aMap.keys()
type mapKeysType = MapIterator<string>
expectType<TypeEqual<typeof aMapKeys, mapKeysType>>(true)
for (const key of aMapKeys) {
  expectType<TypeEqual<typeof key, string>>(true)
}

// TMapIteratorEntries fail on the other two (correctly so)

// @ts-expect-error Type string is not assignable to type [any, any]
const aMapEntriesWrongKeys: MapIteratorEntries<any, any> = aMap.keys()
// @ts-expect-error
const aMapEntriesWrongValues: MapIteratorEntries = aMap.values()

// TMapIteratorKeys should fail on the other two (but they don't)

// @ts-expect-error Type [string, number | boolean] is not assignable to type string
const aMapKeysWrongEntries: MapIteratorKeys<string> = aMap.entries()
// @todo: this should also fail but doesnt
const aMapKeysWrongEntries_NOT_FAILING: MapIteratorKeys<any> = aMap.entries()
// @ts-expect-error Type number is not assignable to type string
const aMapKeysWrongValues: MapIteratorKeys<string> = aMap.values()
// @todo: this should also fail but doesnt
const aMapKeysWrongValues_NOT_FAILING: MapIteratorKeys<any> = aMap.values()

// TMapIteratorValues should fail on the other two (but they don't)

// @ts-expect-error Type string is not assignable to type number
const aMapValuesWrongKeys: MapIteratorValues<number> = aMap.keys()
// @todo: this should also fail but doesnt
const aMapValuesWrongKeys_NOT_FAILING: MapIteratorValues<any> = aMap.keys()

// @ts-expect-error Type [string, number | boolean] is not assignable to type number
const aMapValuesWrongEntries: MapIteratorValues<number> = aMap.entries()
// @todo: this should also fail but doesnt
const aMapValuesWrongEntries_NOT_FAILING: MapIteratorValues<any> = aMap.entries()
