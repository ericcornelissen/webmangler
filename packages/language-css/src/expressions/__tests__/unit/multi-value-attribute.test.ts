import { expect } from "chai";

import expressionsFactory from "../../multi-value-attributes";

suite("CSS Multi-value Attribute Expression Factory", function() {
  const attributeNames = ["foo", "bar"];

  test("only attributeNames", function() {
    const _result = expressionsFactory({ attributeNames });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });
});
