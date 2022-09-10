import { expect } from "chai";

import expressionsFactory from "../../query-selectors";

suite("Query Selector Expression Factory", function() {
  test("no prefix, no suffix", function() {
    const _result = expressionsFactory({
      kind: "class",
    });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });

  test("with prefix, on suffix", function() {
    const _base = expressionsFactory({
      kind: "class",
    });
    const base = Array.from(_base);

    const _result = expressionsFactory({
      kind: "class",
      prefix: "foobar",
    });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
    expect(result.length).to.be.greaterThan(base.length);
  });

  test("no prefix, with suffix", function() {
    const _base = expressionsFactory({
      kind: "class",
    });
    const base = Array.from(_base);

    const _result = expressionsFactory({
      kind: "class",
      suffix: "foobar",
    });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
    expect(result.length).to.be.greaterThan(base.length);
  });

  test("with prefix, with suffix", function() {
    const _base = expressionsFactory({
      kind: "class",
    });
    const base = Array.from(_base);

    const _result = expressionsFactory({
      kind: "class",
      prefix: "foo",
      suffix: "bar",
    });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
    expect(result.length).to.be.greaterThan(base.length);
  });
});
