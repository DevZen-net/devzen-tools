import * as _ from 'lodash'
import { getProp, setProp } from '@neozen/zen'
import { ClassType, TransformValidationOptions } from 'class-transformer-validator'
import { ValidationError } from 'class-validator'

// local
import { getValidationErrorsString } from './getValidationErrorsString'
import { getTinyLog } from './tiny-log'
import { transformAndValidateSyncFix } from './transformAndValidateSyncFix'

const _log = getTinyLog(false, 'validateValue()')

export interface TransformValidZenOptions extends TransformValidationOptions {
  validzen?: {
    path?: string[]
  }
}

export const defaultTransformAndValidateSyncOptions: TransformValidationOptions = {
  validator: {
    forbidNonWhitelisted: true,
    // forbidUnknownValues: true,
    whitelist: true,
  },
}

export const validateObject = <T extends object>(
  objValue: T,
  actualValueClass?: ClassType<T>,
  transformValidZenOptions: TransformValidZenOptions = {}
): T => {
  if (!transformValidZenOptions?.validzen?.path)
    setProp(transformValidZenOptions, 'validzen/path', [], { create: true })
  _.defaults(
    (transformValidZenOptions.validator ||= {}),
    defaultTransformAndValidateSyncOptions.validator
  ) // deep blending needed!
  _.defaults(
    (transformValidZenOptions.transformer ||= {}),
    defaultTransformAndValidateSyncOptions.transformer
  ) // deep blending needed!

  const path = getProp(transformValidZenOptions, 'validzen/path')

  let validatedValue
  try {
    validatedValue = transformAndValidateSyncFix(
      actualValueClass,
      objValue,
      transformValidZenOptions,
      path
    )
    return validatedValue
  } catch (err) {
    const errors: ValidationError[] = err
    // _log(`validateValue(): value=`, value, `\nerrors = `, errors)

    throw new TypeError(
      `ValidZen: Validation Errors:\n${getValidationErrorsString(
        errors,
        transformValidZenOptions
      )}`,
      // `ValidZen: Validation Errors:\n${internalNodeUtilInspect(errors)}`,
      // @ts-ignore
      { cause: errors }
    )
  }
}
