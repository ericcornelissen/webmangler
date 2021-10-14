import { expect } from "chai";

import CssClassMangler from "../../index";

suite("CssClassMangler exports", function() {
  test("default export", function() {
    expect(CssClassMangler).not.to.be.undefined;
  });
});
