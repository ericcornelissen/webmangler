import type { Stub } from "./types";

import * as sinon from "sinon";

/**
 * Get a "default" {@link Stub} that returns a specific value, or get a specific
 * {@link Stub} in case it is provided.
 *
 * @param defaultReturnValue The return value of the "default" {@link Stub}.
 * @param [stub] The {@link Stub} to return in case it is provided.
 * @returns The provided `stub` or a default {@link Stub}.
 */
function getStubOrDefault(
  defaultReturnValue: unknown,
  stub?: Stub,
): Stub {
  if (stub) {
    return stub;
  }

  return sinon.stub().returns(defaultReturnValue);
}

export {
  getStubOrDefault,
};
