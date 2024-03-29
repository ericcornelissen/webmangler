import { expect } from "chai";

import BuiltInManglers from "../../index";

suite("Built-in Manglers", function() {
  test("no configuration", function() {
    const subject = new BuiltInManglers();
    const result = subject.options();
    expect(result).to.have.lengthOf(4);
  });

  test("disable the CssClassMangler", function() {
    const subject = new BuiltInManglers({
      disableCssClassMangling: true,
    });
    const result = subject.options();
    expect(result).to.have.lengthOf(3);
  });

  test("disable the CssVariableMangler", function() {
    const subject = new BuiltInManglers({
      disableCssVarMangling: true,
    });
    const result = subject.options();
    expect(result).to.have.lengthOf(3);
  });

  test("disable the HtmlAttributeMangler", function() {
    const subject = new BuiltInManglers({
      disableHtmlAttrMangling: true,
    });
    const result = subject.options();
    expect(result).to.have.lengthOf(3);
  });

  test("disable the HtmlIdMangler", function() {
    const subject = new BuiltInManglers({
      disableHtmlIdMangling: true,
    });
    const result = subject.options();
    expect(result).to.have.lengthOf(3);
  });
});
