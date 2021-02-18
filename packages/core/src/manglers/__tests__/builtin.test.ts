import type { BuiltInManglersOptions } from "../builtin";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import {  permuteObjects } from "./test-helpers";

import CssClassManglerMock from "../__mocks__/css-classes.mock";
import CssVarManglerMock from "../__mocks__/css-variables.mock";
import HtmlAttrManglerMock from "../__mocks__/html-attributes.mock";
import HtmlIdManglerMock from "../__mocks__/html-ids.mock";

import * as CssClassMangler from "../css-classes";
import * as CssVarMangler from "../css-variables";
import * as HtmlAttrMangler from "../html-attributes";
import * as HtmlIdMangler from "../html-ids";

import BuiltInLanguageSupport from "../../languages/builtin";
import BuiltInManglers from "../builtin";

chaiUse(sinonChai);

const builtInLanguageSupport = new BuiltInLanguageSupport();

suite("Built-in Manglers", function() {
  const DEFAULT_CLASS_NAME_OPTIONS = { classNamePattern: "cls[-_][a-z-_]+" };
  const DEFAULT_CSS_VAR_OPTIONS = { cssVarNamePattern: "[a-z-]+" };
  const DEFAULT_HTML_ATTR_OPTIONS = { attrNamePattern: "data-[a-z-]+" };
  const DEFAULT_HTML_ID_OPTIONS = { idNamePattern: "id[-_][a-z-_]+" };
  const ALL_DEFAULT_OPTIONS = [
    DEFAULT_CLASS_NAME_OPTIONS,
    DEFAULT_CSS_VAR_OPTIONS,
    DEFAULT_HTML_ATTR_OPTIONS,
    DEFAULT_HTML_ID_OPTIONS,
  ];

  let CssClassManglerStub: sinon.SinonStub;
  let CssVarManglerStub: sinon.SinonStub;
  let HtmlAttrManglerStub: sinon.SinonStub;
  let HtmlIdManglerStub: sinon.SinonStub;

  suiteSetup(function() {
    CssClassManglerStub = sinon.stub(CssClassMangler, "default").returns(CssClassManglerMock);
    CssVarManglerStub = sinon.stub(CssVarMangler, "default").returns(CssVarManglerMock);
    HtmlAttrManglerStub = sinon.stub(HtmlAttrMangler, "default").returns(HtmlAttrManglerMock);
    HtmlIdManglerStub = sinon.stub(HtmlIdMangler, "default").returns(HtmlIdManglerMock);
  });

  suite("CSS class mangler", function() {
    const DISABLE_CSS_CLASS_MANGLING = { disableCssClassMangling: true };

    let ALL_NON_CSS_CLASS_OPTIONS: BuiltInManglersOptions[];

    suiteSetup(function() {
      ALL_NON_CSS_CLASS_OPTIONS = permuteObjects(
        ALL_DEFAULT_OPTIONS.filter((options) => {
          return options !== DEFAULT_CLASS_NAME_OPTIONS;
        }),
      );
    });

    setup(function() {
      CssClassManglerMock.config.resetHistory();
      CssClassManglerMock.use.resetHistory();
    });

    test("mangling when class pattern is set", function() {
      for (const _options of ALL_NON_CSS_CLASS_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_CLASS_NAME_OPTIONS);

        const mangler = new BuiltInManglers(options);
        const result = mangler.config();
        expect(CssClassManglerMock.config).to.have.callCount(1);
        expect(result).to.deep.include(CssClassManglerMock.config()[0]);

        CssClassManglerMock.config.resetHistory();
      }
    });

    test("using language plugins when class pattern is set", function() {
      for (const _options of ALL_NON_CSS_CLASS_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_CLASS_NAME_OPTIONS);

        const mangler = new BuiltInManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(CssClassManglerMock.use).to.have.been.calledOnce;

        CssClassManglerMock.use.resetHistory();
      }
    });

    test("mangling when class pattern is NOT set", function() {
      for (const options of ALL_NON_CSS_CLASS_OPTIONS) {
        const mangler = new BuiltInManglers(options);
        const result = mangler.config();
        expect(CssClassManglerMock.config).to.have.callCount(1);
        expect(result).to.deep.include(CssClassManglerMock.config()[0]);

        CssClassManglerMock.config.resetHistory();
      }
    });

    test("using language plugins when class pattern is NOT set", function() {
      for (const options of ALL_NON_CSS_CLASS_OPTIONS) {
        const mangler = new BuiltInManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(CssClassManglerMock.use).to.have.been.calledOnce;

        CssClassManglerMock.use.resetHistory();
      }
    });

    test("mangling when the CSS class mangler is disabled", function() {
      for (const _options of ALL_NON_CSS_CLASS_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_CSS_CLASS_MANGLING);

        const mangler = new BuiltInManglers(options);
        const result = mangler.config();
        expect(CssClassManglerMock.config).to.have.callCount(0);
        expect(result).not.to.deep.include(CssClassManglerMock.config()[0]);

        CssClassManglerMock.config.resetHistory();
      }
    });

    test("using language plugins when the CSS class mangler is disabled", function() {
      for (const _options of ALL_NON_CSS_CLASS_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_CSS_CLASS_MANGLING);

        const mangler = new BuiltInManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(CssClassManglerMock.use).not.to.have.been.called;
      }
    });
  });

  suite("CSS variable mangler", function() {
    const DISABLE_CSS_VAR_MANGLING = { disableCssVarMangling: true };

    let ALL_NON_CSS_VAR_OPTIONS: BuiltInManglersOptions[];

    suiteSetup(function() {
      ALL_NON_CSS_VAR_OPTIONS = permuteObjects(
        ALL_DEFAULT_OPTIONS.filter((options) => {
          return options !== DEFAULT_CSS_VAR_OPTIONS;
        }),
      );
    });

    setup(function() {
      CssVarManglerMock.config.resetHistory();
      CssVarManglerMock.use.resetHistory();
    });

    test("mangling when CSS variable pattern is set", function() {
      for (const _options of ALL_NON_CSS_VAR_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_CSS_VAR_OPTIONS);

        const mangler = new BuiltInManglers(options);
        const result = mangler.config();
        expect(CssVarManglerMock.config).to.have.callCount(1);
        expect(result).to.deep.include(CssVarManglerMock.config()[0]);

        CssVarManglerMock.config.resetHistory();
      }
    });

    test("using language plugins when CSS variable pattern is set", function() {
      for (const _options of ALL_NON_CSS_VAR_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_CSS_VAR_OPTIONS);

        const mangler = new BuiltInManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(CssVarManglerMock.use).to.have.been.calledOnce;

        CssVarManglerMock.use.resetHistory();
      }
    });

    test("mangling when CSS variable pattern is NOT set", function() {
      for (const options of ALL_NON_CSS_VAR_OPTIONS) {
        const mangler = new BuiltInManglers(options);
        const result = mangler.config();
        expect(CssVarManglerMock.config).to.have.callCount(1);
        expect(result).to.deep.include(CssVarManglerMock.config()[0]);

        CssVarManglerMock.config.resetHistory();
      }
    });

    test("using language plugins when CSS variable pattern is NOT set", function() {
      for (const options of ALL_NON_CSS_VAR_OPTIONS) {
        const mangler = new BuiltInManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(CssVarManglerMock.use).to.have.been.calledOnce;

        CssVarManglerMock.use.resetHistory();
      }
    });

    test("mangling when the CSS variable mangler is disabled", function() {
      for (const _options of ALL_NON_CSS_VAR_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_CSS_VAR_MANGLING);

        const mangler = new BuiltInManglers(options);
        const result = mangler.config();
        expect(CssVarManglerMock.config).to.have.callCount(0);
        expect(result).not.to.deep.include(CssVarManglerMock.config()[0]);

        CssVarManglerMock.config.resetHistory();
      }
    });

    test("using language plugins when the CSS variable mangler is disabled", function() {
      for (const _options of ALL_NON_CSS_VAR_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_CSS_VAR_MANGLING);

        const mangler = new BuiltInManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(CssVarManglerMock.use).not.to.have.been.called;
      }
    });
  });

  suite("HTML attribute mangler", function() {
    const DISABLE_HTML_ATTR_MANGLING = { disableHtmlAttrMangling: true };

    let ALL_NON_HTML_ATTR_OPTIONS: BuiltInManglersOptions[];

    suiteSetup(function() {
      ALL_NON_HTML_ATTR_OPTIONS = permuteObjects(
        ALL_DEFAULT_OPTIONS.filter((options) => {
          return options !== DEFAULT_HTML_ATTR_OPTIONS;
        }),
      );
    });

    setup(function() {
      HtmlAttrManglerMock.config.resetHistory();
      HtmlAttrManglerMock.use.resetHistory();
    });

    test("mangling when HTML attributes pattern is set", function() {
      for (const _options of ALL_NON_HTML_ATTR_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_HTML_ATTR_OPTIONS);

        const mangler = new BuiltInManglers(options);
        const result = mangler.config();
        expect(HtmlAttrManglerMock.config).to.have.callCount(1);
        expect(result).to.deep.include(HtmlAttrManglerMock.config()[0]);

        HtmlAttrManglerMock.config.resetHistory();
      }
    });

    test("using language plugins when HTML attributes pattern is set", function() {
      for (const _options of ALL_NON_HTML_ATTR_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_HTML_ATTR_OPTIONS);

        const mangler = new BuiltInManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(HtmlAttrManglerMock.use).to.have.been.calledOnce;

        HtmlAttrManglerMock.use.resetHistory();
      }
    });

    test("mangling when HTML attributes pattern is NOT set", function() {
      for (const options of ALL_NON_HTML_ATTR_OPTIONS) {
        const mangler = new BuiltInManglers(options);
        const result = mangler.config();
        expect(HtmlAttrManglerMock.config).to.have.callCount(1);
        expect(result).to.deep.include(HtmlAttrManglerMock.config()[0]);

        HtmlAttrManglerMock.config.resetHistory();
      }
    });

    test("using language plugins when HTML attributes pattern is NOT set", function() {
      for (const options of ALL_NON_HTML_ATTR_OPTIONS) {
        const mangler = new BuiltInManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(HtmlAttrManglerMock.use).to.have.been.calledOnce;

        HtmlAttrManglerMock.use.resetHistory();
      }
    });

    test("mangling when the HTML attribute mangler is disabled", function() {
      for (const _options of ALL_NON_HTML_ATTR_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_HTML_ATTR_MANGLING);

        const mangler = new BuiltInManglers(options);
        const result = mangler.config();
        expect(HtmlAttrManglerMock.config).to.have.callCount(0);
        expect(result).not.to.deep.include(HtmlAttrManglerMock.config()[0]);

        HtmlAttrManglerMock.config.resetHistory();
      }
    });

    test("using language plugins when the HTML attribute mangler is disabled", function() {
      for (const _options of ALL_NON_HTML_ATTR_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_HTML_ATTR_MANGLING);

        const mangler = new BuiltInManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(HtmlAttrManglerMock.use).not.to.have.been.called;
      }
    });
  });

  suite("HTML ID mangler", function() {
    const DISABLE_HTML_ID_MANGLING = { disableHtmlIdMangling: true };

    let ALL_NON_HTML_ID_OPTIONS: BuiltInManglersOptions[];

    suiteSetup(function() {
      ALL_NON_HTML_ID_OPTIONS = permuteObjects(
        ALL_DEFAULT_OPTIONS.filter((options) => {
          return options !== DEFAULT_HTML_ID_OPTIONS;
        }),
      );
    });

    setup(function() {
      HtmlIdManglerMock.config.resetHistory();
      HtmlIdManglerMock.use.resetHistory();
    });

    test("mangling when IDs pattern is set", function() {
      for (const _options of ALL_NON_HTML_ID_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_HTML_ID_OPTIONS);

        const mangler = new BuiltInManglers(options);
        const result = mangler.config();
        expect(HtmlIdManglerMock.config).to.have.callCount(1);
        expect(result).to.deep.include(HtmlIdManglerMock.config()[0]);

        HtmlIdManglerMock.config.resetHistory();
      }
    });

    test("using language plugins when IDs pattern is set", function() {
      for (const _options of ALL_NON_HTML_ID_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_HTML_ID_OPTIONS);

        const mangler = new BuiltInManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(HtmlIdManglerMock.use).to.have.been.calledOnce;

        HtmlIdManglerMock.use.resetHistory();
      }
    });

    test("mangling when IDs pattern is NOT set", function() {
      for (const options of ALL_NON_HTML_ID_OPTIONS) {
        const mangler = new BuiltInManglers(options);
        const result = mangler.config();
        expect(HtmlIdManglerMock.config).to.have.callCount(1);
        expect(result).to.deep.include(HtmlIdManglerMock.config()[0]);

        HtmlIdManglerMock.config.resetHistory();
      }
    });

    test("using language plugins when IDs pattern is NOT set", function() {
      for (const options of ALL_NON_HTML_ID_OPTIONS) {
        const mangler = new BuiltInManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(HtmlIdManglerMock.use).to.have.been.calledOnce;

        HtmlIdManglerMock.use.resetHistory();
      }
    });

    test("mangling when the HTML IDs mangler is disabled", function() {
      for (const _options of ALL_NON_HTML_ID_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_HTML_ID_MANGLING);

        const mangler = new BuiltInManglers(options);
        const result = mangler.config();
        expect(HtmlIdManglerMock.config).to.have.callCount(0);
        expect(result).not.to.deep.include(HtmlIdManglerMock.config()[0]);

        HtmlIdManglerMock.config.resetHistory();
      }
    });

    test("using language plugins when the HTML IDs mangler is disabled", function() {
      for (const _options of ALL_NON_HTML_ID_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_HTML_ID_MANGLING);

        const mangler = new BuiltInManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(HtmlIdManglerMock.use).not.to.have.been.called;
      }
    });
  });

  test("no configuration", function() {
    expect(new BuiltInManglers).not.to.throw;
  });

  suiteTeardown(function() {
    CssClassManglerStub.restore();
    CssVarManglerStub.restore();
    HtmlAttrManglerStub.restore();
    HtmlIdManglerStub.restore();
  });
});
