import { useState } from "react";
import { z } from "zod";
import {
  definePlugin,
  usePluginContext,
  type PluginContext,
} from "@izumisy/seizen-datatable-react/plugin";
import type { Cell, Row } from "@izumisy/seizen-datatable-react";

// =============================================================================
// Module Augmentation for Type-Safe Plugin Args
// =============================================================================

declare module "@izumisy/seizen-datatable-react/plugin" {
  interface PluginArgsRegistry {
    "all-slots-demo": { id: number };
  }
}

/**
 * Schema for AllSlotsDemo plugin configuration
 */
const AllSlotsDemoSchema = z.object({
  /** Label shown in sidepanel */
  sidepanelTitle: z.string().default("All Slots Demo"),
  /** Whether to enable cell highlighting */
  enableCellHighlight: z.boolean().default(true),
  /** Primary color for styling */
  primaryColor: z.string().default("#3b82f6"),
});

type AllSlotsDemoConfig = z.infer<typeof AllSlotsDemoSchema>;

// =============================================================================
// Slot Renderers
// =============================================================================

/**
 * SidePanel slot - Shows plugin info and controls
 */
function createSidePanelRenderer(context: PluginContext<AllSlotsDemoConfig>) {
  const { args } = context;

  return function SidePanelContent() {
    const { data, selectedRows, useEvent } =
      usePluginContext<"all-slots-demo">();
    const [clickCount, setClickCount] = useState(0);

    useEvent("row-click", () => {
      setClickCount((c) => c + 1);
    });

    return (
      <div style={{ padding: "16px", width: 280 }}>
        <h4 style={{ margin: "0 0 16px", color: args.primaryColor }}>
          {args.sidepanelTitle}
        </h4>

        <div style={{ marginBottom: "12px" }}>
          <strong>Stats:</strong>
          <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
            <li>Total rows: {(data as unknown[]).length}</li>
            <li>Selected rows: {selectedRows.length}</li>
            <li>Row clicks: {clickCount}</li>
          </ul>
        </div>

        <div
          style={{
            padding: "12px",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        >
          <strong>About this plugin:</strong>
          <p style={{ margin: "8px 0 0" }}>
            This plugin demonstrates all 5 slot types: sidepanel, header,
            footer, cell, and inlineRow.
          </p>
        </div>
      </div>
    );
  };
}

/**
 * Header slot - Renders between table header and body
 */
function createHeaderRenderer(context: PluginContext<AllSlotsDemoConfig>) {
  const { args } = context;

  return function HeaderContent() {
    const { data, selectedRows } = usePluginContext();

    return (
      <div
        style={{
          padding: "8px 12px",
          backgroundColor: args.primaryColor + "10",
          borderLeft: `3px solid ${args.primaryColor}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "13px",
        }}
      >
        <span>
          📊 Showing <strong>{(data as unknown[]).length}</strong> records
        </span>
        {selectedRows.length > 0 && (
          <span style={{ color: args.primaryColor }}>
            ✓ {selectedRows.length} selected
          </span>
        )}
      </div>
    );
  };
}

/**
 * Footer slot - Renders below the table
 */
function createFooterRenderer(context: PluginContext<AllSlotsDemoConfig>) {
  const { args } = context;

  return function FooterContent() {
    const { columns } = usePluginContext();

    return (
      <div
        style={{
          padding: "12px",
          backgroundColor: "#f9fafb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "12px",
          color: "#6b7280",
        }}
      >
        <span>Columns: {columns.map((c) => c.header).join(", ")}</span>
        <span style={{ color: args.primaryColor }}>All Slots Demo Plugin</span>
      </div>
    );
  };
}

/**
 * Cell slot - Custom cell renderer for all columns
 */
function createCellRenderer(context: PluginContext<AllSlotsDemoConfig>) {
  const { args } = context;

  return function CellContent(cell: Cell<{ id: number }, unknown>) {
    const value = cell.getValue();
    const isNumeric = typeof value === "number";

    // Simple formatting based on value type
    if (isNumeric && args.enableCellHighlight) {
      return (
        <span
          style={{
            fontWeight: 500,
            color: args.primaryColor,
          }}
        >
          {value.toLocaleString()}
        </span>
      );
    }

    // Default rendering
    return <>{String(value ?? "")}</>;
  };
}

/**
 * Inline Row slot - Renders below a specific row when opened
 */
function createInlineRowRenderer(context: PluginContext<AllSlotsDemoConfig>) {
  const { args } = context;

  return function InlineRowContent(row: Row<{ id: number }>) {
    const { table } = usePluginContext();
    const data = row.original;

    return (
      <div
        style={{
          padding: "16px",
          backgroundColor: args.primaryColor + "08",
          borderLeft: `4px solid ${args.primaryColor}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h4 style={{ margin: "0 0 8px", color: args.primaryColor }}>
              Row Details (ID: {String(data.id)})
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                fontSize: "13px",
              }}
            >
              {Object.entries(data).map(([key, value]) => (
                <div key={key}>
                  <span style={{ color: "#6b7280", fontSize: "11px" }}>
                    {key}:
                  </span>{" "}
                  <span style={{ fontWeight: 500 }}>
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => table.plugin.close()}
            style={{
              padding: "6px 12px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: args.primaryColor,
              color: "white",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };
}

// =============================================================================
// Plugin Definition
// =============================================================================

/**
 * AllSlotsDemo Plugin
 *
 * A demonstration plugin that uses all 5 slot types:
 * - sidepanel: Shows plugin info and stats
 * - header: Shows record count and selection info
 * - footer: Shows column info
 * - cell: Custom numeric highlighting
 * - inlineRow: Expandable row details
 *
 * @example
 * ```tsx
 * import { AllSlotsDemo } from "@izumisy/seizen-datatable-plugins/all-slots-demo";
 *
 * const table = useDataTable({
 *   data,
 *   columns,
 *   plugins: [
 *     AllSlotsDemo.configure({
 *       sidepanelTitle: "Demo Panel",
 *       enableCellHighlight: true,
 *       primaryColor: "#8b5cf6",
 *     }),
 *   ],
 * });
 *
 * // Open inline row for a specific row
 * table.plugin.open("all-slots-demo", { id: "row-1" });
 * ```
 */
export const AllSlotsDemo = definePlugin<
  { id: number },
  typeof AllSlotsDemoSchema
>({
  id: "all-slots-demo",
  name: "All Slots",
  args: AllSlotsDemoSchema,
  slots: {
    sidepanel: {
      position: "right-sider",
      header: "All Slots Demo",
      render: createSidePanelRenderer,
    },
    header: {
      render: createHeaderRenderer,
    },
    footer: {
      render: createFooterRenderer,
    },
    cell: {
      render: createCellRenderer,
    },
    inlineRow: {
      render: createInlineRowRenderer,
    },
  },
});
