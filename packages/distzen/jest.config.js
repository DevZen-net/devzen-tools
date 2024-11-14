const ignorePatterns = ['<rootDir>/node_modules/', '<rootDir>/DRAFT', '<rootDir>/dist']
module.exports = {
  roots: ['<rootDir>/src'],
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
  testRegex: '(/src/.*\\.(test|spec))\\.(t|j)sx?$',
  coveragePathIgnorePatterns: ignorePatterns,
  testPathIgnorePatterns: ignorePatterns,
  transformIgnorePatterns: ignorePatterns,
  watchPathIgnorePatterns: ignorePatterns,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
  // reporters: [['jest-md-reporter', { color: false }]],
  reporters: [['jest-standard-reporter', { color: true }]],
  setupFilesAfterEnv: ['jest-extended/all', './jest.setupFilesAfterEnv.js'],
}
