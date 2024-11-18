import * as c from 'ansi-colors'
import * as _z from '@neozen/zendash'
import * as _ from 'lodash'
import * as assert from 'node:assert'
import { stderr, stdout } from 'test-console'
import * as stringPrototypeReplaceAll from 'string.prototype.replaceall'

stringPrototypeReplaceAll.shim()

// local
import {
  LogZen,
  allLogMethodNames,
  TlogMethod,
  // getTinyLog
} from '../../code'
import { colorsStrip } from '../../code/utils/misc'

// const _log = getTinyLog(false, 'LogZenCaptureOutputClass')

const outputHolder = {
  stderr: null,
  stdout: null,
}
const stackDepthCreatedLogZenCaptureOut = 1
const stackDepthLogLogZenCaptureOut = 3

export class LogZenCaptureOutputClass extends LogZen {
  private parentMethods: Record<string, TlogMethod>

  constructor(...constructorArgs: any[]) {
    // inject the right callerFile!
    if (_.isString(constructorArgs[0])) {
      constructorArgs[0] = {
        stackDepthCreated: stackDepthCreatedLogZenCaptureOut,
        stackDepthCalled: stackDepthLogLogZenCaptureOut,
        loggerName: constructorArgs[0],
      }
    } else if (_z.isRealObject(constructorArgs[0])) {
      ;(constructorArgs[0] as any).stackDepthCreated =
        ((constructorArgs[0] as any)?.stackDepthCreated || 0) +
        stackDepthCreatedLogZenCaptureOut
      ;(constructorArgs[0] as any).stackDepthCalled =
        ((constructorArgs[0] as any)?.stackDepthCalled || 0) + stackDepthLogLogZenCaptureOut
    } else if (_.isUndefined(constructorArgs[0])) {
      constructorArgs[0] = {
        stackDepthCreated: stackDepthCreatedLogZenCaptureOut,
        stackDepthCalled: stackDepthLogLogZenCaptureOut,
      }
    }

    super(...constructorArgs)
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    self.parentMethods = _.reduce(
      allLogMethodNames,
      (acc, methodName) => {
        acc[methodName] = this[methodName]
        return acc
      },
      {}
    )

    _.each(allLogMethodNames, (methodName) => {
      self[methodName] = (...args) => {
        if (outputHolder.stdout === null) outputHolder.stdout = []
        if (outputHolder.stderr === null) outputHolder.stderr = []

        let output
        let result
        if (['error', 'fatal', 'critical'].includes(methodName)) {
          output = stderr.inspectSync(
            () => (result = self.parentMethods[methodName].apply(self, args))
          )
          outputHolder.stderr = outputHolder.stderr.concat(output)
          _.each(output, (o) => console.error(o.slice(0, -1))) // print normally also
        } else {
          output = stdout.inspectSync(
            () => (result = self.parentMethods[methodName].apply(self, args))
          )
          outputHolder.stdout = outputHolder.stdout.concat(output)
          _.each(output, (o) => console.log(o.slice(0, -1))) // print normally also,
        }

        return result
      }
    })
  }
}

// match the ".js.1956:6)" part of the message and replace it with ".js:XXXX:YY)"
export const replaceLineNumberColumnNumber = (message) => {
  const regex = /(\.[jt]s:)(\d+):(\d+\))/g
  const match = message.matchAll(regex)
  let result = match.next()
  while (!result.done) {
    const v = result.value
    message = message.replaceAll(result.value[0], `${v[1]}${v[2]}:YY)`)
    result = match.next()
  }

  return message
}

// match the "1,234|WARN" at the start the message and replace it with "1,2XX warn"
const replaceTimerOutput = (message) => {
  const regex = /(\d),(\d)(\d{2})(\s*\|)(WARN|INFO|OK|NOTICE)/g
  const match = message.matchAll(regex)
  let result = match.next()
  while (!result.done) {
    const v = result.value
    message = message.replaceAll(result.value[0], `${v[1]},${v[2]}XX${v[4]}${v[5]}`)
    message = message.trimStart()
    result = match.next()
  }

  return message
}

//  string[] => string[]
export const getOutput = (outputs) => {
  // _log('OUTPUT = ', outputs)
  const resultOutputs = _.isArray(outputs)
    ? outputs
        .map((output) => c.unstyle((output || '').slice(0, (output || '').length - 1))) // @todo: remove c.unstyle & test properly!
        .filter((item) => !!item)
    : []
  // _log('OUTPUT resultOutputs = ', resultOutputs)
  return _.isEmpty(resultOutputs)
    ? ['']
    : resultOutputs
        .map(replaceLineNumberColumnNumber)
        .map(replaceTimerOutput)
        .map((resultOutput) =>
          resultOutput
            .split('\n')
            .map((line) => line.trimEnd())
            .join('\n')
        )
}

// expectedStrings: string[]
let testsRunOKCount = 0
let testsSkippedCount = 0
let testsRunCount = 0
const createAssertOnStdName = (stdName) => (expectedStrings, dummy) => {
  if (expectedStrings !== false) {
    testsRunCount++
    if (outputHolder[stdName] === null) {
      // just warn, so we can run alongside normal LogZen
      console.warn(
        `###### WARNING (createAssertOnStdName): assert not run, ${stdName} was null. expectedString = `,
        expectedStrings
      )
    } else {
      // debug assertStdXxx
      // console.log('outputHolder[stdName]=', getOutput(outputHolder[stdName]))
      // console.log('expectedStrings=', expectedStrings)
      assert.deepEqual(getOutput(outputHolder[stdName]).map(colorsStrip), expectedStrings.map(colorsStrip)) // @todo(114): allow colors, remove colorStrip (used to work, but breaks in some node version / where you call it from etc)

      console.log(
        c.green(
          `            ${c.symbols.check} OK: Test #${testsRunCount}${
            expectedStrings === '' ? c.dim(` (Nothing printed)`) : ''
          }`
        )
      )
      testsRunOKCount++
    }
  } else {
    testsSkippedCount++
    console.log(c.yellow(`            ${c.symbols.check} SKIPPED: Test #${testsRunCount}`))
  }

  outputHolder[stdName] = null
}
export const assertStdOut = createAssertOnStdName('stdout')
export const assertStdErr = createAssertOnStdName('stderr')

export const getTestsRunOKCount = () => testsRunOKCount
export const getTestsRunCount = () => testsRunCount
export const getTestsSkippedCount = () => testsSkippedCount
