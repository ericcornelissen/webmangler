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
    readonly existsSync: SinonStub;
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
      existsSync: sinon.stub(),
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
    fs.existsSync.reset();
    fs.openSync.reset();
    fs.readFileSync.reset();
    path.resolve.reset();
    run.reset();

    fs.existsSync.returns(false);
    run.returns("");
  });

  test("cli version", function() {
    const pathToCliManifest = "/path/to/cli/manifest/package.json";
    const cliVersion = "3.1.4";

    path.resolve.onFirstCall().returns(pathToCliManifest);
    fs.existsSync.callsFake((arg) => {
      return arg === pathToCliManifest;
    });
    fs.readFileSync.callsFake((arg) => {
      if (arg === pathToCliManifest) {
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
    expect(fs.existsSync).to.have.been.calledWithExactly(pathToCliManifest);
    expect(fs.readFileSync).to.have.been.calledWithExactly(pathToCliManifest);
    expect(result.cli).to.equal(`v${cliVersion}`);
  });

  test("cli manifest missing", function() {
    fs.existsSync.onFirstCall().returns(false);

    const result = getVersionsData(fs, path, process, run);
    expect(result.cli).to.equal(missingString);
  });

  test("core version", function() {
    const pathToCoreManifest = "/path/to/core/manifest/package.json";
    const coreVersion = "1.6.7";

    path.resolve.onSecondCall().returns(pathToCoreManifest);
    fs.existsSync.callsFake((arg) => {
      return arg === pathToCoreManifest;
    });
    fs.readFileSync.callsFake((arg) => {
      if (arg === pathToCoreManifest) {
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
    expect(fs.existsSync).to.have.been.calledWithExactly(pathToCoreManifest);
    expect(fs.readFileSync).to.have.been.calledWithExactly(pathToCoreManifest);
    expect(result.core).to.equal(`v${coreVersion}`);
  });

  test("core manifest missing", function() {
    fs.existsSync.onSecondCall().returns(false);

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
