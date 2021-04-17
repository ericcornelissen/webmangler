import type { SinonSpy } from "sinon";

import type { Logger, Writer } from "../types";

import * as sinon from "sinon";

export default class LoggerMock implements Logger {
  readonly debug: Writer = sinon.fake();
  readonly info: Writer = sinon.fake();
  readonly print: Writer = sinon.fake();
  readonly warn: Writer = sinon.fake();

  resetHistory(): void {
    (this.debug as SinonSpy).resetHistory();
    (this.info as SinonSpy).resetHistory();
    (this.print as SinonSpy).resetHistory();
    (this.warn as SinonSpy).resetHistory();
  }
}
