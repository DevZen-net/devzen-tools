import { AsyncFunction } from './isAsyncFunction'
import { isAsyncGeneratorFunction } from './isAsyncGeneratorFunction'
import { isGeneratorFunction } from './isGeneratorFunction'

export type FunctionTypes =
  | Function
  | GeneratorFunction
  | AsyncFunction
  | AsyncGeneratorFunction
  | ((...args) => any)
// | ArrowFunction // @todo: no definition for ArrowFunction

export type FunctionTypeNames =
  | 'Function'
  | 'GeneratorFunction'
  | 'AsyncFunction'
  | 'AsyncGeneratorFunction'
  | 'ArrowFunction'
  | 'class' // unfortunately JS, it should it be here!

export const FUNCTION_TYPE_NAMES: FunctionTypeNames[] = [
  'Function',
  'GeneratorFunction',
  'AsyncFunction',
  'AsyncGeneratorFunction',
  'ArrowFunction', // @todo: no definition for ArrowFunction
  'class', // unfortunately JS, it should it be here!
]

/**
 * Determine the type of function: class definition OR function (and what kind)
 *
 * https://stackoverflow.com/questions/30758961/how-to-check-if-a-variable-is-an-es6-class-declaration/69316645#69316645
 *
 * @param value any
 *
 * @returns 'Function' | 'GeneratorFunction' | 'AsyncFunction' | 'AsyncGeneratorFunction' | 'ArrowFunction' | 'class' | undefined
 */
export const functionType = (value: FunctionTypes): 'class' | FunctionTypeNames | undefined => {
  return typeof value === 'function'
    ? value.prototype
      ? Object.getOwnPropertyDescriptor(value, 'prototype')?.writable
        ? isAsyncGeneratorFunction(value)
          ? 'AsyncGeneratorFunction'
          : isGeneratorFunction(value)
            ? 'GeneratorFunction'
            : 'Function'
        : [Symbol, BigInt].includes(value as any)
          ? 'Function'
          : 'class'
      : value.constructor.name === 'AsyncFunction'
        ? 'AsyncFunction'
        : 'ArrowFunction' /* special case value === Proxy ? */
    : undefined
}
