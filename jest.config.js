module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!src/index.ts',
    '!src/adapters/database/connector.ts',
    '!src/adapters/http/server.ts',
  ],
};
