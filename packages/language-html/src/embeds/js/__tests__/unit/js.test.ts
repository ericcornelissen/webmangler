import { expect } from "chai";

import embeddedJsFinders from "../../index";

suite("HTML JavaScript Embeds", function() {
  test("exported values", function() {
    expect(embeddedJsFinders).to.have.at.length.greaterThan(0);
  });
});
