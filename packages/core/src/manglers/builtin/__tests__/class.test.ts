import type { WebManglerPluginClass, BuiltInManglersOptions } from "../types";

import {
  generateValueObjects,
  WebManglerPluginMock,
} from "@webmangler/testing";
import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import * as _ from "lodash";

import { optionsValues } from "./values";

import BuiltInManglers, { injectDependencies } from "../class";

chaiUse(sinonChai);

suite("Built-in Manglers class", function() {
  const CssClassMangler = new WebManglerPluginMock();
  const CssVariableMangler = new WebManglerPluginMock();
  const HtmlAttributeMangler = new WebManglerPluginMock();
  const HtmlIdMangler = new WebManglerPluginMock();

  const CssClassManglerConstructor = sinon.stub();
  const CssVariableManglerConstructor = sinon.stub();
  const HtmlAttributeManglerConstructor = sinon.stub();
  const HtmlIdManglerConstructor = sinon.stub();

  suiteSetup(function() {
    CssClassManglerConstructor.returns(CssClassMangler);
    CssVariableManglerConstructor.returns(CssVariableMangler);
    HtmlAttributeManglerConstructor.returns(HtmlAttributeMangler);
    HtmlIdManglerConstructor.returns(HtmlIdMangler);

    injectDependencies(
      CssClassManglerConstructor as unknown as WebManglerPluginClass,
      CssVariableManglerConstructor as unknown as WebManglerPluginClass,
      HtmlAttributeManglerConstructor as unknown as WebManglerPluginClass,
      HtmlIdManglerConstructor as unknown as WebManglerPluginClass,
    );
  });

  setup(function() {
    CssClassManglerConstructor.resetHistory();
    CssVariableManglerConstructor.resetHistory();
    HtmlAttributeManglerConstructor.resetHistory();
    HtmlIdManglerConstructor.resetHistory();
  });

  suite("CssClassMangler", function() {
    const CssClassManglerKeys = [
      "classAttributes",
      "classNamePattern",
      "disableCssClassMangling",
      "keepClassNamePrefix",
      "reservedClassNames",
    ];

    test("enable & configure the CssClassMangler", function() {
      const optionsValueSource = Object.assign(
        _.pick(optionsValues, CssClassManglerKeys),
        { disableCssClassMangling: [undefined, false] },
      );

      for (const options of generateValueObjects(optionsValueSource)) {
        new BuiltInManglers(options as BuiltInManglersOptions);
        expect(CssClassManglerConstructor).to.have.been.calledOnceWith({
          classAttributes: options.classAttributes,
          classNamePattern: options.classNamePattern,
          reservedClassNames: options.reservedClassNames,
          keepClassNamePrefix: options.keepClassNamePrefix,
        });

        CssClassManglerConstructor.resetHistory();
      }
    });

    test("disable the CssClassMangler", function() {
      const optionsValueSource = Object.assign(
        _.pick(optionsValues, CssClassManglerKeys),
        { disableCssClassMangling: [true] },
      );

      for (const options of generateValueObjects(optionsValueSource)) {
        new BuiltInManglers(options as BuiltInManglersOptions);
        expect(CssClassManglerConstructor).not.to.have.been.called;
      }
    });
  });

  suite("CssVariableMangler", function() {
    const CssVariableManglerKeys = [
      "cssVarNamePattern",
      "disableCssVarMangling",
      "keepCssVarPrefix",
      "reservedCssVarNames",
    ];

    test("enable & configure the CssVariableMangler", function() {
      const optionsValueSource = Object.assign(
        _.pick(optionsValues, CssVariableManglerKeys),
        { disableCssVarMangling: [undefined, false] },
      );

      for (const options of generateValueObjects(optionsValueSource)) {
        new BuiltInManglers(options as BuiltInManglersOptions);
        expect(CssVariableManglerConstructor).to.have.been.calledOnceWith({
          cssVarNamePattern: options.cssVarNamePattern,
          keepCssVarPrefix: options.keepCssVarPrefix,
          reservedCssVarNames: options.reservedCssVarNames,
        });

        CssVariableManglerConstructor.resetHistory();
      }
    });

    test("disable the CssVariableMangler", function() {
      const optionsValueSource = Object.assign(
        _.pick(optionsValues, CssVariableManglerKeys),
        { disableCssVarMangling: [true] },
      );

      for (const options of generateValueObjects(optionsValueSource)) {
        new BuiltInManglers(options as BuiltInManglersOptions);
        expect(CssVariableManglerConstructor).not.to.have.been.called;
      }
    });
  });

  suite("HtmlAttributeMangler", function() {
    const HtmlAttributeManglerKeys = [
      "attrNamePattern",
      "disableHtmlAttrMangling",
      "keepAttrPrefix",
      "reservedAttrNames",
    ];

    test("enable & configure the HtmlAttributeMangler", function() {
      const optionsValueSource = Object.assign(
        _.pick(optionsValues, HtmlAttributeManglerKeys),
        { disableHtmlAttrMangling: [undefined, false] },
      );

      for (const options of generateValueObjects(optionsValueSource)) {
        new BuiltInManglers(options as BuiltInManglersOptions);
        expect(HtmlAttributeManglerConstructor).to.have.been.calledOnceWith({
          attrNamePattern: options.attrNamePattern,
          keepAttrPrefix: options.keepAttrPrefix,
          reservedAttrNames: options.reservedAttrNames,
        });

        HtmlAttributeManglerConstructor.resetHistory();
      }
    });

    test("disable the HtmlAttributeMangler", function() {
      const optionsValueSource = Object.assign(
        _.pick(optionsValues, HtmlAttributeManglerKeys),
        { disableHtmlAttrMangling: [true] },
      );

      for (const options of generateValueObjects(optionsValueSource)) {
        new BuiltInManglers(options as BuiltInManglersOptions);
        expect(HtmlAttributeManglerConstructor).not.to.have.been.called;
      }
    });
  });

  suite("HtmlIdMangler", function() {
    const HtmlIdManglerKeys = [
      "idAttributes",
      "idNamePattern",
      "disableHtmlIdMangling",
      "keepIdPrefix",
      "reservedIds",
      "urlAttributes",
    ];

    test("enable & configure the HtmlIdMangler", function() {
      const optionsValueSource = Object.assign(
        _.pick(optionsValues, HtmlIdManglerKeys),
        { disableHtmlIdMangling: [undefined, false] },
      );

      for (const options of generateValueObjects(optionsValueSource)) {
        new BuiltInManglers(options as BuiltInManglersOptions);
        expect(HtmlIdManglerConstructor).to.have.been.calledOnceWith({
          idAttributes: options.idAttributes,
          idNamePattern: options.idNamePattern,
          keepIdPrefix: options.keepIdPrefix,
          reservedIds: options.reservedIds,
          urlAttributes: options.urlAttributes,
        });

        HtmlIdManglerConstructor.resetHistory();
      }
    });

    test("disable the HtmlIdMangler", function() {
      const optionsValueSource = Object.assign(
        _.pick(optionsValues, HtmlIdManglerKeys),
        { disableHtmlIdMangling: [true] },
      );

      for (const options of generateValueObjects(optionsValueSource)) {
        new BuiltInManglers(options as BuiltInManglersOptions);
        expect(HtmlIdManglerConstructor).not.to.have.been.called;
      }
    });
  });
});
