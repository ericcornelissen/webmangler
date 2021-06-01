import type { SinonStub } from "sinon";

import * as sinon from "sinon";

/**
 * A counter used to make the return value of automatic stubs unique.
 */
let uniqueId = 0;

/**
 * A simple mock for _WebMangler_'s {@link WebManglerPluginLanguage} interface.
 *
 * @since v0.1.1
 * @version v0.1.5
 */
export default class WebManglerPluginLanguageMock {
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
   * Create a new {@link WebManglerPluginLanguageMock}. Optionally with specific
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
    this.getEmbeds =
      WebManglerPluginLanguageMock.getGetEmbedsStub(stubs?.getEmbeds);
    this.getExpressions =
      WebManglerPluginLanguageMock.getGetExpressionsStub(stubs?.getExpressions);
    this.getLanguages =
      WebManglerPluginLanguageMock.getGetLanguagesStub(stubs?.getLanguages);
  }

  /**
   * Get the `getEmbeds` {@link SinonStub} for an {@link
   * WebManglerPluginLanguageMock} instance.
   *
   * @param [providedStub] The provided {@link SinonStub}, if any.
   * @returns A {@link SinonStub} for the `getEmbeds` method.
   */
  private static getGetEmbedsStub(providedStub?: SinonStub): SinonStub {
    if (providedStub) {
      return providedStub;
    }

    return sinon.stub().returns([uniqueId++]);
  }

  /**
   * Get the `getExpressions` {@link SinonStub} for an {@link
   * WebManglerPluginLanguageMock} instance.
   *
   * @param [providedStub] The provided {@link SinonStub}, if any.
   * @returns A {@link SinonStub} for the `getExpressions` method.
   */
  private static getGetExpressionsStub(providedStub?: SinonStub): SinonStub {
    if (providedStub) {
      return providedStub;
    }

    const map = new Map();
    map.set(uniqueId++, uniqueId++);

    return sinon.stub().returns(map);
  }

  /**
   * Get the `getLanguages` {@link SinonStub} for an {@link
   * WebManglerPluginLanguageMock} instance.
   *
   * @param [providedStub] The provided {@link SinonStub}, if any.
   * @returns A {@link SinonStub} for the `getLanguages` method.
   */
  private static getGetLanguagesStub(providedStub?: SinonStub): SinonStub {
    if (providedStub) {
      return providedStub;
    }

    return sinon.stub().returns([uniqueId++]);
  }
}
