import { isEqual, IsEqualCustomizerCallback, IsEqualOptions } from './isEqual'

export function isIxact(
  a: any,
  b: any,
  customizer?: IsEqualCustomizerCallback,
  ctx?: any,
  options?: IsEqualOptions
): boolean

export function isIxact(a: any, b: any, options?: IsEqualOptions, ctx?: any): boolean

/**
 * Shortcut of [`z.isEqual`](/functions/isEqual.html) with forced options =
 *
 *     {
 *       inherited: true,
 *       exclude: ['constructor'],
 *       exactKeys: true,
 *       exactValues: true,
 *     }
 */
export function isIxact(
  a: any,
  b: any,
  customizer?: IsEqualOptions | IsEqualCustomizerCallback,
  ctx?: any,
  options?: IsEqualOptions
) {
  const forcedOptions: IsEqualOptions = {
    inherited: true,
    exclude: ['constructor'],
    exactKeys: true,
    exactValues: true,
  }

  // @ts-ignore-next-line: signature / forced options
  return isEqual(a, b, customizer, ctx, options, forcedOptions)
}
