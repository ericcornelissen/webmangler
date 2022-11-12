/**
 * @fileoverview
 * Provides an interface to get Version Control System (VCS) data.
 */

import { execFileSync } from "node:child_process";

import gitChangedFiles from "git-changed-files";

let __changedFiles = null; // Cache for git-changed-files result

function dirty() {
  const stdout = execFileSync(
    "git",
    ["status", "--porcelain"],
    { encoding: "utf-8" },
  );

  return stdout.trim() !== "";
}

async function getChangedFiles() {
  if (__changedFiles === null) {
    const base = dirty() ? "HEAD~1" : "main";
    const { committedFiles, unCommittedFiles } = await gitChangedFiles({
      baseBranch: base,
      formats: ["*"],
      diffFilter: "ACDMTX",
      showStatus: true,
    });

    if (__changedFiles === null) {
      __changedFiles = committedFiles.concat(unCommittedFiles)
        .filter(notDeletedIn(unCommittedFiles))
        .filter(notDeletedIn(committedFiles))
        .map(({ filename }) => filename);
    }
  }

  return __changedFiles;
}

async function getChangedPackages() {
  const changedFiles = await getChangedFiles();

  const changedPackages = new Set();
  for (const changedFile of changedFiles) {
    const pathMatch = /packages\/[^/]+\//.exec(changedFile);
    if (pathMatch !== null) {
      const [, packageName] = pathMatch;
      changedPackages.add(packageName);
    }
  }

  return Array.from(changedPackages);
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

export default {
  getChangedFiles,
  getChangedPackages,
};
