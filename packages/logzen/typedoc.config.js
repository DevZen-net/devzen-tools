// NOTE: ignore the ~75 warnings `[warning] The relative path ...` for now, no better/quicker way!

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
    'TprintTransformFunction',
    'TLog1MethodArgsToReturnLastArg'
  ],
  plugin: ['@mxssfd/typedoc-theme'],
  theme: 'my-theme',
  excludePrivate: true,
  categorizeByGroup: true,
  // categoryOrder
  groupOrder: ['Functions', 'Type Aliases', 'Variables', '*'],
};

module.exports = config;
