import type { JsFunctionValues, JsStatementValues } from "./types";

import { expect } from "chai";

import {
  buildJsFunctionCall,
  buildJsInlineComment,
  buildJsLineComment,
  buildJsStatement,
  buildJsStatements,
  buildJsStrings,
} from "./builders";

suite("JS expression factory test suite string builders", function() {
  suite("::buildJsFunctionCall", function() {
    type TestCase = {
      expected: string;
      input: JsFunctionValues;
      name: string;
    };

    const testCases: TestCase[] = [
      {
        name: "no values",
        input: { },
        expected: "fn()",
      },
      {
        name: "only a name",
        input: {
          name: "callback",
        },
        expected: "callback()",
      },
      {
        name: "only args",
        input: {
          args: "foo, bar",
        },
        expected: "fn(foo, bar)",
      },
      {
        name: "a name and args",
        input: {
          name: "callback",
          args: "3, 14",
        },
        expected: "callback(3, 14)",
      },
      {
        name: "with befores and afters",
        input: {
          beforeName: "/*foo*/",
          name: "fn",
          afterName: "/*bar*/",
          beforeArgs: "/*praise*/",
          args: "true",
          afterArgs: "/*the*/",
          afterFunction: "/*sun*/",
        },
        expected: "/*foo*/fn/*bar*/(/*praise*/true/*the*/)/*sun*/",
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const result = buildJsFunctionCall(input);
        expect(result).to.equal(expected);
      });
    }
  });

  suite("::buildJsInlineComment", function() {
    type TestCase = {
      expected: string;
      input: string;
      name: string;
    };

    const testCases: TestCase[] = [
      {
        name: "empty string",
        input: "",
        expected: "/**/",
      },
      {
        name: "non-empty string",
        input: "foobar",
        expected: "/*foobar*/",
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const result = buildJsInlineComment(input);
        expect(result).to.equal(expected);
      });
    }
  });

  suite("::buildJsLineComment", function() {
    type TestCase = {
      expected: string;
      input: string;
      name: string;
    };

    const testCases: TestCase[] = [
      {
        name: "empty string",
        input: "",
        expected: "//",
      },
      {
        name: "non-empty string",
        input: "foobar",
        expected: "//foobar",
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const result = buildJsLineComment(input);
        expect(result).to.equal(expected);
      });
    }
  });

  suite("::buildJsStatement", function() {
    type TestCase = {
      expected: string;
      input: JsStatementValues;
      name: string;
    };

    const testCases: TestCase[] = [
      {
        name: "no input",
        input: { },
        expected: "var x;",
      },
      {
        name: "only a right-hand side",
        input: {
          rightHand: "fn()",
        },
        expected: "var x=fn();",
      },
      {
        name: "a left-hand and right-hand side",
        input: {
          leftHand: "let foo",
          rightHand: "\"bar\"",
        },
        expected: "let foo=\"bar\";",
      },
      {
        name: "all befores and afters with right-hand sid",
        input: {
          beforeLeftHand: "/*foo*/",
          leftHand: "var x",
          afterLeftHand: "/*bar*/",
          beforeRightHand: "/*Hello*/",
          rightHand: "y",
          afterRightHand: "/*world!*/",
          afterStatement: "\n",
        },
        expected: "/*foo*/var x/*bar*/=/*Hello*/y/*world!*/;\n",
      },
      {
        name: "all befores and afters without right-hand side",
        input: {
          beforeLeftHand: "/*foo*/",
          leftHand: "var x",
          afterLeftHand: "/*bar*/",
          beforeRightHand: "/*Hello*/",
          afterRightHand: "/*world!*/",
          afterStatement: "\n",
        },
        expected: "/*foo*/var x/*bar*/;\n",
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const result = buildJsStatement(input);
        expect(result).to.equal(expected);
      });
    }
  });

  suite("::buildJsStatements", function() {
    type TestCase = {
      expected: string;
      input: JsStatementValues[];
      name: string;
    };

    const testCases: TestCase[] = [
      {
        name: "no statements",
        input: [],
        expected: "",
      },
      {
        name: "one statement",
        input: [
          {
            leftHand: "var x",
            rightHand: "fn()",
          },
        ],
        expected: "var x=fn();",
      },
      {
        name: "multiple statement",
        input: [
          {
            leftHand: "var x",
            rightHand: "fn()",
          },
          {
            leftHand: "let y",
            rightHand: "x",
          },
        ],
        expected: "var x=fn();let y=x;",
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const result = buildJsStatements(input);
        expect(result).to.equal(expected);
      });
    }
  });

  suite("::buildJsStrings", function() {
    type TestCase = {
      expected: string[];
      input: string;
      name: string;
    };

    const testCases: TestCase[] = [
      {
        name: "empty string",
        input: "",
        expected: ["\"\"", "''", "``"],
      },
      {
        name: "non-empty string",
        input: "foobar",
        expected: [
          "\"foobar\"",
          "'foobar'",
          "`foobar`",
        ],
      },
      {
        name: "string with double quote",
        input: "foo\"bar",
        expected: [
          "\"foo\\\"bar\"",
          "'foo\"bar'",
          "`foo\"bar`",
        ],
      },
      {
        name: "string with single quote",
        input: "john's",
        expected: [
          "\"john's\"",
          "'john\\'s'",
          "`john's`",
        ],
      },
      {
        name: "string with backtick",
        input: "a backtick (`)",
        expected: [
          "\"a backtick (`)\"",
          "'a backtick (`)'",
          "`a backtick (\\`)`",
        ],
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const result = buildJsStrings(input);
        expect(result).to.have.members(expected);
      });
    }
  });
});
