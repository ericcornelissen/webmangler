const booleanOptional: Iterable<boolean | undefined> = [
  undefined,
  true,
  false,
];

const stringOptional: Iterable<string | undefined> = [
  undefined,
  "foobar",
];

const stringOrStringsOptional: Iterable<string | string[] | undefined> = [
  undefined,
  "foobar",
  ["foo", "bar"],
];

const stringsOptional: Iterable<string[] | undefined> = [
  undefined,
  ["foo", "bar"],
];

export {
  booleanOptional,
  stringOptional,
  stringOrStringsOptional,
  stringsOptional,
};
