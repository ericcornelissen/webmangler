import type { SingleValueAttributeOptions } from "../../options";
import type { HtmlElementValuesSets } from "./types";

import {
  generateValueObjects,
  generateValueObjectsAll,
} from "@webmangler/testing";
import { expect } from "chai";

import { getAllMatches } from "./test-helpers";
import {
  buildHtmlAttributes,
  buildHtmlComment,
  buildHtmlElements,
  buildHtmlElement,
} from "./builders";
import { valuePresets } from "./values";

import expressionsFactory from "../single-value-attributes";

suite("HTML - Single Value Attribute Expression Factory", function() {
  type TestScenario = {
    readonly name: string;
    readonly pattern: string;
    readonly factoryOptions: SingleValueAttributeOptions;
    readonly expected: string[];
    getValuesSets(): HtmlElementValuesSets[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "one element, no configuration",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["id", "x-id"],
      },
      expected: ["foobar"],
      getValuesSets: () => [
        {
          beforeOpeningTag: valuePresets.elements.beforeOpeningTag,
          tag: valuePresets.elements.tag,
          attributes: buildHtmlAttributes({ name: "id", value: "foobar" }),
          afterOpeningTag: valuePresets.elements.afterOpeningTag,
          content: valuePresets.elements.content,
        },
      ],
    },
    {
      name: "one element, with prefix no suffix",
      pattern: "[a-z\\-]+",
      factoryOptions: {
        attributeNames: ["href"],
        valuePrefix: "\\#",
      },
      expected: ["foobar"],
      getValuesSets: () => [
        {
          beforeOpeningTag: valuePresets.elements.beforeOpeningTag,
          tag: valuePresets.elements.tag,
          attributes: buildHtmlAttributes({ name: "href", value: "#foobar" }),
          afterOpeningTag: valuePresets.elements.afterOpeningTag,
          content: valuePresets.elements.content,
        },
      ],
    },
    {
      name: "one element, with suffix no prefix",
      pattern: "[a-z\\_]+",
      factoryOptions: {
        attributeNames: ["target"],
        valueSuffix: "blank",
      },
      expected: ["_"],
      getValuesSets: () => [
        {
          beforeOpeningTag: valuePresets.elements.beforeOpeningTag,
          tag: valuePresets.elements.tag,
          attributes: buildHtmlAttributes({ name: "target", value: "_blank" }),
          afterOpeningTag: valuePresets.elements.afterOpeningTag,
          content: valuePresets.elements.content,
        },
      ],
    },
    {
      name: "multiple elements, adjacent, one attribute",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["id"],
      },
      expected: ["foo", "bar"],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: buildHtmlAttributes({ name: "id", value: "foo" }),
          content: valuePresets.elements.content,
        },
        {
          tag: valuePresets.elements.tag,
          attributes: buildHtmlAttributes({ name: "id", value: "bar" }),
          content: valuePresets.elements.content,
        },
      ],
    },
    {
      name: "multiple elements, nested, one attribute",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["id"],
      },
      expected: ["foo", "bar"],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: buildHtmlAttributes({ name: "id", value: "foo" }),
          afterOpeningTag: valuePresets.elements.afterOpeningTag,
          content: Array
            .from(generateValueObjects({
              tag: valuePresets.elements.tag,
              attributes: buildHtmlAttributes({ name: "id", value: "bar" }),
              content: valuePresets.elements.content,
            }))
            .map(buildHtmlElement),
        },
      ],
    },
    {
      name: "attribute-like comments",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["data-foo"],
      },
      expected: [],
      getValuesSets: () => {
        const commentOfElementWithAttribute = Array
          .from(generateValueObjects({
            tag: ["div"],
            attributes: buildHtmlAttributes({ name: "data-foo", value: "bar" }),
            content: [undefined, ""],
          }))
          .map(buildHtmlElement)
          .map(buildHtmlComment);

        return [
          {
            beforeOpeningTag: [
              "",
              ...commentOfElementWithAttribute,
            ],
            tag: valuePresets.elements.tag,
            attributes: valuePresets.elements.attributes,
            content: [
              "",
              ...commentOfElementWithAttribute,
            ],
            afterClosingTag: [
              "",
              ...commentOfElementWithAttribute,
            ],
          },
        ];
      },
    },
    {
      name: "attribute-like content",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["data-foo"],
      },
      expected: [],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: valuePresets.elements.attributes,
          afterOpeningTag: valuePresets.elements.afterOpeningTag,
          content: buildHtmlAttributes({ name: "data-foo", value: "bar" }),
          beforeClosingTag: valuePresets.elements.beforeClosingTag,
        },
      ],
    },
    {
      name: "attribute-like attribute values",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["data-foo"],
      },
      expected: [],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: [
            "alt=\"data-foo=bar\"",
            "alt='data-foo=bar'",
            "alt=\"data-foo='bar'\"",
            "alt='data-foo=\"bar\"'",
          ],
          content: valuePresets.elements.content,
        },
      ],
    },
  ];

  for (const scenario of scenarios) {
    const { name, pattern, factoryOptions, expected, getValuesSets } = scenario;
    test(name, function() {
      const valueSets = getValuesSets();
      for (const testCase of generateValueObjectsAll(valueSets)) {
        const input = buildHtmlElements(testCase);
        const expressions = expressionsFactory(factoryOptions);
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.have.members(expected, `in \`${input}\``);
      }
    });
  }
});
