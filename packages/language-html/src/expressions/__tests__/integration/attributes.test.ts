import type { AttributeOptions } from "@webmangler/types";

import type { HtmlElementValuesSets } from "../common";

import {
  generateValueObjects,
  generateValueObjectsAll,
} from "@webmangler/testing";
import { expect } from "chai";

import {
  buildHtmlAttributes,
  buildHtmlComments,
  buildHtmlElements,
  buildHtmlElement,
  getAllMatches,
  valuePresets,
} from "../common";

import expressionsFactory from "../../attributes";

suite("HTML - Attribute Expression Factory", function() {
  type TestScenario = {
    readonly name: string;
    readonly pattern: string;
    readonly factoryOptions: AttributeOptions;
    readonly expected: string[];
    getValuesSets(): HtmlElementValuesSets[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "one element, one attribute",
      pattern: "[a-z\\-]+",
      factoryOptions: { },
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
      factoryOptions: { },
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
      factoryOptions: { },
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
      name: "same attribute with different casing",
      pattern: "data-[a-z]+",
      factoryOptions: { },
      expected: ["data-foo", "data-foo"],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: [
            ...buildHtmlAttributes({ name: "data-foo" }),
          ],
          content: valuePresets.elements.content,
        },
        {
          tag: valuePresets.elements.tag,
          attributes: [
            ...buildHtmlAttributes({ name: "data-FOO" }),
          ],
          content: valuePresets.elements.content,
        },
      ],
    },
    {
      name: "attribute-like comments",
      pattern: "data-foo",
      factoryOptions: { },
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
          .flatMap(buildHtmlComments);

        return [
          {
            beforeOpeningTag: [
              "",
              ...commentWithElementWithAttribute,
            ],
            tag: ["span"],
            attributes: valuePresets.elements.attributes,
            content: [
              undefined,
              "",
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
      factoryOptions: { },
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
      factoryOptions: { },
      expected: ["data-bar"],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: [
            "id=\"data-foo\" data-bar",
            "id='data-foo' data-bar",
            "id=data-foo data-bar",
          ],
          content: valuePresets.elements.content,
        },
      ],
    },
    {
      name: "element-like attribute values",
      pattern: "data-[a-z\\-]+",
      factoryOptions: { },
      expected: ["data-bar"],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: [
            "alt=\"<div data-foo>\" data-bar",
            "alt='<div data-foo>' data-bar",
            "alt=\"<div data-foo='bar'>\" data-bar",
            "alt='<div data-foo=\"bar\">' data-bar",
          ],
          content: valuePresets.elements.content,
        },
      ],
    },
    {
      name: "edge cases",
      pattern: "data-[a-z]+",
      factoryOptions: { },
      expected: [],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: [
            ...buildHtmlAttributes({ name: "data-foo-a" }),
            ...buildHtmlAttributes({ name: "data-foo-a", value: "bar" }),
          ],
          content: valuePresets.elements.content,
        },
      ],
    },
  ];

  for (const scenario of scenarios) {
    const { name, pattern, factoryOptions, expected, getValuesSets } = scenario;
    test(name, function() {
      const valuesSets = getValuesSets();
      for (const testCase of generateValueObjectsAll(valuesSets)) {
        const input = buildHtmlElements(testCase);
        const expressions = expressionsFactory(factoryOptions);
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.have.members(expected, `in \`${input}\``);
      }
    });
  }
});
