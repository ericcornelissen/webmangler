import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import {
  newCheckAll,
} from "../../utils";

chaiUse(sinonChai);

suite("Suite utilities", function() {
  suite("::checkAll", function() {
    let checkAll: ReturnType<typeof newCheckAll>;

    let subject: unknown;

    let checkA: SinonStub;
    let checkB: SinonStub;

    suiteSetup(function() {
      subject = sinon.stub();

      checkA = sinon.stub();
      checkB = sinon.stub();

      checkAll = newCheckAll([
        checkA,
        checkB,
      ]);
    });

    setup(function() {
      checkA.reset();
      checkB.reset();
    });

    test("nothing is invalid", function() {
      const [valid, msg] = checkAll(subject);
      expect(valid).to.be.true;
      expect(msg).to.equal("");
    });

    test("return value when the first check fails", function() {
      const response = "foobar";
      checkA.returns(response);

      const [valid, msg] = checkAll(subject);
      expect(valid).to.be.false;
      expect(msg).to.equal(response);
    });

    test("return value when the second check fails", function() {
      const response = "Hello world!";
      checkB.returns(response);

      const [valid, msg] = checkAll(subject);
      expect(valid).to.be.false;
      expect(msg).to.equal(response);
    });
  });
});
