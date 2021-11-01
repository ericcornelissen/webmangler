import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { MangleExpressionMock } from "../../index";

chaiUse(sinonChai);

suite("MangleExpressionMock", function() {
  suite("::findAll", function() {
    test("default stub", function() {
      const pluginMock = new MangleExpressionMock();
      expect(pluginMock.findAll).not.to.throw();
      expect(pluginMock.findAll()).not.to.be.undefined;
    });

    test("custom stub", function() {
      const findAllStub: SinonStub = sinon.stub();

      const pluginMock = new MangleExpressionMock({
        findAll: findAllStub,
      });
      expect(pluginMock.findAll).not.to.throw();
      expect(findAllStub).to.have.callCount(1);
    });
  });

  suite("::replaceAll", function() {
    test("default stub", function() {
      const pluginMock = new MangleExpressionMock();
      expect(pluginMock.replaceAll).not.to.throw();
      expect(pluginMock.replaceAll()).not.to.be.undefined;
    });

    test("custom stub", function() {
      const replaceAllStub: SinonStub = sinon.stub();

      const pluginMock = new MangleExpressionMock({
        replaceAll: replaceAllStub,
      });
      expect(pluginMock.replaceAll).not.to.throw();
      expect(replaceAllStub).to.have.callCount(1);
    });
  });
});
