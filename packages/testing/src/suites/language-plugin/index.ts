import { newCheckAll } from "../utils";
import { checkConstructor } from "./constructor";
import {
  checkGetEmbeds,
  checkGetExpressions,
  checkGetLanguages,
} from "./methods";

/**
 * Check the validity of a {@link WebManglerLanguagePlugin}.
 *
 * @example
 * const [valid, msg] = checkWebManglerLanguagePlugin(Plugin);
 * expect(valid, msg).to.be.true;
 * @param Plugin The {@link WebManglerLanguagePlugin} to test.
 * @returns A boolean value indicating validity and an optional message.
 */
const checkWebManglerLanguagePlugin = newCheckAll([
  checkConstructor,
  checkGetEmbeds,
  checkGetExpressions,
  checkGetLanguages,
]);

export default checkWebManglerLanguagePlugin;
