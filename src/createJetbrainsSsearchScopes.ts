const packages = [
  // @todo (2 3 1): read from packages/
  'distzen',
  'logzen',
  'zendash',
]

const exclusions = `!file[*]:**.cache//*&amp;&amp;!file[*]:**.eslintcache//*&amp;&amp;!file[*]:**.grunt//*&amp;&amp;!file[*]:**.idea//*&amp;&amp;!file[*]:**.lock-wscript//*&amp;&amp;!file[*]:**.next//*&amp;&amp;!file[*]:**.node_repl_history//*&amp;&amp;!file[*]:**.npm//*&amp;&amp;!file[*]:**.nuxt//*&amp;&amp;!file[*]:**.nyc_output//*&amp;&amp;!file[*]:**.serverless//*&amp;&amp;!file[*]:**.vuepress/dist//*&amp;&amp;!file[*]:**.yarn-integrity//*&amp;&amp;!file[*]:*DRAFT//*&amp;&amp;!file[*]:*bower_components//*&amp;&amp;!file[*]:*build//*&amp;&amp;!file[*]:*coverage//*&amp;&amp;!file[*]:*dist//*&amp;&amp;!file[*]:*jspm_packages//*&amp;&amp;!file[*]:*lib-cov//*&amp;&amp;!file[*]:*logs//*&amp;&amp;!file[*]:*node_modules//*&amp;&amp;!file[*]:*pids//*&amp;&amp;!file[*]:*typings//*&amp;&amp;!file[*]:**.log&amp;&amp;!file[*]:**.pid&amp;&amp;!file[*]:**.pid.lock&amp;&amp;!file[*]:**.seed&amp;&amp;!file[*]:**.tgz&amp;&amp;!file:*npm-debug.log*&amp;&amp;!file:*yarn-debug.log*&amp;&amp;!file:*yarn-error.log*&amp;&amp;!file:*package-lock.json*`

// add inside <component name="NamedScopeManager"> in .idea\workspace.xml
console.log(
  [
    `<scope name="AllPackages" pattern="file[*]:packages/*/*&amp;&amp;${exclusions}" />`,
    ...packages.map(
      (pkg) =>
        `<scope name="${pkg}" pattern="file[*]:packages/${pkg}//*&amp;&amp;${exclusions}" />`
    ),
  ].join('\n\n')
)
