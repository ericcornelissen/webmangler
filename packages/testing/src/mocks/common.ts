import type { SinonStub } from "sinon";

import * as sinon from "sinon";

/**
 * Get a "default" stub that returns a specific value, or get a specific stub in
 * case it is provided.
 *
 * @param defaultReturnValue The value to be returned by the "default" stub.
 * @param [stub] The stub to return in case it is provided.
 * @returns The provided `stub` or a stub returning `defaultReturnValue`.
 */
export function getStubOrDefault(
  defaultReturnValue: unknown,
  stub?: SinonStub,
): SinonStub {
  if (stub) {
    return stub;
  }

  return sinon.stub().returns(defaultReturnValue);
}
