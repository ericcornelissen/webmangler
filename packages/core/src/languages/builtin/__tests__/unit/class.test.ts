import type { SinonStub } from "sinon";

import type {
  WebManglerLanguagePluginClass,
  BuiltInLanguagesOptions,
} from "../../types";

import {
  generateValueObjects,
  WebManglerLanguagePluginMock,
} from "@webmangler/testing";
import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { optionsValues } from "../common";

import BuiltInLanguagesPlugin, { injectDependencies } from "../../class";

chaiUse(sinonChai);

suite("BuiltInLanguages class", function() {
  let CssLanguagePluginConstructor: SinonStub;
  let HtmlLanguagePluginConstructor: SinonStub;
  let JsLanguagePluginConstructor: SinonStub;

  suiteSetup(function() {
    const CssLanguagePlugin = new WebManglerLanguagePluginMock();
    const HtmlLanguagePlugin = new WebManglerLanguagePluginMock();
    const JsLanguagePlugin = new WebManglerLanguagePluginMock();

    CssLanguagePluginConstructor = sinon.stub();
    HtmlLanguagePluginConstructor = sinon.stub();
    JsLanguagePluginConstructor = sinon.stub();

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
    setup(function() {
      CssLanguagePluginConstructor.resetHistory();
    });

    test("configure the CssLanguagePlugin", function() {
      const optionsValueSource = {
        cssExtensions: optionsValues.cssExtensions,
      };

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

    test("no configuration", function() {
      new BuiltInLanguagesPlugin();
      expect(CssLanguagePluginConstructor).to.have.been.calledOnceWith({ });
    });
  });

  suite("HtmlLanguagePlugin", function() {
    setup(function() {
      HtmlLanguagePluginConstructor.resetHistory();
    });

    test("configure the HtmlLanguagePlugin", function() {
      const optionsValueSource = {
        htmlExtensions: optionsValues.htmlExtensions,
      };

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

    test("no configuration", function() {
      new BuiltInLanguagesPlugin();
      expect(HtmlLanguagePluginConstructor).to.have.been.calledOnceWith({ });
    });
  });

  suite("JsLanguagePlugin", function() {
    setup(function() {
      JsLanguagePluginConstructor.resetHistory();
    });

    test("configure the JavaScriptLanguagePlugin", function() {
      const optionsValueSource = {
        jsExtensions: optionsValues.jsExtensions,
      };

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

    test("no configuration", function() {
      new BuiltInLanguagesPlugin();
      expect(JsLanguagePluginConstructor).to.have.been.calledOnceWith({ });
    });
  });
});
