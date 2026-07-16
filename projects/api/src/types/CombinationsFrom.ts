type Combinations<T extends readonly string[]> = T extends
  readonly [infer F extends string, ...infer R extends string[]]
  ? F | `${F},${Combinations<R>}` | Combinations<R>
  : never;

/** The combinations from type. */
export type CombinationsFrom<T extends string[]> = Combinations<T>;
