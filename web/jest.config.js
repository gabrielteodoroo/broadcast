const IGNORE = ['/node_modules/', '/build/'];

/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
	testMatch: ['**/src/**/*.test.ts?(x)'],
	testPathIgnorePatterns: IGNORE,
	moduleNameMapper: {
		'^app/(.*)$': '<rootDir>/src/app/$1',
		'^core/(.*)$': '<rootDir>/src/core/$1',
		'^environment$': '<rootDir>/src/test/environment.stub.ts',
		'^environment.type$': '<rootDir>/src/environment.type.ts',
	},
};
