import { expect } from "chai";

import BuiltInLanguagesPlugin from "../builtin";

suite("Built-in Language Supports", function() {
  test("get embeds", function() {
    const file = {
      content: "foobar",
      type: "html",
    };

    const subject = new BuiltInLanguagesPlugin();
    expect(() => subject.getEmbeds(file)).not.to.throw();
  });

  test("get expressions", function() {
    const expressionName = "name";
    const expressionOptions = null;

    const subject = new BuiltInLanguagesPlugin();
    expect(() => {
      subject.getExpressions(expressionName, expressionOptions);
    }).not.to.throw();
  });

  test("get languages", function() {
    const subject = new BuiltInLanguagesPlugin();
    const result = subject.getLanguages();
    expect(result).to.include.members(["css", "js", "html"]);
  });
});
