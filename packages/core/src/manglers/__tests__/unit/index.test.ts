import { expect } from "chai";

import * as manglers from "../../index";

suite("The webmangler/manglers exports", function() {
  test("has BuiltInManglers", function() {
    expect(manglers).to.have.property("BuiltInManglers");
  });

  test("has RecommendedManglers", function() {
    expect(manglers).to.have.property("RecommendedManglers");
  });

  test("has CssClassMangler", function() {
    expect(manglers).to.have.property("CssClassMangler");
  });

  test("has CssVariableMangler", function() {
    expect(manglers).to.have.property("CssVariableMangler");
  });

  test("has HtmlAttributeMangler", function() {
    expect(manglers).to.have.property("HtmlAttributeMangler");
  });

  test("has HtmlIdMangler", function() {
    expect(manglers).to.have.property("HtmlIdMangler");
  });
});
