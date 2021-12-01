import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as os from "os";

import { getRuntimeBudget } from "../../index";

chaiUse(sinonChai);

suite("Benchmarking budget", function() {
  suite("::getRuntimeBudget", function() {
    const stdCpu = {
      speed: 2500,
    };
    const fastCpu = {
      speed: stdCpu.speed + 500,
    };
    const slowCpu = {
      speed: stdCpu.speed - 500,
    };

    let osCpusStub: SinonStub;

    suiteSetup(function() {
      osCpusStub = sinon.stub(os, "cpus");
    });

    test("default system", function() {
      const budget = 3;

      osCpusStub.returns([stdCpu, stdCpu]);

      const result = getRuntimeBudget(budget);
      expect(result).to.equal(budget);
    });

    test("fast system", function() {
      const budget = 3;

      osCpusStub.returns([fastCpu, fastCpu]);

      const result = getRuntimeBudget(budget);
      expect(result).to.be.lessThan(budget);
    });

    test("slow system", function() {
      const budget = 3;

      osCpusStub.returns([slowCpu, slowCpu]);

      const result = getRuntimeBudget(budget);
      expect(result).to.be.greaterThan(budget);
    });

    suiteTeardown(function() {
      osCpusStub.restore();
    });
  });
});
