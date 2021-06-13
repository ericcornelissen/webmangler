import type { HtmlElementValuesSets } from "./types";

import {
  generateValueObjects,
  generateValueObjectsAll,
} from "@webmangler/testing";
import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";
import {
  buildHtmlAttributes,
  buildHtmlComment,
  buildHtmlElements,
  buildHtmlElement,
} from "./builders";
import { valuePresets } from "./values";

import expressionsFactory from "../attributes";

suite("HTML - Attribute Expression Factory", function() {
  type TestScenario = {
    readonly name: string;
    readonly pattern: string;
    readonly expected: string[];
    getValuesSets(): HtmlElementValuesSets[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "one element, one attribute",
      pattern: "[a-z\\-]+",
      expected: ["id"],
      getValuesSets: () => [
        {
          beforeOpeningTag: valuePresets.elements.beforeOpeningTag,
          tag: valuePresets.elements.tag,
          attributes: [
            ...buildHtmlAttributes({ name: "id" }),
            ...buildHtmlAttributes({ name: "id", value: "foobar" }),
          ],
          afterOpeningTag: valuePresets.elements.afterOpeningTag,
          content: valuePresets.elements.content,
        },
      ],
    },
    {
      name: "one element, multiple attribute",
      pattern: "[a-z\\-]+",
      expected: ["data-foo", "data-hello"],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: [
            "data-foo data-hello",
            "data-foo=bar data-hello",
            "data-foo=\"bar\" data-hello",
            "data-foo='bar' data-hello",
            "data-foo data-hello=world",
            "data-foo=bar data-hello=world",
            "data-foo=\"bar\" data-hello=world",
            "data-foo='bar' data-hello=world",
            "data-foo data-hello=\"world\"",
            "data-foo=bar data-hello=\"world\"",
            "data-foo=\"bar\" data-hello=\"world\"",
            "data-foo='bar' data-hello=\"world\"",
            "data-foo data-hello='world'",
            "data-foo=bar data-hello='world'",
            "data-foo=\"bar\" data-hello='world'",
            "data-foo='bar' data-hello='world'",
          ],
          content: valuePresets.elements.content,
        },
      ],
    },
    {
      name: "multiple elements, one attribute",
      pattern: "[a-z\\-]+",
      expected: ["data-foo", "data-hello"],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: [
            ...buildHtmlAttributes({ name: "data-foo" }),
            ...buildHtmlAttributes({ name: "data-foo", value: "bar" }),
          ],
          content: valuePresets.elements.content,
        },
        {
          tag: valuePresets.elements.tag,
          attributes: [
            ...buildHtmlAttributes({ name: "data-hello" }),
            ...buildHtmlAttributes({ name: "data-hello", value: "world" }),
          ],
          content: valuePresets.elements.content,
        },
      ],
    },
    {
      name: "attribute-like comments",
      pattern: "data-foo",
      expected: [],
      getValuesSets: () => {
        const commentWithElementWithAttribute = Array
          .from(generateValueObjects({
            tag: ["div"],
            attributes: [
              ...buildHtmlAttributes({ name: "data-foo" }),
              ...buildHtmlAttributes({ name: "data-foo", value: "bar" }),
            ],
            content: [undefined, ""],
          }))
          .map(buildHtmlElement)
          .map(buildHtmlComment);

        return [
          {
            beforeOpeningTag: [
              "",
              ...commentWithElementWithAttribute,
            ],
            tag: valuePresets.elements.tag,
            attributes: valuePresets.elements.attributes,
            content: [
              "",
              ...commentWithElementWithAttribute,
            ],
            afterClosingTag: [
              "",
              ...commentWithElementWithAttribute,
            ],
          },
        ];
      },
    },
    {
      name: "attribute-like content",
      pattern: "data-foo",
      expected: [],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: valuePresets.elements.attributes,
          afterOpeningTag: valuePresets.elements.afterOpeningTag,
          content: [
            ...buildHtmlAttributes({ name: "data-foo" }),
            ...buildHtmlAttributes({ name: "data-foo", value: "bar" }),
          ],
          beforeClosingTag: valuePresets.elements.beforeClosingTag,
        },
      ],
    },
    {
      name: "attribute-like attribute values",
      pattern: "data-[a-z\\-]+",
      expected: [],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: [
            "id=\"data-praise\"",
            "id='data-the'",
          ],
          content: valuePresets.elements.content,
        },
      ],
    },
  ];

  for (const scenario of scenarios) {
    const { name, pattern, expected, getValuesSets } = scenario;
    test(name, function() {
      const valuesSets = getValuesSets();
      for (const testCase of generateValueObjectsAll(valuesSets)) {
        const input = buildHtmlElements(testCase);
        const expressions = expressionsFactory();
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.have.members(expected, `in \`${input}\``);
      }
    });
  }
});
