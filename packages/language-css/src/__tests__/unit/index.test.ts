import { expect } from "chai";

import CssLanguagePlugin from "../../index";

suite("The @webmangler/language-css plugin", function() {
  test("no argument", function() {
    expect(CssLanguagePlugin).not.to.be.undefined;
  });
});
