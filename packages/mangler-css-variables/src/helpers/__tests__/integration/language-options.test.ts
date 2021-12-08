import type {
  CssDeclarationPropertyOptions,
  CssDeclarationValueOptions,
  MangleExpressionOptions,
} from "@webmangler/types";

import { expect } from "chai";

import {
  getLanguageOptions,
} from "../../index";

suite("CSS Variable Mangler language-options helpers", function() {
  let languageOptions: Iterable<MangleExpressionOptions<unknown>>;

  setup(function() {
    languageOptions = getLanguageOptions();
  });

  suite("The css-declaration-properties", function() {
    const optionName = "css-declaration-properties";

    let subject: MangleExpressionOptions<CssDeclarationPropertyOptions>;

    setup(function() {
      subject = Array.prototype.find.call(
        languageOptions,
        (options) => options.name === optionName,
      );

      expect(subject).not.to.be.undefined;
    });

    test("the `prefix` option", function() {
      const prefix = subject.options.prefix;
      expect(prefix).to.equal("--");
    });

    test("the `suffix` option", function() {
      const suffix = subject.options.suffix;
      expect(suffix).to.be.undefined;
    });
  });

  suite("The css-declaration-values", function() {
    const optionName = "css-declaration-values";

    let subject: MangleExpressionOptions<CssDeclarationValueOptions>;

    setup(function() {
      subject = Array.prototype.find.call(
        languageOptions,
        (options) => options.name === optionName,
      );

      expect(subject).not.to.be.undefined;
    });

    test("the `prefix` option", function() {
      const prefix = subject.options.prefix;
      expect(prefix).to.equal("var\\s*\\(\\s*--");
    });

    test("the `suffix` option", function() {
      const suffix = subject.options.suffix;
      expect(suffix).to.equal("\\s*(,[^\\)]+)?\\)");
    });
  });
});
