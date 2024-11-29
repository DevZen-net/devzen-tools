import * as _ from 'lodash'
import { isArguments } from 'lodash'
import { Or, TypedArray } from 'type-fest'
import { isAnyArray } from '../typezen/isAnyArray'
import { isAnyNumber } from '../typezen/isAnyNumber'
import { isArrayBuffer } from '../typezen/isArrayBuffer'
import { isBoxedString } from '../typezen/isBoxedString'
import { isEnumerable } from '../typezen/isEnumerable'
import { isNumberString } from '../typezen/isNumberString'
import { isPrimitive } from '../typezen/isPrimitive'
import {
  BasicProps,
  IsAbsent,
  IsAnyOrUnknown,
  IsPropFalse,
  IsPropTrue,
  InsideKeys,
  InsideValues,
  ObjectPropTypes,
  Props,
  PropsStrict,
  PropsValues,
} from '../typezen/type-utils'
import { toStringSafe } from '../utils'
import { ArrayBufferCursor, DataViewType } from './ArrayBufferCursor'

/**
 * Options interface for z.keys
 */
export interface IKeysOptions {
  /**
   * If true, `keys()` only allows values passing `_.isObject()` / (i.e non `Primitives`), throws otherwise.
   *
   * Note: in `loop()` and `map()` and other projection functions, `strict` only allows `isMany()` types, but in `keys()` it is allowed for all Object types.
   *
   * default: false
   */
  strict?: boolean

  /**
   * If `true`, consider ONLY the props, instead of **Nested Keys** for *special objects* (Arrays, TypedArrays, Maps & Sets) - mimics `Object.keys()` / `_.keys()` if so.
   *
   * By default, `z.keys()` returns the "natural keys" for **special objects** with nested values:
   *  - indexes for `Array` & `TypedArray` (eg `[0, 1, 2, 3, ...]`)
   *  - the actual keys of `Map` & `Set` (eg `['someMapKey', {anObjectUsedAsKey: true}, Symbol('aSymbolKey')]`
   * instead of their **Object props**.
   *
   * Similarly, all other functions like `loop()` & `map()` (that extend these options), iterate on those "natural keys" for all of these special objects.
   *
   * For all other objects (including `realObject`, all Iterators & Generators, Boxed Primitives etc),
   * - their `string`/`symbol` props are returned in `keys()`
   * - are iterated on props on `loop()` and family, also depending on their other function-specific options.
   *
   * If `props: true` then the `keys()` & iterations are **only against props**, even for special objects, instead of **Nested Keys**.
   *
   * This only affects the special objects: it makes no difference to non-special values, if `props` is `true`/`false`, as their props are always considered anyway.
   *
   * Note that `Object.keys()` always returns props for ALL objects (i.e `props: true` always), and there is no way to grab natural keys (or symbol props for that matter). This is a special feature of `z.keys()`, and much more useful: why would you want the props of `Map` or an `Array` anyway, 99% of the time? But if you subclassed `Array` or `Map` and want to get the props of that instance (instead of their natural keys), then you use `props: true`.
   *
   * Finally, if `props: 'all'`, you get both the props (first), followed by Nested Keys. Useful for print/debugging, comparisons etc.
   *
   * @default: false / undefined
   */
  props?: boolean | 'all'

  /**
   * Whether to include normal string props
   *
   * @default: true
   */
  string?: boolean

  /**
   * Whether to include Symbol props, when we're dealing with a `realObject` or `props: true`
   *
   * @default: false
   */
  symbol?: boolean

  /**
   * Whether to include own object props.
   *
   * Note: It refers to props only, not Nested Keys, for arrays specifically. We include naturalKeys (i.e array Indexes) even when `{ own: false, props: 'all' }`, to keep consistent with other Inspectable Nested Keys holders (Map & Set). But in realObjects, `{ own: false, props: any }` will return no own props, as it should.
   *
   * @default: true
   */
  own?: boolean

  /**
   * If true, it walks the prototype chain & retrieves all keys of inherited objects.
   *
   * @default: false
   */
  inherited?: boolean

  /**
   * If true (and `nonEnumerables` is also true), it includes top-level (i.e `Object`) props like  `'constructor', 'toString',  'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString'` etc.
   *
   *   It also retrieves these hidden props (that have no types definitions): `'__defineGetter__', '__defineSetter__', _lookupGetter__', '__lookupSetter__', '__proto__'.
   *
   * @default: false
   */
  top?: boolean

  /**
   * If `hidden: true` (and `nonEnumerables` & `top` are also true), it includes top-level (i.e `Object`) hidden props like `'__defineGetter__', '__defineSetter__', _lookupGetter__', '__lookupSetter__', '__proto__'. Note that these are hidden props, thus have no TypeScript definitions.
   *
   * Also, if `hidden: true`, it un-hides user/custom props that start & end with `__`, eg `__myHiddenProp__` (which are hidden otherwise by default) @todo(363): filter user/custom `__hidden__` props in KeysT/Values types in typescript
   *
   * Note: `hidden` is a.k.a as `private` in the JS/TS world, but we use `hidden` to avoid confusion with the `private` keyword in TS and possible different semantics. Will revisit in future versions.
   *
   * @default: false
   */
  hidden?: boolean

  /**
   * Whether to include enumerable keys
   *
   * @default true
   */
  enumerables?: boolean

  /**
   * Whether to include enumerable keys
   *
   * @default false
   */
  nonEnumerables?: boolean

  /**
   * When you `loop()` over an `ArrayBuffer` (or request `keys()` or `values()`), you must provide the `dataViewType` option (eg `Int16`, `Float32` etc). The type of the items in the `ArrayBuffer` is required by the internal `DataView` that reads/writes to the ArrayBuffer.
   *
   * Throws if `dataViewType` is  missing and z.type(input) === 'ArrayBuffer'
   */
  dataViewType?: DataViewType
}

export interface IKeys_DefaultOptions {
  enumerables: true
  hidden: false
  inherited: false
  nonEnumerables: false
  own: true
  props: false
  strict: false
  string: true
  symbol: false
  top: false
  dataViewType: undefined
}

export const keys_DefaultOptions: IKeys_DefaultOptions = {
  strict: false,

  props: false,

  string: true,
  symbol: false,

  // actual Object props
  own: true,
  inherited: false,
  enumerables: true,
  nonEnumerables: false,
  top: false,
  hidden: false,
  dataViewType: undefined,
} as const

// export type Keys_DefaultOptions = typeof keys_DefaultOptions

/**
 * Only these types have **Inspectable Nested Keys** (separate from their props), that can be inspected at runtime (without affecting the input value).
 *
 * - `keys()` will return these keys/indexes and not their props (by default, unless `props: true`)
 * - These are also the keys/indexes (& corresponding values) that will be iterated in `loop()`.
 *
 * Iterators & Generators are a notable case, where:
 *  - `keys()` will bring their `props` and not their Nested Keys, cause their *Nested Keys** are not inspectable!
 *  - but `loop()` will iterate on their Nested Keys (not their props).
 *
 * Finally, `arguments` (of type IArguments) is treated as an Array, and its indexes of type `NumberString` are considered as NestedKeys.
 */
export type InspectableNested =
  | Map<any, any>
  | Set<any>
  | Array<any>
  | TypedArray
  | IArguments
  | ArrayBuffer

export const isInspectableNested = (input: any): input is InspectableNested =>
  _.isMap(input) ||
  _.isSet(input) ||
  isAnyArray(input) ||
  _.isTypedArray(input) ||
  isArguments(input) ||
  isArrayBuffer(input)

/**
 * A type helper that returns either or both:
 * - Nested Keys/Values (if we have an InspectableNested Tinput)
 * - Nested Keys/Values and/or PropsValues of Tinput (the latter if requested, or if we have a NOT InspectableNested input by default)
 * based on the `KeysOptions` passed.
 *
 * Follows exactly the `keys()` & `values()` functions & behaviors, within the limitations of JS/TS ;-)
 */
export type KeysOrValues<
  Tinput,
  Toptions extends IKeysOptions /* | undefined */ = IKeys_DefaultOptions,
  IsKeys = true,
  IsBasicProps = false,
> =
  // Note: the `Exclude<T, never>` is a trick to force TS to report actual keys, instead of z.SomeTypeHelper<...blah blah>. Doesn't work perfectly, but better than nothing!
  // Toptions extends undefined // note: IsAbsent here works!
  IsAbsent<Toptions> extends true
    ? KeysOrValues<Tinput, IKeys_DefaultOptions, IsKeys, IsBasicProps>
    : Toptions extends IKeysOptions
      ? IsAnyOrUnknown<Tinput> extends true
        ? // @todo: deal with options.strict
          Exclude<
            // # RETURN #1: BasicProps keys / unknown values, cause Tinput is unknown/any
            IsKeys extends true ? BasicProps<Toptions> : unknown,
            never
          >
        : Tinput extends object
          ? // add Nested Keys / Nested Values if Tinput is InspectableNested...
            | (Tinput extends InspectableNested
                  ? // ...and if props: false or 'all' OR if props is NOT true (default case is when KeysOptions type is passed, ie when props: boolean (but unsure if true or false)
                    Or<
                      IsPropFalse<'props', Toptions> extends true ? true : false,
                      Toptions extends { props: 'all' } ? true : false
                    > extends true
                    ? Exclude<
                        // # RETURN #2: Nested Keys or Nested Values of InspectableNested input type
                        IsKeys extends true ? InsideKeys<Tinput> : InsideValues<Tinput>,
                        never
                      >
                    : never
                  : never)
              // add Props / PropsValues, if props: true or 'all' OR if we're dealing with a NOT InspectableNested input (eg a regular object {foo: 1})
              | (Or<
                  Toptions extends { props: true | 'all' } & IKeysOptions ? true : false,
                  Tinput extends InspectableNested ? false : true
                > extends true
                  ? Exclude<
                      // # RETURN #3 - Props or PropsValues of Tinput, cause its either requested or it's NOT an InspectableNested
                      IsKeys extends true
                        ? // Props
                          IsBasicProps extends true
                          ? BasicProps<Toptions>
                          : Props<Tinput, Toptions>
                        : // PropsValues
                          Exclude<PropsValues<Tinput, Toptions>, never>,
                      never
                    >
                  : never)
          : never
      : 'Error: KeysOrValues: SOMETHING IS WRONG WITH OPTIONS'
/**
 * Like KeysOrValues (should have same structure), but with many twists. It returns:
 * - Props only (no values) as in `KeysOrValues` with IsKeys = false - props still depend on options
 * - No Nested keys / values, only props!
 * - Only the real props of Tinput allowed, no IsBasicProps = true
 * - No unknown values returned - it returns any in unknown situations ???
 *
 * Aim is to fit into Pick<> and other type utilities, where we need to get the **real keys of an object**, but not the Nested Items or it's parent's / prototype's props.
 */
export type KeysStrict<Tinput, Toptions extends IKeysOptions = IKeys_DefaultOptions> =
  // Note: the `Exclude<T, never>` is a trick to force TS to report actual keys, instead of z.SomeTypeHelper<...blah blah>. Doesn't work perfectly, but better than nothing!
  // Toptions extends undefined // note: IsAbsent here works!
  IsAbsent<Toptions> extends true
    ? KeysStrict<Tinput, IKeys_DefaultOptions>
    : IsAnyOrUnknown<Tinput> extends true
      ? // @todo: deal with options.strict
        // # RETURN #1: never, cause Tinput is unknown/any
        never
      : Tinput extends object
        ? // add Nested Keys / Nested Values if input is InspectableNested...
          | (Tinput extends InspectableNested
                ? // ...and if props: false or 'all' OR if props is NOT true (default case is when KeysOptions type is passed, ie when props: boolean (but unsure if true or false)
                  Or<
                    IsPropFalse<'props', Toptions> extends true ? true : false,
                    Toptions extends { props: 'all' } ? true : false
                  > extends true
                  ? // # RETURN #2: It would be Nested Keys or NestedV alues of InspectableNested input type, but we don't want those! Kept structure in par with Keys
                    never
                  : never
                : never)
            // add Props / PropsValues, if props: true or 'all' OR if we're dealing with a NOT InspectableNested input (eg a regular object {foo: 1})
            | (Or<
                Toptions extends { props: true | 'all' } & IKeysOptions ? true : false,
                Tinput extends InspectableNested ? false : true
              > extends true
                ? // # RETURN #3 - Props of the Tinput, cause its either requested or it's NOT an InspectableNested
                  PropsStrict<Tinput, Toptions>
                : never)
        : never

/**
 * Returns either or both a) the NestedKeys along with b) the Props of the Tinput, based on the `KeysOptions` passed.
 *
 * Follows closely the `keys()` function, within the limitations of JS/TS ;-)
 *
 * @see KeysOrValues which is the main type utility 'function' that does the work.
 *
 * @param Tinput the input value to get the keys or props of
 * @param Toptions the `IKeysOptions` to control the output of keys / props
 * @param IsBasicProps if true, returns only the basic props (i.e only `string | symbol`, depending on option's request) of the input value
 *
 * @returns the NestedKeys / Props of the Tinput, based on the `KeysOptions` passed (not as an Array, but a plain type).
 */
export type Keys<Tinput, Toptions extends IKeysOptions, IsBasicProps = false> = KeysOrValues<
  Tinput,
  Toptions,
  true,
  IsBasicProps
>

export function keys<Tinput, Toptions extends IKeysOptions>(
  input: Tinput,
  options?: Toptions
): Keys<Tinput, Toptions>[]

/**
 * `keys()` returns an array of: **a)** Nestedly occurring `keys` or `indexes` (eg `Set` keys, array indexes etc) or **b)** `props` of the input value (props on all objects), including symbols, own & inherited, enumerable & nonEnumerable! The returned props can be filtered by prop type (string or symbol), enumerability, own/inherited, top-level props etc.
 *
 * Unlike `Object.keys()`/`_.keys()`, it returns the **Nested Keys** of the "special objects" `Array`, `Map`, `Set` & `TypedArray` (by default).
 *
 * # Typings choice
 *
 * The [`keys()`](../functions/keys.html) & [`keysS()`](../functions/keysS.html) variants share the same implementation and same runtime results, but differ in the props types they return in TypeScript:
 * * [`keys()`](../functions/keys.html) is typed rigorously to return you the **exact types of props** of your input value, based on your options.
 * * [`keysS()`](../functions/keysS.html) returns **only `string` or `symbol` types of props** of your input value, based on your options (similar to `_.keys()` or `Object.keys()`).
 * [See discussion](https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript/76139008#76139008) and more below.
 *
 * # Examples
 *
 *    - returns a `realObject`'s prop/keys (`string` by default, `symbol` optionally)
 *
 *           z.keys({ a: 1, b: 2, c: 3 })           //=> ['a', 'b', 'c'] & type is ('a' | 'b' | 'c')[]
 *
 *    - returns an `Array`'s indexes (by default)
 *
 *           z.keys(['a', 'b', 'c'])                //=> [0, 1, 2 ] & type is number[]
 *
 *    - returns `Set` keys (by default)
 *
 *           z.keys(new Set(['a', 'b', 'c']))       //=> ['a', 'b', 'c'] & type is ('a' | 'b' | 'c')[]
 *
 *    - returns `Map` keys (by default)
 *
 *           z.keys(new Map([['a', 1], ['b', 2], ['c', 3]])) //=> ['a', 'b', 'c'] & type is ('a' | 'b' | 'c')[]
 *
 * If you use `props: true`, then all Object inputs are considered **only for their props** instead:
 *
 *      const myArray = [1, 2, 3]
 *
 *      myArray.stringProp = 'some Value'
 *      myArray[Symbol.for('symbolProp')] = 'some other Value'

 *      z.keys(myArray, { props: true }) // -> ['stringProp']
 *
 *      // Optionally symbol keys as well
 *      z.keys(myArray, { props: true, symbol: true}) // -> [ 'stringProp', Symbol(symbolProp) ]
 *
 * With `props: true`, you can also optionally include Object props such as:
 *  - `string` & `symbol` props. By default, only `string` props are included
 *  - `own` & `inherited` props. By default, only `own` props are included
 *  - `enumerables` & `nonEnumerables` props. By default, only enumerable props are included
 *  - `top`-level props like methods `toString` etc. By default, top level props are excluded
 *  - `hidden` top-level & hidden props, like `__proto__`, `__defineGetter__` etc
 *
 *  See more at [`KeysOptions`](../interfaces/keysOptions.html)
 *
 * Adapted from `getAllKeysConditionally` at https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object/70629468#70629468
 * input
 *
 * `Object.keys()` & `_.keys()` return `string[]` props for all objects (including special objects like `Map`, `Set`, `Array`, `TypedArray` etc, whose props are usually not interesting). This is how JS works, and TypeScript always follows.
 *
 * But in the typings realm, TypeScript is simply returns `string[]` for all objects, instead of returning the actual key literals that it knows about. This is how TypeScript is made, and the TS team is keen to not changing it (see this [issue of TS's father since 2016](https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208)).
 *
 * More Background:
 *  - [Why doesn't Object.keys return a keyof type in TypeScript?](https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript/76139008#76139008)
 *  - [`keyof typeof` & `Object.keys()` Iteration Example](https://refine.dev/blog/typescript-keyof/#typescript-keyof-typeof-pair-an-objectkeys-iteration-example)
 *  - [Object.keys() types refinement, and Object.entries() types bugfix](https://github.com/microsoft/TypeScript/pull/12253)
 *  - [Reflect.ownKeys should return the keys of the type that it was called upon](https://github.com/microsoft/TypeScript/issues/41036)
 *  - Auxiliary / maybe possible solutions:
 *    - [Removing "private" modifier from types](https://github.com/microsoft/TypeScript/issues/22677)
 *    - [Exact Types #12936](https://github.com/Microsoft/TypeScript/issues/12936)
 *    - [type-fest `InvariantOf`](https://github.com/sindresorhus/type-fest/blob/main/source/invariant-of.d.ts)
 *
 * # Zen `z.keys()` rationale & stance
 *
 * # Typings Rationale
 *
 * We return rigorously typed keys in `keys()`, based on the input value **while respecting all the options** passed and the eventual visibility, because it is useful in many cases and people are relying on extra boilerplate to achieve it.
 *
 * The TS team's retionale for not including it, is that you will end up receiving more (or less) keys than you expect, and that's a valid point. But we think that's a good thing, because it's a **feature** of JS, and we should be able to handle it gracefully, without throwing errors.
 *
 * The main mantra is: when we use `keys()`, **we should NOT care/throw about _extra keys_ you might receive, we just ignore them!**
 *
 * Assume we have a `function sendLetterToPerson(person: Person) {}`, we should only care about `Person`'s keys, `Person`'s functionality.
 *
 * - Our function should not care about other keys that may be present in the object, eg if the `person` is actually an `Employee` or `Customer` instance.
 *
 * - Our code **should not try** to get `Employee.salary` or `Customer.loyaltyProgram`, because it's not part of the `Person` interface. If our code deals only with `Person.name` & `Person.address` (which are enough **for the purpose of sending a letter**), and doesn't throw if extra props exists, everything will be fine!
 *
 * We could enforce exact types or invariants (eg via [type-fest's InvariantOf](https://github.com/sindresorhus/type-fest/blob/main/source/invariant-of.d.ts)), but it still misses the purpose (and it's kinda ugly). Because the point is that **we should be able to pass sub-instances to our functions**, and that's the OO & JS way and it's fine, but without sacrificing keys & values typings. If those functions act only on what they should know, we should be fine!
 *
 * So, the rule is: just don't bother with **extra keys** you might receive. Either ignore them OR handle them gracefully, without throwing! Especially if you're dealing with an `z.isInstance()` object (eg `Person`) (or a similar interface), you should NOT be able to access any other member, and that's how it works with all mainstream OO languages! When you're iterating over it for any reason (via `z.keys()` or `z.loop()`/`z.each()`), you can always `switch` only on the keys you know, and ignore the rest.
 *
 * ## Historical Reasons
 *
 * Part of the problem arises from JavaScript classes, who's instances are just plain objects, with an added constructor and a hidden `__proto__` for the inheritance chain.
 *
 * But Plain Objects in JS are also very commonly being used as **property bags** (i.e. the infamous `{prop: 'value'}` object), and since `Map` (that is the **right data structure** for this job) has arrived late to the party and with breaking functionality and support (lodash still doesn't `_.each` on Map/Set), most code still uses plain objects most of the time! But iterating over key/values & object classes & inheritance are fundamentally different things, but we use the same data structure for both, and that's one reason the problem is manifested.
 *
 * ## Typings are optional!
 *
 * If you still insist on being pure on TS's dictation, then you can use the plain `z.keysS()` function, which is exactly the same as `z.keys()` (same implementation), but returns `string[]` keys (or `(string | symbol)[]` etc upon option's request), instead of the rigorously typed `z.keys` (like `Object.keys()`).
 *
 * # Parameters
 *
 * @param input any input value that is an Object (eg Array, Map, Set, Function, Iterator, Generator, etc). `Primitive` values are allowed by default, but return an empty array of `never[]` (with `strict: false`, the default).
 *
 * @param options KeysOptions to control the output of keys / props, including:
 * - `own`: if `true` (default), include own props
 * - `string`: if `true` (default), include string props
 * - `enumerables`: if `true` (default), include enumerable props
 * And these are `false`/`undefined` by default:
 * - `props`: if `true`, only **props** are returned, instead **Nested Keys**. And `'all'` will bring all!
 * - `symbol`: if `true`, include symbol props
 * - `inherited`: if `true`, include inherited props
 * - `nonEnumerables`: if `true`, include non-enumerable props
 * - `top`: if `true` (along with `nonEnumerables`), it includes top-level props
 * - `hidden`: if `true` (along with `nonEnumerables` & `top`), it includes top-level hidden props.
 * - `strict`: if `true`, only `_.isObject` values are allowed, throws otherwise (i.e on `Primitives`)
 *
 * @return Array of keys or props of the input value, typed according to the input value & options.
 */
export function keys(input: unknown, options: IKeysOptions = {}): any[] {
  options = _.extend({}, keys_DefaultOptions, options)

  if (!_.isObject(input)) {
    if (options.strict)
      throw new TypeError(
        `z.keys: strict: true works only for types passing _.isObject, but value = ${toStringSafe(input)}`
      )

    if (isPrimitive(input)) return []
    else {
      const msg = `z.keys: internal error: value is not isPrimitive, but not an _.isObject either! You might need to check logs for value.`
      // console.error(msg, 'Value =', value)
      throw new TypeError(`${msg}Value = ${input}`)
    }
  }

  let keysOrProps: (ObjectPropTypes | number)[] = [] // return value: all keys/indexes/props stored here!

  // enumerate all props, only if needed
  let currentInputParent = input

  let { props, own, inherited, top, hidden, enumerables, nonEnumerables, string, symbol } =
    options

  // Boolean (mini-)functions to determine any given key's eligibility: @todo: make them pure functions, passing options, keys etc
  const includeBasedOnEnumerability = (obj: any, key: any) =>
    (enumerables && isEnumerable(obj, key)) || (nonEnumerables && !isEnumerable(obj, key))

  const includeBasedOnKeyType = (key: any) => {
    return (
      (symbol && _.isSymbol(key)) ||
      (string && _.isString(key)) ||
      ((isAnyArray(currentInputParent) || _.isArguments(currentInputParent)) &&
        isNumberString(key) &&
        Number(key) >= 0)
    )
  }
  const include = (obj: any, key: any) =>
    includeBasedOnEnumerability(obj, key) && includeBasedOnKeyType(key)

  const notYetRetrieved = (keys: any, key: any) => !keys.includes(key)

  // filter function putting all the above together:
  const filterFn = (key: any) =>
    notYetRetrieved(keysOrProps, key) && include(currentInputParent, key)

  // conditional chooses one of two functions to determine whether to exclude the top level or not:

  const stopFn = top
    ? (obj: any) => obj === null
    : (obj: any) => Object.getPrototypeOf(obj) === null && obj !== input

  // and now the loop to collect and filter everything:

  while (!stopFn(currentInputParent)) {
    if (own) {
      const ownKeys = Reflect.ownKeys(currentInputParent as object).filter(filterFn)
      keysOrProps = keysOrProps.concat(ownKeys)
    }
    // special case for root object being an Array or Arguments, where we also include the indexes (a.k.a TnaturalKeys), even if {own: false, props: 'all'}
    if (
      currentInputParent === input &&
      props === 'all' &&
      !own &&
      (isAnyArray(input) || _.isArguments(input))
    ) {
      const ownKeys = Reflect.ownKeys(currentInputParent as object).filter(filterFn)
      keysOrProps = keysOrProps.concat(
        ownKeys.filter((key) => isNumberString(key) && Number(key) >= 0)
      )
    }

    if (inherited) {
      own = true // get the "own", of any inherited object
      currentInputParent = Object.getPrototypeOf(currentInputParent)
    } else {
      break
    }
  }

  // filter hidden props, starting & ending with `__`, eg `__proto__` or `__myHiddenProp__`
  if (!hidden)
    keysOrProps = keysOrProps.filter((key) => !_.isString(key) || !/^__.*__$/.test(key))

  // In `keysOrProps` we now have all props/keys/indexes requested

  // Handle new String() with props
  if (isBoxedString(input)) {
    keysOrProps = _.reject(
      keysOrProps,
      (k) => isAnyNumber(k as any) && Number(k) <= input.toString().length
    )
  }

  if (isArrayBuffer(input)) {
    let result: any[] = []
    if (!options.props || options.props === 'all') {
      // prettier-ignore
      if (!options.dataViewType) throw new Error(`z.keys(): options.dataViewType is required to loop over an ArrayBuffer to calculate its nested keys()`)

      const arrayBufferCursor = new ArrayBufferCursor(input, options.dataViewType)
      result = _.times(arrayBufferCursor.size())
    }

    // add existing props to result if needed
    if (options.props) for (const key of keysOrProps) result.push(key)

    return result
  }

  // Handle numeric Array & arguments indexes, masquerading as strings & convert back to numbers (if isAnArray)
  if (isAnyArray(input) || _.isArguments(input)) {
    const isAnArray = isAnyArray(input)
    const realProps: ObjectPropTypes[] = []
    const realIndexes: (number | string)[] = []

    for (const aKey of keysOrProps) {
      if (isNumberString(aKey)) {
        const num = Number(aKey)
        if (num >= 0 && num < input.length) {
          if (options.props !== true) realIndexes.push(isAnArray ? num : `${num}`)
          continue
        }
      }

      if (options.props && !_.isNumber(aKey)) realProps.push(aKey)
    }

    keysOrProps = [...realProps, ...realIndexes]
  }

  if (options.props === true) return keysOrProps // props === true means we care about props **only**

  if (_.isSet(input) || _.isMap(input)) {
    // note: set key are set value itself
    let setOrMapKeys: any[] = []
    for (const setKey of input.keys()) setOrMapKeys.push(setKey)

    if (options.props) {
      setOrMapKeys = keysOrProps.concat(setOrMapKeys)
    }
    keysOrProps = setOrMapKeys
  }

  return keysOrProps
}

export type KeysS<Tinput, Toptions extends IKeysOptions> = KeysOrValues<
  Tinput,
  Toptions,
  true,
  true
>

/**
 * A Simplified typings version of `keys()` that returns only `string` or `symbol` props types of the input value, based on the options.
 *
 * Note: implementation / runtime is the same as `keys()`, only the returned typings change to the simplified version!
 *
 * @param input any input value that is an Object (eg Array, Map, Set, Function, Iterator, Generator, etc). `Primitive` values are allowed by default (with `strict: false`) and return an empty array (of type `never[]`).
 *
 * @param options the [`KeysOptions`](../interfaces/keysOptions.html) to control the output of keys / props

 * @return Array of keys or props of the input value, typed according to the input value & options, but limited to `string` or `symbol` only. Use [`keys()`](../functions/keys.html) for the full props types.
 */
export function keysS<Tinput, Toptions extends IKeysOptions>(
  input: Tinput,
  options?: Toptions
): KeysS<Tinput, Toptions>[] {
  return keys(input, options) as any
}
