import * as _ from 'lodash'
import { IKeysOptions, keys } from '../loopzen/keys'
import { isBoxedPrimitive } from '../typezen/isBoxedPrimitive'
import { isMapIterator } from '../typezen/isMapIterator'
import { isPrimitive } from '../typezen/isPrimitive'
import { isRealObject } from '../typezen/isRealObject'
import { isRef } from '../typezen/isRef'
import { isSetEqual } from '../typezen/isSetEqual'
import { isSetIterator } from '../typezen/isSetIterator'
import { isSingle } from '../typezen/isSingle'
import { realObjectType } from '../typezen/realObjectType'
import { type, TypeNames } from '../typezen/type'
import { Any } from '../typezen/type-utils'
import { isNothing } from '../typezen/utils'

const isSetOrMap = (val: unknown): val is Map<any, any> | Set<any> =>
  _.isSet(val) || _.isMap(val)

/**
 * Customizer callback type for [`z.isEqual`](/functions/isEqual.html).
 *
 * Checks for equality of two values, returning `true` or a "truthy" value if they are considered equal.
 *
 * If the customizer returns `undefined`, comparisons are handled by `z.isEqual`.
 *
 * It is called with (aValue, bValue, options, a, b) with `this` bound to `ctx` (if passed).
 *
 * The `options` argument includes a `path` array, which is populated with the keys/indexes while objects/arrays are traversed, empty at root. The _.last(options.path) is the current key/index (undefined if at root).
 */
//
export type IsEqualCustomizerCallback = (
  valA: any,
  valB: any,
  options: IsEqualOptions,
  originalA: any,
  originalB: any
) => boolean | any

/**
 * Options interface for [`z.isEqual`](/functions/isEqual.html)
 */
export interface IsEqualOptions extends IKeysOptions {
  /**
   * If true, it will use `isEqual` method of the objects (if they have one) for the ultimate decision of equality.
   *
   * @default true
   */
  isEqual?: boolean

  /**
   *  If true, examine all (inherited) properties, not just *own*
   *
   *  @default false
   */
  inherited?: boolean

  /**
   * If true, then all **VALUES that are refs** must point to the same objects (i.e strict === equality), not lookalike clones! It checks only root items, no reason to go deeper!
   *
   * Effectively, it checks for **a shallow clone**, rather than a deep one (note: `_.isEquals` does deep only). You can have a clone oof the outer array/object/Set etc, but the values must be non-clones!
   *
   * @default false
   */
  exactValues?: boolean

  /**
   * If `true`, then all **KEY refs** must point to the same objects (i.e strict === equality), not lookalike clones!
   *
   * It is like `exact`, but for KEYS:
   * - the `Set` type has entries that are keys-only (i.e not values) and these can be object refs.
   * - Similarly, `Map` has keys that can be objects/references.
   *
   * The `exactKeys` options applies only to these keys, not to the values or object symbol props
   *
   * Note: default behavior is adopted from lodash:
   *
   *      _.isEqual(new Map([[{a:1}, 'one']]), new Map([[{a:1}, 'one'],])) // true
   *
   * @default false
   */
  exactKeys?: boolean

  /**
   * If true, check only if all of the 1st arg's props are isEqual with the 2nd's, even if the 2nd arg has more properties.
   *
   * For example, if `a` is `{a: 1}` and `b` is `{a: 1, b: 2}`, it will return `true`.
   *
   * @default false
   */
  like?: boolean

  /**
   * If you pass an array, it will become populated with the keys/indexes while objects/arrays are traversed. Useful for debugging (to see which prop path was the reason for non-equality)!
   *
   * @todo: not working with ArrayBuffer & Error types
   *
   * @default []
   */
  path?: Any[]

  /**
   * If you pass an array of [`Tany`](/types/Tany.html), it will exclude those keys from the comparison.
   *
   * @todo: if it is a Function, called with (key, val, ??), excludes key if true is returned (NOT IMPLEMENTED YET)
   *
   * @default []
   */
  exclude?: Any[]

  /**
   * Allows unboxing of Boxed Primitives (eg `new Number(1)` & `1` are equal).
   *
   */
  unbox?: boolean

  // /**
  //  * @todo: NOT IMPLEMENTED
  //  * Mimic lodash behavior where `_.isEqual(Object(someValue), someValue)` === `true`.
  //  */
  // valueOf?: boolean

  // /**
  //  * @todo(222): NOT IMPLEMENTED YET
  //  * Note: now its `props: true` that caters for `ignoreTypes` behavior
  //  * If `true`
  //  * - only the props of the objects are compared, not the actual values,
  //      - if `props: true` as well ?
  //      - or force `props: true` ?
  //  * - @todo(123): support auto casting? Like a == b from JS, or something better?
  //  */
  // ignoreTypes?: boolean

  /**
   * If `true`, it will treat all objects as realObjects, even if they are not: Instances of any class & POJSOs are equal, if they have the same prop/values.
   *
   * @example
   *
   *    isEqual(new class(
   *
   * @todo(213): what about different classes, but same values? What about inheritance? What should be allowed?
   */
  realObjectAsPojso?: boolean

  /**
   * The `customizer` function can be optionally passed as an options property.
   *
   * If `undefined` or if the function call returns `undefined`, comparisons are handled by `z.isEqual`.
   *
   * The customizer can be the 3rd parameter (to maintain compatibility with *lodash* _.isEqualWith) and options can be the 5th, but you can pass `customizer` and `ctx` as properties of the `options` object being the 3rd arg. But if you pass them in both places, it throws an Error.
   *
   * The customizer type is [`TisEqualcustomizer`](/types/TisEqualcustomizer.html).
   */
  customizer?: IsEqualCustomizerCallback
  /**
   * The `this` binding (aka context) of `customizer`. If `undefined`, `this` is bound to the global object. If `ctx` is passed both as a property of the `options` object, an as the 4rth arg, it will throw.
   */
  ctx?: any
}

/**
 * Default options for [`z.isEqual`](/functions/isEqual.html) *
 */
export const isEqual_DefaultOptions: IsEqualOptions = {
  inherited: false,
  isEqual: true,
  exactValues: false,
  exactKeys: false,
  like: false,
  unbox: false,
  // valueOf: false,
  props: false,
}

const isExcluded = (prop: any, excluded: any[] = []): boolean =>
  _.some(excluded, (p) => p === prop)

export function isEqual(
  /**
   * The first value to compare.
   */
  a: any,
  /**
   *  The second value to compare.
   */
  b: any,
  /**
   * The function to customize comparisons. If `undefined`, comparisons are handled by `z.isEqual`. If `customizer` is passed as a property of the `options` object, it will be used instead of this argument. You can also pass the `options` object as the 3rd argument, in place of `customizer`.
   */
  customizer?: IsEqualCustomizerCallback,
  /**
   * The `this` binding (aka context) of `customizer`. If `undefined`, `this` is bound to the global object. If `ctx` is passed as a property of the `options` object, it will be used instead of this argument.
   */
  ctx?: any,
  /**
   * The options object - see above.
   */
  isEqualOptions?: IsEqualOptions
): boolean

export function isEqual(
  /**
   * The first input value to compare.
   */
  a: any,
  /**
   *  The second input value to compare.
   */
  b: any,
  /**
   * The `options` object can be the 3rd argument (instead of `customizer`).
   */
  isEqualOptions?: IsEqualOptions,
  /**
   * The `this` binding (aka context) of `customizer`. If `undefined`, `this` is bound to the global object. If `ctx` is passed as a property of the `options` object, it will be used instead of this argument.
   */
  ctx?: any
): boolean

/**
 * Deeply compares 2 input values, returning `true` if they are considered equal, with loads of awesome options!
 *
 * Similar to lodash's `_.isEqual`, but:
 * - adds [**loads of extra options**](/types/IisEqualOptions.html), for example use `.isEquals()` of the values if it exists, `like` one-side similarity comparisons, `exact` refs required (shallow clones), `inherited` or `exclude` props, get the `path` of where the difference was found and loads more! @see [`IisEqualOptions`](/types/IisEqualOptions.html) *
 * - It supports all types, including `Map`, `Set`, `WeakMap`, `WeakSet`, `ArrayBuffer`, `Error`, `RegExp`, `Date`, `Symbol`, `BigInt`, `TypedArray`, `Promise`, `class`, `function`, `arguments`, `null`, `undefined`, `NaN`, `realObject` and more.
 * - You can also use any of [`IKeysOptions`](/interfaces/IKeysOptions.html) to control which keys are compared, as [`IisEqualOptions`](/types/IisEqualOptions.html) extends [`IKeysOptions`](/interfaces/IKeysOptions.html)!
 *    - when `props: true`, **only props** matter, not the actual values! *
 *
 * Note: it is NOT 100% compatible to `lodash`, mostly for good reasons. Few minor edge cases are not implemented yet as `options`, and current default deemed better and so kept different to lodash. Search `z.isEqual DIFFERENT` in `src/code/objects/isEqual-lodash-spec.ts`, where lodash tests are also tested against `z.isEqual`, with differences highlighted.
 *
 * @param a - The first value to compare
 * @param b - The second value to compare
 * @param customizer - The function to customize comparisons. If `undefined`, comparisons are handled by `z.isEqual`. If `customizer` is passed as a property of the `options` object, it will be used instead of this argument. You can also pass the `options` object as the 3rd argument, in place of `customizer`.
 * @param ctx - The `this` binding (aka context) of `customizer`. If `undefined`, `this` is bound to the global object. If `ctx` is passed as a property of the `options` object, it will be used instead of this argument.
 * @param options - The options object - see above. It can also be passed as the 3rd argument, in place of `customizer`.
 *
 * @returns true if the input values are "equal" (based on options), `false` otherwise
 */
export function isEqual(
  a: any,
  b: any,
  _customizerOrOptions?: IsEqualCustomizerCallback | IsEqualOptions,
  ctx?: any,
  _options?: IsEqualOptions,
  _forcedOptions?: IsEqualOptions // Internal use only
): boolean {
  // options handling - might be in customizer's place if customizer is actually the options object, destructure it
  let options: IsEqualOptions | undefined

  if (isRealObject(_customizerOrOptions)) {
    // prettier-ignore
    if (_options) throw new Error('z.isEqual: you cannot pass options as 3rd and 5th argument at the same time')
    options = _.assign({}, isEqual_DefaultOptions, _customizerOrOptions)
  }

  if (_options)
    if (isRealObject(_options)) {
      options = _.assign({}, isEqual_DefaultOptions, _options)
    } else {
      throw new Error('z.isEqual: options must be an object of type IisEqualOptions')
    }

  if (!options) options = { ...isEqual_DefaultOptions }
  options.path = options.path || []
  options.exclude = options.exclude || []

  _.assign(options, _.omit(_forcedOptions, ['exclude']))
  options.exclude = _.union(options.exclude || [], _forcedOptions?.exclude || [])

  // customizer handling

  if (_.isFunction(_customizerOrOptions) && _.isFunction(options.customizer))
    throw new Error(
      'z.isEqual: you cannot pass customizer as 3rd argument and as options.customizer at the same time'
    )

  if (
    _customizerOrOptions &&
    !isRealObject(_customizerOrOptions) &&
    !_.isFunction(_customizerOrOptions)
  ) {
    const err = new Error(
      'z.isEqual: 3rd arg must be a function customizer or an object of type IisEqualOptions'
    )
    if (options.strict) throw err
    else console.error(err)
  }

  if (options.customizer && !_.isFunction(options.customizer))
    throw new Error('z.isEqual: options.customizer must be a function')

  let customizer: IsEqualCustomizerCallback | undefined
  if (_.isFunction(_customizerOrOptions)) customizer = _customizerOrOptions
  else if (_.isFunction(options.customizer)) customizer = options.customizer
  // we now have customizer = function or undefined

  // ctx handling
  if (ctx && options.ctx)
    throw new Error(
      'z.isEqual: you cannot pass ctx as 4th argument & as options.ctx at the same time'
    )
  if (options.ctx) ctx = options.ctx
  // we now have ctx = object or undefined

  // console.log('BEFORE isEqualInternal: ', 'a =', a, 'b =', b, new Error())
  return isEqualInternal(a, b, customizer, ctx, options, a, b, new Map())
}

const isEqualInternal = (
  a: any,
  b: any,
  customizer: IsEqualCustomizerCallback | undefined,
  ctx: any,
  options: IsEqualOptions,
  originalA: any,
  originalB: any,
  seenRefsAndTheirComparedValue?: Map<any, any> // for circular refs avoidance
): boolean => {
  // console.log('isEqualInternal: ', 'a =', a, 'b =', b, seenRefsAndTheirComparedValue)
  // handle customizer & ctx
  if (customizer) {
    const cbResult = customizer.call(ctx, a, b, options, originalA, originalB)
    if (cbResult !== undefined) return isNothing(cbResult) ? false : !!cbResult // respect only non-undefined as truthy or falsey, as undefined means "handle it your self!"
  }

  // Lets eliminate some rudimentary cases
  if (a === b) return true

  if (options.isEqual) {
    if (_.isFunction(a?.isEqual)) return a.isEqual(b)
    if (_.isFunction(b?.isEqual)) return b.isEqual(a)
  }

  if (options.unbox && options.props !== true && (isBoxedPrimitive(a) || isBoxedPrimitive(b)))
    return a?.valueOf() === b?.valueOf() // && a?.constructor === b?.constructor ?

  // after unboxing is done, we can compare the types

  const typeA = type(a)
  const typeB = type(b)

  if (typeA !== typeB) {
    // special case, mimic lodash. // @todo: make optional via `options.ignoreTypes`
    if (!isSetEqual([typeA, typeB], ['arguments', 'realObject'] as [TypeNames, TypeNames]))
      return false
  }

  // From now on, types are the same, test only one side for type() etc
  if (
    isPrimitive(a) ||
    _.isWeakSet(a) ||
    _.isWeakMap(a) ||
    isMapIterator(a) ||
    isSetIterator(a)
  )
    return a === b

  if (options.props !== true && (isSingle(a) || _.isArrayBuffer(a) || _.isError(a))) {
    // @todo: implement z.isEqual for these types, dont rely on isEqual
    if (!_.isEqual(a, b)) return false
    if (!options.props) return true
  }

  // for circular refs avoidance
  if (isRef(a)) {
    if (
      seenRefsAndTheirComparedValue?.get(a) === b ||
      seenRefsAndTheirComparedValue?.get(b) === a
    )
      return true
    seenRefsAndTheirComparedValue?.set(a, b)
  }

  // Keys / props comparison: if we've passed this point, it means we care about props (and entries / keys) of object types (or Set / Map entries)

  // xProps hold only the props for all objects.
  // For Set/Map specifically, they hold props only if needed (different to Map/Set natural key/entries).
  let aProps: any[] = []
  let bProps: any[] = []
  if (!isSetOrMap(a) || (isSetOrMap(a) && options.props)) {
    const keysOptions: IKeysOptions = {
      ...options,
      props: isSetOrMap(a) || options.props,
    }
    try {
      aProps = keys(a, keysOptions).filter((k) => !isExcluded(k, options.exclude))
      bProps = keys(b, keysOptions).filter((k) => !isExcluded(k, options.exclude))
    } catch (e) {
      throw new Error(`isEquals: error while getting keys(): message = ${(e as any)?.message}`)
    }
  }

  // console.log('isEqual:', a, b, aProps, bProps)

  // additional entries-only keys for Set & Map
  let aSetMapKeys: any[] = []
  let bSetMapKeys: any[] = []
  if (isSetOrMap(a) && options.props !== true) {
    const keysOptions: IKeysOptions = { ...options, props: false }
    try {
      aSetMapKeys = keys(a, keysOptions).filter((k) => !isExcluded(k, options.exclude))
      bSetMapKeys = keys(b, keysOptions).filter((k) => !isExcluded(k, options.exclude))
    } catch (e) {
      throw new Error(`isEquals: error while getting keys(): message = ${(e as any)?.message}`)
    }
  }

  if (
    !options.like &&
    (aProps.length + aSetMapKeys.length !== bProps.length + bSetMapKeys.length ||
      !isSetEqual(aProps, bProps)) // props (string & symbol) are always compared strictly. Empty arrays if props: false
  )
    return false

  if (options.props !== true && isSetOrMap(a)) {
    /** If Set or Map, check if the values are equal, respecting exactKeys, exactValues, like, etc  */
    if (
      !aSetMapKeys.every((keyA) => {
        ;(options as any).path.push(keyA)

        let valA = _.isSet(a) ? true : a.get(keyA)
        // find if some key in b (exactKey or not) exists
        // and its valB is equal to valA (exactValue or not)
        // if not, return false
        if (
          !_.some(bSetMapKeys, (keyB) => {
            if (options.exactKeys && keyA !== keyB) return false

            if (
              !isEqualInternal(
                keyA,
                keyB,
                customizer,
                ctx,
                options,
                originalA,
                originalB,
                seenRefsAndTheirComparedValue
              )
            )
              return false

            let valB = _.isSet(b) ? b.has(keyB) : b.get(keyB)

            if (options.exactValues && valA !== valB) return false

            if (
              !isEqualInternal(
                valA,
                valB,
                customizer,
                ctx,
                options,
                originalA,
                originalB,
                seenRefsAndTheirComparedValue
              )
            ) {
              return false
            }

            return true
          })
        )
          return false
        ;(options as any).path.pop()
        return true
      })
    )
      return false
  }

  // Real object VS POJSO comparison: if `realObjectAsPojso: true`, we dont care about the class/constructor of the objects

  if (
    !options.realObjectAsPojso &&
    [typeA, typeB].includes('realObject') &&
    [realObjectType(a), realObjectType(b)].includes('instance')
  )
    if (a.constructor !== b.constructor)
      // @todo(214): what about sub-classes? A Person & Employee with same props?
      return false

  // if (realObjectType(a) === realObjectType(b) && realObjectType(a) === 'pojso') {
  //     ![a.constructor, b.constructor].includes(null) // @see lodash tests "should treat objects created by `Object.create(null)` like plain objects"

  // We only care about props at this point, not natural values (eg array elements, Map & Set entries)
  // They will be empty, if we dont care about them.

  return aProps.every((prop) => {
    ;(options.path as any).push(prop)

    if (options.exactValues && a[prop] !== b[prop]) return false

    if (
      !isEqualInternal(
        a[prop],
        b[prop],
        customizer,
        ctx,
        options,
        originalA,
        originalB,
        seenRefsAndTheirComparedValue
      )
    ) {
      return false
    }

    ;(options as any).path.pop()
    return true
  })
}
