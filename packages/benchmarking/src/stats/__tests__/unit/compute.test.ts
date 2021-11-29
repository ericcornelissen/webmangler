import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { newComputeStats } from "../../compute";

chaiUse(sinonChai);

suite("Benchmarking stats computation", function() {
  suite("::newComputeStats", function() {
    let computeStats: ReturnType<typeof newComputeStats>;

    let math: {
      medianOf: SinonStub;
    };

    suiteSetup(function() {
      math = {
        medianOf: sinon.stub(),
      };

      computeStats = newComputeStats(math);
    });

    setup(function() {
      math.medianOf.resetHistory();
    });

    test("call the medianOf function", function() {
      computeStats([]);
      expect(math.medianOf).to.have.callCount(1);
    });

    test("compute the median duration", function() {
      const durations = [
        1,
        2,
        3,
      ];
      const values = durations.map((duration) => ({
        duration,
      }));

      computeStats(values);
      expect(math.medianOf).to.have.been.calledWithExactly(durations);
    });
  });
});
