"use strict";

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
        "benchmarking",
        "cli",
        "core",
        "deps",
        "hooks",
        "scripts",
        "testing",
      ],
    ],
    "type-enum": [
      2,
      "always",
      [
        "benchmark",
        "chore",
        "ci",
        "config",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
  },
};
