import type { SinonStub } from "sinon";

import type { WebManglerPluginConstructor } from "../../types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import {
  newCheckWebManglerPlugin,
} from "../../all";

chaiUse(sinonChai);

suite("Plugin checks", function() {
  suite("::checkConstructor", function() {
    let checkWebManglerPlugin: ReturnType<typeof newCheckWebManglerPlugin>;

    let constructor: WebManglerPluginConstructor;

    let checkA: SinonStub;
    let checkB: SinonStub;

    suiteSetup(function() {
      constructor = sinon.stub() as unknown as WebManglerPluginConstructor;

      checkA = sinon.stub();
      checkB = sinon.stub();

      checkWebManglerPlugin = newCheckWebManglerPlugin([
        checkA,
        checkB,
      ]);
    });

    setup(function() {
      checkA.reset();
      checkB.reset();
    });

    test("nothing is invalid", function() {
      const [valid, msg] = checkWebManglerPlugin(constructor);
      expect(valid).to.be.true;
      expect(msg).to.equal("");
    });

    test("return value when the first check fails", function() {
      const response = "foobar";
      checkA.returns(response);

      const [valid, msg] = checkWebManglerPlugin(constructor);
      expect(valid).to.be.false;
      expect(msg).to.equal(response);
    });

    test("return value when the second check fails", function() {
      const response = "Hello world!";
      checkB.returns(response);

      const [valid, msg] = checkWebManglerPlugin(constructor);
      expect(valid).to.be.false;
      expect(msg).to.equal(response);
    });
  });
});
