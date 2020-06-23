module.exports = {
    env: {
        es2020: true,
        node: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 11,
        sourceType: 'module'
    },
    rules: {
			'quotes': ['error', 'single', { allowTemplateLiterals: true }],
			'no-unreachable': 'error', 
			'block-scoped-var': 'error', 
			'dot-notation': 'error', 
			'eqeqeq': 'error'
    }
}
