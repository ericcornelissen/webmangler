import type { SinonStub } from "sinon";

import type {
  BuiltInManglersOptions,
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

import BuiltInManglers, { injectDependencies } from "../../class";

chaiUse(sinonChai);

suite("BuiltInManglers class", function() {
  let CssClassManglerConstructor: SinonStub;
  let CssVariableManglerConstructor: SinonStub;
  let HtmlAttributeManglerConstructor: SinonStub;
  let HtmlIdManglerConstructor: SinonStub;

  suiteSetup(function() {
    const CssClassMangler = new WebManglerPluginMock();
    const CssVariableMangler = new WebManglerPluginMock();
    const HtmlAttributeMangler = new WebManglerPluginMock();
    const HtmlIdMangler = new WebManglerPluginMock();

    CssClassManglerConstructor = sinon.stub();
    CssVariableManglerConstructor = sinon.stub();
    HtmlAttributeManglerConstructor = sinon.stub();
    HtmlIdManglerConstructor = sinon.stub();

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
        new BuiltInManglers(options as BuiltInManglersOptions);
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
        new BuiltInManglers(options as BuiltInManglersOptions);
        expect(CssClassManglerConstructor).not.to.have.been.called;
      }
    });

    test("no configuration", function() {
      new BuiltInManglers();
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
        new BuiltInManglers(options as BuiltInManglersOptions);
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
        new BuiltInManglers(options as BuiltInManglersOptions);
        expect(CssVariableManglerConstructor).not.to.have.been.called;
      }
    });

    test("no configuration", function() {
      new BuiltInManglers();
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
        new BuiltInManglers(options as BuiltInManglersOptions);
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
        new BuiltInManglers(options as BuiltInManglersOptions);
        expect(HtmlAttributeManglerConstructor).not.to.have.been.called;
      }
    });

    test("no configuration", function() {
      new BuiltInManglers();
      expect(HtmlAttributeManglerConstructor).to.have.been.calledOnceWith({ });
    });
  });

  suite("HtmlIdMangler", function() {
    setup(function() {
      HtmlIdManglerConstructor.resetHistory();
    });

    test("enable & configure the HtmlIdMangler", function() {
      const optionsValueSource = {
        idAttributes: optionsValues.idAttributes,
        idNamePattern: optionsValues.idNamePattern,
        disableHtmlIdMangling: [undefined, false] as unknown as string[],
        keepIdPrefix: optionsValues.keepIdPrefix,
        reservedIds: optionsValues.reservedIds,
        urlAttributes: optionsValues.urlAttributes,
      };

      for (const options of generateValueObjects(optionsValueSource)) {
        new BuiltInManglers(options as BuiltInManglersOptions);
        expect(HtmlIdManglerConstructor).to.have.been.calledOnceWith(
          sinon.match({
            idAttributes: options.idAttributes,
            idNamePattern: options.idNamePattern,
            keepIdPrefix: options.keepIdPrefix,
            reservedIds: options.reservedIds,
            urlAttributes: options.urlAttributes,
          }),
        );

        HtmlIdManglerConstructor.resetHistory();
      }
    });

    test("disable the HtmlIdMangler", function() {
      const optionsValueSource = {
        idAttributes: optionsValues.idAttributes,
        idNamePattern: optionsValues.idNamePattern,
        disableHtmlIdMangling: [true] as unknown as string[],
        keepIdPrefix: optionsValues.keepIdPrefix,
        reservedIds: optionsValues.reservedIds,
        urlAttributes: optionsValues.urlAttributes,
      };

      for (const options of generateValueObjects(optionsValueSource)) {
        new BuiltInManglers(options as BuiltInManglersOptions);
        expect(HtmlIdManglerConstructor).not.to.have.been.called;
      }
    });

    test("no configuration", function() {
      new BuiltInManglers();
      expect(HtmlIdManglerConstructor).to.have.been.calledOnceWith({ });
    });
  });
});
