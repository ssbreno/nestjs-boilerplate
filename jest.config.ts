module.exports = {
  testEnvironment: 'jest-environment-node',
  verbose: true,
  rootDir: '.',
  testMatch: ['<rootDir>/__tests__/**/*.spec.ts'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(t|j)s',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/**/*.dto.ts',
    '!<rootDir>/src/**/*.mock.ts',
    '!<rootDir>/src/main.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'html', 'cobertura', 'json-summary'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/reports',
        outputName: 'junit.xml',
        classNameTemplate: '{filepath}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  moduleNameMapper: {
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@factories/(.*)$': '<rootDir>/__tests__/factories/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@app/(.*)$': '<rootDir>/src/application/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infraestructure/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
}
