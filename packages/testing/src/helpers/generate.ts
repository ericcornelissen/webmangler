import type { TestValues, TestValuesSets } from "../types";

/**
 * Generate key-value objects from a key-(many values) object.
 *
 * @param valuesSource The source of possible values.
 * @yields An object for all possible combinations of values in the input.
 * @since v0.1.5
 */
function* generateValueObjects<KeyName extends string>(
  valuesSource: TestValuesSets<KeyName>,
): IterableIterator<TestValues<KeyName>> {
  const entry = Object.entries(valuesSource).pop();
  if (entry === undefined) {
    yield { } as TestValues<KeyName>;
  } else {
    const [key, values] = entry as [KeyName, string[]];

    const clone = Object.assign({ }, valuesSource);
    delete clone[key];

    for (const value of values) {
      for (const obj of generateValueObjects(clone)) {
        yield Object.assign({ [key]: value }, obj);
      }
    }
  }
}

/**
 * Generate arrays of key-value objects from arrays of key-(many values) object.
 *
 * @param valuesSources Any number of sources of possible values.
 * @yields All possible combinations of objects for each entry in the input.
 * @since v0.1.5
 */
function* generateValueObjectsAll<KeyName extends string>(
  valuesSources: Iterable<TestValuesSets<KeyName>>,
): IterableIterator<Iterable<TestValues<KeyName>>> {
  const clone = Array.from(valuesSources);
  const current = clone.shift();
  if (current === undefined) {
    yield [];
  } else {
    for (const instance of generateValueObjects(current)) {
      for (const otherInstances of generateValueObjectsAll(clone)) {
        yield [instance, ...otherInstances];
      }
    }
  }
}

export {
  generateValueObjects,
  generateValueObjectsAll,
};
