import { expect } from "chai";

import * as benchmarking from "../index";

suite("Package exports - webmangler/benchmarking", function() {
  test("the function getRuntimeBudget", function() {
    expect(benchmarking).to.haveOwnProperty("getRuntimeBudget");
    expect(benchmarking.getRuntimeBudget).to.be.a("function");
  });

  test("the function benchmarkFn", function() {
    expect(benchmarking).to.haveOwnProperty("benchmarkFn");
    expect(benchmarking.benchmarkFn).to.be.a("function");
  });
});
