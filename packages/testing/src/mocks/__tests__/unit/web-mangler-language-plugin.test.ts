import type { WebManglerLanguagePlugin } from "@webmangler/types";
import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import initWebManglerLanguagePluginMock from "../../web-mangler-language-plugin";

chaiUse(sinonChai);

suite("::initWebManglerLanguagePluginMock", function() {
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

    let firstCreatedStub: { returns: SinonStub; };
    let secondCreatedStub: { returns: SinonStub; };
    let thirdCreatedStub: { returns: SinonStub; };

    suiteSetup(function() {
      firstCreatedStub = {
        returns: sinon.stub(),
      };
      firstCreatedStub.returns.returns(firstCreatedStub);

      secondCreatedStub = {
        returns: sinon.stub(),
      };
      secondCreatedStub.returns.returns(secondCreatedStub);

      thirdCreatedStub = {
        returns: sinon.stub(),
      };
      thirdCreatedStub.returns.returns(thirdCreatedStub);

      createStub.onFirstCall().returns(firstCreatedStub);
      createStub.onSecondCall().returns(secondCreatedStub);
      createStub.onThirdCall().returns(thirdCreatedStub);
    });

    setup(function() {
      firstCreatedStub.returns.resetHistory();
      secondCreatedStub.returns.resetHistory();
      thirdCreatedStub.returns.resetHistory();

      subject = new WebManglerLanguagePluginMock();
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(3);
    });

    test("the first created stub", function() {
      expect(firstCreatedStub.returns).to.have.callCount(1);
      expect(firstCreatedStub.returns).to.have.been.calledWithExactly(
        sinon.match.array,
      );
    });

    test("the second created stub", function() {
      expect(secondCreatedStub.returns).to.have.callCount(1);
      expect(secondCreatedStub.returns).to.have.been.calledWithExactly(
        sinon.match.map,
      );
    });

    test("the third created stub", function() {
      expect(thirdCreatedStub.returns).to.have.callCount(1);
      expect(thirdCreatedStub.returns).to.have.been.calledWithExactly(
        sinon.match.array,
      );
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(firstCreatedStub);
    });

    test("the `getExpressions` method value", function() {
      expect(subject.getExpressions).to.equal(secondCreatedStub);
    });

    test("the `getLanguages` method value", function() {
      expect(subject.getLanguages).to.equal(thirdCreatedStub);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("Only getEmbeds provided", function() {
    let subject: WebManglerLanguagePlugin;

    let getEmbeds: SinonStub;
    let firstCreatedStub: { returns: SinonStub; };
    let secondCreatedStub: { returns: SinonStub; };

    suiteSetup(function() {
      getEmbeds = sinon.stub();

      firstCreatedStub = {
        returns: sinon.stub(),
      };
      firstCreatedStub.returns.returns(firstCreatedStub);

      secondCreatedStub = {
        returns: sinon.stub(),
      };
      secondCreatedStub.returns.returns(secondCreatedStub);

      createStub.onFirstCall().returns(firstCreatedStub);
      createStub.onSecondCall().returns(secondCreatedStub);
    });

    setup(function() {
      firstCreatedStub.returns.resetHistory();
      secondCreatedStub.returns.resetHistory();

      subject = new WebManglerLanguagePluginMock({ getEmbeds });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(2);
    });

    test("the first created stub", function() {
      expect(firstCreatedStub.returns).to.have.callCount(1);
      expect(firstCreatedStub.returns).to.have.been.calledWithExactly(
        sinon.match.map,
      );
    });

    test("the second created stub", function() {
      expect(secondCreatedStub.returns).to.have.callCount(1);
      expect(secondCreatedStub.returns).to.have.been.calledWithExactly(
        sinon.match.array,
      );
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(getEmbeds);
    });

    test("the `getExpressions` method value", function() {
      expect(subject.getExpressions).to.equal(firstCreatedStub);
    });

    test("the `getLanguages` method value", function() {
      expect(subject.getLanguages).to.equal(secondCreatedStub);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("Only getExpressions provided", function() {
    let subject: WebManglerLanguagePlugin;

    let getExpressions: SinonStub;
    let firstCreatedStub: { returns: SinonStub; };
    let secondCreatedStub: { returns: SinonStub; };

    suiteSetup(function() {
      getExpressions = sinon.stub();

      firstCreatedStub = {
        returns: sinon.stub(),
      };
      firstCreatedStub.returns.returns(firstCreatedStub);

      secondCreatedStub = {
        returns: sinon.stub(),
      };
      secondCreatedStub.returns.returns(secondCreatedStub);

      createStub.onFirstCall().returns(firstCreatedStub);
      createStub.onSecondCall().returns(secondCreatedStub);
    });

    setup(function() {
      firstCreatedStub.returns.resetHistory();
      secondCreatedStub.returns.resetHistory();

      subject = new WebManglerLanguagePluginMock({ getExpressions });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(2);
    });

    test("the first created stub", function() {
      expect(firstCreatedStub.returns).to.have.callCount(1);
      expect(firstCreatedStub.returns).to.have.been.calledWithExactly(
        sinon.match.array,
      );
    });

    test("the second created stub", function() {
      expect(secondCreatedStub.returns).to.have.callCount(1);
      expect(secondCreatedStub.returns).to.have.been.calledWithExactly(
        sinon.match.array,
      );
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(firstCreatedStub);
    });

    test("the `getExpressions` method value", function() {
      expect(subject.getExpressions).to.equal(getExpressions);
    });

    test("the `getLanguages` method value", function() {
      expect(subject.getLanguages).to.equal(secondCreatedStub);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("Only getLanguages provided", function() {
    let subject: WebManglerLanguagePlugin;

    let getLanguages: SinonStub;
    let firstCreatedStub: { returns: SinonStub; };
    let secondCreatedStub: { returns: SinonStub; };

    suiteSetup(function() {
      getLanguages = sinon.stub();

      firstCreatedStub = {
        returns: sinon.stub(),
      };
      firstCreatedStub.returns.returns(firstCreatedStub);

      secondCreatedStub = {
        returns: sinon.stub(),
      };
      secondCreatedStub.returns.returns(secondCreatedStub);

      createStub.onFirstCall().returns(firstCreatedStub);
      createStub.onSecondCall().returns(secondCreatedStub);
    });

    setup(function() {
      firstCreatedStub.returns.resetHistory();
      secondCreatedStub.returns.resetHistory();

      subject = new WebManglerLanguagePluginMock({ getLanguages });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(2);
    });

    test("the first created stub", function() {
      expect(firstCreatedStub.returns).to.have.callCount(1);
      expect(firstCreatedStub.returns).to.have.been.calledWithExactly(
        sinon.match.array,
      );
    });

    test("the second created stub", function() {
      expect(secondCreatedStub.returns).to.have.callCount(1);
      expect(secondCreatedStub.returns).to.have.been.calledWithExactly(
        sinon.match.map,
      );
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(firstCreatedStub);
    });

    test("the `getExpressions` method value", function() {
      expect(subject.getExpressions).to.equal(secondCreatedStub);
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
    let firstCreatedStub: { returns: SinonStub; };

    suiteSetup(function() {
      getEmbeds = sinon.stub();
      getExpressions = sinon.stub();

      firstCreatedStub = {
        returns: sinon.stub(),
      };
      firstCreatedStub.returns.returns(firstCreatedStub);

      createStub.onFirstCall().returns(firstCreatedStub);
    });

    setup(function() {
      firstCreatedStub.returns.resetHistory();

      subject = new WebManglerLanguagePluginMock({
        getEmbeds,
        getExpressions,
      });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(1);
    });

    test("the first created stub", function() {
      expect(firstCreatedStub.returns).to.have.callCount(1);
      expect(firstCreatedStub.returns).to.have.been.calledWithExactly(
        sinon.match.array,
      );
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(getEmbeds);
    });

    test("the `getExpressions` method value", function() {
      expect(subject.getExpressions).to.equal(getExpressions);
    });

    test("the `getLanguages` method value", function() {
      expect(subject.getLanguages).to.equal(firstCreatedStub);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("Both getEmbeds and getLanguages provided", function() {
    let subject: WebManglerLanguagePlugin;

    let getEmbeds: SinonStub;
    let getLanguages: SinonStub;
    let firstCreatedStub: { returns: SinonStub; };

    suiteSetup(function() {
      getEmbeds = sinon.stub();
      getLanguages = sinon.stub();

      firstCreatedStub = {
        returns: sinon.stub(),
      };
      firstCreatedStub.returns.returns(firstCreatedStub);

      createStub.onFirstCall().returns(firstCreatedStub);
    });

    setup(function() {
      firstCreatedStub.returns.resetHistory();

      subject = new WebManglerLanguagePluginMock({
        getEmbeds,
        getLanguages,
      });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(1);
    });

    test("the first created stub", function() {
      expect(firstCreatedStub.returns).to.have.callCount(1);
      expect(firstCreatedStub.returns).to.have.been.calledWithExactly(
        sinon.match.map,
      );
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(getEmbeds);
    });

    test("the `getExpressions` method value", function() {
      expect(subject.getExpressions).to.equal(firstCreatedStub);
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
    let firstCreatedStub: { returns: SinonStub; };

    suiteSetup(function() {
      getExpressions = sinon.stub();
      getLanguages = sinon.stub();

      firstCreatedStub = {
        returns: sinon.stub(),
      };
      firstCreatedStub.returns.returns(firstCreatedStub);

      createStub.onFirstCall().returns(firstCreatedStub);
    });

    setup(function() {
      firstCreatedStub.returns.resetHistory();

      subject = new WebManglerLanguagePluginMock({
        getExpressions,
        getLanguages,
      });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(1);
    });

    test("the first created stub", function() {
      expect(firstCreatedStub.returns).to.have.callCount(1);
      expect(firstCreatedStub.returns).to.have.been.calledWithExactly(
        sinon.match.array,
      );
    });

    test("the `getEmbeds` method value", function() {
      expect(subject.getEmbeds).to.equal(firstCreatedStub);
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
