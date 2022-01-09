import type { HtmlAttributeValues, HtmlElementValues } from "./types";

import { expect } from "chai";

import {
  buildHtmlAttributes,
  buildHtmlComments,
  buildHtmlElement,
  buildHtmlElements,
} from "./builders";

suite("HTML expression factory test suite string builders", function() {
  suite("::buildHtmlAttributes", function() {
    const DEFAULT_ATTRIBUTE_NAME = "alt";

    type TestCase = {
      expected: string[];
      input: HtmlAttributeValues;
      name: string;
    };

    const testCases: TestCase[] = [
      {
        name: "no value",
        input: { },
        expected: [DEFAULT_ATTRIBUTE_NAME],
      },
      {
        name: "only a name",
        input: {
          name: "class",
        },
        expected: ["class"],
      },
      {
        name: "name and value (no whitespace)",
        input: {
          name: "id",
          value: "foobar",
        },
        expected: [
          "id=foobar",
          "id=\"foobar\"",
          "id='foobar'",
        ],
      },
      {
        name: "name and value (with whitespace)",
        input: {
          name: "alt",
          value: "Hello world!",
        },
        expected: [
          "alt=\"Hello world!\"",
          "alt='Hello world!'",
        ],
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const result = buildHtmlAttributes(input);
        expect(result).to.have.members(expected);
      });
    }
  });

  suite("::buildHtmlComments", function() {
    type TestCase = {
      expected: string[];
      input: string;
      name: string;
    };

    const testCases: TestCase[] = [
      {
        name: "no value",
        input: "",
        expected: [
          "<!---->",
          "<!-- \n -->",
          "<!----!>",
        ],
      },
      {
        name: "some string",
        input: "foobar",
        expected: [
          "<!--foobar-->",
          "<!-- \n foobar-->",
          "<!--foobar--!>",
        ],
      },
      {
        name: "some HTML",
        input: "<div>foobar</div>",
        expected: [
          "<!--<div>foobar</div>-->",
          "<!-- \n <div>foobar</div>-->",
          "<!--<div>foobar</div>--!>",
        ],
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const result = buildHtmlComments(input);
        expect(result).to.have.all.members(expected);
      });
    }
  });

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
        name: "tag and content",
        input: {
          tag: "foo",
          content: "bar",
        },
        expected: "<foo>bar</foo>",
      },
      {
        name: "tag and empty content",
        input: {
          tag: "foo",
          content: "",
        },
        expected: "<foo></foo>",
      },
      {
        name: "tag, attributes, and content",
        input: {
          tag: "praise",
          attributes: "id=the",
          content: "sun",
        },
        expected: "<praise id=the>sun</praise>",
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
