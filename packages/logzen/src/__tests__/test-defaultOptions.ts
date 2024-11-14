import * as _ from 'lodash'
import { LogZen } from '../code'
import { defaultOptions, Options } from '../code/types'

export const testDefaultOptions: Options = {
  ..._.cloneDeep(defaultOptions),
  output: 'std',
}

export const pathReplacements = { src: '', dist: '' }

export const pathReplacementDepth = 1 // the path length distance of /src/ & its '' replacement (i.e 1)

export const resetDefaults = () => {
  LogZen.reset()
  LogZen.updateLogPathOptions({ '/': testDefaultOptions })
  LogZen.addPathReplacements(pathReplacements)
}

export interface TfilenamedFunction {
  (message: string, l?: LogZen): void
  relativeFilename: string
}
