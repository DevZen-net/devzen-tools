const AsyncGeneratorFunction = async function* () {}.constructor

/**
 * Checks if value is a `AsyncGeneratorFunction`, eg `async function* () {}`
 *
 * When you call an `AsyncGeneratorFunction`, it returns an `AsyncGenerator`, that you can loop with `for await (const x of asyncGenerator()) {}`, or better yet `for await (const [item] of z.loop(asyncGenerator())) {}`
 *
 * @see [`z.isAsyncGenerator()`](/functions/isAsyncGenerator.html) to check if a value is an `AsyncGenerator`, ie the result of calling an `AsyncGeneratorFunction`
 *
 * @see [`z.isGeneratorFunction`](/functions/isGeneratorFunction.html) for the non-async check
 *
 * @param val
 */
export const isAsyncGeneratorFunction = (val: any): val is AsyncGeneratorFunction =>
  typeof val === 'function' &&
  (val[Symbol.toStringTag] === 'AsyncGeneratorFunction' ||
    val instanceof AsyncGeneratorFunction)

// Function.prototype.toString.call(val).match(/(AsyncGeneratorFunction *\*/)
