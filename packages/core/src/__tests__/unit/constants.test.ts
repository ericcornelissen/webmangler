import { expect } from "chai";

import {
  base58CharSet,
} from "../../constants";

suite("Constants", function() {
  suite("::base58CharSet", function() {
    const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

    test("every character is in the base58 alphabet", function() {
      for (const char of base58CharSet) {
        expect(alphabet).to.include(char);
      }
    });

    test("every base58 alphabet character is in the charset", function() {
      for (const char of alphabet) {
        expect(base58CharSet).to.include(char);
      }
    });
  });
});
