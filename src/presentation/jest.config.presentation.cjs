/* eslint-env node */
/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
  },
  testMatch: [
    '**/__tests__/**/*.test.ts?(x)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  rootDir: '.',
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/__tests__/unit/__mocks__/"
  ]
};

module.exports = config;