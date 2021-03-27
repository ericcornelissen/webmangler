import { expect } from "chai";

import * as webmangler from "../index";

suite("Webmangler core", function() {
  suite("Exports", function() {
    test("has a default exported value", function() {
      expect(webmangler).to.haveOwnProperty("default");
    });
  });
});
