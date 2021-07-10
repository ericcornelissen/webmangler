import { expect } from "chai";

import RecommendedManglers from "../recommended";

suite("Recommended Manglers", function() {
  test("no configuration", function() {
    const subject = new RecommendedManglers();
    const result = subject.options();
    expect(result).to.have.lengthOf(3);
  });

  test("disable the CssClassMangler", function() {
    const subject = new RecommendedManglers({
      disableCssClassMangling: true,
    });
    const result = subject.options();
    expect(result).to.have.lengthOf(2);
  });

  test("disable the CssVariableMangler", function() {
    const subject = new RecommendedManglers({
      disableCssVarMangling: true,
    });
    const result = subject.options();
    expect(result).to.have.lengthOf(2);
  });

  test("disable the HtmlAttributeMangler", function() {
    const subject = new RecommendedManglers({
      disableHtmlAttrMangling: true,
    });
    const result = subject.options();
    expect(result).to.have.lengthOf(2);
  });
});
