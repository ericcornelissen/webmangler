import type { WebManglerLanguagePlugin } from "../../types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import WebManglerPluginLanguageMock from "../../__mocks__/web-mangler-language-plugin.mock";

import * as CssLanguagePlugin from "../css";
import * as HtmlLanguagePlugin from "../html";
import * as JavaScriptLanguagePlugin from "../javascript";

import BuiltInLanguagesPlugin from "../builtin";

chaiUse(sinonChai);

suite("Built-in Language Supports", function() {
  let plugin: WebManglerLanguagePlugin;

  let CssLanguagePluginMock: WebManglerLanguagePlugin;
  let HtmlLanguagePluginMock: WebManglerLanguagePlugin;
  let JavaScriptLanguagePluginMock: WebManglerLanguagePlugin;

  let CssLanguagePluginModuleStub: sinon.SinonStub;
  let HtmlLanguagePluginModuleStub: sinon.SinonStub;
  let JavaScriptLanguagePluginModuleStub: sinon.SinonStub;

  suiteSetup(function() {
    CssLanguagePluginMock = new WebManglerPluginLanguageMock();
    CssLanguagePluginModuleStub = sinon.stub(CssLanguagePlugin, "default");
    CssLanguagePluginModuleStub.returns(CssLanguagePluginMock);

    HtmlLanguagePluginMock = new WebManglerPluginLanguageMock();
    HtmlLanguagePluginModuleStub = sinon.stub(HtmlLanguagePlugin, "default");
    HtmlLanguagePluginModuleStub.returns(HtmlLanguagePluginMock);

    JavaScriptLanguagePluginMock = new WebManglerPluginLanguageMock();
    JavaScriptLanguagePluginModuleStub = sinon.stub(JavaScriptLanguagePlugin, "default");
    JavaScriptLanguagePluginModuleStub.returns(JavaScriptLanguagePluginMock);
  });

  setup(function() {
    plugin = new BuiltInLanguagesPlugin();
  });

  test("get expressions", function() {
    const name = "foo";
    const options = "bar";

    const result = plugin.getExpressionsFor(name, options);
    expect(result).to.have.length.above(0);

    const cssExpr = CssLanguagePluginMock.getExpressionsFor(name, options);
    const htmlExpr = HtmlLanguagePluginMock.getExpressionsFor(name, options);
    const jsExpr = JavaScriptLanguagePluginMock.getExpressionsFor(name, options);

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

    expect(result).to.deep.include.members(CssLanguagePluginMock.getLanguages());
    expect(result).to.deep.include.members(HtmlLanguagePluginMock.getLanguages());
    expect(result).to.deep.include.members(JavaScriptLanguagePluginMock.getLanguages());
  });

  suiteTeardown(function() {
    CssLanguagePluginModuleStub.restore();
    HtmlLanguagePluginModuleStub.restore();
    JavaScriptLanguagePluginModuleStub.restore();
  });
});
