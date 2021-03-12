import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as os from "os";

import {
  benchmarkFn,
  getRuntimeBudget,
} from "./benchmark-helpers";

chaiUse(sinonChai);

suite("Benchmarking Helpers", function() {
  suite("::benchmarkFn", function() {
    test("default iterations", function() {
      const spy = sinon.spy();

      const result = benchmarkFn(spy);
      expect(spy).to.have.been.called;
      expect(result).not.to.be.undefined;
      expect(result.medianDuration).not.to.be.undefined;
    });

    test("custom iterations", function() {
      const testCases: number[] = [1, 25, 50, 75];
      for (const repetitions of testCases) {
        const spy = sinon.spy();

        const result = benchmarkFn(spy, repetitions);
        expect(spy).to.have.callCount(repetitions);
        expect(result).not.to.be.undefined;
        expect(result.medianDuration).not.to.be.undefined;
      }
    });
  });

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
