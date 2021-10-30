import type { Stub } from "./types";

import { getStubOrDefault } from "./common";

/**
 * A counter used to make the return value of automatic {@link Stub}s unique.
 */
let uniqueId = 0;

/**
 * A simple mock for _WebMangler_'s {@link WebManglerPlugin} interface.
 *
 * @since v0.1.1
 * @version v0.1.5
 */
class WebManglerPluginMock {
  /**
   * The `options` method of the mock.
   *
   * @since v0.1.1
   */
  public readonly options: Stub;

  /**
   * Create a new {@link WebManglerPluginMock}. Optionally with specific
   * behaviour.
   *
   * @param [stubs] The {@link Stub}s for this mock.
   * @param [stubs.options] A {@link Stub} for `options`.
   * @since v0.1.5
   */
  constructor(stubs?: {
    options?: Stub;
  }) {
    this.options = getStubOrDefault({ id: uniqueId++ }, stubs?.options);
  }
}

export default WebManglerPluginMock;
