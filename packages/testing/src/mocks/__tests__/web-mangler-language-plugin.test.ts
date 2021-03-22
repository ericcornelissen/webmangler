import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import WebManglerPluginLanguageMock from "../web-mangler-language-plugin";

chaiUse(sinonChai);

suite("WebManglerPluginLanguageMock", function() {
  suite("::getExpressions", function() {
    test("default stub", function() {
      const pluginMock = new WebManglerPluginLanguageMock();
      expect(pluginMock.getExpressions).not.to.throw();
      expect(pluginMock.getExpressions()).not.to.be.undefined;
    });

    test("custom stub", function() {
      const getExpressionsStub: SinonStub = sinon.stub();

      const pluginMock = new WebManglerPluginLanguageMock(getExpressionsStub);
      expect(pluginMock.getExpressions).not.to.throw();
      expect(getExpressionsStub).to.have.callCount(1);
    });
  });

  suite("::getLanguages", function() {
    test("default stub", function() {
      const pluginMock = new WebManglerPluginLanguageMock();
      expect(pluginMock.getLanguages).not.to.throw();
      expect(pluginMock.getLanguages()).not.to.be.undefined;
    });

    test("custom stub", function() {
      const getLanguagesStub: SinonStub = sinon.stub();

      const pluginMock = new WebManglerPluginLanguageMock(
        undefined,
        getLanguagesStub,
      );
      expect(pluginMock.getLanguages).not.to.throw();
      expect(getLanguagesStub).to.have.callCount(1);
    });
  });
});
