import { IfAnd, IfExtends, IsPropFalse, IsPropTrue, Unliteral } from '../typezen/type-utils'
import { isStop, Stop, StopClass } from '../typezen/utils'
import { ILoopOptions, isAsyncLoopGenerator, loop, LoopGenerator, LoopKeys } from './loop'
import { MapOptionsOverride, ProjectValues } from './map'

export type ReduceCallback<Taccumulator, Titem, TidxKey, Tinput> = (
  accumulator: Taccumulator,
  item: Titem,
  idxOrKey: TidxKey,
  input: Tinput,
  count: number
) => Taccumulator | Stop | Promise<Taccumulator | Stop>

export function reduce<
  Tinput extends any,
  IreduceCallback extends ReduceCallback<Taccumulator, TcallbackItems, TcallbackKeys, Tinput>,
  Toptions extends ILoopOptions<any, any, any>, // @todo(222): replace any with Titem etc ?
  Taccumulator extends any,
  TcallbackItems = ProjectValues<Tinput, MapOptionsOverride<Toptions>>,
  TcallbackKeys = LoopKeys<Tinput, MapOptionsOverride<Toptions>>,
>(
  input: Tinput,
  reduceCb: IreduceCallback,
  accumulator: Taccumulator,
  options?: Toptions
): IfAnd<
  IfExtends<Tinput, AsyncGenerator<any>>,
  IsPropFalse<'props', Toptions>, // if props: true/'all', then we have normal LoopGenerator, not Async!
  Promise<Unliteral<Taccumulator>>,
  Unliteral<Taccumulator>
> {
  const loopResult = loop(input, options) // might be a LoopGenerator OR AsyncLoopGenerator

  if (isAsyncLoopGenerator(loopResult)) {
    const accumulatorPromiseCreator = async function () {
      for await (const [item, idxKey, count] of loopResult) {
        // console.log({ accumulator, item, idxKey })

        const reduceCbResult = await reduceCb(accumulator as any, item, idxKey, input, count)

        if (isStop(reduceCbResult)) {
          if (reduceCbResult instanceof StopClass) accumulator = reduceCbResult.returnValue
          // otherwise keep current (previous) accumulator
          break
        } else accumulator = reduceCbResult
      }

      return accumulator
    }

    return accumulatorPromiseCreator() as any
  } else {
    for (const [item, idxKey, count] of loopResult as LoopGenerator) {
      // console.log({ accumulator, item, idxKey })
      const reduceCbResult = reduceCb(accumulator as any, item, idxKey, input, count)

      if (isStop(reduceCbResult)) {
        if (reduceCbResult instanceof StopClass) accumulator = reduceCbResult.returnValue
        // otherwise keep current (previous) accumulator
        break
      } else accumulator = reduceCbResult as any // cause reduceCbResult can be a Promise<...>, but not in this case
    }

    return accumulator as any
  }
}
