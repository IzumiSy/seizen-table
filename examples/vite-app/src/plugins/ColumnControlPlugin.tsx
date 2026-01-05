import { useState, useCallback } from "react";
import { z } from "zod";
import {
  definePlugin,
  usePluginContext,
  type PluginContext,
} from "@izumisy/seizen-datatable-react/plugin";

/**
 * Schema for ColumnControl plugin configuration
 */
const ColumnControlSchema = z.object({
  /** Width of the sidepanel */
  width: z.number().default(280),
});

type ColumnControlConfig = z.infer<typeof ColumnControlSchema>;

/**
 * ColumnControlRenderer - Creates the render function for the plugin
 */
function ColumnControlRenderer(context: PluginContext<ColumnControlConfig>) {
  const { args } = context;

  return function ColumnControlPanel() {
    const { columns, table } = usePluginContext();
    const columnVisibility = table.getColumnVisibility();
    const [searchQuery, setSearchQuery] = useState("");
    const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    // Check if column is visible (not explicitly set to false)
    const isColumnVisible = (columnKey: string) =>
      columnVisibility[columnKey] !== false;

    // Filter columns by search query
    const filteredColumns = columns.filter(
      (column) =>
        column.header.toLowerCase().includes(searchQuery.toLowerCase()) ||
        column.key.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // D&D handlers
    const handleDragStart = useCallback(
      (e: React.DragEvent, columnKey: string) => {
        setDraggedColumn(columnKey);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", columnKey);
      },
      []
    );

    const handleDragOver = useCallback(
      (e: React.DragEvent, columnKey: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (columnKey !== draggedColumn) {
          setDragOverColumn(columnKey);
        }
      },
      [draggedColumn]
    );

    const handleDragLeave = useCallback(() => {
      setDragOverColumn(null);
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent, targetColumnKey: string) => {
        e.preventDefault();
        if (draggedColumn && draggedColumn !== targetColumnKey) {
          const targetIndex = columns.findIndex(
            (col) => col.key === targetColumnKey
          );
          if (targetIndex !== -1) {
            table.moveColumn(draggedColumn, targetIndex);
          }
        }
        setDraggedColumn(null);
        setDragOverColumn(null);
      },
      [draggedColumn, columns, table]
    );

    const handleDragEnd = useCallback(() => {
      setDraggedColumn(null);
      setDragOverColumn(null);
    }, []);

    return (
      <div
        style={{
          width: args.width,
          padding: "16px",
          height: "100%",
          overflow: "auto",
        }}
      >
        {/* Search input */}
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Search columns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: "14px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filteredColumns.map((column) => {
            const isDragging = draggedColumn === column.key;
            const isDragOver = dragOverColumn === column.key;

            return (
              <div
                key={column.key}
                draggable={!searchQuery} // Disable drag when searching
                onDragStart={(e) => handleDragStart(e, column.key)}
                onDragOver={(e) => handleDragOver(e, column.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.key)}
                onDragEnd={handleDragEnd}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: isDragOver
                    ? "#dbeafe"
                    : isDragging
                    ? "#f3f4f6"
                    : "#fff",
                  border: isDragOver
                    ? "2px dashed #3b82f6"
                    : "1px solid #e5e7eb",
                  cursor: searchQuery ? "default" : "grab",
                  userSelect: "none",
                  transition: "all 0.15s ease",
                  opacity: isDragging ? 0.5 : 1,
                }}
              >
                {/* Drag handle */}
                {!searchQuery && (
                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: "12px",
                      cursor: "grab",
                    }}
                  >
                    ⋮⋮
                  </span>
                )}

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flex: 1,
                    cursor: "pointer",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isColumnVisible(column.key)}
                    onChange={() => table.toggleColumnVisibility(column.key)}
                    style={{
                      width: "16px",
                      height: "16px",
                      cursor: "pointer",
                      accentColor: "#3b82f6",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      color: isColumnVisible(column.key)
                        ? "#111827"
                        : "#9ca3af",
                      fontWeight: isColumnVisible(column.key) ? 500 : 400,
                    }}
                  >
                    {column.header}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
}

/**
 * ColumnControl Plugin
 *
 * Allows users to toggle column visibility from a sidepanel.
 * Each column is displayed as a checkbox that can be toggled on/off.
 *
 * @example
 * ```tsx
 * import { ColumnControlPlugin } from "./plugins/ColumnControlPlugin";
 *
 * const table = useDataTable({
 *   data,
 *   columns,
 *   plugins: [ColumnControlPlugin.configure({ width: 280 })],
 * });
 * ```
 */
export const ColumnControlPlugin = definePlugin({
  id: "column-control",
  name: "Columns",
  position: "right-sider" as const,
  args: ColumnControlSchema,
  header: "Column Visibility",
  render: ColumnControlRenderer,
});
