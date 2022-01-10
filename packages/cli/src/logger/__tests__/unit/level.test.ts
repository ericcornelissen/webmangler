import { expect } from "chai";

import {
  isDebug,
  isInfo,
  isSilent,
  isWarn,
} from "../../level";

suite("LogLevel", function() {
  test("isDebug", function() {
    const result = isDebug(-1);
    expect(result).to.equal(false);

    const result0 = isDebug(0);
    expect(result0).to.equal(false);

    const result1 = isDebug(1);
    expect(result1).to.equal(false);

    const result2 = isDebug(2);
    expect(result2).to.equal(true);
  });

  test("isInfo", function() {
    const result = isInfo(-1);
    expect(result).to.equal(false);

    const result0 = isInfo(0);
    expect(result0).to.equal(false);

    const result1 = isInfo(1);
    expect(result1).to.equal(true);

    const result2 = isInfo(2);
    expect(result2).to.equal(true);
  });

  test("isSilent", function() {
    const result = isSilent(-1);
    expect(result).to.equal(true);

    const result0 = isSilent(0);
    expect(result0).to.equal(false);

    const result1 = isSilent(1);
    expect(result1).to.equal(false);

    const result2 = isSilent(2);
    expect(result2).to.equal(false);
  });

  test("isWarn", function() {
    const result = isWarn(-1);
    expect(result).to.equal(false);

    const result0 = isWarn(0);
    expect(result0).to.equal(true);

    const result1 = isWarn(1);
    expect(result1).to.equal(true);

    const result2 = isWarn(2);
    expect(result2).to.equal(true);
  });
});
