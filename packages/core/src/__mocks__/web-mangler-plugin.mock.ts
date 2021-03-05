import type { SinonStub } from "sinon";

import type { WebManglerPlugin } from "../types";

import * as sinon from "sinon";

let uniqueId = 0;

export default class WebManglerPluginMock implements WebManglerPlugin {
  public readonly options: SinonStub;

  constructor(optionsStub?: SinonStub) {
    this.options = WebManglerPluginMock.getOptionsStub(optionsStub);
  }

  private static getOptionsStub(providedStub?: SinonStub): SinonStub {
    if (providedStub) {
      return providedStub;
    }

    return sinon.stub().returns({ id: uniqueId++ });
  }
}
