/**
 * A functions that checks the validity of the implementation of some interface.
 */
type Check<T> = (Plugin: T) => string | null;

/**
 * A collection of functions that checks the validity of the implementation of
 * some interface.
 */
type Checks<T> = Iterable<Check<T>>;

/**
 * Create a function to check the validity of the implementation of some
 * interface.
 *
 * @param checks The checks.
 * @returns A function that uses `checks` to validate a plugin.
 */
function newCheckAll<T>(
  checks: Checks<T>,
) {
  return (subject: T): [boolean, string] => {
    for (const check of checks) {
      const response = check(subject);
      if (response) return [false, response];
    }

    return [true, ""];
  };
}

export {
  newCheckAll,
};
