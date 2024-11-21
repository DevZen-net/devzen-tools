import * as _ from 'lodash'
import { isArrayBuffer } from '../typezen/isArrayBuffer'

import { isPrimitive } from '../typezen/isPrimitive'
import { isPass, isStop, NOTHING, StopClass } from '../typezen/utils'
import { toStringSafe } from '../utils'
import { ArrayBufferCursor, DataViewType } from './ArrayBufferCursor'
import {
  IKeys_DefaultOptions,
  IKeysOptions,
  keys,
  keys_DefaultOptions,
  KeysOrValues,
} from './keys'

/**
 * Returns either or both A) the `InsideValues` (i.e Nested Values) along with B) PropsValues of the Tinput, based on the `KeysOptions` passed.
 *
 * Follows closely the `values()` function, within the limitations of JS/TS ;-)
 *
 * @see KeysOrValues which is the main type utility 'function' that does the work.
 *
 * @param Tinput The input value, whose values are to be extracted.
 * @param Toptions The `IKeysOptions` to be used for extracting the values.
 *
 * @returns the InsideValues (i.e Nested Values for IsNestingObject) and/or PropsValues of the Tinput, based on the `KeysOptions` passed (not as an Array, but a plain type).
 */
export type Values<Tinput, Toptions extends IKeysOptions> = KeysOrValues<
  Tinput,
  Toptions,
  false
>

/**
 * Returns an array of either OR both of:
 *  a) Nested / Nested Values (eg Array elements, Map values, Object.values() etc)
 *  b) the props Values (i.e [`_.values()`](https://lodash.com/docs/4.17.15#values) equivalent)
 * of the input value, according to [`KeyOptions`](../interfaces/KeyOptions.html). Rigorously typed according to the input value and KeyOptions.
 *
 * The features, logic & options (of `KeysOptions`) are identical to [`z.keys`](../functions/keys.html), but it returns the nested/props **values** instead of the nested **keys/props**. See [`Keys`](../functions/Keys.html) for more details.
 * @returns an array of Nested / Nested Values and/or Props Values, according to input &  KeyOptions. The type is rigorously typed according to **input** and [`KeyOptions`](../interfaces/KeyOptions.html) and is implemented by [`KeysValues`](../interfaces/KeysValues.html).
 */
export function values<Tinput, Toptions extends IKeysOptions = IKeys_DefaultOptions>(
  input: Tinput,
  options?: Toptions
): Values<Tinput, Toptions>[] {
  options = _.extend({}, keys_DefaultOptions, options)

  if (!_.isObject(input)) {
    if (options.strict)
      throw new TypeError(
        `z.keys: strict: true works only for types passing _.isObject, but value = ${toStringSafe(input)}`
      )

    if (isPrimitive(input)) return []
    else {
      const msg = `z.values: internal error: value is not isPrimitive, but not an _.isObject either! You might need to check logs for value.`
      throw new TypeError(`${msg}Value = ${input}`)
    }
  }

  if (isArrayBuffer(input)) {
    const result: number[] = []
    if (!options.props || options.props === 'all') {
      // prettier-ignore
      if (!options.dataViewType) throw new Error(`z.values(): options.dataViewType is required to loop over an ArrayBuffer to pick its nested values()`)

      const arrayBufferCursor = new ArrayBufferCursor(input, options.dataViewType)
      while (arrayBufferCursor.hasNext()) result.push(arrayBufferCursor.readNext())
    }

    // add existing props to result if needed
    if (options.props)
      for (const key of keys(input, { ...options, props: true }))
        result.push((input as any)[key])

    // @ts-expect-error @todo(111): fix this
    return result
  }

  if (_.isSet(input) || _.isMap(input)) {
    let setOrMapValues: any[] = options.props
      ? // get only the prop's values
        keys(input, {
          ...options,
          props: true,
        }).map((key) => (input as any)[key])
      : []

    // get only the actual Set/Map values, if needed
    if (!options.props || options.props === 'all')
      for (const setOrMapValue of input.values()) setOrMapValues.push(setOrMapValue) // note: set values are actually Set keys

    return setOrMapValues
  } else return keys(input, options).map((key) => (input as any)[key])
}
