import { expect } from "chai";

import { generateValueObjects, generateValueObjectsAll } from "../../generate";

suite("Generate", function() {
  suite("::generateValueObjects", function() {
    type TestCase = {
      name: string;
      input: { [key: string]: string[]; },
      expected: { [key: string]: string; }[],
    }

    const testCases: TestCase[] = [
      {
        name: "one property, one value",
        input: {
          foo: ["bar"],
        },
        expected: [
          { foo: "bar" },
        ],
      },
      {
        name: "one property, multiple values",
        input: {
          foo: ["bar", "baz"],
        },
        expected: [
          { foo: "bar" },
          { foo: "baz" },
        ],
      },
      {
        name: "multiple properties",
        input: {
          foo: ["bar", "baz"],
          hello: ["world", "planet"],
        },
        expected: [
          { foo: "bar", hello: "world" },
          { foo: "bar", hello: "planet" },
          { foo: "baz", hello: "world" },
          { foo: "baz", hello: "planet" },
        ],
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const generator = generateValueObjects(input);
        const result = Array.from(generator);
        expect(result.length).to.equal(expected.length);
        for (const entry of result) {
          expect(expected).to.deep.include(entry);
        }
      });
    }
  });

  suite("::generateValueObjectsAll", function() {
    type TestCase = {
      name: string;
      input: Iterable<{ [key: string]: string[]; }>,
      expected: Iterable<{ [key: string]: string; }>[],
    }

    const testCases: TestCase[] = [
      {
        name: "one set, one property, one value",
        input: [
          {
            foo: ["bar"],
          },
        ],
        expected: [
          [{ foo: "bar" }],
        ],
      },
      {
        name: "one set, multiple properties, one value",
        input: [
          {
            foo: ["bar"],
            hello: ["world"],
          },
        ],
        expected: [
          [{ foo: "bar", hello: "world" }],
        ],
      },
      {
        name: "one set, one property, multiple values",
        input: [
          {
            foo: ["bar", "baz"],
          },
        ],
        expected: [
          [{ foo: "bar" }],
          [{ foo: "baz" }],
        ],
      },
      {
        name: "one set, multiple properties, multiple values",
        input: [
          {
            foo: ["bar", "baz"],
            hello: ["world", "planet"],
          },
        ],
        expected: [
          [{ foo: "bar", hello: "world" }],
          [{ foo: "bar", hello: "planet" }],
          [{ foo: "baz", hello: "world" }],
          [{ foo: "baz", hello: "planet" }],
        ],
      },
      {
        name: "multiple sets, one property, one value",
        input: [
          {
            foo: ["bar"],
          },
          {
            hello: ["world"],
          },
        ],
        expected: [
          [{ foo: "bar" }, { hello: "world" }],
        ],
      },
      {
        name: "multiple sets, one property, multiple values",
        input: [
          {
            foo: ["bar", "baz"],
          },
          {
            hello: ["world", "planet"],
          },
        ],
        expected: [
          [{ foo: "bar" }, { hello: "world" }],
          [{ foo: "bar" }, { hello: "planet" }],
          [{ foo: "baz" }, { hello: "world" }],
          [{ foo: "baz" }, { hello: "planet" }],
        ],
      },
      {
        name: "multiple sets, multiple property, multiple values",
        input: [
          {
            foo: ["bar", "baz"],
            hello: ["world", "planet"],
          },
          {
            praise: ["the", "sun"],
            do: ["the", "thing"],
          },
        ],
        expected: [
          [{ foo: "bar", hello: "world" }, { praise: "the", do: "the" }],
          [{ foo: "bar", hello: "world" }, { praise: "the", do: "thing" }],
          [{ foo: "bar", hello: "world" }, { praise: "sun", do: "the" }],
          [{ foo: "bar", hello: "world" }, { praise: "sun", do: "thing" }],
          [{ foo: "bar", hello: "planet" }, { praise: "the", do: "the" }],
          [{ foo: "bar", hello: "planet" }, { praise: "the", do: "thing" }],
          [{ foo: "bar", hello: "planet" }, { praise: "sun", do: "the" }],
          [{ foo: "bar", hello: "planet" }, { praise: "sun", do: "thing" }],
          [{ foo: "baz", hello: "world" }, { praise: "the", do: "the" }],
          [{ foo: "baz", hello: "world" }, { praise: "the", do: "thing" }],
          [{ foo: "baz", hello: "world" }, { praise: "sun", do: "the" }],
          [{ foo: "baz", hello: "world" }, { praise: "sun", do: "thing" }],
          [{ foo: "baz", hello: "planet" }, { praise: "the", do: "the" }],
          [{ foo: "baz", hello: "planet" }, { praise: "the", do: "thing" }],
          [{ foo: "baz", hello: "planet" }, { praise: "sun", do: "the" }],
          [{ foo: "baz", hello: "planet" }, { praise: "sun", do: "thing" }],
        ],
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const generator = generateValueObjectsAll(input);
        const result = Array.from(generator);
        expect(result.length).to.equal(expected.length);
        for (const entry of result) {
          expect(expected).to.deep.include(entry);
        }
      });
    }
  });
});
