import { expect } from "chai";
import * as sinon from "sinon";
import * as cosmiconfig from "cosmiconfig";

import { DEFAULT_CONFIG_PATHS } from "../constants";
import { DEFAULT_CONFIG } from "../default";
import { getConfiguration } from "../loader";

suite("Configuration loader", function() {
  let cosmiconfigStub: sinon.SinonStub;
  let cosmiconfigLoadStub: sinon.SinonStub;
  let cosmiconfigSearchStub: sinon.SinonStub;

  suiteSetup(function() {
    cosmiconfigStub = sinon.stub(cosmiconfig, "cosmiconfigSync");
    cosmiconfigStub.callsFake(() => {
      return {
        load: cosmiconfigLoadStub,
        search: cosmiconfigSearchStub,
      };
    });
  });

  suite("With configPath", function() {
    const configPath = "./webmangler.config.js";

    setup(function() {
      cosmiconfigLoadStub = sinon.stub();
    });

    test("configuration file exists and is not empty", function() {
      const config = { foo: "bar" };

      cosmiconfigLoadStub.returns({
        filepath: configPath,
        config: config,
      });

      const result = getConfiguration(configPath);
      expect(result).to.equal(config);
    });

    test("configuration file exist but is empty", function() {
      cosmiconfigLoadStub.returns({
        isEmpty: true,
        filepath: configPath,
      });

      expect(() => getConfiguration(configPath)).to.throw();
    });

    test("configuration file does not exist", function() {
      cosmiconfigLoadStub.returns(null);

      expect(() => getConfiguration(configPath)).to.throw();
    });
  });

  suite("Without configPath", function() {
    setup(function() {
      cosmiconfigSearchStub = sinon.stub();
    });

    for (const filePath of DEFAULT_CONFIG_PATHS) {
      test(`${filePath} exists and is not empty`, function() {
        const config = { foo: "bar" };

        cosmiconfigSearchStub.returns({
          filepath: filePath,
          config: config,
        });

        const result = getConfiguration(undefined);
        expect(result).to.equal(config);
      });

      test(`${filePath} exists but is empty`, function() {
        cosmiconfigSearchStub.returns({
          isEmpty: true,
          filepath: filePath,
        });

        const result = getConfiguration(undefined);
        expect(result).to.equal(DEFAULT_CONFIG);
      });

      test(`${filePath} does not exist`, function() {
        cosmiconfigSearchStub.returns(null);

        const result = getConfiguration(undefined);
        expect(result).to.equal(DEFAULT_CONFIG);
      });
    }
  });

  suiteTeardown(function() {
    cosmiconfigStub.restore();
  });
});
