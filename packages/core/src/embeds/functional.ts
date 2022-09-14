/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Get the cross product of two lists.
 *
 * NOTE: No guarantee is provided on the ordering.
 *
 * @example
 * const listA = [1, 2];
 * const listB = ["a", "b", "c"];
 * crossProduct(listA, listB);
 * // => [[1, "a"], [1, "b"], [1, "c"], [2, "a"], [2, "b"], [2, "c"]]
 * @param listA A list.
 * @param listB A list.
 * @returns The cross product of `listA` and `listB`.
 */
function crossProduct<T1, T2>(
  listA: Iterable<T1>,
  listB: Iterable<T2>,
): Iterable<[T1, T2]> {
  const result: [T1, T2][] = [];
  for (const itemA of listA) {
    for (const itemB of listB) {
      result.push([itemA, itemB]);
    }
  }

  return result;
}

/**
 * Returns whether or not the provided list is empty.
 *
 * @example
 * const list = [1, 2, 3];
 * empty(list);
 * // => false
 * @param list The list to check.
 * @returns `true` if the list is empty, `false` otherwise.
 */
function empty(
  list: Iterable<any>,
): boolean {
  return Array.from(list).length === 0;
}

/**
 * Get the first item in a list.
 *
 * @example
 * const list = [1, 2, 3];
 * first(list);
 * // => 1
 * @param list The list of values.
 * @returns The first value in the list, or `undefined`.
 */
function first<T>(
  list: T[],
): T {
  return list[0];
}

/**
 * Take a function and a list, transform each item in the list with the
 * function, and return the transformed items flattened.
 *
 * See also {@link map} and {@link flatten}.
 *
 * @example
 * const mapFn = (x) => [x, x + 1];
 * const list = [1, 3];
 * flatMap(mapFn, list);
 * // => [1, 2, 3, 4]
 * @param mapFn A function to transform items of `list`.
 * @param list The list of items to transform.
 * @returns The transformed and flattened items.
 */
function _flatMap<TArg, TResult>(
  mapFn: (item: TArg) => Iterable<TResult>,
  list: Iterable<TArg>,
): Iterable<TResult> {
  const mappedList = _map(mapFn, list);
  const result = flatten(mappedList);
  return result;
}

/**
 * Flatten a list of lists.
 *
 * @example
 * const list = [[1, 2], [3, 4]];
 * flatten(list);
 * // => [1, 2, 3, 4]
 * @param list The list to flatten.
 * @returns The flattened list.
 */
function flatten<T>(
  list: Iterable<Iterable<T>>,
) {
  let result: T[] = [];
  for (const subList of list) {
    result = [
      ...result,
      ...subList,
    ];
  }

  return result;
}

/**
 * Take a function and a list, transform each item in the list with the
 * function, and return the transformed items in the same order.
 *
 * @example
 * const mapFn = (x) => x + 1;
 * const list = [1, 2, 3];
 * map(mapFn, list);
 * // => [2, 3, 4]
 * @param mapFn A function to transform items of `list`.
 * @param list The list of items to transform.
 * @returns The transformed items.
 */
function _map<TArg, TResult>(
  mapFn: (arg: TArg) => TResult,
  list: Iterable<TArg>,
): Iterable<TResult> {
  const result = [];
  for (const item of list) {
    const mappedItem = mapFn(item);
    result.push(mappedItem);
  }

  return result;
}

/**
 * Merge two {@link Map}s into one map. The key-value pairs of the second map
 * take precedence.
 *
 * @example
 * const map1 = new Map([["a", 1], ["b", 2]]);
 * const map2 = new Map([["c", 3], ["d", 4]]);
 * merge(map1, map2);
 * // => Map(4) { 'a' => 1, 'b' => 2, 'c' => 3, 'd' => 4 }
 * @param map1 The first {@link Map}.
 * @param map2 The second {@link Map}.
 * @returns A map with the key-value pairs of `map1` and `map2`.
 */
function merge2<TKey, TValue>(
  map1: ReadonlyMap<TKey, TValue>,
  map2: ReadonlyMap<TKey, TValue>,
): Map<TKey, TValue> {
  const result = new Map<TKey, TValue>();
  map1.forEach((value, key) => result.set(key, value));
  map2.forEach((value, key) => result.set(key, value));
  return result;
}

/**
 * Merge n {@link Map}s into one map. The key-value pairs of the map `x + 1`
 * take precedence over those of map `x`.
 *
 * @example
 * const map1 = new Map([["a", 1], ["b", 2]]);
 * const map2 = new Map([["c", 3], ["d", 4]]);
 * const map3 = new Map([["e", 5], ["f", 6]]);
 * merge([map1, map2, map3]);
 * // => Map(4) { 'a' => 1, 'b' => 2, 'c' => 3, 'd' => 4, 'e' => 5, 'f' => 6 }
 * @param maps The {@link Map}s to merge.
 * @returns A map with the key-value pairs of the `maps`.
 */
function merge<TKey, TValue>(
  maps: Iterable<ReadonlyMap<TKey, TValue>>,
): Map<TKey, TValue> {
  return reduce(merge2, new Map(), maps);
}

/**
 * Negate a boolean value.
 *
 * @example
 * const val = true;
 * not(val);
 * // => false
 * @param value The value to negate.
 * @returns `true` if the value is `false`, `false` otherwise.
 */
function not(
  value: boolean,
): boolean {
  return !value;
}

/**
 * Convert a binary function into a (left-to-right) partially applicable binary
 * function.
 *
 * @example
 * const f = (a, b) => a + b;
 * const g = partial2(f);
 * g(1)(2);
 * // => 3
 * @param fn The function to convert.
 * @returns The converted function.
 */
function partial2<TArg0, TArg1, TResult>(
  fn: (arg0: TArg0, arg1: TArg1) => TResult,
): (arg0: TArg0) => (arg1: TArg1) => TResult {
  return (arg0: TArg0) => {
    return (arg1: TArg1) => fn(arg0, arg1);
  };
}

/**
 * Convert a quaternary function into a (left-to-right) partially applicable
 * quaternary function.
 *
 * @example
 * const f = (a, b, c, d) => a + b + c + d;
 * const g = partial4(f);
 * g(1, 2, 3)(4);
 * // => 10
 * @param fn The function to convert.
 * @returns The converted function.
 */
function partial4<TArg0, TArg1, TArg2, TArg3, TResult>(
  fn: (arg0: TArg0, arg1: TArg1, arg2: TArg2, arg3: TArg3) => TResult,
): (arg0: TArg0, arg1: TArg1, arg2: TArg2) => (arg3: TArg3) => TResult {
  return (arg0: TArg0, arg1: TArg1, arg2: TArg2) => {
    return (arg3: TArg3) => fn(arg0, arg1, arg2, arg3);
  };
}

/**
 * Convert a binary function into a right-to-left partially applicable binary
 * function.
 *
 * @example
 * const f = (a, b) => `${a}${b}`;
 * const g = partialRight2(f);
 * g("foo")("bar");
 * // => "barfoo"
 * @param fn The function to convert.
 * @returns The converted function.
 */
function partialRight2<TArg0, TArg1, TResult>(
  fn: (arg0: TArg0, arg1: TArg1) => TResult,
): (arg1: TArg1) => (arg0: TArg0) => TResult {
  return (arg1: TArg1) => {
    return (arg0: TArg0) => fn(arg0, arg1);
  };
}

/**
 * Performs a left-to-right composition of a series of functions. The first
 * function may have any arity; the remaining functions must be unary.
 *
 * @example
 * const add = (x, y) => x + y;
 * const double = (x) => x * 2;
 * const fn = pipe(add, double);
 * fn(1, 1);
 * // => 4
 * @param fns The functions to pipe.
 * @returns A function.
 */
function pipe<TArgs extends any[], TResult>(
  ...fns: [
    fnFirst: (...args: TArgs) => any,
    ...fns: Array<(arg: any) => any>,
    fnLast: (arg: any) => TResult,
  ]
) {
  return (...args: TArgs) => {
    const [initialFn, ...restFns] = fns;
    const initialValue = initialFn(...args);
    return reduce(
      (acc, fn) => fn(acc),
      initialValue,
      restFns,
    );
  };
}

/**
 * Recursively call a function until some condition is met.
 *
 * @param fn The function to recurse.
 * @param nextFn A function to map outputs of `fn` to inputs of `fn`.
 * @param predicateFn A function to determine if recursion should stop.
 * @returns A list with the results of recursively calling `fn`.
 */
function recurse<TArg, TIntermediate extends TArg, TResult>(
  fn: (val: TArg) => TResult,
  nextFn: (val: TResult) => TIntermediate,
  predicateFn: (val: TIntermediate) => boolean,
) {
  return (val: TArg): Iterable<TResult> => {
    const out = fn(val);
    const nextVal = nextFn(out);
    const result = predicateFn(nextVal)
      ? recurse(fn, nextFn, predicateFn)(nextVal)
      : [];
    return [out, ...result];
  };
}

/**
 * Compute a single item by iterating through the list, successively calling the
 * iterator function and passing it an accumulator value and the current value
 * from the list.
 *
 * See also {@link reduceBy}.
 *
 * @example
 * const reduceFn = (acc, cur) => acc + cur;
 * const initialValue = 0;
 * const list = [1, 2, 3];
 * reduce(reduceFn, initialValue, list);
 * // => 6
 * @param reduceFn The iterator function.
 * @param initialValue The initial value.
 * @param list The list to reduce.
 * @returns The reduced value.
 */
function reduce<TArg, TResult>(
  reduceFn: (accumulator: TResult, currentValue: TArg) => TResult,
  initialValue: TResult,
  list: Iterable<TArg>,
): TResult {
  let acc = initialValue;
  for (const currentValue of list) {
    acc = reduceFn(acc, currentValue);
  }

  return acc;
}

/**
 * Compute values by iterating through the list, successively calling the
 * iterator function and passing it an accumulator value and the current value
 * from the list, grouped by keys.
 *
 * See also {@link reduce}.
 *
 * @example
 * const reduceFn = (acc, cur) => acc + cur.v;
 * const initialValue = 0;
 * const keyFn = (cur) => cur.g;
 * const list = [{g: "a", v: 1}, {g: "b", v: 2}, {g: "a", v: 3}];
 * reduceBy(reduceFn, initialValue, list);
 * // => Map(2) { 'a' => 4, 'b' => 2 }
 * @param reduceFn The iterator function.
 * @param initialValue The initial value.
 * @param keyFn The function to map the list elements to keys.
 * @param list The list to reduce.
 * @returns The reduced values.
 */
function _reduceBy<TArg, TKey, TValue>(
  reduceFn: (acc: TValue, item: TArg) => TValue,
  initialValue: TValue,
  keyFn: (item: TArg) => TKey,
  list: Iterable<TArg>,
): Map<TKey, TValue> {
  const result = new Map();
  for (const item of list) {
    const key = keyFn(item);
    const acc = result.has(key)
      ? result.get(key)
      : initialValue;
    const newAcc = reduceFn(acc, item);
    result.set(key, newAcc);
  }

  return result;
}

/**
 * Reverse the order of a list.
 *
 * @example
 * const list = [1, 2, 3];
 * reverse(list);
 * // => [3, 2, 1]
 * @param list The list to reverse.
 * @returns The list in reversed order.
 */
function reverse<T>(
  list: T[],
): T[] {
  return list.reverse();
}

/**
 * Take an n-ary function and convert it into a unary function that accepts an
 * array of n values and applies that to the function.
 *
 * @example
 * const fn = (a, b) => a + b;
 * const spreadFn = spread(fn);
 * spreadFn([1, 2]);
 * // => 3
 * @param fn The function.
 * @returns A function.
 */
function spread<TArg0, TArg1, TResult>(
  fn: (arg0: TArg0, arg1: TArg1) => TResult,
): ([arg0, arg1]: [TArg0, TArg1]) => TResult {
  return (args) => fn(...args);
}

/**
 * Take a function producing lists and convert it into a function that reduces
 * output lists into a single list.
 *
 * @example
 * const fn = (x) => [x, x+1];
 * const reduceFn = toListReducer(fn);
 * const list = [1, 3];
 * reduce(reduceFn, [], list);
 * // => [1, 2, 3, 4]
 * @param fn The function to convert.
 * @returns A reducer function based on `fn`.
 */
function toListReducer<TArg, TResult>(
  fn: (arg: TArg) => Iterable<TResult>,
) {
  return (
    acc: Iterable<TResult>,
    arg: TArg,
  ): Iterable<TResult> => [
    ...acc,
    ...fn(arg),
  ];
}

/**
 * Obtain the values of a {@link Map}.
 *
 * @example
 * const m = new Map([["a", 1], ["b", 2]]);
 * values(m);
 * // => [1, 2]
 * @param m The map to get values from.
 * @returns The values of `m`..
 */
function values<T>(
  m: ReadonlyMap<unknown, T>,
): Iterable<T> {
  return m.values();
}

const flatMap = partial2(_flatMap);
const map = partial2(_map);
const reduceBy = partial4(_reduceBy);

export {
  crossProduct,
  first,
  flatMap,
  flatten,
  empty,
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
};
