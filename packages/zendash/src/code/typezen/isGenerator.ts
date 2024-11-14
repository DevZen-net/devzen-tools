import * as _ from 'lodash'

/**
 * Checks if value is a `Generator` i.e `Object [Generator] {}`, what a `GeneratorFunction` returns
 *
 *      const myGeneratorFunction = function* (arg1) { yield arg1 }
 *      const myGenerator = myGeneratorFunction()
 *      _z.isGenerator(myGenerator) // true
 *
 * @see [`_z.isAsyncGenerator()`](/functions/isAsyncGenerator.html). The `AsyncGenerator` is NOT included, only pure `Generator`!
 *
 * @param value
 */
export const isGenerator = (value: unknown): value is Generator<any> =>
  !!value && value[Symbol.toStringTag] === 'Generator' && _.isFunction(value[Symbol.iterator])
