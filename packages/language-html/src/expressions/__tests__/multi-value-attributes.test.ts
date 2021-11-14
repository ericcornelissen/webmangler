import type { MultiValueAttributeOptions } from "@webmangler/types";

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

import expressionsFactory from "../multi-value-attributes";

suite("HTML - Multi Value Attribute Expression Factory", function() {
  type TestScenario = {
    readonly name: string;
    readonly pattern: string;
    readonly factoryOptions: MultiValueAttributeOptions;
    readonly expected: string[];
    getValuesSets(): HtmlElementValuesSets[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "one element, multiple values",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["class"],
      },
      expected: ["foo", "bar"],
      getValuesSets: () => [
        {
          beforeOpeningTag: valuePresets.elements.beforeOpeningTag,
          tag: valuePresets.elements.tag,
          attributes: buildHtmlAttributes({
            name: "class",
            value: "foo bar",
          }),
          afterOpeningTag: valuePresets.elements.afterOpeningTag,
          content: valuePresets.elements.content,
        },
      ],
    },
    {
      name: "one element, one value",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["class"],
      },
      expected: ["foobar"],
      getValuesSets: () => [
        {
          beforeOpeningTag: valuePresets.elements.beforeOpeningTag,
          tag: valuePresets.elements.tag,
          attributes: buildHtmlAttributes({
            name: "class",
            value: "foobar",
          }),
          afterOpeningTag: valuePresets.elements.afterOpeningTag,
          content: valuePresets.elements.content,
        },
      ],
    },
    {
      name: "multiple elements, adjacent, one attribute",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["alt", "class"],
      },
      expected: ["foo", "bar", "hello", "world"],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: buildHtmlAttributes({
            name: "class",
            value: "foo bar",
          }),
          content: valuePresets.elements.content,
        },
        {
          tag: valuePresets.elements.tag,
          attributes: buildHtmlAttributes({
            name: "alt",
            value: "hello world",
          }),
          content: valuePresets.elements.content,
        },
      ],
    },
    {
      name: "multiple elements, nested, one attribute",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["alt", "class"],
      },
      expected: ["foo", "bar", "hello", "world"],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: buildHtmlAttributes({
            name: "class",
            value: "foo bar",
          }),
          afterOpeningTag: valuePresets.elements.afterOpeningTag,
          content: Array
            .from(generateValueObjects({
              tag: valuePresets.elements.tag,
              attributes: buildHtmlAttributes({
                name: "alt",
                value: "hello world",
              }),
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
        attributeNames: ["class"],
      },
      expected: [],
      getValuesSets: () => {
        const commentOfElementWithAttribute = Array
          .from(generateValueObjects({
            tag: ["div"],
            attributes: [
              ...buildHtmlAttributes({
                name: "class",
                value: "hello world",
              }),
            ],
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
        attributeNames: ["class"],
      },
      expected: [],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: valuePresets.elements.attributes,
          afterOpeningTag: valuePresets.elements.afterOpeningTag,
          content: buildHtmlAttributes({
            name: "class",
            value: "foo bar",
          }),
          beforeClosingTag: valuePresets.elements.beforeClosingTag,
        },
      ],
    },
    {
      name: "attribute-like attribute values",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["class"],
      },
      expected: [],
      getValuesSets: () => [
        {
          tag: valuePresets.elements.tag,
          attributes: [
            "alt=\"class='foo bar'\"",
            "alt='class=\"foo bar\"'",
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
