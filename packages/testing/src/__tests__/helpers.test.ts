import { expect } from "chai";

import * as helpers from "../helpers";

suite("Standard test helpers", function() {
  test("has generateValueObjects", function() {
    expect(helpers).to.haveOwnProperty("generateValueObjects");
  });

  test("has generateValueObjectsAll", function() {
    expect(helpers).to.haveOwnProperty("generateValueObjectsAll");
  });
});
