import type { MangleOptions, WebManglerPlugin } from "@webmangler/types";
import type { SinonStub } from "sinon";

import { WebManglerPluginMock } from "@webmangler/testing";
import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import initMultiManglerPlugin from "../../multi-mangler.class";

chaiUse(sinonChai);

suite("MultiManglerPlugin", function() {
  let createMultiManglerPlugin: (
    options: Iterable<WebManglerPlugin>,
  ) => WebManglerPlugin;

  let toArrayIfNeeded: SinonStub;

  suiteSetup(function() {
    toArrayIfNeeded = sinon.stub();

    const MultiManglerPlugin = initMultiManglerPlugin({
      toArrayIfNeeded,
    });

    class ConcreteMultiManglerPlugin extends MultiManglerPlugin {
      constructor(options: Iterable<WebManglerPlugin>) {
        super(options);
      }
    }

    createMultiManglerPlugin = (options: Iterable<WebManglerPlugin>) => {
      return new ConcreteMultiManglerPlugin(options);
    };
  });

  setup(function() {
    toArrayIfNeeded.resetHistory();
  });

  suite("Zero plugins", function() {
    let subject: WebManglerPlugin;

    suiteSetup(function() {
      toArrayIfNeeded.returns([]);
    });

    setup(function() {
      subject = createMultiManglerPlugin([]);
    });

    test("the use of `toArrayIfNeeded`", function() {
      expect(toArrayIfNeeded).to.have.callCount(0);
    });

    test("the value returned by `.options`", function() {
      const allOptions = subject.options() as Iterable<MangleOptions>;
      const result = Array.from(allOptions);
      expect(result).to.have.lengthOf(0);
    });
  });

  suite("One plugin", function() {
    let subject: WebManglerPlugin;

    let subPlugin: WebManglerPlugin;
    let subPluginOptionsStub: SinonStub;
    const subPluginOptions = {
      foo: "bar",
    };

    suiteSetup(function() {
      toArrayIfNeeded.returns([subPluginOptions]);

      subPluginOptionsStub = sinon.stub();
      subPluginOptionsStub.returns(subPluginOptions);
      subPlugin = new WebManglerPluginMock({
        options: subPluginOptionsStub,
      });
    });

    setup(function() {
      subPluginOptionsStub.resetHistory();

      subject = createMultiManglerPlugin([subPlugin]);
    });

    test("the use of the provided plugin", function() {
      expect(subPluginOptionsStub).to.have.callCount(1);
    });

    test("the use of `toArrayIfNeeded`", function() {
      expect(toArrayIfNeeded).to.have.callCount(1);
      expect(toArrayIfNeeded).to.have.been.calledWithExactly(subPluginOptions);
    });

    test("the value returned by `.options`", function() {
      const allOptions = subject.options() as Iterable<MangleOptions>;
      const result = Array.from(allOptions);
      expect(result).to.have.lengthOf(1);
      expect(result).to.deep.equal([subPluginOptions]);
    });
  });

  suite("Multiple plugins", function() {
    let subject: WebManglerPlugin;

    let subPluginA: WebManglerPlugin;
    let subPluginAOptionsStub: SinonStub;
    const subPluginAOptions = {
      foo: "bar",
    };

    let subPluginB: WebManglerPlugin;
    let subPluginBOptionsStub: SinonStub;
    const subPluginBOptions = {
      foo: "bar",
    };

    suiteSetup(function() {
      subPluginAOptionsStub = sinon.stub();
      subPluginAOptionsStub.returns(subPluginAOptions);
      subPluginA = new WebManglerPluginMock({
        options: subPluginAOptionsStub,
      });

      subPluginBOptionsStub = sinon.stub();
      subPluginBOptionsStub.returns(subPluginBOptions);
      subPluginB = new WebManglerPluginMock({
        options: subPluginBOptionsStub,
      });

      toArrayIfNeeded.onFirstCall().returns([subPluginAOptions]);
      toArrayIfNeeded.onSecondCall().returns([subPluginBOptions]);
    });

    setup(function() {
      subPluginAOptionsStub.resetHistory();

      subject = createMultiManglerPlugin([
        subPluginA,
        subPluginB,
      ]);
    });

    test("the use of the provided plugins", function() {
      expect(subPluginAOptionsStub).to.have.callCount(1);
      expect(subPluginBOptionsStub).to.have.callCount(1);
    });

    test("the use of `toArrayIfNeeded`", function() {
      expect(toArrayIfNeeded).to.have.callCount(2);
      expect(toArrayIfNeeded).to.have.been.calledWithExactly(subPluginAOptions);
      expect(toArrayIfNeeded).to.have.been.calledWithExactly(subPluginBOptions);
    });

    test("the value returned by `.options`", function() {
      const allOptions = subject.options() as Iterable<MangleOptions>;
      const result = Array.from(allOptions);
      expect(result).to.have.lengthOf(2);
      expect(result).to.deep.include(subPluginAOptions);
      expect(result).to.deep.include(subPluginBOptions);
    });
  });
});
