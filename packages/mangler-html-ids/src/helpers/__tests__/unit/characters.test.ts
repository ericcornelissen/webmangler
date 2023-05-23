import { expect } from "chai";

import {
  getCharacterSet,
} from "../../characters";

suite("HTML ID Mangler characters helpers", function() {
  suite("::getCharacterSet", function() {
    const allowedCharactersExpr = /[\w-]/;

    test("valid characters", function() {
      const characters = getCharacterSet();
      for (const character of characters) {
        const result = allowedCharactersExpr.test(character);
        expect(result).to.be.true;
      }
    });

    test("number of characters", function() {
      const characterCount = 52;
      const numberCount = 10;
      const symbolCount = 2;

      const result = getCharacterSet();
      const resultAsSet = new Set(result);
      expect(resultAsSet.size).to.equal(
        characterCount + numberCount + symbolCount,
      );
    });
  });
});
