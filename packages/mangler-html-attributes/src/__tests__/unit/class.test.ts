import { expect } from "chai";

import HtmlAttributeMangler from "../../class";

suite("HtmlAttributeMangler class", function() {
  let subject: HtmlAttributeMangler;

  setup(function() {
    subject = new HtmlAttributeMangler();
  });

  test("instantiation succeeds", function() {
    expect(subject).not.to.be.undefined;
  });

  test("options succeeds", function() {
    const result = subject.options();
    expect(result).not.to.be.undefined;
  });
});
