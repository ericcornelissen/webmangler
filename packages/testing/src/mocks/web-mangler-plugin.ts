import type { SinonStub } from "sinon";

import * as sinon from "sinon";

/**
 * A counter used to make the return value of automatic stubs unique.
 */
let uniqueId = 0;

/**
 * A simple mock for _WebMangler_'s {@link WebManglerPlugin} interface.
 *
 * @since v0.1.1
 */
export default class WebManglerPluginMock {
  /**
   * The `options` method of the mock.
   *
   * @since v0.1.1
   */
  public readonly options: SinonStub;

  /**
   * Create a new {@link WebManglerPluginMock}. Optionally with specific
   * behaviour.
   *
   * @param [optionsStub] A {@link SinonStub} for the mock.
   * @since v0.1.1
   */
  constructor(optionsStub?: SinonStub) {
    this.options = WebManglerPluginMock.getOptionsStub(optionsStub);
  }

  /**
   * Get the `options` {@link SinonStub} for an {@link WebManglerPluginMock}
   * instance.
   *
   * @param [providedStub] The provided {@link SinonStub}, if any.
   * @returns A {@link SinonStub} for the `options` method.
   */
  private static getOptionsStub(providedStub?: SinonStub): SinonStub {
    if (providedStub) {
      return providedStub;
    }

    return sinon.stub().returns({ id: uniqueId++ });
  }
}
