import { expect } from "chai";

import HtmlIdMangler from "../../index";

suite("HtmlIdMangler exports", function() {
  test("default export", function() {
    expect(HtmlIdMangler).not.to.be.undefined;
  });
});
