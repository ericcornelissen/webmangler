import { expect } from "chai";

import embeddedCssFinders from "../../index";

suite("HTML CSS Embeds", function() {
  test("exported values", function() {
    expect(embeddedCssFinders).to.have.at.length.greaterThan(0);
  });
});
