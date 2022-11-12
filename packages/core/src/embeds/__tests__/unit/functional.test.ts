import { expect, use as chaiUse } from "chai";
import * as fc from "fast-check";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import {
  crossProduct,
  empty,
  first,
  flatMap,
  flatten,
  map,
  merge,
  not,
  partial2,
  partial4,
  partialRight2,
  pipe,
  spread,
  recurse,
  reduce,
  reduceBy,
  reverse,
  toListReducer,
  values,
} from "../../functional";

chaiUse(sinonChai);

suite("Embeds", function() {
  suite("::crossProduct", function() {
    test("both lists are empty", function() {
      const _result = crossProduct([], []);
      const result = Array.from(_result);
      expect(result).to.have.lengthOf(0);
    });

    test("only the first list is empty", function() {
      fc.assert(
        fc.property(
          fc.array(fc.anything(), { minLength: 1 }),
          (listB) => {
            const _result = crossProduct([], listB);
            const result = Array.from(_result);
            expect(result).to.have.lengthOf(0);
          },
        ),
      );
    });

    test("only the second list is empty", function() {
      fc.assert(
        fc.property(
          fc.array(fc.anything(), { minLength: 1 }),
          (listA) => {
            const _result = crossProduct(listA, []);
            const result = Array.from(_result);
            expect(result).to.have.lengthOf(0);
          },
        ),
      );
    });

    test("neither list is empty", function() {
      const listA = ["foo", "bar"];
      const listB = ["hello", "world", "!"];

      expect(listA).to.have.length.greaterThan(0);
      expect(listB).to.have.length.greaterThan(0);

      const _result = crossProduct(listA, listB);
      const result = Array.from(_result);

      expect(result).to.have.lengthOf(6);
      expect(result).to.deep.include(["foo", "hello"]);
      expect(result).to.deep.include(["foo", "world"]);
      expect(result).to.deep.include(["foo", "!"]);
      expect(result).to.deep.include(["bar", "hello"]);
      expect(result).to.deep.include(["bar", "world"]);
      expect(result).to.deep.include(["bar", "!"]);
    });

    test("two non-empty lists", function() {
      fc.assert(
        fc.property(
          fc.array(fc.anything(), { minLength: 1 }),
          fc.array(fc.anything(), { minLength: 1 }),
          (listA, listB) => {
            const _result = crossProduct(listA, listB);
            const result = Array.from(_result);
            expect(result).to.have.lengthOf(listA.length * listB.length);
          },
        ),
      );
    });
  });

  suite("::empty", function() {
    test("an empty list", function() {
      const result = empty([]);
      expect(result).to.be.true;
    });

    test("a non-empty list", function() {
      fc.assert(
        fc.property(
          fc.array(fc.anything(), { minLength: 1 }),
          (list) => {
            const result = empty(list);
            expect(result).to.be.false;
          },
        ),
      );
    });
  });

  suite("::first", function() {
    test("an empty list", function() {
      const result = first([]);
      expect(result).to.be.undefined;
    });

    test("a list with one item", function() {
      fc.assert(
        fc.property(
          fc.anything(),
          (item) => {
            const result = first([item]);
            expect(result).to.deep.equal(item);
          },
        ),
      );
    });

    test("a list with many item", function() {
      fc.assert(
        fc.property(
          fc.anything(),
          fc.array(fc.anything(), { minLength: 1 }),
          (item, list) => {
            const result = first([item, ...list]);
            expect(result).to.deep.equal(item);
          },
        ),
      );
    });
  });

  suite("::flatMap", function() {
    test("an empty list", function() {
      const mapFn = () => [];
      const result = flatMap(mapFn)([]);
      expect(result).to.have.lengthOf(0);
    });

    test("a one-item list", function() {
      const mapFn = (x: string) => [x, x];
      const result = flatMap(mapFn)(["foobar"]);
      expect(result).to.deep.equal([
        "foobar",
        "foobar",
      ]);
    });

    test("a many-item list", function() {
      const mapFn = (x: string) => [x, x];
      const result = flatMap(mapFn)(["foo", "bar"]);
      expect(result).to.deep.equal([
        "foo",
        "foo",
        "bar",
        "bar",
      ]);
    });

    test("the first argument provided to `mapFn`", function() {
      const mapFn = sinon.stub();
      mapFn.returns([]);

      const list = ["foo", "bar"];
      flatMap(mapFn)(list);

      expect(mapFn).to.have.callCount(list.length);
      for (const item of list) {
        expect(mapFn).to.have.been.calledWithExactly(item);
      }
    });
  });

  suite("::flatten", function() {
    test("an empty list", function() {
      const result = flatten([]);
      expect(result).to.have.lengthOf(0);
    });

    test("a list of empty list", function() {
      fc.assert(
        fc.property(
          fc.array(fc.constant([]), { minLength: 1 }),
          (list) => {
            const result = flatten(list);
            expect(result).to.have.lengthOf(0);
          },
        ),
      );
    });

    test("a list of one non-empty list", function() {
      fc.assert(
        fc.property(
          fc.array(fc.anything(), { minLength: 1 }),
          (list) => {
            const result = flatten([list]);
            expect(result).to.have.length(list.length);
            for (const entry of list) {
              expect(result).to.deep.contain(entry);
            }
          },
        ),
      );
    });

    test("a list of non-empty lists", function() {
      fc.assert(
        fc.property(
          fc.array(
            fc.array(fc.anything(), { minLength: 1 }),
            { minLength: 1 },
          ),
          (lists) => {
            const expectedLength = lists
              .map((list) => list.length)
              .reduce((sum, current) => sum + current, 0);

            const result = flatten(lists);
            expect(result).to.have.length(expectedLength);
            for (const subList of lists) {
              for (const entry of subList) {
                expect(result).to.deep.contain(entry);
              }
            }
          },
        ),
      );
    });
  });

  suite("::map", function() {
    test("an empty list", function() {
      const mapFn = () => [];
      const result = map(mapFn)([]);
      expect(result).to.have.lengthOf(0);
    });

    test("an one-item list", function() {
      const mappedValue = "bar";
      const mapFn = () => mappedValue;

      const result = map(mapFn)(["foo"]);
      expect(result).to.deep.equal([mappedValue]);
    });

    test("a many-item list", function() {
      const mapFn = sinon.stub();

      const mapping = new Map([
        ["foo", "bar"],
        ["hello", "world"],
      ]);


      let i = 0;
      mapping.forEach((value) => {
        mapFn.onCall(i++).returns(value);
      });

      const list = mapping.keys();
      const expected = Array.from(mapping.values());

      const result = map(mapFn)(list);
      expect(result).to.deep.equal(expected);
    });

    test("the first argument provided to `mapFn`", function() {
      const mapFn = sinon.spy();

      const list = ["foo", "bar"];
      map(mapFn)(list);

      expect(mapFn).to.have.callCount(list.length);
      for (const item of list) {
        expect(mapFn).to.have.been.calledWithExactly(item);
      }
    });
  });

  suite("::merge", function() {
    test("an empty list", function() {
      const result = merge([]);
      expect(result).to.deep.equal(new Map());
    });

    test("one map", function() {
      fc.assert(
        fc.property(
          fc.array(fc.tuple(fc.string(), fc.string()))
            .map((tuples) => new Map(tuples)),
          (mapA) => {
            const result = merge([mapA]);
            expect(result).to.deep.equal(mapA);
          },
        ),
      );
    });

    test("many maps", function() {
      fc.assert(
        fc.property(
          fc.array(
            fc.array(fc.tuple(fc.string(), fc.nat()))
              .map((tuples) => new Map(tuples)),
            { minLength: 1 },
          ),
          (maps) => {
            const result = merge(maps);
            for (const mapN of maps) {
              for (const [key] of mapN.entries()) {
                const hasKey = result.has(key);
                expect(hasKey).to.be.true;
              }
            }
          },
        ),
      );
    });

    test("multiple maps", function() {
      type mapping = [string, string][];

      const mappingA: mapping = [
        ["foo", "bar"],
      ];
      const mappingB: mapping = [
        ["hello", "world"],
      ];

      const mapA = new Map(mappingA);
      const mapB = new Map(mappingB);

      const expected = new Map([
        ...mappingA,
        ...mappingB,
      ]);

      const result = merge([mapA, mapB]);
      expect(result).to.deep.equal(expected);
    });
  });

  suite("::not", function() {
    test("true", function() {
      const result = not(true);
      expect(result).to.be.false;
    });

    test("false", function() {
      const result = not(false);
      expect(result).to.be.true;
    });
  });

  suite("::partial2", function() {
    test("return value", function() {
      const returnValue = "foobar";

      const fn = () => returnValue;
      const partialFn = partial2(fn);

      const result = partialFn(null)(null);
      expect(result).to.equal(returnValue);
    });

    test("the first argument", function() {
      const firstArgument = "foobar";

      const fn = sinon.spy();
      const partialFn = partial2(fn);

      partialFn(firstArgument)(null);
      expect(fn).to.have.been.calledWithExactly(
        firstArgument,
        sinon.match.any,
      );
    });

    test("the second argument", function() {
      const secondArgument = "foobar";

      const fn = sinon.spy();
      const partialFn = partial2(fn);

      partialFn(null)(secondArgument);
      expect(fn).to.have.been.calledWithExactly(
        sinon.match.any,
        secondArgument,
      );
    });
  });

  suite("::partial4", function() {
    test("return value", function() {
      const returnValue = "foobar";

      const fn = () => returnValue;
      const partialFn = partial4(fn);

      const result = partialFn(null, null, null)(null);
      expect(result).to.equal(returnValue);
    });

    test("the first argument", function() {
      const firstArgument = "foobar";

      const fn = sinon.spy();
      const partialFn = partial4(fn);

      partialFn(firstArgument, null, null)(null);
      expect(fn).to.have.been.calledWithExactly(
        firstArgument,
        sinon.match.any,
        sinon.match.any,
        sinon.match.any,
      );
    });

    test("the second argument", function() {
      const secondArgument = "foobar";

      const fn = sinon.spy();
      const partialFn = partial4(fn);

      partialFn(null, secondArgument, null)(null);
      expect(fn).to.have.been.calledWithExactly(
        sinon.match.any,
        secondArgument,
        sinon.match.any,
        sinon.match.any,
      );
    });

    test("the third argument", function() {
      const thirdArgument = "foobar";

      const fn = sinon.spy();
      const partialFn = partial4(fn);

      partialFn(null, null, thirdArgument)(null);
      expect(fn).to.have.been.calledWithExactly(
        sinon.match.any,
        sinon.match.any,
        thirdArgument,
        sinon.match.any,
      );
    });

    test("the fourth argument", function() {
      const fourthArgument = "foobar";

      const fn = sinon.spy();
      const partialFn = partial4(fn);

      partialFn(null, null, null)(fourthArgument);
      expect(fn).to.have.been.calledWithExactly(
        sinon.match.any,
        sinon.match.any,
        sinon.match.any,
        fourthArgument,
      );
    });
  });

  suite("::partialRight2", function() {
    test("return value", function() {
      const returnValue = "foobar";

      const fn = () => returnValue;
      const partialFn = partialRight2(fn);

      const result = partialFn(null)(null);
      expect(result).to.equal(returnValue);
    });

    test("the first argument", function() {
      const firstArgument = "foobar";

      const fn = sinon.spy();
      const partialFn = partialRight2(fn);

      partialFn(firstArgument)(null);
      expect(fn).to.have.been.calledWithExactly(
        sinon.match.any,
        firstArgument,
      );
    });

    test("the second argument", function() {
      const secondArgument = "foobar";

      const fn = sinon.spy();
      const partialFn = partialRight2(fn);

      partialFn(null)(secondArgument);
      expect(fn).to.have.been.calledWithExactly(
        secondArgument,
        sinon.match.any,
      );
    });
  });

  suite("::pipe", function() {
    const noop = () => null;

    test("return value", function() {
      const returnValue = "foobar";
      const lastFn = () => returnValue;

      const fn = pipe(
        noop,
        lastFn,
      );

      const result = fn();
      expect(result).to.equal(returnValue);
    });

    test("the arguments to the first function", function() {
      const firstFn = sinon.spy();

      const fn = pipe(
        firstFn,
        noop,
      );

      const args = ["foo", "bar"];
      fn(...args);
      expect(firstFn).to.have.been.calledWithExactly(...args);
    });

    test("the argument to the second function", function() {
      const intermediateValue = "foobar";
      const firstFn = () => intermediateValue;
      const secondFn = sinon.spy();

      const fn = pipe(
        firstFn,
        secondFn,
      );

      fn();
      expect(secondFn).to.have.been.calledWithExactly(intermediateValue);
    });
  });

  suite("::spread", function() {
    test("return value", function() {
      fc.assert(
        fc.property(
          fc.anything(),
          (returnValue) => {
            const fn = () => returnValue;
            const spreadFn = spread(fn);

            const result = spreadFn([null, null]);
            expect(result).to.deep.equal(returnValue);
          },
        ),
      );
    });

    test("the arguments", function() {
      fc.assert(
        fc.property(
          fc.anything(),
          fc.anything(),
          (arg0, arg1) => {
            const args: [unknown, unknown] = [arg0, arg1];

            const fn = sinon.spy();
            const spreadFn = spread(fn);

            spreadFn(args);
            expect(fn).to.have.been.calledWithExactly(...args);
          },
        ),
      );
    });
  });

  suite("::recurse", function() {
    test("no recursion", function() {
      const fn = (x: number) => `foobar ${x}`;
      const nextFn = (x: string) => x.length;
      const predicateFn = () => false;

      const val = 0;
      const result = recurse(fn, nextFn, predicateFn)(val);
      expect(result).to.deep.equal([`foobar ${val}`]);
    });

    test("one recursion", function() {
      const fn = (x: number) => `foobar ${x}`;
      const nextFn = (x: string) => x.length;

      const predicateFn = sinon.stub();
      predicateFn.onCall(0).returns(true);
      predicateFn.onCall(1).returns(false);

      const val = 0;
      const result = recurse(fn, nextFn, predicateFn)(val);
      expect(result).to.deep.equal([
        `foobar ${val}`,
        `foobar ${7 + val.toString().length}`,
      ]);
    });

    test("many recursions", function() {
      const fn = (s: string) => s.substring(0, s.length - 1);
      const nextFn = (s: string) => s;
      const predicateFn = (s: string) => s.length > 0;

      const result = recurse(fn, nextFn, predicateFn)("foobar");
      expect(result).to.deep.equal([
        "fooba",
        "foob",
        "foo",
        "fo",
        "f",
        "",
      ]);
    });
  });

  suite("::reduce", function() {
    test("an empty list", function() {
      const initialValue = 0;
      const reduceFn = () => 1;

      const result = reduce(reduceFn, initialValue, []);
      expect(result).to.deep.equal(initialValue);
    });

    test("a one-item list", function() {
      const reducedValue = 1;
      const reduceFn = () => reducedValue;

      const result = reduce(reduceFn, 0, ["foobar"]);
      expect(result).to.deep.equal(reducedValue);
    });

    test("a many-item list", function() {
      const reduceFn = sinon.stub();

      const mapping = new Map([
        ["foo", 1],
        ["bar", 2],
        ["hello", 3],
        ["world", 4],
        ["!", 5],
      ]);

      let i = 0;
      mapping.forEach((value) => {
        reduceFn.onCall(i++).returns(value);
      });

      const list = mapping.keys();
      const expected = Array.from(mapping.values()).reverse()[0];

      const result = reduce(reduceFn, 0, list);
      expect(result).to.deep.equal(expected);
    });

    test("the first argument provided to `reduceFn`", function() {
      const initialValue = 0;
      const reduceFn = sinon.stub();

      const mapping = new Map([
        ["foo", 1],
        ["bar", 2],
        ["hello", 3],
        ["world", 4],
        ["!", 5],
      ]);

      let i = 0;
      mapping.forEach((value) => {
        reduceFn.onCall(i++).returns(value);
      });

      const list = Array.from(mapping.keys());
      reduce(reduceFn, initialValue, list);

      expect(reduceFn).to.have.callCount(list.length);
      expect(reduceFn).to.have.been.calledWithExactly(
        initialValue,
        sinon.match.any,
      );

      const x = Array.from(mapping.values());
      const lastValue = x.pop();
      for (const item of x) {
        expect(reduceFn).to.have.been.calledWithExactly(
          item,
          sinon.match.any,
        );
      }
      expect(reduceFn).not.to.have.been.calledWithExactly(
        lastValue,
        sinon.match.any,
      );
    });

    test("the second argument provided to `reduceFn`", function() {
      const reduceFn = sinon.spy();

      const list = ["foo", "bar"];
      reduce(reduceFn, 0, list);

      expect(reduceFn).to.have.callCount(list.length);
      for (const item of list) {
        expect(reduceFn).to.have.been.calledWithExactly(
          sinon.match.any,
          item,
        );
      }
    });
  });

  suite("::reduceBy", function() {
    test("an empty list", function() {
      const keyFn = () => null;
      const reduceFn = () => null;

      const result = reduceBy(reduceFn, null, keyFn)([]);
      expect(result).to.deep.equal(new Map());
    });

    test("a one-item list", function() {
      const key = "key";
      const keyFn = () => key;
      const reducedValue = 1;
      const reduceFn = () => reducedValue;

      const result = reduceBy(reduceFn, 0, keyFn)(["foobar"]);
      expect(result).to.deep.equal(new Map([
        [key, reducedValue],
      ]));
    });

    test("a many-item list", function() {
      const key = "key";
      const keyFn = () => key;

      const reduceFn = sinon.stub();

      const mapping = new Map([
        ["foo", 1],
        ["bar", 2],
        ["hello", 3],
        ["world", 4],
        ["!", 5],
      ]);

      let i = 0;
      mapping.forEach((value) => {
        reduceFn.onCall(i++).returns(value);
      });

      const list = mapping.keys();

      const result = reduceBy(reduceFn, 0, keyFn)(list);
      expect(result).to.deep.equal(new Map([
        [key, Array.from(mapping.values()).reverse()[0]],
      ]));
    });

    test("the first argument provided to `reduceFn`", function() {
      const keyFn = () => "key";

      const initialValue = 0;
      const reduceFn = sinon.stub();

      const mapping = new Map([
        ["foo", 1],
        ["bar", 2],
        ["hello", 3],
        ["world", 4],
        ["!", 5],
      ]);

      let i = 0;
      mapping.forEach((value) => {
        reduceFn.onCall(i++).returns(value);
      });

      const list = Array.from(mapping.keys());
      reduceBy(reduceFn, initialValue, keyFn)(list);

      expect(reduceFn).to.have.callCount(list.length);
      expect(reduceFn).to.have.been.calledWithExactly(
        initialValue,
        sinon.match.any,
      );

      const x = Array.from(mapping.values());
      const lastValue = x.pop();
      for (const item of x) {
        expect(reduceFn).to.have.been.calledWithExactly(
          item,
          sinon.match.any,
        );
      }
      expect(reduceFn).not.to.have.been.calledWithExactly(
        lastValue,
        sinon.match.any,
      );
    });

    test("the second argument provided to `reduceFn`", function() {
      const keyFn = () => "key";

      const reduceFn = sinon.spy();

      const list = ["foo", "bar"];
      reduceBy(reduceFn, 0, keyFn)(list);

      expect(reduceFn).to.have.callCount(list.length);
      for (const item of list) {
        expect(reduceFn).to.have.been.calledWithExactly(
          sinon.match.any,
          item,
        );
      }
    });

    test("the first argument provided to `keyFn`", function() {
      const reduceFn = () => null;

      const keyFn = sinon.spy();

      const list = ["foo", "bar"];
      reduceBy(reduceFn, 0, keyFn)(list);

      expect(keyFn).to.have.callCount(list.length);
      for (const item of list) {
        expect(keyFn).to.have.been.calledWithExactly(item);
      }
    });
  });

  suite("::reverse", function() {
    test("an empty list", function() {
      const result = reverse([]);
      expect(result).to.have.lengthOf(0);
    });

    test("a one-item list", function() {
      fc.assert(
        fc.property(
          fc.anything(),
          (item) => {
            const list = [item];

            const result = reverse(list);
            expect(result).to.deep.equal(list);
          },
        ),
      );
    });

    test("a many-item list", function() {
      fc.assert(
        fc.property(
          fc.anything(),
          fc.array(fc.anything(), { minLength: 1 }),
          (item, list) => {
            const result = reverse([...list, item]);
            expect(result).to.have.lengthOf(list.length + 1);
            expect(result[0]).to.deep.equal(item);
          },
        ),
      );
    });
  });

  suite("::toListReducer", function() {
    test("return value from empty accumulator", function() {
      const returnValue = ["foo", "bar"];
      const fn = () => returnValue;
      const reduceFn = toListReducer(fn);

      const result = reduceFn([], null);
      expect(result).to.deep.equal(returnValue);
    });

    test("return value from non-empty accumulator", function() {
      const returnValue = ["foo", "bar"];
      const fn = () => returnValue;
      const reduceFn = toListReducer(fn);

      const accumulator = ["hello", "world", "!"];
      const result = reduceFn(accumulator, null);
      expect(result).to.deep.equal([
        ...accumulator,
        ...returnValue,
      ]);
    });

    test("the first argument provided to `fn`", function() {
      const fn = sinon.stub();
      const reduceFn = toListReducer(fn);

      fn.returns([]);

      const arg = "Hello world!";
      reduceFn([], arg);
      expect(fn).to.have.been.calledWithExactly(arg);
    });
  });

  suite("::values", function() {
    test("an empty map", function() {
      const _result = values(new Map());
      const result = Array.from(_result);
      expect(result).to.have.lengthOf(0);
    });

    test("a one-entry map", function() {
      fc.assert(
        fc.property(
          fc.anything(),
          fc.anything(),
          (key, value) => {
            const m = new Map([
              [key, value],
            ]);

            const _result = values(m);
            const result = Array.from(_result);
            expect(result).to.deep.equal([value]);
          },
        ),
      );
    });

    test("a many-entry map", function() {
      const value1 = "bar";
      const value2 = "world";

      const m = new Map([
        ["foo", value1],
        ["hello", value2],
      ]);
      expect(m.size).to.be.greaterThan(1);

      const _result = values(m);
      const result = Array.from(_result);
      expect(result).to.deep.equal([value1, value2]);
    });

    test("a many-entries map", function() {
      fc.assert(
        fc.property(
          fc.array(fc.tuple(fc.string(), fc.string()))
            .map((tuples) => {
              return tuples.filter(([key], index) => {
                return tuples.findIndex(([_key]) => key === _key) === index;
              });
            })
            .filter((tuples) => tuples.length >= 2)
            .map((tuples) => new Map(tuples)),
          (m) => {
            const _result = values(m);
            const result = Array.from(_result);
            expect(result).to.have.length(m.size);
          },
        ),
      );
    });
  });
});
