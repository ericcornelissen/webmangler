import * as sinon from "sinon";

export default {
  config: sinon.stub().returns([{ unique: "html-ids" }]),
  options: sinon.stub().returns([{ unique: "html-ids" }]),
};
