import type { Stub } from "./types";

interface WebManglerPluginMockDependencies {
  createStub(): Stub;
}

/**
 * Initialize the {@link WebManglerPluginMock} class with explicit dependencies.
 *
 * @param params The dependencies of the mock.
 * @param params.createStub A function to create a {@link Stub}.
 * @returns The {@link WebManglerPluginMock} class.
 */
function initWebManglerPluginMock({
  createStub,
}: WebManglerPluginMockDependencies) {
  let id = 0;
  return class WebManglerPluginMock {
    /**
     * The `options` method of the mock.
     *
     * @since v0.1.1
     */
    public readonly options: Stub;

    /**
     * Create a new {@link WebManglerPluginMock}. Optionally with specific
     * behaviour.
     *
     * @param [stubs] The {@link Stub}s for this mock.
     * @param [stubs.options] A {@link Stub} for `options`.
     * @since v0.1.5
     */
    constructor(stubs?: {
      options?: Stub;
    }) {
      this.options = stubs?.options || createStub().returns({ id: id++ });
    }
  };
}

export default initWebManglerPluginMock;

