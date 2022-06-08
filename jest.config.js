module.exports = {
  preset: 'react-native',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
    },
  },
  setupFiles: ['./jest-setup.js'],
  testEnvironment: 'node',
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverageFrom: ['./src/**/worklets/*.{ts,tsx}', './src/**/helpers/*.{ts,tsx}'],
  coverageReporters: ['cobertura', 'html', 'lcov'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [],
};
