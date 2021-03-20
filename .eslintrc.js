const INDENT_SIZE = 2;
const JS_GLOBALS = {
  __dirname: "readonly",
  console: "readonly",
  module: "readonly",
  process: "readonly",
  require: "readonly",
};
const MAX_LINE_LENGTH = 80;

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },

  plugins: [
    "@typescript-eslint",
    "jsdoc",
    "security",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsdoc/recommended",
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

    // See: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "type-imports",
      disallowTypeAnnotations: false,
    }],

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
  },
  settings: {
    jsdoc: {
      tagNamePreference: {
        "file": "fileoverview",
      },
    },
  },

  overrides: [
    { // packages/cli
      files: [
        "packages/cli/**/*.ts",
      ],
      rules: {
        "security/detect-non-literal-fs-filename": "off",
      },
    },
    { // Script files
      files: [
        "scripts/*.js",
      ],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2015,
      },
      rules: {
        // See: https://eslint.org/docs/rules/
        "no-console": "off",

        // See: https://github.com/nodesecurity/eslint-plugin-security#rules
        "security/detect-child-process": "off",

        // Disable any lingering TypeScript issues
        "@typescript-eslint/no-var-requires": "off",
      },
      globals: Object.assign({}, JS_GLOBALS, {
        console: "readonly",
      }),
    },
    { // Test files
      files: [
        "packages/**/__mocks__/**/*",
        "packages/**/__tests__/**/*",
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
        ".eslintrc.js",
        ".mocharc.js",
        "commitlint.config.js",
      ],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2015,
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
        ".nycrc.yml",
      ],
      extends: [
        "plugin:yml/standard",
      ],
    },
    { // Documentation (Markdown)
      files: [
        "**/*.md",
      ],
      parser: "markdown-eslint-parser",
      extends: [
        "plugin:md/recommended",
      ],
      rules: {
        // https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide#rules
        "md/remark": ["error",{
          plugins: [
            ["lint-blockquote-indentation", INDENT_SIZE],
            ["lint-code-block-style", "fenced"],
            ["lint-definition-case"],
            ["lint-definition-spacing"],
            ["lint-emphasis-marker", "_"],
            ["lint-fenced-code-flag", { allowEmpty: false }],
            ["lint-fenced-code-marker", "`"],
            ["lint-final-definition"],
            ["lint-final-newline"],
            ["lint-first-heading-level"],
            ["lint-hard-break-spaces"],
            ["lint-heading-style", "atx"],
            ["lint-heading-increment"],
            ["lint-link-title-style", "\""],
            ["lint-list-item-indent", "space"],
            ["lint-no-auto-link-without-protocol"],
            ["lint-no-blockquote-without-marker"],
            ["lint-no-consecutive-blank-lines"],
            ["lint-no-duplicate-defined-urls"],
            ["lint-no-duplicate-definitions"],
            ["lint-no-duplicate-headings", false],  // use "-in-section" instead
            ["lint-no-duplicate-headings-in-section"],
            ["lint-no-emphasis-as-heading"],
            ["lint-no-empty-url"],
            ["lint-no-file-name-mixed-case"],
            ["lint-no-file-name-articles"],
            ["lint-no-file-name-irregular-characters"],
            ["lint-no-file-name-consecutive-dashes"],
            ["lint-no-file-name-outer-dashes"],
            ["lint-no-heading-content-indent"],
            ["lint-no-heading-indent"],
            ["lint-no-heading-like-paragraph"],
            ["lint-no-heading-punctuation", ".;!?"],
            ["lint-no-html"],
            ["lint-no-inline-padding"],
            ["lint-no-literal-urls"],
            ["lint-no-multiple-toplevel-headings"],
            ["lint-no-paragraph-content-indent"],
            ["lint-no-reference-like-url"],
            ["lint-no-shortcut-reference-image", false], // Ugly in plaintext
            ["lint-no-shortcut-reference-link", false], // Ugly in plaintext
            ["lint-no-table-indentation"],
            ["lint-maximum-heading-length", 60],
            ["lint-maximum-line-length", false], // rely on "max-len" instead
            ["lint-ordered-list-marker-style", "."],
            ["lint-ordered-list-marker-value", "ordered"],
            ["lint-rule-style", "---"],
            ["lint-no-shell-dollars", false], // OK for single line code lock
            ["lint-strong-marker", "*"],
            ["lint-table-cell-padding"],
            ["lint-table-pipe-alignment"],
            ["lint-table-pipes"],
            ["lint-unordered-list-marker-style", "-"],
          ],
        }],
      },
    },
    { // Documentation Snippets (MarkDown.*)
      files: [
        "**/*.md.ts",
        "**/*.md.js",
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
    // Dependencies
    "node_modules/",

    // Test data
    "testdata/",

    // Generated & temporary
    "_reports/",
    ".temp/",
    "lib/",

    // Generated in packages/core
    "packages/core/languages/",
    "packages/core/manglers/",
    "packages/core/*.d.ts",
    "packages/core/*.js",

    // Don't ignore configuration files
    "!.github/",
    "!.*.js",
    "!.*.yml",
  ],
};
