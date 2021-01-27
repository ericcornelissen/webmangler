import * as sinon from "sinon";

export default class ManglerMatchMock {
  getMatchedStr: sinon.SinonStub;
  getGroup: sinon.SinonStub;
  getNamedGroup: sinon.SinonStub;

  constructor() {
    this.getMatchedStr = sinon.stub();
    this.getGroup = sinon.stub();
    this.getNamedGroup = sinon.stub();
  }
}
