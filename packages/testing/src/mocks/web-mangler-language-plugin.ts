import type { SinonStub } from "sinon";

import { getStubOrDefault } from "./common";

/**
 * A counter used to make the return value of automatic stubs unique.
 */
let uniqueId = 0;

/**
 * A simple mock for _WebMangler_'s {@link WebManglerPluginLanguage} interface.
 *
 * @since v0.1.1
 * @version v0.1.5
 * @deprecated Make sure you import this as "WebManglerLanguagePluginMock".
 */
export default class WebManglerLanguagePluginMock {
  /**
   * The `getEmbeds` method of the mock.
   *
   * @since v0.1.4
   */
  public readonly getEmbeds: SinonStub;

  /**
   * The `getExpressions` method of the mock.
   *
   * @since v0.1.2
   */
  public readonly getExpressions: SinonStub;

  /**
   * The `getLanguages` method of the mock.
   *
   * @since v0.1.1
   */
  public readonly getLanguages: SinonStub;

  /**
   * Create a new {@link WebManglerLanguagePluginMock}. Optionally with specific
   * behaviour.
   *
   * @param [stubs] The stubs for this mock.
   * @param [stubs.getEmbeds] A {@link SinonStub} for `getEmbeds`.
   * @param [stubs.getExpressions] A {@link SinonStub} for `getExpressions`.
   * @param [stubs.getLanguages] A {@link SinonStub} for `getLanguages`.
   * @since v0.1.5
   */
  constructor(stubs?: {
    getEmbeds?: SinonStub,
    getExpressions?: SinonStub,
    getLanguages?: SinonStub,
  }) {
    this.getEmbeds = getStubOrDefault([uniqueId++], stubs?.getEmbeds);
    this.getExpressions = getStubOrDefault(
      new Map([[uniqueId++, uniqueId++]]),
      stubs?.getExpressions,
    );
    this.getLanguages = getStubOrDefault([uniqueId++], stubs?.getLanguages);
  }
}
