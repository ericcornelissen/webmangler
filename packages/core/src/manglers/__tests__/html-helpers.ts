import type { TestCase } from "./types";

import { SELF_CLOSING_TAGS, STANDARD_TAGS } from "./html-constants";

/**
 * Embed two attribute sets, encoded as a {@link TestCase}s, into a variety of
 * adjacent elements.
 *
 * @param testCases The attribute sets encoded as a {@link TestCase}s.
 * @returns A variety of {@link TestCase}s for various adjacent configurations.
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
        <div><div ${testCaseA.input}></div></div>
        <div ${testCaseB.input}></div>
      `,
      expected: `
        <div><div ${testCaseA.expected}></div></div>
        <div ${testCaseB.expected}></div>
      `,
    },
    {
      input: `
        <div ${testCaseA.input}></div>
        <div><div ${testCaseB.input}></div></div>
      `,
      expected: `
        <div ${testCaseA.expected}></div>
        <div><div ${testCaseB.expected}></div></div>
      `,
    },
  ];
}

/**
 * Embed two attribute sets, encoded as a {@link TestCase}s, into a variety of
 * nested elements.
 *
 * @param testCases The attribute sets encoded as a {@link TestCase}s.
 * @returns A variety of {@link TestCase}s for various nested configurations.
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
 * Embed attributes, encoded as a {@link TestCase}, into a variety of tags. This
 * includes both normal and self-closing tags.
 *
 * @param testCase The attributes encoded as a {@link TestCase}.
 * @returns A variety of {@link TestCase}s for various tags.
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
  ];
}

/**
 * Embed CSS declarations, encoded as a {@link TestCase}, into a style
 * attribute.
 *
 * @param testCase The CSS declarations encoded as a {@link TestCase}.
 * @returns A {@link TestCase}s with the declarations in a style attribute.
 */
export function embedDeclarationsInStyle(testCase: TestCase): TestCase {
  return {
    input: `style="${testCase.input}"`,
    expected: `style="${testCase.expected}"`,
  };
}

/**
 * Generate {@link TestCase}s with a variety of other attributes from a single
 * attribute {@link TestCase}.
 *
 * For a single {@link TestCase} this returns a variety of {@link TestCase}s
 * where the original attribute appears with at most two other attributes. The
 * original test case is always included.
 *
 * For a pair of {@link TestCase}s ths returns a variety of {@link TestCase}s
 * where both attributes appear with at most one other attribute.
 *
 * @param testCase The single-attribute {@link TestCase}(s).
 * @returns Various {@link TestCase}s with one or more attributes.
 */
export function withOtherAttributes(
  testCase: TestCase | [TestCase, TestCase],
): TestCase[] {
  if (Array.isArray(testCase)) {
    const [testCaseA, testCaseB] = testCase;
    return [
      {
        input: `${testCaseA.input} ${testCaseB.input}`,
        expected: `${testCaseA.expected} ${testCaseB.expected}`,
      },
      {
        input: `id="foobar" ${testCaseA.input} ${testCaseB.input}`,
        expected: `id="foobar" ${testCaseA.expected} ${testCaseB.expected}`,
      },
      {
        input: `disabled ${testCaseA.input} ${testCaseB.input}`,
        expected: `disabled ${testCaseA.expected} ${testCaseB.expected}`,
      },
      {
        input: `${testCaseA.input} class="foobar" ${testCaseB.input}`,
        expected: `${testCaseA.expected} class="foobar" ${testCaseB.expected}`,
      },
      {
        input: `${testCaseA.input} hidden ${testCaseB.input}`,
        expected: `${testCaseA.expected} hidden ${testCaseB.expected}`,
      },
      {
        input: `${testCaseA.input} ${testCaseB.input} width="42"`,
        expected: `${testCaseA.expected} ${testCaseB.expected} width="42"`,
      },
      {
        input: `${testCaseA.input} ${testCaseB.input} aria-hidden`,
        expected: `${testCaseA.expected} ${testCaseB.expected} aria-hidden`,
      },
    ];
  } else {
    return [
      {
        input: testCase.input,
        expected: testCase.expected,
      },
      {
        input: `id="foobar" ${testCase.input}`,
        expected: `id="foobar" ${testCase.expected}`,
      },
      {
        input: `disabled ${testCase.input}`,
        expected: `disabled ${testCase.expected}`,
      },
      {
        input: `${testCase.input} width="42"`,
        expected: `${testCase.expected} width="42"`,
      },
      {
        input: `${testCase.input} aria-hidden`,
        expected: `${testCase.expected} aria-hidden`,
      },
      {
        input: `id="foobar" ${testCase.input} width="42"`,
        expected: `id="foobar" ${testCase.expected} width="42"`,
      },
      {
        input: `disabled ${testCase.input} aria-hidden`,
        expected: `disabled ${testCase.expected} aria-hidden`,
      },
      {
        input: `disabled ${testCase.input} width="42"`,
        expected: `disabled ${testCase.expected} width="42"`,
      },
      {
        input: `id="foobar" ${testCase.input} aria-hidden`,
        expected: `id="foobar" ${testCase.expected} aria-hidden`,
      },
    ];
  }
}

