import type { CssDeclarationValueOptions } from "@webmangler/types";
import { expect } from "chai";

import expressionsFactory from "../../css-values";

suite("CSS Values Expression Factory", function() {
  test("kind is 'function'", function() {
    const result = Array.from(
      expressionsFactory({
        kind: "function",
      }),
    );
    expect(result.length).to.be.greaterThan(0);
  });

  test("kind is 'variable'", function() {
    const result = Array.from(
      expressionsFactory({
        kind: "variable",
      }),
    );
    expect(result.length).to.be.greaterThan(0);
  });

  test("kind is 'value'", function() {
    const result = Array.from(
      expressionsFactory({
        kind: "value",
      }),
    );
    expect(result.length).to.be.greaterThan(0);
  });
});

// We allow an extra top-level suite temporarily to keep the tests for the old
// functionality around until it's removed.
// eslint-disable-next-line mocha/max-top-level-suites
suite("CSS Values Expression Factory (old)", function() {
  test("no prefix, no suffix", function() {
    const _result = expressionsFactory({ } as CssDeclarationValueOptions);
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });

  test("with prefix, on suffix", function() {
    const _result = expressionsFactory({
      prefix: "foobar",
    } as CssDeclarationValueOptions);
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });

  test("no prefix, with suffix", function() {
    const _result = expressionsFactory({
      suffix: "foobar",
    } as CssDeclarationValueOptions);
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });

  test("with prefix, with suffix", function() {
    const _result = expressionsFactory({
      prefix: "foo",
      suffix: "bar",
    } as CssDeclarationValueOptions);
    const result = Array.from(_result);
    expect(result.length).to.be.greaterThan(0);
  });
});
