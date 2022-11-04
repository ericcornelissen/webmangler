import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

import { expect } from "chai";

import { getVersionsData } from "../../version";

suite("Version data", function() {
  const versionExpr = /^v\d+\.\d+\.\d+$/;

  let result: ReturnType<typeof getVersionsData>;

  suiteSetup(function() {
    result = getVersionsData(fs, path, process, execFileSync);
  });

  test("cli version", function() {
    expect(result.cli).to.match(versionExpr);
  });

  test("core version", function() {
    expect(result.core).to.match(versionExpr);
  });

  test("node version", function() {
    expect(result.core).to.match(versionExpr);
  });
});
