import { expect } from "chai";

import {
  getCharacterSet,
} from "../../characters";

suite("CSS Variable Mangler characters helpers", function() {
  suite("::getCharacterSet", function() {
    const allowedCharactersExpr = /([a-zA-Z0-9]|-|_){1}/;

    test("default prefix", function() {
      const characters = getCharacterSet();
      for (const character of characters) {
        expect(allowedCharactersExpr.test(character)).to.be.true;
      }
    });
  });
});
