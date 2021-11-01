import { expect } from "chai";

import CssVariableMangler from "../../class";

suite("CssVariableMangler class", function() {
  let subject: CssVariableMangler;

  setup(function() {
    subject = new CssVariableMangler();
  });

  test("instantiation succeeds", function() {
    expect(subject).not.to.be.undefined;
  });

  test("options succeeds", function() {
    const result = subject.options();
    expect(result).not.to.be.undefined;
  });
});
