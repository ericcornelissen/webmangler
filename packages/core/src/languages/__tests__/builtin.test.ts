import { expect } from "chai";

import CssClassMangler from "../../manglers/css-classes";
import CssVariableMangler from "../../manglers/css-variables";
import HtmlAttributeMangler from "../../manglers/html-attributes";
import HtmlIdMangler from "../../manglers/html-ids";

import BuiltInLanguageSupport from "../builtin";
import CssLanguageSupport from "../css";
import HtmlLanguageSupport from "../html";
import JavaScriptLanguageSupport from "../javascript";

suite("Built-in Language Supports", function() {
  test(`has support for the ${CssClassMangler._ID} mangler`, function() {
    const plugin = new BuiltInLanguageSupport();

    const expressions = plugin.getExpressionsFor(CssClassMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test(`has support for the ${CssVariableMangler._ID} mangler`, function() {
    const plugin = new BuiltInLanguageSupport();

    const expressions = plugin.getExpressionsFor(CssVariableMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test(`has support for the ${HtmlAttributeMangler._ID} mangler`, function() {
    const plugin = new BuiltInLanguageSupport();

    const expressions = plugin.getExpressionsFor(HtmlAttributeMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test(`has support for the ${HtmlIdMangler._ID} mangler`, function() {
    const plugin = new BuiltInLanguageSupport();

    const expressions = plugin.getExpressionsFor(HtmlIdMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test("get languages", function() {
    const plugin = new BuiltInLanguageSupport();

    const result = plugin.getLanguages();

    for (const language of new CssLanguageSupport().getLanguages()) {
      expect(result).to.include(language);
    }

    for (const language of new HtmlLanguageSupport().getLanguages()) {
      expect(result).to.include(language);
    }

    for (const language of new JavaScriptLanguageSupport().getLanguages()) {
      expect(result).to.include(language);
    }
  });
});
