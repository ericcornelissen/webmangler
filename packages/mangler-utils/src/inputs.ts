/**
 * Return either the optional provided value, or a default value. Useful for
 * optional inputs.
 *
 * @param params The input parameters.
 * @param params.defaultValue The value in case no value was provided.
 * @param params.providedValue The value that was provided.
 * @returns The value.
 * @since v0.1.24
 */
function providedOrDefault<T>(params: {
  defaultValue: T,
  providedValue: T | null | undefined,
}): T {
  const { defaultValue, providedValue } = params;
  if (providedValue === null || providedValue === undefined) {
    return defaultValue;
  }

  return providedValue;
}

export {
  providedOrDefault,
};
