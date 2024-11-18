/**
 * Checks if a value is a Promise. Its 2024 and we still need this ;-(
 *
 * Consider the JS status quo:
 *
 *  - `Promise.isPromise === undefined`
 *  - `_.isPromise === undefined`
 *  - `typeof Promise === 'function'`
 *  - `typeof new Promise === 'object'`
 *
 *  The only way to check is: `new Promise instanceof Promise === true`
 *
 *  With Zen we have:
 *
 * - `isPromise(promise) === true`
 *
 * and also
 *
 * - `type(promise) = 'Promise'`
 * - `type(Promise) === 'class'`
 * - `classType(Promise) === 'systemClass'`
 * - `constructor(new Promise) === Promise`
 *
 * @param val
 *
 * @returns true if the value is a Promise
 */
export const isPromise = <T>(val: Promise<T> | any): val is Promise<T> => val instanceof Promise
// constructorNamed(val, 'Promise')

export type IsPromise<T> = T extends Promise<any> ? true : false
export type IfPromise<T, Then = true, Else = false> = T extends Promise<any> ? Then : Else

/**
 * Unwraps the "awaited type" of the Promise, but only once (unlike Awaited which is recursive). Non-promise "thenables" should resolve to `never`. This DOESNT emulate the behavior of `await`, it just unwraps the type of top-level Promise.
 *
 * Based 99% on Awaited from es5.lib.
 */
export type UnwrapPromise<T> = T extends null | undefined ? T : // special case for `null | undefined` when not in `--strictNullChecks` mode
  T extends object & { then(onfulfilled: infer F, ...args: infer _): any; } ? // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
    F extends ((value: infer V, ...args: infer _) => any) ? // if the argument to `then` is callable, extracts the first argument
      V : // unwrap the value
      never : // the argument to `then` was not callable
    T; // non-object or non-thenable
