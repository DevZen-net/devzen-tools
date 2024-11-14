import * as _ from 'lodash'
import { substitute } from './generation'
import { ISubstituteOptions } from './generation/types'

const args = process.argv.slice(2)

substitute({
  watch: args.includes('--watch') || args.includes('-w'),
  workDir: 'src/code/loopzen/__test__/all-typings',
  substitutions: {
    'all-typings-tests-vanilla': 'master/Master-typings-spec.masterTemplate.ts',
    'all-typings-tests-WECP': 'master/Master-typings-spec.masterTemplate.ts',
    'all-typings-tests-options-wrong': 'master/Master-typings-spec.masterTemplate.ts',
    'common-imports-in-tests-templates': 'master/Master-typings-spec.masterTemplate.ts',
    'default-expected-keys-values-iteration': 'master/Master-typings-spec.masterTemplate.ts',
    'expecting-defaults-or-overridden': 'master/Master-typings-spec.masterTemplate.ts',
    'common-own-inherited-enumerable-props': 'master/Master-typings-spec.masterTemplate.ts',
    'primitives-props-values': 'master/primitives-spec.masterTemplate.ts',
  },

  templatesFilter: (filename, sourceText) => {
    const isIncludeList = true // true means INCLUDE only those, false means EXCLUDE only those

    return _[isIncludeList ? 'some' : 'every'](
      [
        '__NONE__', // needed ;-(
        '', // ALL

        '-array-',
        // '-ArrayBuffer-',
        // 'any-unknown',
        // 'TypedArray-Big',
        // 'arguments',
        // '-Set-',
        // '-Map-',
        //
        // Iterators / Generators
        // '-Generator-',
        // '-AsyncGenerator-',
        // '-MapEntries-',
        // '-SetEntries-',
        //
        // '-realObject-class',
        // '-class-instance',
        // 'Boxed-Primitives-Number',
        // 'Boxed-Primitives-Boolean',
        // 'Boxed-Primitives-String',
        // //
        // 'Date',
        // //
        // 'Single-Primitives-bigint',
        // 'Single-Primitives-boolean',
        // 'Single-Primitives-null',
        // 'Single-Primitives-number',
        // 'Single-Primitives-symbol',
        // 'Single-Primitives-undefined',
        // //
        // 'Promise',
        // 'Error',
        // 'RegExp',
        // 'DataView',
        // //
        // 'Single',
        // 'Function-normal',
        // 'Function-arrow',
        // 'Function-async',
        // 'Function',
      ],
      (test) => {
        // prettier-ignore
        const isIncluded = filename.toLowerCase().includes(test.toLowerCase())
        return isIncludeList ? isIncluded : !isIncluded
      }
    )
  },
  renameOutputFile: (filenameNoExt, ext) =>
    `${filenameNoExt.replace('-typings-spec.template', '-generated-typings-long-spec')}.${ext}`,
  replaceInOutputFile: (filename, text) => {
    text = text
      .replace(
        /\/\/\*\* NoOptions BEGIN \*\*\/([\s\S]*?)\/\/\*\* NoOptions END \*\*\//g,
        (match) =>
          match
            .replace(/\, options\)/g, ')')
            .replace(/\, \{ \.\.\.options \}\, \{/g, ', undefined, {')
            .replace(
              '`Expecting: defaults OR overridden`',
              '`"Expecting: defaults OR overridden" with No Options (see generate() replaceInOutputFile)`'
            )
      )
      .replace(
        /\/\/\*\* WrongUnknownOptions BEGIN \*\*\/([\s\S]*?)\/\/\*\* WrongUnknownOptions END \*\*\//g,
        (match) =>
          match
            .replace(
              /\/\/ ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions/g,
              '// @ts-expect-error OK WrongUnknownOptions'
            )
            .replace(
              '`Expecting: defaults OR overridden`',
              '`"Expecting: defaults OR overridden" with WrongUnknownOptions (see generate() replaceInOutputFile)`'
            )
      )

    // ONLY FOR WrongUnknownOptions test @-ts-expect-error OK WrongUnknownOptions

    if (filename.includes('AsyncGenerator'))
      text = text.replace(
        /\/\/\*\* Async BEGIN \*\*\/([\s\S]*?)\/\/\*\* Async END \*\*\//g,
        (match) =>
          match
            .replace(/\/\*\*Async\*\*\/ LoopGenerator/g, 'AsyncLoopGenerator')
            .replace(/\/\*\*await\*\*\//g, 'await')
            .replace(/\/\*\*Promise\*\*\/ Tinput/g, 'Promise<Tinput>')
      )

    return text
  },
  templatesDir: 'templates',
  outputDir: '_generated',
  logLevel: 'log',
  clean: true,
} satisfies ISubstituteOptions)
