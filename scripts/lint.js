#!/usr/bin/env node
/**
 * @fileoverview
 * Run linters in the repository. Allows for enabling formatting as well as what
 * files to lint (by default only changed files).
 */

import gitChangedFiles from "git-changed-files";
import * as path from "path";

import execSync from "./utilities/exec.js";
import log from "./utilities/log.js";
import * as paths from "./paths.js";

const ALL_FLAG = "--all";
const FORMAT_FLAG = "--format";

const eslintBin = path.resolve(paths.nodeModules, ".bin", "eslint");

main(process.argv);

async function main(argv) {
  argv = argv.slice(2);

  const cmd = getCliCommand(argv);
  const cmdArgs = getCommandArgs(argv);
  const filesToLint = await getFilesToLint(argv);
  const args = [...cmdArgs, ...filesToLint];

  runLint(cmd, args);
}

function runLint(cmd, cmdArgs) {
  log.println("Running linter...");
  execSync(cmd, cmdArgs, {
    stdio: ["inherit", "inherit", "inherit"],
  });
}

function getCliCommand() {
  return eslintBin;
}

function getCommandArgs(argv) {
  const args = [
    "--ext",
    ".js,.json,.md,.ts,.yml",
  ];

  if (argv.includes(FORMAT_FLAG)) {
    args.push("--fix");
  }

  return args;
}

async function getFilesToLint(argv) {
  if (argv.includes(ALL_FLAG)) {
    return ["."];
  } else {
    return await getChangedFiles();
  }
}

async function getChangedFiles() {
  const { committedFiles, unCommittedFiles } = await gitChangedFiles({
    baseBranch: "main",
    formats: ["*"],
    diffFilter: "ACMRTX",
  });

  const changedFiles = committedFiles.concat(unCommittedFiles);
  return changedFiles;
}
