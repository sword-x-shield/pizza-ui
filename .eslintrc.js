module.exports = {
  extends: [
    '@chuhoman/eslint-config-vue',
  ],
  rules: {
    'no-console': 'off',
    'brace-style': ['error', '1tbs'],
    // for script setup marco
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'vue/no-reserved-component-names': 'off',

    '@typescript-eslint/strict-boolean-expressions': 'off',
  },
};
