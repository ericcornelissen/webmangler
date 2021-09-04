import { expect } from "chai";

import JavaScriptLanguagePlugin from "../index";

suite("The @webmangler/language-js plugin", function() {
  test("default export", function() {
    expect(JavaScriptLanguagePlugin).not.to.be.undefined;
  });
});
