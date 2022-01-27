import type { WebManglerLanguagePlugin } from "@webmangler/types";
import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import initWebManglerLanguagePluginMock from "../../web-mangler-language-plugin";

chaiUse(sinonChai);

suite("::initWebManglerLanguagePluginMock", function() {
  const expressionName = "Hello world!";
  const expressionOptions = { };
  const file = { content: "foo", type: "bar" };

  let WebManglerLanguagePluginMock: ReturnType<
    typeof initWebManglerLanguagePluginMock
  >;

  let createStub: SinonStub;

  suiteSetup(function() {
    createStub = sinon.stub();

    WebManglerLanguagePluginMock = initWebManglerLanguagePluginMock({
      createStub,
    });
  });

  setup(function() {
    createStub.resetHistory();
  });

  suite("No inputs provided", function() {
    let subject: WebManglerLanguagePlugin;

    let createdGetEmbedsStub: SinonStub;
    let createdGetExpressionStub: SinonStub;
    let createdGetLanguagesStub: SinonStub;

    suiteSetup(function() {
      createdGetEmbedsStub = sinon.stub();
      createdGetExpressionStub = sinon.stub();
      createdGetLanguagesStub = sinon.stub();

      createStub.onFirstCall().returns(createdGetEmbedsStub);
      createStub.onSecondCall().returns(createdGetExpressionStub);
      createStub.onThirdCall().returns(createdGetLanguagesStub);
    });

    setup(function() {
      subject = new WebManglerLanguagePluginMock();
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(3);
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(createdGetEmbedsStub);
    });

    test("the `getEmbeds` return value", function() {
      const result = subject.getEmbeds(file);
      expect(result).to.deep.equal([]);
    });

    test("the `getExpressions` method value", function() {
      expect(subject.getExpressions).to.equal(createdGetExpressionStub);
    });

    test("the `getExpressions` return value", function() {
      const result = subject.getExpressions(expressionName, expressionOptions);
      expect(result).to.deep.equal(new Map());
    });

    test("the `getLanguages` method value", function() {
      expect(subject.getLanguages).to.equal(createdGetLanguagesStub);
    });

    test("the `getLanguages` return value", function() {
      const result = subject.getLanguages();
      expect(result).to.deep.equal([]);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("Only getEmbeds provided", function() {
    let subject: WebManglerLanguagePlugin;

    let getEmbeds: SinonStub;
    let createdGetExpressionStub: SinonStub;
    let createdGetLanguagesStub: SinonStub;

    suiteSetup(function() {
      getEmbeds = sinon.stub();

      createdGetExpressionStub = sinon.stub();
      createdGetLanguagesStub = sinon.stub();

      createStub.onFirstCall().returns(createdGetExpressionStub);
      createStub.onSecondCall().returns(createdGetLanguagesStub);
    });

    setup(function() {
      subject = new WebManglerLanguagePluginMock({ getEmbeds });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(2);
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(getEmbeds);
    });

    test("the `getExpressions` method value", function() {
      expect(subject.getExpressions).to.equal(createdGetExpressionStub);
    });

    test("the `getExpressions` return value", function() {
      const result = subject.getExpressions(expressionName, expressionOptions);
      expect(result).to.deep.equal(new Map());
    });

    test("the `getLanguages` method value", function() {
      expect(subject.getLanguages).to.equal(createdGetLanguagesStub);
    });

    test("the `getLanguages` return value", function() {
      const result = subject.getLanguages();
      expect(result).to.deep.equal([]);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("Only getExpressions provided", function() {
    let subject: WebManglerLanguagePlugin;

    let getExpressions: SinonStub;
    let createdGetEmbedsStub: SinonStub;
    let createdGetLanguagesStub: SinonStub;

    suiteSetup(function() {
      getExpressions = sinon.stub();

      createdGetEmbedsStub = sinon.stub();
      createdGetLanguagesStub = sinon.stub();

      createStub.onFirstCall().returns(createdGetEmbedsStub);
      createStub.onSecondCall().returns(createdGetLanguagesStub);
    });

    setup(function() {
      subject = new WebManglerLanguagePluginMock({ getExpressions });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(2);
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(createdGetEmbedsStub);
    });

    test("the `getEmbeds` return value", function() {
      const result = subject.getEmbeds(file);
      expect(result).to.deep.equal([]);
    });

    test("the `getExpressions` method value", function() {
      expect(subject.getExpressions).to.equal(getExpressions);
    });

    test("the `getLanguages` method value", function() {
      expect(subject.getLanguages).to.equal(createdGetLanguagesStub);
    });

    test("the `getLanguages` return value", function() {
      const result = subject.getLanguages();
      expect(result).to.deep.equal([]);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("Only getLanguages provided", function() {
    let subject: WebManglerLanguagePlugin;

    let getLanguages: SinonStub;
    let createdGetEmbedsStub: SinonStub;
    let createdGetExpressionStub: SinonStub;

    suiteSetup(function() {
      getLanguages = sinon.stub();

      createdGetEmbedsStub = sinon.stub();
      createdGetExpressionStub = sinon.stub();

      createStub.onFirstCall().returns(createdGetEmbedsStub);
      createStub.onSecondCall().returns(createdGetExpressionStub);
    });

    setup(function() {
      subject = new WebManglerLanguagePluginMock({ getLanguages });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(2);
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(createdGetEmbedsStub);
    });

    test("the `getEmbeds` return value", function() {
      const result = subject.getEmbeds(file);
      expect(result).to.deep.equal([]);
    });

    test("the `getExpressions` method value", function() {
      expect(subject.getExpressions).to.equal(createdGetExpressionStub);
    });

    test("the `getExpressions` return value", function() {
      const result = subject.getExpressions(expressionName, expressionOptions);
      expect(result).to.deep.equal(new Map());
    });

    test("the `getLanguages` method value", function() {
      expect(subject.getLanguages).to.equal(getLanguages);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("Both getEmbeds and getExpressions provided", function() {
    let subject: WebManglerLanguagePlugin;

    let getEmbeds: SinonStub;
    let getExpressions: SinonStub;
    let createdGetLanguagesStub: SinonStub;

    suiteSetup(function() {
      getEmbeds = sinon.stub();
      getExpressions = sinon.stub();

      createdGetLanguagesStub = sinon.stub();

      createStub.onFirstCall().returns(createdGetLanguagesStub);
    });

    setup(function() {
      subject = new WebManglerLanguagePluginMock({
        getEmbeds,
        getExpressions,
      });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(1);
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(getEmbeds);
    });

    test("the `getExpressions` method value", function() {
      expect(subject.getExpressions).to.equal(getExpressions);
    });

    test("the `getLanguages` method value", function() {
      expect(subject.getLanguages).to.equal(createdGetLanguagesStub);
    });

    test("the `getLanguages` return value", function() {
      const result = subject.getLanguages();
      expect(result).to.deep.equal([]);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("Both getEmbeds and getLanguages provided", function() {
    let subject: WebManglerLanguagePlugin;

    let getEmbeds: SinonStub;
    let getLanguages: SinonStub;
    let createdGetExpressionStub: SinonStub;

    suiteSetup(function() {
      getEmbeds = sinon.stub();
      getLanguages = sinon.stub();

      createdGetExpressionStub = sinon.stub();

      createStub.onFirstCall().returns(createdGetExpressionStub);
    });

    setup(function() {
      subject = new WebManglerLanguagePluginMock({
        getEmbeds,
        getLanguages,
      });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(1);
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(getEmbeds);
    });

    test("the `getExpressions` method value", function() {
      expect(subject.getExpressions).to.equal(createdGetExpressionStub);
    });

    test("the `getExpressions` return value", function() {
      const result = subject.getExpressions(expressionName, expressionOptions);
      expect(result).to.deep.equal(new Map());
    });

    test("the `getLanguages` method value", function() {
      expect(subject.getLanguages).to.equal(getLanguages);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("Both getExpressions and getLanguages provided", function() {
    let subject: WebManglerLanguagePlugin;

    let getExpressions: SinonStub;
    let getLanguages: SinonStub;
    let createdGetEmbedsStub: SinonStub;

    suiteSetup(function() {
      getExpressions = sinon.stub();
      getLanguages = sinon.stub();

      createdGetEmbedsStub = sinon.stub();

      createStub.onFirstCall().returns(createdGetEmbedsStub);
    });

    setup(function() {
      subject = new WebManglerLanguagePluginMock({
        getExpressions,
        getLanguages,
      });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(1);
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(createdGetEmbedsStub);
    });

    test("the `getEmbeds` return value", function() {
      const result = subject.getEmbeds(file);
      expect(result).to.deep.equal([]);
    });

    test("the `getExpressions` method value", function() {
      expect(subject.getExpressions).to.equal(getExpressions);
    });

    test("the `getLanguages` method value", function() {
      expect(subject.getLanguages).to.equal(getLanguages);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("All inputs provided", function() {
    let subject: WebManglerLanguagePlugin;

    let getEmbeds: SinonStub;
    let getExpressions: SinonStub;
    let getLanguages: SinonStub;

    suiteSetup(function() {
      getEmbeds = sinon.stub();
      getExpressions = sinon.stub();
      getLanguages = sinon.stub();
    });

    setup(function() {
      subject = new WebManglerLanguagePluginMock({
        getEmbeds,
        getExpressions,
        getLanguages,
      });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(0);
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(getEmbeds);
    });

    test("the `getExpressions` method value", function() {
      expect(subject.getExpressions).to.equal(getExpressions);
    });

    test("the `getLanguages` method value", function() {
      expect(subject.getLanguages).to.equal(getLanguages);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });
});
