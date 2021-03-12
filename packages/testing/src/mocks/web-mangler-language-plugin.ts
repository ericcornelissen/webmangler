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
 */
export default class WebManglerPluginLanguageMock {
  /**
   * The `getExpressionsFor` method of the mock.
   *
   * @since v0.1.1
   */
  public readonly getExpressionsFor: SinonStub;

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
   * @param [getExpressionsForStub] A {@link SinonStub} for the mock.
   * @param [getLanguagesStub] A {@link SinonStub} for the mock.
   * @since v0.1.1
   */
  constructor(
    getExpressionsForStub?: SinonStub,
    getLanguagesStub?: SinonStub,
  ) {
    this.getExpressionsFor =
      WebManglerPluginLanguageMock.getGetExpressionsStub(getExpressionsForStub);
    this.getLanguages =
      WebManglerPluginLanguageMock.getGetLanguagesStub(getLanguagesStub);
  }

  /**
   * Get the `getExpressionsFor` {@link SinonStub} for an {@link
   * WebManglerPluginLanguageMock} instance.
   *
   * @param [providedStub] The provided {@link SinonStub}, if any.
   * @returns A {@link SinonStub} for the `getExpressionsFor` method.
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
