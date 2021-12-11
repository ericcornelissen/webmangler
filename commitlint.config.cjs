"use strict";

const { getAllPackagesAsArray } = require("./.values.cjs");

const packages = getAllPackagesAsArray();

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [
      2,
      "always",
      72,
    ],
    "header-max-length": [
      2,
      "always",
      72,
    ],
    "scope-enum": [
      2,
      "always",
      [
        "deps",
        "hooks",
        "scripts",
        ...packages,
      ],
    ],
    "type-enum": [
      2,
      "always",
      [
        // Use when testing performance or benchmarking.
        "benchmark",

        // Use when no other type is suitable.
        "chore",

        // Use when making changes affecting the CI.
        "ci",

        // Use when changing configuration files.
        "config",

        // Use when changing only documentation, either in a text file or in
        // source code.
        "docs",

        // Use when adding new functionality.
        "feat",

        // Use when fixing a bug.
        "fix",

        // Use when improving performance.
        "perf",

        // Use when changing code without changing functionality.
        "refactor",

        // Use when reverting a change from an earlier commit.
        "revert",

        // Use when adding new tests or updating existing tests.
        "test",
      ],
    ],
  },
};
