import type { SinonStub } from "sinon";

import { expect } from "chai";
import * as sinon from "sinon";

import { timeCall } from "../../index";

suite("Timing", function() {
  suite("::timeCall", function() {
    let callback: SinonStub;

    setup(function() {
      callback = sinon.stub();
    });

    test("call duration is returned", function() {
      const [duration] = timeCall(callback);
      expect(duration).to.be.a("number");
      expect(duration).to.be.greaterThan(0);
    });
  });
});
