import { isAsyncGenerator } from '../typezen/isAsyncGenerator'
import { isFunction } from '../typezen/isFunction'
import {
  AsyncIteratorOrGenerator,
  IfAnd,
  IfExtends,
  IfOr,
  IfUndefined,
  IsAbsent,
  IsAnyOrUnknown,
  IsAnyOrUnknownOrUndefined,
  IsPropFalse,
  IsPropTrue,
  IsUndefined,
  Not,
} from '../typezen/type-utils'
import { isStop, Stop } from '../typezen/utils'

import {
  filter_DefaultOptions,
  ILoop_DefaultOptions,
  ILoopOptions,
  loop,
  loop_DefaultOptions,
  LoopKeys,
  LoopValues,
  TypeErrorMessageUnsupportedOptions,
} from './loop'
import * as _ from 'lodash'
import { keys_DefaultOptions } from './keys'
import { AsyncFunction, isAsyncFunction } from '../typezen/isAsyncFunction'
import { And, IsUnknown, Or } from 'type-fest'

export type EachIteratee<Titem, TidxKey, Tinput> = (
  item: Titem,
  idxOrkey: TidxKey,
  value: Tinput,
  count: number
) => false | Stop | any

export type EachAsyncIteratee<Titem, TidxKey, Tinput> = (
  item: Titem,
  idxOrkey: TidxKey,
  value: Tinput,
  count: number
) => Promise<false | any>

type GetEachReturn<
  Tinput,
  IeachIteratee extends EachIteratee<any, any, any>,
  Toptions extends ILoopOptions | undefined,
> =
  // IsUndefined<Toptions> extends true // @todo(111): WHY NOT WORKING, when `Toptions extends undefined` below does?
  // IsAnyOrUnknownOrUndefined<Toptions> extends true // @todo(111): same as above
  Toptions extends undefined
    ? GetEachReturn<Tinput, IeachIteratee, ILoop_DefaultOptions>
    : IsAbsent<Toptions> extends true // @todo(111): NOT WORKING with unknown etc, cause we have to force when we call it with unknown, and its not listed in permitted types of Toptions
      ? GetEachReturn<Tinput, IeachIteratee, ILoop_DefaultOptions>
      : Toptions extends object
        ? IfOr<
            Or<
              And<
                IfExtends<IeachIteratee, AsyncFunction>,
                Not<IsPropFalse<'async', Toptions, true>>
              >,
              And<
                Tinput extends AsyncIteratorOrGenerator<any> ? true : false,
                Not<IsPropTrue<'props', Toptions>>
              >
            >,
            Or<IsPropTrue<'async', Toptions>, IfExtends<Toptions['async'], number>>,
            Promise<Tinput>,
            Tinput
          >
        : `Error: GetEachReturn: ${TypeErrorMessageUnsupportedOptions}`

export function each<
  Tinput,
  Toptions extends ILoopOptions<Titem, TidxKey, Tinput> | undefined,
  Titem extends LoopValues<Tinput, Toptions> = LoopValues<Tinput, Toptions>,
  TidxKey extends LoopKeys<Tinput, Toptions> = LoopKeys<Tinput, Toptions>,
  TeachIteratee extends EachIteratee<Titem, TidxKey, Tinput> = EachIteratee<
    Titem,
    TidxKey,
    Tinput
  >,
>(
  input: Tinput,
  iteratee: TeachIteratee,
  options?: Toptions
): GetEachReturn<Tinput, TeachIteratee, Toptions>
/*
Note: 2 issues with current Icallback in each() signature:

@todo(333): is not passing the correct types to EachCallback, when Toptions.map() etc are used.
In loop() this was solved with TloopCallbacks, but it would be an overkill here (not attempted)!

The following code is a naive attempt, but it's not working as expected:

    TmapItemReturn extends any = Toptions['map'] extends (...args: any) => infer Return ? Return : Titem,
    TmapKeyReturn extends any = Toptions['mapKeys'] extends (...args: any) => infer Return ? Return : TidxKey,
    Icallback = EachCallback<TmapItemReturn, TmapKeyReturn, Tinput>,

Issues:
   - TmapItemReturn & TmapKeyReturn are set to either their original value or, worse, become unknown:
      - `infer Return` not revealing its type, `Titem` is always returned - see each-typing-spec.ts
      - some all-typings tests THAT DONT EVEN TEST THIS non-implemented feature and used to work fine, now break:
        `expectType<TypeEqual<typeof item, Texpected_iteration_items>>(true)` fails, cause `item` is `unknown`


@todo(222): use this type helper, but if it makes sense. I tried and makes no difference ;-(

   type GetEachCallback<Titem, TidxKey, Tinput> = Tinput extends AsyncGenerator<any>
     ? EachAsyncCallback<Titem, TidxKey, Tinput>
     : EachCallback<Titem, TidxKey, Tinput>


    // and then

    ..., Icallback = GetEachCallback<Titem, TidxKey, Tinput> (or GetEachCallback<TmapItemReturn, TmapKeyReturn, Tinput>)
*/

/**
 * Iterate over the (many) items of a value, calling the callback for each item. Think of `_.each()` or `Array.forEach()`, but more powerful via [`_z.loop()`](/functions/loop.html). Hence, it works with ANY value, not just arrays and objects, but also `Map`, `Set`, `Iterator`, `Generator` & even `AsyncIterators` (where it returns a promise resolving when iteration ends!
 *
 * Just like `_.each()`, you can break out the loop by returning `false` (as well as `_z.STOP` or `_z.STOP()` ;-))
 *
 * [`_z.isSingle`](/functions/isSingle.html) values are also supported:
 *
 * - with `loopSingles: true` (default), it yields a single iteration of the value itself (value passed to the callback once). This allows functional programming philosophy, where all values are "enclosed" and can be mapped over.
 *
 * - Otherwise (`loopSingles: true`) they are ignored (i.e a 0 iterations loop), but it won't choke on them.
 *
 * - By default, `options.strict: false` but if strict is `true` it will throw an error, that singles aren't allowed.
 *
 * See [`loop()`](/functions/loop.html) for more details on options & all behavior, since `each()` is built on top of it.
 *
 * @param input any value to iterate over. Usually an Array, Object, Map, Set, Iterator, Generator, AsyncIterator, AsyncGenerator etc. but you can also pass single values, like a number, string etc - see `loopSingles` option.
 *
 * @param iteratee the callback function to call for each item. It receives the item, the index or key and the original value (like lodash). If it returns `false` or `STOP` or `STOP()` it breaks the loop. If you're iterating over an `AsyncGenerator` or `AsyncIterator`, you can also return a Promise, which will be awaited before proceeding to the next iteration.
 *
 * @param options you can optionally pass an [`IEachOptions`](/interfaces/IEachOptions.html) object to control which keys / idx are visited (own / inherited / enumerable etc) and more. Note: it is identical to [`ILoopOptions`](/interfaces/ILoopOptions.html), but with an additional `async` option.
 *
 * @returns the original value, for fluent chaining. If `input` was an `AsyncGenerator`/`AsyncIterator`, it returns a `Promise<value>` resolved when iteration is over.
 */
export function each(
  input,
  iteratee: EachIteratee<any, any, any> | EachAsyncIteratee<any, any, any>,
  options: ILoopOptions<any, any, any> = {}
): any | Promise<any> {
  if (!isFunction(iteratee)) throw new Error('_z.each: Iteratee must be a function / callback')

  const _options: ILoopOptions = {
    // ...each_DefaultOptions, // FAILS
    ...options,
  }

  // use a loopGenerator to get the items
  const loopGenerator = loop(input, _options)

  if (isAsyncGenerator(loopGenerator)) {
    return new Promise(async (resolve, reject) => {
      for await (const [item, idxOrkey, count] of loopGenerator as any) {
        const returnValue = await iteratee(item, idxOrkey, input, count)
        if (returnValue === false || isStop(returnValue)) break
      }

      return resolve(input)
    })
  }
  //
  if (
    _options.async ||
    (_options.async === undefined && isAsyncFunction(iteratee))
    // @todo: implement _.isNumber(_options.async) parallelism
  ) {
    return new Promise(async (resolve, reject) => {
      let stop = false
      for (const [item, idxOrkey, count] of loopGenerator) {
        const returnValue = iteratee(item, idxOrkey, input, count)
        if (returnValue instanceof Promise) {
          await returnValue
            .then((resolvedValue) => {
              if (resolvedValue === false || isStop(resolvedValue)) {
                stop = true
                resolve(input)
              }
            })
            .catch(reject)
        }

        if (stop || returnValue === false || isStop(returnValue)) break
      }

      resolve(input)
    })
  }

  // default, normal iteration over the items
  for (const [item, idxOrkey, count] of loopGenerator) {
    const returnValue = iteratee(item, idxOrkey, input, count)
    if (returnValue === false || isStop(returnValue)) break
  }

  return input
}
