import { expect } from "chai";

import CssVariableMangler from "../../index";

suite("CssVariableMangler exports", function() {
  test("default export", function() {
    expect(CssVariableMangler).not.to.be.undefined;
  });
});
