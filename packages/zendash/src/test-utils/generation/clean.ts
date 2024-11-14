import * as fs from 'node:fs'

// local
import { ISubstituteOptionsAndState } from './types'

export const clean = async (o: ISubstituteOptionsAndState) => {
  await fs.promises.rm(o.resolvedOutputDir, { recursive: true, force: true })
  o.l.ok(`Cleaned ${o.resolvedOutputDir}`)
}
