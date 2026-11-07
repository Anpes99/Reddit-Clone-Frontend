import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import eslintReact from "@eslint-react/eslint-plugin";

export default [
  {
    ignores: ["build/", "coverage/"],
  },
  js.configs.recommended,
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrors: "none",
          ignoreRestSiblings: true,
        },
      ],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "smart"],
      "no-return-await": "error",
      "require-atomic-updates": "off",
    },
  },

  // App source: browser + JSX
  {
    ...eslintReact.configs.recommended,
    files: ["src/**/*.js"],
  },
  {
    ...reactHooks.configs.flat["recommended-latest"],
    files: ["src/**/*.js"],
  },
  {
    files: ["src/**/*.js"],
    rules: {
      // Already covered by the official react-hooks plugin above
      "@eslint-react/error-boundaries": "off",
      "@eslint-react/exhaustive-deps": "off",
      "@eslint-react/purity": "off",
      "@eslint-react/rules-of-hooks": "off",
      "@eslint-react/set-state-in-effect": "off",
      "@eslint-react/set-state-in-render": "off",
      "@eslint-react/static-components": "off",
      "@eslint-react/no-nested-component-definitions": "off",
      "@eslint-react/unsupported-syntax": "off",
      "@eslint-react/use-memo": "off",
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: globals.browser,
    },
  },

  // Tests and mocks
  {
    files: [
      "src/**/*.test.js",
      "src/**/__mocks__/**/*.js",
      "src/setupTests.js",
      "src/test/**/*.js",
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.jest, ...globals.node },
    },
  },

  // Root tooling config (Node)
  {
    files: ["*.js", "*.mjs"],
    ignores: ["vite.config.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.jest },
    },
  },
  {
    files: ["vite.config.js", "eslint.config.mjs"],
    languageOptions: {
      sourceType: "module",
      globals: globals.node,
    },
  },
];
