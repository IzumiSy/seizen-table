import { useState, useCallback, useMemo } from "react";
import {
  usePluginContext,
  usePluginArgs,
  DEFAULT_FILTER_OPERATORS,
  FILTER_OPERATOR_LABELS,
  type FilterOperator,
  type PluginColumnInfo,
} from "@izumisy/seizen-table/plugin";
import { GlobalSearchInput } from "../shared";

// =============================================================================
// Types
// =============================================================================

export interface FilterItem {
  id: string;
  columnKey: string;
  columnHeader: string;
  operator: FilterOperator;
  value: string;
}

export interface FilterPluginConfig {
  width: number;
  disableGlobalSearch: boolean;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Generate a unique ID for a filter item
 */
export function generateFilterId(): string {
  return `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get available operators for a column based on its filter type
 */
export function getOperatorsForColumn(
  column: PluginColumnInfo
): FilterOperator[] {
  if (!column.filterMeta?.filterType) return [];
  const { filterType, filterOperators } = column.filterMeta;
  return filterOperators ?? DEFAULT_FILTER_OPERATORS[filterType];
}

/**
 * Get default operator for a filter type
 */
export function getDefaultOperator(column: PluginColumnInfo): FilterOperator {
  const operators = getOperatorsForColumn(column);
  return operators[0] ?? "contains";
}

/**
 * Check if an operator requires a value input
 */
export function operatorRequiresValue(operator: FilterOperator): boolean {
  return operator !== "is_empty" && operator !== "is_not_empty";
}

// =============================================================================
// Value Input Component
// =============================================================================

interface ValueInputProps {
  column: PluginColumnInfo;
  operator: FilterOperator;
  value: string;
  onChange: (value: string) => void;
}

export function ValueInput({
  column,
  operator,
  value,
  onChange,
}: ValueInputProps) {
  const filterMeta = column.filterMeta;
  if (!filterMeta) return null;

  // No input needed for is_empty / is_not_empty
  if (!operatorRequiresValue(operator)) {
    return null;
  }

  const { filterType, filterEnumValues } = filterMeta;

  // Enum type: render select dropdown
  if (filterType === "enum" && filterEnumValues) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          minWidth: 0,
          padding: "6px 8px",
          fontSize: "13px",
          border: "1px solid #e5e7eb",
          borderRadius: "4px",
          backgroundColor: "#fff",
          cursor: "pointer",
        }}
      >
        <option value="">Select...</option>
        {filterEnumValues.map((enumValue) => (
          <option key={enumValue} value={enumValue}>
            {enumValue}
          </option>
        ))}
      </select>
    );
  }

  // Date type: render date input
  if (filterType === "date") {
    return (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          minWidth: 0,
          padding: "6px 8px",
          fontSize: "13px",
          border: "1px solid #e5e7eb",
          borderRadius: "4px",
        }}
      />
    );
  }

  // Number type: render number input
  if (filterType === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Value..."
        style={{
          flex: 1,
          minWidth: 0,
          padding: "6px 8px",
          fontSize: "13px",
          border: "1px solid #e5e7eb",
          borderRadius: "4px",
        }}
      />
    );
  }

  // String type (default): render text input
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Value..."
      style={{
        flex: 1,
        minWidth: 0,
        padding: "6px 8px",
        fontSize: "13px",
        border: "1px solid #e5e7eb",
        borderRadius: "4px",
      }}
    />
  );
}

// =============================================================================
// Filter Item Component
// =============================================================================

interface FilterItemRowProps {
  filter: FilterItem;
  column: PluginColumnInfo;
  onOperatorChange: (operator: FilterOperator) => void;
  onValueChange: (value: string) => void;
  onRemove: () => void;
}

export function FilterItemRow({
  filter,
  column,
  onOperatorChange,
  onValueChange,
  onRemove,
}: FilterItemRowProps) {
  const operators = getOperatorsForColumn(column);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "12px",
        borderRadius: "6px",
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* Header row: column name + remove button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#111827",
          }}
        >
          {filter.columnHeader}
        </span>
        <button
          onClick={onRemove}
          style={{
            padding: "2px 6px",
            fontSize: "14px",
            color: "#9ca3af",
            background: "none",
            border: "none",
            cursor: "pointer",
            lineHeight: 1,
          }}
          title="Remove filter"
        >
          ×
        </button>
      </div>

      {/* Operator + Value row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* Operator selector */}
        <select
          value={filter.operator}
          onChange={(e) => onOperatorChange(e.target.value as FilterOperator)}
          style={{
            padding: "6px 8px",
            fontSize: "13px",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            backgroundColor: "#f9fafb",
            cursor: "pointer",
            minWidth: "100px",
          }}
        >
          {operators.map((op) => (
            <option key={op} value={op}>
              {FILTER_OPERATOR_LABELS[op]}
            </option>
          ))}
        </select>

        {/* Value input */}
        <ValueInput
          column={column}
          operator={filter.operator}
          value={filter.value}
          onChange={onValueChange}
        />
      </div>
    </div>
  );
}

// =============================================================================
// Filter Events Hook
// =============================================================================

interface UseFilterEventsOptions {
  filters: FilterItem[];
  addFilterWithValue: (
    columnKey: string,
    value?: unknown
  ) => FilterItem | undefined;
}

/**
 * Hook that subscribes to filter events from context menu.
 * Extracted for testability with renderHook.
 */
export function useFilterEvents({
  filters,
  addFilterWithValue,
}: UseFilterEventsOptions) {
  const { table, useEvent } = usePluginContext();

  // Subscribe to filter:add-request event (from context menu)
  useEvent("filter:add-request", (payload) => {
    const { columnKey, value } = payload;
    const newFilter = addFilterWithValue(columnKey, value);
    if (newFilter && value != null) {
      // Auto-apply when coming from context menu
      const columnFilters = [
        ...filters.filter((f) => f.columnKey !== columnKey),
        newFilter,
      ]
        .filter((f) => {
          if (!operatorRequiresValue(f.operator)) return true;
          return f.value !== "";
        })
        .map((f) => ({
          id: f.columnKey,
          value: {
            operator: f.operator,
            value: f.value,
          },
        }));
      table.setFilter(columnFilters);
    }
  });
}

// =============================================================================
// Filter Panel Component
// =============================================================================

export function FilterPanel() {
  const { columns, table } = usePluginContext();
  const [filters, setFilters] = useState<FilterItem[]>([]);

  // Get columns that have filterMeta defined
  const filterableColumns = useMemo(() => {
    return columns.filter((col) => col.filterMeta !== undefined);
  }, [columns]);

  // Get columns not currently being filtered
  const availableColumns = useMemo(() => {
    const filteredColumnKeys = new Set(filters.map((f) => f.columnKey));
    return filterableColumns.filter((col) => !filteredColumnKeys.has(col.key));
  }, [filterableColumns, filters]);

  // Add a new filter with optional value (for context menu)
  const addFilterWithValue = useCallback(
    (columnKey: string, value?: unknown) => {
      const column = filterableColumns.find((col) => col.key === columnKey);
      if (!column) return;

      const newFilter: FilterItem = {
        id: generateFilterId(),
        columnKey,
        columnHeader: column.header,
        operator: "equals",
        value: value != null ? String(value) : "",
      };

      setFilters((prev) => [...prev, newFilter]);
      return newFilter;
    },
    [filterableColumns]
  );

  // Add a new filter (without value)
  const addFilter = useCallback(
    (columnKey: string) => {
      const column = filterableColumns.find((col) => col.key === columnKey);
      if (!column) return;

      const newFilter: FilterItem = {
        id: generateFilterId(),
        columnKey,
        columnHeader: column.header,
        operator: getDefaultOperator(column),
        value: "",
      };

      setFilters((prev) => [...prev, newFilter]);
    },
    [filterableColumns]
  );

  // Subscribe to events from context menu
  useFilterEvents({
    filters,
    addFilterWithValue,
  });

  // Remove a filter
  const removeFilter = useCallback((filterId: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== filterId));
  }, []);

  // Update filter operator
  const updateOperator = useCallback(
    (filterId: string, operator: FilterOperator) => {
      setFilters((prev) =>
        prev.map((f) => (f.id === filterId ? { ...f, operator } : f))
      );
    },
    []
  );

  // Update filter value
  const updateValue = useCallback((filterId: string, value: string) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === filterId ? { ...f, value } : f))
    );
  }, []);

  // Clear all filters
  const clearAll = useCallback(() => {
    setFilters([]);
    table.setFilter([]);
  }, [table]);

  // Apply filters to table
  const applyFilters = useCallback(() => {
    // Convert our filter items to TanStack Table's ColumnFiltersState format
    // Each filter becomes { id: columnKey, value: { operator, value } }
    const columnFilters = filters
      .filter((f) => {
        // Skip filters without values (unless operator doesn't need value)
        if (!operatorRequiresValue(f.operator)) return true;
        return f.value !== "";
      })
      .map((f) => ({
        id: f.columnKey,
        value: {
          operator: f.operator,
          value: f.value,
        },
      }));

    table.setFilter(columnFilters);
  }, [filters, table]);

  // Check if there are unapplied changes
  const hasFilters = filters.length > 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Add filter dropdown */}
      <div style={{ marginBottom: "12px" }}>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) {
              addFilter(e.target.value);
            }
          }}
          disabled={availableColumns.length === 0}
          style={{
            width: "100%",
            padding: "8px 12px",
            fontSize: "14px",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            outline: "none",
            boxSizing: "border-box",
            backgroundColor: "#fff",
            cursor: availableColumns.length === 0 ? "not-allowed" : "pointer",
            opacity: availableColumns.length === 0 ? 0.6 : 1,
          }}
        >
          <option value="">+ Add filter...</option>
          {availableColumns.map((column) => (
            <option key={column.key} value={column.key}>
              {column.header}
            </option>
          ))}
        </select>
      </div>

      {/* Filter list */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        {hasFilters ? (
          <>
            {/* Header with clear all */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span
                style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}
              >
                Active filters (AND)
              </span>
              <button
                onClick={clearAll}
                style={{
                  fontSize: "12px",
                  color: "#ef4444",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 6px",
                }}
              >
                Clear all
              </button>
            </div>

            {/* Filter items */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {filters.map((filter) => {
                const column = filterableColumns.find(
                  (col) => col.key === filter.columnKey
                );
                if (!column) return null;

                return (
                  <FilterItemRow
                    key={filter.id}
                    filter={filter}
                    column={column}
                    onOperatorChange={(op) => updateOperator(filter.id, op)}
                    onValueChange={(val) => updateValue(filter.id, val)}
                    onRemove={() => removeFilter(filter.id)}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            <div style={{ marginBottom: "8px" }}>No filters applied</div>
            <div style={{ fontSize: "12px" }}>
              {filterableColumns.length > 0
                ? "Select a column above to add a filter"
                : "No filterable columns configured"}
            </div>
          </div>
        )}
      </div>

      {/* Apply button */}
      {hasFilters && (
        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            padding: "12px 0 0 0",
            marginTop: "12px",
          }}
        >
          <button
            onClick={applyFilters}
            style={{
              width: "100%",
              padding: "10px 16px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#fff",
              backgroundColor: "#3b82f6",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#2563eb")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#3b82f6")
            }
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Global Search Header Component
// =============================================================================

export function GlobalSearchHeader() {
  const args = usePluginArgs<FilterPluginConfig>();

  // If global search is disabled, render nothing
  if (args.disableGlobalSearch) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        backgroundColor: "#f9fafb",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <GlobalSearchInput
        placeholder="Search all columns..."
        debounceMs={300}
        width="100%"
        variant="default"
      />
    </div>
  );
}

// =============================================================================
// Main Panel Component
// =============================================================================

export function FilterPluginPanel() {
  const args = usePluginArgs<FilterPluginConfig>();

  return (
    <div
      style={{
        width: args.width,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <FilterPanel />
    </div>
  );
}
