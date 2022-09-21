import type {
  MangleExpression,
  QuerySelectorOptions,
} from "@webmangler/types";

import { expect } from "chai";

import expressionsFactory from "../../query-selectors";

suite("CSS Values Expression Factory", function() {
  test("kind is 'element'", function() {
    const _result = expressionsFactory({
      kind: "element",
    });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });

  test("kind is 'attribute'", function() {
    const _result = expressionsFactory({
      kind: "attribute",
    });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });

  test("kind is 'class'", function() {
    const _result = expressionsFactory({
      kind: "class",
    });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });

  test("kind is 'id'", function() {
    const _result = expressionsFactory({
      kind: "id",
    });
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });
});

// We allow an extra top-level suite temporarily to keep the tests for the old
// functionality around until it's removed.
// eslint-disable-next-line mocha/max-top-level-suites
suite("CSS Values Expression Factory (old)", function() {
  let newExpressions: Iterable<ReadonlyArray<MangleExpression>>;

  suiteSetup(function() {
    newExpressions = [
      Array.from(expressionsFactory({ kind: "element" })),
      Array.from(expressionsFactory({ kind: "attribute" })),
      Array.from(expressionsFactory({ kind: "class" })),
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
    const _result = expressionsFactory({
      prefix: "foobar",
    } as QuerySelectorOptions);
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
    for (const unexpected of newExpressions) {
      expect(result).not.to.equal(unexpected);
    }
  });

  test("no prefix, with suffix", function() {
    const _result = expressionsFactory({
      suffix: "foobar",
    } as QuerySelectorOptions);
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
    for (const unexpected of newExpressions) {
      expect(result).not.to.equal(unexpected);
    }
  });

  test("with prefix, with suffix", function() {
    const _result = expressionsFactory({
      prefix: "foo",
      suffix: "bar",
    } as QuerySelectorOptions);
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
    for (const unexpected of newExpressions) {
      expect(result).not.to.equal(unexpected);
    }
  });
});
