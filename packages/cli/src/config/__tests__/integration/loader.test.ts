import { expect } from "chai";

import getConfiguration from "../../index";

suite("Configuration loader", function() {
  suite("With a configuration path", function() {
    test("the provided configuration does not exist", function() {
      const configPath = "this-file-definitely-does-not-exist";

      expect(() => getConfiguration(configPath)).to.throw();
    });
  });

  suite("Without a configuration path", function() {
    test("some configuration is (always) loaded", function() {
      const result = getConfiguration(undefined);
      expect(result).not.to.be.null;
    });
  });
});
