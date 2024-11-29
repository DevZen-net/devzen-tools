import { isAsyncGeneratorFunction } from './isAsyncGeneratorFunction'

const GeneratorFunctionConstructor = function* () {}.constructor

/**
 * Checks and returns `true`, if value is either a:
 * - `GeneratorFunction`, eg `function* () {}`
 * - OR `AsyncGeneratorFunction`  `async function* () {}`
 *
 * @see [`z.isAsyncGeneratorFunction`](../functions/isAsyncGeneratorFunction.html) for the more specific one
 *
 * @param val
 */
export const isGeneratorFunction = (val: any): val is GeneratorFunction =>
  (typeof val === 'function' &&
    (val[Symbol.toStringTag] === 'GeneratorFunction' ||
      val instanceof GeneratorFunctionConstructor)) ||
  isAsyncGeneratorFunction(val)

// OR
// !!Function.prototype.toString.call(val).match(/^(\s+)?function *\*/)

// OR the more complete https://raw.githubusercontent.com/inspect-js/is-generator-function/main/index.js 18M downloads/week

// 'use strict'
//
// var toStr = Object.prototype.toString
// var fnToStr = Function.prototype.toString
// var isFnRegex = /^\s*(?:function)?\*/
// // var isFnRegex =  /^(async\s+)?function *\*/
// var hasToStringTag = require('has-tostringtag/shams')()
// var getProto = Object.getPrototypeOf
// var getGeneratorFunc = function () {
//   // eslint-disable-line consistent-return
//   if (!hasToStringTag) {
//     return false
//   }
//   try {
//     return Function('return function*() {}')()
//   } catch (e) {}
// }
// var GeneratorFunction
//
// export function isGeneratorFunction(fn) {
//   if (typeof fn !== 'function') {
//     return false
//   }
//   if (isFnRegex.test(fnToStr.call(fn))) {
//     return true
//   }
//   if (!hasToStringTag) {
//     var str = toStr.call(fn)
//     return str === '[object GeneratorFunction]'
//   }
//   if (!getProto) {
//     return false
//   }
//   if (typeof GeneratorFunction === 'undefined') {
//     var generatorFunc = getGeneratorFunc()
//     GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false
//   }
//   return getProto(fn) === GeneratorFunction
// }
