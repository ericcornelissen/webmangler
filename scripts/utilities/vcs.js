/**
 * @fileoverview
 * Provides an interface to get Version Control System (VCS) data.
 */

import gitChangedFiles from "git-changed-files";

let __changedFiles = null; // Cache for git-changed-files result

async function getChangedFiles() {
  if (__changedFiles === null) {
    const { committedFiles, unCommittedFiles } = await gitChangedFiles({
      baseBranch: "main",
      formats: ["*"],
      diffFilter: "ACDMTX",
      showStatus: true,
    });

    __changedFiles = committedFiles.concat(unCommittedFiles)
      .filter(notDeletedIn(unCommittedFiles))
      .filter(notDeletedIn(committedFiles))
      .map(({ filename }) => filename);
  }

  return __changedFiles;
}

async function getChangedPackages() {
  const changedFiles = await getChangedFiles();

  const changedPackages = new Set();
  for (const changedFile of changedFiles) {
    const pathMatch = /packages\/([^/]+)\//.exec(changedFile);
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
