import { expect } from "chai";

import {
  ALL_ALPHANUMERIC_CHARS,
  ALL_CHARS,
  ALL_LETTER_CHARS,
  ALL_LOWERCASE_CHARS,
  ALL_NUMBER_CHARS,
  ALL_UPPERCASE_CHARS,
} from "../../characters";

suite("Character sets", function() {
  const alphabetSize = 26;
  const numbersSize = 10;

  suite("ALL_ALPHANUMERIC_CHARS", function() {
    test("only contains letters and numbers", function() {
      const expr = /^[A-Za-z0-9]$/;
      for (const character of ALL_ALPHANUMERIC_CHARS) {
        const result = expr.test(character);
        expect(result, `${character} is not alphanumeric`).to.be.true;
      }
    });

    test("contains all letters and numbers", function() {
      const charactersAsSet = new Set(ALL_ALPHANUMERIC_CHARS);
      const numberOfCharacters = charactersAsSet.size;
      expect(numberOfCharacters).to.equal(
        (2 * alphabetSize) + numbersSize,
      );
    });
  });

  suite("ALL_CHARS", function() {
    test("only contains allowed characters", function() {
      const expr = /^[A-Za-z0-9_-]$/;
      for (const character of ALL_CHARS) {
        const result = expr.test(character);
        expect(result, `${character} is not a valid character`).to.be.true;
      }
    });

    test("contains each character", function() {
      const charactersAsSet = new Set(ALL_CHARS);
      const numberOfCharacters = charactersAsSet.size;
      expect(numberOfCharacters).to.equal(
        (2 * alphabetSize) + numbersSize + 2,
      );
    });
  });

  suite("ALL_LETTER_CHARS", function() {
    test("only contains letters", function() {
      const expr = /^[A-Za-z]$/;
      for (const character of ALL_LETTER_CHARS) {
        const result = expr.test(character);
        expect(result, `${character} is not a letter`).to.be.true;
      }
    });

    test("contains all letters", function() {
      const charactersAsSet = new Set(ALL_LETTER_CHARS);
      const numberOfCharacters = charactersAsSet.size;
      expect(numberOfCharacters).to.equal(2 * alphabetSize);
    });
  });

  suite("ALL_LOWERCASE_CHARS", function() {
    test("only contains lowercase letters", function() {
      const expr = /^[a-z]$/;
      for (const character of ALL_LOWERCASE_CHARS) {
        const result = expr.test(character);
        expect(result, `${character} is not a lowercase character`).to.be.true;
      }
    });

    test("contains all lowercase letters", function() {
      const charactersAsSet = new Set(ALL_LOWERCASE_CHARS);
      const numberOfCharacters = charactersAsSet.size;
      expect(numberOfCharacters).to.equal(alphabetSize);
    });
  });

  suite("ALL_NUMBER_CHARS", function() {
    test("only contains numeric characters", function() {
      const expr = /^[0-9]$/;
      for (const character of ALL_NUMBER_CHARS) {
        const result = expr.test(character);
        expect(result, `${character} is not a number`).to.be.true;
      }
    });

    test("contains all numeric characters", function() {
      const charactersAsSet = new Set(ALL_NUMBER_CHARS);
      const numberOfCharacters = charactersAsSet.size;
      expect(numberOfCharacters).to.equal(numbersSize);
    });
  });

  suite("ALL_UPPERCASE_CHARS", function() {
    test("only contains uppercase letters", function() {
      const expr = /^[A-Z]$/;
      for (const character of ALL_UPPERCASE_CHARS) {
        const result = expr.test(character);
        expect(result, `${character} is not an uppercase character`).to.be.true;
      }
    });

    test("contains all uppercase letters", function() {
      const charactersAsSet = new Set(ALL_UPPERCASE_CHARS);
      const numberOfCharacters = charactersAsSet.size;
      expect(numberOfCharacters).to.equal(alphabetSize);
    });
  });
});
