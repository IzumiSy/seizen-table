import { z } from "zod";
import {
  definePlugin,
  usePluginContext,
  columnContextMenuItem,
} from "@izumisy/seizen-table/plugin";
import { ColumnControlPanel } from "./component";

// =============================================================================
// Module Augmentation for EventBus
// =============================================================================

declare module "@izumisy/seizen-table/plugin" {
  interface EventBusRegistry {
    /**
     * Request to hide a column from context menu.
     * ColumnControlPlugin subscribes to this to sync side panel state.
     */
    "column:hide-request": {
      columnId: string;
    };
    /**
     * Request to sort a column from context menu.
     * ColumnControlPlugin subscribes to this to sync side panel state.
     */
    "column:sort-request": {
      columnId: string;
      direction: "asc" | "desc" | "clear";
    };
  }
}

/**
 * Schema for ColumnControl plugin configuration
 */
const ColumnControlSchema = z.object({
  /** Width of the side panel */
  width: z.number().default(280),
});

// =============================================================================
// Event Handlers Component
// =============================================================================

/**
 * Component that sets up event subscriptions.
 * Must be rendered within PluginContext.
 */
function EventHandlers({ children }: { children: React.ReactNode }) {
  const { table, useEvent } = usePluginContext();

  // Subscribe to column:hide-request event (from context menu)
  useEvent("column:hide-request", (payload) => {
    const { columnId } = payload;
    table.setColumnVisibility({
      ...table.getColumnVisibility(),
      [columnId]: false,
    });
  });

  // Subscribe to column:sort-request event (from context menu)
  useEvent("column:sort-request", (payload) => {
    const { columnId, direction } = payload;
    const currentSorting = table.getSortingState();
    if (direction === "clear") {
      const newSorting = currentSorting.filter((s) => s.id !== columnId);
      table.setSorting(newSorting);
    } else {
      const existingIndex = currentSorting.findIndex((s) => s.id === columnId);
      if (existingIndex >= 0) {
        const newSorting = currentSorting.map((s) =>
          s.id === columnId ? { ...s, desc: direction === "desc" } : s
        );
        table.setSorting(newSorting);
      } else {
        const newSorting = [
          ...currentSorting,
          { id: columnId, desc: direction === "desc" },
        ];
        table.setSorting(newSorting);
      }
    }
  });

  return <>{children}</>;
}

// =============================================================================
// Main Panel Wrapper
// =============================================================================

/**
 * Wraps ColumnControlPanel with event subscriptions.
 */
function ColumnControlPanelWithEvents() {
  return (
    <EventHandlers>
      <ColumnControlPanel />
    </EventHandlers>
  );
}

// =============================================================================
// Plugin Definition
// =============================================================================

/**
 * ColumnControl Plugin
 *
 * Provides a side panel with two tabs:
 * - Visibility: Toggle column visibility and reorder columns via drag & drop
 * - Sorter: Add/remove sorting per column with asc/desc control and drag & drop priority
 *
 * @example
 * ```tsx
 * import { ColumnControlPlugin } from "@izumisy/seizen-table-plugins/column-control";
 *
 * const table = useSeizenTable({
 *   data,
 *   columns,
 *   plugins: [ColumnControlPlugin.configure({ width: 280 })],
 * });
 * ```
 */
export const ColumnControlPlugin = definePlugin({
  id: "column-control",
  name: "Columns",
  args: ColumnControlSchema,
  slots: {
    sidePanel: {
      position: "right-sider",
      header: "Column Settings",
      render: ColumnControlPanelWithEvents,
    },
  },
  contextMenuItems: {
    column: [
      columnContextMenuItem("hide-column", (ctx) => ({
        label: "Hide column",
        onClick: () => {
          ctx.emit("column:hide-request", { columnId: ctx.column.id });
        },
        visible: ctx.column.getCanHide(),
      })),
      columnContextMenuItem("sort-asc", (ctx) => ({
        label: "Sort ascending",
        onClick: () => {
          ctx.emit("column:sort-request", {
            columnId: ctx.column.id,
            direction: "asc",
          });
        },
        visible: ctx.column.getCanSort(),
      })),
      columnContextMenuItem("sort-desc", (ctx) => ({
        label: "Sort descending",
        onClick: () => {
          ctx.emit("column:sort-request", {
            columnId: ctx.column.id,
            direction: "desc",
          });
        },
        visible: ctx.column.getCanSort(),
      })),
      columnContextMenuItem("clear-sort", (ctx) => ({
        label: "Clear sort",
        onClick: () => {
          ctx.emit("column:sort-request", {
            columnId: ctx.column.id,
            direction: "clear",
          });
        },
        visible: ctx.column.getCanSort() && ctx.column.getIsSorted() !== false,
      })),
    ],
  },
});
