import { numberEnumToStringKey } from '@neozen/zendash'
import {
  buildMessage,
  // eslint-disable-next-line import/named
  ValidationArguments,
  // eslint-disable-next-line import/named
  ValidationOptions,
} from 'class-validator'
import { ValidateByAsValidatorFunction } from '../wrap/ValidateByAsValidatorFunction'
import { wrapPropertyDecoratorUsingValidateBy } from '../wrap/wrapPropertyDecoratorUsingValidateBy'

/**
 * Checks if a given value is the member of the provided enum, in either side, case-insensitive.
 */
export const IsNumberEnumKeyOrValue = (
  theEnum: object,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return ValidateByAsValidatorFunction(
    {
      name: 'IsNumberEnumKeyOrValue',
      constraints: [theEnum, Object.keys(theEnum)],
      validator: {
        validate: (value, validationArguments: ValidationArguments): boolean => {
          return !!numberEnumToStringKey(validationArguments?.constraints[0], value)
        },

        defaultMessage: buildMessage(
          (eachPrefix) =>
            `${eachPrefix}Property '$property' equals '$value' but it must be one of the following enum values (case-insensitive): $constraint2`,
          validationOptions
        ),
      },
    },
    validationOptions
  ) as PropertyDecorator
}
;(IsNumberEnumKeyOrValue as any)._isEnabledValidZenValidateByAsValidatorFunction = true

export const $IsNumberEnumKeyOrValue =
  wrapPropertyDecoratorUsingValidateBy(IsNumberEnumKeyOrValue)
