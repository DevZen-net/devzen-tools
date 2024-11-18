import { isOk } from './trueFalse'

/**
 * A Symbol that represents the absense of at value at runtime - similar idea to `never` type in TypeScript.
 *
 * Usually we use `undefined` for these cases, but we want to recognise `undefined` as a separate valid in JS data, that occurs when something is not defined.
 *
 * `NOTHING` is used to represent a real `never` value, used in the `z.loop()` family functions to represent the absense of a value. We don't name it `never` (or `void`) so it's not inconsistent with TypeScript's typing system - but it might be renamed in the future.
 */
export const NOTHING = Symbol('z.NOTHING')
export type T_NOTHING = typeof NOTHING

/**
 * Returns if value is a `z.NOTHING`, i.e the absence of any value, in the ZenType/ZenDas world.
 *
 * @param value
 */
export const isNothing = (value: unknown): value is typeof NOTHING => value === NOTHING

// # Stop

export type Stop = typeof STOP | ReturnType<typeof STOP>

/**
 * An instance that represents a stopping of iteration, carrying an optional "return" value.
 * Internal use only
 */
export class StopClass {
  constructor(public returnValue: any) {}
}

/**
Use `return STOP` or `return STOP(returnValue)` to stop iteration in callback functions, like `map`, `filter`, `take` etc.

The `STOP(returnValue)` (experimental), where `returnValue` is included as the last item of the iteration. @todo(444): test it's projecting the value through any possible `options.map`

Can be used everywhere (`each`, `filter`, `take` as well as `map`, `reduce` etc).
 - for boolean returning callbacks (eg `filter` returning `false` only filters/rejects current item), to stop the iteration.
 - for value returning callbacks (eg `reduce`, `map`), You can either stop with `return STOP` (without calling it), or `return STOP(someValue)` to provide the last value of the mapping. @todo(444): test this
*/
export const STOP = function STOP(returnValue: any) {
  return new StopClass(returnValue)
}

/**
 * Returns if value is a `STOP` or `STOP()` (i.e a `Stop` instance with a returnValue, the last of the iteration).

 * @param value
 */
export const isStop = (value: Stop | any): value is Stop =>
  value === STOP || value instanceof StopClass

/**
 * Returns if value is passing, used in various filters and projections.
 * It passes if:
 * * value is strict *JS truthy*, i.e `!!value`
 * * and `value` is not equal to `z.NOTHING`, `new Boolean(false)`, `new Number(0)`, `BigInt(0n)`, `new String('')`
 * * finally `value` is not equal to `STOP` or a `Stop` instance, which also has a special meaning in the context of projections and iterators: it STOPS the iteration, like a `break` in a loop.
 *
 * @param value
 */
export const isPass = (value: any) => isOk(value) && !isStop(value)
