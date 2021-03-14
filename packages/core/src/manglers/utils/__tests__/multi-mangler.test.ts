import type { WebManglerPlugin } from "../../../types";

import { WebManglerPluginMock } from "@webmangler/testing";
import { expect, use as chaiUse } from "chai";
import * as sinonChai from "sinon-chai";

import MultiMangler from "../multi-mangler.class";

chaiUse(sinonChai);

class ConcreteMultiMangler extends MultiMangler {
  constructor(plugins: WebManglerPlugin[]) {
    super(plugins);
  }
}

suite("MultiMangler", function() {
  test("one plugin", function() {
    const subPlugin = new WebManglerPluginMock();

    const plugin = new ConcreteMultiMangler([subPlugin]);
    plugin.options();

    expect(subPlugin.options).to.have.callCount(1);
  });

  test("multiple plugins", function() {
    const subPluginA = new WebManglerPluginMock();
    const subPluginB = new WebManglerPluginMock();
    const plugins = [subPluginA, subPluginB];

    const plugin = new ConcreteMultiMangler(plugins);
    plugin.options();

    for (const subPlugin of plugins) {
      expect(subPlugin.options).to.have.callCount(1);
    }
  });
});
