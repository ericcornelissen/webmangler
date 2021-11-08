import {
  ALL_CHARS,
  ALL_LETTER_CHARS,
  ALL_LOWERCASE_CHARS,
  ALL_NUMBER_CHARS,
  ALL_UPPERCASE_CHARS,
} from "./characters";
import { providedOrDefault } from "./inputs";
import MultiManglerPlugin from "./multi-mangler.class";
import SimpleManglerPlugin from "./simple-mangler.class";

export {
  ALL_CHARS,
  ALL_LETTER_CHARS,
  ALL_LOWERCASE_CHARS,
  ALL_NUMBER_CHARS,
  ALL_UPPERCASE_CHARS,
  MultiManglerPlugin,
  providedOrDefault,
  SimpleManglerPlugin,
};

export type { SimpleManglerOptions } from "./simple-mangler.class";
