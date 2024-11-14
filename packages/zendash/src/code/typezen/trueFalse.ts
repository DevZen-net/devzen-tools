import * as _ from 'lodash'
import { NOTHING } from './utils'

/* TRUE & TRUTHIES & OK */

/**
 * Returns true if value is strict `true`
 *
 * @param value
 * @returns boolean
 */
export const isStrictTrue = (value: unknown): value is true => value === true

/**
 * Returns true if the value is strict `true` OR `new Boolean(true)`
 *
 * @param value
 * @returns boolean
 */
export const isTrue = (value: unknown): value is true | Boolean => _.isEqual(value, true)

/**
 * Returns if value is strict *JS truthy*, i.e `!!value`, along with `value !== _z.NOTHING` && not `new Boolean(false)`
 *
 * @todo: type guard
 *
 * @param value
 *
 * @returns boolean
 */
export const isTruthy = (value: unknown): boolean =>
  !!value && value !== NOTHING && !_.isEqual(value, new Boolean(false))

/**
 * Returns true if value is a **ZenDash truthy**, defined as `!_.isBad(value)`, which includes:
 *
 * * _z.isTruthy(value)
 *
 * * `value` is not `new Boolean(false)` or `new Number(0)` or  `BigInt(0n)` or `new String('')`
 *
 * @todo: type guard
 *
 * @param value
 *
 * @returns boolean
 */
export const isOk = (value: unknown) => !isBad(value)

/***** FALSE & FALSIES & BAD **/

/**
 * Returns true if value is strict `false`
 *
 * @param value
 * @returns boolean
 */
export const isStrictFalse = (value: unknown): value is false => value === false

/**
 * Returns true if the value is strict `false`, including `new Boolean(false)`
 *
 * @param value
 *
 * @returns boolean
 */
export const isFalse = (value: unknown): value is false | Boolean => _.isEqual(value, false)

/**
 * Returns true if value is **zendash falsey**, a.k.a bad, which includes
 *
 * * `_z.isFalse(value)`
 *
 * * `!value` (i.e value is `undefined`, `null`, `0`, `NaN`, `false`, `""`)
 *
 * * value === _z.NOTHING
 *
 * * value is `new Boolean(false)` or `new Number(0)`, `BigInt(0n)`, `new String('')`
 *
 * @todo: type guard
 *
 * @param value
 */
export const isBad = (value: unknown) =>
  isFalse(value) ||
  isFalsy(value) ||
  (value instanceof Number && value.valueOf() === 0) ||
  (value instanceof String && value.valueOf() === '')

/**
 * Returns true if value is `JS falsy`, i.e `!value`, but also if `value === _z.NOTHING` or `new Boolean(false)`
 * @param value
 */
export const isFalsy = (value: unknown): boolean =>
  !value || _.isEqual(value, false) || value === NOTHING
