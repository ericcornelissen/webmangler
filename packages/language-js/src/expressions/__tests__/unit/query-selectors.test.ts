import type {
  MangleExpression,
  QuerySelectorOptions,
} from "@webmangler/types";

import { expect } from "chai";

import expressionsFactory from "../../query-selectors";

suite("Query Selector Expression Factory", function() {
  let newExpressions: Iterable<ReadonlyArray<MangleExpression>>;

  suiteSetup(function() {
    newExpressions = [
      Array.from(expressionsFactory({ kind: "attribute" })),
      Array.from(expressionsFactory({ kind: "class" })),
      Array.from(expressionsFactory({ kind: "element" })),
      Array.from(expressionsFactory({ kind: "id" })),
    ];
  });

  test("no prefix, no suffix", function() {
    const _result = expressionsFactory({ } as QuerySelectorOptions);
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
    for (const unexpected of newExpressions) {
      expect(result).not.to.equal(unexpected);
    }
  });

  test("with prefix, on suffix", function() {
    const _base =expressionsFactory({ } as QuerySelectorOptions);
    const base = Array.from(_base);

    const _result = expressionsFactory({
      prefix: "foobar",
    } as QuerySelectorOptions);
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
    expect(result.length).to.be.greaterThan(base.length);
    for (const unexpected of newExpressions) {
      expect(result).not.to.equal(unexpected);
    }
  });

  test("no prefix, with suffix", function() {
    const _base =expressionsFactory({ } as QuerySelectorOptions);
    const base = Array.from(_base);

    const _result = expressionsFactory({
      suffix: "foobar",
    } as QuerySelectorOptions);
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
    expect(result.length).to.be.greaterThan(base.length);
    for (const unexpected of newExpressions) {
      expect(result).not.to.equal(unexpected);
    }
  });

  test("with prefix, with suffix", function() {
    const _base =expressionsFactory({ } as QuerySelectorOptions);
    const base = Array.from(_base);

    const _result = expressionsFactory({
      prefix: "foo",
      suffix: "bar",
    } as QuerySelectorOptions);
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
    expect(result.length).to.be.greaterThan(base.length);
    for (const unexpected of newExpressions) {
      expect(result).not.to.equal(unexpected);
    }
  });
});
