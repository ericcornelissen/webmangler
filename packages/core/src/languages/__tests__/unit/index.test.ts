import { expect } from "chai";

import * as manglers from "../../index";

suite("The webmangler/languages exports", function() {
  test("has BuiltInLanguagesSupport", function() {
    expect(manglers).to.have.property("BuiltInLanguagesSupport");
  });

  test("has CssLanguageSupport", function() {
    expect(manglers).to.have.property("CssLanguageSupport");
  });

  test("has HtmlLanguageSupport", function() {
    expect(manglers).to.have.property("HtmlLanguageSupport");
  });

  test("has JavaScriptLanguageSupport", function() {
    expect(manglers).to.have.property("JavaScriptLanguageSupport");
  });
});
