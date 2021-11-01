import type { WebManglerPlugin } from "@webmangler/types";

import { WebManglerPluginMock } from "@webmangler/testing";
import { expect, use as chaiUse } from "chai";
import * as sinonChai from "sinon-chai";

import MultiManglerPlugin from "../../multi-mangler.class";

chaiUse(sinonChai);

class ConcreteMultiManglerPlugin extends MultiManglerPlugin {
  constructor(plugins: WebManglerPlugin[]) {
    super(plugins);
  }
}

suite("MultiManglerPlugin", function() {
  test("one plugin", function() {
    const subPlugin = new WebManglerPluginMock();

    const plugin = new ConcreteMultiManglerPlugin([subPlugin]);
    plugin.options();

    expect(subPlugin.options).to.have.callCount(1);
  });

  test("multiple plugins", function() {
    const subPluginA = new WebManglerPluginMock();
    const subPluginB = new WebManglerPluginMock();
    const plugins = [subPluginA, subPluginB];

    const plugin = new ConcreteMultiManglerPlugin(plugins);
    plugin.options();

    for (const subPlugin of plugins) {
      expect(subPlugin.options).to.have.callCount(1);
    }
  });
});
