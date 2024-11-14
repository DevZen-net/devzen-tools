import { ObjectPropTypes } from './type-utils'

export const isEnumerable = (obj: any, key: ObjectPropTypes) =>
  Object.propertyIsEnumerable.call(obj, key)
