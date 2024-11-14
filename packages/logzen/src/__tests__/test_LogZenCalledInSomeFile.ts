import { LogZen } from '../code'
import * as upath from 'upath'
import { pathReplacementDepth, TfilenamedFunction } from './test-defaultOptions'

export const relativeFilename = upath
  .trimExt(upath.relative(process.cwd(), __filename))
  .split('/')
  .slice(pathReplacementDepth) // remove src/ cause we have a replacePath for it!
  .join('/')

export const test_LogZenInfoCalledInSomeFile: TfilenamedFunction = ((message, l: LogZen) => {
  l.info(message)
}) as any

export const test_LogZenDebugCalledInSomeFile: TfilenamedFunction = ((message, l: LogZen) => {
  l.debug(message)
}) as any

// Add all functions here!
;[test_LogZenInfoCalledInSomeFile, test_LogZenDebugCalledInSomeFile].forEach(
  (fn: any) => (fn.relativeFilename = relativeFilename)
)

/* These wont work - see https://stackoverflow.com/questions/12766528/build-a-function-object-with-properties-in-typescript/18640025#18640025 & https://stackoverflow.com/questions/31541023/typescript-functions-with-attributes

const test_LogZenInfoCalledInSomeFile = (l: LogZen, message) => {
  l.info(message)
}

export namespace test_LogZenInfoCalledInSomeFile {
  export const relativeFilename = myRelativeFilename
}
*/
