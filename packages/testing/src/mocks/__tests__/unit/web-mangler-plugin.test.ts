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

    let createdOptionsStub: SinonStub;

    suiteSetup(function() {
      createdOptionsStub = sinon.stub();

      createStub.onFirstCall().returns(createdOptionsStub);
    });

    setup(function() {
      subject = new WebManglerPluginMock();
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(1);
    });

    test("the `options` method value", function() {
      expect(subject.options).to.equal(createdOptionsStub);
    });

    test("the `options` return value", function() {
      const result = subject.options();
      expect(result).to.deep.equal({});
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
