const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const validateFilename = require('eslint-plugin-validate-filename');
const checkFile = require('eslint-plugin-check-file');

module.exports = [
	{ ignores: ['node_modules/**', 'build/**', 'public/**'] },

	{
		files: ['src/**/*.{ts,tsx,js,jsx}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				ecmaFeatures: { jsx: true },
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			'validate-filename': validateFilename,
			'check-file': checkFile,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					args: 'after-used',
					ignoreRestSiblings: true,
				},
			],
			'validate-filename/naming-rules': [
				'warn',
				{
					rules: [
						{
							case: 'camel',
							target: '**/hooks/**/*.{ts,tsx}',
							patterns: '^use',
							excludes: ['**/*.test.*', '**/index.ts', '**/index.tsx'],
						},
						{
							case: 'kebab',
							target: '**/src/**/*.{ts,tsx}',
						},
					],
				},
			],
			'check-file/folder-naming-convention': [
				'warn',
				{
					'src/**/': 'KEBAB_CASE',
				},
			],
		},
	},
];
