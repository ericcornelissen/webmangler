import type { MangleExpression } from "@webmangler/types";
import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import initMangleExpressionMock from "../../mangle-expression";

chaiUse(sinonChai);

suite("::initMangleExpressionMock", function() {
  let MangleExpressionMock: ReturnType<typeof initMangleExpressionMock>;
  let createStub: SinonStub;

  let getFindAllStub: SinonStub;
  let getReplaceAllStub: SinonStub;

  suiteSetup(function() {
    createStub = sinon.stub();
    getFindAllStub = sinon.stub();
    getReplaceAllStub = sinon.stub();

    MangleExpressionMock = initMangleExpressionMock({
      createStub,
    });
  });

  setup(function() {
    createStub.resetHistory();
    getFindAllStub.resetHistory();
    getReplaceAllStub.resetHistory();
  });

  suite("No inputs provided", function() {
    let subject: MangleExpression;

    let firstCreatedStub: { returns: SinonStub; };
    let secondCreatedStub: { returns: SinonStub; };

    suiteSetup(function() {
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

      subject = new MangleExpressionMock();
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
        sinon.match.string,
      );
    });

    test("the `findAll` method value", function() {
      expect(subject.findAll).to.equal(firstCreatedStub);
    });

    test("the `replaceAll` method value", function() {
      expect(subject.replaceAll).to.equal(secondCreatedStub);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("Only findAll provided", function() {
    let subject: MangleExpression;

    let findAll: SinonStub;
    let firstCreatedStub: { returns: SinonStub; };

    suiteSetup(function() {
      findAll = sinon.stub();

      firstCreatedStub = {
        returns: sinon.stub(),
      };
      firstCreatedStub.returns.returns(firstCreatedStub);

      createStub.onFirstCall().returns(firstCreatedStub);
    });

    setup(function() {
      firstCreatedStub.returns.resetHistory();

      subject = new MangleExpressionMock({ findAll });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(1);
    });

    test("the first created stub", function() {
      expect(firstCreatedStub.returns).to.have.callCount(1);
      expect(firstCreatedStub.returns).to.have.been.calledWithExactly(
        sinon.match.string,
      );
    });

    test("the `findAll` method value", function() {
      expect(subject.findAll).to.equal(findAll);
    });

    test("the `replaceAll` method value", function() {
      expect(subject.replaceAll).to.equal(firstCreatedStub);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("Only replaceAll provided", function() {
    let subject: MangleExpression;

    let replaceAll: SinonStub;
    let firstCreatedStub: { returns: SinonStub; };

    suiteSetup(function() {
      replaceAll = sinon.stub();

      firstCreatedStub = {
        returns: sinon.stub(),
      };
      firstCreatedStub.returns.returns(firstCreatedStub);

      createStub.onFirstCall().returns(firstCreatedStub);
    });

    setup(function() {
      firstCreatedStub.returns.resetHistory();

      subject = new MangleExpressionMock({ replaceAll });
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

    test("the `findAll` method value", function() {
      expect(subject.findAll).to.equal(firstCreatedStub);
    });

    test("the `replaceAll` method value", function() {
      expect(subject.replaceAll).to.equal(replaceAll);
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("All inputs provided", function() {
    let subject: MangleExpression;

    let findAll: SinonStub;
    let replaceAll: SinonStub;

    suiteSetup(function() {
      findAll = sinon.stub();
      replaceAll = sinon.stub();
    });

    setup(function() {
      subject = new MangleExpressionMock({
        findAll,
        replaceAll,
      });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(0);
    });

    test("the `findAll` method value", function() {
      expect(subject.findAll).to.equal(findAll);
    });

    test("the `replaceAll` method value", function() {
      expect(subject.replaceAll).to.equal(replaceAll);
    });
  });
});
