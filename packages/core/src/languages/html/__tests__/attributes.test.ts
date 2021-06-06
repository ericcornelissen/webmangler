import type { HtmlElementValuesSets } from "./types";

import { generateValueObjectsAll } from "@webmangler/testing";
import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";
import { buildHtmlElements } from "./builders";
import { valuePresets } from "./values";

import expressionsFactory from "../attributes";

suite("HTML - Attribute Expression Factory", function() {
  type TestScenario = {
    readonly name: string;
    readonly pattern: string;
    readonly expected: string[];
    readonly valuesSets: HtmlElementValuesSets[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "one element, one attribute",
      pattern: "[a-z\\-]+",
      expected: ["id"],
      valuesSets: [
        {
          beforeOpeningTag: valuePresets.beforeOpeningTag,
          tag: valuePresets.tag,
          attributes: [
            "id",
            "id=foobar",
            "id=\"foobar\"",
            "id='foobar'",
          ],
          afterOpeningTag: valuePresets.afterOpeningTag,
          content: valuePresets.content,
        },
      ],
    },
    {
      name: "one element, multiple attribute",
      pattern: "[a-z\\-]+",
      expected: ["data-foo", "data-hello"],
      valuesSets: [
        {
          tag: valuePresets.tag,
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
          content: valuePresets.content,
        },
      ],
    },
    {
      name: "multiple elements, one attribute",
      pattern: "[a-z\\-]+",
      expected: ["data-foo", "data-hello"],
      valuesSets: [
        {
          tag: valuePresets.tag,
          attributes: [
            "data-foo",
            "data-foo=bar",
            "data-foo=\"bar\"",
            "data-foo='bar'",
          ],
          content: valuePresets.content,
        },
        {
          tag: valuePresets.tag,
          attributes: [
            "data-hello",
            "data-hello=world",
            "data-hello=\"world\"",
            "data-hello='world'",
          ],
          content: valuePresets.content,
        },
      ],
    },
    {
      name: "attribute-like content",
      pattern: "data-foo",
      expected: [],
      valuesSets: [
        {
          tag: valuePresets.tag,
          attributes: valuePresets.attributes,
          afterOpeningTag: valuePresets.afterOpeningTag,
          content: [
            "data-foo",
            "data-foo=bar",
            "data-foo=\"bar\"",
            "data-foo='bar'",
          ],
          beforeClosingTag: valuePresets.beforeClosingTag,
        },
      ],
    },
    {
      name: "attribute-like comments",
      pattern: "data-foo",
      expected: [],
      valuesSets: [
        {
          beforeOpeningTag: [
            "",
            "<!-- data-foo=\"bar\" -->",
            "<!-- <div data-foo=\"bar\"> -->",
          ],
          tag: valuePresets.tag,
          attributes: valuePresets.attributes,
          content: [
            "",
            "<!-- data-foo=\"bar\" -->",
            "<!-- <div data-foo=\"bar\"> -->",
          ],
          afterClosingTag: [
            "",
            "<!-- data-foo=\"bar\" -->",
            "<!-- <div data-foo=\"bar\"> -->",
          ],
        },
      ],
    },
    {
      name: "attribute-like attribute values",
      pattern: "data-[a-z\\-]+",
      expected: [],
      valuesSets: [
        {
          tag: valuePresets.tag,
          attributes: [
            "id=\"data-praise\"",
            "id='data-the'",
          ],
          content: valuePresets.content,
        },
      ],
    },
  ];

  for (const scenario of scenarios) {
    const { name, pattern, expected, valuesSets } = scenario;
    test(name, function() {
      for (const testCase of generateValueObjectsAll(valuesSets)) {
        const input = buildHtmlElements(testCase);
        const expressions = expressionsFactory();
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.deep.equal(expected, `in \`${input}\``);
      }
    });
  }
});
