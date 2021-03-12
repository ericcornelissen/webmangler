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
 */
export default class MangleExpressionMock {
  /**
   * The `exec` method of the mock.
   *
   * @since v0.1.1
   */
  public readonly exec: SinonStub;

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
   * @param [execStub] A {@link SinonStub} for the mock.
   * @param [replaceAllStub] A {@link SinonStub} for the mock.
   * @since v0.1.1
   */
  constructor(
    execStub?: SinonStub,
    replaceAllStub?: SinonStub,
  ) {
    this.exec =
      MangleExpressionMock.getExecStub(execStub);
    this.replaceAll =
      MangleExpressionMock.getReplaceAllStub(replaceAllStub);
  }

  /**
   * Get the `exec` {@link SinonStub} for an {@link MangleExpressionMock}
   * instance.
   *
   * @param [providedStub] The provided {@link SinonStub}, if any.
   * @returns A {@link SinonStub} for the `exec` method.
   */
  private static getExecStub(providedStub?: SinonStub): SinonStub {
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
