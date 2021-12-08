import { expect } from "chai";

import {
  getPrefix,
} from "../../prefix";

suite("HTML ID Mangler prefix helpers", function() {
  suite("::getPrefix", function() {
    const DEFAULT_PREFIX = "";

    test("default prefix", function() {
      const result = getPrefix({ });
      expect(result).to.equal(DEFAULT_PREFIX);
    });

    test("custom prefix", function() {
      const keepIdPrefix = "foobar";

      const result = getPrefix({ keepIdPrefix });
      expect(result).to.equal(keepIdPrefix);
    });
  });
});
