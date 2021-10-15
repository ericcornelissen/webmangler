import { expect } from "chai";

import {
  getReserved,
} from "../../reserved";

suite("HTML Attribute Mangler reserved helpers", function() {
  suite("::getReserved", function() {
    const ALWAYS_RESERVED: string[] = [
      "([0-9]|-|_).*",
    ];
    const DEFAULT_RESERVED: string[] = [];

    test("default reserved", function() {
      const _result = getReserved();
      const result = Array.from(_result);

      expect(result).to.include.members(ALWAYS_RESERVED);
      expect(result).to.include.members(DEFAULT_RESERVED);
      expect(result).to.have.length(
        ALWAYS_RESERVED.length + DEFAULT_RESERVED.length,
      );
    });

    test("custom reserved", function() {
      const reserved: string[] = ["foo", "bar"];

      const _result = getReserved(reserved);
      const result = Array.from(_result);

      expect(result).to.include.members(ALWAYS_RESERVED);
      expect(result).to.include.members(reserved);
      expect(result).to.have.length(ALWAYS_RESERVED.length + reserved.length);
    });
  });
});
