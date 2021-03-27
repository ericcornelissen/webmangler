import type { WebManglerLanguagePlugin } from "../../types";
import type {
  AttributeOptions,
  CssDeclarationPropertyOptions,
  CssDeclarationValueOptions,
  MultiValueAttributeOptions,
  SingleValueAttributeOptions,
} from "../options";

import { expect } from "chai";

import HtmlLanguagePlugin from "../html";

suite("Built-in HTML Language Plugin", function() {
  test("no argument", function() {
    expect(() => new HtmlLanguagePlugin()).not.to.throw();
  });

  test("empty options object", function() {
    expect(() => new HtmlLanguagePlugin({})).not.to.throw();
  });

  suite("::getExpressions", function() {
    let plugin: WebManglerLanguagePlugin;

    setup(function() {
      plugin = new HtmlLanguagePlugin();
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

    test("has support for mangling 'multi-value-attributes'", function() {
      const options: MultiValueAttributeOptions = {
        attributeNames: ["foo", "bar"],
      };

      const result = plugin.getExpressions("multi-value-attributes", options);
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
    const DEFAULT_LANGUAGES = ["html", "xhtml"];

    test("get languages", function() {
      const plugin = new HtmlLanguagePlugin();
      const result = plugin.getLanguages();
      expect(result).to.include.keys(DEFAULT_LANGUAGES);
    });

    test("get configured languages", function() {
      const languages = ["html5", "pug"];

      const plugin = new HtmlLanguagePlugin({ languages });
      const result = plugin.getLanguages();
      expect(result).to.include.keys(DEFAULT_LANGUAGES);
      expect(result).to.include.keys(languages);
    });
  });
});
