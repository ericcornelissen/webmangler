import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as perf from "perf_hooks";

import { doBenchmark } from "../../index";

chaiUse(sinonChai);

suite("Benchmarking runner", function() {
  suite("::doBenchmark", function() {
    let performanceNow: SinonStub;

    suiteSetup(function() {
      performanceNow = sinon.stub(perf.performance, "now");
    });

    test("default iterations", function() {
      const spy = sinon.spy();

      const results = doBenchmark({ fn: spy });
      expect(spy).to.have.been.called;
      expect(results).to.have.length.above(0);
    });

    test("custom iterations", function() {
      const testCases: number[] = [1, 25, 50, 75];
      for (const repetitions of testCases) {
        const spy = sinon.spy();

        const results = doBenchmark({ fn: spy, repetitions });
        expect(spy).to.have.callCount(repetitions);
        expect(results).to.have.lengthOf(repetitions);
      }
    });

    test("setup", function() {
      const setupSpy = sinon.spy();

      doBenchmark({
        fn: sinon.fake(),
        setup: setupSpy,
      });

      expect(setupSpy).to.have.been.called;
    });

    test("setup with custom iterations", function() {
      const testCases: number[] = [1, 25, 50, 75];
      for (const repetitions of testCases) {
        const setupSpy = sinon.spy();

        doBenchmark({
          fn: sinon.fake(),
          repetitions,
          setup: setupSpy,
        });

        expect(setupSpy).to.have.callCount(repetitions);
      }
    });

    test("run duration", function() {
      const timeBefore = 3;
      const timeAfter = 14;

      performanceNow.reset();
      performanceNow.onFirstCall().returns(timeBefore);
      performanceNow.onSecondCall().returns(timeAfter);

      const results = doBenchmark({ fn: sinon.fake() });

      expect(results).to.have.length.above(0);

      const result = results[0];
      expect(result.duration).to.equal(timeAfter - timeBefore);
    });

    suiteTeardown(function() {
      performanceNow.restore();
    });
  });
});
