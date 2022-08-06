import { expect } from "chai";

import {
  embeddedCssFinders,
} from "../../index";

suite("CSS Embeds", function() {
  test("list of embedded CSS finders", function() {
    expect(embeddedCssFinders).to.have.at.length.greaterThan(0);
  });
});
