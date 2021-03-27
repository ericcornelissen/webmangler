import { expect } from "chai";

import * as utils from "../utils";

suite("Exports of webmangler/languages/utils", function() {
  suite("MangleExpressions", function() {
    test("has NestedGroupExpression", function() {
      expect(utils).to.haveOwnProperty("NestedGroupExpression");
    });

    test("has SingleGroupMangleExpression", function() {
      expect(utils).to.haveOwnProperty("SingleGroupMangleExpression");
    });
  });

  suite("WebManglerLanguagePlugins", function() {
    test("has MultiLanguagePlugin", function() {
      expect(utils).to.haveOwnProperty("MultiLanguagePlugin");
    });

    test("has SimpleLanguagePlugin", function() {
      expect(utils).to.haveOwnProperty("SimpleLanguagePlugin");
    });
  });
});
