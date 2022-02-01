import type { WebManglerEmbed, WebManglerFile } from "@webmangler/types";

interface TestCase {
  file: WebManglerFile;
  expected: WebManglerEmbed[];
}

export type {
  TestCase,
};
