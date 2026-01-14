import { useState, useCallback, useMemo } from "react";
import { usePluginContext, usePluginArgs } from "@izumisy/seizen-table/plugin";

// =============================================================================
// Types
// =============================================================================

type TabType = "visibility" | "sorter";

type SortDirection = "asc" | "desc";

interface SorterItem {
  columnKey: string;
  columnHeader: string;
  direction: SortDirection;
}

// =============================================================================
// Tab Button Component
// =============================================================================

export function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "8px 12px",
        fontSize: "13px",
        fontWeight: active ? 600 : 400,
        color: active ? "#3b82f6" : "#6b7280",
        backgroundColor: active ? "#eff6ff" : "transparent",
        border: "none",
        borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

// =============================================================================
// Visibility Tab Component
// =============================================================================

export function VisibilityTab() {
  const { columns, table } = usePluginContext();
  const columnVisibility = table.getColumnVisibility();
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const isColumnVisible = (columnKey: string) =>
    columnVisibility[columnKey] !== false;

  const filteredColumns = columns.filter(
    (column) =>
      column.header.toLowerCase().includes(searchQuery.toLowerCase()) ||
      column.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <>
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
              draggable={!searchQuery}
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
                border: isDragOver ? "2px dashed #3b82f6" : "1px solid #e5e7eb",
                cursor: searchQuery ? "default" : "grab",
                userSelect: "none",
                transition: "all 0.15s ease",
                opacity: isDragging ? 0.5 : 1,
              }}
            >
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
                    color: isColumnVisible(column.key) ? "#111827" : "#9ca3af",
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
    </>
  );
}

// =============================================================================
// Sorter Tab Component
// =============================================================================

export function SorterTab() {
  const { columns, table } = usePluginContext();
  const sortingState = table.getSortingState();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Convert sorting state to sorter items with column headers
  const sorterItems: SorterItem[] = useMemo(() => {
    return sortingState.map((sort) => {
      const column = columns.find((col) => col.key === sort.id);
      return {
        columnKey: sort.id,
        columnHeader: column?.header ?? sort.id,
        direction: sort.desc ? "desc" : "asc",
      };
    });
  }, [sortingState, columns]);

  // Get columns that are not currently being sorted
  const availableColumns = useMemo(() => {
    const sortedColumnKeys = new Set(sortingState.map((s) => s.id));
    return columns.filter((col) => !sortedColumnKeys.has(col.key));
  }, [columns, sortingState]);

  // Add a new sorter
  const addSorter = useCallback(
    (columnKey: string) => {
      const newSorting = [...sortingState, { id: columnKey, desc: false }];
      table.setSorting(newSorting);
    },
    [sortingState, table]
  );

  // Remove a sorter
  const removeSorter = useCallback(
    (columnKey: string) => {
      const newSorting = sortingState.filter((s) => s.id !== columnKey);
      table.setSorting(newSorting);
    },
    [sortingState, table]
  );

  // Toggle sort direction
  const toggleDirection = useCallback(
    (columnKey: string) => {
      const newSorting = sortingState.map((s) =>
        s.id === columnKey ? { ...s, desc: !s.desc } : s
      );
      table.setSorting(newSorting);
    },
    [sortingState, table]
  );

  // D&D handlers for reordering sorters
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (index !== draggedIndex) {
        setDragOverIndex(index);
      }
    },
    [draggedIndex]
  );

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      if (draggedIndex !== null && draggedIndex !== targetIndex) {
        const newSorting = [...sortingState];
        const [removed] = newSorting.splice(draggedIndex, 1);
        newSorting.splice(targetIndex, 0, removed);
        table.setSorting(newSorting);
      }
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [draggedIndex, sortingState, table]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  // Clear all sorters
  const clearAllSorters = useCallback(() => {
    table.setSorting([]);
  }, [table]);

  return (
    <>
      {/* Add sorter dropdown */}
      <div style={{ marginBottom: "12px" }}>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) {
              addSorter(e.target.value);
            }
          }}
          style={{
            width: "100%",
            padding: "8px 12px",
            fontSize: "14px",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            outline: "none",
            boxSizing: "border-box",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          <option value="">+ Add sort column...</option>
          {availableColumns.map((column) => (
            <option key={column.key} value={column.key}>
              {column.header}
            </option>
          ))}
        </select>
      </div>

      {/* Active sorters */}
      {sorterItems.length > 0 ? (
        <>
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
              Sort priority (drag to reorder)
            </span>
            <button
              onClick={clearAllSorters}
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

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {sorterItems.map((item, index) => {
              const isDragging = draggedIndex === index;
              const isDragOver = dragOverIndex === index;

              return (
                <div
                  key={item.columnKey}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
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
                    cursor: "grab",
                    userSelect: "none",
                    transition: "all 0.15s ease",
                    opacity: isDragging ? 0.5 : 1,
                  }}
                >
                  {/* Priority number */}
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#3b82f6",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </span>

                  {/* Drag handle */}
                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: "12px",
                      cursor: "grab",
                    }}
                  >
                    ⋮⋮
                  </span>

                  {/* Column name */}
                  <span
                    style={{
                      flex: 1,
                      fontSize: "14px",
                      color: "#111827",
                      fontWeight: 500,
                    }}
                  >
                    {item.columnHeader}
                  </span>

                  {/* Direction toggle */}
                  <button
                    onClick={() => toggleDirection(item.columnKey)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: item.direction === "asc" ? "#059669" : "#dc2626",
                      backgroundColor:
                        item.direction === "asc" ? "#d1fae5" : "#fee2e2",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      minWidth: "50px",
                    }}
                  >
                    {item.direction === "asc" ? "↑ ASC" : "↓ DESC"}
                  </button>

                  {/* Remove button */}
                  <button
                    onClick={() => removeSorter(item.columnKey)}
                    style={{
                      padding: "4px 6px",
                      fontSize: "14px",
                      color: "#9ca3af",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
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
          <div style={{ marginBottom: "8px" }}>No sorting applied</div>
          <div style={{ fontSize: "12px" }}>
            Select a column above to add sorting
          </div>
        </div>
      )}
    </>
  );
}

// =============================================================================
// Event Handlers Hook
// =============================================================================

/**
 * Hook that subscribes to column control events from context menu.
 * Extracted for testability with renderHook.
 */
export function useColumnControlEvents() {
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
}

// =============================================================================
// Column Control Panel Component
// =============================================================================

export interface ColumnControlConfig {
  width: number;
}

export function ColumnControlPanel() {
  const args = usePluginArgs<ColumnControlConfig>();
  const [activeTab, setActiveTab] = useState<TabType>("visibility");

  // Subscribe to events from context menu
  useColumnControlEvents();

  return (
    <div
      style={{
        width: args.width,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Tab header */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
        }}
      >
        <TabButton
          active={activeTab === "visibility"}
          onClick={() => setActiveTab("visibility")}
        >
          Visibility
        </TabButton>
        <TabButton
          active={activeTab === "sorter"}
          onClick={() => setActiveTab("sorter")}
        >
          Sorter
        </TabButton>
      </div>

      {/* Tab content */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          overflow: "auto",
        }}
      >
        {activeTab === "visibility" && <VisibilityTab />}
        {activeTab === "sorter" && <SorterTab />}
      </div>
    </div>
  );
}
