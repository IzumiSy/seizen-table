import { useState, useCallback } from "react";
import { z } from "zod";
import {
  definePlugin,
  usePluginContext,
  usePluginArgs,
  type FilterOperator,
} from "@izumisy/seizen-table/plugin";
import { GlobalSearchInput } from "../shared";

// =============================================================================
// Schema Definition
// =============================================================================

/**
 * Schema for a single filter condition
 */
const FilterConditionSchema = z.object({
  /** Column key to filter on */
  columnKey: z.string(),
  /** Filter operator */
  operator: z.enum([
    "contains",
    "not_contains",
    "equals",
    "not_equals",
    "starts_with",
    "ends_with",
    "is_empty",
    "is_not_empty",
    "eq",
    "neq",
    "gt",
    "gte",
    "lt",
    "lte",
    "is",
    "is_not",
    "before",
    "after",
    "on",
  ]) as z.ZodType<FilterOperator>,
  /** Filter value (not required for is_empty/is_not_empty) */
  value: z.string().optional().default(""),
});

/**
 * Schema for a preset filter group
 */
const PresetSchema = z.object({
  /** Unique identifier for the preset */
  id: z.string(),
  /** Display label for the preset button */
  label: z.string(),
  /** Array of filter conditions to apply */
  filters: z.array(FilterConditionSchema),
});

/**
 * Schema for PresetFilter plugin configuration
 */
const PresetFilterPluginSchema = z.object({
  /** Array of preset filter definitions */
  presets: z.array(PresetSchema),
  /** Label for the "All" button that clears filters */
  allLabel: z.string().optional().default("All"),
  /** Enable global search bar */
  enableGlobalSearch: z.boolean().optional().default(true),
  /** Placeholder text for global search */
  searchPlaceholder: z.string().optional().default("Search..."),
  /** Debounce delay for global search in ms */
  searchDebounceMs: z.number().optional().default(300),
});

type PresetFilterPluginConfig = z.infer<typeof PresetFilterPluginSchema>;
type Preset = z.infer<typeof PresetSchema>;

// =============================================================================
// Preset Button Component
// =============================================================================

interface PresetButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function PresetButton({ label, isActive, onClick }: PresetButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        fontSize: "13px",
        fontWeight: isActive ? 600 : 400,
        color: isActive ? "#fff" : "#374151",
        backgroundColor: isActive ? "#3b82f6" : "#fff",
        border: "1px solid",
        borderColor: isActive ? "#3b82f6" : "#d1d5db",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
      }}
      onMouseOver={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "#f3f4f6";
          e.currentTarget.style.borderColor = "#9ca3af";
        }
      }}
      onMouseOut={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "#fff";
          e.currentTarget.style.borderColor = "#d1d5db";
        }
      }}
    >
      {label}
    </button>
  );
}

// =============================================================================
// Main Header Component
// =============================================================================

function PresetFilterHeader() {
  const { table } = usePluginContext();
  const args = usePluginArgs<PresetFilterPluginConfig>();
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Apply preset filters
  const applyPreset = useCallback(
    (preset: Preset | null) => {
      if (preset === null) {
        // Clear all filters ("All" button)
        table.setFilter([]);
        setActivePresetId(null);
        return;
      }

      // Convert preset filters to TanStack Table's ColumnFiltersState format
      const columnFilters = preset.filters.map((filter) => ({
        id: filter.columnKey,
        value: {
          operator: filter.operator,
          value: filter.value,
        },
      }));

      table.setFilter(columnFilters);
      setActivePresetId(preset.id);
    },
    [table]
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "10px 12px",
        backgroundColor: "#f9fafb",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* Left side: Preset buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {/* "All" button to clear filters */}
        <PresetButton
          label={args.allLabel}
          isActive={activePresetId === null}
          onClick={() => applyPreset(null)}
        />

        {/* Preset buttons */}
        {args.presets.map((preset) => (
          <PresetButton
            key={preset.id}
            label={preset.label}
            isActive={activePresetId === preset.id}
            onClick={() => applyPreset(preset)}
          />
        ))}
      </div>

      {/* Right side: Global search */}
      {args.enableGlobalSearch && (
        <GlobalSearchInput
          placeholder={args.searchPlaceholder}
          debounceMs={args.searchDebounceMs}
        />
      )}
    </div>
  );
}

// =============================================================================
// Plugin Definition
// =============================================================================

/**
 * PresetFilter Plugin
 *
 * Provides a header bar with preset filter buttons and an optional global search.
 * Users can define named filter presets that can be quickly applied with a single click.
 *
 * @example
 * ```tsx
 * import { PresetFilterPlugin } from "@izumisy/seizen-table-plugins/preset-filter";
 *
 * // Define preset filters
 * const table = useSeizenTable({
 *   data,
 *   columns,
 *   plugins: [
 *     PresetFilterPlugin.configure({
 *       presets: [
 *         {
 *           id: "active",
 *           label: "Active",
 *           filters: [
 *             { columnKey: "status", operator: "equals", value: "active" },
 *           ],
 *         },
 *         {
 *           id: "high-value",
 *           label: "High Value",
 *           filters: [
 *             { columnKey: "amount", operator: "gte", value: "1000" },
 *           ],
 *         },
 *         {
 *           id: "recent",
 *           label: "Recent",
 *           filters: [
 *             { columnKey: "createdAt", operator: "after", value: "2024-01-01" },
 *           ],
 *         },
 *       ],
 *       allLabel: "Show All",
 *       enableGlobalSearch: true,
 *       searchPlaceholder: "Search orders...",
 *     }),
 *   ],
 * });
 * ```
 *
 * Filter Operators:
 * - String: "contains", "not_contains", "equals", "not_equals", "starts_with", "ends_with", "is_empty", "is_not_empty"
 * - Number: "eq", "neq", "gt", "gte", "lt", "lte"
 * - Date: "before", "after", "on"
 * - Enum: "is", "is_not"
 */
export const PresetFilterPlugin = definePlugin({
  id: "preset-filter",
  name: "Preset Filter",
  args: PresetFilterPluginSchema,
  slots: {
    header: {
      render: PresetFilterHeader,
    },
  },
});
