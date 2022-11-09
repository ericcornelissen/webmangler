import type {
  CharSet,
  MangleExpressionOptions,
  MangleOptions,
} from "@webmangler/types";

import type { SimpleManglerOptions } from "../../simple-mangler.class";

import { expect } from "chai";

import initSimpleManglerPlugin from "../../simple-mangler.class";

suite("SimpleManglerPlugin", function() {
  const SimpleManglerPlugin = initSimpleManglerPlugin({ });

  class ConcreteSimpleManglerPlugin extends SimpleManglerPlugin { }

  const defaultOptions: SimpleManglerOptions = {
    charSet: ["f", "o", "o", "b", "a", "r"],
    ignorePatterns: [],
    languageOptions: [],
    patterns: "[foo][bar]",
    reserved: ["foo", "bar"],
    prefix: "foo_",
  };

  test("character set", function() {
    const testCases: Iterable<CharSet> = [
      ["a", "b"],
      ["1", "2", "3", "a", "b", "c"],
      ["x"],
    ];

    for (const charSet of testCases) {
      const options = Object.assign({ }, defaultOptions, { charSet });

      const plugin = new ConcreteSimpleManglerPlugin(options);
      const result = plugin.options() as MangleOptions;
      expect(result.charSet).to.equal(charSet);
    }
  });

  test("ignorePatterns", function() {
    const testCases: Iterable<(string | Iterable<string>)> = [
      "fo+bar",
      ["fo+", "bar"],
    ];

    for (const ignorePatterns of testCases) {
      const options = Object.assign({ }, defaultOptions, { ignorePatterns });

      const plugin = new ConcreteSimpleManglerPlugin(options);
      const result = plugin.options() as MangleOptions;
      expect(result.ignorePatterns).to.equal(ignorePatterns);
    }
  });

  test("expression options", function() {
    const testCases: Iterable<MangleExpressionOptions<unknown>[]> = [
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
      const options = Object.assign({ }, defaultOptions, { charSet });

      const plugin = new ConcreteSimpleManglerPlugin(options);
      const result = plugin.options() as MangleOptions;
      expect(result.charSet).to.equal(charSet);
    }
  });

  test("patterns", function() {
    const testCases: Iterable<(string | Iterable<string>)> = [
      "fo+bar",
      ["fo+", "bar"],
    ];

    for (const patterns of testCases) {
      const options = Object.assign({ }, defaultOptions, { patterns });

      const plugin = new ConcreteSimpleManglerPlugin(options);
      const result = plugin.options() as MangleOptions;
      expect(result.patterns).to.equal(patterns);
    }
  });

  test("prefix", function() {
    const testCases: Iterable<string> = [
      "",
      "foo",
      "bar",
    ];

    for (const prefix of testCases) {
      const options = Object.assign({ }, defaultOptions, { prefix });

      const plugin = new ConcreteSimpleManglerPlugin(options);
      const result = plugin.options() as MangleOptions;
      expect(result.manglePrefix).to.equal(prefix);
    }
  });

  test("reserved", function() {
    const testCases: Iterable<Iterable<string>> = [
      [],
      ["foo", "bar"],
      ["praise", "the", "sun"],
    ];

    for (const reserved of testCases) {
      const options = Object.assign({ }, defaultOptions, { reserved });

      const plugin = new ConcreteSimpleManglerPlugin(options);
      const result = plugin.options() as MangleOptions;
      expect(result.reservedNames).to.equal(reserved);
    }
  });
});
