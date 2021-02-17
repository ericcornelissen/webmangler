import * as sinon from "sinon";

export default {
  config: sinon.stub().returns([{ unique: "html-ids" }]),
  mangle: sinon.stub().returnsArg(1),
  use: sinon.stub(),
};
