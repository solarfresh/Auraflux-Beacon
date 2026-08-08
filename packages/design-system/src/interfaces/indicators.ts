/**
 * Generic filter state type.
 * @template T Specific filter value type (defaults to string).
 */
export type FilterState<T extends string = string> = T;

/**
 * Generic sorter field type.
 * @template T Specific sorter field type (defaults to string).
 */
export type SorterState<T extends string = string> = T;

/**
 * Sort direction orientation type.
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Generic sort option object structure.
 */
export interface SortOption<TSorter extends string = string> {
  /** Sort key or field identifier */
  field: SorterState<TSorter>;
  /** Sort order direction */
  order?: SortOrder;
}

/**
 * Base selector state interface for toolbars and control panels.
 * @template TFilter Enum/Union type for filter option values.
 * @template TSorter Enum/Union type for sorter field values.
 */
export interface BaseSelectorState<
  TFilter extends string = string,
  TSorter extends string = string
> {
  /** Currently selected filter value */
  filter: FilterState<TFilter>;
  /** Currently selected sorter state (supports simple key or option object) */
  sorter: SorterState<TSorter> | SortOption<TSorter>;
  /** Optional search query keyword */
  search?: string;
}