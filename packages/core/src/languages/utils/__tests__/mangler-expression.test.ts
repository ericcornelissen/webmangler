import { expect, use as chaiUse } from "chai";
import * as sinonChai from "sinon-chai";

import ManglerMatchMock from "../../../__mocks__/mangler-match.mock";

import ManglerExpression from "../mangler-expression.class";

chaiUse(sinonChai);

suite("ManglerExpression", function() {
  suite("::matchParserForIndex", function() {
    test("single index", function() {
      for (const index of [0, 1, 2, 3]) {
        const manglerMatch = new ManglerMatchMock();

        const parser = ManglerExpression.matchParserForIndex(index);
        parser("", manglerMatch);

        expect(manglerMatch.getGroup).to.have.been.calledOnceWith(index);
        expect(manglerMatch.getNamedGroup).not.to.have.been.called;
      }
    });

    test("multiple indices", function() {
      for (const indices of [[0, 1], [1, 2], [2, 3]]) {
        const manglerMatch = new ManglerMatchMock();

        const parser = ManglerExpression.matchParserForIndex(indices);
        parser("", manglerMatch);

        for (const index of indices) {
          expect(manglerMatch.getGroup).to.have.been.calledWith(index);
        }
        expect(manglerMatch.getNamedGroup).not.to.have.been.called;
      }
    });
  });

  suite("::matchParserForGroup", function() {
    test("single group", function() {
      for (const name of ["praise", "the", "sun"]) {
        const manglerMatch = new ManglerMatchMock();

        const parser = ManglerExpression.matchParserForGroup(name);
        parser("", manglerMatch);

        expect(manglerMatch.getNamedGroup).to.have.been.calledOnceWith(name);
        expect(manglerMatch.getGroup).not.to.have.been.called;
      }
    });

    test("multiple group", function() {
      for (const names of [["foo", "bar"], ["hello", "world"]]) {
        const manglerMatch = new ManglerMatchMock();

        const parser = ManglerExpression.matchParserForGroup(names);
        parser("", manglerMatch);

        for (const name of names) {
          expect(manglerMatch.getNamedGroup).to.have.been.calledWith(name);
        }
        expect(manglerMatch.getGroup).not.to.have.been.called;
      }
    });
  });

  suite("::matchReplacerBy", function() {
    test("no groups", function() {
      const to = "foo";
      const match = new ManglerMatchMock();

      const replacer = ManglerExpression.matchReplacerBy("cls-%s");
      const result = replacer(to, match);
      expect(result).to.equal(`cls-${to}`);
    });

    test("one indexed group", function() {
      const to = "foo";
      const match = new ManglerMatchMock();

      const groupIndex = 1;
      match.getGroup.withArgs(groupIndex).returns("cls");

      const replacer = ManglerExpression.matchReplacerBy(`$${groupIndex}-%s`);
      const result = replacer(to, match);
      expect(result).to.equal(`cls-${to}`);
    });

    test("multiple indexed groups", function() {
      const to = "foo";
      const match = new ManglerMatchMock();

      const indexA = 1;
      const indexB = 3;
      match.getGroup.withArgs(indexA).returns("cls");
      match.getGroup.withArgs(indexB).returns("bar");

      const replacer = ManglerExpression.matchReplacerBy(`$${indexA}-%s$${indexB}`);
      const result = replacer(to, match);
      expect(result).to.equal(`cls-${to}bar`);
    });

    test("named group", function() {
      const to = "foo";
      const match = new ManglerMatchMock();

      const groupName = "prefix";
      match.getNamedGroup.withArgs(groupName).returns("cls");

      const replacer = ManglerExpression.matchReplacerBy(`$<${groupName}>-%s`);
      const result = replacer(to, match);
      expect(result).to.equal(`cls-${to}`);
    });

    test("multiple named groups", function() {
      const to = "foo";
      const match = new ManglerMatchMock();

      const groupA = "suffix";
      const groupB = "prefix";
      match.getNamedGroup.withArgs(groupA).returns("cls");
      match.getNamedGroup.withArgs(groupB).returns("bar");

      const replacer = ManglerExpression.matchReplacerBy(`$<${groupA}>-%s$<${groupB}>`);
      const result = replacer(to, match);
      expect(result).to.equal(`cls-${to}bar`);
    });

    test("indexed and named groups", function() {
      const to = "foo";
      const match = new ManglerMatchMock();

      const index = 2;
      const group = "prefix";
      match.getGroup.withArgs(index).returns("cls");
      match.getNamedGroup.withArgs(group).returns("bar");

      const replacer = ManglerExpression.matchReplacerBy(`$${index}-%s$<${group}>`);
      const result = replacer(to, match);
      expect(result).to.equal(`cls-${to}bar`);
    });
  });
});
