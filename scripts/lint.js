#!/usr/bin/env node
/**
 * @fileoverview
 * Run linters in the repository. The script can be instrumented to format
 * fixable linting errors using the `--fix` flag and can be configured to lint
 * only types of a specific type by providing the type as an argument (e.g.
 * "js").
 *
 * By default only VCS changed files are linted, use the `--all` flag to lint
 * all files in the project.
 */

import * as path from "node:path";
import process from "node:process";

import execSync from "./utilities/exec.js";
import { checkFlags } from "./utilities/flags.js";
import log from "./utilities/log.js";
import * as paths from "./utilities/paths.js";
import vcs from "./utilities/vcs.js";

const FLAGS = {
  ALL: "--all",
  FORMAT: "--format",
};

const SUPPORTED_LANGUAGES = [
  "js",
  "json",
  "md",
  "ts",
  "yml",
];

const jsExts = ["cjs", "js"];
const jsonExts = ["json"];
const mdExts = ["md"];
const tsExts = ["ts"];
const ymlExts = ["yml"];

const eslintBin = path.resolve(paths.nodeBin, "eslint");
const mdlintBin = path.resolve(paths.nodeBin, "markdownlint");

main(process.argv.slice(2));

async function main(argv) {
  checkFlags(Object.values(FLAGS), argv);

  log.print("Initializing Linter...");
  const languages = getLanguagesToLint(argv);
  const linters = getLintersForLanguages(languages);

  log.reprint("Linting...");
  for (const linter of linters) {
    await runLinter(argv, linter);
  }
  log.reprintln("Finished Linting");
}

async function runLinter(argv, linter) {
  const filesToLint = await getFilesToLint(argv, linter.exts);
  if (filesToLint.length > 0) {
    const args = [
      ...linter.args,
      argv.includes(FLAGS.FORMAT) ? linter.fixArg : "",
      "--",
      ...filesToLint,
    ];

    execSync(linter.bin, args, {
      stdio: ["inherit", "inherit", "inherit"],
    });
  }
}

function getLanguagesToLint(argv) {
  const running = [];
  for (const arg of argv) {
    if (SUPPORTED_LANGUAGES.includes(arg)) {
      running.push(arg);
    }
  }

  if (running.length === 0) {
    return SUPPORTED_LANGUAGES;
  } else {
    return running;
  }
}

function getLintersForLanguages(languages) {
  return languages.flatMap((language) => {
    switch (language) {
    case "js":
      return [
        newEslintConfig(jsExts),
      ];
    case "json":
      return [
        newEslintConfig(jsonExts),
      ];
    case "md":
      return [
        newEslintConfig(mdExts),
        newMarkDownLintConfig(mdExts),
      ];
    case "ts":
      return [
        newEslintConfig(tsExts),
      ];
    case "yml":
      return [
        newEslintConfig(ymlExts),
      ];
    }
  });
}

function newEslintConfig(exts) {
  return {
    args: ["--ext", exts.join(",")],
    bin: eslintBin,
    exts,
    fixArg: "--fix",
  };
}

function newMarkDownLintConfig(exts) {
  return {
    args: ["--dot", "--ignore-path", ".gitignore"],
    bin: mdlintBin,
    exts,
    fixArg: "--fix",
  };
}

async function getFilesToLint(argv, exts) {
  if (argv.includes(FLAGS.ALL)) {
    return ["."];
  } else {
    const changedFiles = await vcs.getChangedFiles();
    return changedFiles.filter(
      (file) => exts.some((ext) => path.extname(file) === `.${ext}`),
    );
  }
}
