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

export default {
  getChangedFiles,
};
