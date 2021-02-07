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
        "cli",
        "core",
        "hook",
        "script",
      ],
    ],
    "type-enum": [
      2,
      "always",
      [
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
