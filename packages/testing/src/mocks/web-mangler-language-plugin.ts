import type { Stub } from "./types";

interface WebManglerLanguagePluginMockDependencies {
  createStub(): Stub;
}

/**
 * Initialize the {@link WebManglerLanguagePluginMock} class with explicit
 * dependencies.
 *
 * @param params The dependencies of the mock.
 * @param params.createStub A function to create a {@link Stub}.
 * @returns The {@link WebManglerLanguagePluginMock} class.
 */
function initWebManglerLanguagePluginMock({
  createStub,
}: WebManglerLanguagePluginMockDependencies) {
  return class WebManglerLanguagePluginMock {
    /**
     * The `getEmbeds` method of the mock.
     *
     * @since v0.1.4
     */
    public readonly getEmbeds: Stub;

    /**
     * The `getExpressions` method of the mock.
     *
     * @since v0.1.2
     */
    public readonly getExpressions: Stub;

    /**
     * The `getLanguages` method of the mock.
     *
     * @since v0.1.1
     */
    public readonly getLanguages: Stub;

    /**
     * Create a new {@link WebManglerLanguagePluginMock}. Optionally with
     * specific behaviour.
     *
     * @param [stubs] The {@link Stub}s for this mock.
     * @param [stubs.getEmbeds] A {@link Stub} for `getEmbeds`.
     * @param [stubs.getExpressions] A {@link Stub} for `getExpressions`.
     * @param [stubs.getLanguages] A {@link Stub} for `getLanguages`.
     * @since v0.1.5
     * @version v0.1.7
     */
    constructor(stubs?: {
      getEmbeds?: Stub;
      getExpressions?: Stub;
      getLanguages?: Stub;
    }) {
      this.getEmbeds = stubs?.getEmbeds || createStub().returns([]);
      this.getExpressions = stubs?.getExpressions || createStub().returns(
        new Map(),
      );
      this.getLanguages = stubs?.getLanguages || createStub().returns([]);
    }
  };
}

export default initWebManglerLanguagePluginMock;
