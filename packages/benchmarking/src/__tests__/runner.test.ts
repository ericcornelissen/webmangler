import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { benchmarkFn } from "../runner";

chaiUse(sinonChai);

suite("Benchmarking runner", function() {
  suite("::benchmarkFn", function() {
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
  });
});
