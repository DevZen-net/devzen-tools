/*
@todo
* Classes: test & implement - like Functions?
* Add default generic types if not breaking
* Check the need for Tany vs any

* Future:
* - Implement `async` option
* - Examine removing `props: 'all'` & allow only `only` - throw error & fix types

@todo(353): Use `next(nextInput)` and optionally yield `returnValue` in the `loop()` iteration.
    * We 'll always pass a `next: TNext = (() =>)` function to the loop as 4rth arg (or 5th if `value` is also passed), and if called its ...args are also passed to the `genOrIter.next(...args)` of the iterator/generator at the next iteration! Dont worry about the first call to `next()` that is args-less, as the first call to `genOrIter.next()` is also args-less (and if you pass something ists lost anyway!).
    * We'll use a while(!genOrIterNextResult.done) { genOrIterNextResult = genOrIter.next(...args) }. When `done: true` is returned, we'll break the loop and yield the final value as `returnValue`, if `options.yieldReturnValue` & `value in genOrIterNextResult` is true & value !== undefined. If `options.yieldReturnValue === false`, then the `returnValue` is also returned on the `loop()` generator (as the original one did), but not yielded (to mimic the original behavior)!
*/
import { And, Or } from 'type-fest'

import {
  IKeysOptions,
  ILoopOptions,
  IsNestingObject,
  Keys,
  InsideKeys,
  InsideValues,
  Primitive,
  Values,
} from '../../../code'
import { loop as loop_implementation } from '../../../code/loopzen/loop'
import { IsSingleOrWeak } from '../../../code/typezen/isSingle'

/**
 * LoopKeysOrValues returns the loop keys or values of the input value, those returned in the Loop Generator, depending on the input type and options.
 *
 * It's used by LoopKeys and LoopValues, and is the only type-function that decides what keys/items to return.
 */
type LoopKeysOrValues<Tinput, Toptions extends IKeysOptions, IsKeys = true> =
  // prettier stay here!
  Tinput extends object
    ? IsSingleOrWeak<Tinput> extends true
      ? /* #############################################################################################
          ## Single Object input ## and we want props @todo: handle iterateSingles: false / strict: true
      */
        Toptions extends { props: true | 'all' } & IKeysOptions
        ? Exclude<
            // Return #1: Keys or Values of Single Object Props
            IsKeys extends true ? Keys<Tinput, Toptions> : Values<Tinput, Toptions>,
            never
          >
        : // Return #2: Keys or Values of Single Object Props
          IsKeys extends true
          ? never
          : Tinput
      : /* #############################################################################################
        ## Many Object input

        Many inputs are divided conceptually into:

         - `IsNestedObject` false, which are always
            - iterated over their own keys/values ONLY, irrespective of options.props!

         - `IsNestedObject` (`IsRealObject` false for now), which are iterated:
            - over their NestedKeys/Values, UNLESS props: true
            - over props as well, if props: true | 'all'

          Implementation
        */

        /* Get Nested Keys & Values:
        - only for IsNestedObject
        - only if props is NOT true (i.e only if props: false|undefined|'all')
     */
        // @todo: replace with AND
        | (IsNestingObject<Tinput> extends true
              ? Or<
                  // If props: false or 'all' OR if props is NOT true (default case is when defaults are used (eg KeysOptions type is passed and `props: boolean` or options: any etc, where we are unsure if it's true or false, so we use default
                  Toptions extends { props: false | 'all' } & IKeysOptions ? true : false,
                  Toptions extends { props: true } & IKeysOptions ? false : true
                > extends true
                ? Exclude<
                    // # RETURN #3: NestedKeys or NestedValues of Many input type
                    IsKeys extends true ? InsideKeys<Tinput> : InsideValues<Tinput>,
                    never
                  >
                : never
              : never) // add Props / PropsValues, if props: true or 'all', for all objects

          /* Get props:
      - if options.props: true | 'all', for all objects (NestedObjects & IsRealObjects)
      - If NOT IsNestedObject, irrespective of options.props
  */
          | (Or<
              IsNestingObject<Tinput> extends true ? false : true,
              Toptions extends { props: true | 'all' } ? true : false
            > extends true
              ? Exclude<
                  // # RETURN #4: Keys or Values of Object Props, when props: true or 'all'
                  IsKeys extends true ? Keys<Tinput, Toptions> : Values<Tinput, Toptions>,
                  never
                >
              : never)
    : Tinput extends Primitive
      ? // Primitive and Single values are returned as is, key is never // @todo: change key to null?
        // # RETURN #5: Single values are returned as is, with `never` key
        IsKeys extends true
        ? never
        : Tinput
      : 'ERROR: LoopKeysOrValues: Unsupported input type, neither `extends object` nor `extends Primitive`'

/**
 * Get the loop keys, depending on the input value type and options.
 * The legwork is done in LoopKeysOrValues<>, this is just a wrapper.
 */
export type LoopKeys<Tinput, Toptions extends IKeysOptions> = LoopKeysOrValues<Tinput, Toptions>

/**
 * Get the loop items (a.k.a values), depending on the input value type and options
 * The legwork is done in LoopKeysOrValues<>, this is just a wrapper.
 */
export type LoopValues<Tinput, Toptions extends IKeysOptions> = LoopKeysOrValues<
  Tinput,
  Toptions,
  false
>

export type LoopCount<Tinput, Toptions> =
  // prettier stay here!
  IsSingleOrWeak<Tinput> extends true
    ? // @todo: cater for loopSingles & strict
      Toptions extends { props: true | 'all ' }
      ? number
      : 1
    : number

// loop2() options, combined options + callbacks
// It BREAKS the typings, when we pass the options to the callbacks (map, mapKeys etc), so its abandoned (for now)

// Version 1: loop2 is dummy - discover Titem/key & XxxReturn here.
// Failing to pass args types to callbacks (map, mapKeys etc)
// But works with options & successfully passes the right types to Generator<[TmapItemReturn, TmapKeyReturn, number]>
export type GetLoop2Generator_v1_DiscoverArgsIn_LoopGenerator_FAILS_pass_args_to_map<
  Tinput,
  // Toptions extends ILoopOptions<any, any, any>, // works
  // Toptions extends ILoopOptions<any, any, Tinput>, // works

  // Toptions extends ILoopOptions<any, any, Tinput, TmapItemReturn, TmapKeyReturn>,
  Toptions extends ILoopOptions<'UNUSED', 'UNUSED', Tinput, 'UNUSED', 'UNUSED'>,
  // Toptions extends ILoopOptions<any, TidxKey, any>,
  // Toptions extends ILoopOptions<Titem, any, any>,
  // Toptions extends ILoopOptions<Titem, TidxKey, Tinput>,
  // Toptions extends ILoopOptions<Titem, TidxKey, Tinput, TmapItemReturn, TmapKeyReturn>, // Most sensible - no difference
  // Titem extends LoopValues<Tinput, Toptions> = LoopValues<Tinput, Toptions>,
  // TidxKey extends LoopKeys<Tinput, Toptions> = LoopKeys<Tinput, Toptions>,

  // Variation (without constraints)

  // We have the right options for LoopValues/LoopKeys here
  // but callbacks have gotten the wrong types, from loop2()
  Titem = LoopValues<Tinput, Toptions>,
  TidxKey = LoopKeys<Tinput, Toptions>,
  TmapItemReturn extends any = Toptions['map'] extends (...args: any) => infer MapReturn
    ? MapReturn
    : // ? ReturnType<Toptions['map']>
      Titem,
  // Variation, seems useless
  // TmapItemReturn extends any = Toptions['map'] extends (item?:Titem, idxKey?: TidxKey, input?: Tinput) => infer MapReturn
  //   // ? `MapReturn`
  //   ? Toptions['map']
  //   : Titem,

  TmapKeyReturn extends any = Toptions['mapKeys'] extends (...args: any) => infer MapKeysReturn
    ? MapKeysReturn
    : TidxKey,
  Tcount = LoopCount<Tinput, Toptions>,
> =
  // prettier stay here!
  // IsAbsent<Toptions> extends true // @todo: fix WrongAnyOptions test with options: any
  //   ? LoopGenerator1<
  //       Tinput,
  //       // @-ts-expect-error @todo: fix me - fails if we use `Toptions extends LoopOptions<Titem, TidxKey, Tinput>`
  //       ILoop_DefaultOptions<Tinput, Titem, TidxKey, TmapItemReturn, TmapKeyReturn> // @todo: grab the real types from the input
  //       // NoInfer<ILoop_DefaultOptions<Tinput, Titem, TidxKey, TmapItemReturn, TmapKeyReturn>> // NOT BREAKS, NOT SOLVES anything
  //     >
  //   : IsAnyOrUnknown<Tinput> extends true
  //     ? Generator<[any, any, number]>
  //     :
  And<
    Toptions extends { props: true | 'all' } ? false : true,
    Tinput extends AsyncGenerator<any, any, any> ? true : false
  > extends true
    ? AsyncGenerator<[TmapItemReturn, never, Tcount]>
    : Generator<[TmapItemReturn, TmapKeyReturn, Tcount]>

// Version 1: loop is dummy, discovery happening in LoopGenerator
// # FAILS to pass the right types to callbacks (map, mapKeys etc) 53 new errors
//    (passes unknown to map() instead of the right type)
// # WORKS: when props: true (40 errors otherwise)
export function loop2_v1_DiscoverArgsIn_LoopGenerator_FAILS_pass_args_to_map<
  Tinput,
  // What ever you pass here in ILoopOptions<...?>, becomes the types of the callbacks (map. mapKeys etc)
  // Eg
  // Toptions extends ILoopOptions<'foo', 'bar', Tinput>, // WORKS (as PoC)
  // Toptions extends NoInfer<ILoopOptions<'foo', 'bar', Tinput>>, // WORKS (as PoC)

  // # Working version
  Toptions extends ILoopOptions<any, any, Tinput>,

  // Toptions extends NoInfer<ILoopOptions<any, any, Tinput>>, // no difference
  // Toptions extends ILoopOptions<unknown, unknown, Tinput>, // Fails when passed to LoopGenerator1<Tinput, Toptions>

  // Variations:

  // Toptions extends ILoopOptions<Titem, TidxKey, Tinput>,

  // PLUS one of

  // # Fails when passed to LoopGenerator1<Tinput, Toptions>
  // #
  // TidxKey extends any,
  // Titem extends any,

  // # Fails - multiple
  // - Fails when passed to LoopGenerator1<Tinput, Toptions>
  //
  // - TS2322: Type
  //      (item: 1n | 2n | 3n, idxKey: number, input: MyArrayWithProps, count: number) => NEW_TYPE
  // is not assignable to type
  //      MapCallback<true | RegExp | 'a string', 'e' | 'f' | 'g', MyArrayWithProps, true | RegExp | 'a string'>
  // Types of parameters item and item are incompatible.
  // Type true | RegExp | 'a string' is not assignable to type 1n | 2n | 3n
  //
  // - Type T_NEW_TYPE is not assignable to type 1 | 3 | 2
  // - Props: true is ignored, uses Nested keys/values only
  // #
  // Titem extends LoopValues<Tinput, Toptions>,
  // TidxKey extends LoopKeys<Tinput, Toptions>,

  // # Fails as above
  // Titem = LoopValues<Tinput, Toptions>,
  // TidxKey = LoopKeys<Tinput, Toptions>,

  // Titem extends any = LoopValues<Tinput, Toptions>,
  // TidxKey extends any = LoopKeys<Tinput, Toptions>,

  // Titem extends LoopValues<Tinput, Toptions> = LoopValues<Tinput, Toptions>,
  // TidxKey extends LoopKeys<Tinput, Toptions> = LoopKeys<Tinput, Toptions>,
  // Titem extends NoInfer<LoopValues<Tinput, Toptions>> = LoopValues<Tinput, Toptions>,
  // TidxKey extends NoInfer<LoopKeys<Tinput, Toptions>> = LoopKeys<Tinput, Toptions>,
  // Titem extends LoopValues<Tinput, NoInfer<Toptions>> = LoopValues<Tinput, Toptions>,
  // TidxKey extends LoopKeys<Tinput, NoInfer<Toptions>> = LoopKeys<Tinput, Toptions>,
>(
  input: Tinput,
  options?: Toptions
): GetLoop2Generator_v1_DiscoverArgsIn_LoopGenerator_FAILS_pass_args_to_map<Tinput, Toptions>

export function loop2_v1_DiscoverArgsIn_LoopGenerator_FAILS_pass_args_to_map(
  input: any,
  options?: any
): any {
  return loop_implementation(input, options)
}

// Version 2: Discover in loop2() & Pass/Accept as args in LoopGenerator
// # WORKS: passes right types to callbacks (map, mapKeys etc) (53 new errors otherwise)
// # FAILS: IGNORES Options - when props: true & map() exists, it fails (40 errors):
// TS2322: Type (item: 1n | 2n | 3n) => 1n | 2n | 3n is not assignable to type
//    MapCallback<NoInfer<true | RegExp | 'a string'>, 'e' | 'f' | 'g', NoInfer<MyArrayWithProps>, 1n | 2n | 3n>
export type GetLoop2Generator_v2_DicoverArgsIn_loop_FAILS_PropsTrueMap_IgnoresOptions<
  Tinput,
  Toptions, // extends ILoopOptions<Titem, TidxKey, Tinput, TmapItemReturn, TmapKeyReturn>, // works with Version 2 only
  Titem,
  TidxKey,
  TmapItemReturn,
  TmapKeyReturn,
  Tcount,
> =
  // prettier stay here!
  // IsAbsent<Toptions> extends true // @todo: fix WrongAnyOptions test with options: any
  //   ? LoopGenerator2<
  //       Tinput,
  //       // @-ts-expect-error @todo: fix me - fails if we use `Toptions extends LoopOptions<Titem, TidxKey, Tinput>`
  //       ILoop_DefaultOptions<Tinput, Titem, TidxKey, TmapItemReturn, TmapKeyReturn>, // @todo: grab the real types from the input
  //       // NoInfer<ILoop_DefaultOptions<Tinput, Titem, TidxKey, TmapItemReturn, TmapKeyReturn>> // NOT BREAKS, NOT SOLVES anything
  //
  //       Titem,
  //       TidxKey,
  //       TmapItemReturn,
  //       TmapKeyReturn,
  //       Tcount
  //     >
  //   : IsAnyOrUnknown<Tinput> extends true
  //     ? Generator<[any, any, number]>
  //     :
  And<
    Toptions extends { props: true | 'all' } ? false : true,
    Tinput extends AsyncGenerator<any, any, any> ? true : false
  > extends true
    ? AsyncGenerator<[TmapItemReturn, never, Tcount]>
    : Generator<[TmapItemReturn, TmapKeyReturn, Tcount]>

export function loop2_v2_DicoverArgsIn_loop_FAILS_PropsTrueMap_IgnoresOptions<
  Tinput,
  Toptions extends ILoopOptions<Titem, TidxKey, Tinput, TmapItemReturn, TmapKeyReturn>,
  // @todo: LoopValues & Keys here ignore Toptions (eg options.props), so always get Nested keys/values
  Titem extends LoopValues<Tinput, Toptions> = LoopValues<Tinput, Toptions>,
  TidxKey extends LoopKeys<Tinput, Toptions> = LoopKeys<Tinput, Toptions>,
  TmapItemReturn extends any = Toptions['map'] extends (...args: any) => infer MapReturn
    ? MapReturn
    : Titem,
  TmapKeyReturn extends any = Toptions['mapKeys'] extends (...args: any) => infer MapKeysReturn
    ? MapKeysReturn
    : TidxKey,
  Tcount = LoopCount<Tinput, Toptions>,
>(
  input: Tinput,
  options?: Toptions
): GetLoop2Generator_v2_DicoverArgsIn_loop_FAILS_PropsTrueMap_IgnoresOptions<
  Tinput,
  Toptions,
  Titem,
  TidxKey,
  TmapItemReturn,
  TmapKeyReturn,
  Tcount
>

/* Variation with LoopXxx call instead of Titem/TidxKey - no difference
export function loop2_v2_DicoverArgsIn_loop_FAILS_PropsTrueMap_IgnoresOptions<
  Tinput,
  Toptions extends ILoopOptions<LoopValues<Tinput, Toptions>, LoopKeys<Tinput, Toptions>, Tinput, TmapItemReturn, TmapKeyReturn>,
  // @todo: LoopValues & Keys here ignore Toptions (eg options.props), so always get Nested keys/values

  TmapItemReturn extends any = Toptions['map'] extends (...args: any) => infer MapReturn
    ? MapReturn
    : LoopValues<Tinput, Toptions>,
  TmapKeyReturn extends any = Toptions['mapKeys'] extends (...args: any) => infer MapKeysReturn
    ? MapKeysReturn
    : LoopKeys<Tinput, Toptions>,
  Tcount = LoopCount<Tinput, Toptions>,
>(
  input: Tinput,
  options?: Toptions
): LoopGenerator2<Tinput, Toptions, LoopValues<Tinput, Toptions>, LoopKeys<Tinput, Toptions>, TmapItemReturn, TmapKeyReturn, Tcount>
 */

export function loop2_v2_DicoverArgsIn_loop_FAILS_PropsTrueMap_IgnoresOptions(
  input: any,
  options?: any
): any {
  return loop_implementation(input, options)
}

// Version 3: HYBRID FAILED: Discover in loop2() & LoopGenerator & Pass/Accept as args in LoopGenerator
// # WORKS: passes right types to callbacks (map, mapKeys etc) (53 new errors otherwise)
// # FAILS: IGNORES Options - when props: true & map() exists, it fails (40 errors):
// TS2322: Type (item: 1n | 2n | 3n) => 1n | 2n | 3n is not assignable to type
//    MapCallback<NoInfer<true | RegExp | 'a string'>, 'e' | 'f' | 'g', NoInfer<MyArrayWithProps>, 1n | 2n | 3n>
export type GetLoop2Generator_DiscoverArgsIn_loop2_AndLoopGenerator_FAILS_PropsTrueMap_IgnoresOptions<
  Tinput,
  Toptions extends ILoopOptions<Titem, TidxKey, Tinput>, // works with Version 2 only
  Titem,
  TidxKey,
  TmapItemReturn extends any = Toptions['map'] extends (...args: any) => infer MapReturn
    ? MapReturn
    : Titem,
  TmapKeyReturn extends any = Toptions['mapKeys'] extends (...args: any) => infer MapKeysReturn
    ? MapKeysReturn
    : TidxKey,
  Tcount = LoopCount<Tinput, Toptions>,
> =
  And<
    Toptions extends { props: true | 'all' } ? false : true,
    Tinput extends AsyncGenerator<any, any, any> ? true : false
  > extends true
    ? AsyncGenerator<[TmapItemReturn, never, Tcount]>
    : Generator<[TmapItemReturn, TmapKeyReturn, Tcount]>

export function loop2_DiscoverArgsIn_loop2_AndLoopGenerator_FAILS_PropsTrueMap_IgnoresOptions<
  Tinput,
  Toptions extends ILoopOptions<Titem, TidxKey, Tinput>,
  // @todo: LoopValues & Keys here ignore Toptions (eg options.props), so always get Nested keys/values
  Titem extends LoopValues<Tinput, Toptions> = LoopValues<Tinput, Toptions>,
  TidxKey extends LoopKeys<Tinput, Toptions> = LoopKeys<Tinput, Toptions>,
  // TmapItemReturn extends any = Toptions['map'] extends (...args: any) => infer MapReturn
  //   ? MapReturn
  //   : Titem,
  // TmapKeyReturn extends any = Toptions['mapKeys'] extends (...args: any) => infer MapKeysReturn
  //   ? MapKeysReturn
  //   : TidxKey,
  // Tcount = LoopCount<Tinput, Toptions>,
>(
  input: Tinput,
  options?: Toptions
): GetLoop2Generator_DiscoverArgsIn_loop2_AndLoopGenerator_FAILS_PropsTrueMap_IgnoresOptions<
  Tinput,
  Toptions,
  NoInfer<Titem>,
  NoInfer<TidxKey>
>

export function loop2_DiscoverArgsIn_loop2_AndLoopGenerator_FAILS_PropsTrueMap_IgnoresOptions(
  input: any,
  options?: any
): any {
  return loop_implementation(input, options)
}

// export const loop2 = loop2_v1_DiscoverArgsIn_LoopGenerator_FAILS_pass_args_to_map // FAILS COUNT 71
export const loop2 = loop2_v2_DicoverArgsIn_loop_FAILS_PropsTrueMap_IgnoresOptions
// export const loop2 = loop2_DiscoverArgsIn_loop2_AndLoopGenerator_FAILS_PropsTrueMap_IgnoresOptions
