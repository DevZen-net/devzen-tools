import { constructorNamed } from '../utils'

/**
 * Checks if the value is an instance of Native (i.e built-in) Error
 *
 * @param val
 */
export const isNativeError = (val): val is Error =>
  val instanceof Error &&
  constructorNamed(
    val,
    'Error',
    'EvalError',
    'RangeError',
    'ReferenceError',
    'SyntaxError',
    'TypeError',
    'URIError',
    'AggregateError'
  )
