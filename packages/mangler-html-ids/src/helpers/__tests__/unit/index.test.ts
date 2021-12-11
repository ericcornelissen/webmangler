import { expect } from "chai";

import * as helpers from "../../index";

suite("Helpers index", function() {
  test("exports getCharacterSet", function() {
    expect(helpers).to.haveOwnProperty("getCharacterSet");
    expect(typeof helpers.getCharacterSet).to.equal("function");
  });

  test("exports getIgnorePatterns", function() {
    expect(helpers).to.haveOwnProperty("getIgnorePatterns");
    expect(typeof helpers.getIgnorePatterns).to.equal("function");
  });

  test("exports getLanguageOptions", function() {
    expect(helpers).to.haveOwnProperty("getLanguageOptions");
    expect(typeof helpers.getLanguageOptions).to.equal("function");
  });

  test("exports getPatterns", function() {
    expect(helpers).to.haveOwnProperty("getPatterns");
    expect(typeof helpers.getPatterns).to.equal("function");
  });

  test("exports getPrefix", function() {
    expect(helpers).to.haveOwnProperty("getPrefix");
    expect(typeof helpers.getPrefix).to.equal("function");
  });

  test("exports getReserved", function() {
    expect(helpers).to.haveOwnProperty("getReserved");
    expect(typeof helpers.getReserved).to.equal("function");
  });
});
