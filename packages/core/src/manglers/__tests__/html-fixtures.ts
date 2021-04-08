import type { TestCase } from "./types";

/**
 * A selection of {@link TestCase}s of attributes that should not change.
 */
export const UNCHANGING_ATTRIBUTES_TEST_SAMPLE: TestCase[] = [
  {
    input: "",
    expected: "",
    description: "no attributes",
  },
  {
    input: "disabled",
    expected: "disabled",
    description: "one valueless attribute",
  },
  {
    input: "alt=\"Lorem ipsum dolor\"",
    expected: "alt=\"Lorem ipsum dolor\"",
    description: "one valued attribute",
  },
  {
    input: "data-foobar",
    expected: "data-foobar",
    description: "one valueless data attribute",
  },
  {
    input: "data-foo=\"bar\"",
    expected: "data-foo=\"bar\"",
    description: "one valued data attribute",
  },
  {
    input: "aria-hidden disabled",
    expected: "aria-hidden disabled",
    description: "multiple valueless attributes",
  },
  {
    input: "height=\"36\" width=\"42\"",
    expected: "height=\"36\" width=\"42\"",
    description: "multiple valued attributes",
  },
  {
    input: "aria-hidden width=\"42\"",
    expected: "aria-hidden width=\"42\"",
    description: "one valueless and one valued attribute",
  },
  {
    input: "height=\"36\" disabled",
    expected: "height=\"36\" disabled",
    description: "one valued and one valueless attribute",
  },
];
