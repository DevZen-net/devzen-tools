export * from './OrAnd'

export {
  wrapPropertyDecoratorUsingValidateBy,
  ValidationOptionsWrapped,
  TPropertyDecoratorBasedOnValidateBy,
} from './wrap/wrapPropertyDecoratorUsingValidateBy'

export {
  ValidateByAsValidatorFunction,
  TValidateByAsValidatorFunctionReturnType,
} from './wrap/ValidateByAsValidatorFunction'

// utils
export { getValidationErrorsString } from './utils/getValidationErrorsString'
export { transformAndValidateSyncFix } from './utils/transformAndValidateSyncFix'
export { validateObject, TransformValidZenOptions } from './utils/validateObject'

export * from './decorators'
export * from './types'

// DANGEROUS! These need ValidateBy injection in class-validator, fail on first use otherwise!
// export * from './class-validator-ValidZen-wraps'
