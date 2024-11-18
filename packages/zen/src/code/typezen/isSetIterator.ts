// https://stackoverflow.com/questions/47446272/javascript-how-can-i-tell-if-an-object-is-a-map-iterator/48180059#48180059

export const isSetIterator = <T>(val: Iterable<T> | any): val is IterableIterator<T> =>
  !!val && val[Symbol.toStringTag] === 'Set Iterator'
// val.toString() === "[object Set Iterator]"
// Object.prototype.toString.call(Object.getPrototypeOf(val)) === '[object Set Iterator]'

export type SetIteratorEntries<Titem> = Set<Titem>['entries'] extends () => Iterator<infer T>
  ? IterableIterator<T>
  : never // @todo: try SetEntries

// These aren't perfect - see isSetIterator-typing-tests.ts
export type SetIteratorValues<Titem> = Set<Titem>['values'] extends () => Iterator<infer T>
  ? IterableIterator<T>
  : never

export type SetIteratorKeys<Tkey> = Set<Tkey>['keys'] extends () => Iterator<infer T>
  ? IterableIterator<T>
  : never
