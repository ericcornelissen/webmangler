import { expect } from "chai";

import { DEFAULT_CONFIG } from "../default";

suite("Default configuration", function() {
  test("default plugins", function() {
    expect(DEFAULT_CONFIG.plugins).to.have.length.above(0);
  });

  test("default languages", function() {
    expect(DEFAULT_CONFIG.languages).to.have.length.above(0);
  });
});
