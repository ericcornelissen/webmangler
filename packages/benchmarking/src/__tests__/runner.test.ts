import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as perf from "perf_hooks";

import { benchmarkFn } from "../runner";

chaiUse(sinonChai);

suite("Benchmarking runner", function() {
  suite("::benchmarkFn", function() {
    let performanceNow: SinonStub;

    suiteSetup(function() {
      performanceNow = sinon.stub(perf.performance, "now");
    });

    test("default iterations", function() {
      const spy = sinon.spy();

      const result = benchmarkFn({ fn: spy });
      expect(spy).to.have.been.called;
      expect(result).not.to.be.undefined;
      expect(result.medianDuration).not.to.be.undefined;
    });

    test("custom iterations", function() {
      const testCases: number[] = [1, 25, 50, 75];
      for (const repetitions of testCases) {
        const spy = sinon.spy();

        const result = benchmarkFn({ fn: spy, repetitions });
        expect(spy).to.have.callCount(repetitions);
        expect(result).not.to.be.undefined;
        expect(result.medianDuration).not.to.be.undefined;
      }
    });

    test("setup", function() {
      const setupSpy = sinon.spy();

      benchmarkFn({
        fn: sinon.spy(),
        setup: setupSpy,
      });

      expect(setupSpy).to.have.been.called;
    });

    test("setup with custom iterations", function() {
      const testCases: number[] = [1, 25, 50, 75];
      for (const repetitions of testCases) {
        const setupSpy = sinon.spy();

        benchmarkFn({
          fn: sinon.spy(),
          repetitions,
          setup: setupSpy,
        });

        expect(setupSpy).to.have.callCount(repetitions);
      }
    });

    test("median duration", function() {
      const fake = sinon.fake();

      performanceNow.reset();
      performanceNow.onFirstCall().returns(1);
      performanceNow.onSecondCall().returns(2);

      const result = benchmarkFn({
        fn: fake,
        repetitions: 1,
      });

      expect(result.medianDuration).to.equal(1);
    });

    suiteTeardown(function() {
      performanceNow.restore();
    });
  });
});
