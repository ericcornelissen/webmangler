import * as sinon from "sinon";

export default {
  config: sinon.stub().returns([{ unique: "css-classes" }]),
  use: sinon.stub(),
};
