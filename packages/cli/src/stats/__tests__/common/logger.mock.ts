import type { SinonSpy } from "sinon";

import type { Logger, Writer } from "../../../logger";

import * as sinon from "sinon";

class LoggerMock implements Logger {
  readonly debug: Writer;
  readonly info: Writer;
  readonly print: Writer;
  readonly warn: Writer;

  constructor() {
    this.debug = sinon.fake();
    this.info = sinon.fake();
    this.print = sinon.fake();
    this.warn = sinon.fake();
  }

  resetHistory(): void {
    (this.debug as SinonSpy).resetHistory();
    (this.info as SinonSpy).resetHistory();
    (this.print as SinonSpy).resetHistory();
    (this.warn as SinonSpy).resetHistory();
  }
}

export default LoggerMock;
