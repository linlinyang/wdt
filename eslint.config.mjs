import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import stylistic from '@stylistic/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [{
  files: ["packages/**/*.{js,mjs,cjs,ts,vue}"],
}, {
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.vitest,
      ...globals.node
    }
  }
},
pluginJs.configs.recommended,
...tseslint.configs.recommended,
...pluginVue.configs["flat/essential"], {
  files: ["**/*.vue"],
  languageOptions: {
    parserOptions: {
      parser: tseslint.parser
    }
  }
}, {
  files: ['**/*.js', '**/*.ts'],
  plugins: {
    '@stylistic': stylistic
  },
  rules: {
    'no-empty-pattern': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@stylistic/indent': ['error', 2],
    '@stylistic/semi': ["error", "always"]
  }
}, {
  files: ['**/*.vue'],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  }
}, {
  ignores: ['docs/**', 'dist/**']
}];
