#!/usr/bin/env node
import { clean } from './clean'
import { substituteCycle } from './substituteCycle'
import { ELogLevel, LogZenMini } from '../../code/LogZenMini'
// local

import { ISubstituteOptions } from './types'
import { getFinalConfig } from './getFinalConfig'

import { watch } from './watching'

export const substitute = async (options: ISubstituteOptions) => {
  const o = getFinalConfig(options)
  o.l.debug('substitute() starting!')

  if (o.clean) await clean(o)
  await substituteCycle(o)

  if (o.watch) await watch(o, substituteCycle)
  else o.l.ok('Substitute done & no `watch` - exiting!')
}
