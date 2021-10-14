import { expect } from "chai";

import CssClassMangler from "../../index";

suite("CssClassMangler", function() {
  let subject: CssClassMangler;

  setup(function() {
    subject = new CssClassMangler();
  });

  test("instantiation succeeds", function() {
    expect(subject).not.to.be.undefined;
  });

  test("options succeeds", function() {
    const result = subject.options();
    expect(result).not.to.be.undefined;
  });
});
