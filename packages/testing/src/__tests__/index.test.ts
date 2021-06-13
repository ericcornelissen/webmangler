import { expect } from "chai";

import * as testing from "../index";

suite("Standard mocks", function() {
  test("has MangleExpressionMock", function() {
    expect(testing).to.haveOwnProperty("MangleExpressionMock");
  });

  test("has WebManglerPluginMock", function() {
    expect(testing).to.haveOwnProperty("WebManglerPluginMock");
  });

  test("has WebManglerLanguagePluginMock", function() {
    expect(testing).to.haveOwnProperty("WebManglerLanguagePluginMock");
  });

  test("has WebManglerPluginLanguageMock", function() {
    expect(testing).to.haveOwnProperty("WebManglerPluginLanguageMock");
  });
});
