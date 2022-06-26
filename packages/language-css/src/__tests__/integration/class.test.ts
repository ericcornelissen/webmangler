import type {
  CssDeclarationPropertyOptions,
  CssDeclarationValueOptions,
  QuerySelectorOptions,
  SingleValueAttributeOptions,
  WebManglerLanguagePlugin,
} from"@webmangler/types";

import { expect } from "chai";

import CssLanguagePlugin from "../../index";

suite("The @webmangler/language-css plugin", function() {
  test("no argument", function() {
    expect(() => new CssLanguagePlugin()).not.to.throw();
  });

  test("empty options object", function() {
    expect(() => new CssLanguagePlugin({ })).not.to.throw();
  });

  suite("::getEmbeds", function() {
    let plugin: WebManglerLanguagePlugin;

    setup(function() {
      plugin = new CssLanguagePlugin();
    });

    test("no embeds", function() {
      const file = {
        type: "css",
        content: ".foo { color: red; }",
      };

      const result = plugin.getEmbeds(file);
      expect(result).to.have.length(0);
    });

    test("media query", function() {
      const file = {
        type: "css",
        content: "@media screen { .foo { color: red; } }",
      };

      const result = plugin.getEmbeds(file);
      expect(result).to.have.length(1);
    });
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
      const result = new Set(plugin.getLanguages());
      expect(result).to.deep.equal(new Set(DEFAULT_EXTENSIONS));
    });

    test("get configured languages", function() {
      const cssExtensions = ["less", "sass"];

      const plugin = new CssLanguagePlugin({ cssExtensions });
      const result = new Set(plugin.getLanguages());
      expect(result).to.deep.equal(new Set([
        ...DEFAULT_EXTENSIONS,
        ...cssExtensions,
      ]));
    });
  });
});
