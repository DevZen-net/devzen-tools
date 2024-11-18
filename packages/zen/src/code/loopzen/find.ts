import { IfNever } from 'type-fest'
import { isPromise } from '../typezen/isPromise'
import { IfAnd, IfExtends, IsPropFalse } from '../typezen/type-utils'
import { isStop, NOTHING, STOP, StopClass, T_NOTHING } from '../typezen/utils'
import {
  FilterCallback,
  ILoopOptions,
  isAsyncLoopGenerator,
  loop,
  LoopGenerator,
  LoopKeys,
} from './loop'
import { MapOptionsOverride, ProjectValues } from './map'
import { reduce } from './reduce'

/**
 * Find and return an item, as soon as `findCb` returns `true` (not truthy).
 * - When input is AsyncGenerator, it returns a Promise resolving to the item. In this cases only, the `findCb` callback can also be async / return promise (which will be awaited).
 * - You can return STOP or STOP(someValue) to also stop the iteration
 *
 * @param input
 * @param findCb
 * @param options
 */
export function find<
  Tinput extends any,
  IfilterCallback extends FilterCallback<TcallbackItems, TcallbackKeys, Tinput>,
  Toptions extends ILoopOptions<any, any, any>, // @todo(222): replace any with Titem etc ?
  TcallbackItems = ProjectValues<Tinput, MapOptionsOverride<Toptions>>,
  TcallbackKeys = LoopKeys<Tinput, MapOptionsOverride<Toptions>>,
>(
  input: Tinput,
  findCb: IfilterCallback,
  options?: Toptions,
  returnIdxKey?: true // note: leave undocumented, its internal (to return idxKey instead of item for findKey)
): IfAnd<
  IfExtends<Tinput, AsyncGenerator<any>>,
  IsPropFalse<'props', Toptions>, // if props: true/'all', then we have normal LoopGenerator, not Async!
  Promise<IfNever<TcallbackItems, typeof NOTHING, TcallbackItems | typeof NOTHING>>,
  IfNever<TcallbackItems, typeof NOTHING, TcallbackItems | typeof NOTHING>
  // @todo(222): these above cause a problem in TS5.6, when TcallbackItems is never, it returns symbol instead of typeof NOTHING
> {
  const loopResult = loop(input, options) // might be a LoopGenerator OR AsyncLoopGenerator

  if (isAsyncLoopGenerator(loopResult)) {
    const accumulatorPromiseCreator = async function () {
      for await (const [item, idxKey, count] of loopResult) {
        // l.debug('find async calling findCb:', {item, idxKey, count})
        const findCbResult = await findCb(item, idxKey, input, count)

        if (findCbResult === true) return returnIdxKey ? idxKey : item
        if (isStop(findCbResult))
          return findCbResult instanceof StopClass ? findCbResult.returnValue : (returnIdxKey ? idxKey : item)
      }

      return NOTHING
    }

    // @ts-expect-error @todo(222): why as any?
    return accumulatorPromiseCreator() // as any
  } else {
    for (const [item, idxKey, count] of loopResult as LoopGenerator) {
      // l.debug('find calling findCb:', {item, idxKey, count})
      const findCbResult = findCb(item, idxKey, input, count)

      if (findCbResult === true) return (returnIdxKey ? idxKey : item)
      if (isStop(findCbResult))
        return findCbResult instanceof StopClass ? findCbResult.returnValue : (returnIdxKey ? idxKey : item)
    }

    // @ts-expect-error @todo(222): why as any?
    return NOTHING // as any
  }
}

/**
 * Alternative implementation, based on reduce, works exactly the same
 * @param input
 * @param findCb
 * @param options
 */
function find_reduce<
  Tinput extends any,
  IfilterCallback extends FilterCallback<
    ProjectValues<Tinput, MapOptionsOverride<Toptions>>,
    LoopKeys<Tinput, MapOptionsOverride<Toptions>>,
    Tinput
  >,
  Toptions extends ILoopOptions<any, any, any>, // @todo(222): replace any with Titem etc ?
  TcallbackItems = ProjectValues<Tinput, MapOptionsOverride<Toptions>>,
  // TcallbackKeys = LoopKeys<Tinput, MapOptionsOverride<Toptions>>,
>(
  input: Tinput,
  findCb: IfilterCallback,
  options?: Toptions
): IfAnd<
  IfExtends<Tinput, AsyncGenerator<any>>,
  IsPropFalse<'props', Toptions>, // if props: true/'all', then we have normal LoopGenerator, not Async!
  Promise<IfNever<TcallbackItems, typeof NOTHING, TcallbackItems | typeof NOTHING>>,
  IfNever<TcallbackItems, typeof NOTHING, TcallbackItems | typeof NOTHING>
  // @todo(222): these above cause a problem in TS5.6, when TcallbackItems is never, it returns symbol instead of typeof NOTHING
> {
  const reduceResult = reduce(
    input,
    (acc, item, idxKey, input, count) => {
      const findCbResult = findCb(item, idxKey, input, count)
      if (isPromise(findCbResult)) return new Promise(async (resolve) => {
        const actualFindCbResult = await findCbResult

        if (actualFindCbResult === true) return resolve(STOP(item))
        if (isStop(actualFindCbResult))
          return resolve(actualFindCbResult instanceof StopClass ? actualFindCbResult : STOP(item))

        resolve(acc)
      })
      else {
        if (findCbResult === true) return STOP(item)
        if (isStop(findCbResult))
          return findCbResult instanceof StopClass ? findCbResult : STOP(item)

        return acc
      }
    },
    NOTHING,
    options
  ) // might be a LoopGenerator OR AsyncLoopGenerator

  return reduceResult as any
}
