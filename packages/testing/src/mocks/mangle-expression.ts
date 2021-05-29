import type { SinonStub } from "sinon";

import * as sinon from "sinon";

/**
 * A counter used to make the return value of automatic stubs unique.
 */
let uniqueId = 0;

/**
 * A simple mock for _WebMangler_'s {@link MangleExpression} interface.
 *
 * @since v0.1.1
 * @version v0.1.4
 */
export default class MangleExpressionMock {
  /**
   * The `findAll` method of the mock.
   *
   * @since v0.1.3
   */
  public readonly findAll: SinonStub;

  /**
   * The `replaceAll` method of the mock.
   *
   * @since v0.1.1
   */
  public readonly replaceAll: SinonStub;

  /**
   * Create a new {@link MangleExpressionMock}. Optionally with specific
   * behaviour.
   *
   * @param [findAllStub] A {@link SinonStub} for the mock.
   * @param [replaceAllStub] A {@link SinonStub} for the mock.
   * @since v0.1.1
   * @deprecated Constructor will be replaced by one that accepts objects.
   */
  constructor(
    findAllStub?: SinonStub,
    replaceAllStub?: SinonStub,
  ) {
    this.findAll =
      MangleExpressionMock.getFindAllStub(findAllStub);
    this.replaceAll =
      MangleExpressionMock.getReplaceAllStub(replaceAllStub);
  }

  /**
   * Get the `findAll` {@link SinonStub} for an {@link MangleExpressionMock}
   * instance.
   *
   * @param [providedStub] The provided {@link SinonStub}, if any.
   * @returns A {@link SinonStub} for the `findAll` method.
   */
  private static getFindAllStub(providedStub?: SinonStub): SinonStub {
    if (providedStub) {
      return providedStub;
    }

    return sinon.stub().returns([uniqueId++]);
  }

  /**
   * Get the `replaceAll` {@link SinonStub} for an {@link MangleExpressionMock}
   * instance.
   *
   * @param [providedStub] The provided {@link SinonStub}, if any.
   * @returns A {@link SinonStub} for the `replaceAll` method.
   */
  private static getReplaceAllStub(providedStub?: SinonStub): SinonStub {
    if (providedStub) {
      return providedStub;
    }

    return sinon.stub().returns(uniqueId++);
  }
}
