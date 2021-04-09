import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { timeCall } from "../timing";

chaiUse(sinonChai);

suite("Timing", function() {
  suite("::timeCall", function() {
    test("function is called", function() {
      const fn = sinon.fake();

      timeCall(fn);
      expect(fn).to.have.been.called;
    });

    test("function output is returned", function() {
      const returnValues: unknown[] = [
        42,
        "Hello world!",
        ["foo", "bar"],
        { foo: "bar" },
      ];

      for (const returnValue of returnValues) {
        const fn = sinon.stub().returns(returnValue);
        const [, result] = timeCall(fn);
        expect(result).to.equal(returnValue);
      }
    });

    test("call duration is returned", function() {
      const fn = sinon.fake();
      const [duration] = timeCall(fn);
      expect(duration).to.be.a("number");
      expect(duration).to.be.greaterThanOrEqual(0);
    });
  });
});
