import { expect } from "chai";

import {
  embeddedCssFinders,
  embeddedJsFinders,
} from "../../index";

suite("HTML Embeds", function() {
  test("list of embedded CSS finders", function() {
    expect(embeddedCssFinders).to.have.at.length.greaterThan(0);
  });

  test("list of embedded JavaScript finders", function() {
    expect(embeddedJsFinders).to.have.at.length.greaterThan(0);
  });
});
