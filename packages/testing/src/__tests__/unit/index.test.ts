import { expect } from "chai";

import * as testing from "../../index";

suite("Package exports", function() {
  test("has checkWebManglerLanguagePlugin", function() {
    expect(testing).to.haveOwnProperty("checkWebManglerLanguagePlugin");
  });

  test("has generateValueObjects", function() {
    expect(testing).to.haveOwnProperty("generateValueObjects");
  });

  test("has generateValueObjectsAll", function() {
    expect(testing).to.haveOwnProperty("generateValueObjectsAll");
  });

  test("has MangleExpressionMock", function() {
    expect(testing).to.haveOwnProperty("MangleExpressionMock");
  });

  test("has WebManglerPluginMock", function() {
    expect(testing).to.haveOwnProperty("WebManglerPluginMock");
  });

  test("has WebManglerLanguagePluginMock", function() {
    expect(testing).to.haveOwnProperty("WebManglerLanguagePluginMock");
  });
});
