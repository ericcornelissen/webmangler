import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as os from "os";

import { getRuntimeBudget } from "../budget";

chaiUse(sinonChai);

suite("Benchmarking budget", function() {
  suite("::getRuntimeBudget", function() {
    const testDefaultCpuSpeed = 2500;

    let osCpusStub: SinonStub;

    suiteSetup(function() {
      osCpusStub = sinon.stub(os, "cpus");
    });

    test("default system", function() {
      const budget = 3;

      osCpusStub.returns([
        { speed: testDefaultCpuSpeed },
      ]);

      const result = getRuntimeBudget(budget);
      expect(result).to.equal(budget);
    });

    test("fast system", function() {
      const budget = 3;

      osCpusStub.returns([
        { speed: testDefaultCpuSpeed + 500 },
      ]);

      const result = getRuntimeBudget(budget);
      expect(result).to.be.lessThan(budget);
    });

    test("slow system", function() {
      const budget = 3;

      osCpusStub.returns([
        { speed: testDefaultCpuSpeed - 500 },
      ]);

      const result = getRuntimeBudget(budget);
      expect(result).to.be.greaterThan(budget);
    });

    suiteTeardown(function() {
      osCpusStub.restore();
    });
  });
});
