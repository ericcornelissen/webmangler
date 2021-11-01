import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { WebManglerPluginMock } from "../../index";

chaiUse(sinonChai);

suite("WebManglerPluginMock", function() {
  suite("::options", function() {
    test("default stub", function() {
      const pluginMock = new WebManglerPluginMock();
      expect(pluginMock.options).not.to.throw();
      expect(pluginMock.options()).not.to.be.undefined;
    });

    test("custom stub", function() {
      const optionsStub: SinonStub = sinon.stub();

      const pluginMock = new WebManglerPluginMock({
        options: optionsStub,
      });
      expect(pluginMock.options).not.to.throw();
      expect(optionsStub).to.have.callCount(1);
    });
  });
});
