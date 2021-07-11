import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as benchmarking from "../index";

chaiUse(sinonChai);

suite("Package webmangler/benchmarking", function() {
  suite("Package exports", function() {
    test("the function getRuntimeBudget", function() {
      expect(benchmarking).to.haveOwnProperty("getRuntimeBudget");
      expect(benchmarking.getRuntimeBudget).to.be.a("function");
    });

    test("the function benchmarkFn", function() {
      expect(benchmarking).to.haveOwnProperty("benchmarkFn");
      expect(benchmarking.benchmarkFn).to.be.a("function");
    });
  });

  suite("Integration tests", function() {
    test("benchmarkFn", function() {
      const fn = sinon.spy();
      const result = benchmarking.benchmarkFn({ fn });

      expect(fn).to.have.been.called;
      expect(result).not.to.be.undefined;
    });
  });
});
