import type { WebManglerLanguagePlugin } from "../../types";
import type {
  CssDeclarationPropertyOptions,
  QuerySelectorOptions,
} from "../options";

import { expect } from "chai";

import JavaScriptLanguageSupport from "../javascript";

suite("Built-in JavaScript Language Support", function() {
  let plugin: WebManglerLanguagePlugin;

  setup(function() {
    plugin = new JavaScriptLanguageSupport();
  });

  test("has support for mangling 'css-declaration-properties'", function() {
    const options: CssDeclarationPropertyOptions = { };

    const result = plugin.getExpressions("css-declaration-properties", options);
    expect(result).to.have.length.above(0);
  });

  test("has support for mangling 'query-selectors'", function() {
    const options: QuerySelectorOptions = { };

    const result = plugin.getExpressions("query-selectors", options);
    expect(result).to.have.length.above(0);
  });

  test("get languages", function() {
    const result = plugin.getLanguages();
    expect(result).to.include("js");
    expect(result).to.include("cjs");
    expect(result).to.include("mjs");
  });
});
