'use strict';

module.exports = {
  testEnvironment: 'node',
  forceExit: true,
  testMatch: [
    '<rootDir>/test/**/*.test.+(js|ts)',
    '<rootDir>/packages/types/src/test/**/*.test.ts',
    '**/__tests__/**/*.+(spec|test).+(ts)',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.(js|ts)',
    '!**/*.json',
  ],
  coveragePathIgnorePatterns: [
    'packages/types/dist/*',
    'packages/types/node_modules/*',
    'packages/types/src/route.ts',
    '/node_modules/',
  ],
  coverageDirectory: 'coverage/jest',
  coverageReporters: ['json'],
  modulePaths: ['<rootDir>/src/'],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
