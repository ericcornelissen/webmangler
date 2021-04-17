import type { TestCase } from "./types";

import { curry } from "ramda";

import { SELF_CLOSING_TAGS, STANDARD_TAGS } from "./html-constants";

/**
 * Embed an attribute value, encoded as a {@link TestCase}, into an attribute.
 *
 * @param attr The name of the attribute.
 * @param testCase The attribute value encoded as a {@link TestCase}.
 * @returns A {@link TestCase} with the attribute and value.
 */
export const embedAttributeValue = curry(function(
  attr: string,
  testCase: TestCase,
): TestCase {
  return Object.assign({}, testCase, {
    input: `${attr}="${testCase.input}"`,
    expected: `${attr}="${testCase.expected}"`,
  });
});

/**
 * Embed two attribute sets, encoded as two {@link TestCase}s, into a variety of
 * adjacent elements.
 *
 * @param testCases The attribute sets encoded as {@link TestCase}s.
 * @returns Various {@link TestCase}s for various adjacent configurations.
 */
export function embedAttributesInAdjacentTags(
  testCases: [TestCase, TestCase],
): TestCase[] {
  const [testCaseA, testCaseB] = testCases;
  return [
    {
      input: `
        <div ${testCaseA.input}></div>
        <div ${testCaseB.input}></div>
      `,
      expected: `
        <div ${testCaseA.expected}></div>
        <div ${testCaseB.expected}></div>
      `,
    },
    {
      input: `
        <div ${testCaseA.input}></div>
        <div></div>
        <div ${testCaseB.input}></div>
      `,
      expected: `
        <div ${testCaseA.expected}></div>
        <div></div>
        <div ${testCaseB.expected}></div>
      `,
    },
    {
      input: `
        <div>
          <div ${testCaseA.input}></div>
        </div>
        <div ${testCaseB.input}></div>
      `,
      expected: `
        <div>
          <div ${testCaseA.expected}></div>
        </div>
        <div ${testCaseB.expected}></div>
      `,
    },
    {
      input: `
        <div ${testCaseA.input}></div>
        <div>
          <div ${testCaseB.input}></div>
        </div>
      `,
      expected: `
        <div ${testCaseA.expected}></div>
        <div>
          <div ${testCaseB.expected}></div>
        </div>
      `,
    },
  ];
}

/**
 * Embed two attribute sets, encoded as two {@link TestCase}s, into a variety of
 * nested elements.
 *
 * @param testCases The attribute sets encoded as {@link TestCase}s.
 * @returns Various {@link TestCase}s for various nested configurations.
 */
export function embedAttributesInNestedTags(
  testCases: [TestCase, TestCase],
): TestCase[] {
  const [testCaseA, testCaseB] = testCases;
  return [
    {
      input: `
        <div ${testCaseA.input}>
          <div ${testCaseB.input}></div>
        </div>
      `,
      expected: `
        <div ${testCaseA.expected}>
          <div ${testCaseB.expected}></div>
        </div>
      `,
    },
    {
      input: `
        <div ${testCaseA.input}>
          <div></div>
          <div ${testCaseB.input}></div>
        </div>
      `,
      expected: `
        <div ${testCaseA.expected}>
          <div></div>
          <div ${testCaseB.expected}></div>
        </div>
      `,
    },
    {
      input: `
        <div ${testCaseA.input}>
          <div>
            <div ${testCaseB.input}></div>
          </div>
        </div>
      `,
      expected: `
        <div ${testCaseA.expected}>
          <div>
            <div ${testCaseB.expected}></div>
          </div>
        </div>
      `,
    },
  ];
}

/**
 * Embed attributes, encoded as a {@link TestCase}, into a variety of tags (both
 * both normal and self-closing).
 *
 * @param testCase The attributes encoded as a {@link TestCase}.
 * @returns Various {@link TestCase}s for various tags.
 */
export function embedAttributesInTags(testCase: TestCase): TestCase[] {
  return [
    ...STANDARD_TAGS
      .flatMap((tag: string): TestCase[] => [
        {
          input: `<${tag} ${testCase.input}>Lorem ipsum</${tag}>`,
          expected: `<${tag} ${testCase.expected}>Lorem ipsum</${tag}>`,
        },
      ]),
    ...SELF_CLOSING_TAGS
      .flatMap((tag: string): TestCase[] => [
        {
          input: `<${tag} ${testCase.input}/>`,
          expected: `<${tag} ${testCase.expected}/>`,
        },
        {
          input: `<${tag} ${testCase.input} />`,
          expected: `<${tag} ${testCase.expected} />`,
        },
      ]),
  ].map((r: TestCase): TestCase => Object.assign({}, testCase, r));
}

/**
 * Embed attributes, encoded as a {@link TestCase}, into a variety of
 * configurations with other attributes.
 *
 * NOTE: the original {@link TestCase} is not returned.
 *
 * @param testCase The single-attribute {@link TestCase}.
 * @returns Various {@link TestCase}s with two or more attributes.
 */
export function embedWithOtherAttributes(testCase: TestCase): TestCase[] {
  return [
    {
      input: `disabled ${testCase.input}`,
      expected: `disabled ${testCase.expected}`,
    },
    {
      input: `alt="" ${testCase.input}`,
      expected: `alt="" ${testCase.expected}`,
    },
    {
      input: `id="foobar" ${testCase.input}`,
      expected: `id="foobar" ${testCase.expected}`,
    },
    {
      input: `${testCase.input} aria-hidden`,
      expected: `${testCase.expected} aria-hidden`,
    },
    {
      input: `${testCase.input} for=""`,
      expected: `${testCase.expected} for=""`,
    },
    {
      input: `${testCase.input} width="42"`,
      expected: `${testCase.expected} width="42"`,
    },
    {
      input: `disabled ${testCase.input} for=""`,
      expected: `disabled ${testCase.expected} for=""`,
    },
    {
      input: `disabled ${testCase.input} width="42"`,
      expected: `disabled ${testCase.expected} width="42"`,
    },
    {
      input: `alt="" ${testCase.input} aria-hidden`,
      expected: `alt="" ${testCase.expected} aria-hidden`,
    },
    {
      input: `id="foobar" ${testCase.input} aria-hidden`,
      expected: `id="foobar" ${testCase.expected} aria-hidden`,
    },
    {
      input: `alt="" ${testCase.input} width="42"`,
      expected: `alt="" ${testCase.expected} width="42"`,
    },
    {
      input: `id="foobar" ${testCase.input} for=""`,
      expected: `id="foobar" ${testCase.expected} for=""`,
    },
  ].map((r: TestCase): TestCase => Object.assign({}, testCase, r));
}
