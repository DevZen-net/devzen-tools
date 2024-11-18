module.exports = {
  entryPoints: ['./src/code/index.ts'],
  out: './dist/docs-html',
  sort: ['visibility', 'enum-value-ascending'],
  intentionallyNotExported: ['TYPE_TO_REAL_TYPE_FUNCTIONS'],
  // media: './media'
}
