import * as sinon from "sinon";

export default {
  config: sinon.stub().returns([{ unique: "css-variable" }]),
  mangle: sinon.stub().returnsArg(1),
  use: sinon.stub(),
};
