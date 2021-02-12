import { expect } from "chai";

import CssClassMangler from "../../manglers/css-classes";
import CssVariableMangler from "../../manglers/css-variables";
import HtmlAttributeMangler from "../../manglers/html-attributes";
import HtmlIdMangler from "../../manglers/html-ids";

import JavaScriptLanguageSupport from "../javascript";

suite("Built-in HTML Language Support", function() {
  test(`has support for the ${CssClassMangler._ID} mangler`, function() {
    const plugin = new JavaScriptLanguageSupport();

    const expressions = plugin.getExpressionsFor(CssClassMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test(`has support for the ${CssVariableMangler._ID} mangler`, function() {
    const plugin = new JavaScriptLanguageSupport();

    const expressions = plugin.getExpressionsFor(CssVariableMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test(`has support for the ${HtmlAttributeMangler._ID} mangler`, function() {
    const plugin = new JavaScriptLanguageSupport();

    const expressions = plugin.getExpressionsFor(HtmlAttributeMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test(`has support for the ${HtmlIdMangler._ID} mangler`, function() {
    const plugin = new JavaScriptLanguageSupport();

    const expressions = plugin.getExpressionsFor(HtmlIdMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test("get languages", function() {
    const plugin = new JavaScriptLanguageSupport();

    const result = plugin.getLanguages();
    expect(result).to.include("js");
    expect(result).to.include("cjs");
    expect(result).to.include("mjs");
  });
});
