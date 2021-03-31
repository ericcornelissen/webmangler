import type { WebManglerLanguagePlugin } from "../../types";

import { WebManglerPluginLanguageMock } from "@webmangler/testing";
import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as CssLanguagePlugin from "../css";
import * as HtmlLanguagePlugin from "../html";
import * as JsLanguagePlugin from "../javascript";

import BuiltInLanguagesPlugin from "../builtin";

chaiUse(sinonChai);

suite("Built-in Language Supports", function() {
  let CssLanguagePluginMock: WebManglerLanguagePlugin;
  let HtmlLanguagePluginMock: WebManglerLanguagePlugin;
  let JsLanguagePluginMock: WebManglerLanguagePlugin;

  let CssLanguagePluginModuleStub: sinon.SinonStub;
  let HtmlLanguagePluginModuleStub: sinon.SinonStub;
  let JsLanguagePluginModuleStub: sinon.SinonStub;

  suiteSetup(function() {
    CssLanguagePluginMock = new WebManglerPluginLanguageMock();
    CssLanguagePluginModuleStub = sinon.stub(CssLanguagePlugin, "default");
    CssLanguagePluginModuleStub.returns(CssLanguagePluginMock);

    HtmlLanguagePluginMock = new WebManglerPluginLanguageMock();
    HtmlLanguagePluginModuleStub = sinon.stub(HtmlLanguagePlugin, "default");
    HtmlLanguagePluginModuleStub.returns(HtmlLanguagePluginMock);

    JsLanguagePluginMock = new WebManglerPluginLanguageMock();
    JsLanguagePluginModuleStub = sinon.stub(JsLanguagePlugin, "default");
    JsLanguagePluginModuleStub.returns(JsLanguagePluginMock);
  });

  suite("Options", function() {
    test("initialize language plugins", function() {
      const options = { htmlExtensions: ["html5"] };
      new BuiltInLanguagesPlugin(options);

      expect(CssLanguagePluginModuleStub).to.have.callCount(1);
      expect(CssLanguagePluginModuleStub).to.have.been.calledWith(options);

      expect(HtmlLanguagePluginModuleStub).to.have.callCount(1);
      expect(HtmlLanguagePluginModuleStub).to.have.been.calledWith(options);

      expect(JsLanguagePluginModuleStub).to.have.callCount(1);
      expect(JsLanguagePluginModuleStub).to.have.been.calledWith(options);
    });
  });

  suite("Methods", function() {
    let plugin: WebManglerLanguagePlugin;

    setup(function() {
      plugin = new BuiltInLanguagesPlugin();
    });

    test("get expressions", function() {
      const name = "foo";
      const options = "bar";

      const result = plugin.getExpressions(name, options);
      expect(result).to.have.length.above(0);

      const cssExpr = CssLanguagePluginMock.getExpressions(name, options);
      const htmlExpr = HtmlLanguagePluginMock.getExpressions(name, options);
      const jsExpr = JsLanguagePluginMock.getExpressions(name, options);

      const hasSameValueAsResult = (v: unknown, k: string): void => {
        expect(result.get(k)).to.equal(v);
      };

      cssExpr.forEach(hasSameValueAsResult);
      htmlExpr.forEach(hasSameValueAsResult);
      jsExpr.forEach(hasSameValueAsResult);
    });

    test("get languages", function() {
      const result = plugin.getLanguages();
      expect(result).to.have.length.above(0);

      expect(result).to.deep.include.members(
        Array.from(CssLanguagePluginMock.getLanguages()),
      );
      expect(result).to.deep.include.members(
        Array.from(HtmlLanguagePluginMock.getLanguages()),
      );
      expect(result).to.deep.include.members(
        Array.from(JsLanguagePluginMock.getLanguages()),
      );
    });
  });

  suiteTeardown(function() {
    CssLanguagePluginModuleStub.restore();
    HtmlLanguagePluginModuleStub.restore();
    JsLanguagePluginModuleStub.restore();
  });
});
