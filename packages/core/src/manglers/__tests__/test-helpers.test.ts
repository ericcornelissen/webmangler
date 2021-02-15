import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "./types";
import type { QuoteLanguages } from "./test-helpers";

import { expect } from "chai";

import {
  getArrayOfFormattedStrings,
  isValidClassName,
  isValidIdName,
  permuteObjects,
  varyQuotes,
  varySpacing,
} from "./test-helpers";

suite("Manglers Test helpers", function() {
  suite("::getArrayOfFormattedStrings", function() {
    test("n is 0", function() {
      const result = getArrayOfFormattedStrings(0, "%s");
      expect(result).to.have.lengthOf(0);
    });

    test("n is not 0", function() {
      const max = 5;
      for (let n = 0; n < max; n++) {
        const result = getArrayOfFormattedStrings(n, "%s");
        expect(result).to.have.lengthOf(n);
      }
    });

    test("string formatting", function() {
      const result = getArrayOfFormattedStrings(5, "(%s)");
      for (const i in result) {
        expect(result[i]).to.equal(`(${i})`);
      }
    });
  });

  suite("::isValidClassName", function() {
    test("valid class names", function() {
      const names: string[] = [
        "foo",
        "bar",
        "foo-bar",
        "Hello_World",
        "_foobar",
        "a_0-",
      ];

      for (const name of names) {
        const valid = isValidClassName(name);
        expect(valid).to.be.true;
      }
    });

    test("invalid class names", function() {
      const names: string[] = [
        "",
        ".foo",
        "bar.",
        "foo=bar",
        "-foobar",
        "0foobar",
        "1foobar",
        "2foobar",
        "3foobar",
        "4foobar",
        "5foobar",
        "6foobar",
        "7foobar",
        "8foobar",
        "9foobar",
      ];

      for (const name of names) {
        const valid = isValidClassName(name);
        expect(valid).to.be.false;
      }
    });
  });

  suite("::isValidIdName", function() {
    test("valid id names", function() {
      const names: string[] = [
        "foo",
        "bar",
        "foo-bar",
        "Hello_World",
        "_foobar",
        "-foobar",
        "0foobar",
        "1foobar",
        "2foobar",
        "3foobar",
        "4foobar",
        "5foobar",
        "6foobar",
        "7foobar",
        "8foobar",
        "9foobar",
        "a_0-",
      ];

      for (const name of names) {
        const valid = isValidIdName(name);
        expect(valid).to.be.true;
      }
    });

    test("invalid id names", function() {
      const names: string[] = [
        "",
        ".foo",
        "bar.",
        "foo=bar",
      ];

      for (const name of names) {
        const valid = isValidIdName(name);
        expect(valid).to.be.false;
      }
    });
  });

  suite("::permuteObjects", function() {
    test("no objects in input", function() {
      const result = permuteObjects([]);
      expect(result).to.have.lengthOf(0);
    });

    test("one object in input", function() {
      const result = permuteObjects([{ foo: "bar" }]);
      expect(result).to.have.lengthOf(2);
      expect(result).to.deep.include({});
      expect(result).to.deep.include({ foo: "bar" });
    });

    test("two objects in input", function() {
      const result = permuteObjects([{ foo: "a" }, { bar: "b" }]);
      expect(result).to.have.lengthOf(4);
      expect(result).to.deep.include({});
      expect(result).to.deep.include({ foo: "a" });
      expect(result).to.deep.include({ bar: "b" });
      expect(result).to.deep.include({ foo: "a", bar: "b" });
    });
  });

  suite("::varyQuotes", function() {
    const languages: QuoteLanguages[] = [
      "css",
      "html",
      "js",
      "single-backticks",
      "double-backticks",
    ];

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "only single quotes in input",
        cases: [
          {
            input: "Hello 'world'!",
            expected: "Praise 'the sun'",
          },
          {
            input: "The 'cake' is 'a' lie",
            expected: "The 'pie' is 'a' lie",
          },
        ],
      },
      {
        name: "only double quotes in input",
        cases: [
          {
            input: "Hello \"world\"!",
            expected: "Praise \"the sun\"",
          },
          {
            input: "The \"cake\" is \"a\" lie",
            expected: "The \"pie\" is \"a\" lie",
          },
        ],
      },
      {
        name: "only backticks in input",
        cases: [
          {
            input: "Hello `world`!",
            expected: "Praise `the sun`",
          },
          {
            input: "The `cake` is `a` lie",
            expected: "The `pie` is `a` lie",
          },
        ],
      },
      {
        name: "mixed quotes in input",
        cases: [
          { // single quotes and double quotes
            input: "Praise 'the' \"sun\"",
            expected: "Praise 'a' \"moon\"",
          },
          { // single quotes and backticks
            input: "The 'cake' is `a` lie",
            expected: "The 'pie' is `a` lie",
          },
          { // double quotes and backticks
            input: "\"Why\" not `Zoidberg`",
            expected: "\"Why\" not `Zoidberg`",
          },
          { // single quotes, double quotes, and backticks
            input: "Double 'rainbow', \"what\" does `it` mean?",
            expected: "Double 'rainbow', \"what\" does `it` mean?",
          },
        ],
      },
      {
        name: "with description",
        cases: [
          {
            input: "Hello \"world\"!",
            expected: "Praise \"the sun\"",
            description: "",
          },
          {
            input: "Hello \"world\"!",
            expected: "Praise \"the sun\"",
            description: "foobar",
          },
        ],
      },
      {
        name: "with pattern",
        cases: [
          {
            input: "Hello \"world\"!",
            expected: "Praise \"the sun\"",
            pattern: "",
          },
          {
            input: "Hello \"world\"!",
            expected: "Praise \"the sun\"",
            pattern: "cls-.+",
          },
        ],
      },
      {
        name: "with prefix",
        cases: [
          {
            input: "Hello \"world\"!",
            expected: "Praise \"the sun\"",
            prefix: "",
          },
          {
            input: "Hello \"world\"!",
            expected: "Praise \"the sun\"",
            prefix: "cls-",
          },
        ],
      },
      {
        name: "with reserved",
        cases: [
          {
            input: "Hello \"world\"!",
            expected: "Praise \"the sun\"",
            reserved: [],
          },
          {
            input: "Hello \"world\"!",
            expected: "Praise \"the sun\"",
            reserved: ["a"],
          },
          {
            input: "Hello \"world\"!",
            expected: "Praise \"the sun\"",
            reserved: ["a", "b"],
          },
        ],
      },
    ];

    type LanguageVerifier = (original: TestCase, result: TestCase[]) => void;
    const verifiers: Map<QuoteLanguages, LanguageVerifier> = new Map([
      ["css", function(original: TestCase, result: TestCase[]): void {
        expect(result).to.have.length(2);
        expect(result).to.deep.include(Object.assign(original, {
          input: original.input.replace(/('|"|`)/g, "\""),
          expected: original.expected.replace(/('|"|`)/g, "\""),
        }));
        expect(result).to.deep.include(Object.assign(original, {
          input: original.input.replace(/('|"|`)/g, "'"),
          expected: original.expected.replace(/('|"|`)/g, "'"),
        }));
      }],
      ["html", function(original: TestCase, result: TestCase[]): void {
        expect(result).to.have.length(2);
        expect(result).to.deep.include(Object.assign(original, {
          input: original.input.replace(/('|"|`)/g, "\""),
          expected: original.expected.replace(/('|"|`)/g, "\""),
        }));
        expect(result).to.deep.include(Object.assign(original, {
          input: original.input.replace(/('|"|`)/g, "'"),
          expected: original.expected.replace(/('|"|`)/g, "'"),
        }));
      }],
      ["js", function(original: TestCase, result: TestCase[]): void {
        expect(result).to.have.length(3);
        expect(result).to.deep.include(Object.assign(original, {
          input: original.input.replace(/('|"|`)/g, "\""),
          expected: original.expected.replace(/('|"|`)/g, "\""),
        }));
        expect(result).to.deep.include(Object.assign(original, {
          input: original.input.replace(/('|"|`)/g, "'"),
          expected: original.expected.replace(/('|"|`)/g, "'"),
        }));
        expect(result).to.deep.include(Object.assign(original, {
          input: original.input.replace(/('|"|`)/g, "`"),
          expected: original.expected.replace(/('|"|`)/g, "`"),
        }));
      }],
      ["single-backticks", function(original: TestCase, result: TestCase[]): void {
        expect(result).to.have.length(2);
        expect(result).to.deep.include(Object.assign(original, {
          input: original.input.replace(/('|"|`)/g, "'"),
          expected: original.expected.replace(/('|"|`)/g, "'"),
        }));
        expect(result).to.deep.include(Object.assign(original, {
          input: original.input.replace(/('|"|`)/g, "`"),
          expected: original.expected.replace(/('|"|`)/g, "`"),
        }));
      }],
      ["double-backticks", function(original: TestCase, result: TestCase[]): void {
        expect(result).to.have.length(2);
        expect(result).to.deep.include(Object.assign(original, {
          input: original.input.replace(/('|"|`)/g, "\""),
          expected: original.expected.replace(/('|"|`)/g, "\""),
        }));
        expect(result).to.deep.include(Object.assign(original, {
          input: original.input.replace(/('|"|`)/g, "`"),
          expected: original.expected.replace(/('|"|`)/g, "`"),
        }));
        // TODO
      }],
    ]);

    for (const language of languages) {
      for (const { name, cases } of scenarios) {
        test(`${language} - ${name}`, function() {
          const resultVerifier = verifiers.get(language) as LanguageVerifier;
          expect(resultVerifier).not.to.be.undefined;

          for (const testCase of cases) {
            const result = varyQuotes(language, testCase);
            resultVerifier(testCase, result);

            for (const entry of result) {
              expect(entry.description).to.equal(testCase.description);
              expect(entry.pattern).to.equal(testCase.pattern);
              expect(entry.prefix).to.equal(testCase.prefix);
              expect(entry.reserved).to.equal(testCase.reserved);
            }
          }
        });
      }

      test(`${language} - no quotes in input`, function() {
        const testCase: TestCase = {
          input: "Hello world!",
          expected: "Hello world!",
        };

        const result = varyQuotes(language, testCase);
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal(testCase);
      });
    }
  });

  suite("::varySpacing", function() {
    const DEFAULT_TEST_CASE: TestCase = {
      input: "foo",
      expected: "bar",
    };

    test("empty list of characters", function() {
      expect(() => varySpacing([], DEFAULT_TEST_CASE)).to.throw();
    });

    test("string not in test case", function() {
      const result = varySpacing("not in the test case", DEFAULT_TEST_CASE);
      expect(result).to.have.length(1);
      expect(result[0]).to.equal(DEFAULT_TEST_CASE);
    });

    test("character in test case", function() {
      const str = ">";
      const testCase: TestCase = {
        input: `foo${str}bar`,
        expected: `a${str}b`,
      };

      const result = varySpacing(str, testCase);
      expect(result).to.have.length(4);
      expect(result).to.deep.include(testCase);
      expect(result).to.deep.include({
        input: `foo ${str}bar`,
        expected: `a ${str}b`,
      });
      expect(result).to.deep.include({
        input: `foo${str} bar`,
        expected: `a${str} b`,
      });
      expect(result).to.deep.include({
        input: `foo${str} bar`,
        expected: `a${str} b`,
      });
    });

    test("string in test case", function() {
      const str = "~=";
      const testCase: TestCase = {
        input: `foo${str}bar`,
        expected: `a${str}b`,
      };

      const result = varySpacing(str, testCase);
      expect(result).to.have.length(4);
      expect(result).to.deep.include(testCase);
      expect(result).to.deep.include({
        input: `foo ${str}bar`,
        expected: `a ${str}b`,
      });
      expect(result).to.deep.include({
        input: `foo${str} bar`,
        expected: `a${str} b`,
      });
      expect(result).to.deep.include({
        input: `foo${str} bar`,
        expected: `a${str} b`,
      });
    });

    test("multiple strings, some in test case", function() {
      const strs = ["|=", "^="];
      const testCase: TestCase = {
        input: `[data-foo${strs[1]}"bar"]`,
        expected: `[data-a${strs[1]}"bar"]`,
      };

      const result = varySpacing(strs, testCase);
      expect(result).to.have.length(4);
      expect(result).to.deep.include(testCase);
      expect(result).to.deep.include({
        input: `[data-foo ${strs[1]}"bar"]`,
        expected: `[data-a ${strs[1]}"bar"]`,
      });
      expect(result).to.deep.include({
        input: `[data-foo${strs[1]} "bar"]`,
        expected: `[data-a${strs[1]} "bar"]`,
      });
      expect(result).to.deep.include({
        input: `[data-foo ${strs[1]} "bar"]`,
        expected: `[data-a ${strs[1]} "bar"]`,
      });
    });

    test("multiple strings, all in test case", function() {
      const strs = ["(", ")"];
      const testCase: TestCase = {
        input: `attr${strs[0]}data-foo${strs[1]};`,
        expected: `attr${strs[0]}a${strs[1]};`,
      };

      const result = varySpacing(strs, testCase);
      expect(result).to.have.length(16);
      expect(result).to.deep.include(testCase);

      // Spaces around first string only
      expect(result).to.deep.include({
        input: `attr${strs[0]} data-foo${strs[1]};`,
        expected: `attr${strs[0]} a${strs[1]};`,
      });
      expect(result).to.deep.include({
        input: `attr ${strs[0]}data-foo${strs[1]};`,
        expected: `attr ${strs[0]}a${strs[1]};`,
      });
      expect(result).to.deep.include({
        input: `attr ${strs[0]} data-foo${strs[1]};`,
        expected: `attr ${strs[0]} a${strs[1]};`,
      });

      // Spaces around second string only
      expect(result).to.deep.include({
        input: `attr${strs[0]}data-foo ${strs[1]};`,
        expected: `attr${strs[0]}a ${strs[1]};`,
      });
      expect(result).to.deep.include({
        input: `attr${strs[0]}data-foo${strs[1]} ;`,
        expected: `attr${strs[0]}a${strs[1]} ;`,
      });
      expect(result).to.deep.include({
        input: `attr${strs[0]}data-foo ${strs[1]} ;`,
        expected: `attr${strs[0]}a ${strs[1]} ;`,
      });

      // Space before first string - spaces around second string
      expect(result).to.deep.include({
        input: `attr ${strs[0]}data-foo ${strs[1]};`,
        expected: `attr ${strs[0]}a ${strs[1]};`,
      });
      expect(result).to.deep.include({
        input: `attr ${strs[0]}data-foo${strs[1]} ;`,
        expected: `attr ${strs[0]}a${strs[1]} ;`,
      });
      expect(result).to.deep.include({
        input: `attr ${strs[0]}data-foo ${strs[1]} ;`,
        expected: `attr ${strs[0]}a ${strs[1]} ;`,
      });

      // Space after first string - spaces around second string
      expect(result).to.deep.include({
        input: `attr${strs[0]} data-foo ${strs[1]};`,
        expected: `attr${strs[0]} a ${strs[1]};`,
      });
      expect(result).to.deep.include({
        input: `attr${strs[0]} data-foo${strs[1]} ;`,
        expected: `attr${strs[0]} a${strs[1]} ;`,
      });
      expect(result).to.deep.include({
        input: `attr${strs[0]} data-foo ${strs[1]} ;`,
        expected: `attr${strs[0]} a ${strs[1]} ;`,
      });

      // Space surrounding first string - spaces around second string
      expect(result).to.deep.include({
        input: `attr ${strs[0]} data-foo ${strs[1]};`,
        expected: `attr ${strs[0]} a ${strs[1]};`,
      });
      expect(result).to.deep.include({
        input: `attr ${strs[0]} data-foo${strs[1]} ;`,
        expected: `attr ${strs[0]} a${strs[1]} ;`,
      });
      expect(result).to.deep.include({
        input: `attr ${strs[0]} data-foo ${strs[1]} ;`,
        expected: `attr ${strs[0]} a ${strs[1]} ;`,
      });
    });

    test("value of description", function() {
      const description = "Hello world!";
      const str = ",";
      const testCase: TestCase = {
        input: `foo${str}bar`,
        expected: `a${str}b`,
        description: description,
      };

      const result = varySpacing(str, testCase);
      expect(result).to.have.length(4);
      for (const entry of result) {
        expect(entry).to.have.property("description", description);
      }
    });

    test("value of pattern", function() {
      const pattern = "Hello .+!";
      const str = "~";
      const testCase: TestCase = {
        input: `foo${str}bar`,
        expected: `a${str}b`,
        pattern: pattern,
      };

      const result = varySpacing(str, testCase);
      expect(result).to.have.length(4);
      for (const entry of result) {
        expect(entry).to.have.property("pattern", pattern);
      }
    });

    test("value of prefix", function() {
      const prefix = "id-";
      const str = "+";
      const testCase: TestCase = {
        input: `foo${str}bar`,
        expected: `a${str}b`,
        prefix: prefix,
      };

      const result = varySpacing(str, testCase);
      expect(result).to.have.length(4);
      for (const entry of result) {
        expect(entry).to.have.property("prefix", prefix);
      }
    });

    test("value of reserved", function() {
      const reserved = ["a", "b"];
      const str = ">";
      const testCase: TestCase = {
        input: `foo${str}bar`,
        expected: `a${str}b`,
        reserved: reserved,
      };

      const result = varySpacing(str, testCase);
      expect(result).to.have.length(4);
      for (const entry of result) {
        expect(entry).to.have.property("reserved", reserved);
      }
    });
  });
});
