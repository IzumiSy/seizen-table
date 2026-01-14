import { z } from "zod";
import {
  definePlugin,
  cellContextMenuItem,
} from "@izumisy/seizen-table/plugin";
import { FilterPluginPanel, GlobalSearchHeader } from "./component";

// =============================================================================
// Module Augmentation for EventBus
// =============================================================================

declare module "@izumisy/seizen-table/plugin" {
  interface EventBusRegistry {
    /**
     * Request to add a filter from context menu.
     * FilterPlugin subscribes to this to sync side panel state.
     */
    "filter:add-request": {
      columnKey: string;
      value: unknown;
    };
  }
}

/**
 * Schema for Filter plugin configuration
 */
const FilterPluginSchema = z.object({
  /** Width of the side panel */
  width: z.number().optional().default(320),
  /** Disable global search in header slot */
  disableGlobalSearch: z.boolean().optional().default(false),
});

// Re-export component utilities for testing
export { useFilterEvents } from "./component";

// =============================================================================
// Plugin Definition
// =============================================================================

/**
 * Filter Plugin
 *
 * Provides a side panel for adding column filters with type-aware operators.
 * Only columns with meta.filterType defined are filterable.
 *
 * Supported filter types:
 * - "string": Contains, Equals, Starts with, Ends with, Is empty, Is not empty
 * - "number": =, not equals, >, >=, <, <=
 * - "date": =, Before, After
 * - "enum": Is, Is not (requires meta.filterEnumValues)
 */
export const FilterPlugin = definePlugin({
  id: "filter",
  name: "Filter",
  args: FilterPluginSchema,
  slots: {
    sidePanel: {
      position: "right-sider",
      header: "Filters",
      render: FilterPluginPanel,
    },
    header: {
      render: GlobalSearchHeader,
    },
  },
  contextMenuItems: {
    cell: [
      cellContextMenuItem("filter-by-value", (ctx) => {
        const isFilterable = !!ctx.column.columnDef.meta?.filterType;
        const displayValue =
          ctx.value == null ? "(empty)" : String(ctx.value).slice(0, 20);
        return {
          label: `Filter by "${displayValue}"`,
          onClick: () => {
            ctx.emit("filter:add-request", {
              columnKey: ctx.column.id,
              value: ctx.value,
            });
          },
          visible: isFilterable && ctx.value != null,
        };
      }),
    ],
  },
});
