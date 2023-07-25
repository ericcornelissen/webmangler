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
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
  ],
  rules: {
    // See https://eslint.org/docs/rules/
    "accessor-pairs": ["error", {
      setWithoutGet: true,
      getWithoutSet: false,
      enforceForClassMembers: true,
    }],
    "array-callback-return": ["error", {
      allowImplicit: false,
      checkForEach: false,
    }],
    "array-bracket-newline": "off",
    "array-bracket-spacing": ["error", "never"],
    "array-element-newline": "off",
    "arrow-body-style": "off",
    "arrow-parens": ["error", "always"],
    "arrow-spacing": ["error", {
      after: true,
      before: true,
    }],
    "block-scoped-var": ["error"],
    "block-spacing": ["error", "always"],
    "brace-style": ["error", "1tbs", {
      allowSingleLine: true,
    }],
    "camelcase": ["error", {
      properties: "never",
      ignoreDestructuring: true,
      ignoreImports: true,
    }],
    "capitalized-comments": ["error", "always", {
      ignoreInlineComments: false,
      ignoreConsecutiveComments: true,
    }],
    "class-methods-use-this": "off",
    "comma-dangle": ["error", {
      arrays: "always-multiline",
      objects: "always-multiline",
      imports: "always-multiline",
      exports: "always-multiline",
      functions: "always-multiline",
    }],
    "comma-spacing": ["error", {
      after: true,
      before: false,
    }],
    "comma-style": ["error", "last"],
    "complexity": ["error", {
      max: 8,
    }],
    "computed-property-spacing": ["error", "never"],
    "consistent-return": "off",
    "consistent-this": ["error", "self"],
    "constructor-super": ["error"],
    "curly": ["error", "multi-line"],
    "default-case": "off",
    "default-case-last": ["error"],
    "default-param-last": ["error"],
    "dot-location": ["error", "property"],
    "dot-notation": ["error", {
      allowKeywords: true,
    }],
    "eol-last": ["error", "always"],
    "eqeqeq": ["error", "always"],
    "for-direction": ["error"],
    "func-call-spacing": ["error", "never"],
    "func-name-matching": "off",
    "func-names": ["error", "never"],
    "func-style": ["error", "declaration", {
      allowArrowFunctions: true,
    }],
    "function-call-argument-newline": ["error", "consistent"],
    "function-paren-newline": ["error", "multiline-arguments"],
    "generator-star-spacing": ["error", {
      after: true,
      before: false,
      anonymous: "neither",
      method: "both",
    }],
    "getter-return": ["error", {
      allowImplicit: false,
    }],
    "grouped-accessor-pairs": ["error", "getBeforeSet"],
    "guard-for-in": ["error"],
    "id-denylist": "off",
    "id-length": "off",
    "id-match": "off",
    "init-declarations": "off",
    "implicit-arrow-linebreak": ["error", "beside"],
    "indent": ["error", 2],
    "jsx-quotes": "off",
    "key-spacing": ["error", {
      afterColon: true,
      beforeColon: false,
      mode: "strict",
    }],
    "keyword-spacing": ["error", {
      after: true,
      before: true,
    }],
    "line-comment-position": "off",
    "linebreak-style": ["error", "unix"],
    "lines-around-comment": "off",
    "lines-between-class-members": ["error", "always"],
    "logical-assignment-operators": ["error", "never"],
    "max-classes-per-file": ["error", {
      max: 1,
    }],
    "max-depth": ["error", {
      max: 5,
    }],
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
    "max-lines": "off",
    "max-lines-per-function": "off",
    "max-nested-callbacks": ["error", {
      max: 5,
    }],
    "max-params": ["error", {
      max: 4,
    }],
    "max-statements": "off",
    "max-statements-per-line": ["error", {
      max: 1,
    }],
    "multiline-comment-style": "off",
    "multiline-ternary": "off",
    "new-cap": ["error", {
      newIsCap: true,
      capIsNew: false,
      properties: true,
    }],
    "new-parens": ["error", "always"],
    "newline-per-chained-call": ["error"],
    "no-alert": "off",
    "no-array-constructor": ["error"],
    "no-async-promise-executor": ["error"],
    "no-await-in-loop": "off",
    "no-bitwise": ["error"],
    "no-caller": ["error"],
    "no-case-declarations": ["error"],
    "no-class-assign": ["error"],
    "no-compare-neg-zero": ["error"],
    "no-cond-assign": ["error", "except-parens"],
    "no-confusing-arrow": ["error"],
    "no-console": ["warn"],
    "no-continue": "off",
    "no-const-assign": ["error"],
    "no-constant-binary-expression": ["error"],
    "no-constant-condition": ["error", {
      checkLoops: true,
    }],
    "no-constructor-return": ["error"],
    "no-control-regex": "off",
    "no-debugger": ["error"],
    "no-delete-var": ["error"],
    "no-div-regex": "off",
    "no-dupe-args": ["error"],
    "no-dupe-class-members": ["error"],
    "no-dupe-else-if": ["error"],
    "no-dupe-keys": ["error"],
    "no-duplicate-case": ["error"],
    "no-duplicate-imports": "off",
    "no-else-return": "off",
    "no-empty": ["error"],
    "no-empty-character-class": "off",
    "no-empty-function": ["error"],
    "no-empty-pattern": ["error"],
    "no-empty-static-block": "error",
    "no-eq-null": "off",
    "no-eval": ["error", {
      allowIndirect: false,
    }],
    "no-ex-assign": ["error"],
    "no-extend-native": ["error"],
    "no-extra-bind": ["error"],
    "no-extra-boolean-cast": ["error", {
      enforceForLogicalOperands: true,
    }],
    "no-extra-label": ["error"],
    "no-extra-parens": "off",
    "no-extra-semi": ["error"],
    "no-fallthrough": ["error"],
    "no-floating-decimal": ["error"],
    "no-func-assign": ["error"],
    "no-global-assign": ["error"],
    "no-implicit-coercion": ["error", {
      boolean: true,
      number: true,
      string: true,
    }],
    "no-implicit-globals": ["error"],
    "no-implied-eval": ["error"],
    "no-import-assign": ["error"],
    "no-inline-comments": "off",
    "no-invalid-this": ["error", {
      capIsConstructor: false,
    }],
    "no-inner-declarations": ["error", "both"],
    "no-invalid-regexp": "off",
    "no-irregular-whitespace": ["error", {
      skipStrings: false,
      skipComments: false,
      skipRegExps: false,
      skipTemplates: false,
    }],
    "no-iterator": ["error"],
    "no-label-var": ["error"],
    "no-labels": "off",
    "no-lone-blocks": ["error"],
    "no-lonely-if": ["error"],
    "no-loop-func": "off",
    "no-loss-of-precision": ["error"],
    "no-magic-numbers": ["error", {
      ignore: [-1, 0, 1, 2, 100],
    }],
    "no-misleading-character-class": "off",
    "no-mixed-operators": "off",
    "no-mixed-spaces-and-tabs": ["error"],
    "no-multi-assign": ["error", {
      ignoreNonDeclaration: false,
    }],
    "no-multi-spaces": ["error", {
      ignoreEOLComments: false,
      exceptions: {},
    }],
    "no-multi-str": ["error"],
    "no-multiple-empty-lines": ["error", {
      max: 1,
      maxBOF: 0,
      maxEOF: 0,
    }],
    "no-negated-condition": ["error"],
    "no-nested-ternary": ["error"],
    "no-new": ["error"],
    "no-new-func": ["error"],
    "no-new-object": ["error"],
    "no-new-native-nonconstructor": ["error"],
    "no-new-symbol": ["error"],
    "no-new-wrappers": ["error"],
    "no-nonoctal-decimal-escape": "off",
    "no-octal": ["error"],
    "no-octal-escape": ["error"],
    "no-obj-calls": ["error"],
    "no-param-reassign": ["error"],
    "no-plusplus": ["error"],
    "no-promise-executor-return": ["error"],
    "no-proto": ["error"],
    "no-prototype-builtins": ["error"],
    "no-redeclare": ["error"],
    "no-regex-spaces": "off",
    "no-restricted-exports": "off",
    "no-restricted-globals": "off",
    "no-restricted-imports": "off",
    "no-restricted-properties": "off",
    "no-restricted-syntax": "off",
    "no-return-assign": "off",
    "no-return-await": ["error"],
    "no-script-url": "off",
    "no-self-assign": ["error", {
      props: true,
    }],
    "no-self-compare": ["error"],
    "no-sequences": ["error"],
    "no-setter-return": ["error"],
    "no-shadow": ["error", {
      builtinGlobals: false,
      hoist: "all",
      allow: [],
    }],
    "no-shadow-restricted-names": ["error"],
    "no-sparse-arrays": ["error"],
    "no-tabs": ["error"],
    "no-template-curly-in-string": "off",
    "no-ternary": "off",
    "no-this-before-super": ["error"],
    "no-throw-literal": ["error"],
    "no-trailing-spaces": ["error", {
      skipBlankLines: false,
      ignoreComments: false,
    }],
    "no-undef": ["error"],
    "no-undef-init": ["error"],
    "no-undefined": "off",
    "no-underscore-dangle": "off",
    "no-unexpected-multiline": ["error"],
    "no-unmodified-loop-condition": ["error"],
    "no-unneeded-ternary": ["error"],
    "no-unreachable": ["error"],
    "no-unreachable-loop": ["error"],
    "no-unsafe-finally": ["error"],
    "no-unsafe-negation": ["error"],
    "no-unsafe-optional-chaining": ["error"],
    "no-unused-expressions": ["error", {
      allowShortCircuit: false,
      allowTernary: false,
      allowTaggedTemplates: false,
    }],
    "no-unused-labels": ["error"],
    "no-unused-private-class-members": ["error"],
    "no-unused-vars": ["error"],
    "no-use-before-define": "off",
    "no-useless-backreference": "off",
    "no-useless-call": ["error"],
    "no-useless-catch": ["error"],
    "no-useless-computed-key": ["error"],
    "no-useless-concat": ["error"],
    "no-useless-constructor": ["error"],
    "no-useless-escape": ["error"],
    "no-useless-rename": ["error"],
    "no-useless-return": ["error"],
    "no-var": ["error"],
    "no-void": ["error"],
    "no-warning-comments": ["warn", {
      terms: [
        "fixme",
        "todo",
        "xxx",
      ],
      location: "start",
      decoration: [
        "/",
        "*",
      ],
    }],
    "no-whitespace-before-property": ["error"],
    "no-with": ["error"],
    "nonblock-statement-body-position": ["error", "beside"],
    "object-shorthand": ["error", "always"],
    "object-curly-newline": "off",
    "object-curly-spacing": ["error", "always"],
    "object-property-newline": "off",
    "one-var": ["error", "never"],
    "one-var-declaration-per-line": "off",
    "operator-assignment": ["error", "always"],
    "operator-linebreak": "off",
    "padded-blocks": ["error", {
      blocks: "never",
      classes: "never",
      switches: "never",
    }],
    "padding-line-between-statements": "off",
    "prefer-arrow-callback": ["error", {
      allowNamedFunctions: false,
      allowUnboundThis: true,
    }],
    "prefer-const": ["error", {
      destructuring: "any",
      ignoreReadBeforeAssign: false,
    }],
    "prefer-destructuring": "off",
    "prefer-exponentiation-operator": ["error"],
    "prefer-named-capture-group": "off",
    "prefer-numeric-literals": ["error"],
    "prefer-object-has-own": ["error"],
    "prefer-object-spread": "off",
    "prefer-promise-reject-errors": ["error"],
    "prefer-regex-literals": "off",
    "prefer-rest-params": ["error"],
    "prefer-spread": ["error"],
    "prefer-template": ["error"],
    "quote-props": ["error", "consistent-as-needed"],
    "quotes": ["error", "double", {
      avoidEscape: false,
      allowTemplateLiterals: false,
    }],
    "require-atomic-updates": ["error"],
    "radix": ["error", "always"],
    "require-await": "off",
    "require-unicode-regexp": "off",
    "require-yield": ["error"],
    "rest-spread-spacing": ["error"],
    "semi": ["error", "always"],
    "semi-spacing": ["error", {
      before: false,
      after: true,
    }],
    "semi-style": ["error", "last"],
    "sort-imports": "off",
    "sort-keys": "off",
    "sort-vars": "off",
    "space-before-blocks": ["error", {
      classes: "always",
      functions: "always",
      keywords: "always",
    }],
    "space-before-function-paren": ["error", "never"],
    "space-in-parens": ["error", "never"],
    "space-infix-ops": ["error"],
    "space-unary-ops": ["error", {
      words: true,
      nonwords: false,
    }],
    "spaced-comment": ["error", "always"],
    "strict": ["error", "never"],
    "switch-colon-spacing": ["error", {
      after: true,
      before: false,
    }],
    "symbol-description": ["error"],
    "template-curly-spacing": ["error", "never"],
    "template-tag-spacing": ["error", "always"],
    "unicode-bom": ["error", "never"],
    "use-isnan": ["error"],
    "valid-typeof": ["error"],
    "vars-on-top": "off",
    "wrap-iife": ["error", "inside"],
    "wrap-regex": "off",
    "yield-star-spacing": ["error", "after"],
    "yoda": ["error", "never"],

    // See https://github.com/import-js/eslint-plugin-import#rules
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
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
      considerComments: true,
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
    "jsdoc/informative-docs": "off",
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
    "jsdoc/no-bad-blocks": "error",
    "jsdoc/no-blank-block-descriptions": "error",
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
      alphabetizeExtras: false,
      reportTagGroupSpacing: false,
      tagSequence: [
        {
          tags: [
            "inheritDoc", "default", "example", "param", "returns",
            "yields", "throws", "since", "version",
          ],
        },
      ],
    }],
    "jsdoc/tag-lines": ["error", "any", {
      endLines: 0,
      startLines: 1,
    }],
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
    "regexp/no-misleading-capturing-group": ["error", {
      reportBacktrackingEnds: true,
    }],
    "regexp/no-misleading-unicode-character": ["error", {
      fixable: false,
    }],
    "regexp/no-missing-g-flag": ["error", {
      strictTypes: true,
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
      lookbehind: true,
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
    "security/detect-bidi-characters": "error",
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
        file: "fileoverview",
        inheritdoc: false,
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
        "class-methods-use-this": "off",
        "space-before-blocks": "off",

        // See: https://typescript-eslint.io/rules/
        "@typescript-eslint/class-methods-use-this": "error",
        "@typescript-eslint/consistent-type-exports": ["error", {
          fixMixedExportsWithInlineTypeSpecifier: false,
        }],
        "@typescript-eslint/consistent-type-imports": ["error", {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        }],
        "@typescript-eslint/lines-around-comment": ["error", {
          allowArrayEnd: false,
          allowArrayStart: true,
          allowBlockEnd: false,
          allowBlockStart: true,
          allowClassEnd: false,
          allowClassStart: true,
          allowEnumEnd: false,
          allowEnumStart: true,
          allowInterfaceEnd: false,
          allowInterfaceStart: true,
          allowModuleEnd: false,
          allowModuleStart: true,
          allowObjectEnd: false,
          allowObjectStart: true,
          allowTypeEnd: false,
          allowTypeStart: true,
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
        "@typescript-eslint/no-duplicate-type-constituents": "error",
        "@typescript-eslint/no-mixed-enums": "error",
        "@typescript-eslint/no-redundant-type-constituents": "error",
        "@typescript-eslint/no-unsafe-declaration-merging": "error",
        "@typescript-eslint/no-unsafe-enum-comparison": "error",
        "@typescript-eslint/no-useless-empty-export": "error",
        "@typescript-eslint/space-before-blocks": "error",
        "@typescript-eslint/switch-exhaustiveness-check": "error",
      },
    },
    { // Package 'cli'
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
        // See https://eslint.org/docs/rules/
        "no-magic-numbers": "off",

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
        // See https://eslint.org/docs/rules/
        "no-magic-numbers": "off",
        "no-new": "off",
        "no-unused-expressions": "off",
        "prefer-arrow-callback": "off",
        "import/no-extraneous-dependencies": "off",

        // See: https://github.com/turbo87/eslint-plugin-chai-expect#readme
        "chai-expect/missing-assertion": ["error"],
        "chai-expect/no-inner-compare": ["error"],
        "chai-expect/no-inner-literal": ["error"],
        "chai-expect/terminating-properties": ["error", {
          properties: [
            // For 'sinon-chai'
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
        // See https://eslint.org/docs/rules/
        "no-magic-numbers": "off",
        "strict": "off",

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
        "no-magic-numbers": "off",

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
        // See https://eslint.org/docs/rules/
        "capitalized-comments": ["error", "always", {
          ignorePattern: "^(\\s*tag=|\\s*v\\d+\\.\\d+\\.\\d+)",
        }],
        "max-len": "off",
        "no-multiple-empty-lines": "off",
        "no-multi-spaces": "off",
        "spaced-comment": "off",

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
        "yml/no-trailing-zeros": "error",
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
        // See https://eslint.org/docs/rules/
        "capitalized-comments": "off",
        "eol-last": "off",
        "no-console": "off",
        "no-magic-numbers": "off",
        "prefer-arrow-callback": "off",
        "unicode-bom": "off",

        // See: https://github.com/import-js/eslint-plugin-import#rules
        "import/no-commonjs": "off",
        "import/no-extraneous-dependencies": "off",
        "import/no-unresolved": "off",

        // See: https://typescript-eslint.io/rules/
        "@typescript-eslint/no-duplicate-type-constituents": "off",
        "@typescript-eslint/no-mixed-enums": "off",
        "@typescript-eslint/no-unsafe-enum-comparison": "off",
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
        // See https://eslint.org/docs/rules/
        "capitalized-comments": "off",
        "eol-last": "off",
        "no-console": "off",
        "no-magic-numbers": "off",
        "prefer-arrow-callback": "off",
        "unicode-bom": "off",

        // See: https://github.com/import-js/eslint-plugin-import#rules
        "import/no-commonjs": "off",
        "import/no-extraneous-dependencies": "off",
        "import/no-unresolved": "off",

        // See: https://typescript-eslint.io/rules/
        "@typescript-eslint/consistent-type-exports": "off",
        "@typescript-eslint/no-duplicate-type-constituents": "off",
        "@typescript-eslint/no-mixed-enums": "off",
        "@typescript-eslint/no-redundant-type-constituents": "off",
        "@typescript-eslint/no-unsafe-enum-comparison": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/switch-exhaustiveness-check": "off",
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
