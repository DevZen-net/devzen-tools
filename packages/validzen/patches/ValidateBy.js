"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateBy = exports.buildMessage = void 0;
const register_decorator_1 = require("../../register-decorator");
function buildMessage(impl, validationOptions) {
  return (validationArguments) => {
    const eachPrefix = validationOptions && validationOptions.each ? 'each value in ' : '';
    return impl(eachPrefix, validationArguments);
  };
}
exports.buildMessage = buildMessage;
function ValidateBy(options, validationOptions) {
  return function (object, propertyName) {
    (0, register_decorator_1.registerDecorator)({
      name: options.name,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: options.constraints,
      validator: options.validator,
    });
  };
}
exports.ValidateBy = ValidateBy; // ValiZen: ValidateBy function is hijacked by ValidateByAsValiZenFunction
//# sourceMappingURL=ValidateBy.js.map

const { ValidationUtils } = require("../../validation/ValidationUtils");

/**
 * This is the drop-in replacement for class-validator's ValidateBy() function.
 *
 * The compiled version needs to be injected into class-validator, (i.e `exports.ValidateBy = ValidateByAsValidatorFunction`)
 * to be able to use any (?) PropertyDecorator as a function!
 *
 * @see [wrapValidateByPropertyDecorator](/functions/wrapValidateByPropertyDecorator) for for context!
 *
 * @todo(4 5 7): handle async/promises
 * @todo(5 6 8): explain better
 * @param validateByOptions
 * @param validationOptions
 */
const ValidateByAsValidatorFunction = (validateByOptions, validationOptions = {}) => {
  if (!validationOptions.isWrapValidateByPropertyDecorator) {
    // Original/default behavior: we call and return original PropertyDecorator with passed values.
    return ValidateBy(validateByOptions, validationOptions);
  }
  // Otherwise, return a function, that does the actual validation:
  // - by calling validationOptions.validator.validate
  // - and builds a message with validationOptions.validator.defaultMessage
  // - and throws a ValidationError[] if validation fails
  // - and returns true if validation succeeds
  const validatorInvoker = (value, validationArguments) => {
    // _log('validatorInvoker: ', { value, validateByOptions, validationOptions })
    const { validator } = validateByOptions;
    const validate = typeof validator === 'function'
      ? validator
      : validator.validate;
    const { constraints } = validateByOptions;
    validationArguments = { ...validationArguments, value, constraints };
    const result = validate(value, validationArguments);
    if (result) {
      return result; // result should be true | @todo: Promise<boolean>
    }
    else {
      let message = validationOptions.message
        ? typeof validationOptions.message === 'function'
          ? validationOptions.message(validationArguments)
          : validationOptions.message // a string
        : typeof validator === 'function'
          ? `PropertyDecorator validation failed, but has no defaultMessage. All we know is:
          - PropertyDecorator = ${validationOptions.propertyDecoratorProducingFunction.name}
          - Value = ${value}
          - ValidationArguments = ${JSON.stringify(validationArguments)}
          - ValidationOptions = ${JSON.stringify(validationOptions)}
          - ValidateByOptions = ${JSON.stringify(validateByOptions)}
          - Constraints = ${JSON.stringify(constraints)}`
          : validator.defaultMessage(validationArguments);
      message = ValidationUtils.replaceMessageSpecialTokens(message, validationArguments);
      // This is how class-validator works: it expects a thrown ValidationError[]
      // @see open issue https://github.com/typestack/class-validator/issues/495
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw [
        {
          value,
          target: validationArguments.object,
          constraints: {
            [validationOptions.propertyDecoratorProducingFunction.name]: message,
          },
          property: validationArguments.property,
          validationArgumentsConstraints: validationArguments.constraints,
        },
      ];
    }
  };
  validatorInvoker.propertyDecoratorProducingFunctionName =
    validationOptions.propertyDecoratorProducingFunction.name; // get the name of the PropertyDecorator in ValidZen getValidatorsTypes
  return validatorInvoker; // @todo(2 8 2): fix this typing
};

exports.ValidateBy = ValidateByAsValidatorFunction; // ValiZen: hijacked ValidateBy
