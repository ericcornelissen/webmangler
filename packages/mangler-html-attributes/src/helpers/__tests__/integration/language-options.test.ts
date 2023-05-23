import type {
  AttributeOptions,
  CssDeclarationValueOptions,
  MangleExpressionOptions,
  QuerySelectorOptions,
} from "@webmangler/types";

import { expect } from "chai";

import {
  getLanguageOptions,
} from "../../index";

suite("HTML Attribute Mangler language-options helpers", function() {
  let languageOptions: Iterable<MangleExpressionOptions<unknown>>;

  setup(function() {
    languageOptions = getLanguageOptions();
  });

  suite("The attributes options", function() {
    const optionName = "attributes";

    let subject: MangleExpressionOptions<AttributeOptions>;

    setup(function() {
      subject = Array.prototype.find.call(
        languageOptions,
        (options) => options.name === optionName,
      );

      expect(subject).not.to.be.undefined;
    });

    test("the options", function() {
      const options = subject.options;
      expect(options).to.deep.equal({ });
    });
  });

  suite("The query-selectors options", function() {
    const optionName = "query-selectors";

    let subject: MangleExpressionOptions<QuerySelectorOptions>;

    setup(function() {
      subject = Array.prototype.find.call(
        languageOptions,
        (options) => options.name === optionName,
      );

      expect(subject).not.to.be.undefined;
    });

    test("the `prefix` option", function() {
      const prefix = subject.options.prefix;
      expect(prefix).to.equal("\\[\\s*");
    });

    test("the `suffix` option", function() {
      const suffix = subject.options.suffix;
      expect(suffix).to.equal("\\s*(?:[=\\]]|[$*^|~]=)");
    });
  });

  suite("The css-declaration-values options", function() {
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
      expect(prefix).to.equal("(?:ATTR|ATTr|ATtR|ATtr|AtTR|AtTr|AttR|Attr|aTTR|aTTr|aTtR|aTtr|atTR|atTr|attR|attr)\\s*\\(\\s*");
    });

    test("the `suffix` option", function() {
      const suffix = subject.options.suffix;
      expect(suffix).to.equal("(?:\\s+(?:[A-Za-z]+|%))?\\s*(?:,[^)]+)?\\)");
    });
  });
});
