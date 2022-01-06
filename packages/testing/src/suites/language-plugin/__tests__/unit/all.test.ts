import type { SinonStub } from "sinon";

import type { WebManglerLanguagePluginConstructor } from "../../types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import {
  newCheckWebManglerLanguagePlugin,
} from "../../all";

chaiUse(sinonChai);

suite("Language plugin checks", function() {
  suite("::checkConstructor", function() {
    let checkWebManglerLanguagePlugin:
      ReturnType<typeof newCheckWebManglerLanguagePlugin>;

    let constructor: WebManglerLanguagePluginConstructor;

    let checkA: SinonStub;
    let checkB: SinonStub;

    suiteSetup(function() {
      constructor =
        sinon.stub() as unknown as WebManglerLanguagePluginConstructor;

      checkA = sinon.stub();
      checkB = sinon.stub();

      checkWebManglerLanguagePlugin = newCheckWebManglerLanguagePlugin([
        checkA,
        checkB,
      ]);
    });

    setup(function() {
      checkA.reset();
      checkB.reset();
    });

    test("nothing is invalid", function() {
      const [valid, msg] = checkWebManglerLanguagePlugin(constructor);
      expect(valid).to.be.true;
      expect(msg).to.equal("");
    });

    test("return value when the first check fails", function() {
      const response = "foobar";
      checkA.returns(response);

      const [valid, msg] = checkWebManglerLanguagePlugin(constructor);
      expect(valid).to.be.false;
      expect(msg).to.equal(response);
    });

    test("return value when the second check fails", function() {
      const response = "Hello world!";
      checkB.returns(response);

      const [valid, msg] = checkWebManglerLanguagePlugin(constructor);
      expect(valid).to.be.false;
      expect(msg).to.equal(response);
    });
  });
});
