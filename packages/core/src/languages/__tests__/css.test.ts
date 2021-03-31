import type { WebManglerLanguagePlugin } from "../../types";
import type {
  CssDeclarationPropertyOptions,
  CssDeclarationValueOptions,
  QuerySelectorOptions,
  SingleValueAttributeOptions,
} from "../options";

import { expect } from "chai";

import CssLanguagePlugin from "../css";

suite("Built-in CSS Language Plugin", function() {
  test("no argument", function() {
    expect(() => new CssLanguagePlugin()).not.to.throw();
  });

  test("empty options object", function() {
    expect(() => new CssLanguagePlugin({})).not.to.throw();
  });

  suite("::getExpressions", function() {
    let plugin: WebManglerLanguagePlugin;

    setup(function() {
      plugin = new CssLanguagePlugin();
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
  });

  suite("::getLanguages", function() {
    const DEFAULT_EXTENSIONS = ["css"];

    test("get default languages", function() {
      const plugin = new CssLanguagePlugin();
      const result = plugin.getLanguages();
      expect(result).to.include.keys(DEFAULT_EXTENSIONS);
    });

    test("get configured languages", function() {
      const cssExtensions = ["less", "sass"];

      const plugin = new CssLanguagePlugin({ cssExtensions });
      const result = plugin.getLanguages();
      expect(result).to.include.keys(DEFAULT_EXTENSIONS);
      expect(result).to.include.keys(cssExtensions);
    });
  });
});
