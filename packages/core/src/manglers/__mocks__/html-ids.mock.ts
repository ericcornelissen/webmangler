import * as sinon from "sinon";

export default {
  config: sinon.stub().returns({}),
  mangle: sinon.stub().callsFake((_, x) => x),
  use: sinon.stub(),
};
