import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as benchmarking from "../../index";

chaiUse(sinonChai);

suite("Package webmangler/benchmarking", function() {
  test("benchmarkFn", function() {
    const fn = sinon.spy();
    const result = benchmarking.benchmarkFn({ fn });

    expect(fn).to.have.been.called;
    expect(result).not.to.be.undefined;
  });
});
