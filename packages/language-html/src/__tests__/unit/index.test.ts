import { expect } from "chai";

import HtmlLanguagePlugin from "../../index";

suite("The @webmangler/language-html plugin", function() {
  test("is exported", function() {
    expect(HtmlLanguagePlugin).not.to.be.undefined;
  });
});
