import * as _ from 'lodash'
import { OptionsInternal, Options } from './types'
import { getTinyLog } from './utils/tiny-log'
import { isRealObject, setProp } from '@devzen/zendash'

// const _log = getTinyLog(false, 'blendOptions')

export const hashFixMergeCustomiser = (dstValue, srcValue, key, object, source) => {
  // All Hashes, not just PlainObjects!
  // Lodash merge() does not merge instances of classes, it replaces them!
  // Fixes `validatedOptions.output = transformAndValidateSync(Output, output, transformAndValidateSyncOptions)`
  // that was breaking ALL nested objects merging ;-( Why? See jest-docs example ## 7.5
  if (isRealObject(srcValue)) {
    if (isRealObject(dstValue)) {
      return _.merge(dstValue, srcValue)
    } else {
      return srcValue // overwrite non-hash dstValue
    }
  }

  return undefined // all other keys are dealt with default lodash merge
}

export const mergeKidsCustomiser = (dstValue, srcValue, key, object, source) => {
  if (key === 'kids') {
    let result = null
    // we have an array of kids already
    if (_.isArray(dstValue)) result = dstValue

    // we have an array of kids incoming
    if (_.isArray(srcValue)) {
      result = result ? [...result, ...srcValue] : srcValue
    } else if (_.isNull(srcValue)) result = null // discard previous kids

    if (_.isArray(result)) {
      // remove anything before null (discard previous kids) [partially AI written ;-)]
      const nullIndex = _.findIndex(result, _.isNull)
      if (nullIndex > -1) result = result.slice(nullIndex + 1)
    }

    return result
  }

  return hashFixMergeCustomiser(dstValue, srcValue, key, object, source)
}

// @todo: use Blender to blend options
export const blendOptions = ({
  options,
  isForLogPathOptions,
}: {
  options: Options[]
  isForLogPathOptions?: boolean
}): OptionsInternal => {
  options = _.cloneDeep(options) // .map(validateOptions) not needed, already validated
  // _log(`blendOptions(isForLogPathOptions= ${isForLogPathOptions}, cloneDeep options = `, options)

  const internalOptions: OptionsInternal = isForLogPathOptions
    ? <OptionsInternal>_.mergeWith({}, ...options, hashFixMergeCustomiser)
    : _.mergeWith({}, ...options, mergeKidsCustomiser)

  if ('colors' in internalOptions)
    if (!internalOptions.colors) internalOptions.stringColors = false // @todo(132): && !('stringColors' in internalOptions) but without the defaults

  if (internalOptions.inspect)
    internalOptions.inspect = _.assign(
      {},
      ...(options.map((o) => {
        if (
          o.inspect !== false &&
          !('colors' in (_.isBoolean(o.inspect) || !o.inspect ? {} : o.inspect)) &&
          ('colors' in o)
        ) {
          setProp(o, 'inspect.colors', o.colors, {
            create: true,
            separator: '.',
          })
        }
        return o.inspect
      }) as any) // @todo: remove need for any
    )

  // _log('blendOptions() return InternalOptions = ', internalOptions)
  return internalOptions
}
