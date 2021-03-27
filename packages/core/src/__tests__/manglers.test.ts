import { expect } from "chai";

import * as manglers from "../manglers";

suite("Import webmangler/manglers", function() {
  test("has BuiltInManglers", function() {
    expect(manglers).to.haveOwnProperty("BuiltInManglers");
  });

  test("has CssClassMangler", function() {
    expect(manglers).to.haveOwnProperty("CssClassMangler");
  });

  test("has CssVariableMangler", function() {
    expect(manglers).to.haveOwnProperty("CssVariableMangler");
  });

  test("has HtmlAttributeMangler", function() {
    expect(manglers).to.haveOwnProperty("HtmlAttributeMangler");
  });

  test("has HtmlIdMangler", function() {
    expect(manglers).to.haveOwnProperty("HtmlIdMangler");
  });

  test("has RecommendedManglers", function() {
    expect(manglers).to.haveOwnProperty("RecommendedManglers");
  });
});
