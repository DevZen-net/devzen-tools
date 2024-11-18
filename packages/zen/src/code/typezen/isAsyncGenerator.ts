/**
 * Checks if value is an `AsyncGenerator`, i.e `Object [Generator] {}`, what a `GeneratorFunction` returns:

 *      const myAsyncGeneratorFunction = async function* (arg1) { yield arg1 }
 *      const myAsyncGenerator = await myAsyncGeneratorFunction()
 *      z.isAsyncGenerator(myAsyncGenerator) // true
 *
 * @see [`z.isGenerator()`](/functions/isGenerator.html)
 *
 * @param val
 */
export const isAsyncGenerator = <Titem>(
  val: AsyncGenerator<Titem> | any
): val is AsyncGenerator<Titem> =>
  !!val &&
  val[Symbol.toStringTag] === 'AsyncGenerator' &&
  typeof val[Symbol.asyncIterator] === 'function'

// OR
// target[Symbol.toStringTag] === 'GeneratorFunction' ||
// target[Symbol.toStringTag] === 'AsyncGeneratorFunction'
