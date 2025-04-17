/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
  ],
  roots: ['<rootDir>'],
  maxWorkers: '50%',
  detectOpenHandles: true,
  forceExit: true,
  collectCoverage: false,
  collectCoverageFrom: [
    'src/domain/**/*.ts',
    'src/infrastructure/**/*.ts',
    'src/presentation/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/*.d.ts',
    '!src/presentation/.next'
  ],
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  watchPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    "<rootDir>/src/presentation/"
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  
};