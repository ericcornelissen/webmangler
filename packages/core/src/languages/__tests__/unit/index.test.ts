import { expect } from "chai";

import * as languages from "../../index";

suite("The webmangler/languages exports", function() {
  test("has BuiltInLanguagesSupport", function() {
    expect(languages).to.have.property("BuiltInLanguagesSupport");
  });

  test("has CssLanguageSupport", function() {
    expect(languages).to.have.property("CssLanguageSupport");
  });

  test("has HtmlLanguageSupport", function() {
    expect(languages).to.have.property("HtmlLanguageSupport");
  });

  test("has JavaScriptLanguageSupport", function() {
    expect(languages).to.have.property("JavaScriptLanguageSupport");
  });
});
