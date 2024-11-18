import { TSpecHandlerFunction } from '@neozen/speczen'
import { isOk } from '@neozen/zen'
import { ClassType } from 'class-transformer-validator'
import * as _ from 'lodash'
import { internalNodeUtilInspect } from '../../code/utils/internalNodeUtilInspect'

// local

import { validateObject } from '../../code'
import { getTinyLog } from '../../code/utils/tiny-log'
import { expectToThrow, trimEmptyLines, trimLines } from '../../docs/utils/test.utils'

export type ValidZen_GenericValidation_SpecHandler = {
  description: string
  instanceOrPlainObjectAndClassOrValidateFn:
    | InstanceType<any>
    | [Record<string, any>, ClassType<any>]
    | (() => any)
  testOptions: {
    tinyLog: boolean
    isStrictErrorDescriptionAllLines: boolean
    isStrictIndentation: boolean
  }
  expectedErrors?: string
}

export const ValidZen_GenericValidation_SpecHandler: TSpecHandlerFunction<
  ValidZen_GenericValidation_SpecHandler
> = ({
  testRunner: { it, describe, headerFull },
  specData: {
    description,
    testOptions: { tinyLog, isStrictIndentation, isStrictErrorDescriptionAllLines },
    instanceOrPlainObjectAndClassOrValidateFn,
    expectedErrors,
  },
}) => {
  const _log = getTinyLog(tinyLog, 'ValidZen_GenericValidation_SpecHandler')

  expectedErrors =
    isStrictErrorDescriptionAllLines || !expectedErrors
      ? expectedErrors
      : expectedErrors.split('\n').find(isOk)

  headerFull(() =>
    describe(`Testing ${description} with value ${internalNodeUtilInspect(
      instanceOrPlainObjectAndClassOrValidateFn
    )} ${expectedErrors ? ' THROWS:' : ' NO ERRORS'}`, () => {
      it(`Validates value or throws:`, () => {
        const validateFn = _.isFunction(instanceOrPlainObjectAndClassOrValidateFn)
          ? instanceOrPlainObjectAndClassOrValidateFn
          : _.isArray(instanceOrPlainObjectAndClassOrValidateFn)
            ? () =>
                // we have a plain object + class
                validateObject(
                  instanceOrPlainObjectAndClassOrValidateFn[0],
                  instanceOrPlainObjectAndClassOrValidateFn[1]
                )
            : // instance, so it has class as constructor
              () => validateObject(instanceOrPlainObjectAndClassOrValidateFn)

        if (expectedErrors) {
          _log(`${description}: THROWS`, '\n\nexpectedErrors:\n', expectedErrors)
          expectToThrow(
            validateFn,
            expectedErrors,
            isStrictIndentation ? trimEmptyLines : trimLines,
            _log
          )
        } else {
          expect(validateFn).not.toThrow()

          if (_.isFunction(instanceOrPlainObjectAndClassOrValidateFn))
            expect(validateFn()).toBe(true)
        }
      })
    })
  )
}
