import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { newGetConfiguration } from "../../loader";

chaiUse(sinonChai);

suite("Configuration loader", function() {
  let getConfiguration: ReturnType<typeof newGetConfiguration>;

  let newLoader: SinonStub;
  let loader: {
    readonly load: SinonStub;
    readonly search: SinonStub;
  };

  suiteSetup(function() {
    newLoader = sinon.stub();
    loader = {
      load: sinon.stub(),
      search: sinon.stub(),
    };

    newLoader.returns(loader);

    getConfiguration = newGetConfiguration(newLoader);
  });

  suite("With a configuration path", function() {
    const errorExpr = /^No configuration file found at/;
    const configPath = "./webmangler.config.js";

    setup(function() {
      loader.load.reset();
    });

    test("configuration file exists and is not empty", function() {
      const config = { foo: "bar" };

      loader.load.returns({
        isEmpty: false,
        config: config,
      });

      const result = getConfiguration(configPath);
      expect(result).to.equal(config);
    });

    test("configuration file exist but is empty", function() {
      loader.load.returns({
        isEmpty: true,
      });

      expect(() => getConfiguration(configPath)).to.throw(errorExpr);
    });

    test("configuration file does not exist", function() {
      loader.load.returns(null);

      expect(() => getConfiguration(configPath)).to.throw(errorExpr);
    });
  });

  suite("Without a configuration path", function() {
    const config = { foo: "bar" };

    setup(function() {
      loader.search.reset();
    });

    test("a default config exists and is not empty", function() {
      loader.search.returns({
        isEmpty: false,
        config: config,
      });

      const result = getConfiguration(undefined);
      expect(result).to.equal(config);
    });

    test("a default config exists but is empty", function() {
      loader.search.returns({
        isEmpty: true,
        config: config,
      });

      const result = getConfiguration(undefined);
      expect(result).not.to.equal(config);
    });

    test("no default config exists", function() {
      loader.search.returns(null);

      const result = getConfiguration(undefined);
      expect(result).not.to.be.null;
    });
  });
});
