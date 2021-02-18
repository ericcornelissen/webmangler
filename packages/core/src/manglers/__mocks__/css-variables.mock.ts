import * as sinon from "sinon";

export default {
  config: sinon.stub().returns([{ unique: "css-variable" }]),
  use: sinon.stub(),
};
