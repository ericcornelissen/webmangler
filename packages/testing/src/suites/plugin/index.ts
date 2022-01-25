import { newCheckAll } from "../utils";
import { checkConstructor } from "./constructor";
import { checkOptions } from "./methods";

/**
 * Check the validity of a {@link WebManglerPlugin}.
 *
 * @example
 * const [valid, msg] = checkWebManglerPlugin(Plugin);
 * expect(valid, msg).to.be.true;
 * @param Plugin The {@link WebManglerLanguagePlugin} to test.
 * @returns A boolean value indicating validity and an optional message.
 */
const checkWebManglerPlugin = newCheckAll([
  checkConstructor,
  checkOptions,
]);

export default checkWebManglerPlugin;
