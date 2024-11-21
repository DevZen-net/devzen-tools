import { isEqual, IsEqualCustomizerCallback, IsEqualOptions } from './isEqual'

export function isIqual(
  a: any,
  b: any,
  customizer?: IsEqualCustomizerCallback,
  ctx?: any,
  options?: IsEqualOptions
): boolean

export function isIqual(a: any, b: any, options?: IsEqualOptions, ctx?: any): boolean

/**
 * Shortcut of [`z.isEqual`](../functions/isEqual.html) with forced options =
 *
 *     {
 *       inherited: true
 *       exclude: ['constructor']
 *     }
 */
export function isIqual(
  a: any,
  b: any,
  customizer?: IsEqualOptions | IsEqualCustomizerCallback,
  ctx?: any,
  options?: IsEqualOptions
) {
  // @ts-ignore-next-line _forcedOptions
  return isEqual(a, b, customizer, ctx, options, {
    inherited: true,
    exclude: ['constructor'],
  })
}
