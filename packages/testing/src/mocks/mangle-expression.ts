import type { Stub } from "./types";

import { getStubOrDefault } from "./common";

/**
 * A counter used to make the return value of automatic {@link Stub}s unique.
 */
let uniqueId = 0;

/**
 * A simple mock for _WebMangler_'s {@link MangleExpression} interface.
 *
 * @since v0.1.1
 * @version v0.1.5
 */
class MangleExpressionMock {
  /**
   * The `findAll` method of the mock.
   *
   * @since v0.1.3
   */
  public readonly findAll: Stub;

  /**
   * The `replaceAll` method of the mock.
   *
   * @since v0.1.1
   */
  public readonly replaceAll: Stub;

  /**
   * Create a new {@link MangleExpressionMock}. Optionally with specific
   * behaviour.
   *
   * @param [stubs] The {@link Stub}s for this mock.
   * @param [stubs.findAll] A {@link Stub} for `findAll`.
   * @param [stubs.replaceAll] A {@link Stub} for `replaceAll`.
   * @since v0.1.5
   */
  constructor(stubs?: {
    findAll?: Stub;
    replaceAll?: Stub;
  }) {
    this.findAll = getStubOrDefault([uniqueId++], stubs?.findAll);
    this.replaceAll = getStubOrDefault(uniqueId++, stubs?.replaceAll);
  }
}

export default MangleExpressionMock;
