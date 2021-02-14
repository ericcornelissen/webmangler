import type { RecommendedManglersOptions } from "../recommended";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { permuteObjects } from "./test-helpers";

import ManglerFileMock from "../../__mocks__/mangler-file.mock";
import CssClassManglerMock from "../__mocks__/css-classes.mock";
import CssVarManglerMock from "../__mocks__/css-variables.mock";
import HtmlAttrManglerMock from "../__mocks__/html-attributes.mock";

import * as CssClassMangler from "../css-classes";
import * as CssVarMangler from "../css-variables";
import * as HtmlAttrMangler from "../html-attributes";

import BuiltInLanguageSupport from "../../languages/builtin";
import RecommendedManglers from "../recommended";

chaiUse(sinonChai);

const builtInLanguageSupport = new BuiltInLanguageSupport();

suite("Recommended Manglers", function() {
  const DEFAULT_FILES = [new ManglerFileMock("css", ".foo.bar { }")];

  const DEFAULT_CLASS_NAME_OPTIONS = { classNamePattern: "cls[-_][a-z-_]+" };
  const DEFAULT_CSS_VAR_OPTIONS = { cssVarNamePattern: "[a-z-]+" };
  const DEFAULT_HTML_ATTR_OPTIONS = { attrNamePattern: "data-[a-z-]+" };
  const ALL_DEFAULT_OPTIONS = [
    DEFAULT_CLASS_NAME_OPTIONS,
    DEFAULT_CSS_VAR_OPTIONS,
    DEFAULT_HTML_ATTR_OPTIONS,
  ];

  let mangleEngine: sinon.SinonSpy;
  let CssClassManglerStub: sinon.SinonStub;
  let CssVarManglerStub: sinon.SinonStub;
  let HtmlAttrManglerStub: sinon.SinonStub;

  suiteSetup(function() {
    mangleEngine = sinon.fake();

    CssClassManglerStub = sinon.stub(CssClassMangler, "default").returns(CssClassManglerMock);
    CssVarManglerStub = sinon.stub(CssVarMangler, "default").returns(CssVarManglerMock);
    HtmlAttrManglerStub = sinon.stub(HtmlAttrMangler, "default").returns(HtmlAttrManglerMock);
  });

  suite("CSS class mangler", function() {
    const DISABLE_CSS_CLASS_MANGLING = { disableCssClassMangling: true };

    let ALL_NON_CSS_CLASS_OPTIONS: RecommendedManglersOptions[];

    suiteSetup(function() {
      ALL_NON_CSS_CLASS_OPTIONS = permuteObjects(
        ALL_DEFAULT_OPTIONS.filter((options) => {
          return options !== DEFAULT_CLASS_NAME_OPTIONS;
        }),
      );
    });

    setup(function() {
      CssClassManglerMock.mangle.resetHistory();
      CssClassManglerMock.use.resetHistory();
    });

    test("mangling when class pattern is set", function() {
      for (const _options of ALL_NON_CSS_CLASS_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_CLASS_NAME_OPTIONS);

        const mangler = new RecommendedManglers(options);
        mangler.mangle(mangleEngine, DEFAULT_FILES);
        expect(CssClassManglerMock.mangle).to.have.been.calledOnce;

        CssClassManglerMock.mangle.resetHistory();
      }
    });

    test("using language plugins when class pattern is set", function() {
      for (const _options of ALL_NON_CSS_CLASS_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_CLASS_NAME_OPTIONS);

        const mangler = new RecommendedManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(CssClassManglerMock.use).to.have.been.calledOnce;

        CssClassManglerMock.use.resetHistory();
      }
    });

    test("mangling when class pattern is NOT set", function() {
      for (const options of ALL_NON_CSS_CLASS_OPTIONS) {
        const mangler = new RecommendedManglers(options);
        mangler.mangle(mangleEngine, DEFAULT_FILES);
        expect(CssClassManglerMock.mangle).to.have.been.calledOnce;

        CssClassManglerMock.mangle.resetHistory();
      }
    });

    test("using language plugins when class pattern is NOT set", function() {
      for (const options of ALL_NON_CSS_CLASS_OPTIONS) {
        const mangler = new RecommendedManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(CssClassManglerMock.use).to.have.been.calledOnce;

        CssClassManglerMock.use.resetHistory();
      }
    });

    test("mangling when the CSS class mangler is disabled", function() {
      for (const _options of ALL_NON_CSS_CLASS_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_CSS_CLASS_MANGLING);

        const mangler = new RecommendedManglers(options);
        mangler.mangle(mangleEngine, DEFAULT_FILES);
        expect(CssClassManglerMock.mangle).not.to.have.been.called;
      }
    });

    test("using language plugins when the CSS class mangler is disabled", function() {
      for (const _options of ALL_NON_CSS_CLASS_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_CSS_CLASS_MANGLING);

        const mangler = new RecommendedManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(CssClassManglerMock.use).not.to.have.been.called;
      }
    });
  });

  suite("CSS variable mangler", function() {
    const DISABLE_CSS_VAR_MANGLING = { disableCssVarMangling: true };

    let ALL_NON_CSS_VAR_OPTIONS: RecommendedManglersOptions[];

    suiteSetup(function() {
      ALL_NON_CSS_VAR_OPTIONS = permuteObjects(
        ALL_DEFAULT_OPTIONS.filter((options) => {
          return options !== DEFAULT_CSS_VAR_OPTIONS;
        }),
      );
    });

    setup(function() {
      CssVarManglerMock.mangle.resetHistory();
      CssVarManglerMock.use.resetHistory();
    });

    test("mangling when CSS variable pattern is set", function() {
      for (const _options of ALL_NON_CSS_VAR_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_CSS_VAR_OPTIONS);

        const mangler = new RecommendedManglers(options);
        mangler.mangle(mangleEngine, DEFAULT_FILES);
        expect(CssVarManglerMock.mangle).to.have.been.calledOnce;

        CssVarManglerMock.mangle.resetHistory();
      }
    });

    test("using language plugins when CSS variable pattern is set", function() {
      for (const _options of ALL_NON_CSS_VAR_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_CSS_VAR_OPTIONS);

        const mangler = new RecommendedManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(CssVarManglerMock.use).to.have.been.called;

        CssVarManglerMock.use.resetHistory();
      }
    });

    test("mangling when CSS variable pattern is NOT set", function() {
      for (const options of ALL_NON_CSS_VAR_OPTIONS) {
        const mangler = new RecommendedManglers(options);
        mangler.mangle(mangleEngine, DEFAULT_FILES);
        expect(CssVarManglerMock.mangle).to.have.been.calledOnce;

        CssVarManglerMock.mangle.resetHistory();
      }
    });

    test("using language plugins when CSS variable pattern is NOT set", function() {
      for (const options of ALL_NON_CSS_VAR_OPTIONS) {
        const mangler = new RecommendedManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(CssVarManglerMock.use).to.have.been.calledOnce;

        CssVarManglerMock.use.resetHistory();
      }
    });

    test("mangling when the CSS variable mangler is disabled", function() {
      for (const _options of ALL_NON_CSS_VAR_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_CSS_VAR_MANGLING);

        const mangler = new RecommendedManglers(options);
        mangler.mangle(mangleEngine, DEFAULT_FILES);
        expect(CssVarManglerMock.mangle).not.to.have.been.called;
      }
    });

    test("using language plugins when the CSS variable mangler is disabled", function() {
      for (const _options of ALL_NON_CSS_VAR_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_CSS_VAR_MANGLING);

        const mangler = new RecommendedManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(CssVarManglerMock.use).not.to.have.been.called;
      }
    });
  });

  suite("HTML attribute mangler", function() {
    const DISABLE_HTML_ATTR_MANGLING = { disableHtmlAttrMangling: true };

    let ALL_NON_HTML_ATTR_OPTIONS: RecommendedManglersOptions[];

    suiteSetup(function() {
      ALL_NON_HTML_ATTR_OPTIONS = permuteObjects(
        ALL_DEFAULT_OPTIONS.filter((options) => {
          return options !== DEFAULT_HTML_ATTR_OPTIONS;
        }),
      );
    });

    setup(function() {
      HtmlAttrManglerMock.mangle.resetHistory();
      HtmlAttrManglerMock.use.resetHistory();
    });

    test("mangling when HTML attributes pattern is set", function() {
      for (const _options of ALL_NON_HTML_ATTR_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_HTML_ATTR_OPTIONS);

        const mangler = new RecommendedManglers(options);
        mangler.mangle(mangleEngine, DEFAULT_FILES);
        expect(HtmlAttrManglerMock.mangle).to.have.been.calledOnce;

        HtmlAttrManglerMock.mangle.resetHistory();
      }
    });

    test("using language plugins when HTML attributes pattern is set", function() {
      for (const _options of ALL_NON_HTML_ATTR_OPTIONS) {
        const options = Object.assign({}, _options, DEFAULT_HTML_ATTR_OPTIONS);

        const mangler = new RecommendedManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(HtmlAttrManglerMock.use).to.have.been.calledOnce;

        HtmlAttrManglerMock.use.resetHistory();
      }
    });

    test("mangling when HTML attributes pattern is NOT set", function() {
      for (const options of ALL_NON_HTML_ATTR_OPTIONS) {
        const mangler = new RecommendedManglers(options);
        mangler.mangle(mangleEngine, DEFAULT_FILES);
        expect(HtmlAttrManglerMock.mangle).to.have.been.calledOnce;

        HtmlAttrManglerMock.mangle.resetHistory();
      }
    });

    test("using language plugins when HTML attributes pattern is NOT set", function() {
      for (const options of ALL_NON_HTML_ATTR_OPTIONS) {
        const mangler = new RecommendedManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(HtmlAttrManglerMock.use).to.have.been.calledOnce;

        HtmlAttrManglerMock.use.resetHistory();
      }
    });

    test("mangling when the HTML attribute mangler is disabled", function() {
      for (const _options of ALL_NON_HTML_ATTR_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_HTML_ATTR_MANGLING);

        const mangler = new RecommendedManglers(options);
        mangler.mangle(mangleEngine, DEFAULT_FILES);
        expect(HtmlAttrManglerMock.mangle).not.to.have.been.called;
      }
    });

    test("using language plugins when the HTML attribute mangler is disabled", function() {
      for (const _options of ALL_NON_HTML_ATTR_OPTIONS) {
        const options = Object.assign({}, _options, DISABLE_HTML_ATTR_MANGLING);

        const mangler = new RecommendedManglers(options);
        mangler.use(builtInLanguageSupport);
        expect(HtmlAttrManglerMock.use).not.to.have.been.called;
      }
    });
  });

  test("no configuration", function() {
    expect(new RecommendedManglers).not.to.throw;
  });

  test("no input files", function() {
    for (const options of permuteObjects(ALL_DEFAULT_OPTIONS)) {
      const mangler = new RecommendedManglers(options);

      const result = mangler.mangle(mangleEngine, []);
      expect(result).to.have.lengthOf(0);
    }
  });

  suiteTeardown(function() {
    CssClassManglerStub.restore();
    CssVarManglerStub.restore();
    HtmlAttrManglerStub.restore();
  });
});
