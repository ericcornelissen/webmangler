import { expect } from "chai";

import expressionsFactory from "../../single-value-attributes";

suite("CSS Values Expression Factory", function() {
  const attributeNames = ["foo", "bar"];

  test("no value prefix, no value suffix", function() {
    const _result = expressionsFactory({ attributeNames });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });

  test("with value prefix, on value suffix", function() {
    const _result = expressionsFactory({
      attributeNames,
      valuePrefix: "foobar",
    });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });

  test("no value prefix, with value suffix", function() {
    const _result = expressionsFactory({
      attributeNames,
      valueSuffix: "foobar",
    });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });

  test("with value prefix, with value suffix", function() {
    const _result = expressionsFactory({
      attributeNames,
      valuePrefix: "foo",
      valueSuffix: "bar",
    });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });
});
