import { expect } from "chai";

import CssClassMangler from "../../manglers/css-classes";
import CssVariableMangler from "../../manglers/css-variables";
import HtmlAttributeMangler from "../../manglers/html-attributes";
import HtmlIdMangler from "../../manglers/html-ids";

import CssLanguageSupport from "../css";

suite("Built-in CSS Language Support", function() {
  test(`has support for the ${CssClassMangler._ID} mangler`, function() {
    const plugin = new CssLanguageSupport();

    const expressions = plugin.getExpressionsFor(CssClassMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test(`has support for the ${CssVariableMangler._ID} mangler`, function() {
    const plugin = new CssLanguageSupport();

    const expressions = plugin.getExpressionsFor(CssVariableMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test(`has support for the ${HtmlAttributeMangler._ID} mangler`, function() {
    const plugin = new CssLanguageSupport();

    const expressions = plugin.getExpressionsFor(HtmlAttributeMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test(`has support for the ${HtmlIdMangler._ID} mangler`, function() {
    const plugin = new CssLanguageSupport();

    const expressions = plugin.getExpressionsFor(HtmlIdMangler._ID);
    expect(expressions).to.have.length.above(0);
  });

  test("get languages", function() {
    const plugin = new CssLanguageSupport();

    const result = plugin.getLanguages();
    expect(result).to.include("css");
  });
});
