import type {
  WebManglerLanguagePluginClass,
  BuiltInLanguagesOptions,
} from "../types";

import {
  generateValueObjects,
  WebManglerLanguagePluginMock,
} from "@webmangler/testing";
import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import * as _ from "lodash";

import { optionsValues } from "./values";

import BuiltInLanguagesPlugin, { injectDependencies } from "../class";

chaiUse(sinonChai);

suite("BuiltInLanguages class", function() {
  const CssLanguagePlugin = new WebManglerLanguagePluginMock();
  const HtmlLanguagePlugin = new WebManglerLanguagePluginMock();
  const JsLanguagePlugin = new WebManglerLanguagePluginMock();

  const CssLanguagePluginConstructor = sinon.stub();
  const HtmlLanguagePluginConstructor = sinon.stub();
  const JsLanguagePluginConstructor = sinon.stub();

  suiteSetup(function() {
    CssLanguagePluginConstructor.returns(CssLanguagePlugin);
    HtmlLanguagePluginConstructor.returns(HtmlLanguagePlugin);
    JsLanguagePluginConstructor.returns(JsLanguagePlugin);

    injectDependencies(
      CssLanguagePluginConstructor as unknown as WebManglerLanguagePluginClass,
      HtmlLanguagePluginConstructor as unknown as WebManglerLanguagePluginClass,
      JsLanguagePluginConstructor as unknown as WebManglerLanguagePluginClass,
    );
  });

  suite("CssLanguagePlugin", function() {
    const CssLanguagePluginKeys: string[] = [
      "cssExtensions",
    ];

    test("configure the CssLanguagePlugin", function() {
      const optionsValueSource = _.pick(optionsValues, CssLanguagePluginKeys);

      for (const options of generateValueObjects(optionsValueSource)) {
        CssLanguagePluginConstructor.resetHistory();

        new BuiltInLanguagesPlugin(options as BuiltInLanguagesOptions);
        expect(CssLanguagePluginConstructor).to.have.been.calledOnceWith(
          sinon.match({
            cssExtensions: options.cssExtensions,
          }),
        );
      }
    });
  });

  suite("HtmlLanguagePlugin", function() {
    const HtmlLanguagePluginKeys: string[] = [
      "htmlExtensions",
    ];

    test("configure the HtmlLanguagePlugin", function() {
      const optionsValueSource = _.pick(optionsValues, HtmlLanguagePluginKeys);

      for (const options of generateValueObjects(optionsValueSource)) {
        HtmlLanguagePluginConstructor.resetHistory();

        new BuiltInLanguagesPlugin(options as BuiltInLanguagesOptions);
        expect(HtmlLanguagePluginConstructor).to.have.been.calledOnceWith(
          sinon.match({
            htmlExtensions: options.htmlExtensions,
          }),
        );
      }
    });
  });

  suite("JsLanguagePlugin", function() {
    const JsLanguagePluginKeys: string[] = [
      "jsExtensions",
    ];

    test("configure the JavaScriptLanguagePlugin", function() {
      const optionsValueSource = _.pick(optionsValues, JsLanguagePluginKeys);

      for (const options of generateValueObjects(optionsValueSource)) {
        JsLanguagePluginConstructor.resetHistory();

        new BuiltInLanguagesPlugin(options as BuiltInLanguagesOptions);
        expect(JsLanguagePluginConstructor).to.have.been.calledOnceWith(
          sinon.match({
            jsExtensions: options.jsExtensions,
          }),
        );
      }
    });
  });
});
