import { expect } from "chai";

import HtmlAttributeMangler from "../../index";

suite("HtmlAttributeMangler exports", function() {
  test("default export", function() {
    expect(HtmlAttributeMangler).not.to.be.undefined;
  });
});
