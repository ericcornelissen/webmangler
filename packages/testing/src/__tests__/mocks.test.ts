import { expect } from "chai";

import * as mocks from "../mocks";

suite("Standard mocks", function() {
  test("has MangleExpressionMock", function() {
    expect(mocks).to.haveOwnProperty("MangleExpressionMock");
  });

  test("has WebManglerPluginMock", function() {
    expect(mocks).to.haveOwnProperty("WebManglerPluginMock");
  });

  test("has WebManglerLanguagePluginMock", function() {
    expect(mocks).to.haveOwnProperty("WebManglerLanguagePluginMock");
  });
});
