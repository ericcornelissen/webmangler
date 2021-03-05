import type { CharSet } from "../../../characters";
import type { MangleExpressionOptions } from "../../../types";
import type { SimpleManglerOptions } from "../simple-mangler.class";

import { expect } from "chai";

import SimpleManglerPlugin from "../simple-mangler.class";

class ConcreteSimpleManglerPlugin extends SimpleManglerPlugin {
  constructor(options: SimpleManglerOptions) {
    super(options);
  }
}

class ConcreteOldSimpleManglerPlugin extends SimpleManglerPlugin {
  constructor(options: SimpleManglerOptions) {
    super("id", options);
  }
}

suite("SimpleManglerPlugin", function() {
  const defaultOptions: SimpleManglerOptions = {
    charSet: ["f", "o", "o", "b", "a", "r"],
    expressionOptions: [],
    patterns: "[foo][bar]",
    reserved: ["foo", "bar"],
    prefix: "foo_",
  };

  test("character set", function() {
    const testCases: CharSet[] = [
      ["a", "b"],
      ["1", "2", "3", "a", "b", "c"],
      ["x"],
    ];

    for (const charSet of testCases) {
      const options = Object.assign({}, defaultOptions, { charSet });

      const plugin = new ConcreteSimpleManglerPlugin(options);
      const result = plugin.options();
      expect(result.charSet).to.equal(charSet);
    }
  });

  test("expression options", function() {
    const testCases: MangleExpressionOptions<unknown>[][] = [
      [
        {
          name: "foo",
          options: { foo: "bar" },
        },
      ],
      [
        {
          name: "foo",
          options: { foo: "bar" },
        },
        {
          name: "bar",
          options: { bar: "foo" },
        },
      ],
    ];

    for (const charSet of testCases) {
      const options = Object.assign({}, defaultOptions, { charSet });

      const plugin = new ConcreteSimpleManglerPlugin(options);
      const result = plugin.options();
      expect(result.charSet).to.equal(charSet);
    }
  });

  test("patterns", function() {
    const testCases: (string | string[])[] = [
      "fo+bar",
      ["fo+", "bar"],
    ];

    for (const patterns of testCases) {
      const options = Object.assign({}, defaultOptions, { patterns });

      const plugin = new ConcreteSimpleManglerPlugin(options);
      const result = plugin.options();
      expect(result.patterns).to.equal(patterns);
    }
  });

  test("prefix", function() {
    const testCases: string[] = [
      "",
      "foo",
      "bar",
    ];

    for (const prefix of testCases) {
      const options = Object.assign({}, defaultOptions, { prefix });

      const plugin = new ConcreteSimpleManglerPlugin(options);
      const result = plugin.options();
      expect(result.manglePrefix).to.equal(prefix);
    }
  });

  test("reserved", function() {
    const testCases: string[][] = [
      [],
      ["foo", "bar"],
      ["praise", "the", "sun"],
    ];

    for (const reserved of testCases) {
      const options = Object.assign({}, defaultOptions, { reserved });

      const plugin = new ConcreteSimpleManglerPlugin(options);
      const result = plugin.options();
      expect(result.reservedNames).to.equal(reserved);
    }
  });

  suite("Deprecated constructor", function() {
    test("character set", function() {
      const testCases: CharSet[] = [
        ["a", "b"],
        ["1", "2", "3", "a", "b", "c"],
        ["x"],
      ];

      for (const charSet of testCases) {
        const options = Object.assign({}, defaultOptions, { charSet });

        const plugin = new ConcreteOldSimpleManglerPlugin(options);
        const result = plugin.options();
        expect(result.charSet).to.equal(charSet);
      }
    });

    test("expression options", function() {
      const testCases: MangleExpressionOptions<unknown>[][] = [
        [
          {
            name: "foo",
            options: { foo: "bar" },
          },
        ],
        [
          {
            name: "foo",
            options: { foo: "bar" },
          },
          {
            name: "bar",
            options: { bar: "foo" },
          },
        ],
      ];

      for (const expressionOptions of testCases) {
        const options = Object.assign({}, defaultOptions, { expressionOptions });

        const plugin = new ConcreteOldSimpleManglerPlugin(options);
        const result = plugin.options();
        expect(result.expressionOptions).to.equal(expressionOptions);
      }
    });

    test("patterns", function() {
      const testCases: (string | string[])[] = [
        "fo+bar",
        ["fo+", "bar"],
      ];

      for (const patterns of testCases) {
        const options = Object.assign({}, defaultOptions, { patterns });

        const plugin = new ConcreteOldSimpleManglerPlugin(options);
        const result = plugin.options();
        expect(result.patterns).to.equal(patterns);
      }
    });

    test("prefix", function() {
      const testCases: string[] = [
        "",
        "foo",
        "bar",
      ];

      for (const prefix of testCases) {
        const options = Object.assign({}, defaultOptions, { prefix });

        const plugin = new ConcreteOldSimpleManglerPlugin(options);
        const result = plugin.options();
        expect(result.manglePrefix).to.equal(prefix);
      }
    });

    test("reserved", function() {
      const testCases: string[][] = [
        [],
        ["foo", "bar"],
        ["praise", "the", "sun"],
      ];

      for (const reserved of testCases) {
        const options = Object.assign({}, defaultOptions, { reserved });

        const plugin = new ConcreteOldSimpleManglerPlugin(options);
        const result = plugin.options();
        expect(result.reservedNames).to.equal(reserved);
      }
    });
  });
});
