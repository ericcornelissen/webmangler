import type { SinonStub } from "sinon";

import type { Writer } from "../../types";

import * as sinon from "sinon";

/**
 * A standard mock class for the {@link Writer} interface.
 */
class WriterMock implements Writer {
  /**
   * The `write` method of the mock.
   */
  public readonly write: SinonStub;

  /**
   * Create a new {@link WriterMock}.
   *
   * @param [stubs] The stubs to be used by the mock.
   * @param [stubs.write] A stub for the `write` method.
   */
  constructor(stubs?: {
    write?: SinonStub;
  }) {
    this.write = stubs?.write || sinon.stub();
  }
}

export default WriterMock;
