import * as sinon from "sinon";

const existsSync = sinon.stub().returns(false);
const lstatSync = sinon.stub().returns({ isFile: () => true });
const readFileSync = sinon.stub().returns({ toString: () => "" });
const readdirSync = sinon.stub().returns([]);
const writeFileSync = sinon.stub();

export {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  writeFileSync,
};
