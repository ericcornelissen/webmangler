/**
 * A simple mock for _WebMangler_'s {@link WebManglerFile} interface.
 *
 * @since v0.1.1
 * @deprecated Mock will be removed as it has no functionality.
 */
export default class WebManglerFileMock {
  /**
   * The content of the {@link WebManglerFileMock}.
   *
   * @since v0.1.1
   */
  public content: string;

  /**
   * The type of the {@link WebManglerFileMock}.
   *
   * @since v0.1.1
   */
  public readonly type: string;

  /**
   * Create a new {@link WebManglerFileMock} with specific values.
   *
   * @param type The type for the {@link WebManglerFileMock}.
   * @param content The content for the {@link WebManglerFileMock}.
   * @since v0.1.1
   */
  constructor(type: string, content: string) {
    this.content = content;
    this.type = type;
  }
}
