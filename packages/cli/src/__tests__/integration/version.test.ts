import { execFileSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";

import { getVersionsData } from "../../version";

suite("Version data", function() {
  const versionExpr = /^v[0-9]+\.[0-9]+\.[0-9]+$/;

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
