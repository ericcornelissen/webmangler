import type { WebManglerEmbed, WebManglerFile } from "../../../../types";

export type TestCase = {
  file: WebManglerFile;
  expected: WebManglerEmbed[];
}
