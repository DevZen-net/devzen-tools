const ignorePatterns = [
  '<rootDir>/node_modules/',
  '<rootDir>/DRAFT',
  // '<rootDir>/dist',
  '<rootDir>/src/docs/generated',
  '<rootDir>/src/docs/temp',
];

module.exports = {
  roots: [
    '<rootDir>/src',
    // '<rootDir>/dist',
  ],
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/(src|dist)/.*\\.(test|spec))\\.(t|j)sx?$',
  coveragePathIgnorePatterns: [
    ...ignorePatterns,
    '<rootDir>/src/code/tiny-log',
    '<rootDir>/src/docs',
    '<rootDir>/src/__tests__',
  ],
  testPathIgnorePatterns: ignorePatterns,
  transformIgnorePatterns: ignorePatterns,
  watchPathIgnorePatterns: ignorePatterns,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts', '!src/tiny-log.ts', '!src/docs/**/*'],
  // reporters: [['jest-md-reporter', { color: false }]],
  reporters: [['jest-standard-reporter', { color: true }]],
  setupFilesAfterEnv: ['jest-extended/all', './jest.setupFilesAfterEnv.js'],
  verbose: true,
  // silent: true
};
