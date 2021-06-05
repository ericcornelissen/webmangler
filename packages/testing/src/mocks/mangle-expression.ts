import type { SinonStub } from "sinon";

import { getStubOrDefault } from "./common";

/**
 * A counter used to make the return value of automatic stubs unique.
 */
let uniqueId = 0;

/**
 * A simple mock for _WebMangler_'s {@link MangleExpression} interface.
 *
 * @since v0.1.1
 * @version v0.1.5
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
   * @param [stubs] The stubs for this mock.
   * @param [stubs.findAll] A {@link SinonStub} for `findAll`.
   * @param [stubs.replaceAll] A {@link SinonStub} for `replaceAll`.
   * @since v0.1.5
   */
  constructor(stubs?: {
    findAll?: SinonStub,
    replaceAll?: SinonStub,
  }) {
    this.findAll = getStubOrDefault([uniqueId++], stubs?.findAll);
    this.replaceAll = getStubOrDefault(uniqueId++, stubs?.replaceAll);
  }
}
