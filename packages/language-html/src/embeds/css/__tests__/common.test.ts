import { expect } from "chai";

import * as common from "../common";

suite("HTML CSS Embeds - Common", function() {
  test("embed type", function() {
    expect(common.EMBED_TYPE).to.equal("css");
  });
});
