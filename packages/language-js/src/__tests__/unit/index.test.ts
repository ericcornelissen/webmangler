import { expect } from "chai";

import JavaScriptLanguagePlugin from "../../index";

suite("The @webmangler/language-js plugin", function() {
  test("is exported", function() {
    expect(JavaScriptLanguagePlugin).not.to.be.undefined;
  });
});
