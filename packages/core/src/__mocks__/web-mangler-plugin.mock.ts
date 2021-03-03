import type { WebManglerPlugin } from "../types";

import * as sinon from "sinon";

let uniqueId = 0;

export default class WebManglerPluginMock implements WebManglerPlugin {
  public readonly config: sinon.SinonStub;

  constructor(configStub?: sinon.SinonStub) {
    this.config = configStub || sinon.stub().returns({ id: uniqueId++ });
  }
}
