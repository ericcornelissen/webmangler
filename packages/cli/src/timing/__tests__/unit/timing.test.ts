import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { createTimeCall } from "../../timing";

chaiUse(sinonChai);

suite("Timing", function() {
  suite("::createTimeCall", function() {
    let timeCall: ReturnType<typeof createTimeCall>;

    let callback: SinonStub;
    let time: {
      now: SinonStub;
    };

    suiteSetup(function() {
      callback = sinon.stub();
      time = {
        now: sinon.stub(),
      };

      timeCall = createTimeCall(time);
    });

    setup(function() {
      callback.reset();
      time.now.reset();
    });

    test("function is called", function() {
      timeCall(callback);
      expect(callback).to.have.callCount(1);
    });

    test("function output is returned", function() {
      const returnValues: unknown[] = [
        42,
        "Hello world!",
        ["foo", "bar"],
        { foo: "bar" },
      ];

      for (const returnValue of returnValues) {
        callback.returns(returnValue);
        const [, result] = timeCall(callback);
        expect(result).to.equal(returnValue);
      }
    });

    test("time dependency is used", function() {
      timeCall(callback);
      expect(time.now).to.have.callCount(2);
    });

    test("call duration is returned", function() {
      const tStart = 3;
      const tEnd = 5;

      time.now.onFirstCall().returns(tStart);
      time.now.onSecondCall().returns(tEnd);

      const [duration] = timeCall(callback);
      expect(duration).to.be.a("number");
      expect(duration).to.equal(tEnd - tStart);
    });
  });
});
