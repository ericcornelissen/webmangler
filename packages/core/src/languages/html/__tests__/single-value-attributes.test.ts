import type { SingleValueAttributeOptions } from "../../options";
import type { HtmlElementValuesSets } from "./types";

import {
  generateValueObjects,
  generateValueObjectsAll,
} from "@webmangler/testing";
import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";
import { buildHtmlElements, buildHtmlElement } from "./builders";
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
        attributeNames: ["id"],
      },
      expected: ["foobar"],
      getValuesSets: () => [
        {
          beforeOpeningTag: valuePresets.beforeOpeningTag,
          tag: valuePresets.tag,
          attributes: createAttributeVariants("id", "foobar"),
          afterOpeningTag: valuePresets.afterOpeningTag,
          content: valuePresets.content,
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
      expected: ["praise-the-sun"],
      getValuesSets: () => [
        {
          beforeOpeningTag: valuePresets.beforeOpeningTag,
          tag: valuePresets.tag,
          attributes: createAttributeVariants("href", "#praise-the-sun"),
          afterOpeningTag: valuePresets.afterOpeningTag,
          content: valuePresets.content,
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
          beforeOpeningTag: valuePresets.beforeOpeningTag,
          tag: valuePresets.tag,
          attributes: createAttributeVariants("target", "_blank"),
          afterOpeningTag: valuePresets.afterOpeningTag,
          content: valuePresets.content,
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
          tag: valuePresets.tag,
          attributes: createAttributeVariants("id", "foo"),
          content: valuePresets.content,
        },
        {
          tag: valuePresets.tag,
          attributes: createAttributeVariants("id", "bar"),
          content: valuePresets.content,
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
          tag: valuePresets.tag,
          attributes: createAttributeVariants("id", "foo"),
          afterOpeningTag: valuePresets.afterOpeningTag,
          content: Array
            .from(generateValueObjects({
              tag: valuePresets.tag,
              attributes: createAttributeVariants("id", "bar"),
              content: valuePresets.content,
            }))
            .map(buildHtmlElement),
        },
      ],
    },
    {
      name: "attribute-like comments",
      pattern: "[a-z\\-]+",
      factoryOptions: {
        attributeNames: ["data-foo"],
      },
      expected: [],
      getValuesSets: () => {
        const commentWithElementWithAttribute = Array
          .from(generateValueObjects({
            tag: ["div"],
            attributes: createAttributeVariants("data-foo", "bar"),
            content: [""],
          }))
          .map(buildHtmlElement)
          .map(embedInComment);

        return [
          {
            beforeOpeningTag: ["", ...commentWithElementWithAttribute],
            tag: valuePresets.tag,
            attributes: valuePresets.attributes,
            content: ["", ...commentWithElementWithAttribute],
            afterClosingTag: ["", ...commentWithElementWithAttribute],
          },
        ];
      },
    },
    {
      name: "attribute-like content",
      pattern: "[a-z\\-]+",
      factoryOptions: {
        attributeNames: ["data-foo"],
      },
      expected: [],
      getValuesSets: () => [
        {
          tag: valuePresets.tag,
          attributes: valuePresets.attributes,
          afterOpeningTag: valuePresets.afterOpeningTag,
          content: createAttributeVariants("data-foo", "bar"),
          beforeClosingTag: valuePresets.beforeClosingTag,
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


/**
 * Create all possible variants of an attribute single-value attribute.
 *
 * @param attributeName The attribute name.
 * @param value The attribute value.
 * @returns A list of attribute-value strings.
 */
function createAttributeVariants(
  attributeName: string,
  value: string,
): string[] {
  return [
    `${attributeName}=${value}`,
    `${attributeName}="${value}"`,
    `${attributeName}='${value}'`,
  ];
}

/**
 * Embed a string into a HTML comment.
 *
 * @param commentText The comment text.
 * @returns The text as a HTML comment.
 */
function embedInComment(commentText: string): string {
  return `<!--${commentText}-->`;
}
