import { isInstance } from './isInstance'
import { isRealObject } from './isRealObject'

export type RealObjectTypeNames = 'pojso' | 'instance'

export const REAL_OBJECT_TYPE_NAMES: RealObjectTypeNames[] = ['pojso', 'instance'] as const

/**
 * Determine the type of an [`z.isRealObject`](../functions/isRealObject.html): an `'instance'` of a class or a plain `'pojso'` object.
 *
 * If it is not an [`z.isRealObject`](../functions/isRealObject.html), it returns `undefined`, which means you need to [`z.type()`](../functions/type.html) it to get the proper type.
 *
 * https://stackoverflow.com/questions/30758961/how-to-check-if-a-variable-is-an-es6-class-declaration/69316645#69316645
 *
 * @param value any
 *
 * @returns 'pojso' | 'instance' | undefined
 **/
export const realObjectType = (value: unknown): RealObjectTypeNames | undefined => {
  return isRealObject(value) ? (isInstance(value) ? 'instance' : 'pojso') : undefined
}
