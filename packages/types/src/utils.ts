/**
 * A collection of values. For example an {@link Array} or {@link Set}.
 *
 * @since v0.1.26
 */
type Collection<T> = Array<T> | Set<T>;

/**
 * A readonly collection of values. For example a {@link ReadonlyArray} or
 * {@link ReadonlySet}.
 *
 * @since v0.1.26
 */
type ReadonlyCollection<T> = ReadonlyArray<T> | ReadonlySet<T>;

export type {
  Collection,
  ReadonlyCollection,
};
