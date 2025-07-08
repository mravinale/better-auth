// jest.config.js
export default {
  preset: null,
  testEnvironment: 'node',
  transform: {},
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testMatch: [
    '<rootDir>/test/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 10000,
  forceExit: true,
  detectOpenHandles: true,
  globals: {
    jest: true
  }
};