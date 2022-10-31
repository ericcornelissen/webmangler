import { expect } from "chai";

import * as utils from "../../index";

suite("Exports of @webmangler/manglers-utils", function() {
  suite("Character sets", function() {
    test("has all alphanumeric characters", function() {
      expect(utils).to.haveOwnProperty("ALL_ALPHANUMERIC_CHARS");
    });

    test("has all letters", function() {
      expect(utils).to.haveOwnProperty("ALL_LETTER_CHARS");
    });

    test("has all lowercase letters", function() {
      expect(utils).to.haveOwnProperty("ALL_LOWERCASE_CHARS");
    });

    test("has all numeric characters", function() {
      expect(utils).to.haveOwnProperty("ALL_NUMBER_CHARS");
    });

    test("has all uppercase letters", function() {
      expect(utils).to.haveOwnProperty("ALL_UPPERCASE_CHARS");
    });
  });

  suite("WebManglerPlugins", function() {
    test("has MultiManglerPlugin", function() {
      expect(utils).to.haveOwnProperty("MultiManglerPlugin");
    });

    test("has SimpleManglerPlugin", function() {
      expect(utils).to.haveOwnProperty("SimpleManglerPlugin");
    });
  });
});
