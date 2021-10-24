"use strict";

const values = require("./.values.cjs");

const {
  dependenciesDir,
  githubDir,
  packagesDir,
  reportsDir,
  scriptsDir,
  tempDir,
  testDataDir,
  testDirs,
} = values;

const INDENT_SIZE = 2;
const JS_GLOBALS = {
  console: "readonly",
  module: "readonly",
  process: "readonly",
  require: "readonly",
};
const MAX_LINE_LENGTH = 80;

module.exports = {
  root: true,

  plugins: [
    "jsdoc",
    "security",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsdoc/recommended",
    "plugin:markdown/recommended",
    "plugin:security/recommended",
  ],
  rules: {
    // See: https://eslint.org/docs/rules/
    "array-bracket-spacing": ["error", "never"],
    "arrow-parens": ["error", "always"],
    "camelcase": ["error", {
      properties: "never",
      ignoreDestructuring: true,
      ignoreImports: true,
    }],
    "comma-dangle": ["error", {
      arrays: "always-multiline",
      objects: "always-multiline",
      imports: "always-multiline",
      exports: "always-multiline",
      functions: "always-multiline",
    }],
    "function-paren-newline": ["error", "multiline-arguments"],
    "max-len": ["error", {
      code: MAX_LINE_LENGTH,
      comments: MAX_LINE_LENGTH,
      tabWidth: INDENT_SIZE,
      ignoreComments: false,
      ignoreUrls: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: false,
      ignoreTrailingComments: true,
    }],
    "newline-per-chained-call": ["error"],
    "no-console": ["warn"],
    "no-shadow": ["error", {
      "builtinGlobals": false,
      "hoist": "all",
      "allow": [],
    }],
    "object-curly-spacing": ["error", "always"],
    "quotes": ["error", "double", {
      avoidEscape: false,
      allowTemplateLiterals: false,
    }],
    "semi": ["error", "always"],
    "space-before-function-paren": ["error", "never"],
    "space-in-parens": ["error", "never"],

    // See: https://github.com/gajus/eslint-plugin-jsdoc#configuration
    "jsdoc/require-param-type": "off", // Redundant in TypeScript
    "jsdoc/require-returns-type": "off", // Redundant in TypeScript
    "jsdoc/newline-after-description": "error",
    "jsdoc/match-description": ["error", {
      matchDescription: "^([A-Z]|[`\\d_])[\\s\\S]*\\.$",
      tags: {
        param: true,
        returns: "^[A-Z`].*\\.$",
        since: "^v[0-9]\\.[0-9]\\.[0-9]",
      },
    }],

    // See: https://github.com/nodesecurity/eslint-plugin-security#rules
    "security/detect-object-injection": "off", // Too many false positives
    "security/detect-non-literal-regexp": "off", // Risk tolerated, DOS out-of-scope
    "security/detect-unsafe-regex": "off", // Rely on CodeQL instead
  },
  settings: {
    jsdoc: {
      tagNamePreference: {
        "file": "fileoverview",
      },
    },
  },

  overrides: [
    { // Typescript files
      files: [
        "**/*.ts",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      plugins: [
        "@typescript-eslint",
      ],
      extends: [
        "plugin:@typescript-eslint/recommended",
      ],
      rules: {
        // See: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
        "@typescript-eslint/consistent-type-imports": ["error", {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        }],
        "@typescript-eslint/no-unused-vars": "error",
      },
    },
    { // packages/cli
      files: [
        `${packagesDir}/cli/**/*.ts`,
      ],
      rules: {
        "security/detect-non-literal-fs-filename": "off",
      },
    },
    { // Script files
      files: [
        `${scriptsDir}/**/*.js`,
      ],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2020,
      },
      rules: {
        // See: https://github.com/gajus/eslint-plugin-jsdoc#configuration
        "jsdoc/require-jsdoc": "off",

        // See: https://github.com/nodesecurity/eslint-plugin-security#rules
        "security/detect-child-process": "off",
        "security/detect-non-literal-fs-filename": "off",

        // Disable any lingering TypeScript issues
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
      globals: JS_GLOBALS,
    },
    { // Test files
      files: [
        `${packagesDir}/**/${testDirs}/**/*`,
      ],
      plugins: [
        "mocha",
        "chai-expect",
      ],
      extends: [
        "plugin:mocha/recommended",
        "plugin:chai-expect/recommended",
      ],
      rules: {
        // See: https://github.com/lo1tuma/eslint-plugin-mocha/tree/master/docs/rules#readme
        "mocha/no-exclusive-tests": ["error"],
        "mocha/valid-suite-description": ["error", "^[A-Z:]"],
        "mocha/valid-test-description": ["error", "^[a-z0-9]"],

        // Disabled because tests are dynamically generated. See: https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/docs/rules/no-setup-in-describe.md
        "mocha/no-setup-in-describe": "off",

        // See: https://github.com/nodesecurity/eslint-plugin-security#rules
        "security/detect-non-literal-fs-filename": "off",
      },
    },
    { // Configuration files (JS)
      files: [
        ".eslintrc.cjs",
        ".mocharc.cjs",
        ".values.cjs",
        "commitlint.config.cjs",
        "nyc.config.cjs",
        "stryker.config.cjs",
      ],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2015,
      },
      rules: {
        // Disable any lingering TypeScript issues
        "@typescript-eslint/no-var-requires": "off",
      },
      globals: JS_GLOBALS,
    },
    { // Configuration files (JSON)
      files: [
        ".github/renovate.json",
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "tsconfig.build.json",
      ],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2015,
      },
      extends: [
        "plugin:json/recommended",
      ],
    },
    { // Configuration files (YAML)
      files: [
        ".github/**/*.yml",
      ],
      extends: [
        "plugin:yml/standard",
      ],
    },
    { // Documentation Snippets (MarkDown.*)
      files: [
        "**/*.md/*.js",
        "**/*.md/*.ts",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        // Remove the project as snippets are not part of any project
        project: null,
      },
      globals: JS_GLOBALS,
      rules: {
        // See: https://eslint.org/docs/rules/
        "no-console": "off",

        // See: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],

  ignorePatterns: [
    `${dependenciesDir}/`,
    `${testDataDir}/`,

    // Generated & temporary
    `${reportsDir}/`,
    `${tempDir}/`,
    "build/",
    "lib/",

    // Don't ignore configuration files
    `!${githubDir}/`,
    "!.*.js",
  ],
};
