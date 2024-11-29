// export const VERSION = '0.0.0.unknown' // was added by 'urequire-rc-inject-version'
export { setProp, SetPropOptions, setProp_DefaultOptions } from './objects/setProp'
export { getProp, GetPropOptions, getProp_DefaultOptions } from './objects/getProp'
export { isDisjoint, IsDisjointOptions, isDisjoint_DefaultOptions } from './objects/isDisjoint'
export {
  isRefDisjoint,
  IsRefDisjointOptions,
  isRefDisjoint_DefaultOptions,
} from './objects/isRefDisjoint'
export { getRefs, GetRefsOptions, getRefs_DefaultOptions } from './objects/getRefs'
export {
  isEqual,
  IsEqualOptions,
  IsEqualCustomizerCallback,
  isEqual_DefaultOptions,
} from './objects/isEqual'
export { arrayize } from './arrays/arrayize'
export {
  keys,
  keysS,
  Keys,
  KeysS,
  IKeysOptions,
  IKeys_DefaultOptions,
  keys_DefaultOptions,
  InspectableNested,
  isInspectableNested,
} from './loopzen/keys'
export { values, Values } from './loopzen/values'
export { each, EachIteratee, EachAsyncIteratee } from './loopzen/each'
export { take } from './loopzen/take'
export { map, IMapOptions } from './loopzen/map'
export { filter } from './loopzen/filter'
export { clone } from './loopzen/clone'
export {
  functionType,
  FunctionTypeNames,
  FunctionTypes,
  FUNCTION_TYPE_NAMES,
} from './typezen/functionType'
export { isAgree } from './agreement/isAgree'
export { isAnyNumber } from './typezen/isAnyNumber'
export { isArrayBuffer } from './typezen/isArrayBuffer'
export { isSetEqual } from './typezen/isSetEqual'
export { isAsyncFunction, AsyncFunction } from './typezen/isAsyncFunction'
export { isAsyncGenerator } from './typezen/isAsyncGenerator'
export { isAsyncGeneratorFunction } from './typezen/isAsyncGeneratorFunction'
export { isBigInt } from './typezen/isBigInt'
export { isBoxedPrimitive } from './typezen/isBoxedPrimitive'
export { isBoxedBoolean } from './typezen/isBoxedBoolean'
export { isBoxedNumber } from './typezen/isBoxedNumber'
export { isBoxedString } from './typezen/isBoxedString'
export {
  isClass,
  classType,
  ClassTypeNames,
  CLASS_TYPE_NAMES,
  isUserClass,
  SYSTEM_CLASSES,
  constructor,
  isSystemClass,
  SystemClasses
} from './typezen/classes'
export { isEnumerable } from './typezen/isEnumerable'
export { isExact } from './objects/isExact'
export {
  isTrue,
  isOk,
  isTruthy,
  isStrictTrue,
  isFalse,
  isBad,
  isFalsy,
  isStrictFalse,
} from './typezen/trueFalse'
export { isFunction } from './typezen/isFunction'
export { isGenerator } from './typezen/isGenerator'
export { isGeneratorFunction } from './typezen/isGeneratorFunction'
export { isInstance } from './typezen/isInstance'
export { isIqual } from './objects/isIqual'
export { isPlainIterator } from './typezen/isPlainIterator'
export { isIxact } from './objects/isIxact'
export { isLike } from './objects/isLike'
export {
  isMapIterator,
  MapIteratorKeys,
  MapIteratorValues,
  MapIteratorEntries,
} from './typezen/isMapIterator'
export { isNativeError } from './typezen/isNativeError'
export {
  isMany,
  isManyType,
  Many,
  ManyNames,
  ManySystem,
  ManySystemNames,
  MANY_NAMES,
  MANY_SYSTEM_NAMES,
} from './typezen/isMany'
export { isNumber } from './typezen/isNumber'
export { isNumberString, NumberString } from './typezen/isNumberString'
export { isPOJSObject } from './typezen/isPOJSObject'
export {
  isPrimitive,
  isPrimitiveType,
  Primitive,
  PrimitiveNames,
  PRIMITIVE_NAMES,
} from './typezen/isPrimitive'
export { isPromise, IfPromise, IsPromise, UnwrapPromise } from './typezen/isPromise'
export { isRealFunction } from './typezen/isRealFunction'
export { isRef } from './typezen/isRef'
export { isRealObject, IfRealObject, IsRealObject } from './typezen/isRealObject'
export {
  isSetIterator,
  SetIteratorEntries,
  SetIteratorKeys,
  SetIteratorValues,
} from './typezen/isSetIterator'

export { isStrictNumber } from './typezen/isStrictNumber'

export {
  isTypedArray,
  typedArrayType,
  TypedArrayNames,
  TypedArrayNumber,
  TypedArrayBigInt,
  TypedArrayNumberNames,
  TypedArrayBigIntNames,
  TYPED_ARRAY_NAMES,
  TYPED_ARRAY_NUMBER_NAMES,
  TYPED_ARRAY_BIGINT_NAMES,
  isTypedArrayBigInt,
  isBigInt64Array,
  isBigUint64Array,
  isTypedArrayNumber,
  isInt8Array,
  isUint8Array,
  isUint8ClampedArray,
  isInt16Array,
  isUint16Array,
  isInt32Array,
  isUint32Array,
  isFloat32Array,
  isFloat64Array,
  isTypedArrayName,
} from './typezen/isTypedArray'
export { isAnyArray } from './typezen/isAnyArray'
export {
  loop,
  IloopMeta,
  IloopCallbacks,
  FilterCallback,
  MapCallback,
  MapKeysCallback,
  TakeCallback,
  ItemsCallback,
  IFilterOnlyOptions,
  FilterReturn,
  ILoopOptions,
  LoopValues,
  LoopKeys,
  ILoop_DefaultOptions, // @todo: add it properly
  LOOP_SYMBOL,
  AsyncLoopGenerator,
  LoopGenerator,
  TloopCallbackNames,
  loopCallbackNames,
  loop_DefaultOptions,
  isLoopGenerator,
  isAsyncLoopGenerator
} from './loopzen/loop'
export { numberEnumToNumberVal } from './typezen/numberEnumToNumberVal'
export { numberEnumToStringKey } from './typezen/numberEnumToStringKey'
export { isDataView } from './typezen/isDataView'
export {
  realObjectType,
  RealObjectTypeNames,
  REAL_OBJECT_TYPE_NAMES,
} from './typezen/realObjectType'
export { instanceType, InstanceTypeNames, INSTANCE_TYPE_NAMES } from './typezen/instanceType'
export { type, isType, TypeNames, TYPE_NAMES } from './typezen/type'
export { realType, isRealType, RealTypeNames, REAL_TYPE_NAMES } from './typezen/realType'
export { isAnyJustIterator } from './typezen/isAnyJustIterator'
export { STOP, isStop, StopClass, Stop, NOTHING, isNothing, isPass } from './typezen/utils'
export { DataViewType, ArrayBufferCursor } from './loopzen/ArrayBufferCursor'
export * from './typezen/type-utils'
export * from './typezen/isSingle'
export { mapKeys } from './loopzen/mapKeys'
export { reduce, ReduceCallback } from './loopzen/reduce'
export { find } from './loopzen/find'
export { findKey } from './loopzen/findKey'
// export * from './LogZenMini'
