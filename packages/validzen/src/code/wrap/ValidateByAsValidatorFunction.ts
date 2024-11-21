import { ValidatorConstraintInterface } from 'class-validator/types/validation/ValidatorConstraintInterface'
import { ValidZenValidationError } from '../types'
import { internalNodeUtilInspect } from '../utils/internalNodeUtilInspect'
import { ValidationOptionsWrapped } from './wrapPropertyDecoratorUsingValidateBy'
import {
  ValidateBy as originalValidateBy,

  // eslint-disable-next-line import/named
  ValidateByOptions,
  // eslint-disable-next-line import/named
  ValidationArguments,
} from 'class-validator'

// @ts-ignore-next-line
import { ValidationUtils } from 'class-validator/cjs/validation/ValidationUtils'
// inside the class-validator package, ValidationUtils is not exported, so we need to use the internal path:
// const {ValidationUtils} = require("../../validation/ValidationUtils");

export type TValidateByAsValidatorFunctionReturnType = PropertyDecorator

// @todo: TypeScript fails to compile when used in the decorator, if not returned type is not PropertyDecorator. BUT, the signature is correct, so IDEs like IntelliJ have no problem with it!
// We declare this return type here, but how to distinguish between PropertyDecorator and Function return type in a typing, depending on the use?
// | ((value: any, validationArguments: ValidationArguments) => boolean | Promise<boolean>)

/**
 * This is the drop-in replacement for class-validator's ValidateBy() function.
 *
 * The compiled version needs to be injected into class-validator, (i.e `exports.ValidateBy = ValidateByAsValidatorFunction`)
 * to be able to use any (?) PropertyDecorator as a function!
 *
 * @see [wrapValidateByPropertyDecorator](../functions/wrapValidateByPropertyDecorator) for for context!
 *
 * @todo(4 5 7): handle async/promises
 * @todo(5 6 8): explain better
 * @param validateByOptions
 * @param validationOptions
 */
export const ValidateByAsValidatorFunction = (
  validateByOptions: ValidateByOptions,
  validationOptions: ValidationOptionsWrapped = {}
): TValidateByAsValidatorFunctionReturnType => {
  if (!validationOptions.isWrapValidateByPropertyDecorator) {
    // Original/default behavior: we call and return original PropertyDecorator with passed values.
    return originalValidateBy(validateByOptions, validationOptions) as PropertyDecorator
  }

  // Otherwise, return a function, that does the actual validation:
  // - by calling validationOptions.validator.validate
  // - and builds a message with validationOptions.validator.defaultMessage
  // - and throws a ValidationError[] if validation fails
  // - and returns true if validation succeeds
  const validatorInvoker = (value: any, validationArguments: ValidationArguments): boolean => {
    // _log('validatorInvoker: ', { value, validateByOptions, validationOptions })
    const { validator } = validateByOptions

    const validate =
      typeof validator === 'function'
        ? validator
        : (validator as ValidatorConstraintInterface).validate

    const { constraints } = validateByOptions

    validationArguments = { ...validationArguments, value, constraints }
    const result = validate(value, validationArguments)

    if (result) {
      return result // result should be true | @todo: Promise<boolean>
    } else {
      let message = validationOptions.message
        ? typeof validationOptions.message === 'function'
          ? (validationOptions as any).message(validationArguments)
          : validationOptions.message // a string
        : typeof validator === 'function'
          ? `PropertyDecorator validation failed, but has no defaultMessage. All we know is:
          - PropertyDecorator = ${validationOptions.propertyDecoratorProducingFunction.name}
          - Value = ${value}
          - ValidationArguments = ${internalNodeUtilInspect(validationArguments)}
          - ValidationOptions = ${internalNodeUtilInspect(validationOptions)}
          - ValidateByOptions = ${internalNodeUtilInspect(validateByOptions)}
          - Constraints = ${internalNodeUtilInspect(constraints)}`
          : (validator as ValidatorConstraintInterface).defaultMessage(validationArguments)

      message = ValidationUtils.replaceMessageSpecialTokens(message, validationArguments)

      // This is how class-validator works: it expects a thrown ValidationError[]
      // @see open issue https://github.com/typestack/class-validator/issues/495
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw <ValidZenValidationError[]>[
        {
          value,
          target: validationArguments.object,
          constraints: {
            [validationOptions.propertyDecoratorProducingFunction.name]: message,
          },
          property: validationArguments.property,
          validationArgumentsConstraints: validationArguments.constraints,
        },
      ]
    }
  }

  validatorInvoker.propertyDecoratorProducingFunctionName =
    validationOptions.propertyDecoratorProducingFunction.name // get the name of the PropertyDecorator in ValidZen getValidatorsTypes

  return validatorInvoker as unknown as TValidateByAsValidatorFunctionReturnType // @todo(2 8 2): fix this typing
}
