import * as ansiColors from 'ansi-colors'
import * as _z from '@devzen/zendash'
// import { aSimpleSet } from '@devzen/zendash/dist/test-utils/test-data'
// import * as ansiColors from 'ansi-colors'
import * as _ from 'lodash'
import { ELogLevel, getTinyLog, LogZen, Output } from '../code'

LogZen.clearScreen()
//
const l = new LogZen({
  printMode: 'print',
  print: {colors: false},
  // colors: false,
})

// l.log(l)
// let {version} = {version: 'v20.10'}
let {version} = process // strip v in 'v20.10'
version = version.slice(1) // strip v in 'v20.10'
const versions = version.split('.')
const majorVersion = parseInt(versions[0])
const minorVersion = parseInt(versions[1])

console.log({majorVersion, minorVersion})
if (majorVersion>20 || (majorVersion===20 && minorVersion >= 11))
  console.log('true')
