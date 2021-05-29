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
 * @version v0.1.4
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
   * @param [getExpressionsStub] A {@link SinonStub} for the mock.
   * @param [getLanguagesStub] A {@link SinonStub} for the mock.
   * @param [getEmbedsStub] A {@link SinonStub} for the mock.
   * @since v0.1.1
   * @version v0.1.4
   * @deprecated Constructor will be replaced by one that accepts objects.
   */
  constructor(
    getExpressionsStub?: SinonStub,
    getLanguagesStub?: SinonStub,
    getEmbedsStub?: SinonStub,
  ) {
    this.getEmbeds =
      WebManglerPluginLanguageMock.getGetEmbedsStub(getEmbedsStub);
    this.getExpressions =
      WebManglerPluginLanguageMock.getGetExpressionsStub(getExpressionsStub);
    this.getLanguages =
      WebManglerPluginLanguageMock.getGetLanguagesStub(getLanguagesStub);
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
