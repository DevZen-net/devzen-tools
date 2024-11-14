import { constructorNamed } from '../utils'

/**
 * Checks if value ia an ArrayBuffer
 * @param val
 */
export const isArrayBuffer = (val: any): val is ArrayBuffer =>
  constructorNamed(val, 'ArrayBuffer')
