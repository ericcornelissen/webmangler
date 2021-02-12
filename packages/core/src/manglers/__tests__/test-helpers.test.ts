import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "./types";

import { expect } from "chai";

import {
  getArrayOfFormattedStrings,
  isValidClassName,
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
      ];

      for (const name of names) {
        const valid = isValidClassName(name);
        expect(valid).to.be.true;
      }
    });

    test("invalid class names", function() {
      const names: string[] = [
        ".foo",
        "bar.",
        "foo=bar",
      ];

      for (const name of names) {
        const valid = isValidClassName(name);
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
    const ofTestCase = (c: TestCase) => (o: TestCase) => o.input === c.input;
    const notNumber = (n: number) => (o: number) => o !== n;

    suite("CSS", function() {
      const type = "css";

      const scenarios: TestScenario<TestCase>[] = [
        {
          name: "single quotes input",
          cases: [
            {
              input: "div { content: 'foo'; }",
              expected: "div { content: 'bar'; }",
            },
            {
              input: ".cls-foo { content: 'foo'; }",
              expected: ".a { content: 'bar'; }",
            },
            {
              input: "div { color: attr(data-color, '#000'); }",
              expected: "div { color: attr(data-a, '#000'); }",
            },
            {
              input: "div { color: attr(data-color, '#000'); content: 'foo'; }",
              expected: "div { color: attr(data-a, '#000'); content: 'foo'; }",
            },
          ],
        },
        {
          name: "double quotes input",
          cases: [
            {
              input: "div { content: \"foo\"; }",
              expected: "div { content: \"bar\"; }",
            },
            {
              input: ".cls-foo { content: \"foo\"; }",
              expected: ".a { content: \"foo\"; }",
            },
            {
              input: "div { color: attr(data-color, \"#000\"); }",
              expected: "div { color: attr(data-a, \"#000\"); }",
            },
            {
              input: "div { color: attr(data-color, \"#000\"); content: \"foo\"; }",
              expected: "div { color: attr(data-a, \"#000\"); content: \"foo\"; }",
            },
          ],
        },
        {
          name: "with description",
          cases: [
            {
              input: ".cls-foo { content: \"bar\"; }",
              expected: ".a { content: \"bar\"; }",
              description: "",
            },
            {
              input: ".cls-foo { content: \"bar\"; }",
              expected: ".a { content: \"bar\"; }",
              description: "Hello world!",
            },
          ],
        },
        {
          name: "with pattern",
          cases: [
            {
              input: ".cls-foo { content: \"bar\"; }",
              expected: ".cls-foo { content: \"bar\"; }",
              pattern: "",
            },
            {
              input: ".cls-foo { content: \"bar\"; }",
              expected: ".a { content: \"bar\"; }",
              pattern: "cls-.+",
            },
          ],
        },
        {
          name: "with prefix",
          cases: [
            {
              input: ".foo { content: \"bar\"; }",
              expected: ".cls-a { content: \"bar\"; }",
              prefix: "cls-",
            },
            {
              input: ".foo { content: \"bar\"; }",
              expected: ".cls-a { content: \"bar\"; }",
              prefix: "cls-",
            },
            {
              input: ".foo { content: \"bar\"; }",
              expected: ".a { content: \"bar\"; }",
              prefix: "",
            },
          ],
        },
        {
          name: "with reserved",
          cases: [
            {
              input: ":root { --foo: \"bar\"; }",
              expected: ":root { --a: \"bar\"; }",
              reserved: [],
            },
            {
              input: ":root { --foo: \"bar\"; }",
              expected: ":root { --b: \"bar\"; }",
              reserved: ["a"],
            },
            {
              input: ":root { --foo: \"bar\"; }",
              expected: ":root { --c: \"bar\"; }",
              reserved: ["a", "b"],
            },
          ],
        },
      ];

      for (const { name, cases } of scenarios) {
        test(name, function() {
          for (const testCase of cases) {
            const result = varyQuotes(type, testCase);
            expect(result).to.have.length(2);
            expect(result).to.deep.include(testCase);

            const indexOfOriginal = result.findIndex(ofTestCase(testCase));
            expect(indexOfOriginal).not.to.equal(-1);

            const othersIndices = [0, 1].filter(notNumber(indexOfOriginal));
            for (const i of othersIndices) {
              expect(result[i]).not.to.deep.equal(testCase);
            }

            for (const entry of result) {
              expect(entry.description).to.equal(testCase.description);
              expect(entry.pattern).to.equal(testCase.pattern);
              expect(entry.prefix).to.equal(testCase.prefix);
              expect(entry.reserved).to.equal(testCase.reserved);
            }
          }
        });
      }

      test("no quotes in input", function() {
        const testCase: TestCase = {
          input: ".foo { }",
          expected: ".bar { }",
        };

        const result = varyQuotes(type, testCase);
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal(testCase);
      });
    });

    suite("HTML", function() {
      const type = "html";

      const scenarios: TestScenario<TestCase>[] = [
        {
          name: "single quotes input",
          cases: [
            {
              input: "<div id='foo'></div>",
              expected: "<div id='bar'></div>",
            },
            {
              input: "<div data-foo='foo'></div>",
              expected: "<div data-a='foo'></div>",
            },
            {
              input: "<p data-foo='bar' data-bar='foo'>Lorem ipsum</p>",
              expected: "<p data-a='bar' data-b='foo'>Lorem ipsum</p>",
            },
            {
              input: "<p data-foo='bar'>Lorem <b data-bar='foo'>ipsum</b></p>",
              expected: "<p data-a='bar'>Lorem <b data-b='foo'>ipsum</b></p>",
            },
          ],
        },
        {
          name: "double quotes input",
          cases: [
            {
              input: "<div id=\"foo\"></div>",
              expected: "<div id=\"bar\"></div>",
            },
            {
              input: "<div data-foo=\"foo\"></div>",
              expected: "<div data-a=\"foo\"></div>",
            },
            {
              input: "<p data-foo=\"bar\" data-bar=\"foo\">Lorem ipsum</p>",
              expected: "<p data-a=\"bar\" data-b=\"foo\">Lorem ipsum</p>",
            },
            {
              input: "<p data-foo=\"bar\">Lorem <b data-bar=\"foo\">ipsum</b></p>",
              expected: "<p data-a=\"bar\">Lorem <b data-b=\"foo\">ipsum</b></p>",
            },
          ],
        },
        {
          name: "with description",
          cases: [
            {
              input: "<div id=\"foobar\"></div>",
              expected: "<div id=\"a\"></div>",
              description: "",
            },
            {
              input: "<div data-foo=\"bar\"></div>",
              expected: "<div data-a=\"bar\"></div>",
              description: "Hello world!",
            },
          ],
        },
        {
          name: "with pattern",
          cases: [
            {
              input: "<div id=\"foobar\"></div>",
              expected: "<div id=\"foobar\"></div>",
              pattern: "",
            },
            {
              input: "<div data-foo=\"bar\"></div>",
              expected: "<div data-a=\"bar\"></div>",
              pattern: "data-.+",
            },
          ],
        },
        {
          name: "with prefix",
          cases: [
            {
              input: "<div id=\"foobar\"></div>",
              expected: "<div id=\"id-a\"></div>",
              prefix: "id-",
            },
            {
              input: "<div data-foo=\"bar\"></div>",
              expected: "<div foo-a=\"bar\"></div>",
              prefix: "foo-",
            },
            {
              input: "<div data-foo=\"bar\"></div>",
              expected: "<div a=\"bar\"></div>",
              prefix: "",
            },
          ],
        },
        {
          name: "with reserved",
          cases: [
            {
              input: "<div id=\"foobar\"></div>",
              expected: "<div id=\"foobar\"></div>",
              reserved: [],
            },
            {
              input: "<div data-foo=\"bar\"></div>",
              expected: "<div data-b=\"bar\"></div>",
              reserved: ["a"],
            },
            {
              input: "<div data-bar=\"foo\"></div>",
              expected: "<div data-c=\"foo\"></div>",
              reserved: ["a", "b"],
            },
          ],
        },
      ];

      for (const { name, cases } of scenarios) {
        test(name, function() {
          for (const testCase of cases) {
            const result = varyQuotes(type, testCase);
            expect(result).to.have.length(2);
            expect(result).to.deep.include(testCase);

            const indexOfOriginal = result.findIndex(ofTestCase(testCase));
            expect(indexOfOriginal).not.to.equal(-1);

            const othersIndices = [0, 1].filter(notNumber(indexOfOriginal));
            for (const i of othersIndices) {
              expect(result[i]).not.to.deep.equal(testCase);
            }

            for (const entry of result) {
              expect(entry.description).to.equal(testCase.description);
              expect(entry.pattern).to.equal(testCase.pattern);
              expect(entry.prefix).to.equal(testCase.prefix);
              expect(entry.reserved).to.equal(testCase.reserved);
            }
          }
        });
      }

      test("no quotes in input", function() {
        const testCase: TestCase = {
          input: "<p>foobar</p>",
          expected: "<p>foobar</p>",
        };

        const result = varyQuotes(type, testCase);
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal(testCase);
      });
    });

    suite("JavaScript", function() {
      const type = "js";

      const scenarios: TestScenario<TestCase>[] = [
        {
          name: "single quotes input",
          cases: [
            {
              input: "var foo = 'bar';",
              expected: "var bar = 'foo'",
            },
            {
              input: "foo('bar');",
              expected: "foo('bar')",
            },
          ],
        },
        {
          name: "double quotes input",
          cases: [
            {
              input: "var foo = \"bar\";",
              expected: "var bar = \"foo\"",
            },
            {
              input: "foo(\"bar\");",
              expected: "foo(\"bar\")",
            },
          ],
        },
        {
          name: "backticks input",
          cases: [
            {
              input: "var foo = `bar`;",
              expected: "var bar = `foo`",
            },
            {
              input: "foo(`bar`);",
              expected: "foo(`bar`)",
            },
          ],
        },
        {
          name: "with description",
          cases: [
            {
              input: "document.querySelector(\".cls-foo\");",
              expected: "document.querySelector(\".a\");",
              description: "",
            },
            {
              input: "document.querySelector(\".cls-foo\");",
              expected: "document.querySelector(\".a\");",
              description: "Hello world!",
            },
          ],
        },
        {
          name: "with pattern",
          cases: [
            {
              input: "document.querySelector(\".cls-foo\");",
              expected: "document.querySelector(\".cls-foo\");",
              pattern: "",
            },
            {
              input: "document.querySelector(\".cls-foo\");",
              expected: "document.querySelector(\".a\");",
              pattern: "cls-.+",
            },
          ],
        },
        {
          name: "with prefix",
          cases: [
            {
              input: "document.getElementById(\"id-foo\");",
              expected: "document.getElementById(\"a\");",
              prefix: "",
            },
            {
              input: "document.getElementById(\"id-foo\");",
              expected: "document.getElementById(\"id-a\");",
              prefix: "id-",
            },
          ],
        },
        {
          name: "with reserved",
          cases: [
            {
              input: "document.querySelector(\".cls-foo\");",
              expected: "document.querySelector(\".a\");",
              reserved: [],
            },
            {
              input: "document.querySelector(\".cls-foo\");",
              expected: "document.querySelector(\".b\");",
              reserved: ["a"],
            },
            {
              input: "document.querySelector(\".cls-foo\");",
              expected: "document.querySelector(\".c\");",
              reserved: ["a", "b"],
            },
          ],
        },
      ];

      for (const { name, cases } of scenarios) {
        test(name, function() {
          for (const testCase of cases) {
            const result = varyQuotes(type, testCase);
            expect(result).to.have.length(3);
            expect(result).to.deep.include(testCase);

            const indexOfOriginal = result.findIndex(ofTestCase(testCase));
            expect(indexOfOriginal).not.to.equal(-1);

            const othersIndices = [0, 1].filter(notNumber(indexOfOriginal));
            for (const i of othersIndices) {
              expect(result[i]).not.to.deep.equal(testCase);
            }

            for (const entry of result) {
              expect(entry.description).to.equal(testCase.description);
              expect(entry.pattern).to.equal(testCase.pattern);
              expect(entry.prefix).to.equal(testCase.prefix);
              expect(entry.reserved).to.equal(testCase.reserved);
            }
          }
        });
      }

      test("no quotes in input", function() {
        const testCase: TestCase = {
          input: "var foo;",
          expected: "var bar;",
        };

        const result = varyQuotes(type, testCase);
        expect(result).to.have.length(1);
        expect(result[0]).to.deep.equal(testCase);
      });
    });
  });

  suite("::varySpacing", function() {
    test("string not in test case", function() {
      const testCase: TestCase = {
        input: "foo",
        expected: "bar",
      };

      const result = varySpacing("definitely not in the test case", testCase);
      expect(result).to.have.length(1);
      expect(result[0]).to.equal(testCase);
    });

    test("empty list of characters", function() {
      const testCase: TestCase = {
        input: "foo",
        expected: "bar",
      };

      const result = varySpacing([], testCase);
      expect(result).to.have.length(1);
      expect(result[0]).to.equal(testCase);
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
