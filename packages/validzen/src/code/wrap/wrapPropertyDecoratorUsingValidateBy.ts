import * as _ from 'lodash'
import {
  ValidateBy as originalValidateBy,
  // eslint-disable-next-line import/named
  ValidationOptions,
} from 'class-validator'

// local
import { getTinyLog } from '../utils/tiny-log'

const _log = getTinyLog(true, 'wrapPropertyDecoratorUsingValidateBy')

export type TPropertyDecoratorBasedOnValidateBy = (...args: any[]) => PropertyDecorator

export interface ValidationOptionsWrapped extends ValidationOptions {
  isWrapValidateByPropertyDecorator?: boolean
  propertyDecoratorProducingFunction?: TPropertyDecoratorBasedOnValidateBy
}

/**
 * Wrap a PropertyDecorator factory function, that uses ValidateBy, like the class-validator ones, and convert it to Validator Function so it can be used in ValidZen. A Validator Function can be:
 *
 * - a simple user function that returns boolean, given the value to validate
 *
 * - OR it can throw class-validator ValidationError[] (this is how class-validator works!). This provides all the info we need to write good user explanations, get metrics etc.
 *
 * Note: You NEED to have `ValidateByAsValidatorFunction` to have replaced ValidateBy in class-validator, to be able to convert a PropertyDecorator to a full fledged Validator Function!
 *
 * Random thoughts / context

 * How do we replace ValidateBy with "ValidateByAsValidatorFunction" (and similarly if needed for `registerDecorator`)?
 *
 * # Solution 1 - FAIL
 * hijacking the class-validator code, ValidateBy() function, at runtime. Not easy, if original already loaded and used internally! For now, we are getting
 *
 * import * as classValidator from 'class-validator'
 * classValidator.ValidateBy = ValidateByAsValidatorFunction
 * =>> TypeError: Cannot set property ValidateBy of [object Object] which has only a getter
 *
 * Object.defineProperty(classValidator, "ValidateBy", {
 *   value: ValidateByAsValidatorFunction,
 * })
 * => TypeError: Cannot redefine property: ValidateBy at Function.defineProperty (<anonymous>)
 *
 * # Solution 2 - WORKING!
 *
 * We `patch-package` the library `class-validator`, to replace `ValidateBy` with `ValidateByAsValidatorFunction`? Temporary solution, until we find a better one or the class-validator team decides to provide this functionality somehow!
 *
 * @todo(7 2 3): assumes 2 args, cater for diff arity of propertyDecoratorProducingFunction!
 * For PropertyDecorators that use ValidateBy, the ValidationOptions object:
 *  - is optional
 *  - always the last argument, if it exists
 *  - can also be the first (eg no other args for @IsDefined())!
 *
 * @param propertyDecoratorProducingFunction

 * @param validationOptionsIndex
 *
 * @param throwValidationError NOT IMPLEMENTED default behavior (true), where ValidationErrors are thrown (this is how class-validator works)
 *                             If false, the ValidationErrors are returned
 */
export const wrapPropertyDecoratorUsingValidateBy = <
  T extends TPropertyDecoratorBasedOnValidateBy,
>(
  propertyDecoratorProducingFunction: T,
  /**
   * We need the hijack the options: ValidationOptions passed to the Decorator, to make it a ValidationOptionsWrapped.

   * Usually the 2nd argument is ValidationOptions, but it can be in a different position.
   *
   * Its assumed it's always the last argument in the decorator.
   *
   * For cases of variadic Decorators (like OrAnd) we pass Infinity, since we don't know how many args
   * precede the options. The last plainObject will be used as options, or if none exists, an options will be added as last arg.
   */
  {
    validationOptionsIndex = 1,
    // throwValidationError = true // NOT IMPLEMENTED - it always throws
  } = {}
): T => {
  // We return a new function, that will call the original PropertyDecorator, but with a ValidationOptions object
  // that has a flag to indicate that we are wrapping a PropertyDecorator as a function!
  // @todo: fix return type of new function, to be `true` (false is not returned in class-validator, it just throws)

  // But first we need to check we have ValidateByAsValidatorFunction injected into class-validator!
  // Unless we use ValidZen ones which are using ValidateByAsValidatorFunction, which have a flag to indicate that!

  if (
    originalValidateBy.name === 'ValidateBy' &&
    !(propertyDecoratorProducingFunction as any)._isEnabledValidZenValidateByAsValidatorFunction
  )
    throw new TypeError(`ValidZen: ValidateByAsValidatorFunction is NOT injected into class-validator, to enhance \`ValidateBy\` (ValidateBy.name === 'ValidateBy')!

You CAN NOT wrap and enhance 3rd-party PropertyDecorators as Validator functions, including the class-validator & class-validator-extended ones, without this injection!

To inject it, either:

- use the patch-package solution, execute \`npm run chore:patch-package\`

- or copy patches/ValidateBy.js to node_modules/class-validator/cjs/decorator/common/ValidateBy.js

If the PropertyDecorators is your own, great news! You can use ValidZen's \`ValidateByAsValidatorFunction()\` directly, as a dropin-replacement of \`ValidateBy()\` and mark your decorator function with \`MyDecorator._isEnabledValidZenValidateByAsValidatorFunction = true\` and it will pass this error and work without the injection!`)

  // Return the new wrapper function
  // @ts-ignore @todo: fix this
  return (
    ...args: any[]
    // validationOptions: ValidationOptionsWrapped = {} is the last assumed arg
  ): any => {
    let validationOptions: ValidationOptionsWrapped

    if (validationOptionsIndex === Infinity) validationOptionsIndex = args.length - 1

    // use arg at validationOptionsIndex, if plainObject
    if (_.isPlainObject(args[validationOptionsIndex])) {
      validationOptions = _.clone(args[validationOptionsIndex])
      args = args.slice(0, -1)
    } else validationOptions = {}

    validationOptions.propertyDecoratorProducingFunction = propertyDecoratorProducingFunction
    validationOptions.isWrapValidateByPropertyDecorator = true

    // The propertyDecoratorProducingFunction will call ValidateBy() and
    // fall into ValidateByAsValidatorFunction below, because of the extra flags in validationOptions ;-)
    return propertyDecoratorProducingFunction(...args, validationOptions)
  }
}
