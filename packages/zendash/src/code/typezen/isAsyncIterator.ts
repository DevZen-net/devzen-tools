// https://stackoverflow.com/questions/47446272/javascript-how-can-i-tell-if-an-object-is-a-map-iterator/48180059#48180059

/**
 * Checks if value is an AsyncIterator (including AsyncGenerator)
 *
 * @todo: export const isAsyncIterator = <T>(val: AsyncIterator<T> | any): val is AsyncIterator<any> =>
 * @todo: docs!
 * @todo: are all (sync) Generators also Iterators? Yes, they should be!
 */
export const isAsyncIterator = (val): val is AsyncIterator<any> =>
  !!val && typeof val[Symbol.asyncIterator] === 'function'
