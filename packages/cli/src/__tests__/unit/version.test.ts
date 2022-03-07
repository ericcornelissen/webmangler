import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { getVersionsData } from "../../version";

chaiUse(sinonChai);

const processBackup = process;

suite("Version data", function() {
  const missingString = "[missing]";

  let fs: {
    readonly openSync: SinonStub;
    readonly readFileSync: SinonStub;
  };
  let path: {
    readonly resolve: SinonStub;
  };
  let process: {
    readonly cwd: SinonStub;
  };
  let run: SinonStub;

  suiteSetup(function() {
    const cwd = processBackup.cwd();

    fs = {
      openSync: sinon.stub(),
      readFileSync: sinon.stub(),
    };
    path = {
      resolve: sinon.stub(),
    };
    process = {
      cwd: sinon.stub().returns(cwd),
    };
    run = sinon.stub();
  });

  setup(function() {
    fs.openSync.reset();
    fs.readFileSync.reset();
    path.resolve.reset();
    run.reset();

    run.returns("");
  });

  test("cli version", function() {
    const pathToCliManifest = "/path/to/cli/manifest/package.json";
    const cliVersion = "3.1.4";

    const fileHandleToPath = new Map();
    const filePathToHandle = new Map();
    let handlesCounter = 0;

    path.resolve.onFirstCall().returns(pathToCliManifest);
    fs.openSync.callsFake((filePath) => {
      const fileHandle = handlesCounter++;
      fileHandleToPath.set(fileHandle, filePath);
      filePathToHandle.set(filePath, fileHandle);
      return fileHandle;
    });
    fs.readFileSync.callsFake((fileHandle) => {
      const filePath = fileHandleToPath.get(fileHandle);
      if (filePath === pathToCliManifest) {
        return `{"version":"${cliVersion}"}`;
      }
    });

    const result = getVersionsData(fs, path, process, run);
    expect(path.resolve).to.have.been.calledWithExactly(
      process.cwd(),
      "node_modules",
      "webmangler-cli",
      "package.json",
    );
    expect(fs.openSync).to.have.been.calledWithExactly(pathToCliManifest, "r");
    const cliManifestHandle = filePathToHandle.get(pathToCliManifest);
    expect(fs.readFileSync).to.have.been.calledWithExactly(cliManifestHandle);
    expect(result.cli).to.equal(`v${cliVersion}`);
  });

  test("cli manifest missing", function() {
    fs.openSync.onFirstCall().throws();

    const result = getVersionsData(fs, path, process, run);
    expect(result.cli).to.equal(missingString);
  });

  test("core version", function() {
    const pathToCoreManifest = "/path/to/core/manifest/package.json";
    const coreVersion = "1.6.7";

    const fileHandleToPath = new Map();
    const filePathToHandle = new Map();
    let handlesCounter = 0;

    path.resolve.onSecondCall().returns(pathToCoreManifest);
    fs.openSync.callsFake((filePath) => {
      const fileHandle = handlesCounter++;
      fileHandleToPath.set(fileHandle, filePath);
      filePathToHandle.set(filePath, fileHandle);
      return fileHandle;
    });
    fs.readFileSync.callsFake((fileHandle) => {
      const filePath = fileHandleToPath.get(fileHandle);
      if (filePath === pathToCoreManifest) {
        return `{"version":"${coreVersion}"}`;
      }
    });

    const result = getVersionsData(fs, path, process, run);
    expect(path.resolve).to.have.been.calledWithExactly(
      process.cwd(),
      "node_modules",
      "webmangler",
      "package.json",
    );
    expect(fs.openSync).to.have.been.calledWithExactly(pathToCoreManifest, "r");
    const coreManifestHandle = filePathToHandle.get(pathToCoreManifest);
    expect(fs.readFileSync).to.have.been.calledWithExactly(coreManifestHandle);
    expect(result.core).to.equal(`v${coreVersion}`);
  });

  test("core manifest missing", function() {
    fs.openSync.onSecondCall().throws();

    const result = getVersionsData(fs, path, process, run);
    expect(result.core).to.equal(missingString);
  });

  test("node version", function() {
    const nodeVersion = "v12.16.0";
    run.returns(nodeVersion);

    const result = getVersionsData(fs, path, process, run);
    expect(run).to.have.been.calledWithExactly("node", ["--version"]);
    expect(result.node).to.equal(nodeVersion);
  });
});
