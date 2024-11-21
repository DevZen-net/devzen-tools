import { isNumber } from '../typezen/isNumber'
import { type } from '../typezen/type'
import { ILoopOptions, LoopKeys, TakeCallback } from './loop'
import { GetMapReturn, MapOptionsOverride, ProjectValues } from './map'
import { project } from './project'

/**
 * Takes `n` elements from the beginning of the value (`Array`, `Object`, `Set`, `Map` etc). If `n` is a function, it stops as soon as it returns `false` or `z.STOP`.
 *
 * If `options.props` & value is an `_.isObject()` other than `realObject`, it will retrieve (i.e `clone`) both:
 * * the first `n` keys/idx of the value (eg the Array elements, Set items etc)
 * * the first `n` of props
 *
 * Note: No guaranteed order for property bags like `Objects`, `Sets`, `Maps` etc and return the same value type of input value.
 *
 * @see [`z.filter`](../functions/filter.html) for filtering elements - the `filterSingles` option also applies here: if `take` is used with `isSingle` values, `filterSingles` must be `true` or it will throw an error.
 *
 * @param input any value to take elements from. Usually an `Array`, `Object`, `Map`, `Iterator` etc. but you can also pass single values, like a `number`, `string` etc - see `loopSingles` option.
 *
 * @param n the number of elements to take. If a `function`, it will be called with `(item, keyIdx, value, count)`. If it returns `true` it will take items, as soon as it returns `false` or `z.STOP` it stops taking items.
 *
 * @param options you can optionally pass an [`IloopOptions`](../interfaces/IloopOptions.html) object to control which keys / idx are visited (own / inherited / enumerable etc) and more.
 */
export function take<
  Tinput extends any,
  ItakeCallback extends TakeCallback<TcallbackItems, TcallbackKeys, Tinput>,
  Toptions extends Omit<
    ILoopOptions<Titem, TidxKey, Tinput, TmapItemReturn, TmapKeyReturn>,
    'take'
  >,
  Titem,
  TidxKey,
  TmapItemReturn,
  TmapKeyReturn, // all these are not needed, leave for completion / yagni
  TcallbackItems = ProjectValues<Tinput, MapOptionsOverride<Toptions>>,
  TcallbackKeys = LoopKeys<Tinput, MapOptionsOverride<Toptions>>,
>(
  input: Tinput,
  n: number | ItakeCallback,
  options?: Toptions
): GetMapReturn<Tinput, Toptions, null, null> {
  return project<Titem, TidxKey, Tinput, TmapItemReturn, TmapKeyReturn>(
    input,
    options as any,
    takeToFunction(n) as any,
    'take'
  ) as any
}

export function takeToFunction<Titem, TidxKey, Tinput>(
  take?: number | TakeCallback<Titem, TidxKey, Tinput>
): TakeCallback<Titem, TidxKey, Tinput> {
  if (isNumber(take)) {
    const originalTake = take
    take = (_1, _2, _3, count: number) => {
      // console.log(`takeToFunction: ${originalTake} >= ${count}`, _1, _2)
      return originalTake >= count
    }

    // take['originalTake'] = originalTake
  } else if (take === undefined) {
    take = () => true
  } else if (typeof take !== 'function') {
    const errorMsg = `z.loop(): options.take must be a number or a function, but got type = "${type(take)}" value = ${take}`
    // console.error(errorMsg, theValue)
    throw new Error(errorMsg)
  }

  return take
}
