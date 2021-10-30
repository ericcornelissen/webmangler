import type { Stub } from "./types";

import { getStubOrDefault } from "./common";

/**
 * A counter used to make the return value of automatic {@link Stub}s unique.
 */
let uniqueId = 0;

/**
 * A simple mock for _WebMangler_'s {@link WebManglerPluginLanguage} interface.
 *
 * @since v0.1.5
 */
class WebManglerLanguagePluginMock {
  /**
   * The `getEmbeds` method of the mock.
   *
   * @since v0.1.4
   */
  public readonly getEmbeds: Stub;

  /**
   * The `getExpressions` method of the mock.
   *
   * @since v0.1.2
   */
  public readonly getExpressions: Stub;

  /**
   * The `getLanguages` method of the mock.
   *
   * @since v0.1.1
   */
  public readonly getLanguages: Stub;

  /**
   * Create a new {@link WebManglerLanguagePluginMock}. Optionally with specific
   * behaviour.
   *
   * @param [stubs] The {@link Stub}s for this mock.
   * @param [stubs.getEmbeds] A {@link Stub} for `getEmbeds`.
   * @param [stubs.getExpressions] A {@link Stub} for `getExpressions`.
   * @param [stubs.getLanguages] A {@link Stub} for `getLanguages`.
   * @since v0.1.5
   */
  constructor(stubs?: {
    getEmbeds?: Stub;
    getExpressions?: Stub;
    getLanguages?: Stub;
  }) {
    this.getEmbeds = getStubOrDefault([uniqueId++], stubs?.getEmbeds);
    this.getExpressions = getStubOrDefault(
      new Map([[uniqueId++, uniqueId++]]),
      stubs?.getExpressions,
    );
    this.getLanguages = getStubOrDefault([uniqueId++], stubs?.getLanguages);
  }
}

export default WebManglerLanguagePluginMock;
