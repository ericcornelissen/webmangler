import type { WebManglerEmbed, WebManglerFile } from "@webmangler/types";

interface TestCase {
  file: Readonly<WebManglerFile>;
  expected: ReadonlyArray<WebManglerEmbed>;
}

export type {
  TestCase,
};
