// Check out ESLint at: https://eslint.org/

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
  testsDir,
} = values;

const INDENT_SIZE = 2;
const COMMON_JS_GLOBALS = {
  module: "readonly",
  require: "readonly",
};
const MAX_LINE_LENGTH = 80;

module.exports = {
  root: true,

  plugins: [
    "import",
    "jsdoc",
    "regexp",
    "security",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
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
    "indent": ["error", 2],
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
    "no-empty-static-block": "error",
    "no-new-native-nonconstructor": "error",
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

    // See https://github.com/import-js/eslint-plugin-import#rules
    "import/default": "error",
    "import/export": "error",
    "import/exports-last": "error",
    "import/first": "error",
    "import/group-exports": "error",
    "import/max-dependencies": "off",
    "import/named": "error",
    "import/namespace": "error",
    "import/newline-after-import": ["error", {
      count: 1,
    }],
    "import/no-absolute-path": "error",
    "import/no-amd": "error",
    "import/no-anonymous-default-export": "error",
    "import/no-commonjs": "error",
    "import/no-cycle": "error",
    "import/no-default-export": "off",
    "import/no-deprecated": "error",
    "import/no-duplicates": "error",
    "import/no-dynamic-require": "error",
    "import/no-extraneous-dependencies": "error",
    "import/no-import-module-exports": "error",
    "import/no-mutable-exports": "error",
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "error",
    "import/no-named-export": "off",
    "import/no-namespace": "off",
    "import/no-nodejs-modules": "off",
    "import/no-relative-packages": "error",
    "import/no-relative-parent-imports": "off",
    "import/no-self-import": "error",
    "import/no-unassigned-import": "error",
    "import/no-unresolved": ["error", {
      caseSensitive: true,
      ignore: [
        "@webmangler/core",
        "@webmangler/core/languages",
        "@webmangler/core/manglers",
      ],
    }],
    "import/no-unused-modules": "error",
    "import/no-useless-path-segments": "error",
    "import/no-webpack-loader-syntax": "error",
    "import/order": "off", // Blocked by https://github.com/import-js/eslint-plugin-import/issues/2347

    // See: https://github.com/gajus/eslint-plugin-jsdoc#configuration
    "jsdoc/check-access": "off",
    "jsdoc/check-alignment": "error",
    "jsdoc/check-line-alignment": "off",
    "jsdoc/check-indentation": "error",
    "jsdoc/check-param-names": "error",
    "jsdoc/check-property-names": "error",
    "jsdoc/check-syntax": "off",
    "jsdoc/check-tag-names": "error",
    "jsdoc/check-types": "off",
    "jsdoc/check-values": "error",
    "jsdoc/empty-tags": ["error", {
      tags: [
        "inheritDoc",
      ],
    }],
    "jsdoc/implements-on-classes": "off",
    "jsdoc/match-description": ["error", {
      matchDescription: "^([A-Z]|[`\\d_])[\\s\\S]*\\.\\n{0,1}$",
      tags: {
        param: "^[A-Z].*\\.$",
        returns: "^[A-Z`].*\\.$",
        since: "^v[0-9]\\.[0-9]\\.[0-9]",
      },
    }],
    "jsdoc/multiline-blocks": ["error", {
      noZeroLineText: true,
      noFinalLineText: true,
      noSingleLineBlocks: true,
      singleLineTags: [],
      noMultilineBlocks: false,
    }],
    "jsdoc/newline-after-description": ["error", "always"],
    "jsdoc/no-bad-blocks": "error",
    "jsdoc/no-defaults": "error",
    "jsdoc/no-multi-asterisks": ["error", {
      allowWhitespace: true,
      preventAtMiddleLines: true,
      preventAtEnd: true,
    }],
    "jsdoc/no-types": "error",
    "jsdoc/no-undefined-types": "off",
    "jsdoc/require-asterisk-prefix": ["error", "always"],
    "jsdoc/require-description": "error",
    "jsdoc/require-description-complete-sentence": "off",
    "jsdoc/require-example": "off",
    "jsdoc/require-file-overview": "off",
    "jsdoc/require-hyphen-before-param-description": ["error", "never"],
    "jsdoc/require-jsdoc": "error",
    "jsdoc/require-param-description": "error",
    "jsdoc/require-param-name": "error",
    "jsdoc/require-param-type": "off",
    "jsdoc/require-param": "error",
    "jsdoc/require-property": "off",
    "jsdoc/require-returns": "error",
    "jsdoc/require-returns-check": "error",
    "jsdoc/require-returns-description": "error",
    "jsdoc/require-returns-type": "off",
    "jsdoc/require-throws": "error",
    "jsdoc/require-yields": "error",
    "jsdoc/require-yields-check": "error",
    "jsdoc/sort-tags": ["error", {
      tagSequence: [
        "inheritDoc", "default", "example", "param", "returns",
        "yields", "throws", "since", "version",
      ],
    }],
    "jsdoc/tag-lines": ["error", "never"],
    "jsdoc/text-escaping": "off",
    "jsdoc/valid-types": "off",

    // See: https://ota-meshi.github.io/eslint-plugin-regexp/
    "regexp/confusing-quantifier": "error",
    "regexp/control-character-escape": "error",
    "regexp/hexadecimal-escape": ["error", "never"],
    "regexp/letter-case": ["error", {
      caseInsensitive: "lowercase",
      controlEscape: "lowercase",
      hexadecimalEscape: "uppercase",
      unicodeEscape: "uppercase",
    }],
    "regexp/match-any": ["error", {
      allows: ["[^]", "dotAll"],
    }],
    "regexp/negation": "error",
    "regexp/no-contradiction-with-assertion": "error",
    "regexp/no-control-character": "error",
    "regexp/no-dupe-characters-character-class": "error",
    "regexp/no-dupe-disjunctions": ["error", {
      report: "all",
      reportExponentialBacktracking: "potential",
      reportUnreachable: "potential",
    }],
    "regexp/no-empty-alternative": "error",
    "regexp/no-empty-capturing-group": "error",
    "regexp/no-empty-character-class": "error",
    "regexp/no-empty-group": "error",
    "regexp/no-empty-lookarounds-assertion": "error",
    "regexp/no-escape-backspace": "error",
    "regexp/no-invalid-regexp": "error",
    "regexp/no-invisible-character": "error",
    "regexp/no-lazy-ends": ["error", {
      ignorePartial: false,
    }],
    "regexp/no-legacy-features": "error",
    "regexp/no-misleading-unicode-character": ["error", {
      fixable: false,
    }],
    "regexp/no-non-standard-flag": "error",
    "regexp/no-obscure-range": ["error", {
      allowed: "alphanumeric",
    }],
    "regexp/no-octal": "error",
    "regexp/no-optional-assertion": "error",
    "regexp/no-potentially-useless-backreference": "error",
    "regexp/no-standalone-backslash": "error",
    "regexp/no-super-linear-backtracking": ["error", {
      report: "potential",
    }],
    "regexp/no-super-linear-move": ["error", {
      ignoreSticky: false,
      report: "potential",
    }],
    "regexp/no-trivially-nested-assertion": "error",
    "regexp/no-trivially-nested-quantifier": "error",
    "regexp/no-unused-capturing-group": ["error", {
      fixable: false,
    }],
    "regexp/no-useless-assertions": "off",
    "regexp/no-useless-backreference": "error",
    "regexp/no-useless-character-class": "error",
    "regexp/no-useless-dollar-replacements": "error",
    "regexp/no-useless-escape": "error",
    "regexp/no-useless-flag": "error",
    "regexp/no-useless-lazy": "error",
    "regexp/no-useless-non-capturing-group": "error",
    "regexp/no-useless-quantifier": "error",
    "regexp/no-useless-range": "error",
    "regexp/no-useless-two-nums-quantifier": "error",
    "regexp/no-zero-quantifier": "error",
    "regexp/optimal-lookaround-quantifier": "error",
    "regexp/optimal-quantifier-concatenation": ["error", {
      capturingGroups: "report",
    }],
    "regexp/prefer-character-class": ["error", {
      minAlternatives: 2,
    }],
    "regexp/prefer-d": ["error", {
      insideCharacterClass: "range",
    }],
    "regexp/prefer-escape-replacement-dollar-char": "error",
    "regexp/prefer-lookaround": ["error", {
      strictTypes: true,
    }],
    "regexp/prefer-named-backreference": "error",
    "regexp/prefer-named-capture-group": "error",
    "regexp/prefer-named-replacement": "error",
    "regexp/prefer-plus-quantifier": "error",
    "regexp/prefer-predefined-assertion": "error",
    "regexp/prefer-quantifier": "error",
    "regexp/prefer-question-quantifier": "error",
    "regexp/prefer-range": ["error", {
      target: "alphanumeric",
    }],
    "regexp/prefer-regexp-exec": "error",
    "regexp/prefer-regexp-test": "error",
    "regexp/prefer-result-array-groups": ["error", {
      strictTypes: true,
    }],
    "regexp/prefer-star-quantifier": "error",
    "regexp/prefer-unicode-codepoint-escapes": "error",
    "regexp/prefer-w": "error",
    "regexp/require-unicode-regexp": "off",
    "regexp/sort-alternatives": "error",
    "regexp/sort-character-class-elements": ["error", {
      order: [
        "\\s",
        "\\w",
        "\\d",
        "\\p",
        "*",
      ],
    }],
    "regexp/sort-flags": "error",
    "regexp/strict": "error",
    "regexp/unicode-escape": ["error", "unicodeEscape"],
    "regexp/use-ignore-case": "off",

    // See: https://github.com/nodesecurity/eslint-plugin-security#rules
    "security/detect-buffer-noassert": "error",
    "security/detect-child-process": "error",
    "security/detect-disable-mustache-escape": "off",
    "security/detect-eval-with-expression": "error",
    "security/detect-new-buffer": "error",
    "security/detect-no-csrf-before-method-override": "off",
    "security/detect-non-literal-fs-filename": "error",
    "security/detect-non-literal-regexp": "off",
    "security/detect-non-literal-require": "error",
    "security/detect-object-injection": "off",
    "security/detect-possible-timing-attacks": "error",
    "security/detect-pseudoRandomBytes": "error",
    "security/detect-unsafe-regex": "off",
  },
  settings: {
    jsdoc: {
      tagNamePreference: {
        "file": "fileoverview",
        "inheritdoc": false,
      },
    },
  },
  env: {
    es6: true,
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
        "space-before-blocks": "off",

        // See: https://typescript-eslint.io/rules/
        "@typescript-eslint/consistent-type-exports": ["error", {
          fixMixedExportsWithInlineTypeSpecifier: false,
        }],
        "@typescript-eslint/consistent-type-imports": ["error", {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        }],
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/member-delimiter-style": ["error", {
          multiline: {
            delimiter: "semi",
            requireLast: true,
          },
          singleline: {
            delimiter: "semi",
            requireLast: true,
          },
          multilineDetection: "brackets",
        }],
        "@typescript-eslint/no-redundant-type-constituents": "error",
        "@typescript-eslint/no-unsafe-declaration-merging": "error",
        "@typescript-eslint/no-useless-empty-export": "error",
        "@typescript-eslint/space-before-blocks": "error",
        "@typescript-eslint/switch-exhaustiveness-check": "error",
      },
    },
    { // packages/cli
      files: [
        `${packagesDir}/cli/**/*.ts`,
      ],
      rules: {
        // See: https://github.com/nodesecurity/eslint-plugin-security#rules
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
        // See https://github.com/import-js/eslint-plugin-import#rules
        "import/no-anonymous-default-export": "off",

        // See: https://github.com/gajus/eslint-plugin-jsdoc#configuration
        "jsdoc/require-file-overview": "error",
        "jsdoc/require-jsdoc": "off",

        // See: https://github.com/nodesecurity/eslint-plugin-security#rules
        "security/detect-non-literal-fs-filename": "off",

        // See: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
      globals: {
        ...COMMON_JS_GLOBALS,
        console: "readonly",
      },
    },
    { // Test files
      files: [
        `${packagesDir}/**/${testsDir}/**/*`,
      ],
      plugins: [
        "chai-expect",
        "mocha",
      ],
      rules: {
        "prefer-arrow-callback": "off",
        "import/no-extraneous-dependencies": "off",

        // See: https://github.com/turbo87/eslint-plugin-chai-expect#readme
        "chai-expect/missing-assertion": ["error"],
        "chai-expect/no-inner-compare": ["error"],
        "chai-expect/no-inner-literal": ["error"],
        "chai-expect/terminating-properties": ["error", {
          properties: [
            // from 'sinon-chai'
            "called",
            "calledOnce",
            "calledTwice",
            "calledThrice",
            "calledWithNew",
          ],
        }],

        // See: https://github.com/lo1tuma/eslint-plugin-mocha/tree/master/docs/rules#readme
        "mocha/handle-done-callback": ["error", {
          ignoreSkipped: false,
        }],
        "mocha/max-top-level-suites": ["error", {
          limit: 1,
        }],
        "mocha/no-async-describe": ["error"],
        "mocha/no-empty-description": "off",
        "mocha/no-exclusive-tests": ["error"],
        "mocha/no-exports": ["error"],
        "mocha/no-global-tests": ["error"],
        "mocha/no-hooks": "off",
        "mocha/no-hooks-for-single-case": "off",
        "mocha/no-identical-title": ["error"],
        "mocha/no-mocha-arrows": ["error"],
        "mocha/no-nested-tests": ["error"],
        "mocha/no-pending-tests": ["warn"],
        "mocha/no-return-and-callback": ["error"],
        "mocha/no-return-from-async": ["error"],
        "mocha/no-setup-in-describe": "off",
        "mocha/no-sibling-hooks": "off",
        "mocha/no-skipped-tests": ["warn"],
        "mocha/no-synchronous-tests": "off",
        "mocha/no-top-level-hooks": ["error"],
        "mocha/prefer-arrow-callback": ["error"],
        "mocha/valid-suite-description": ["error", "^[A-Z:]"],
        "mocha/valid-test-description": ["error", "^[a-z0-9]"],

        // See: https://ota-meshi.github.io/eslint-plugin-regexp/
        "regexp/no-super-linear-backtracking": "off",
        "regexp/no-super-linear-move": "off",
      },
    },
    { // Configuration files (CJS)
      files: [
        ".eslintrc.cjs",
        ".mocharc.cjs",
        ".values.cjs",
        "commitlint.config.cjs",
      ],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2020,
      },
      rules: {
        // See https://github.com/import-js/eslint-plugin-import#rules
        "import/no-commonjs": "off",

        // See: https://github.com/gajus/eslint-plugin-jsdoc#configuration
        "jsdoc/require-jsdoc": "off",

        // See: https://github.com/nodesecurity/eslint-plugin-security#rules
        "security/detect-non-literal-fs-filename": "off",

        // Disable any lingering TypeScript issues
        "@typescript-eslint/no-var-requires": "off",
      },
      globals: {
        ...COMMON_JS_GLOBALS,
        __dirname: "readonly",
      },
    },
    { // Configuration files (ESM)
      files: [
        "nyc.config.js",
        "stryker.config.js",
      ],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2020,
      },
      rules: {
        // See https://github.com/import-js/eslint-plugin-import#rules
        "import/no-anonymous-default-export": "off",

        // See: https://github.com/gajus/eslint-plugin-jsdoc#configuration
        "jsdoc/require-jsdoc": "off",
      },
    },
    { // Configuration files (JSON)
      files: [
        ".github/renovate.json",
        ".licensee.json",
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "tsconfig.build.json",
      ],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2015,
      },
      plugins: [
        "json",
      ],
      rules: {
        "json/*": ["error"],
      },
    },
    { // Configuration files (YAML)
      files: [
        ".github/**/*.yml",
        ".markdownlint.yml",
      ],
      extends: [
        "plugin:yml/base",
      ],
      rules: {
        // See: https://eslint.org/docs/rules/
        "max-len": "off",
        "spaced-comment": "off", // Per https://ota-meshi.github.io/eslint-plugin-yml/rules/spaced-comment.html

        // See: https://ota-meshi.github.io/eslint-plugin-yml/rules/
        "yml/block-mapping": ["error", "always"],
        "yml/block-mapping-colon-indicator-newline": ["error", "never"],
        "yml/block-mapping-question-indicator-newline": ["error", "never"],
        "yml/block-sequence": ["error", "always"],
        "yml/block-sequence-hyphen-indicator-newline": ["error", "never"],
        "yml/file-extension": ["error", {
          extension: "yml",
          caseSensitive: true,
        }],
        "yml/indent": ["error", INDENT_SIZE],
        "yml/key-name-casing": "off",
        "yml/key-spacing": ["error", {
          afterColon: true,
          beforeColon: false,
          mode: "strict",
        }],
        "yml/no-empty-document": "error",
        "yml/no-empty-key": "error",
        "yml/no-empty-mapping-value": "error",
        "yml/no-empty-sequence-entry": "error",
        "yml/no-irregular-whitespace": "error",
        "yml/no-multiple-empty-lines": ["error", {
          max: 1,
          maxEOF: 0,
          maxBOF: 0,
        }],
        "yml/no-tab-indent": "error",
        "yml/plain-scalar": ["error", "always"],
        "yml/quotes": ["error", {
          avoidEscape: true,
          prefer: "double",
        }],
        "yml/require-string-key": "error",
        "yml/sort-keys": "off",
        "yml/sort-sequence-values": ["error",
          {
            pathPattern: ".*",
            order: {
              type: "asc",
            },
          },
        ],
        "yml/spaced-comment": ["error", "always"],
        "yml/vue-custom-block/no-parsing-error": "off",
      },
    },
    { // Documentation (MarkDown)
      files: [
        "**/*.md",
      ],
      plugins: [
        "markdown",
      ],
      processor: "markdown/markdown",
    },
    { // Documentation Snippets, JavaScript (MarkDown.*)
      files: [
        "**/*.md/*.js",
      ],
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
      globals: {
        ...COMMON_JS_GLOBALS,
        console: "readonly",
      },
      rules: {
        // See: https://eslint.org/docs/rules/
        "eol-last": "off",
        "no-console": "off",
        "unicode-bom": "off",

        // See: https://github.com/import-js/eslint-plugin-import#rules
        "import/no-commonjs": "off",
        "import/no-extraneous-dependencies": "off",
        "import/no-unresolved": "off",

        // See: https://typescript-eslint.io/rules/
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    { // Documentation Snippets, TypeScript (MarkDown.*)
      files: [
        "**/*.md/*.ts",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: null,
      },
      globals: {
        console: "readonly",
      },
      rules: {
        // See: https://eslint.org/docs/rules/
        "no-console": "off",

        // See: https://github.com/import-js/eslint-plugin-import#rules
        "import/no-commonjs": "off",
        "import/no-extraneous-dependencies": "off",
        "import/no-unresolved": "off",

        // See: https://typescript-eslint.io/rules/
        "@typescript-eslint/consistent-type-exports": "off",
        "@typescript-eslint/no-redundant-type-constituents": "off",
        "@typescript-eslint/switch-exhaustiveness-check": "off",
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  ],

  ignorePatterns: [
    // Don't ignore configuration files
    `!${githubDir}/`,
    "!.*.cjs",
    "!.*.js",
    "!.*.json",
    "!.*.yml",

    // Generated & temporary
    `${dependenciesDir}/`,
    `${testDataDir}/`,
    `${reportsDir}/`,
    `${tempDir}/`,
    "build/",
    "lib/",

    // @webmangler/cli configuration files
    "packages/cli/.webmanglerrc.js",
    "packages/cli/webmangler.config.js",
  ],
};
