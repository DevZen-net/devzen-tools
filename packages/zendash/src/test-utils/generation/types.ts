import { read } from 'fs-jetpack'
import { get, set } from 'lodash'
import fs from 'node:fs'
import { ELogLevel, LogZenMini } from '../../code/LogZenMini'
import { TextFile } from './TextFile'

/**
 * The `Substitutions` object holds `substitutionLabels` (the keys) against a relative filename that points to the *source file* that contains that text block.
 *
 * For example:
 *
 *    {
 *       mainTests: 'master/mySourceTestTemplate.ts',
 *       additionalTests: 'master/mySourceTestTemplate.ts',
 *       mainCode: 'master/mySourceCodeTemplate.ts',
 *     }
 *
 * Inside the *source/master file*:
 * - the `markerStart` + `substitutionLabel` + `BEGIN or END` `markerEnd` make the *substitution block marker*.
 * - The pair of 2 *substitution block markers* (BEGIN & END), identify the source text block between them, that is going to substitute the placeholder markers of the source input templates, in the final output/generated files.
 *
 * For example, for a substitution named `mainCode`:
 *
 *      // file `master/mySourceCodeTemplate.ts`:
 *      import { Foo } from 'foo'
 *
 *      // some other code here
 *
 *      // {{ mainCode BEGIN }}
 *      console.log('Hello, world!')
 *      // {{ mainCode END }}
 *
 * Inside the **source input template files** (those inside `templatesDir`), a single marker (not a pair) with an extra `@` before `substitutionLabel` is used to identify the insertion point (i.e the placeholder).
 *
 *      // file `someTemplatesDir/templateFile_Accepting_substitutions.ts`:
 *
 *      import { Bar } from 'bar'
 *
 *      // some other code here
 *
 *      // {{ @mainCode }}
 *
 * Will result in a file `outputDir/someTemplatesDir/templateFile_Accepting_substitutions.ts`:
 *
 *     import { Foo } from 'foo'
 *
 *     // some other code here
 *
 *     console.log('Hello, world!')
 *
 * Why is this needed?
 * - When dealing with tests & typings in particular, there's no escaping having to have the same code in multiple places, (with some variation in its config/input), to test statically that typings work. With **Substitutions** the source code is kept in a single place, and the templates are updated automatically ;-)
 * - Dealing with large files is painful, especially if you're on IntelliJ (https://youtrack.jetbrains.com/issue/IJPL-28967)
 * - It's a good way to keep the source code DRY, and the generated code can be as complicated as it needs to be.
 *
 * Notes:
 * - `markerStart` and `markerEnd` can change - the defaults are:
 *  - `/*{` for `markerStart`
 *  - `}*\/` for `markerEnd`
 * - spaces in substitution labels, don't matter, so `{{ mainCode BEGIN }}` is the same as `{{mainCode BEGIN}}`
 * - if the BEGIN & END substitution markers are not found in the source / master file, it will be throw an error.
 * - if the substitution placeholder marker (with an `@`) is not found in the source / input templates, it will be ignored
 */
export interface Substitutions {
  [label: string]: string
}

// Substitute options

export interface ISubstituteOptions {
  // substitution info
  substitutions?: Substitutions
  markerStart?: string
  markerEnd?: string
  /**
   * Add this BEFORE the substitution block
   * @default `// DO NOT EDIT CODE BELOW - AUTO GENERATED - BEGIN`
   */
  bannerStart?: string
  /**
   * Add this AFTER the substitution block
   * @default `// DO NOT EDIT CODE ABOVE - AUTO GENERATED - END`
   */
  bannerEnd?: string

  // directories
  /**
    The working directory for the substitute, relative to the cwd, eg `src/__tests__`
   */
  workDir?: string
  /**
   * The directory containing source templates files, relative to `workDir`, eg `templates`
   */
  templatesDir?: string
  /**
   * The output dir, relative to workDir (eg `.generated`)
   */
  outputDir?: string
  /**
   * A filter function to select the files to be processed
   */
  templatesFilter?: (filename: string, sourceText: string) => boolean

  /**
   * Trims all spaces/new lines etc from the text extracted from the source template file
   */
  trimExtractedText?: boolean

  /**
   * Rename the output file, based on the filename and extension
   *
   * @default is `filenameNoExt + (ext ? '.' + ext : '')`
   *
   * @param filenameNoExt the filename without extension
   * @param ext the extension, without the dot
   */
  renameOutputFile?: (filenameNoExt: string, ext: string) => string
  replaceInOutputFile?: (filename: string, text: string) => string

  // debug etc
  logLevel?: string
  debug?: boolean
  dryRun?: boolean

  // clean & watching
  clean?: boolean | string[]
  // deepClean?: boolean // delete outputDir (only at start)

  /**
   * Watch files and regenerate on changes, with default debounce of 1000ms
   *
   * If number, it's the debounce time in ms
   */
  watch?: boolean | number
}

export interface Substitution {
  extractedText: string
  sourceFile: TextFile
}

export interface SubstitutionsInternal {
  [label: string]: Substitution
}

// @todo(111): convert this scattered thing into a class!
export interface ISubstituteOptionsAndState
  extends Omit<Required<ISubstituteOptions>, 'logLevel' | 'substitutions'> {
  cycles: number
  resolvedWorkDir: string // resolved from cwd + workDir
  resolvedTemplatesDir: string // resolved from cwd + workDir
  resolvedOutputDir: string // resolved from cwd + workDir
  substitutions: SubstitutionsInternal
  l: LogZenMini
}

export const substituteDefaults: Partial<ISubstituteOptionsAndState> = {
  markerStart: '/*{',
  markerEnd: '}*/',
  bannerStart: `// @generated AUTO GENERATED - DO NOT EDIT CODE BELOW - ### BEGIN ###`,
  bannerEnd: `\n// @generated AUTO GENERATED - DO NOT EDIT CODE ABOVE - ### END ###`,
  substitutions: {},
  cycles: 0,
  clean: false,
  templatesDir: './',
  templatesFilter: () => true,
  renameOutputFile: (filenameNoExt, ext) => filenameNoExt + (ext ? '.' + ext : ''),
  workDir: './',
  watch: false,
  trimExtractedText: true,
}
