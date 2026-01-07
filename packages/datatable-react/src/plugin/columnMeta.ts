/**
 * Column metadata types for TanStack Table integration.
 * This module provides type-safe column metadata for filter configuration.
 */

import type { RowData } from "@tanstack/react-table";

// =============================================================================
// Filter Types
// =============================================================================

/**
 * Filter type for a column - determines available operators and input UI
 */
export type FilterType = "string" | "number" | "date" | "enum";

/**
 * Filter operators for string type columns
 */
export type StringFilterOperator =
  | "contains"
  | "not_contains"
  | "equals"
  | "not_equals"
  | "starts_with"
  | "ends_with"
  | "is_empty"
  | "is_not_empty";

/**
 * Filter operators for number type columns
 */
export type NumberFilterOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte";

/**
 * Filter operators for date type columns
 */
export type DateFilterOperator = "eq" | "before" | "after";

/**
 * Filter operators for enum type columns
 */
export type EnumFilterOperator = "is" | "is_not";

/**
 * All filter operators
 */
export type FilterOperator =
  | StringFilterOperator
  | NumberFilterOperator
  | DateFilterOperator
  | EnumFilterOperator;

/**
 * Default operators for each filter type
 */
export const DEFAULT_FILTER_OPERATORS: Record<FilterType, FilterOperator[]> = {
  string: [
    "contains",
    "equals",
    "starts_with",
    "ends_with",
    "is_empty",
    "is_not_empty",
  ],
  number: ["eq", "neq", "gt", "gte", "lt", "lte"],
  date: ["eq", "before", "after"],
  enum: ["is", "is_not"],
};

/**
 * Human-readable labels for filter operators
 */
export const FILTER_OPERATOR_LABELS: Record<FilterOperator, string> = {
  // String operators
  contains: "Contains",
  not_contains: "Does not contain",
  equals: "Equals",
  not_equals: "Does not equal",
  starts_with: "Starts with",
  ends_with: "Ends with",
  is_empty: "Is empty",
  is_not_empty: "Is not empty",
  // Number operators
  eq: "=",
  neq: "≠",
  gt: ">",
  gte: "≥",
  lt: "<",
  lte: "≤",
  // Date operators (shared keys with number but different context)
  before: "Before",
  after: "After",
  // Enum operators
  is: "Is",
  is_not: "Is not",
};

// =============================================================================
// Column Filter Metadata
// =============================================================================

/**
 * Column filter metadata - used to configure filtering for a column.
 * Add this to your column's `meta` property.
 *
 * @example
 * ```tsx
 * const columns: ColumnDef<Person>[] = [
 *   {
 *     accessorKey: "name",
 *     header: "Name",
 *     meta: { filterType: "string" },
 *   },
 *   {
 *     accessorKey: "status",
 *     header: "Status",
 *     meta: {
 *       filterType: "enum",
 *       filterEnumValues: ["active", "inactive"],
 *     },
 *   },
 * ];
 * ```
 */
export interface ColumnFilterMeta {
  /** Filter type - determines available operators and input UI */
  filterType?: FilterType;
  /**
   * Custom operators to use instead of defaults.
   * If not provided, uses DEFAULT_FILTER_OPERATORS[filterType]
   */
  filterOperators?: FilterOperator[];
  /**
   * Enum values for enum type columns.
   * Required when filterType is "enum"
   */
  filterEnumValues?: string[];
}

// =============================================================================
// Module Augmentation for TanStack Table
// =============================================================================

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue>
    extends ColumnFilterMeta {}
}
