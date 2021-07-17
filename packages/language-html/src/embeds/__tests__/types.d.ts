import type { WebManglerEmbed, WebManglerFile } from "@webmangler/types";

export type TestCase = {
  file: WebManglerFile;
  expected: WebManglerEmbed[];
}
