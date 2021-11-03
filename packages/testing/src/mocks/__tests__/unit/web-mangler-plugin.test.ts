import type { WebManglerPlugin } from "@webmangler/types";
import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import initWebManglerPluginMock from "../../web-mangler-plugin";

chaiUse(sinonChai);

suite("::initWebManglerPluginMock", function() {
  let WebManglerPluginMock: ReturnType<typeof initWebManglerPluginMock>;

  let createStub: SinonStub;

  suiteSetup(function() {
    createStub = sinon.stub();

    WebManglerPluginMock = initWebManglerPluginMock({
      createStub,
    });
  });

  setup(function() {
    createStub.resetHistory();
  });

  suite("No inputs provided", function() {
    let subject: WebManglerPlugin;

    let firstCreatedStub: { returns: SinonStub; };

    suiteSetup(function() {
      firstCreatedStub = {
        returns: sinon.stub(),
      };
      firstCreatedStub.returns.returns(firstCreatedStub);

      createStub.onFirstCall().returns(firstCreatedStub);
    });

    setup(function() {
      firstCreatedStub.returns.resetHistory();

      subject = new WebManglerPluginMock();
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(1);
    });

    test("the first created stub", function() {
      expect(firstCreatedStub.returns).to.have.callCount(1);
      expect(firstCreatedStub.returns).to.have.been.calledWithExactly(
        sinon.match.object,
      );
    });

    test("the `options` method value", function() {
      expect(subject.options).to.equal(firstCreatedStub);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("All inputs provided", function() {
    let subject: WebManglerPlugin;

    let options: SinonStub;

    suiteSetup(function() {
      options = sinon.stub();
    });

    setup(function() {
      subject = new WebManglerPluginMock({ options });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(0);
    });

    test("the `options` method value", function() {
      expect(subject.options).to.equal(options);
    });
  });
});
