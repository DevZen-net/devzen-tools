import { isClass } from './classes'
import { isFunction } from './isFunction'

/**
 * Checks if value passed is any kind of Function, but excluding Classes. Uses z.isFunction that works for async generator functions (unlike lodash).
 *
 *  @param value any value
 *
 *  @returns {boolean} `true` if the value is an invokable/callable Function (including async & generator), but not a class that needs `new MyClass` to create an instance, false otherwise.
 */
export const isRealFunction = (value: unknown): value is Function =>
  isFunction(value) && !isClass(value)
