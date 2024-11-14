import { inspect } from 'util'

// @todo: replace with LogZen when published
export const internalNodeUtilInspect = (obj: any) =>
  inspect(obj, {
    colors: false,
    depth: 10,
    maxArrayLength: 32,
    maxStringLength: 500,
    breakLength: Infinity, // Infinity = no line breaks
    showHidden: false,
    compact: true,
  })
