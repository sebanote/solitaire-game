/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: 'domain',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
      transform: { '^.+\\.[tj]s?$': 'ts-jest' },
      testPathIgnorePatterns: ['/node_modules/', '<rootDir>/src/presentation/'],
      collectCoverageFrom: [
        'src/**/*.ts',
        '!src/presentation/**',
        '!**/node_modules/**',
        '!**/*.d.ts'
      ],
      coverageDirectory: '<rootDir>/coverage/domain',
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        }
      }
    },
    {
      displayName: 'presentation',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      rootDir: 'src/presentation',
      testMatch: ['**/__tests__/**/*.test.ts?(x)'],
      transform: { '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './src/presentation/tsconfig.test.json' }] },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/../$1'
      },
      testPathIgnorePatterns: ['/node_modules/'],
      collectCoverageFrom: [
        '**/*.{ts,tsx}',
        '!**/node_modules/**',
        '!**/*.d.ts',
        '!**/.next/**',
      ],
      coverageDirectory: '<rootDir>/../../coverage/presentation',
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        }
      }
    },
    {
      displayName: 'game-generator',
      preset: 'ts-jest',
      testEnvironment: 'node',
      rootDir: 'src/game-generator',
      testMatch: ['**/__tests__/**/*.test.ts?(x)'],
      transform: {
        '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: './tsconfig.json' }]
      },
      moduleFileExtensions: ['ts', 'js'],
      collectCoverageFrom: [
        '**/*.ts',
        '!**/node_modules/**',
        '!**/*.d.ts'
      ],
      coverageDirectory: '<rootDir>/../../coverage/game-generator',
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  ]
};
