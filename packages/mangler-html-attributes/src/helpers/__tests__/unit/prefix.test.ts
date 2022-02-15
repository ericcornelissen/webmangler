import { expect } from "chai";

import {
  getPrefix,
} from "../../prefix";

suite("HTML Attribute Mangler prefix helpers", function() {
  suite("::getPrefix", function() {
    const DEFAULT_PREFIX = "data-";

    test("default prefix", function() {
      const result = getPrefix({ });
      expect(result).to.equal(DEFAULT_PREFIX);
    });

    test("custom prefix", function() {
      const keepAttrPrefix = "foobar";

      const result = getPrefix({ keepAttrPrefix });
      expect(result).to.equal(keepAttrPrefix);
    });
  });
});
