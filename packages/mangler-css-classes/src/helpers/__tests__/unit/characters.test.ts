import { expect } from "chai";

import {
  getCharacterSet,
} from "../../characters";

suite("CSS Class Mangler characters helpers", function() {
  suite("::getCharacterSet", function() {
    const allowedCharactersExpr = /([a-zA-Z0-9]|-|_){1}/;

    test("valid characters", function() {
      const characters = getCharacterSet();
      for (const character of characters) {
        const result = allowedCharactersExpr.test(character);
        expect(result).to.be.true;
      }
    });

    test("number of characters", function() {
      const letterCount = 52;
      const numberCount = 10;
      const symbolCount = 2;

      const result = getCharacterSet();
      const resultAsSet = new Set(result);
      expect(resultAsSet.size).to.equal(
        letterCount + numberCount + symbolCount,
      );
    });
  });
});
