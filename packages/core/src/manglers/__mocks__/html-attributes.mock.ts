import * as sinon from "sinon";

export default {
  config: sinon.stub().returns([{ unique: "html-attributes" }]),
  use: sinon.stub(),
};
