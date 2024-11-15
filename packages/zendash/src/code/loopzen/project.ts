import * as _ from 'lodash'
import { isSystemClass, isUserClass } from '../typezen/classes'
import { isAnyJustIterator } from '../typezen/isAnyJustIterator'
import { isAsyncGenerator } from '../typezen/isAsyncGenerator'
import { isAsyncIterator } from '../typezen/isAsyncIterator'
import { isBoxedNumber } from '../typezen/isBoxedNumber'
import { isBoxedPrimitive } from '../typezen/isBoxedPrimitive'
import { isFunction } from '../typezen/isFunction'
import { isGenerator } from '../typezen/isGenerator'
import { isMapIterator } from '../typezen/isMapIterator'
import { isPlainIterator } from '../typezen/isPlainIterator'
import { isPrimitive } from '../typezen/isPrimitive'
import { isSetIterator } from '../typezen/isSetIterator'
import { isSingleOrWeak } from '../typezen/isSingle'
import { type } from '../typezen/type'
import { isStop, NOTHING } from '../typezen/utils'
import { filterTrue, toStringSafe } from '../utils'
import { ArrayBufferCursor } from './ArrayBufferCursor'
// import { LogZenMini } from '../LogZenMini'

import {
  FilterCallback,
  ILoopOptions,
  loop,
  loopCallbackNames,
  loop_DefaultOptions,
  LOOP_SYMBOL,
  MapCallback,
  MapKeysCallback,
  TakeCallback,
} from './loop'
import { takeToFunction } from './take'

// const l = new LogZenMini('project()', LogZenMini.LEVELS.warn)

const NO_RESULT = Symbol('_z.NO_RESULT')

const isSingleFalseOrStop = (value) => value === false || isStop(value)

/**
 * The implementation function of projection functions, like `map()`, `filter()`, `take()` and others.
 *
 * As it is meant to be used internally mainly by these other user-land functions (map, filter, clone), the documentation is mainly inherent there.
 *
 * Main points:
 *
 * - Returns a new value, of the same type as input value, depending on the options.
 *
 - All projection function callbacks (eg `map` & `filter`) are passed solely in options, and are optional. They affect the result by map/filtering of all nested elements.
 *
 * - It's handling all the complexity, and all edge cases of types and returns in one place.
 *
 * - In all cases:
 *  - `filter` is called first, on the original element.
 *  - `map` is called secondly on top of the filtered element, if it has passed the filter.
 *  - `take` ends the iteration early,
 *    - if the elements limit is reached (`take` is number)
 *    - or `take` is a function and returns `false` or `_z.STOP`.
 *
 * - Effectively `map(val, (v) => v + 1)` is the same as `project(value, options, mapCb, 'map')` and same for `filter`, `take` etc.
 *
 * @todo: improve docs
 *
 * @param input
 * @param options
 * @param callback
 * @param functionName
 */
export function project<
  Titem,
  TidxKey,
  Tinput,
  TmapItemReturn = Titem,
  TmapKeyReturn = TidxKey,
>(
  input: Tinput,
  options: ILoopOptions<Titem, TidxKey, Tinput, TmapItemReturn, TmapKeyReturn>,
  callback:
    | MapCallback<Titem, TidxKey, Tinput, TmapItemReturn>
    | MapKeysCallback<Titem, TidxKey, Tinput, TmapKeyReturn>
    | FilterCallback<Titem, TidxKey, Tinput>
    | TakeCallback<Titem, TidxKey, Tinput>,
  functionName?: 'map' | 'mapKeys' | 'filter' | 'take' // ?????   | 'some' | 'every' | 'find' | 'findIndex' | 'reduce' ???
): Tinput /* @todo: Tinput is misleading - remove */ {
  if (isUserClass(input))
    throw new Error(
      `_z.${functionName}(): User classes are not supported - Cannot clone/map a class!`
    )

  options = _.extend({}, _.omit(loop_DefaultOptions, loopCallbackNames), options)

  //  helper - single values filter & take: if negative, we reject the value
  const singlesFilterTake = <T extends any>(item: T, idx, value): item is T =>
    !(
      isSingleFalseOrStop(
        filterCb(
          // @ts-expect-error: @todo(111): fix TS2345: Argument of type T is not assignable to parameter of type Titem: T is assignable to the constraint of type Titem, but Titem could be instantiated with a different subtype of constraint Tany
          item,
          idx,
          value,
          1
        )
      ) || isSingleFalseOrStop(take(item, idx, value, 1))
    )
  // get the options

  if (functionName) {
    if (options[functionName])
      throw new Error(
        `_z.${functionName}(): options.${functionName} can NOT be used here - use ${functionName}Cb only`
      )

    if (callback) options[functionName as any] = callback // @todo: refactor to remove any
  }

  const mapCb: MapCallback<Titem, TidxKey, Tinput, TmapItemReturn> = options.map || _.identity

  const mapKeysCb: MapKeysCallback<Titem, TidxKey, Tinput, TmapKeyReturn> =
    options.mapKeys || ((val: any, key: any) => key)
  const filterCb: FilterCallback<Titem, TidxKey, Tinput> = options.filter || filterTrue

  if (
    (filterCb !== filterTrue || _.isNumber(options.take) || _.isFunction(options.take)) &&
    isSingleOrWeak(input) &&
    !options.filterSingles
  ) {
    throw new Error(
      `_z.project() as _z.${functionName}(): Can't filter or take with filterSingles: false over an _z.isSingleOrWeak value ${toStringSafe(input)}`
    )
  }

  const take: any /* @todo: TtakeCallback | number*/ = takeToFunction(options.take)

  if (_.isWeakMap(input) || _.isWeakSet(input))
    throw new Error(`_z.${functionName}(): WeakMap & WeakSet are not supported!`)

  // Get a LoopGenerator for the items/elements only, with filter & map applied

  let result: any = NO_RESULT
  let propsHandled = false

  // itemsIterator has only array elements, and already filtered & mapped
  const itemsOnlyLoopGenerator =
    options.props === true
      ? loop([]) // if props: true (i.e only), we give an empty iterator for items/elements & natural keys/indexes part
      : loop(input as any, {
          ...options,
          inherited: false,
          nonEnumerables: false,
          props: false, // NOTE: no props for this first step
          filter: filterCb as any,
          map: mapCb as any,
          mapKeys: mapKeysCb as any,
          take,
        })

  //  iterators / generators (except MapIterator & SetIterator), sync & async covered by loopGenerator itself!
  if (
    isGenerator(input) ||
    (isPlainIterator(input) && !isMapIterator(input) && !isSetIterator(input))
  ) {
    // result becomes a Generator (why not a LoopGenerator?), that goes over the values emitted by original iterator, wrapped inside the LoopGenerator
    // filters and map is already applied by loop() itself
    result = (function* () {
      for (const [item] of itemsOnlyLoopGenerator) yield item
    })()
  } else if (isAsyncGenerator(input) || isAsyncIterator(input)) {
    // result becomes an AsyncGenerator (why not an AsyncLoopGenerator?), that goes over the values emitted by original async iterator, wrapped inside the AsyncLoopGenerator
    // filters and map is already applied by loop() itself
    result = (async function* () {
      for await (const [item] of itemsOnlyLoopGenerator) yield item
    })()
  }

  if (isBoxedPrimitive(input)) {
    const unboxedValue = input.valueOf()

    if (singlesFilterTake(unboxedValue as Titem, null, input))
      result = new (input as any).constructor(
        mapCb(unboxedValue as Titem, null as any, input, 1)
      )
    // filter rejected
    else {
      if (isBoxedNumber(input)) result = options.singlesReject || new Number(NaN)
      else result = options.singlesReject || new (input as any).constructor()
    }
  }

  if (isPrimitive(input)) {
    if (singlesFilterTake(input as Titem, null, input))
      result = mapCb(input as Titem, null as any, input, 1)
    else {
      // filter rejected

      switch (type(input)) {
        case 'number':
          result = options.singlesReject || NaN
          break
        case 'bigint':
          result = options.singlesReject || Number.NaN
          break
        case 'symbol':
          result = options.singlesReject || NOTHING

          break

        case 'string': {
          result = options.singlesReject || ''
          break
        }

        case 'boolean':
        case 'null':
        case 'undefined':
          result = options.singlesReject
          break

        default: {
          throw new Error(
            `_z.${functionName}(): INTERNAL ERROR: Unsupported primitive type: ${type(input)}`
          )
        }
      }
    }
  }

  // l.debug({ result, itemsOnlyLoopGenerator, type: type(input) })

  if (result === NO_RESULT && isGenerator(itemsOnlyLoopGenerator)) {
    // l.debug(
    //   'result === NO_RESULT && isGenerator(itemsOnlyLoopGenerator) type(input)',
    //   type(input),
    //   input
    // )
    switch (type(input)) {
      case 'Array': {
        result = []
        for (const [item, idx] of itemsOnlyLoopGenerator)
          if (options.sparse) result[idx as any] = item
          else result.push(item)

        break
      }

      case 'TypedArray': {
        result = new (input as any).constructor(
          _.map([...itemsOnlyLoopGenerator], ([item, idx, count]) =>
            mapCb(item as any, idx, input, count)
          )
        )
        break
      }

      case 'ArrayBuffer': {
        result = new ArrayBuffer((input as ArrayBuffer).byteLength)

        const resultArrayBufferCursor = new ArrayBufferCursor(result, options.dataViewType)

        for (const [item] of itemsOnlyLoopGenerator)
          resultArrayBufferCursor.writeNext(item as number)

        break
      }

      // POJSO case, that is not an iterator / generator
      case 'realObject': {
        result = {}
        for (const [item, idx] of itemsOnlyLoopGenerator) result[idx as any] = item
        propsHandled = true // Special case: an POJSO's items are also its props, it has nothing else
        break
      }

      case 'Map': {
        result = new Map(_.map([...itemsOnlyLoopGenerator], ([item, key]) => [key, item]))
        break
      }

      case 'Set': {
        result = new Set(_.map([...itemsOnlyLoopGenerator], ([item]) => item))
        break
      }

      case 'MapIterator': {
        const mapIteratorKeyItems: [any, any][] = _.map(
          [...itemsOnlyLoopGenerator],
          ([item, key]) => [key, item]
        )
        // It's not a Map.entries but a .values/.keys, **IF it has 2 consecutive nulls as keys**
        // So add a Symbol() dummy in place of keys, to ensure a unique key, so value is entered in Map (needed to retrieve map.values())! If only one value, we don't care, it works without this hack
        if (
          (!mapIteratorKeyItems[0] || mapIteratorKeyItems[0][0] === null) &&
          (!mapIteratorKeyItems[1] || mapIteratorKeyItems[1][0] === null)
        )
          _.each(mapIteratorKeyItems, (itemAndkey) => (itemAndkey[0] = Symbol()))

        result = itemsOnlyLoopGenerator[LOOP_SYMBOL].isSetOrMapValuesOrKeys
          ? new Map(mapIteratorKeyItems).values()
          : new Map(mapIteratorKeyItems).entries()
        break
      }

      case 'SetIterator': {
        const theSet = new Set(_.map([...itemsOnlyLoopGenerator], (item) => item[0]))

        result = itemsOnlyLoopGenerator[LOOP_SYMBOL].isSetOrMapValuesOrKeys
          ? theSet.values()
          : theSet.entries()
        break
      }

      // Special case for projections - return/resolved value is mapped/filter/taken etc

      case 'function': {
        result = function mappedFunction(...args) {
          const fnReturn = (input as Function).call(this, ...args)
          if (singlesFilterTake(fnReturn, null, input))
            return mapCb(fnReturn, null as any, input, 1)
          else return options.singlesReject
        }

        break
      }

      case 'Promise': {
        result = new Promise(async (resolve, reject) => {
          try {
            const awaitedValue = await input
            if (singlesFilterTake(awaitedValue, null, awaitedValue))
              resolve(mapCb(awaitedValue as Awaited<any>, null as any, awaitedValue, 1))
            else resolve(options.singlesReject)
          } catch (error) {
            reject(error)
          }
        })

        break
      }

      case 'arguments': {
        const args: any[] = []
        for (const [item, idx] of itemsOnlyLoopGenerator) args.push(item) // no need to singlesFilterTake here, iterator already does that

        result = (function (...theArgs) {
          return arguments
        })(...args)

        break
      }

      // # Singles

      case 'RegExp':
      case 'Date': {
        if (singlesFilterTake(input, null, input))
          result = new (input as any).constructor(mapCb(input as any, null as any, input, 1))
        else result = options.singlesReject || new (input as any).constructor(null)

        break
      }

      case 'Error': {
        if (singlesFilterTake(input as Error, null, input))
          result = new (input as any).constructor(
            mapCb((input as Error).message as Titem, null as any, input, 1)
          )
        else result = options.singlesReject || new (input as any).constructor()

        break
      }

      case 'NaN': {
        if (singlesFilterTake(input, null, input)) result = NaN
        else result = options.singlesReject

        break
      }

      case 'DataView': {
        if (singlesFilterTake(input, null, input))
          result = new DataView((input as DataView).buffer)
        else result = options.singlesReject

        break
      }

      // default: {
      //   expectType<never>(value)
      //   return expectNever(value)
      // }
    }
  }
  // Copy any props onto the new object, but only own & enumerables
  if (
    (!propsHandled || options.props === true) &&
    result !== NO_RESULT &&
    _.isObject(input) &&
    options.props
  ) {
    // @todo: remove this, not needed probably
    if (options.strict && options.symbol && isAnyJustIterator(input))
      throw new TypeError(
        `_z.${functionName}(): Cannot ${functionName} over an Iterator or an AsyncIterator with symbol: true & strict: true`
      )

    const propsOnlyIterator = loop(input, {
      ...options,
      props: true,
      nonEnumerables: false,
      inherited: false,
      filter: filterCb as any,
      map: mapCb as any,
      mapKeys: mapKeysCb as any,
      take,
    })

    for (const [item, idx] of propsOnlyIterator as any) // @todo(555): fix any
      if (
        !(
          ((idx === 'next' && isFunction(item)) ||
            idx === Symbol.iterator ||
            idx === Symbol.asyncIterator) &&
          isAnyJustIterator(input)
        )
      ) {
        // l.debug('Setting prop & value on result:', {prop: idx, item})
        result[idx] = item
      }
  }

  if (result === NO_RESULT)
    throw new Error(`_z.${functionName}(): Unsupported value type: ${type(input)}`)
  else return result
}
