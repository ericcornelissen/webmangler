import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { WebManglerLanguagePluginMock } from "../../index";

chaiUse(sinonChai);

suite("WebManglerLanguagePluginMock", function() {
  suite("::getEmbeds", function() {
    test("default stub", function() {
      const pluginMock = new WebManglerLanguagePluginMock();
      expect(pluginMock.getEmbeds).not.to.throw();
      expect(pluginMock.getEmbeds()).not.to.be.undefined;
    });

    test("custom stub", function() {
      const getEmbedsStub: SinonStub = sinon.stub();

      const pluginMock = new WebManglerLanguagePluginMock({
        getEmbeds: getEmbedsStub,
      });
      expect(pluginMock.getEmbeds).not.to.throw();
      expect(getEmbedsStub).to.have.callCount(1);
    });
  });

  suite("::getExpressions", function() {
    test("default stub", function() {
      const pluginMock = new WebManglerLanguagePluginMock();
      expect(pluginMock.getExpressions).not.to.throw();
      expect(pluginMock.getExpressions()).not.to.be.undefined;
    });

    test("custom stub", function() {
      const getExpressionsStub: SinonStub = sinon.stub();

      const pluginMock = new WebManglerLanguagePluginMock({
        getExpressions: getExpressionsStub,
      });
      expect(pluginMock.getExpressions).not.to.throw();
      expect(getExpressionsStub).to.have.callCount(1);
    });
  });

  suite("::getLanguages", function() {
    test("default stub", function() {
      const pluginMock = new WebManglerLanguagePluginMock();
      expect(pluginMock.getLanguages).not.to.throw();
      expect(pluginMock.getLanguages()).not.to.be.undefined;
    });

    test("custom stub", function() {
      const getLanguagesStub: SinonStub = sinon.stub();

      const pluginMock = new WebManglerLanguagePluginMock({
        getLanguages: getLanguagesStub,
      });
      expect(pluginMock.getLanguages).not.to.throw();
      expect(getLanguagesStub).to.have.callCount(1);
    });
  });
});
