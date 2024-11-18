import { isEqual, IsEqualCustomizerCallback, IsEqualOptions } from './isEqual'

export function isLike(
  a: any,
  b: any,
  customizer?: IsEqualCustomizerCallback,
  ctx?: any,
  options?: IsEqualOptions
): boolean

export function isLike(a: any, b: any, options?: IsEqualOptions, ctx?: any): boolean

/**
 * Shortcut of [`z.isEqual`](/functions/isEqual.html) with forced options
 *
 *       { like: true }
 */
export function isLike(
  a: any,
  b: any,
  customizerOrOptions?: IsEqualOptions | IsEqualCustomizerCallback,
  ctx?: any,
  options?: IsEqualOptions
): boolean {
  // @ts-ignore-next-line _forcedOptions
  return isEqual(a, b, customizerOrOptions, ctx, options, { like: true })
}
