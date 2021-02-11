import type { Writer } from "../types";

import * as sinon from "sinon";

export default class LoggerMock {
  readonly debug: Writer = sinon.fake();
  readonly info: Writer = sinon.fake();
  readonly warn: Writer = sinon.fake();
}
