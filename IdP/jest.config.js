// jest.config.js
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testMatch: [
    '<rootDir>/test/**/*.test.js'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/server.{js,ts}',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 10000,
  forceExit: true,
  detectOpenHandles: true,
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true
    }]
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^../src/(.*)\.js$': '<rootDir>/src/$1.ts',
    '^../services/(.*)\.js$': '<rootDir>/src/services/$1.ts',
    '^../utils/(.*)\.js$': '<rootDir>/src/utils/$1.ts',
    '^../infrastructure/(.*)\.js$': '<rootDir>/src/infrastructure/$1.ts'
  }
};