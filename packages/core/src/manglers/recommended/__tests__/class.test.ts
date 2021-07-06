import type { WebManglerPluginClass, RecommendedManglersOptions } from "../types";

import {
  generateValueObjects,
  WebManglerPluginMock,
} from "@webmangler/testing";
import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import * as _ from "lodash";

import { optionsValues } from "./values";

import RecommendedManglers, { injectDependencies } from "../class";

chaiUse(sinonChai);

suite("Recommended Manglers class", function() {
  const CssClassMangler = new WebManglerPluginMock();
  const CssVariableMangler = new WebManglerPluginMock();
  const HtmlAttributeMangler = new WebManglerPluginMock();

  const CssClassManglerConstructor = sinon.stub();
  const CssVariableManglerConstructor = sinon.stub();
  const HtmlAttributeManglerConstructor = sinon.stub();

  suiteSetup(function() {
    CssClassManglerConstructor.returns(CssClassMangler);
    CssVariableManglerConstructor.returns(CssVariableMangler);
    HtmlAttributeManglerConstructor.returns(HtmlAttributeMangler);

    injectDependencies(
      CssClassManglerConstructor as unknown as WebManglerPluginClass,
      CssVariableManglerConstructor as unknown as WebManglerPluginClass,
      HtmlAttributeManglerConstructor as unknown as WebManglerPluginClass,
    );
  });

  setup(function() {
    CssClassManglerConstructor.resetHistory();
    CssVariableManglerConstructor.resetHistory();
    HtmlAttributeManglerConstructor.resetHistory();
  });

  suite("CssClassMangler", function() {
    const CssClassManglerKeys: string[] = [
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
        new RecommendedManglers(options as RecommendedManglersOptions);
        expect(CssClassManglerConstructor).to.have.been.calledOnceWith(
          sinon.match({
            classAttributes: options.classAttributes,
            classNamePattern: options.classNamePattern,
            reservedClassNames: options.reservedClassNames,
            keepClassNamePrefix: options.keepClassNamePrefix,
          }),
        );

        CssClassManglerConstructor.resetHistory();
      }
    });

    test("disable the CssClassMangler", function() {
      const optionsValueSource = Object.assign(
        _.pick(optionsValues, CssClassManglerKeys),
        { disableCssClassMangling: [true] },
      );

      for (const options of generateValueObjects(optionsValueSource)) {
        new RecommendedManglers(options as RecommendedManglersOptions);
        expect(CssClassManglerConstructor).not.to.have.been.called;
      }
    });
  });

  suite("CssVariableMangler", function() {
    const CssVariableManglerKeys: string[] = [
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
        new RecommendedManglers(options as RecommendedManglersOptions);
        expect(CssVariableManglerConstructor).to.have.been.calledOnceWith(
          sinon.match({
            cssVarNamePattern: options.cssVarNamePattern,
            keepCssVarPrefix: options.keepCssVarPrefix,
            reservedCssVarNames: options.reservedCssVarNames,
          }),
        );

        CssVariableManglerConstructor.resetHistory();
      }
    });

    test("disable the CssVariableMangler", function() {
      const optionsValueSource = Object.assign(
        _.pick(optionsValues, CssVariableManglerKeys),
        { disableCssVarMangling: [true] },
      );

      for (const options of generateValueObjects(optionsValueSource)) {
        new RecommendedManglers(options as RecommendedManglersOptions);
        expect(CssVariableManglerConstructor).not.to.have.been.called;
      }
    });
  });

  suite("HtmlAttributeMangler", function() {
    const HtmlAttributeManglerKeys: string[] = [
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
        new RecommendedManglers(options as RecommendedManglersOptions);
        expect(HtmlAttributeManglerConstructor).to.have.been.calledOnceWith(
          sinon.match({
            attrNamePattern: options.attrNamePattern,
            keepAttrPrefix: options.keepAttrPrefix,
            reservedAttrNames: options.reservedAttrNames,
          }),
        );

        HtmlAttributeManglerConstructor.resetHistory();
      }
    });

    test("disable the HtmlAttributeMangler", function() {
      const optionsValueSource = Object.assign(
        _.pick(optionsValues, HtmlAttributeManglerKeys),
        { disableHtmlAttrMangling: [true] },
      );

      for (const options of generateValueObjects(optionsValueSource)) {
        new RecommendedManglers(options as RecommendedManglersOptions);
        expect(HtmlAttributeManglerConstructor).not.to.have.been.called;
      }
    });
  });
});
