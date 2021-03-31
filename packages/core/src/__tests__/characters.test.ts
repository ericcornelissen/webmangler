import { expect } from "chai";

import * as characters from "../characters";

suite("Exports of webmangler/characters", function() {
  test("has ALL_CHARS", function() {
    expect(characters).to.haveOwnProperty("ALL_CHARS");
  });

  test("has ALL_LETTER_CHARS", function() {
    expect(characters).to.haveOwnProperty("ALL_LETTER_CHARS");
  });

  test("has ALL_LOWERCASE_CHARS", function() {
    expect(characters).to.haveOwnProperty("ALL_LOWERCASE_CHARS");
  });

  test("has ALL_NUMBER_CHARS", function() {
    expect(characters).to.haveOwnProperty("ALL_NUMBER_CHARS");
  });

  test("has ALL_UPPERCASE_CHARS", function() {
    expect(characters).to.haveOwnProperty("ALL_UPPERCASE_CHARS");
  });
});
