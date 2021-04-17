import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as cp from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { getVersionsData } from "../version";

chaiUse(sinonChai);

suite("Version data", function() {
  const missingString = "[missing]";
  const nodeVersion = "v12.16.0";
  const projectRoot = "/project";

  const webmanglerManifest = path.resolve(
    projectRoot,
    "node_modules",
    "webmangler",
    "package.json",
  );
  const webmanglerCliManifest = path.resolve(
    projectRoot,
    "node_modules",
    "webmangler-cli",
    "package.json",
  );

  const filesMap: Map<string, unknown> = new Map();

  let cpExecFileSyncStub: SinonStub;
  let fsExistsSyncStub: SinonStub;
  let fsReadFileSyncStub: SinonStub;
  let processCwdStub: SinonStub;

  suiteSetup(function() {
    cpExecFileSyncStub = sinon.stub(cp, "execFileSync");
    cpExecFileSyncStub.withArgs("node", ["--version"]).returns(nodeVersion);

    fsExistsSyncStub = sinon.stub(fs, "existsSync");
    fsExistsSyncStub.callsFake((filePath: string): boolean => {
      return filesMap.has(filePath);
    });

    fsReadFileSyncStub = sinon.stub(fs, "readFileSync");
    fsReadFileSyncStub.callsFake((filePath: string): string => {
      const fileData = filesMap.get(filePath);
      const fileContent = JSON.stringify(fileData);
      return fileContent;
    });

    processCwdStub = sinon.stub(process, "cwd");
    processCwdStub.returns(projectRoot);
  });

  setup(function() {
    filesMap.clear();
  });

  test("cli version", function() {
    const cliVersion = "3.1.4";
    filesMap.set(webmanglerCliManifest, { version: cliVersion });

    const result = getVersionsData();
    expect(result.cli).to.equal(`v${cliVersion}`);
  });

  test("cli manifest missing", function() {
    filesMap.delete(webmanglerCliManifest);

    const result = getVersionsData();
    expect(result.cli).to.equal(missingString);
  });

  test("core version", function() {
    const coreVersion = "1.6.7";
    filesMap.set(webmanglerManifest, { version: coreVersion });

    const result = getVersionsData();
    expect(result.core).to.equal(`v${coreVersion}`);
  });

  test("core manifest missing", function() {
    filesMap.delete(webmanglerCliManifest);

    const result = getVersionsData();
    expect(result.core).to.equal(missingString);
  });

  test("node version", function() {
    const result = getVersionsData();
    expect(cpExecFileSyncStub).to.have.been.calledWith("node", ["--version"]);
    expect(result.node).to.equal(nodeVersion);
  });

  suiteTeardown(function() {
    cpExecFileSyncStub.restore();
    fsExistsSyncStub.restore();
    fsReadFileSyncStub.restore();
    processCwdStub.restore();
  });
});
