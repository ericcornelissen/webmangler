import type { TestCase } from "./types";

/**
 * A list of standard (non self-closing) HTML tags.
 */
export const STANDARD_TAGS: string[] = [
  "div",
  "header",
  "p",
];

/**
 * A list of standard self-closing HTML tags.
 */
export const SELF_CLOSING_TAGS: string[] = [
  "img",
  "input",
];

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
