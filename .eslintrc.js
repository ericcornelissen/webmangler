const JS_GLOBALS = {
  __dirname: "readonly",
  module: "readonly",
  process: "readonly",
  require: "readonly",
};

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
      code: 80,
      comments: 80,
      tabWidth: 2,
      ignoreComments: false,
      ignoreUrls: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: false,
      ignoreTrailingComments: true,
    }],
    "newline-per-chained-call": ["error"],
    "no-console": ["warn"],
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
      matchDescription: "^[A-Z].*\\.$",
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
        "packages/**/*.test.ts",
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
        "max-len": ["error", {
          code: 120,
        }],

        "mocha/valid-suite-description": ["error", "^[A-Z:]"],
        "mocha/valid-test-description": ["error", "^[a-z0-9]"],

        // Disabled because tests are dynamically generated. See: https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/docs/rules/no-setup-in-describe.md
        "mocha/no-setup-in-describe": "off",
      },
    },
    { // Configuration files (JS)
      files: [
        ".eslintrc.js",
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
        ".mocharc.yml",
        ".nycrc.yml",
      ],
      extends: [
        "plugin:yml/standard",
      ],
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
