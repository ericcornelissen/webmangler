import * as sinon from "sinon";

export default {
  mangle: sinon.stub().callsFake((_, x) => x),
  use: sinon.stub(),
};
