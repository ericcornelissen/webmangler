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

import gitChangedFiles from "git-changed-files";
import * as path from "path";

import execSync from "./utilities/exec.js";
import log from "./utilities/log.js";
import * as paths from "./paths.js";

const ALL_FLAG = "--all";
const FORMAT_FLAG = "--format";

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

let __changedFiles = null; // Cache for git-changed-files result

main(process.argv);

async function main(argv) {
  argv = argv.slice(2);

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
      ...filesToLint,
    ];

    if (argv.includes(FORMAT_FLAG)) {
      args.push(linter.fixArg);
    }

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
  if (argv.includes(ALL_FLAG)) {
    return ["."];
  } else {
    const changedFiles = await getChangedFiles();
    return changedFiles.filter(
      (file) => exts.some((ext) => path.extname(file) === `.${ext}`),
    );
  }
}

async function getChangedFiles() {
  if (__changedFiles === null) {
    const { committedFiles, unCommittedFiles } = await gitChangedFiles({
      baseBranch: "main",
      formats: ["*"],
      diffFilter: "ACDMRTX",
      showStatus: true,
    });

    __changedFiles = committedFiles.concat(unCommittedFiles)
      .filter(notDeletedIn(unCommittedFiles))
      .map(({ filename }) => filename);
  }

  return __changedFiles;
}

function notDeletedIn(entries) {
  return (subject) => {
    for (const entry of entries) {
      if (subject.filename === entry.filename) {
        return entry.status !== "Deleted";
      }
    }

    return true;
  };
}
