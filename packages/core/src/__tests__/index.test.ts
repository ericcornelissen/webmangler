import { expect } from "chai";

import * as webmangler from "../index";

suite("Webmangler core", function() {
  suite("Exports", function() {
    test("has BuiltInLanguagesSupport", function() {
      expect(webmangler).to.haveOwnProperty("default");
    });
  });
});
