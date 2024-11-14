import * as assert from 'node:assert'
import * as c from 'ansi-colors'
import * as _ from 'lodash'
import * as upath from 'upath'
import { LogZen, getTinyLog } from '../code'
import {
  assertStdOut,
  replaceLineNumberColumnNumber,
} from './utils/logzen-capture-output-proxy'
const { passMeALoggerToPrint } = require('./anotherPath/someOtherFile')
const { stdout } = require('test-console')

const _log = getTinyLog(false, 'temp')

LogZen.clearScreen()
LogZen.addPathReplacements({
  'src/docs': 'Source Docs',
})
LogZen.updateLogPathOptions({
  '/[~]/../..': {
    logLevel: 'trace',
    output: {
      out(...argsToPrint) {
        console.log(
          'ALL except l.debug() & l.error(): CustomOutput for whole path:',
          ...argsToPrint
        )
      },
      error(...argsToPrint) {
        console.error('ERROR: CustomOutput for whole path:', ...argsToPrint)
      },
      debug(...argsToPrint) {
        console.log('DEBUG: CustomOutput for whole path:', ...argsToPrint)
      },
    },
  },
})

// Lets use the 'output' common to LogZen instances in `src/docs`

const l7_5 = new LogZen({ header: true })
// _log(LogZen._logPathOptions)
l7_5.warn('Output in path options, affects all instances in path', [{ a: 1, b: 2 }])
l7_5.options({
  inspect: {
    depth: 1,
    getters: true,
    colors: true,
  },
})
