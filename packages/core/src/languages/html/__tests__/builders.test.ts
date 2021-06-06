import type { HtmlElementValues } from "./types";

import { expect } from "chai";

import {
  buildHtmlElement,
  buildHtmlElements,
} from "./builders";

suite("HTML expression factory test suite string builders", function() {
  suite("::buildHtmlElement", function() {
    const DEFAULT_TAG = "div";

    type TestCase = {
      expected: string;
      input: HtmlElementValues;
      name: string;
    };

    const testCases: TestCase[] = [
      {
        name: "no values",
        input: { },
        expected: `<${DEFAULT_TAG}/>`,
      },
      {
        name: "only content",
        input: {
          content: "foobar",
        },
        expected: `<${DEFAULT_TAG}>foobar</${DEFAULT_TAG}>`,
      },
      {
        name: "only a tag",
        input: {
          tag: "foobar",
        },
        expected: "<foobar/>",
      },
      {
        name: "only a tag",
        input: {
          tag: "foo",
          content: "bar",
        },
        expected: "<foo>bar</foo>",
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const result = buildHtmlElement(input);
        expect(result).to.equal(expected);
      });
    }
  });

  suite("::buildHtmlElements", function() {
    type TestCase = {
      expected: string;
      input: HtmlElementValues[];
      name: string;
    };

    const testCases: TestCase[] = [
      {
        name: "no values",
        input: [],
        expected: "",
      },
      {
        name: "one element",
        input: [
          {
            tag: "div",
            content: "foobar",
          },
        ],
        expected: "<div>foobar</div>",
      },
      {
        name: "multiple rulesets",
        input: [
          {
            tag: "header",
            content: "foo",
          },
          {
            tag: "footer",
            content: "bar",
          },
        ],
        expected: "<header>foo</header><footer>bar</footer>",
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const result = buildHtmlElements(input);
        expect(result).to.equal(expected);
      });
    }
  });
});
