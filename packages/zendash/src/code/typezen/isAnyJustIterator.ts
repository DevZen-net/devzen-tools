import { isAsyncGenerator } from './isAsyncGenerator'
import { isAsyncIterator } from './isAsyncIterator'
import { isGenerator } from './isGenerator'
import { isPlainIterator } from './isPlainIterator'

/**
 * Checks if value is any kind of `Iterator` or `AsyncIterator`, including `Generator` and `AsyncGenerator`, but **excluding** standard Iterables (that are legally also Iterators) like `Array`, `Set` & `Map`, that have their own [`_z.type`](/functions/type) and are more than Any Just Iterator.
 *
 * @param value
 */
export const isAnyJustIterator = (value: unknown): value is Iterator<any> =>
  isPlainIterator(value) ||
  isGenerator(value) ||
  isAsyncGenerator(value) ||
  isAsyncIterator(value)
