import { expect } from "chai";

import * as languages from "../languages";

suite("Import webmangler/manglers", function() {
  test("has BuiltInLanguagesSupport", function() {
    expect(languages).to.haveOwnProperty("BuiltInLanguagesSupport");
  });

  test("has CssLanguageSupport", function() {
    expect(languages).to.haveOwnProperty("CssLanguageSupport");
  });

  test("has HtmlLanguageSupport", function() {
    expect(languages).to.haveOwnProperty("HtmlLanguageSupport");
  });

  test("has JavaScriptLanguageSupport", function() {
    expect(languages).to.haveOwnProperty("JavaScriptLanguageSupport");
  });
});
