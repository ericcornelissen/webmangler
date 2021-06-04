import type { SinonStub } from "sinon";

import { expect } from "chai";
import * as sinon from "sinon";

import { getStubOrDefault } from "../common";

suite("Mocks common", function() {
  suite("::getStubOrDefault", function() {
    test("default stub", function() {
      const value = "foobar";
      const stub = getStubOrDefault(value);

      const result = stub();
      expect(result).to.equal(value);
    });

    test("custom stub", function() {
      const stub: SinonStub = sinon.stub();
      const result = getStubOrDefault("foobar", stub);
      expect(result).to.equal(stub);
    });
  });
});
