module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json', // ['tsconfig*.json'], // see https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/linting/MONOREPO.md
    sourceType: 'module',
  },
  ignorePatterns: [
    'node_modules',
    'dist',
    'build',
    'DRAFT',
    'migrate_data/',
    'coverage',
    'config',
    'jest.config.js',
    'jest.setupFilesAfterEnv.js',
    '.eslintrc.js',
    '*.js',
    'global.d.ts'
  ],
  plugins: [
    '@typescript-eslint',
    'eslint-comments',
    'jest',
    'promise',
    'unicorn',
    'import',
    'eslint-plugin-tsdoc',
  ],
  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier',
  ],
  env: {
    node: true,
    browser: true,
    jest: true,
    es6: true,
  },
  rules: {
    'unicorn/prefer-at': ['off'],
    'unicorn/catch-error-name': ['off'],
    'unicorn/prefer-optional-catch-binding': ['off'],
    'unicorn/no-array-for-each': ['off'],
    'unicorn/better-regex': ['warn'],
    'unicorn/no-this-assignment': ['off'], // we have @typescript-eslint/no-this-alias
    'unicorn/no-console-spaces': ['off'],
    'unicorn/prefer-top-level-await': ['warn'],
    'unicorn/prefer-ternary': ['warn'],
    'unicorn/no-useless-undefined': ['off'],
    'unicorn/prefer-number-properties': ['off'],
    'jest/no-conditional-expect': ['warn'],
    'no-prototype-builtins': ['off'],
    'import/prefer-default-export': ['off'],
    'import/no-default-export': ['error'],
    'react/destructuring-assignment': ['off'],
    'react/jsx-filename-extension': ['off'],
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
      },
    ],
    'unicorn/prevent-abbreviations': ['off'],
    '@typescript-eslint/dot-notation': ['off'],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/naming-convention': [
      'warn',
      { selector: 'variableLike', format: ['camelCase'], leadingUnderscore: 'allow' },
      { selector: 'variable', format: ['camelCase', 'UPPER_CASE'], leadingUnderscore: 'allow' },
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
      {
        selector: 'class',
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/lines-between-class-members': ['warn'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-unused-expressions': ['off'],
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        // we have no-use-before-define, except typedefs
        functions: false,
        classes: false,
        variables: false,
        typedefs: true,
      },
    ],
    '@typescript-eslint/indent': ['off'],
    '@typescript-eslint/member-delimiter-style': [
      'off',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/no-param-reassign': ['off'],
    '@typescript-eslint/no-this-alias': ['error'],
    '@typescript-eslint/no-var-requires': ['warn'],
    'unicorn/prefer-module': ['warn'],
    '@typescript-eslint/quotes': ['off'],
    '@typescript-eslint/semi': ['off', null],
    '@typescript-eslint/space-within-parens': ['off', 'never'],
    '@typescript-eslint/type-annotation-spacing': ['off'],
    '@typescript-eslint/ban-ts-comment': ['off'],
    '@typescript-eslint/no-require-imports': ['warn'],
    '@typescript-eslint/no-inferrable-types': ['warn'],
    'arrow-parens': ['off', 'as-needed'],
    camelcase: ['off'],
    'comma-dangle': ['off'],
    curly: ['off', 'multi-line'],
    'eol-last': ['off'],
    eqeqeq: ['error', 'smart'],
    'id-blacklist': ['off'],
    'id-match': ['off'],
    'linebreak-style': ['off'],
    'max-len': ['off'],
    'new-parens': ['off'],
    'newline-per-chained-call': ['off'],
    'no-duplicate-imports': ['error'],
    'no-eval': ['error'],
    'no-extra-semi': ['off'],
    'no-irregular-whitespace': ['off'],
    'no-multiple-empty-lines': ['off'],
    'no-new-wrappers': ['error'],
    'no-trailing-spaces': ['off'],
    'no-var': ['error'],
    'object-shorthand': ['error'],
    'one-var': ['error', 'never'],
    'prefer-const': ['error'],
    'prefer-template': ['warn'],
    'quote-props': ['off'],
    radix: ['error'],
    'space-before-function-paren': ['off'],
    'spaced-comment': ['error'],
    'class-methods-use-this': ['warn'],
    'global-require': ['warn'],
    'import/no-cycle': ['error'],
    'import/no-unresolved': ['warn'],
    'jest/no-export': ['error'],
    'jest/no-alias-methods': ['warn'],
    'max-classes-per-file': ['off'],
    'no-await-in-loop': ['off'],
    'no-param-reassign': ['off'],
    'no-plusplus': ['off'],
    'no-restricted-syntax': ['warn'],
    'no-useless-catch': ['warn'],
    'unicorn/filename-case': ['off'],
    'unicorn/consistent-function-scoping': ['warn'],
    'unicorn/no-array-reduce': ['off'],
    'unicorn/no-array-callback-reference': ['off'],
    'unicorn/no-await-expression-member': ['off'],
    'unicorn/prefer-native-coercion-functions': ['warn'],
    'unicorn/prefer-node-protocol': ['warn'],
    'jest/expect-expect': ['warn'],
    'jest/no-identical-title': ['warn'],
    'jest/no-standalone-expect': ['warn'],
    'no-new': ['off'],
    'no-return-assign': ['warn'],
    'import/no-extraneous-dependencies': [
      'warn',
      {
        devDependencies: [
          '**/*.test.{js,ts}',
          '**/*.e2e-test.{js,ts}',
          '**/*.spec.{js,ts}',
          '**/*.e2e-spec.{js,ts}',
          '**/karma.conf.{js,ts}',
          '**/protractor.conf.{js,ts}',
          '**/__tests__/**/*.{js,ts}',
        ],
        packageDir: ['./', '../../'],
      },
    ],
    '@typescript-eslint/ban-ts-ignore': ['off'],
    'tsdoc/syntax': ['off'],
    'unicorn/no-abusive-eslint-disable': ['off'],
    'eslint-comments/disable-enable-pair': ['off'],
    'eslint-comments/no-unlimited-disable': ['off'],
    'jest/no-focused-tests': ['off'],
    'unicorn/no-null': ['off'],
  },
}

