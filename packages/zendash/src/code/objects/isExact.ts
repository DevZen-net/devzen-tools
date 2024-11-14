import { isEqual, IsEqualCustomizerCallback, IsEqualOptions } from './isEqual'

/**
 * Shortcut of [`_z.isEqual`](/functions/isEqual.html) with forced options
 *
 *      {exactKeys: true, exactValues: true }
 */
export function isExact(
  a: any,
  b: any,
  customizerOrOptions?: IsEqualOptions | IsEqualCustomizerCallback,
  ctx?: any,
  options?: IsEqualOptions
) {
  // @ts-ignore
  const forcedOptions: IsEqualOptions = {
    exactKeys: true,
    exactValues: true,
  }
  // @ts-ignore: signature / forced options
  return isEqual(a, b, customizerOrOptions, ctx, options, forcedOptions)
}
