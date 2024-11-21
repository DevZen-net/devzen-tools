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
  intentionallyNotExported: [
    'TprintTransformFunction',
    'TLog1MethodArgsToReturnLastArg'
  ]
};

module.exports = config;
