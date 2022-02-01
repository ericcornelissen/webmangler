import type { Stub } from "./types";

interface MangleExpressionMockDependencies {
  createStub(): Stub;
}

/**
 * Initialize the {@link MangleExpressionMock} class with explicit dependencies.
 *
 * @param params The dependencies of the mock.
 * @param params.createStub A function to create a {@link Stub}.
 * @returns The {@link MangleExpressionMock} class.
 */
function initMangleExpressionMock({
  createStub,
}: MangleExpressionMockDependencies) {
  return class MangleExpressionMock {
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
     * @version v0.1.7
     */
    constructor(stubs?: {
      findAll?: Stub;
      replaceAll?: Stub;
    }) {
      this.findAll = stubs?.findAll || createStub().returns([]);
      this.replaceAll = stubs?.replaceAll || createStub().returns("");
    }
  };
}

export default initMangleExpressionMock;
