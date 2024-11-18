import { getProp, isOk, setProp } from '@neozen/zendash'
import * as _ from 'lodash'
import { ValidationError } from 'class-validator'
import { ValidZenValidationError } from '../types'

// local
import { internalNodeUtilInspect } from './internalNodeUtilInspect'
import { getTinyLog } from './tiny-log'

import { TransformValidZenOptions } from './validateObject'
const _log = getTinyLog(false, 'getValidationErrorsString')

const indentation = (depth: number) => _.repeat('  ', depth - 1)

const getValidationErrorsStringRecursive = (
  errors: ValidZenValidationError[],
  options: TransformValidZenOptions = {}
): string => {
  // _log('getValidationErrorsStringRecursive - errors = ', errors)
  if (!options.validzen?.path) setProp(options, 'validzen/path', [], { create: true })

  const {
    validzen: { path },
  } = options

  _log('getValidationErrorsStringRecursive: options.validzen', options.validzen)

  return _.reduce(
    errors, // :ValidationError[]
    (errorsAcc: string[], error: ValidationError, idx) => {
      path.push(error.property)

      if (error.constraints) {
        errorsAcc.push(
          _.reduce(
            error.constraints,
            (constraintsAcc, val, key) => {
              constraintsAcc.push(`${indentation(path.length)} - ${key} (${val})`)

              return constraintsAcc
            },
            []
          ).join('|')
        )
      }

      // visit children recursively
      if (!_.isEmpty(error.children)) {
        // _log('visit children recursively, error.children = ', error.children)
        errorsAcc.push(getValidationErrorsStringRecursive(error.children, options))
      }

      if ((idx > 0 || (idx === 0 && errors.length === 1)) && (error.target || error.value))
        errorsAcc.push(`_______________________________________________________
at '${path.filter(isOk).join('.')}'
 - value = ${internalNodeUtilInspect(error.value)}
 - target = ${internalNodeUtilInspect(error.target)}
 - class = '${internalNodeUtilInspect(error.target?.constructor)}'`)

      path.pop()

      return errorsAcc
    },
    []
  ).join('\n')
}

export const getValidationErrorsString = (
  validationErrors: ValidZenValidationError[] | Error,
  options: TransformValidZenOptions = {}
) => {
  if (!options.validzen?.path) setProp(options, 'validzen/path', [], { create: true })

  _log('getValidationErrorsString: options.validzen?.path', options.validzen.path)

  const pathHackMsg = `\n - path = '${options.validzen.path.join('.')}'` // @todo: fix the hack
  return validationErrors instanceof Error
    ? `${validationErrors.message}${
        _.endsWith(validationErrors.message, pathHackMsg) ? '' : pathHackMsg
      }`
    : getValidationErrorsStringRecursive(validationErrors, options)
}
