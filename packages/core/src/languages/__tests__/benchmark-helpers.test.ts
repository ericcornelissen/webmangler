import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as fs from "fs";

import { benchmarkFn, readFile } from "./benchmark-helpers";

chaiUse(sinonChai);

suite("Benchmarking Helpers", function() {
  suite("::benchmarkFn", function() {
    test("default iterations", function() {
      const spy = sinon.spy();

      const result = benchmarkFn(spy);
      expect(result).not.to.be.undefined;
      expect(result.medianDuration).not.to.be.undefined;

      expect(spy).to.have.been.called;
    });

    test("custom iterations", function() {
      const testCases: number[] = [25, 50, 75];
      for (const n of testCases) {
        const spy = sinon.spy();

        benchmarkFn(spy, n);
        expect(spy).to.have.callCount(n);
      }
    });
  });

  suite("::readFile", function() {
    let fsReadFileSyncStub: SinonStub;

    suiteSetup(function() {
      fsReadFileSyncStub = sinon.stub(fs, "readFileSync");
    });

    test("read existing file", function() {
      const content = "foobar";
      fsReadFileSyncStub.returns(content);

      const result = readFile("foo.bar");
      expect(result).to.equal(content);
    });

    test("read missing file", function() {
      fsReadFileSyncStub.throwsException("file no found");

      expect(() => readFile("foo.bar")).to.throw();
    });

    suiteTeardown(function() {
      fsReadFileSyncStub.restore();
    });
  });
});
