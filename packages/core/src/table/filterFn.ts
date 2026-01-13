/**
 * Custom filter function for TanStack Table.
 * Handles filter values in the format { operator, value } from FilterPlugin.
 */

import type { FilterFn } from "@tanstack/react-table";
import type { FilterOperator } from "../plugin/columnMeta";

/**
 * Filter value format used by FilterPlugin
 */
export interface PluginFilterValue {
  operator: FilterOperator;
  value: string;
}

/**
 * Type guard to check if a filter value is from FilterPlugin
 */
function isPluginFilterValue(value: unknown): value is PluginFilterValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "operator" in value &&
    "value" in value
  );
}

/**
 * Custom filter function that handles FilterPlugin's operator-based filtering.
 * Falls back to default includes behavior for non-plugin filter values.
 */
export const pluginFilterFn: FilterFn<unknown> = (
  row,
  columnId,
  filterValue
) => {
  // If not a plugin filter value, fall back to default includes behavior
  if (!isPluginFilterValue(filterValue)) {
    const cellValue = row.getValue(columnId);
    return String(cellValue ?? "")
      .toLowerCase()
      .includes(String(filterValue).toLowerCase());
  }

  const { operator, value } = filterValue;
  const cellValue = row.getValue(columnId);

  // Handle empty check operators (no value needed)
  if (operator === "is_empty") {
    return cellValue === null || cellValue === undefined || cellValue === "";
  }
  if (operator === "is_not_empty") {
    return cellValue !== null && cellValue !== undefined && cellValue !== "";
  }

  // String operators
  if (
    operator === "contains" ||
    operator === "not_contains" ||
    operator === "equals" ||
    operator === "not_equals" ||
    operator === "starts_with" ||
    operator === "ends_with"
  ) {
    const cellStr = String(cellValue ?? "").toLowerCase();
    const filterStr = value.toLowerCase();

    switch (operator) {
      case "contains":
        return cellStr.includes(filterStr);
      case "not_contains":
        return !cellStr.includes(filterStr);
      case "equals":
        return cellStr === filterStr;
      case "not_equals":
        return cellStr !== filterStr;
      case "starts_with":
        return cellStr.startsWith(filterStr);
      case "ends_with":
        return cellStr.endsWith(filterStr);
    }
  }

  // Number operators
  if (
    operator === "eq" ||
    operator === "neq" ||
    operator === "gt" ||
    operator === "gte" ||
    operator === "lt" ||
    operator === "lte"
  ) {
    const cellNum = Number(cellValue);
    const filterNum = Number(value);

    if (isNaN(cellNum) || isNaN(filterNum)) {
      return false;
    }

    switch (operator) {
      case "eq":
        return cellNum === filterNum;
      case "neq":
        return cellNum !== filterNum;
      case "gt":
        return cellNum > filterNum;
      case "gte":
        return cellNum >= filterNum;
      case "lt":
        return cellNum < filterNum;
      case "lte":
        return cellNum <= filterNum;
    }
  }

  // Date operators
  if (operator === "before" || operator === "after") {
    const cellDate = new Date(cellValue as string);
    const filterDate = new Date(value);

    if (isNaN(cellDate.getTime()) || isNaN(filterDate.getTime())) {
      return false;
    }

    switch (operator) {
      case "before":
        return cellDate < filterDate;
      case "after":
        return cellDate > filterDate;
    }
  }

  // Enum operators (is/is_not) - case-insensitive comparison
  if (operator === "is" || operator === "is_not") {
    const cellStr = String(cellValue ?? "").toLowerCase();
    const filterStr = value.toLowerCase();

    switch (operator) {
      case "is":
        return cellStr === filterStr;
      case "is_not":
        return cellStr !== filterStr;
    }
  }

  // Default: no match
  return false;
};

// Make it auto-removable when filter value is empty
pluginFilterFn.autoRemove = (val) => {
  if (!isPluginFilterValue(val)) {
    return !val || val === "";
  }
  // Don't auto-remove for is_empty/is_not_empty operators
  if (val.operator === "is_empty" || val.operator === "is_not_empty") {
    return false;
  }
  return !val.value || val.value === "";
};
