import * as escapeStringRegexp from 'escape-string-regexp'
import * as fs from 'node:fs'
import * as upath from 'upath'
import * as _ from 'lodash'
import { numberEnumToNumberVal } from '../../code'
import { ELogLevel, LogZenMini } from '../../code/LogZenMini'
import { TextFile } from './TextFile'

// local
import { substituteDefaults, ISubstituteOptions, ISubstituteOptionsAndState } from './types'

// paths starting with "driveLetter:\xxx" or Unix home "~" or Unix path "/xxx..."
export const absolutePathRegExp = /^(\w:[/\\].*)|(^[/~]\/?.*)/ // original, before eslint = /^(\w:[\\\/].*)|(^[~\/]\/?.*)/

// get first path item before first slash (eg "dist" from "dist/index.js") or (eg "./dist" from "./dist/index.js")
export const firstPathItem = (pathStr: string): string => {
  const pathItems = pathStr.split('/')
  let firstRealSlashIndex = 0

  while (pathItems[firstRealSlashIndex] === '' || pathItems[firstRealSlashIndex] === '.') {
    firstRealSlashIndex++
  }

  if (firstRealSlashIndex + 1 === pathItems.length)
    throw new Error(
      `Substitute: package.json "main" field must point to a directory, not a file! main: ${pathStr}`
    )

  return pathItems.slice(0, firstRealSlashIndex + 1).join('/')
}

const initLogger = (options: ISubstituteOptions, o: ISubstituteOptionsAndState) => {
  if (options.dryRun) o.debug = true
  o.l = new LogZenMini(
    'Substitute',
    numberEnumToNumberVal(ELogLevel, options.logLevel || 'verbose')
  )

  if (o.debug) {
    if (!o.l.logLevel) o.l.logLevel = ELogLevel.debug
    else {
      if (
        (numberEnumToNumberVal(ELogLevel, options.logLevel || '') || 999) <
        // @ts-ignore-next-line
        numberEnumToNumberVal(ELogLevel, ELogLevel.debug)
      ) {
        o.l.logLevel = ELogLevel.debug
      }
    }
  }

  if (Number(ELogLevel[o.l.logLevel as any]) >= Number(ELogLevel.debug)) o.debug = true
}

export const getFinalConfig = (
  options: ISubstituteOptions = {}
): ISubstituteOptionsAndState => {
  const o: ISubstituteOptionsAndState = _.extend(
    {},
    substituteDefaults,
    _.cloneDeep(options)
  ) as any // use only `o` for options from here on

  initLogger(options, o)

  // this.templateBasePath = upath.resolve(upath.dirname(filePath), this.options.replacement.templateDir)
  // this.outputBasePath = upath.resolve(upath.dirname(filePath), this.options.replacement.outDir)
  // l.log('outputBasePath = ', this.outputBasePath)

  o.resolvedWorkDir = absolutePathRegExp.test(o.workDir || '')
    ? o.workDir
    : upath.joinSafe(process.cwd(), o.workDir)

  o.resolvedOutputDir = absolutePathRegExp.test(o.outputDir || '')
    ? o.outputDir
    : upath.joinSafe(o.resolvedWorkDir, o.outputDir)

  o.resolvedTemplatesDir = absolutePathRegExp.test(o.resolvedTemplatesDir || '')
    ? o.resolvedTemplatesDir
    : upath.joinSafe(o.resolvedWorkDir, o.templatesDir)

  _.each(options.substitutions, (filenameOrText, label) => {
    /**
     * Values starting with:
     * - any string: filename to a normal file
     * - `#`: symbolizes plain text used as source substitution (without the starting symbol), against the label. Filename of memory file will be `___${label}`
     *    NOTE: partially implemented, might be buggy
     */

    let filename = filenameOrText
    let extractedText = ''
    let memoryOnly = false

    if (filenameOrText.startsWith('#')) {
      memoryOnly = true
      extractedText = filenameOrText.slice(1)
      filename = `___${label}`
    }

    o.substitutions[label] = {
      extractedText,
      sourceFile: TextFile.getFile(
        absolutePathRegExp.test(filename || '')
          ? filename
          : upath.joinSafe(o.resolvedWorkDir, filename),
        o,
        memoryOnly
      ),
    }
  })

  o.markerStart = escapeStringRegexp(o.markerStart)
  o.markerEnd = escapeStringRegexp(o.markerEnd)

  // check if resolved paths actually exist and are directories

  if (o.watch) {
    const watch = o.watch
    o.watch = o.watch === true ? 1000 : _.parseInt(`${watch}`)

    if (_.isNaN(o.watch)) throw new Error(`Wrong watch value: ${watch}`)
  }

  o.l.debug('ISubstituteInternalOptions options = ', o)
  return o
}
