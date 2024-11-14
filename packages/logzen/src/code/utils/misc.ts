import * as ansiColors from 'ansi-colors'
import * as upath from 'upath'

export const countNewLines = function (str) {
  let newLines = 0
  while (str[newLines] === '\n') newLines++

  return newLines
}

/**
 * Turn a Windows rootless path (in the unix sense) with forward slashes like "c:\\Users\\anodynos"
 * to unix style with backward slashes and a root slash in front, eg /c:/Users/anodynos
 *
 * Has no effect on unix root paths, as the already have a root slash.
 * Has no effect on non-root paths
 *
 * @todo: move to upath
 */
export const fixWindowsRootPath = (str: string = '') => {
  // omg it's a mess https://www.fileside.app/blog/2023-03-17_windows-file-paths/
  // but this covers 99.9% of cases
  if (str[0] !== '/' && str[1] === ':') return upath.normalize(`/${str}`)

  // if (str[0] === '/') return str // default case covers it
  return str
}

export const colorsStrip = (str: string) => {
  const { enabled } = ansiColors
  // @ts-ignore-next-line
  ansiColors.enabled = true
  str = ansiColors.stripColor(str)
  // @ts-ignore-next-line
  ansiColors.enabled = enabled

  return str
}
