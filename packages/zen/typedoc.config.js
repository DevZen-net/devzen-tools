/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  entryPoints: ['./src/code/index.ts'],
  out: './dist/docs-html',
  sort: ['visibility', 'enum-value-ascending'],
  // media: './src/docs/media', // removed in 0.26.0 https://typedoc.org/guides/changelog/
  searchInComments: true,
  searchInDocuments: true,
  cleanOutputDir: false,
  validation: {
    // @todo: NOT WORKING for `[warning] The relative path ./xxx/yyy is not a file and will not be copied to the output directory`
    //        HENCE we patch it, not ideal (but its only for dev)!
    invalidLink: false,
  },
  intentionallyNotExported: [
    // all these are internal ;-)
    'KeysOrValues',
    'LoopKeysOrValues',
    'RealTypeExcludedTypeNames',
    'PropsOfKnownPrototype_stringNonEnumerablesInherited',
    'PropsOfKnownPrototype_symbolNonEnumerablesInherited',
    'PropsOfKnownPrototype_stringNonEnumerablesOwn',
    'PropsOfKnownPrototype_symbolNonEnumerablesOwn',
    'PropsValuesOfKnownPrototype_stringNonEnumerablesInherited',
    'PropsValuesOfKnownPrototype_symbolNonEnumerablesInherited',
    'PropsValuesOfKnownPrototype_stringNonEnumerablesOwn',
    'PropsValuesOfKnownPrototype_symbolNonEnumerablesOwn',
    'ChangeType',
    'GetEachReturn',
    'GetMapReturn',
    'GetLoopGenerator',
    'ProjectValues',
    'ProjectKeys',
    'MapOptionsOverride',
  ],
  plugin: ['@mxssfd/typedoc-theme'],
  theme: 'my-theme',
}

module.exports = config
