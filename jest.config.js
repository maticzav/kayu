module.exports = {
  roots: ['<rootDir>/packages/'],
  // Environment
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.tsx?$',
  testPathIgnorePatterns: ['/node_modules/', '/__fixtures__/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Coverage
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/__fixtures__/**',
    '!**/generated/**',
    '!**/dist/**',
    '!**/server/**',
  ],
  verbose: true,
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  // Setup
  globalSetup: './packages/client/scripts/setup.ts',
  // globals: {
  //   'ts-jest': {
  //     tsconfig: 'tsconfig.test.json',
  //   },
  // },
}
