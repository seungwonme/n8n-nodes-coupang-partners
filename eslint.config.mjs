import tsParser from '@typescript-eslint/parser';
import n8nNodesBase from 'eslint-plugin-n8n-nodes-base';

export default [
	{
		ignores: ['dist/**', 'node_modules/**', '*.js'],
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
				sourceType: 'module',
			},
		},
		plugins: {
			'n8n-nodes-base': n8nNodesBase,
		},
		rules: {
			...n8nNodesBase.configs.community.rules,
			'n8n-nodes-base/node-param-description-wrong-for-dynamic-options': 'off',
			'n8n-nodes-base/node-param-description-weak': 'off',
		},
	},
];
