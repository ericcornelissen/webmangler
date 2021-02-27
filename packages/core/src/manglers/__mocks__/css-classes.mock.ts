import * as sinon from "sinon";

export default {
  config: sinon.stub().returns([{ unique: "css-classes" }]),
  options: sinon.stub().returns([{ unique: "css-classes" }]),
};
