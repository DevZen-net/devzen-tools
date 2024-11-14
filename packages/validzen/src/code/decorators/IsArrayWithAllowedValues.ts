import * as _ from 'lodash'
import {
  buildMessage,
  // eslint-disable-next-line import/named
  ValidationArguments,
  // eslint-disable-next-line import/named
  ValidationOptions,
} from 'class-validator'

import { internalNodeUtilInspect } from '../utils/internalNodeUtilInspect'
import { wrapPropertyDecoratorUsingValidateBy } from '../wrap/wrapPropertyDecoratorUsingValidateBy'
import { ValidateByAsValidatorFunction } from '../wrap/ValidateByAsValidatorFunction'

/**
 * Checks if a given value is an Array, with any values contained strictly on allowedValues array.
 */
export const IsArrayWithAllowedValues = (
  allowedValues: any[],
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return ValidateByAsValidatorFunction(
    {
      name: 'IsArrayWithAllowedValues',
      constraints: [allowedValues],
      validator: {
        validate: (value, validationArguments: ValidationArguments): boolean =>
          _.isArray(value) && !_.some(value, (item) => !allowedValues.includes(item)),

        defaultMessage: buildMessage(
          (eachPrefix) =>
            `${eachPrefix}Property '$property' must be an Array with any among these Allowed Values: ${internalNodeUtilInspect(
              allowedValues
            )}`,
          validationOptions
        ),
      },
    },
    validationOptions
  ) as PropertyDecorator
}
;(IsArrayWithAllowedValues as any)._isEnabledValidZenValidateByAsValidatorFunction = true

export const $IsArrayWithAllowedValues =
  wrapPropertyDecoratorUsingValidateBy(IsArrayWithAllowedValues)
