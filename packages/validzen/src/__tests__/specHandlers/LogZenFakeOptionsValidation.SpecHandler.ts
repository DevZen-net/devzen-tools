import { TSpecHandlerFunction } from '@devzen/speczen'
import { isOk } from '@devzen/zendash'
import * as _ from 'lodash'
import { TransformValidationOptions } from 'class-transformer-validator'
import { ValidationError } from 'class-validator'

// local
import {
  getValidationErrorsString,
  transformAndValidateSyncFix,
  validateObject,
  OrAnd,
} from '../../code'
import { internalNodeUtilInspect } from '../../code/utils/internalNodeUtilInspect'
import { getTinyLog } from '../../code/utils/tiny-log'

import {
  expectToThrow,
  trimEmptyLines,
  trimEndLines,
  trimLines,
} from '../../docs/utils/test.utils'
import { Options, OptionsAtConstructor, OptionsInternal } from '../fixtures/LogZenFake-types'

// Mock LogZen for testing, useful to test with different options classes
class LogZenFake {
  constructor(
    private _options,
    debugLevel?,
    logLevel?
  ) {
    validateObject(_options, OptionsAtConstructor)
  }

  static updateLogPathOptions(pathOptions: { [logPath: string]: Options }) {
    _.each(pathOptions, (opt) => validateObject(opt, Options))
  }

  options(options?: Options): Options {
    if (options) this._options = options
    return validateObject(this._options, OptionsInternal)
  }
}
const LogZen = LogZenFake
let logger: LogZenFake = null

export type LogZenFakeOptionsValidation_SpecData = {
  title: string
  testOptions: {
    isStrictErrorDescriptionAllLines: boolean
    isStrictIndentation: boolean
  }
  options: Options // Logzen options
  expectedErrors?: string
}

export const LogZenFakeOptionsValidation_SpecHandler: TSpecHandlerFunction<
  LogZenFakeOptionsValidation_SpecData
> = ({
  testRunner: { it, describe, headerFull },
  specData: {
    title,
    testOptions: { isStrictIndentation, isStrictErrorDescriptionAllLines },
    options,
    expectedErrors,
  },
}) => {
  const _log = getTinyLog(false, 'LogZenFakeOptionsValidation.SpecHandler')

  logger ||= new LogZen({ loggerName: 'logger' })

  const indentate = isStrictIndentation ? _.flow(trimEmptyLines, trimEndLines) : trimLines

  expectedErrors =
    isStrictErrorDescriptionAllLines || !expectedErrors
      ? indentate(expectedErrors)
      : indentate(expectedErrors).split('\n')[0]

  headerFull(() =>
    describe(`${title} with options ${internalNodeUtilInspect(options)} ${
      expectedErrors ? ' THROWS:' : ' NO ERRORS'
    }`, () => {
      it(`Instantiating via new LogZen(options):`, () => {
        const updateFn = () => new LogZen(options)

        if (expectedErrors)
          expectToThrow(
            updateFn,
            expectedErrors,
            _.flow(indentate, (str) => str.replaceAll(/ extends.*]/g, ']')),
            _log
          )
        else expect(updateFn).not.toThrow()
      })

      // it(`Updating LogZen via l.options(options):`, () => {
      //   const updateFn = () => logger.options(options)
      //
      //   if (expectedErrors)
      //     expectToThrow(
      //       updateFn,
      //       expectedErrors,
      //       _.flow(trimLines, (er) =>
      //         er
      //           .replaceAll(/ extends.*]/g, ']')
      //           .replaceAll('OptionsAtConstructor', 'OptionsInternal')
      //       )
      //     )
      //   else expect(updateFn).not.toThrow()
      // })
      //
      // it(`Updating via LogZen.updateLogPathOptions({'/': options}):`, () => {
      //   const updateFn = () => LogZen.updateLogPathOptions({ '/': options })
      //
      //   if (expectedErrors)
      //     expectToThrow(
      //       updateFn,
      //       expectedErrors,
      //       _.flow(trimLines, (er) =>
      //         er.replaceAll(/ extends.*]/g, ']').replaceAll('OptionsAtConstructor', 'Options')
      //       )
      //     )
      //   else expect(updateFn).not.toThrow()
      // })
    })
  )
}
