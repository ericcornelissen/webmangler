import { expect } from "chai";

import expressionsFactory from "../../css-properties";

suite("CSS Property Expression Factory", function() {
  test("no prefix, no suffix", function() {
    const _result = expressionsFactory({ });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });

  test("with prefix, on suffix", function() {
    const _result = expressionsFactory({ prefix: "foobar" });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });

  test("no prefix, with suffix", function() {
    const _result = expressionsFactory({ suffix: "foobar" });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });

  test("with prefix, with suffix", function() {
    const _result = expressionsFactory({ prefix: "foo", suffix: "bar" });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });
});
