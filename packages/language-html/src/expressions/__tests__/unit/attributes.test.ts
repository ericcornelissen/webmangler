import { expect } from "chai";

import expressionsFactory from "../../attributes";

suite("HTML - Attribute Expression Factory", function() {
  test("no options", function() {
    const _result = expressionsFactory({ });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });
});
