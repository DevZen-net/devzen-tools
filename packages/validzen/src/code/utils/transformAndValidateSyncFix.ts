import { isRealObject } from '@neozen/zendash'
import { ClassType, transformAndValidateSync } from 'class-transformer-validator'

import { internalNodeUtilInspect } from './internalNodeUtilInspect'
import { TransformValidZenOptions } from './validateObject'

/**
 *  Fixes transformAndValidateSync that throws "unexpected token 'i', "filename" is not valid JSON" for string!
 */
export const transformAndValidateSyncFix = <T extends object>(
  classType: ClassType<T>,
  object: object,
  options?: TransformValidZenOptions,
  path: string[] = []
) => {
  if (isRealObject(object)) return transformAndValidateSync(classType, object, options)

  throw new TypeError(` - (transformAndValidateSyncFix): not a Real Object. Expecting any kind of object {} but got ${internalNodeUtilInspect(
    object
  )}:
   - Invalid Value = ${internalNodeUtilInspect(object)}
   - Validation Class = '${internalNodeUtilInspect(classType)}'`) // path no needed,
}
