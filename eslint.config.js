const chuhoman = require('@chuhoman/eslint-config').default;

module.exports = chuhoman({
  ignores: [
    'scripts/templates/**',
    'node_modules',
    'dist',
    'es',
    'lib',
    'dist',
  ],
}, {
  rules: {
    'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'test' }],
    'no-console': 'off',
    'brace-style': ['error', '1tbs'],
    // for script setup marco
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'vue/no-reserved-component-names': 'off',
    'ts/prefer-function-type': 'off',
  },
});
