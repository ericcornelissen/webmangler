import { expect } from "chai";

import {
  ALL_LOWERCASE_CHARS,
  ALL_UPPERCASE_CHARS,
} from "./characters";

suite("Characters", function() {
  suite("::ALL_LOWERCASE_CHARS", function() {
    const allowedCharactersExpr = /[a-z]/;

    test("valid characters", function() {
      for (const character of ALL_LOWERCASE_CHARS) {
        const result = allowedCharactersExpr.test(character);
        expect(result).to.be.true;
      }
    });

    test("number of characters", function() {
      const alphabetSize = 26;

      const result = new Set(ALL_LOWERCASE_CHARS);
      expect(result.size).to.equal(alphabetSize);
    });
  });

  suite("::ALL_UPPERCASE_CHARS", function() {
    const allowedCharactersExpr = /[A-Z]/;

    test("valid characters", function() {
      for (const character of ALL_UPPERCASE_CHARS) {
        const result = allowedCharactersExpr.test(character);
        expect(result).to.be.true;
      }
    });

    test("number of characters", function() {
      const alphabetSize = 26;

      const result = new Set(ALL_UPPERCASE_CHARS);
      expect(result.size).to.equal(alphabetSize);
    });
  });
});
