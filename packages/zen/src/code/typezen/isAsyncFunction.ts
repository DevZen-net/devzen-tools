import { isAsyncGeneratorFunction } from './isAsyncGeneratorFunction'

export type AsyncFunction = (...args: any[]) => Promise<any>

/**
 * Checks if value is declared as an [`AsyncFunction`](../types/AsyncFunction.html). This includes only `async () => Promise<any>` declarations, but NOT normal functions that returns a Promise (i.e `() => Promise<any>`).
 *
 * It includes only `'asyncNormalFunction'`, `'a_Function_Async_normalAnonymous'`, `'a_Function_async_arrow_named'`, `'a_Function_async_arrow_anonymous'` and it excludes `'a_GeneratorFunction_async_named'` & `'a_GeneratorFunction_async_anonymous'` and all others.
 *
 * @see [`z.isAsyncGenerator()`](../functions/isAsyncGenerator.html)
 * @see [`z.isGenerator()`](../functions/isGenerator.html)
 * @see [`z.isFunction()`](../functions/isFunction.html)
 *
 * @param val
 */
export const isAsyncFunction = (val: any): val is AsyncFunction =>
  typeof val === 'function' &&
  !isAsyncGeneratorFunction(val) &&
  Function.prototype.toString.call(val).startsWith('async') // FAILS: val[Symbol.toStringTag].startsWith('async')
