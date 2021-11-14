import type {
  CssDeclarationPropertyOptions,
  QuerySelectorOptions,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

import { expect } from "chai";

import JavaScriptLanguagePlugin from "../index";

suite("The @webmangler/language-js plugin", function() {
  test("no argument", function() {
    expect(() => new JavaScriptLanguagePlugin()).not.to.throw();
  });

  test("empty options object", function() {
    expect(() => new JavaScriptLanguagePlugin({})).not.to.throw();
  });

  suite("::getEmbeds", function() {
    test("does not throw", function() {
      const file = {
        type: "css",
        content: ".foo { color: red; }",
      };

      const plugin = new JavaScriptLanguagePlugin();
      expect(() => plugin.getEmbeds(file)).not.to.throw();
    });
  });

  suite("::getExpressions", function() {
    let plugin: WebManglerLanguagePlugin;

    setup(function() {
      plugin = new JavaScriptLanguagePlugin();
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
  });

  suite("::getLanguages", function() {
    const DEFAULT_EXTENSIONS = ["js", "cjs", "mjs"];

    test("no configured languages", function() {
      const plugin = new JavaScriptLanguagePlugin();
      const result = new Set(plugin.getLanguages());
      expect(result).to.deep.equal(new Set(DEFAULT_EXTENSIONS));
    });

    test("multiple configured languages", function() {
      const jsExtensions = ["jsx", "ts"];

      const plugin = new JavaScriptLanguagePlugin({ jsExtensions });
      const result = new Set(plugin.getLanguages());
      expect(result).to.deep.equal(new Set([
        ...DEFAULT_EXTENSIONS,
        ...jsExtensions,
      ]));
    });
  });
});
