import { expect } from "chai";

import {
  DEFAULT_CONFIG_PATHS,
  MODULE_NAME,
} from "../../constants";

suite("Configuration constants", function() {
  test("the module name", function() {
    expect(MODULE_NAME).to.equal("webmangler");
  });

  suite("Default config paths", function() {
    test("has .webmanglerrc.js", function() {
      expect(DEFAULT_CONFIG_PATHS).to.contain(".webmanglerrc.js");
    });

    test("has webmangler.config.js", function() {
      expect(DEFAULT_CONFIG_PATHS).to.contain("webmangler.config.js");
    });

    test("has no other paths", function() {
      expect(DEFAULT_CONFIG_PATHS).to.have.lengthOf(2);
    });
  });
});
