import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import MangleExpressionMock from "../mangle-expression";

chaiUse(sinonChai);

suite("MangleExpressionMock", function() {
  suite("::exec", function() {
    test("default stub", function() {
      const pluginMock = new MangleExpressionMock();
      expect(pluginMock.exec).not.to.throw();
      expect(pluginMock.exec()).not.to.be.undefined;
    });

    test("custom stub", function() {
      const execStub: SinonStub = sinon.stub();

      const pluginMock = new MangleExpressionMock(execStub);
      expect(pluginMock.exec).not.to.throw();
      expect(execStub).to.have.callCount(1);
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

      const pluginMock = new MangleExpressionMock(undefined, replaceAllStub);
      expect(pluginMock.replaceAll).not.to.throw();
      expect(replaceAllStub).to.have.callCount(1);
    });
  });
});
