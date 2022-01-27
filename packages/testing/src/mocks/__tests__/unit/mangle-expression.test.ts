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

    let createdFindAllStub: SinonStub;
    let createdReplaceAllStub: SinonStub;

    suiteSetup(function() {
      createdFindAllStub = sinon.stub();
      createdReplaceAllStub = sinon.stub();

      createStub.onFirstCall().returns(createdFindAllStub);
      createStub.onSecondCall().returns(createdReplaceAllStub);
    });

    setup(function() {
      subject = new MangleExpressionMock();
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(2);
    });

    test("the `findAll` method value", function() {
      expect(subject.findAll).to.equal(createdFindAllStub);
    });

    test("the `findAll` return value", function() {
      const result = subject.findAll("foo", "bar");
      expect(result).to.deep.equal([]);
    });

    test("the `replaceAll` method value", function() {
      expect(subject.replaceAll).to.equal(createdReplaceAllStub);
    });

    test("the `replaceAll` return value", function() {
      const result = subject.replaceAll("foo", new Map());
      expect(result).to.equal("");
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("Only findAll provided", function() {
    let subject: MangleExpression;

    let findAll: SinonStub;
    let createdReplaceAllStub: SinonStub;

    suiteSetup(function() {
      findAll = sinon.stub();

      createdReplaceAllStub = sinon.stub();

      createStub.onFirstCall().returns(createdReplaceAllStub);
    });

    setup(function() {
      subject = new MangleExpressionMock({ findAll });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(1);
    });

    test("the `findAll` method value", function() {
      expect(subject.findAll).to.equal(findAll);
    });

    test("the `replaceAll` method value", function() {
      expect(subject.replaceAll).to.equal(createdReplaceAllStub);
    });

    test("the `replaceAll` return value", function() {
      const result = subject.replaceAll("foo", new Map());
      expect(result).to.equal("");
    });

    suiteTeardown(function() {
      createStub.resetBehavior();
    });
  });

  suite("Only replaceAll provided", function() {
    let subject: MangleExpression;

    let replaceAll: SinonStub;
    let createdFindAllStub: SinonStub;

    suiteSetup(function() {
      replaceAll = sinon.stub();

      createdFindAllStub = sinon.stub();

      createStub.onFirstCall().returns(createdFindAllStub);
    });

    setup(function() {
      subject = new MangleExpressionMock({ replaceAll });
    });

    test("call count of createStub", function() {
      expect(createStub).to.have.callCount(1);
    });

    test("the `findAll` method value", function() {
      expect(subject.findAll).to.equal(createdFindAllStub);
    });

    test("the `findAll` return value", function() {
      const result = subject.findAll("foo", "bar");
      expect(result).to.deep.equal([]);
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
