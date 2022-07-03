import type { SinonStub } from "sinon";

import type {
  RecommendedManglersOptions,
  WebManglerPluginClass,
} from "../../types";

import {
  generateValueObjects,
  WebManglerPluginMock,
} from "@webmangler/testing";
import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { optionsValues } from "../common";

import RecommendedManglers, { injectDependencies } from "../../class";

chaiUse(sinonChai);

suite("RecommendedManglers class", function() {
  let CssClassManglerConstructor: SinonStub;
  let CssVariableManglerConstructor: SinonStub;
  let HtmlAttributeManglerConstructor: SinonStub;

  suiteSetup(function() {
    const CssClassMangler = new WebManglerPluginMock();
    const CssVariableMangler = new WebManglerPluginMock();
    const HtmlAttributeMangler = new WebManglerPluginMock();

    CssClassManglerConstructor = sinon.stub();
    CssVariableManglerConstructor = sinon.stub();
    HtmlAttributeManglerConstructor = sinon.stub();

    CssClassManglerConstructor.returns(CssClassMangler);
    CssVariableManglerConstructor.returns(CssVariableMangler);
    HtmlAttributeManglerConstructor.returns(HtmlAttributeMangler);

    injectDependencies(
      CssClassManglerConstructor as unknown as WebManglerPluginClass,
      CssVariableManglerConstructor as unknown as WebManglerPluginClass,
      HtmlAttributeManglerConstructor as unknown as WebManglerPluginClass,
    );
  });

  suite("CssClassMangler", function() {
    setup(function() {
      CssClassManglerConstructor.resetHistory();
    });

    test("enable & configure the CssClassMangler", function() {
      const optionsValueSource = {
        classAttributes: optionsValues.classAttributes,
        classNamePattern: optionsValues.classNamePattern,
        disableCssClassMangling: [undefined, false] as unknown as string[],
        keepClassNamePrefix: optionsValues.keepClassNamePrefix,
        reservedClassNames: optionsValues.reservedClassNames,
      };

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
      const optionsValueSource = {
        classAttributes: optionsValues.classAttributes,
        classNamePattern: optionsValues.classNamePattern,
        disableCssClassMangling: [true] as unknown as string[],
        keepClassNamePrefix: optionsValues.keepClassNamePrefix,
        reservedClassNames: optionsValues.reservedClassNames,
      };

      for (const options of generateValueObjects(optionsValueSource)) {
        new RecommendedManglers(options as RecommendedManglersOptions);
        expect(CssClassManglerConstructor).not.to.have.been.called;
      }
    });

    test("no configuration", function() {
      new RecommendedManglers();
      expect(CssClassManglerConstructor).to.have.been.calledOnceWith({ });
    });
  });

  suite("CssVariableMangler", function() {
    setup(function() {
      CssVariableManglerConstructor.resetHistory();
    });

    test("enable & configure the CssVariableMangler", function() {
      const optionsValueSource = {
        cssVarNamePattern: optionsValues.cssVarNamePattern,
        disableCssVarMangling: [undefined, false] as unknown as string[],
        keepCssVarPrefix: optionsValues.keepCssVarPrefix,
        reservedCssVarNames: optionsValues.reservedCssVarNames,
      };

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
      const optionsValueSource = {
        cssVarNamePattern: optionsValues.cssVarNamePattern,
        disableCssVarMangling: [true] as unknown as string[],
        keepCssVarPrefix: optionsValues.keepCssVarPrefix,
        reservedCssVarNames: optionsValues.reservedCssVarNames,
      };

      for (const options of generateValueObjects(optionsValueSource)) {
        new RecommendedManglers(options as RecommendedManglersOptions);
        expect(CssVariableManglerConstructor).not.to.have.been.called;
      }
    });

    test("no configuration", function() {
      new RecommendedManglers();
      expect(CssVariableManglerConstructor).to.have.been.calledOnceWith({ });
    });
  });

  suite("HtmlAttributeMangler", function() {
    setup(function() {
      HtmlAttributeManglerConstructor.resetHistory();
    });

    test("enable & configure the HtmlAttributeMangler", function() {
      const optionsValueSource = {
        attrNamePattern: optionsValues.attrNamePattern,
        disableHtmlAttrMangling: [undefined, false] as unknown as string[],
        keepAttrPrefix: optionsValues.keepAttrPrefix,
        reservedAttrNames: optionsValues.reservedAttrNames,
      };

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
      const optionsValueSource = {
        attrNamePattern: optionsValues.attrNamePattern,
        disableHtmlAttrMangling: [true] as unknown as string[],
        keepAttrPrefix: optionsValues.keepAttrPrefix,
        reservedAttrNames: optionsValues.reservedAttrNames,
      };

      for (const options of generateValueObjects(optionsValueSource)) {
        new RecommendedManglers(options as RecommendedManglersOptions);
        expect(HtmlAttributeManglerConstructor).not.to.have.been.called;
      }
    });

    test("no configuration", function() {
      new RecommendedManglers();
      expect(HtmlAttributeManglerConstructor).to.have.been.calledOnceWith({ });
    });
  });
});
