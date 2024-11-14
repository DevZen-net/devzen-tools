import { LogZen } from '../code'
import * as upath from 'upath'
import { pathReplacementDepth, TfilenamedFunction } from './test-defaultOptions'

export const relativeFilename = upath
  .trimExt(upath.relative(process.cwd(), __filename))
  .split('/')
  .slice(pathReplacementDepth) // remove src/ cause we have a replacePath for it!
  .join('/')

export const test_LogZenCreatedInSomeFile: TfilenamedFunction = ((message) => {
  const l = new LogZen({ colors: false })
  l.info(message)
}) as any

// Add all functions here!
;[test_LogZenCreatedInSomeFile].forEach((fn: any) => (fn.relativeFilename = relativeFilename))
