module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/src/test/$1' // Adjusted to match your tsconfig paths
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src/test'], // Corrected this line
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'], // Match your test files
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
};