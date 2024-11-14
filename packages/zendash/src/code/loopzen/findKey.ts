import { IfNever } from 'type-fest'
import { IfAnd, IfExtends, IsPropFalse } from '../typezen/type-utils'
import { NOTHING } from '../typezen/utils'
import { find } from './find'
import {
  FilterCallback,
  ILoopOptions,
  LoopKeys,
} from './loop'
import { MapOptionsOverride, ProjectValues } from './map'

/**
 * Find and return an item, as soon as `findCb` returns `true` (not truthy).
 * - When input is AsyncGenerator, it returns a Promise resolving to the item. In this cases only, the `findCb` callback can also be async / return promise (which will be awaited).
 * - You can return STOP or STOP(someValue) to also stop the iteration
 *
 * @param input
 * @param findCb
 * @param options
 */
export function findKey<
  Tinput extends any,
  IfilterCallback extends FilterCallback<TcallbackItems, TcallbackKeys, Tinput>,
  Toptions extends ILoopOptions<any, any, any>, // @todo(222): replace any with Titem etc ?
  TcallbackItems = ProjectValues<Tinput, MapOptionsOverride<Toptions>>,
  TcallbackKeys = LoopKeys<Tinput, MapOptionsOverride<Toptions>>,
>(
  input: Tinput,
  findCb: IfilterCallback,
  options?: Toptions
): IfAnd<
  IfExtends<Tinput, AsyncGenerator<any>>,
  IsPropFalse<'props', Toptions>, // if props: true/'all', then we have normal LoopGenerator, not Async!
  Promise<IfNever<TcallbackKeys, typeof NOTHING, TcallbackKeys | typeof NOTHING>>,
  IfNever<TcallbackKeys, typeof NOTHING, TcallbackKeys | typeof NOTHING>
  // @todo(222): these above cause a problem in TS5.6, when TcallbackItems is never, it returns symbol instead of typeof NOTHING
> {
  return find(
    input,
    findCb as any,
    options,
    true
  )
}

