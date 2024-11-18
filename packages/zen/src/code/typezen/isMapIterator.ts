/**
 * Checks if value is a Map Iterator - includes `map.entries()`, `map.values()`, `map.keys()`, `map[Symbol.iterator]()` etc.
 *
 * Currently, it's not possible to check if a value is a Map Entries iterator at runtime (although node & chrome do it, internally!). Same applies at peeking at the values, without altering the internal iterator state (thus, prohibited)!
 *
 * @see https://stackoverflow.com/questions/47446272/javascript-how-can-i-tell-if-an-object-is-a-map-iterator/48180059#48180059
 *
 * @param val
 */
export const isMapIterator = <T>(val: Iterator<T> | any): val is IterableIterator<T> =>
  val[Symbol.toStringTag] === 'Map Iterator'
// Object.prototype.toString.call(Object.getPrototypeOf(val)) === '[object Map Iterator]'

// @todo: find a way to make this work at runtime
// export const isMapEntries = <T>(val: Iterator<T> | any): val is IterableIterator<T> =>
//   val[Symbol.toStringTag] === 'Map Entries' // not working, but somehow node prints [Map Entries] in console

export type MapIteratorEntries<Tkey, Titem> = Map<
  Tkey,
  Titem
>['entries'] extends () => Iterator<infer T>
  ? IterableIterator<T>
  : never

// These aren't perfect - see isMapIterator-typing-tests.ts
export type MapIteratorValues<Titem> = Map<any, Titem>['values'] extends () => Iterator<infer T>
  ? IterableIterator<T>
  : never

export type MapIteratorKeys<Tkey> = Map<Tkey, any>['keys'] extends () => Iterator<infer T>
  ? IterableIterator<T>
  : never
