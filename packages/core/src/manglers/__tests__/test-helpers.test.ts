import { expect } from "chai";

import {
  getArrayOfFormattedStrings,
  isValidClassName,
  permuteObjects,
  varyQuotes,
  varySpacing,
} from "./test-helpers";
import { TestCase, TestScenario } from "./testing";

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

    suite("JavaScript", function() {
      const type = "js";

      const scenarios: TestScenario[] = [
        {
          name: "single quotes input",
          cases: [
            { input: "var foo = 'bar';", expected: "var bar = 'foo'" },
          ],
        },
        {
          name: "double quotes input",
          cases: [
            { input: "var foo = \"bar\";", expected: "var bar = \"foo\"" },
          ],
        },
        {
          name: "backticks input",
          cases: [
            { input: "var foo = `bar`;", expected: "var bar = `foo`" },
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

    suite("HTML", function() {
      const type = "html";

      const scenarios: TestScenario[] = [
        {
          name: "single quotes input",
          cases: [
            { input: "<div id='foo'>", expected: "<div id='bar'>" },
          ],
        },
        {
          name: "double quotes input",
          cases: [
            { input: "<div id=\"foo\">", expected: "<div id=\"bar\">" },
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
  });

  suite("::varySpacing", function() {
    test("character not in test case", function() {
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

    test("does something...", function() {
      const testCase: TestCase = {
        input: "foo>bar",
        expected: "a>b",
      };

      const result = varySpacing(">", testCase);
      expect(result).to.have.length(4);
      expect(result[0]).to.equal(testCase);
      expect(result[1]).not.to.equal(testCase);
      expect(result[2]).not.to.equal(testCase);
      expect(result[3]).not.to.equal(testCase);
    });
  });
});
