module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['./tsconfig.json'],
		sourceType: 'module',
		extraFileExtensions: ['.json'],
	},
	ignorePatterns: ['.eslintrc.js', '*.js', 'node_modules', 'dist'],
	plugins: ['eslint-plugin-n8n-nodes-base'],
	extends: ['plugin:n8n-nodes-base/community'],
	rules: {
		'n8n-nodes-base/node-param-description-wrong-for-dynamic-options': 'off',
		'n8n-nodes-base/node-param-description-weak': 'off',
	},
};
