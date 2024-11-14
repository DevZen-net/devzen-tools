// @todo: use these, when building for browsers
// import { inspect as nodeExtractedInspect } from 'node-inspect-extracted'
// export { InspectOptions } from 'node-inspect-extracted'
// export const inspect = nodeExtractedInspect

import { inspect as nodeUtilInspect } from 'util'
export { InspectOptions } from 'util'
export const inspect = nodeUtilInspect // for node native

export const internalInspect = (obj: any) =>
  inspect(obj, {
    colors: false,
    depth: 3,
    maxArrayLength: 32,
    maxStringLength: 100,
    breakLength: Infinity, // Infinity = no line breaks
  })

