import type { SinonStub } from "sinon";

import type { WebManglerLanguagePlugin } from "../types";

import * as sinon from "sinon";

let uniqueId = 0;

export default class WebManglerPluginLanguageMock
    implements WebManglerLanguagePlugin {
  public readonly getExpressionsFor: SinonStub;
  public readonly getLanguages: SinonStub;

  constructor(
    getExpressionsForStub?: SinonStub,
    getLanguagesStub?: SinonStub,
  ) {
    this.getExpressionsFor =
      WebManglerPluginLanguageMock.getGetExpressionsStub(getExpressionsForStub);
    this.getLanguages =
      WebManglerPluginLanguageMock.getGetLanguagesStub(getLanguagesStub);
  }

  private static getGetExpressionsStub(providedStub?: SinonStub): SinonStub {
    if (providedStub) {
      return providedStub;
    }

    const map = new Map();
    map.set(uniqueId++, uniqueId++);

    return sinon.stub().returns(map);
  }

  private static getGetLanguagesStub(providedStub?: SinonStub): SinonStub {
    if (providedStub) {
      return providedStub;
    }

    return sinon.stub().returns([uniqueId++]);
  }
}
