import * as fs from 'node:fs'
import * as _ from 'lodash'
import * as upath from 'upath'
import { isNumberString } from 'class-validator'
import * as jsonStringifySafe from 'json-stringify-safe'
import * as c from 'ansi-colors'
import { table as consoleTable, log as consoleLog } from 'node:console' // see https://stackoverflow.com/a/70768410/799502
import { stdout } from 'test-console'
import { InspectOptions } from './inspect'

// DevZen
import { getProp, isRealObject, setProp, type } from '@devzen/zendash'

// local
import { inspect, internalInspect } from './inspect'

import { resolvePathsAndNames } from './resolvePathsAndNames'
import { blendOptions, hashFixMergeCustomiser } from './blendOptions'
import {
  BuiltInOutputsOptions,
  ELogLevel,
  Header,
  LogZenInspectOptions,
  IOutputLogInfo,
  Options,
  OptionsAtConstructor,
  OptionsInternal,
  Output,
  PATHS_OPTIONS_KEY,
  TBuiltInOutputNames,
  TLog1MethodArgsToReturnLastArg,
  TLogPathOptions,
  TPathReplacements,
  Tlog1Method,
  TlogMethod,
  TwillLogMethod,
  defaultOptions,
  logLevelEnumToNumberVal,
  logLevelEnumToStringKey,
  logLevelMethodNames,
} from './types'
import { CallSite, getCallSites } from './getCallSites'
import { countNewLines, fixWindowsRootPath } from './utils/misc'
import { print } from './print'
import { filenameCheckForFileOutputs, validateOptions } from './validateOptions'

import { getTinyLog } from './utils/tiny-log'
// const _log = getTinyLog(false, 'LogZen')

const _isWeb = false
const CWD = fixWindowsRootPath(process.cwd())

const STACK_DEPTH_CALLED_OFFSET_DEBUG_TRACE = 5
const STACK_DEPTH_CALLED_OFFSET_LOG_OTHERS = 3

/* *******************************
 * Built-in outputs
 **********************************/

const getObjectToPrint = (
  // eslint-disable-next-line no-use-before-define
  logZenInstance: LogZen,
  outputOptions: BuiltInOutputsOptions,
  logInfo: IOutputLogInfo,
  argsToPrint: any[]
): string => {
  const isTrace = logInfo.logLevelNum === ELogLevel.trace
  const traceMsg: string = isTrace ? argsToPrint.pop() : ''

  const obj: any = logZenInstance.options().header
    ? {
        header: argsToPrint[0],
        data: argsToPrint.slice(1),
      }
    : { data: argsToPrint }

  if (isTrace) obj.trace = traceMsg

  const logInfoToPrint = outputOptions.logInfo
    ? _.isArray(outputOptions.logInfo)
      ? _.pick(logInfo, outputOptions.logInfo)
      : logInfo
    : outputOptions.logInfo === undefined
      ? logInfo
      : null

  if (logInfoToPrint) obj.logInfo = logInfoToPrint

  return jsonStringifySafe(obj)
}

const stdJSONbuiltInOutput = (
  // eslint-disable-next-line no-use-before-define
  logZenInstance: LogZen,
  outputOptions: any,
  logInfo: IOutputLogInfo,
  out: 'out' | 'err',
  argsToPrint: any[]
): void | boolean =>
  process[`std${out}`].write(
    `${getObjectToPrint(logZenInstance, outputOptions, logInfo, argsToPrint)}\n`
  )

const fileInit = (builtInOutputsOptions: BuiltInOutputsOptions) => {
  filenameCheckForFileOutputs(builtInOutputsOptions) // should not be needed, but just in case

  const dirName = upath.dirname(builtInOutputsOptions.filename)
  if (dirName !== '.') fs.mkdirSync(dirName, { recursive: true })

  try {
    if (builtInOutputsOptions.overwriteFile) fs.unlinkSync(builtInOutputsOptions.filename)
  } catch (err) {}
}

const builtInOutputs: {
  [name: string]: (outputOptions?: BuiltInOutputsOptions) => Output
} = {
  console: () => ({
    ..._.reduce(
      [...logLevelMethodNames, 'out', 'dir'],
      (acc, methodName) => {
        acc[methodName] =
          _.isFunction(console[methodName]) && methodName !== 'trace'
            ? console[methodName]
            : console.log // .bind(console) - is console context needed for chrome? http://stackoverflow.com/questions/8159233/typeerror-illegal-invocation-on-console-log-apply
        return acc
      },
      {}
    ),
  }),
  consoleJSON: (outputOptions: BuiltInOutputsOptions = {}) => ({
    ..._.reduce(
      [...logLevelMethodNames, 'out', 'dir'],
      (acc, methodName) => {
        acc[methodName] = function (...argsToPrint) {
          const logMethod =
            _.isFunction(console[methodName]) && methodName !== 'trace'
              ? console[methodName]
              : console.log

          logMethod(getObjectToPrint(this.instance, outputOptions, this.logInfo, argsToPrint))
        }
        return acc
      },
      {}
    ),
  }),
  consolePOJSO: (outputOptions: BuiltInOutputsOptions = {}) => ({
    ..._.reduce(
      [...logLevelMethodNames, 'out', 'dir'],
      (acc, methodName) => {
        acc[methodName] = function (...argsToPrint) {
          const logMethod =
            _.isFunction(console[methodName]) && methodName !== 'trace'
              ? console[methodName]
              : console.log

          logMethod(getObjectToPrint(this.instance, outputOptions, this.logInfo, argsToPrint))
        }
        return acc
      },
      {}
    ),
  }),
  std: () => ({
    out(...argsToPrint) {
      process.stdout.write(`${argsToPrint.join(' ')}\n`)
    },
    error(...argsToPrint) {
      process.stderr.write(`${argsToPrint.join(' ')}\n`)
    },
  }),
  stdJSON: (outputOptions: BuiltInOutputsOptions = {}) => ({
    out(...argsToPrint) {
      stdJSONbuiltInOutput(this.instance, outputOptions, this.logInfo, 'out', argsToPrint)
    },
    error(...argsToPrint) {
      stdJSONbuiltInOutput(this.instance, outputOptions, this.logInfo, 'err', argsToPrint)
    },
  }),
  file: (outputOptions: BuiltInOutputsOptions = {}) => {
    fileInit(outputOptions)
    return {
      out(...argsToPrint) {
        fs.appendFileSync(outputOptions.filename, `${argsToPrint.join(' ')}\n`)
      },
      error(...argsToPrint) {
        fs.appendFileSync(outputOptions.filename, `${argsToPrint.join(' ')}\n`)
      },
    }
  },
  fileJSON: (outputOptions: BuiltInOutputsOptions = {}) => {
    fileInit(outputOptions)
    return {
      out(...argsToPrint) {
        fs.appendFileSync(
          outputOptions.filename,
          `${getObjectToPrint(this.instance, outputOptions, this.logInfo, argsToPrint)}\n`
        )
      },
      error(...argsToPrint) {
        fs.appendFileSync(
          outputOptions.filename,
          `${getObjectToPrint(this.instance, outputOptions, this.logInfo, argsToPrint)}\n`
        )
      },
    }
  },
}

/* *******************************
 * Misc utils
 **********************************/

const validatePathOptionsValue = (
  value: number | keyof typeof ELogLevel | Options,
  paths: string[] // used for information only!
): Options => {
  if (_.isString(value)) {
    const intValue = _.parseInt(value)
    if (_.isNumber(intValue) && !_.isNaN(intValue)) return { debugLevel: intValue }

    if (ELogLevel[value])
      return { logLevel: logLevelEnumToStringKey(value as keyof typeof ELogLevel) }

    throw new TypeError(`LogZen: validatePathOptionsValue(): wrong string value '${value}' found at path '${paths.join(
      '/'
    )}'.
Use strictly:
 - One of '${_.reject(_.keys(ELogLevel), isNumberString).join("', '")}'.
 - OR a string parsable as integer that will be interpreted as 'debugLevel' (works only at pathOptions).`)
  } else if (_.isNumber(value)) return { debugLevel: value }
  else if (isRealObject(value)) return validateOptions(value)
  else if (_.isUndefined(value)) return {}
  // prettier-ignore
  else throw new TypeError(`LogZen: validatePathOptionsValue(): unknown wrong value "${jsonStringifySafe(value)}" found at path "${paths.join('/')}"`)
}

/**
 * @see [LogZen API Documentation](/#md:13-logzen-api-overview)
 *
 * **Note: Hidden from TypeDocs**: Each of the [logLevels](/enums/ELogLevel.html) (except NONE) corresponds to a method with the same name in lowercase (eg `.warn()` etc), along with `.warn1()` and `.willWarn()`. These methods are also bound to the instance, so you can also call as `const warn = l.warn; warn('foo');`` instead of `l.warn('foo')`.
 *
 * For example
 * ```
 * l.fatal(someVal, someOtherVal, ...)
 * l.fatal1(someVal, someOtherVal, ...)
 * l.willFatal()
 * ...
 * l.info(someVal, someOtherVal, ...)
 * l.info1(someVal, someOtherVal, ...)
 * l.willInfo()
 * ```
 *
 * **All of these are hidden from TypeDocs for brevity.**
 */
export class LogZen {
  protected static _instanceCount: number

  protected static _pathReplacements: TPathReplacements = {}

  protected static _resolvePathsAndNames = resolvePathsAndNames

  protected static _blendOptions = blendOptions

  protected static _logPathOptions = {}

  protected static _optionsVersion = 1

  protected _CWD: string // eg /mnt/projects/myproject

  protected _absolutePath: string // e.g. '/mnt/projects/myproject/node_modules/mylib

  protected _relativePath: string // e.g. node_modules/mylib (assuming above)

  protected _optionsVersion: number

  protected _resolvedName: string // eg ApiZen@/services/entity

  protected _loggerId = -1

  // eslint-disable-next-line no-use-before-define
  protected _realConstructArgs: ConstructorParameters<typeof LogZen> // exactly as passed by User, for debugging only

  protected _instanceOptions: OptionsAtConstructor // calculated to our options structure

  protected _options: OptionsInternal & OptionsAtConstructor

  protected _effectiveOutput: Output

  constructor(loggerName: string, debugLevel?: number)
  constructor(loggerName: string, logLevel?: keyof typeof ELogLevel, debugLevel?: number) // @todo
  constructor(options?: OptionsAtConstructor, debugLevel?: number)
  constructor(
    options?: OptionsAtConstructor,
    logLevel?: keyof typeof ELogLevel,
    debugLevel?: number
  ) // @todo
  /**
   * LogZen constructor
   *
   * @param loggerNameOrOptions
   * @param logLevelOrDebugLevel
   */
  constructor(
    loggerNameOrOptions?: string | OptionsAtConstructor,
    logLevelOrDebugLevel?: keyof typeof ELogLevel | number,
    optionalDebugLevel?: number
  ) {
    LogZen._instanceCount = (LogZen._instanceCount || 0) + 1
    this._loggerId = LogZen._instanceCount
    this._optionsVersion = 0 // force refresh

    this._realConstructArgs = [
      loggerNameOrOptions,
      logLevelOrDebugLevel,
      optionalDebugLevel,
    ] as any // just for debugging

    // constructor overloads validation & extraction
    let isThrow = false
    const log = getTinyLog(false, 'LogZen.constructor()')
    if (isRealObject(loggerNameOrOptions)) {
      log('isRealObject(loggerNameOrOptions)')
      const validOptions = validateOptions(loggerNameOrOptions, OptionsAtConstructor)
      log('validOptions = ', validOptions)
      this._instanceOptions = (
        loggerNameOrOptions._isKid ? _.omit(validOptions, 'kids') : validOptions
      ) as OptionsAtConstructor
    } else {
      if (['string', 'undefined'].includes(type(loggerNameOrOptions))) {
        this._instanceOptions = {}
        if (_.isString(loggerNameOrOptions))
          this._instanceOptions.loggerName = loggerNameOrOptions as string
      } else isThrow = true
    }

    if (logLevelOrDebugLevel) {
      // number? debugLevel
      if (_.isNumber(logLevelOrDebugLevel)) {
        log('// debugLevel number')
        if (optionalDebugLevel) isThrow = true // no more args expected
        this._instanceOptions.debugLevel = logLevelOrDebugLevel
      }

      // string? logLevel
      if (_.isString(logLevelOrDebugLevel)) {
        if (logLevelEnumToStringKey(logLevelOrDebugLevel)) {
          this._instanceOptions.logLevel = logLevelOrDebugLevel
        } else
          throw new Error(
            `LogZen: Wrong constructor params: wrong string '${logLevelOrDebugLevel}' as 2nd string parameter, interpreted as 'logLevel'.
Use strictly:
 - One of '${_.reject(_.keys(ELogLevel), isNumberString).join("', '")}'.
 - OR a an integer that will be interpreted as 'debugLevel'.`
          )

        if (optionalDebugLevel) {
          if (_.isNumber(optionalDebugLevel)) {
            this._instanceOptions.debugLevel = optionalDebugLevel
          } else isThrow = true
        }
      }
    }

    if (isThrow)
      throw new Error(
        `LogZen: Wrong params in constructor(${this._realConstructArgs
          .map((arg) => type(arg))
          .join(',')}), in new LogZen(${this._realConstructArgs // prettier is not happy with this, messes up indentation
          .map((arg) => internalInspect(arg))
          .join(', ')})`
      )

    // We have dealt with all overloads & have this._instanceOptions in place
    this._absolutePath = upath.trimExt(
      this._instanceOptions.overrideAbsolutePath ||
        fixWindowsRootPath(
          getCallSites((this._instanceOptions.stackDepthCreated || 0) + 2)[0].getFileName()
        )
    )

    this._CWD = this._instanceOptions.overrideCWD || CWD
    this._relativePath = upath.relative(this._CWD, this._absolutePath)

    // path replacement shortcuts
    const replacementShortcuts = {
      '[/]': this._absolutePath,
      '[~]': this._relativePath,
      '[@]': upath.basename(this._relativePath), // filename only
    }
    _.each(replacementShortcuts, (replacement, match) => {
      if (this._instanceOptions.loggerName?.includes(match)) {
        this._instanceOptions.loggerName = upath.join(
          this._instanceOptions.loggerName.replace(match, replacement)
        )
      }
    })

    // bind needed because we cant have as props & have method overloading also!
    this.debug = this.debug.bind(this)
    this.debug1 = this.debug1.bind(this)
    this.trace = this.trace.bind(this)
    this.trace1 = this.trace1.bind(this)

    this._refresh()
  }

  protected _refresh = () => {
    const _log = getTinyLog(false, 'LogZen.refreshOptions')

    if (!this._options || this._optionsVersion < LogZen._optionsVersion) {
      _log('refreshing')
      this._optionsVersion = LogZen._optionsVersion

      const resolved = LogZen._resolvePathsAndNames({
        fullPathToResolve: this._absolutePath,
        pathReplacements: LogZen._pathReplacements,
        cwd: this._CWD,
      })
      this._resolvedName = resolved.resolvedName

      const newOptions = LogZen._blendOptions({
        options: [
          defaultOptions, // fallback for missing options
          ...LogZen._collectPathOptions(this._relativePath), // cascading logPath options
          this._parent?._instanceOptions ? _.omit(this._parent._instanceOptions, 'kids') : {},
          this._instanceOptions, // instance options override all others
        ],
      })

      const kidsFromOptionsChanged = !_.isEqual(newOptions.kids, this._options?.kids)

      this._options = validateOptions(newOptions, OptionsInternal)

      this._options.logLevelNumber = logLevelEnumToNumberVal(this._options.logLevel)
      this._options.logLevelString = logLevelEnumToStringKey(this._options.logLevelNumber)

      this._effectiveOutput = this._getOutput()

      // kids managed by Options
      if (!this._instanceOptions._isKid && kidsFromOptionsChanged) {
        this._kidsFromOptions = []
        this._kidFromOptionsCounter = 0

        if (this._options.kids) {
          if (!_.isArray(this._options.kids))
            throw new Error('LogZen: options.kids must be an Options[] array') // @todo: validate Options structure
          _.each(this._options.kids, (kidOptions) => {
            this._addKidFromOptions(kidOptions)
          })
        }
      }
    }
  }

  public options(): Readonly<Options>
  public options(newOptions?: Options): LogZen

  /**
   * Gets current effective options OR updates the options of the instance.
   * - Pass no arguments, get current effective options (of instance, logPath, parents etc) eg `{colors: true, logLevel: 'warn'}`.
   * - Pass new options to update **existing instance options**, causing revaluation of effective options. It returns \`this\`, i.e the  logger instance, so you can do fluently do `l.option({colors: false}).log('Hello boring world')`
   *
   * @see [Accessing & Updating Options](/index.html#md:66-accessing-amp-updating-options)
   *
   * @param newOptions
   *
   * @return newOptions OR LogZen instance
   */
  public options(newOptions?: Options): Readonly<Options> | LogZen {
    if (newOptions) {
      if (isRealObject(newOptions)) {
        this._optionsVersion = 0
        _.mergeWith(
          this._instanceOptions,
          validateOptions(newOptions, OptionsInternal),
          hashFixMergeCustomiser
        )

        // kids are a special case, they overwrite instead of merging
        if (_.has(newOptions, 'kids')) this._instanceOptions.kids = newOptions.kids
        for (const kid of [...this._kids, ...this._kidsFromOptions]) kid._optionsVersion = 0
      } else {
        throw new TypeError(
          `LogZen: Wrong options value passed to \`.options()\` - expecting an \`Options\` object type, received: ${internalInspect(
            newOptions
          )}`
        )
      }
    }

    this._refresh()

    return newOptions ? this : this._options
    // return this._options
  }

  // eslint-disable-next-line no-use-before-define
  protected _kidsFromOptions: LogZen[] = []

  protected _kidFromOptionsCounter = 0

  protected _kidFromOptionsId: number = null

  /**
   * Add a kid instance to this instance, that will become its parent. Used only internally by LogZen, when options contain kids
   *
   * @see [Kid Instances with l.addKid()](/index.html#md:12-kid-instances-with-laddkid)
   *
   * @param kidFromOptionsOptions
   */
  protected _addKidFromOptions(kidFromOptionsOptions?: Options): LogZen {
    if (kidFromOptionsOptions?.kids)
      throw new Error('LogZen: _addKidFromOptions(): kids options cant have kids')

    const kid = new LogZen({
      ...kidFromOptionsOptions,
      overrideAbsolutePath: `${this._absolutePath}.ext`, // .ext fake extension will be upath.trimExt()-ed
      overrideCWD: this._CWD,
      stackDepthCreated: 2,
      stackDepthCalled: 2,
      _isKid: true,
    })
    kid._parent = this
    kid._kidFromOptionsId = ++this._kidFromOptionsCounter

    // force kid's options update
    kid._optionsVersion = 0
    kid._refresh()

    this._kidsFromOptions.push(kid)

    return kid
  }

  // eslint-disable-next-line no-use-before-define
  protected _parent: LogZen

  // eslint-disable-next-line no-use-before-define
  protected _kids: LogZen[] = []

  protected _kidCounter = 0

  protected _kidId = null

  /**
   * Add a kid instance to this instance, that will become its parent
   *
   * @see [Programmatically Managed via l.addKid() & l.removeKid()](/index.html#md:121-programmatically-managed-via-laddkid-amp-lremovekid)
   *
   * @param kidOptions
   *
   * @return the added kid
   */
  public addKid(kidOptions?: Options): LogZen {
    if (kidOptions?.kids) throw new Error('LogZen: addKid(): kids options cant have kids')
    if (this._parent) throw new Error('LogZen: addKid(): kid instances cant have kids')

    const kid = new LogZen({
      ...kidOptions,
      overrideAbsolutePath: `${this._absolutePath}.ext`, // .ext fake extension will be upath.trimExt()-ed
      overrideCWD: this._CWD,
      stackDepthCreated: 1,
      stackDepthCalled: 1,
      _isKid: true,
    })
    kid._parent = this
    kid._kidId = ++this._kidCounter

    // force kid's options update
    kid._optionsVersion = 0
    kid._refresh()

    this._kids.push(kid)

    return kid
  }

  /**
   * Remove a kid instance to this instance, that will become its parent
   *
   * @see [Remove a Kid via l.removeKid()](/index.html#md:1216-remove-a-kid-via-lremovekid)
   *
   * @param kid
   *
   * @return the removed kid
   */
  public removeKid(kid: LogZen): LogZen {
    if (!(kid instanceof LogZen)) throw new Error('LogZen: removeKid !(kid instanceof LogZen')
    kid._parent = null
    kid._kidId = null
    return _.remove(this._kids, kid)[0]
  }

  /**
   * Add a [TLogPathOptions](/types/TLogPathOptions.html) object, where:
   *
   * - Keys are **paths in your project's filesystem** (e.g. `'src/some/module'`). They can be [Replaced Paths](/index.html#md:3---path-replacements) or use shortcuts (see below).
   *
   * - Values are either:
   *
   *   - an object of type [TLogZenOptions](/classes/options.html) eg `{colors: true}`
   *
   *   - OR a number (even parsable string number), interpreted as [`debugLevel`](/index.html#md:5-the-ldebug--ltrace-methods-amp-debuglevel--tracelevel)
   *
   *   - OR a [`logLevel`](/enums/ELogLevel.html) string eg `'warn'`, `'log'` etc
   *
   * For example:
   *
   * ```
   *    {
   *      '/': {colors: false, logLevel: 'warn'}  // obj as is - on root (CWD) of project, siting only before defaultOptions
   *      './some/path': 'info',                  // becomes {logLevel: 'info'}
   *      'some/other/buggy/path': '100',         // becomes {debugLevel: 100}
   *    }
   * ```
   *
   * with all your paths and corresponding options for each path.
   *
   * When calling multiple times, paths are updated (or added) with a custom `_.merge` over existing options.
   * Thus, existing paths are not blindly overwritten, but their contents are merged (i.e. updated).
   *
   * The key in logPathOptions object, is some path in your project **relative to CWD**, for example:
   *
   *  `/`                                  # The root of your project, i.e the CWD
   *
   *  `src/domain/entities`                # a relative path to your CWD
   *
   *       or
   *
   *  `MyLib@/some/path`                   # refer by pathReplacement + extra path
   *
   *      or
   *
   *  `node_modules/lib/dist/some/path`    # useful for foreign libraries
   *
   *      or
   *
   *  `[~]/some/path` which is a special shortcut for "current file I'm calling from". If `[~]` is in your path string, it is replaced with the filepath of the `.js`/`.ts` file you're calling it from (without the .js ext, & adjusted for CWD internally). For example `[~]/some/path` will be replaced with `where/ever/youare/calling/from/some/path`
   *
   * @see [LogPath Options](/index.html#md:63-logpath-options) & [Important static (a.k.a class) methods](/index.html#md:134-important-static-aka-class-methods)
   *
   * @param logPathOptions an object with `{[logPath:string]: Options}`
   *
   * @param stackDepth when calling from a nested file paths, but you want to capture the real file called from, use this to adjust the stack depth. Default is 0, i.e. the file calling LogZen.updateLogPathOptions()
   *
   * @returns LogZen for fluent API
   */
  public static updateLogPathOptions(logPathOptions: TLogPathOptions, stackDepth = 0) {
    LogZen._optionsVersion += 1

    for (let logPath in logPathOptions) {
      const options = logPathOptions[logPath]

      if (logPath.includes('[~]')) {
        const callingAbsoluteFilepath = upath.trimExt(
          fixWindowsRootPath(getCallSites(stackDepth + 2)[0].getFileName())
        )
        logPath = logPath.replace('[~]', upath.relative(CWD, callingAbsoluteFilepath))
      }

      let replacement
      let replacementPath
      if (logPath.includes('@/')) {
        // get valid replacement & replacementPath or throw
        replacement = logPath.slice(0, logPath.match(/@\//).index)
        if (!replacement)
          throw new Error(
            `LogZen.updateLogPathOptions: error extracting replacement in logPath = ${logPath}`
          )
        replacementPath = _.findKey(LogZen._pathReplacements, (v) => v === replacement)
        if (!replacementPath)
          throw new Error(
            `LogZen.updateLogPathOptions: error finding replacementPath for replacement=${internalInspect(
              replacement
            )} for logPath = '${logPath}' inside your LogZen._pathReplacements = ${internalInspect(
              LogZen._pathReplacements
            )}`
          )

        replacement = `${replacement}@`
      } else {
        // maybe whole logPath is a replacement, eg {"MyProject": {...someOptions}} or {"MyProject@": {...someOptions}}
        replacementPath = _.findKey(LogZen._pathReplacements, (v) =>
          [v, `${v}@`].includes(logPath)
        )
        if (replacementPath) replacement = logPath
      }

      // Do we actually replace ?
      if (replacementPath && replacement)
        logPath = logPath.replace(replacement, replacementPath)

      const logPathArray = upath
        .join(logPath)
        .split('/')
        .filter((path) => !!path)

      // We have our final path at logPathArray eg ['source', 'code', 'mylib']
      // First get possible existing value at this path & merge
      const optionsValue = blendOptions({
        options: [
          getProp(LogZen, ['_logPathOptions', ...logPathArray, PATHS_OPTIONS_KEY]) || {},
          validatePathOptionsValue(options, logPath.split('/')),
        ],
        isForLogPathOptions: true,
      })

      setProp(LogZen, ['_logPathOptions', ...logPathArray, PATHS_OPTIONS_KEY], optionsValue, {
        create: true,
      })
    }

    return LogZen // fluent
  }

  /**
   * Add a [TPathReplacements](/types/TPathReplacements.html) object, where:
   *
   *  - keys are **paths in your project's filesystem** (e.g. `'src/some/project'`)
   *
   *  - values are **replacements** (eg `'MyProject'`).
   *
   * For example:
   *
   * ```
   *   {
   *    'src/domain/entities': 'DomainEntities',
   *    'src/domain': 'Domain',
   *    '[~]/../..': 'Source',
   *   }
   * ```
   *
   * See [pathReplacements](/index.html#md:3---path-replacements) for more options & examples
   *
   * @param pathReplacements
   *
   * @param stackDepth
   *
   * @returns LogZen for fluent API
   */
  public static addPathReplacements(pathReplacements: TPathReplacements, stackDepth = 0) {
    _.merge(
      LogZen._pathReplacements,
      _.mapKeys(pathReplacements || {}, (_replacement, path) => {
        if (path.includes('[~]')) {
          const callingRelativeFilepath = upath.relative(
            CWD,
            upath.trimExt(fixWindowsRootPath(getCallSites(stackDepth + 7)[0].getFileName()))
          )
          path = path.replace('[~]', callingRelativeFilepath)
        }
        return upath // Remove the ./ & ending '/'
          .join(path)
          .split('/')
          .filter((item) => !!item)
          .join('/')
      })
    )

    LogZen._optionsVersion += 1 // mark for options refresh

    return LogZen // fluent
  }

  /**
   * Inspect a value, using an extracted util.inspect(), default options and optional inspect options to override default options
   *
   * @param value the value to inspect
   *
   * @param inspectOptions
   *
   * @returns the inspected value as a string
   */
  public static inspect(value: any, inspectOptions: InspectOptions = defaultOptions): string {
    return inspect(value, inspectOptions)
  }

  /**
   * Inspect a value, using an extracted util.inspect(), instance options and optional inspect options to override instance options
   *
   * @param value the value to inspect
   *
   * @param inspectOptions
   *
   * @returns the inspected value as a string
   */
  public inspect(
    value: any,
    inspectOptions: InspectOptions = _.isBoolean(this._options.inspect)
      ? {}
      : this._options.inspect
  ): string {
    return inspect(value, inspectOptions)
  }

  /**
   * Clean the screen, if stdout is a TTY
   *
   * @returns LogZen for fluent API
   */
  public static clearScreen() {
    if (process.stdout.isTTY) process.stdout.write('\u001Bc')

    return LogZen // fluent
  }

  /**
   * For a given path of a runtime log(), for example ['src', 'entities', 'customer'],
   *   it retrieves all Options from `PATHS_OPTIONS_KEY`
   *   starting from deepest kid, up to the top of the hierarchy to the root
   *   (ie ['zendash', 'objects'], then ['zendash'] & ['\']
   *
   *   It reads them from `LogZen._logPathOptions` that holds these static (i.e global LogZen) options.
   *
   *   @param path the path to collect options for. Default is empty array, which means root options
   *
   *   @returns options objects in reverse collected order (root on top, last path at bottom), ready for blending (i.e Object.assign etc ;-)
   */
  protected static _collectPathOptions(path?: string | string[]): OptionsInternal[] {
    if (_.isEmpty(path)) path = []
    if (_.isString(path)) path = path.split('/')

    const levPaths = _.clone(path)
    let levPathValue = getProp(LogZen._logPathOptions, levPaths)
    let lastPath = levPaths.pop() // WHERE IS THE REAL REPEAT/UNTIL CONSTRUCT ?
    const collectedOptions = []
    while (lastPath) {
      if (levPathValue && levPathValue[PATHS_OPTIONS_KEY])
        collectedOptions.push(
          validatePathOptionsValue(levPathValue[PATHS_OPTIONS_KEY], levPaths)
        )

      levPathValue = getProp(LogZen._logPathOptions, levPaths)
      lastPath = levPaths.pop()
    }

    if (levPathValue && levPathValue[PATHS_OPTIONS_KEY])
      collectedOptions.push(validatePathOptionsValue(levPathValue[PATHS_OPTIONS_KEY], levPaths))

    const result = collectedOptions.reverse() // return with highest priority last
    // _log('collectPathOptions(path=', path, ' return collectedOptions:', result)

    return result
  }

  public clearScreen(): LogZen {
    LogZen.clearScreen()

    return this
  }

  protected static _timerStart: number

  protected static _timerAlways: boolean

  /**
   * Start a timer on ALL instances, and next time you print with any l.xxx() log method onany instance, it displays how long it took (in the header).
   *
   * @see [Static LogZen.timer() - a timer for all](/index.html#md:103-static-logzentimer---a-timer-for-all)
   *
   * @param always restart timer automatically when it elapses - see [always restart timer](/index.html#md:102-ltimertrue---always-restart-timer)
   *
   * @returns the timestamp when the timer was started (or null if always=false)
   */
  public static timer(always?: boolean): number {
    const self = this instanceof LogZen ? this : LogZen // so we can subclass LogZen
    self._timerAlways = always

    return (self._timerStart = always === false ? null : Date.now())
  }

  /**
   * @returns the difference since static \`LogZen.timer()\` was started, in milliseconds
   */
  public static timerNow(): number {
    const self = this instanceof LogZen ? this : LogZen // so we can subclass LogZen
    if (!self._timerStart) return null

    return Date.now() - self._timerStart
  }

  /**
   * Stops the current static timer, and returns the difference since static \`LogZen.timer()\` was started, in milliseconds (like \`.timerNow()\`).
   *
   * It restarts the timer if `always` was set to true in `l.timer(true)`
   *
   * @returns the difference since static \`LogZen.timer()\` was started, in milliseconds
   */
  public static timerEnd(): number {
    const self = this instanceof LogZen ? this : LogZen // so we can subclass LogZen
    if (!self._timerStart) return null

    const duration = Date.now() - self._timerStart
    self._timerStart = self._timerAlways ? Date.now() : null

    return duration
  }

  // same implementation for instance
  protected _timerStart: number

  protected _timerAlways: boolean

  /**
   * Start a timer on specific instance, and next time you print `l.xxx()` with any log method on specific instance, it displays how long it took (in the header).
   *
   * @see [l.timer()](/index.html#md:101-instance-ltimer)
   *
   * @param always restart timer automatically when it elapses - see [always restart timer](/index.html#md:102-ltimertrue---always-restart-timer)
   *
   * @returns the timestamp when the timer was started (or null if always=false)
   */
  public timer(always?: boolean) {
    return LogZen.timer.call(this, always)
  }

  /**
   * Returns the difference since \`.timer()\` was started, in milliseconds (like \`.timerNow()\`).
   *
   * @see [l.timer()](/index.html#md:10-timers---no-need-for-datenow---timestamp--)
   *
   * @returns the difference since \`.timer()\` was started, in milliseconds
   */
  public timerNow() {
    return LogZen.timerNow.call(this)
  }

  /**
   * Stops the current instance timer, and returns the difference since \`.timer()\` was started, in milliseconds (like \`.timerNow()\`).
   *
   * It restarts the timer if `always` was set to true in `l.timer(true)`
   *
   * @see [l.timer()](/index.html#md:10-timers---no-need-for-datenow---timestamp--)
   *
   * @returns the difference since \`.timer()\` was started, in milliseconds
   */
  public timerEnd() {
    return LogZen.timerEnd.call(this)
  }

  /**
   * Resets all static logPathOptions & path Replacements to their default (empty) values.
   *
   * Forces recalculation of effective options on all instances (on demand)
   *
   * @return LogZen for fluent API
   */
  public static reset() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    LogZen._logPathOptions = {}
    LogZen._pathReplacements = {}
    LogZen.updateLogPathOptions({}) // force recalc of all

    return LogZen // fluent
  }

  /**
   * Prints using `console.table()` with some enhancements and caveats
   *
   * @see [l.table() = Enhanced console.table()](/index.html#md:135-ltable--enhanced-consoletable)
   *
   * @param argsWithTabularDataAndTableHeaderLast
   *
   * @returns the args passed to console.table(), with the table data & header appended
   */
  public table: TlogMethod = (...argsWithTabularDataAndTableHeaderLast) => {
    this._refresh()

    const lastArg = _.last(argsWithTabularDataAndTableHeaderLast)

    const tableHeader =
      _.isArray(lastArg) && _.every(lastArg, _.isString)
        ? argsWithTabularDataAndTableHeaderLast.pop()
        : undefined

    const tabularData = argsWithTabularDataAndTableHeaderLast.pop()

    const tableOutput = stdout.inspectSync(() => consoleTable(tabularData, tableHeader))[0]
    const tableLogLevel = logLevelEnumToNumberVal(this._options.tableLogLevel)

    const result = this._actualLog('table', tableLogLevel, c.white, [
      ...argsWithTabularDataAndTableHeaderLast,
      `\n${tableOutput}`,
    ])
    result.pop() // remove last item, which is the table itself

    const returnResult = [...result, tabularData]
    if (tableHeader) returnResult.push(tableHeader)

    return returnResult
  }

  /**
   * Prints using `console.table()` with some enhancements and caveats, returning the lastArg (which is also what is passed to console.table())
   *
   * @see [l.table() = Enhanced console.table()](/index.html#md:135-ltable--enhanced-consoletable)
   *
   * @see [Pass Single Arg Without Spread with l.xxx1()](/#md:113-pass-single-arg-without-spread-with-lxxx1)
   *
   * @param argsToPrint the args to print, with the last arg being the one to return
   *
   * @returns lastArg passed (i.e the `tabularData` or `tableHeader`)
   */
  public table1: Tlog1Method = <TLastArg>(
    ...argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ): any => {
    this._refresh()

    return this._actualLogOne(
      'table',
      logLevelEnumToNumberVal(this._options.tableLogLevel),
      argsToPrint
    )
  }

  protected _leveledLogInfo: {
    [logLevel: string]: {
      lastIsLevelCheck: number
      leveledCheckPrevious: number
    }
  } = {}

  /**
   * Gets the output object, either from options.output, or from builtInOutputs if it is a string.
   *
   * @protected
   */
  protected _getOutput(): Output {
    this._refresh()
    const { output } = this._options
    let resultOutput: Output

    if (isRealObject(output)) {
      resultOutput = output as Output // user passed real output
    } else {
      let outputName: string
      let outputOptions: any
      if (_.isString(output)) outputName = output
      else if (_.isArray(output)) {
        outputName = output[0]
        outputOptions = output[1]
      }

      const stdOutputFn = builtInOutputs[outputName]

      if (!stdOutputFn)
        throw new TypeError(
          `LogZen: Error getting options.output = "${output}" from builtInOutputs (no such built-in output). BuiltInOutputs are: ${_.keys(
            builtInOutputs
          )}`
        )

      resultOutput = stdOutputFn(outputOptions)
    }

    // check output is valid
    if (_.isFunction(resultOutput.out) && _.isFunction(resultOutput.error)) return resultOutput
    else
      throw new TypeError(
        `LogZen: Error in output, bad IOutput structure. You need at least 'out' & 'error' methods. Effective options.output = ${internalInspect(
          output
        )}, resultOutput = ${internalInspect(resultOutput)}`
      )
  }

  protected _will(logMethodLevel: ELogLevel): boolean {
    this._refresh()

    const logLevelNumber = _.isUndefined(this._options.logLevelNumber)
      ? ELogLevel.debug // default is debug, implicitly
      : this._options.logLevelNumber

    return logMethodLevel <= logLevelNumber
  }

  /**
   * The actual log method, that all other log methods call.
   *
   * @param logTitle
   * @param logLevel
   * @param color
   * @param argsToLog
   */
  protected _actualLog = (
    logTitle: keyof typeof ELogLevel | 'table' | 'dir',
    logLevel: ELogLevel,
    color: c.StyleFunction,
    argsToLog: any[]
  ): any[] => {
    // const _log = getTinyLog(false, 'LogZen::_actualLog')

    this._refresh()
    const logLevelMethod = _.toLower(ELogLevel[logLevel])
    const { loggerName, trace, colors, output, stackDepthCalled } = this._options
    let { logLevelNumber } = this._options

    let { raw, header, printMode, inspect } = this._options

    // call kids method, but only if it's not leveled (i.e debug /trace)
    if (!['debug', 'trace'].includes(logLevelMethod))
      for (const kidLogZen of [...this._kids, ...this._kidsFromOptions]) {
        kidLogZen._actualLog(logTitle, logLevel, color, argsToLog)
      }

    if (_.isUndefined(logLevelNumber)) logLevelNumber = ELogLevel.debug // default is debug, implicitly
    if (logLevel > logLevelNumber) return argsToLog

    // do we need to enforce options.raw ?
    let outputName: string

    if (!raw) {
      if (_.isString(output)) outputName = output
      else if (_.isArray(output)) outputName = output[0]

      if (_.endsWith(outputName, 'JSON')) raw = true
    }

    // @ts-ignore-next-line
    c.enabled = colors && !_isWeb && !raw

    const logHeader = []

    if ((header = header as Header)) {
      logHeader.push('[')

      if (header.date)
        logHeader.push(
          `${
            _.isFunction(header.date)
              ? header.date()
              : c.bgBlue(new Date().toISOString().slice(0, 10)) // @todo: to locale string
          }|`
        )
      if (header.time)
        logHeader.push(
          `${
            _.isFunction(header.time)
              ? header.time()
              : c.bgMagenta(new Date().toLocaleTimeString('en-GB').slice(0, 8)) // @todo: why en-GB?
          }|`
        )
    }

    // .timer() - instance one takes precedence
    if (this._timerStart) {
      logHeader.push(
        `${c.bold.italic.bgBlackBright(
          _.padStart(
            (Date.now() - this._timerStart).toLocaleString('en-US'), // @todo: why en-US?
            header.timerPadding || 6,
            ' '
          )
        )}|`
      )
      this._timerStart = this._timerAlways ? Date.now() : null
    } else {
      if (LogZen._timerStart) {
        logHeader.push(
          `${c.bold.italic.bgBlueBright(
            _.padEnd(
              (Date.now() - LogZen._timerStart).toLocaleString('en-US'), // @todo: why en-US?
              header.timerPadding || 6,
              ' '
            )
          )}|`
        )
        LogZen._timerStart = LogZen._timerAlways ? Date.now() : null
      }
    }

    let lineNumber
    let resolvedCallName
    if (header) {
      logHeader.push(color(_.toUpper(logTitle))) // 'LOG', 'WARN' etc

      // leveledLog check print as [n]
      if ([ELogLevel.debug, ELogLevel.trace].includes(logLevel)) {
        const logLevelLowCase = _.toLower(ELogLevel[logLevel])
        const lastIsLevelCheck = getProp(this._leveledLogInfo, [
          logLevelLowCase,
          'lastIsLevelCheck',
        ])
        const leveledCheckPrevious = getProp(this._leveledLogInfo, [
          logLevelLowCase,
          'leveledCheckPrevious',
        ])

        logHeader.push(
          color.inverse(
            `:${
              _.isNumber(leveledCheckPrevious)
                ? leveledCheckPrevious
                : _.isNumber(lastIsLevelCheck)
                  ? `!${lastIsLevelCheck}`
                  : '?0'
            }`
          )
        )
      }

      // resolvedFromCall
      let resolvedCallFile: ReturnType<typeof LogZen._resolvePathsAndNames>
      let { resolvedFromCall } = header as Header
      lineNumber = header.lineNumber

      if (lineNumber) resolvedFromCall = true

      if (resolvedFromCall) {
        const callSite = getCallSites(
          stackDepthCalled +
            ([ELogLevel.debug, ELogLevel.trace].includes(logLevel)
              ? STACK_DEPTH_CALLED_OFFSET_DEBUG_TRACE
              : STACK_DEPTH_CALLED_OFFSET_LOG_OTHERS)
        )[0]
        const fullPathToResolve = upath.trimExt(fixWindowsRootPath(callSite.getFileName()))

        if (lineNumber) (lineNumber as any) = callSite.getLineNumber()

        resolvedCallFile = LogZen._resolvePathsAndNames({
          cwd: this._instanceOptions.overrideCWD || CWD,
          fullPathToResolve,
          pathReplacements: LogZen._pathReplacements,
        })
      }

      const useOnlyResolvedName =
        !!resolvedCallFile &&
        (resolvedCallFile.matchedPath === this._resolvedName ||
          resolvedCallFile.resolvedName === this._resolvedName)

      if (loggerName) {
        logHeader.push(`|${color(loggerName)}`)
        if (header.resolvedName) logHeader.push(`|${color.inverse(`${this._resolvedName}`)}`)
      } else logHeader.push(`|${color.inverse(this._resolvedName)}`)

      if (resolvedCallFile && !useOnlyResolvedName) {
        resolvedCallName = resolvedCallFile.resolvedName
        logHeader.push(`|=> ${c.italic(resolvedCallName)}`)
      }

      if (this._kidId) logHeader.push(c.bgYellow(`|#${this._kidId}`))
      if (this._kidFromOptionsId) logHeader.push(c.bgCyanBright(`|#${this._kidFromOptionsId}`))

      logHeader.push(
        `${lineNumber ? `|${c.bold.italic.bgGreen(`L${lineNumber}`)}` : ''}]:${
          header.newLine ? '\n' : ''
        }`
      )

      // strip and preserve new lines in front of first arg
      if (_.isString(argsToLog[0])) {
        const newLinesCount = countNewLines(argsToLog[0])
        if (newLinesCount)
          logHeader[0] = `${_.times(newLinesCount, () => '\n').join('')}${color(logHeader[0])}`
        argsToLog[0] = argsToLog[0].slice(newLinesCount)
      }
    }

    let argsToPrint: any[]
    if (raw) {
      argsToPrint = argsToLog
    } else if (printMode === 'print') {
      // The type 'Output' is 'readonly' and cannot be assigned to the mutable type 'any[]'.
      // @ts-ignore-next-line
      // convert Instances to PoJSo
      const argsToLogTemp = argsToLog.map(
        (item) => {
          if (_.isString(item) && this._options.stringColors) {
            return color(print(item, {...this._options.print, colors: false}, this._options.inspect as LogZenInspectOptions))
          } else
            return print(item, this._options.print, this._options.inspect as LogZenInspectOptions)
        }
      )
      argsToPrint = [stdout.inspectSync(() => consoleLog(...argsToLogTemp))[0].slice(0, -1)] // tap & use console.log's interpolation
    } else {
      // ts should infer LogZenInspectOptions
      argsToPrint = argsToLog.map((arg) => {
        if (_.isString(arg)) {
          if (!(inspect as LogZenInspectOptions).strings)
            return this._options.stringColors ? color(arg) : arg
        }

        if (!colors && _.isNumber(arg)) return arg

        let resultArg = this.inspect(arg)

        if (_.isString(arg)) resultArg = color(resultArg)

        return resultArg
      })
    }

    if (!_.isEmpty(logHeader)) argsToPrint.unshift(logHeader.join(''))

    // do we have trace?
    if (logLevelMethod === 'trace' && !trace?.realTrace) {
      let callSites: CallSite[] = getCallSites(
        stackDepthCalled + STACK_DEPTH_CALLED_OFFSET_DEBUG_TRACE,
        trace.maxStackDepth - 1
      )
      if (trace.omitInternals) {
        const callSitesInternalsIdx = _.findIndex(
          callSites,
          (callSite) =>
            callSite.getTypeName() === 'Module' && callSite.getMethodName() === '_compile'
        )
        if (callSitesInternalsIdx > 0) callSites = callSites.slice(0, callSitesInternalsIdx)
      }
      // add trace as last argsToPrint
      const traceMsg = _.reduce(
        callSites,
        (acc: string, callSite) =>
          acc +
          c.gray(
            `\n    at ${callSite.getFunctionName() ? c.green(callSite.getFunctionName()) : ''}${
              callSite.getTypeName() && callSite.getTypeName() !== 'global'
                ? ` ${callSite.getTypeName()}.${callSite.getMethodName() || '<anonymous>'}`
                : ''
            } (${c.bgBlack.cyan(
              fixWindowsRootPath(callSite.getFileName() || '')
            )}:${c.bold.italic.bgGreen.whiteBright(
              `${callSite.getLineNumber()}`
            )}:${c.bold.italic.bgBlue.whiteBright(`${callSite.getColumnNumber()}`)})`
          ),
        ''
      )
      argsToPrint.push(traceMsg)
    }

    // where do we print?
    const stdPrint =
      this._effectiveOutput[logTitle.toLowerCase()] ||
      this._effectiveOutput[
        ['fatal', 'critical', 'error'].includes(logTitle.toLowerCase()) ? 'error' : 'out'
      ]

    // print on output
    const logInfo: IOutputLogInfo = ['console', 'std'].includes(output as TBuiltInOutputNames)
      ? null
      : {
          loggerName,
          logLevelMethod,
          lineNumber,
          resolvedCallName,
          logLevelString: ELogLevel[logLevel],
          logLevelNum: logLevel,
          relativePath: this._relativePath,
          absolutePath: this._absolutePath,
          resolvedName: this._resolvedName,
          date: new Date().toISOString().slice(0, 10),
          time: new Date().toLocaleTimeString().slice(0, 8),
        }

    stdPrint.apply(
      {
        instance: this,
        logInfo,
      },
      argsToPrint
    )

    return argsToLog
  }

  protected _actualLogOne<TLastArg>(
    logMethodName: keyof typeof ELogLevel | 'table' | 'dir',
    logLevel: ELogLevel,
    argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ): TLastArg {
    const logMethod = _.toLower(logMethodName)

    const result = this[logMethod](...argsToPrint)

    if (!_.isArray(result)) {
      // && _.isBoolean(result)) {
      const leveledLevel = _.last(argsToPrint)
      throw new Error(`
LogZen: Error calling .${logMethod}1(${logMethod}Level = ${leveledLevel}) with just one numeric argument.
This is considered a \`${logMethod}Level\` check, and probably not what you intended, i.e to pass the lastArg.

Use .${logMethod}1(${leveledLevel}, 'someValue') for 'someValue' to be returned for last arg pass-through.`)
    }

    return _.last(result)
  }

  /**
   * The actual log method for leveled log (i.e `debug` & `trace`), that all other log methods call.
   *
   * @param leveledLog
   * @param actualLog
   * @param level
   * @param argsToPrint
   * @protected
   */
  protected _actualLeveledLog(
    leveledLog: ELogLevel.debug | ELogLevel.trace,
    actualLog: TlogMethod,
    level: number | any,
    argsToPrint?: any[]
  ): any[] | boolean {
    this._refresh()

    const logLevelMethod = _.toLower(ELogLevel[leveledLog])

    // call method on all kids
    for (const kidLogZen of [...this._kids, ...this._kidsFromOptions]) {
      kidLogZen[logLevelMethod](level, ...argsToPrint)
    }
    const { logLevelNumber } = this._options

    if (logLevelNumber < leveledLog) return false // @todo: return argsToPrint always!

    if (_.isEmpty(argsToPrint) && _.isNumber(level)) {
      // just level check, stored for next call
      // this._lastIsDebugLevelCheck = level
      setProp(this._leveledLogInfo, [logLevelMethod, 'lastIsLevelCheck'], level, {
        create: true,
      })
      // return level <= (this._options.debugLevel || 0)
      return level <= (this._options[`${logLevelMethod}Level`] || 0)
    }

    if (_.isNumber(level)) {
      // We have a real level check in this call, with argsToPrint following
      // this._thisDebugLevelPrevious = level // did we have a real level check in this call?
      setProp(this._leveledLogInfo, [logLevelMethod, 'leveledCheckPrevious'], level, {
        create: true,
      })
    } else {
      // Call had no level check, just normal printable args. So level is just another argToPpint
      argsToPrint.unshift(level) // argsToPrint[0] now contains 1st message!

      // level = _.isNumber(this._lastIsDebugLevelCheck) ? this._lastIsDebugLevelCheck : 0 // level default is 0, if we dont have a @lastDebugLevelCheck
      // but did we have a level check in previous call?
      const lastLevelCheck = getProp(this._leveledLogInfo, [logLevelMethod, 'lastIsLevelCheck'])
      level = _.isNumber(lastLevelCheck) ? lastLevelCheck : 0 // level default is 0, if we dont have a lastLevelCheck
    }

    if (_.isString(argsToPrint[0])) {
      const newLines = countNewLines(argsToPrint[0])
      argsToPrint[0] = argsToPrint[0].slice(newLines)
      argsToPrint[0] = _.times(newLines, () => '\n').join('') + argsToPrint[0]
    }

    // _log(level, this._options, level <= (this._options.debugLevel || 0))

    if (level <= (this._options[`${logLevelMethod}Level`] || 0))
      actualLog.call(this, ...argsToPrint) // apply & return the printable string

    // clean up if this call had a real level check
    // if (this._thisDebugLevelPrevious) delete this._lastIsDebugLevelCheck
    if (getProp(this._leveledLogInfo, [logLevelMethod, 'leveledCheckPrevious']))
      setProp(this._leveledLogInfo, [logLevelMethod, 'lastIsLevelCheck'], null, {
        create: true,
      })

    // always clean up for each resulted call
    // delete this._thisDebugLevelPrevious
    setProp(this._leveledLogInfo, [logLevelMethod, 'leveledCheckPrevious'], null, {
      create: true,
    })

    return argsToPrint
  }

  /**
   * Expose the whole ansi-colors package as "c", per its convention. Useful to have with you for logging!
   */
  get c() {
    return c
  }
  static get c() {
    return c
  }

  // ############ Log Methods #############

  /** @ignore */
  public fatal: TlogMethod = (...argsToPrint) => {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.fatal),
      ELogLevel.fatal,
      c.bgRed,
      argsToPrint
    )
  }

  /** @ignore */
  public fatal1: Tlog1Method = <TLastArg>(
    ...argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ) => {
    return this._actualLogOne(
      logLevelEnumToStringKey(ELogLevel.fatal),
      ELogLevel.fatal,
      argsToPrint
    )
  }

  /** @ignore */
  public critical: TlogMethod = (...argsToPrint) => {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.critical),
      ELogLevel.critical,
      c.bgRedBright,
      argsToPrint
    )
  }

  /** @ignore */
  public critical1: Tlog1Method = <TLastArg>(
    ...argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ) => {
    return this._actualLogOne(
      logLevelEnumToStringKey(ELogLevel.critical),
      ELogLevel.critical,
      argsToPrint
    )
  }

  /**
   * Prints using `console.dir()` if console output is used, but its not part of logLevel methods
   *
   * It has a fixed `ELogLevel.log` severity.
   *
   * @param argsToPrint
   *
   * @returns the args passed
   */
  public dir: TlogMethod = (...argsToPrint) => {
    return this._actualLog('dir', ELogLevel.log, c.white, argsToPrint)
  }

  /**
   * Prints using `console.dir()` if console output is used, but it's not part of logLevel methods
   *
   * It has a fixed `ELogLevel.log` severity.
   *
   * @param argsToPrint
   *
   * @returns the last arg passed
   */
  public dir1: Tlog1Method = <TLastArg>(
    ...argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ) => {
    return this._actualLogOne('dir', ELogLevel.log, argsToPrint)
  }

  /** @ignore */
  public error: TlogMethod = (...argsToPrint) => {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.error),
      ELogLevel.error,
      c.red,
      argsToPrint
    )
  }

  /** @ignore */
  public error1: Tlog1Method = <TLastArg>(
    ...argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ) => {
    return this._actualLogOne(
      logLevelEnumToStringKey(ELogLevel.error),
      ELogLevel.error,
      argsToPrint
    )
  }

  /** @ignore */
  public warn: TlogMethod = (...argsToPrint) => {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.warn),
      ELogLevel.warn,
      c.yellowBright,
      argsToPrint
    )
  }

  /** @ignore */
  public warn1: Tlog1Method = <TLastArg>(
    ...argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ) => {
    return this._actualLogOne(
      logLevelEnumToStringKey(ELogLevel.warn),
      ELogLevel.warn,
      argsToPrint
    )
  }

  /** @ignore */
  public notice: TlogMethod = (...argsToPrint) => {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.notice),
      ELogLevel.notice,
      c.yellow,
      argsToPrint
    )
  }

  /** @ignore */
  public notice1: Tlog1Method = <TLastArg>(
    ...argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ) => {
    return this._actualLogOne(
      logLevelEnumToStringKey(ELogLevel.notice),
      ELogLevel.notice,
      argsToPrint
    )
  }

  /** @ignore */
  public ok: TlogMethod = (...argsToPrint) => {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.ok),
      ELogLevel.ok,
      c.green,
      argsToPrint
    )
  }

  /** @ignore */
  public ok1: Tlog1Method = <TLastArg>(
    ...argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ) => {
    return this._actualLogOne(logLevelEnumToStringKey(ELogLevel.ok), ELogLevel.ok, argsToPrint)
  }

  /** @ignore */
  public info: TlogMethod = (...argsToPrint: any[]): any[] => {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.info),
      ELogLevel.info,
      c.gray,
      argsToPrint
    )
  }

  /** @ignore */
  public info1: Tlog1Method = <TLastArg>(
    ...argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ) => {
    return this._actualLogOne(
      logLevelEnumToStringKey(ELogLevel.info),
      ELogLevel.info,
      argsToPrint
    )
  }

  /** @ignore */
  public log: TlogMethod = (...argsToPrint: any[]): any[] => {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.log),
      ELogLevel.log,
      c.white,
      argsToPrint
    )
  }

  /** @ignore */
  public log1: Tlog1Method = <TLastArg>(
    ...argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ) => {
    return this._actualLogOne(
      logLevelEnumToStringKey(ELogLevel.log),
      ELogLevel.log,
      argsToPrint
    )
  }

  /** @ignore */
  public verbose: TlogMethod = (...argsToPrint) => {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.verbose),
      ELogLevel.verbose,
      c.cyan,
      argsToPrint
    )
  }

  /** @ignore */
  public verbose1: Tlog1Method = <TLastArg>(
    ...argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ) => {
    return this._actualLogOne(
      logLevelEnumToStringKey(ELogLevel.verbose),
      ELogLevel.verbose,
      argsToPrint
    )
  }

  /** @ignore */
  public silly: TlogMethod = (...argsToPrint) => {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.silly),
      ELogLevel.silly,
      c.blue,
      argsToPrint
    )
  }

  /** @ignore */
  public silly1: Tlog1Method = <TLastArg>(
    ...argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ) => {
    return this._actualLogOne(
      logLevelEnumToStringKey(ELogLevel.silly),
      ELogLevel.silly,
      argsToPrint
    )
  }

  // A vanilla debug, protected as it has no debugLevel checks etc
  // The public `debug()` does all that by calling `_actualLeveledLog()` that then calls `_debugLog()`
  protected _debugLog: TlogMethod = (...argsToPrint) => {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.debug),
      ELogLevel.debug,
      c.magenta,
      argsToPrint
    )
  }

  public debug(debugLevel: number): boolean
  public debug(debugLevel: number, ...argsToPrint: any[]): any[]
  public debug(...argsToPrint: any[]): any[]
  /** @ignore */
  public debug(debugLevel: number | any, ...argsToPrint: any[]): boolean | any[] {
    return this._actualLeveledLog(ELogLevel.debug, this._debugLog, debugLevel, argsToPrint)
  }

  /**
   * @throws LogZenError calling .debug1(debugLevel: number) with just one numeric argument. This is considered a `debugLevel` check, and probably not what you intended, i.e to pass the lastArg. Use .debug1(14, 'someValue') for 'someValue' to be returned for last arg pass-through.
   *
   * @param debugLevelThrowsError - this invocation throws Error!
   */
  // @ts-ignore-next-line  TS2394: This overload signature is not compatible with its implementation signature.
  /* prettier-ignore */ public debug1(debugLevelThrowsError: number): never // @todo: throws Error not working https://stacktuts.com/how-to-declare-a-function-that-throws-an-error-in-typescript
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, a19: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(debugLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, a19: any, a20: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, a19: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public debug1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, a19: any, a20: any, lastArg: TLastArg): TLastArg

  /** @ignore */
  public debug1<TLastArg>(
    debugLevel: number | any,
    ...argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ): TLastArg | never {
    return this._actualLogOne(logLevelEnumToStringKey(ELogLevel.debug), ELogLevel.debug, [
      debugLevel,
      ...argsToPrint,
    ])
  }

  // A vanilla trace, protected as it has no traceLevel checks etc
  // The public `trace()` does all that by calling `_actualLeveledLog()` that then calls `_traceLog()`
  protected _traceLog: TlogMethod = (...argsToPrint) => {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.trace),
      ELogLevel.trace,
      c.bgMagenta,
      argsToPrint
    )
  }

  public trace(traceLevel: number): boolean
  public trace(traceLevel: number, ...argsToPrint: any[]): any[]
  public trace(...argsToPrint: any[]): any[]
  /** @ignore */
  public trace(traceLevel: number | any, ...argsToPrint: any[]): boolean | any[] {
    return this._actualLeveledLog(ELogLevel.trace, this._traceLog, traceLevel, argsToPrint)
  }

  /**
   * @throws LogZenError calling .trace1(traceLevel: number) with just one numeric aument. This is considered a `traceLevel` check, and probably not what you intended, i.e to pass the lastArg. Use .trace1(14, 'someValue') for 'someValue' to be returned for last a pass-through.
   *
   * @param traceLevel
   */
  // @ts-ignore-next-line  TS2394: This overload signature is not compatible with its implementation signature.
  /* prettier-ignore */ public trace1(traceLevelThrowsError: number): never // @todo: throws Error not working https://stacktuts.com/how-to-declare-a-function-that-throws-an-error-in-typescript
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, a19: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(traceLevel: number, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, a19: any, a20: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, a19: any, lastArg: TLastArg): TLastArg
  /* prettier-ignore */ public trace1<TLastArg>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, a11: any, a12: any, a13: any, a14: any, a15: any, a16: any, a17: any, a18: any, a19: any, a20: any, lastArg: TLastArg): TLastArg

  /** @ignore */
  public trace1<TLastArg>(
    traceLevel: number | any,
    ...argsToPrint: TLog1MethodArgsToReturnLastArg<TLastArg>
  ): TLastArg | never {
    return this._actualLogOne(logLevelEnumToStringKey(ELogLevel.trace), ELogLevel.trace, [
      traceLevel,
      ...argsToPrint,
    ])
  }

  /** @ignore */
  public willFatal: TwillLogMethod = () => this._will(ELogLevel.fatal)

  /** @ignore */
  public willCritical: TwillLogMethod = () => this._will(ELogLevel.critical)

  /** @ignore */
  public willError: TwillLogMethod = () => this._will(ELogLevel.error)

  /** @ignore */
  public willWarn: TwillLogMethod = () => this._will(ELogLevel.warn)

  /** @ignore */
  public willNotice: TwillLogMethod = () => this._will(ELogLevel.notice)

  /** @ignore */
  public willOk: TwillLogMethod = () => this._will(ELogLevel.ok)

  /** @ignore */
  public willInfo: TwillLogMethod = () => this._will(ELogLevel.info)

  /** @ignore */
  public willLog: TwillLogMethod = () => this._will(ELogLevel.log)

  /** @ignore */
  public willVerbose: TwillLogMethod = () => this._will(ELogLevel.verbose)

  /** @ignore */
  public willDebug = (debugLevel = 0) => this.debug(debugLevel)

  /** @ignore */
  public willTrace = (traceLevel = 0) => this.trace(traceLevel)

  /** @ignore */
  public willSilly: TwillLogMethod = () => this._will(ELogLevel.silly)

  // for consistency, include extra logMethods, not log-level methods
  /** @ignore */
  public willTable: TwillLogMethod = () => this._will(ELogLevel.log)

  /** @ignore */
  public willDir: TwillLogMethod = () => this._will(ELogLevel.log)
}

LogZen.reset()
