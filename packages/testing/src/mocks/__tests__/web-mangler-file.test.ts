import { expect } from "chai";

import WebManglerFileMock from "../web-mangler-file";

suite("WebManglerFileMock", function() {
  test("content", function() {
    const content = "foobar";
    const fileMock = new WebManglerFileMock("", content);
    expect(fileMock.content).to.equal(content);
  });

  test("type", function() {
    const type = "foobar";
    const fileMock = new WebManglerFileMock(type, "");
    expect(fileMock.type).to.equal(type);
  });
});
