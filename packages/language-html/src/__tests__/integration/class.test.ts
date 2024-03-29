import type {
  AttributeOptions,
  MultiValueAttributeOptions,
  SingleValueAttributeOptions,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

import { expect } from "chai";

import HtmlLanguagePlugin from "../../index";

suite("The @webmangler/language-html plugin", function() {
  test("no argument", function() {
    expect(() => new HtmlLanguagePlugin()).not.to.throw();
  });

  test("empty options object", function() {
    expect(() => new HtmlLanguagePlugin({})).not.to.throw();
  });

  suite("::getEmbeds", function() {
    let plugin: WebManglerLanguagePlugin;

    setup(function() {
      plugin = new HtmlLanguagePlugin();
    });

    test("can detect <script>s", function() {
      const file = {
        type: "html",
        content: "<script>var foo = \"bar\";</script>",
      };

      const result = plugin.getEmbeds(file);
      expect(result).to.have.length(1);
    });

    test("can detect <style>s", function() {
      const file = {
        type: "html",
        content: "<style>.foo { color: red; }</style>",
      };

      const result = plugin.getEmbeds(file);
      expect(result).to.have.length(1);
    });

    test("can detect style attributes", function() {
      const file = {
        type: "html",
        content: "<div style=\"font: serif\"></div>",
      };

      const result = plugin.getEmbeds(file);
      expect(result).to.have.length(1);
    });
  });

  suite("::getExpressions", function() {
    let plugin: WebManglerLanguagePlugin;

    setup(function() {
      plugin = new HtmlLanguagePlugin();
    });

    test("has support for mangling 'attributes'", function() {
      const options: AttributeOptions = { };

      const result = plugin.getExpressions("attributes", options);
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
    const DEFAULT_EXTENSIONS = ["html", "xhtml"];

    test("get languages", function() {
      const plugin = new HtmlLanguagePlugin();
      const result = new Set(plugin.getLanguages());
      expect(result).to.deep.equal(new Set(DEFAULT_EXTENSIONS));
    });

    test("get configured languages", function() {
      const htmlExtensions = ["html5", "pug"];

      const plugin = new HtmlLanguagePlugin({ htmlExtensions });
      const result = new Set(plugin.getLanguages());
      expect(result).to.deep.equal(new Set([
        ...DEFAULT_EXTENSIONS,
        ...htmlExtensions,
      ]));
    });
  });
});
