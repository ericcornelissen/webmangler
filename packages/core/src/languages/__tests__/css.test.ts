import type { WebManglerLanguagePlugin } from "../../types";
import type {
  AttributeOptions,
  CssDeclarationPropertyOptions,
  CssDeclarationValueOptions,
  QuerySelectorOptions,
  SingleValueAttributeOptions,
} from "../options";

import { expect } from "chai";

import CssLanguageSupport from "../css";

suite("Built-in CSS Language Support", function() {
  let plugin: WebManglerLanguagePlugin;

  setup(function() {
    plugin = new CssLanguageSupport();
  });

  test("has support for mangling 'attributes'", function() {
    const options: AttributeOptions = null;

    const result = plugin.getExpressions("attributes", options);
    expect(result).to.have.length.above(0);
  });

  test("has support for mangling 'css-declaration-properties'", function() {
    const options: CssDeclarationPropertyOptions = { };

    const result = plugin.getExpressions("css-declaration-properties", options);
    expect(result).to.have.length.above(0);
  });

  test("has support for mangling 'css-declaration-values'", function() {
    const options: CssDeclarationValueOptions = { };

    const result = plugin.getExpressions("css-declaration-values", options);
    expect(result).to.have.length.above(0);
  });

  test("has support for mangling 'query-selectors'", function() {
    const options: QuerySelectorOptions = { };

    const result = plugin.getExpressions("query-selectors", options);
    expect(result).to.have.length.above(0);
  });

  test("has support for mangling 'single-value-attributes'", function() {
    const options: SingleValueAttributeOptions = {
      attributeNames: ["foo", "bar"],
    };

    const result = plugin.getExpressions("single-value-attributes", options);
    expect(result).to.have.length.above(0);
  });

  test("get languages", function() {
    const result = plugin.getLanguages();
    expect(result).to.include("css");
  });
});
