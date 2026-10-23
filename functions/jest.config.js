const IGNORE = ['/node_modules/', '/lib/'];

/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
	testMatch: ['**/src/**/*.test.ts'],
	testPathIgnorePatterns: IGNORE,
	moduleNameMapper: {
		'^models/(.*)$': '<rootDir>/src/models/$1',
		'^utils/(.*)$': '<rootDir>/src/utils/$1',
		'^facades/(.*)$': '<rootDir>/src/facades/$1',
		'^functions/(.*)$': '<rootDir>/src/functions/$1',
		'^firebase-firestore$': '<rootDir>/src/firebase-firestore.ts',
		'^environment$': '<rootDir>/src/environment.ts',
	},
};
