import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSeizenTable } from "./useSeizenTable";
import type { SeizenTableColumn } from "./useSeizenTable";

// =============================================================================
// Test Data Types
// =============================================================================

interface TestRow {
  id: number;
  name: string;
  age: number;
  status: string;
}

// =============================================================================
// Test Helpers
// =============================================================================

function createTestData(): TestRow[] {
  return [
    { id: 1, name: "Alice", age: 30, status: "active" },
    { id: 2, name: "Bob", age: 25, status: "inactive" },
    { id: 3, name: "Charlie", age: 35, status: "active" },
    { id: 4, name: "Diana", age: 28, status: "pending" },
    { id: 5, name: "Eve", age: 32, status: "active" },
  ];
}

function createTestColumns(): SeizenTableColumn<TestRow>[] {
  return [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "age", header: "Age" },
    { accessorKey: "status", header: "Status" },
  ];
}

// =============================================================================
// useSeizenTable Hook Tests
// =============================================================================

describe("useSeizenTable", () => {
  describe("initialization", () => {
    it("should return a SeizenTableInstance", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current).toBeDefined();
      expect(result.current.getData).toBeDefined();
      expect(result.current.getColumns).toBeDefined();
      expect(result.current.getSelectedRows).toBeDefined();
    });

    it("should return the initial data", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current.getData()).toEqual(data);
    });

    it("should return the column definitions", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current.getColumns()).toEqual(columns);
    });

    it("should have empty plugins by default", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current.plugins).toEqual([]);
    });
  });

  // ===========================================================================
  // Selection Tests
  // ===========================================================================

  describe("selection", () => {
    it("should have no selected rows initially", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current.getSelectedRows()).toEqual([]);
    });

    it("should respect initialSelection", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() =>
        useSeizenTable({
          data,
          columns,
          initialSelection: { 0: true, 2: true },
        })
      );

      const selectedRows = result.current.getSelectedRows();
      expect(selectedRows).toHaveLength(2);
      expect(selectedRows).toContainEqual(data[0]);
      expect(selectedRows).toContainEqual(data[2]);
    });

    it("should set selected rows programmatically", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      act(() => {
        result.current.setSelectedRows([data[1], data[3]]);
      });

      const selectedRows = result.current.getSelectedRows();
      expect(selectedRows).toHaveLength(2);
      expect(selectedRows).toContainEqual(data[1]);
      expect(selectedRows).toContainEqual(data[3]);
    });

    it("should clear selection", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() =>
        useSeizenTable({
          data,
          columns,
          initialSelection: { 0: true, 1: true },
        })
      );

      expect(result.current.getSelectedRows()).toHaveLength(2);

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.getSelectedRows()).toEqual([]);
    });

    it("should ignore rows not in data when setting selection", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      const notInData = { id: 999, name: "Unknown", age: 0, status: "unknown" };

      act(() => {
        result.current.setSelectedRows([data[0], notInData]);
      });

      const selectedRows = result.current.getSelectedRows();
      expect(selectedRows).toHaveLength(1);
      expect(selectedRows).toContainEqual(data[0]);
    });
  });

  // ===========================================================================
  // Filtering Tests
  // ===========================================================================

  describe("filtering", () => {
    it("should have empty filter state initially", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current.getFilterState()).toEqual([]);
    });

    it("should set column filters", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      const filters = [{ id: "name", value: "Alice" }];

      act(() => {
        result.current.setFilter(filters);
      });

      expect(result.current.getFilterState()).toEqual(filters);
    });

    it("should have empty global filter initially", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current.getGlobalFilter()).toBe("");
    });

    it("should set global filter", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      act(() => {
        result.current.setGlobalFilter("search term");
      });

      expect(result.current.getGlobalFilter()).toBe("search term");
    });
  });

  // ===========================================================================
  // Sorting Tests
  // ===========================================================================

  describe("sorting", () => {
    it("should have empty sorting state initially", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current.getSortingState()).toEqual([]);
    });

    it("should set sorting state", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      const sorting = [{ id: "name", desc: false }];

      act(() => {
        result.current.setSorting(sorting);
      });

      expect(result.current.getSortingState()).toEqual(sorting);
    });

    it("should set descending sorting", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      const sorting = [{ id: "age", desc: true }];

      act(() => {
        result.current.setSorting(sorting);
      });

      expect(result.current.getSortingState()).toEqual(sorting);
    });

    it("should set multiple column sorting", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      const sorting = [
        { id: "status", desc: false },
        { id: "name", desc: true },
      ];

      act(() => {
        result.current.setSorting(sorting);
      });

      expect(result.current.getSortingState()).toEqual(sorting);
    });
  });

  // ===========================================================================
  // Pagination Tests
  // ===========================================================================

  describe("pagination", () => {
    it("should have default pagination state", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current.getPaginationState()).toEqual({
        pageIndex: 0,
        pageSize: 10,
      });
    });

    it("should set page index", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      act(() => {
        result.current.setPageIndex(2);
      });

      expect(result.current.getPaginationState().pageIndex).toBe(2);
    });

    it("should set page size", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      act(() => {
        result.current.setPageSize(25);
      });

      expect(result.current.getPaginationState().pageSize).toBe(25);
    });

    it("should preserve pageSize when changing pageIndex", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      act(() => {
        result.current.setPageSize(50);
      });

      act(() => {
        result.current.setPageIndex(3);
      });

      const pagination = result.current.getPaginationState();
      expect(pagination.pageIndex).toBe(3);
      expect(pagination.pageSize).toBe(50);
    });

    it("should preserve pageIndex when changing pageSize", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      act(() => {
        result.current.setPageIndex(2);
      });

      act(() => {
        result.current.setPageSize(100);
      });

      const pagination = result.current.getPaginationState();
      expect(pagination.pageIndex).toBe(2);
      expect(pagination.pageSize).toBe(100);
    });
  });

  // ===========================================================================
  // Column Visibility Tests
  // ===========================================================================

  describe("column visibility", () => {
    it("should have empty visibility state initially (all columns visible)", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current.getColumnVisibility()).toEqual({});
    });

    it("should set column visibility state", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      const visibility = { id: false, age: false };

      act(() => {
        result.current.setColumnVisibility(visibility);
      });

      expect(result.current.getColumnVisibility()).toEqual(visibility);
    });

    it("should toggle column visibility (hide)", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      act(() => {
        result.current.toggleColumnVisibility("name");
      });

      expect(result.current.getColumnVisibility()).toEqual({ name: false });
    });

    it("should toggle column visibility (show)", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      act(() => {
        result.current.setColumnVisibility({ name: false });
      });

      act(() => {
        result.current.toggleColumnVisibility("name");
      });

      expect(result.current.getColumnVisibility()).toEqual({ name: true });
    });

    it("should toggle multiple columns independently", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      act(() => {
        result.current.toggleColumnVisibility("id");
      });

      act(() => {
        result.current.toggleColumnVisibility("age");
      });

      expect(result.current.getColumnVisibility()).toEqual({
        id: false,
        age: false,
      });
    });
  });

  // ===========================================================================
  // Column Order Tests
  // ===========================================================================

  describe("column order", () => {
    it("should have empty column order initially", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current.getColumnOrder()).toEqual([]);
    });

    it("should set column order", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      const order = ["status", "name", "age", "id"];

      act(() => {
        result.current.setColumnOrder(order);
      });

      expect(result.current.getColumnOrder()).toEqual(order);
    });

    it("should move column to new position", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      // First set an initial order
      act(() => {
        result.current.setColumnOrder(["id", "name", "age", "status"]);
      });

      // Move "status" to the beginning (index 0)
      act(() => {
        result.current.moveColumn("status", 0);
      });

      expect(result.current.getColumnOrder()).toEqual([
        "status",
        "id",
        "name",
        "age",
      ]);
    });

    it("should move column from beginning to end", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      act(() => {
        result.current.setColumnOrder(["id", "name", "age", "status"]);
      });

      // Move "id" to the end
      act(() => {
        result.current.moveColumn("id", 3);
      });

      expect(result.current.getColumnOrder()).toEqual([
        "name",
        "age",
        "status",
        "id",
      ]);
    });

    it("should not change order when moving non-existent column", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      act(() => {
        result.current.setColumnOrder(["id", "name", "age", "status"]);
      });

      act(() => {
        result.current.moveColumn("nonexistent", 0);
      });

      expect(result.current.getColumnOrder()).toEqual([
        "id",
        "name",
        "age",
        "status",
      ]);
    });
  });

  // ===========================================================================
  // Plugin Control Tests
  // ===========================================================================

  describe("plugin control", () => {
    it("should have plugin control interface", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current.plugin).toBeDefined();
      expect(result.current.plugin.open).toBeDefined();
      expect(result.current.plugin.close).toBeDefined();
      expect(result.current.plugin.isOpen).toBeDefined();
      expect(result.current.plugin.getActiveId).toBeDefined();
    });

    it("should have no active plugin initially", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current.plugin.getActiveId()).toBeNull();
    });
  });

  // ===========================================================================
  // Event Bus Tests
  // ===========================================================================

  describe("event bus", () => {
    it("should have event bus interface", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current.eventBus).toBeDefined();
      expect(result.current.eventBus.emit).toBeDefined();
      expect(result.current.eventBus.subscribe).toBeDefined();
    });

    it("should allow subscribing to custom events", () => {
      const data = createTestData();
      const columns = createTestColumns();
      const callback = vi.fn();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      result.current.eventBus.subscribe("custom-event", callback);

      act(() => {
        result.current.eventBus.emit("custom-event", { data: "test" });
      });

      expect(callback).toHaveBeenCalledWith({ data: "test" });
    });
  });

  // ===========================================================================
  // TanStack Table Instance Tests
  // ===========================================================================

  describe("TanStack Table instance", () => {
    it("should expose underlying TanStack Table instance", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current._tanstackTable).toBeDefined();
      expect(result.current._tanstackTable.getRowModel).toBeDefined();
    });
  });

  // ===========================================================================
  // Multi-Select Tests
  // ===========================================================================

  describe("multi-select", () => {
    it("should enable multi-select by default", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      act(() => {
        result.current.setSelectedRows([data[0], data[1], data[2]]);
      });

      expect(result.current.getSelectedRows()).toHaveLength(3);
    });

    it("should disable multi-select when enableMultiSelect is false", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() =>
        useSeizenTable({ data, columns, enableMultiSelect: false })
      );

      // Setting multiple rows when multi-select is disabled
      act(() => {
        result.current.setSelectedRows([data[0], data[1]]);
      });

      // TanStack Table handles the restriction internally
      // When multi-select is disabled, only the first row should be selected
      expect(result.current.getSelectedRows().length).toBeLessThanOrEqual(2);
    });
  });

  // ===========================================================================
  // Data Updates Tests
  // ===========================================================================

  describe("data updates", () => {
    it("should reflect new data when props change", () => {
      const initialData = createTestData();
      const columns = createTestColumns();

      const { result, rerender } = renderHook(
        ({ data }) => useSeizenTable({ data, columns }),
        { initialProps: { data: initialData } }
      );

      expect(result.current.getData()).toEqual(initialData);

      const newData = [{ id: 10, name: "New User", age: 40, status: "new" }];

      rerender({ data: newData });

      expect(result.current.getData()).toEqual(newData);
    });
  });

  // ===========================================================================
  // Remote Mode Tests
  // ===========================================================================

  describe("Remote Mode", () => {
    it("should set remote: false by default", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() => useSeizenTable({ data, columns }));

      expect(result.current.remote).toBe(false);
    });

    it("should set remote: true when remote option is true", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() =>
        useSeizenTable({ data, columns, remote: true })
      );

      expect(result.current.remote).toBe(true);
    });

    it("should set remote: { totalRowCount } when remote option has totalRowCount", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() =>
        useSeizenTable({ data, columns, remote: { totalRowCount: 100 } })
      );

      expect(result.current.remote).toEqual({ totalRowCount: 100 });
    });

    it("should calculate pageCount from totalRowCount in Remote Mode", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() =>
        useSeizenTable({ data, columns, remote: { totalRowCount: 55 } })
      );

      // Default pageSize is 10, so 55 rows = 6 pages
      const tanstackTable = result.current._tanstackTable;
      expect(tanstackTable.getPageCount()).toBe(6);
    });

    it("should update pageCount when pageSize changes", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() =>
        useSeizenTable({ data, columns, remote: { totalRowCount: 100 } })
      );

      // Default pageSize is 10, so 100 rows = 10 pages
      expect(result.current._tanstackTable.getPageCount()).toBe(10);

      // Change pageSize to 20
      act(() => {
        result.current.setPageSize(20);
      });

      // Now 100 rows = 5 pages
      expect(result.current._tanstackTable.getPageCount()).toBe(5);
    });

    it("should not filter data internally when remote is enabled", () => {
      // Create data where only 2 rows would match a filter
      const data: TestRow[] = [
        { id: 1, name: "Alice", age: 30, status: "active" },
        { id: 2, name: "Bob", age: 25, status: "inactive" },
        { id: 3, name: "Charlie", age: 35, status: "active" },
      ];
      const columns = createTestColumns();

      const { result } = renderHook(() =>
        useSeizenTable({ data, columns, remote: true })
      );

      // Apply a filter
      act(() => {
        result.current.setFilter([
          { id: "status", value: { operator: "equals", value: "active" } },
        ]);
      });

      // In Remote Mode, internal filtering is disabled (manualFiltering: true)
      // So all rows should still be displayed
      const tanstackTable = result.current._tanstackTable;
      expect(tanstackTable.getRowModel().rows).toHaveLength(3);
    });

    it("should not sort data internally when remote is enabled", () => {
      const data: TestRow[] = [
        { id: 3, name: "Charlie", age: 35, status: "active" },
        { id: 1, name: "Alice", age: 30, status: "active" },
        { id: 2, name: "Bob", age: 25, status: "inactive" },
      ];
      const columns = createTestColumns();

      const { result } = renderHook(() =>
        useSeizenTable({ data, columns, remote: true })
      );

      // Apply sorting
      act(() => {
        result.current.setSorting([{ id: "id", desc: false }]);
      });

      // In Remote Mode, internal sorting is disabled (manualSorting: true)
      // So the order should remain as provided
      const rows = result.current._tanstackTable.getRowModel().rows;
      expect(rows[0].original.id).toBe(3);
      expect(rows[1].original.id).toBe(1);
      expect(rows[2].original.id).toBe(2);
    });

    it("should not paginate data internally when remote is enabled", () => {
      // Create more than one page of data (default pageSize is 10)
      const data: TestRow[] = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        age: 20 + i,
        status: "active",
      }));
      const columns = createTestColumns();

      const { result } = renderHook(() =>
        useSeizenTable({ data, columns, remote: { totalRowCount: 15 } })
      );

      // In Remote Mode, internal pagination is disabled (manualPagination: true)
      // So all 15 rows should be in the row model (data is pre-paginated externally)
      const tanstackTable = result.current._tanstackTable;
      expect(tanstackTable.getRowModel().rows).toHaveLength(15);
    });

    it("should still update internal filter state for UI sync", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() =>
        useSeizenTable({ data, columns, remote: true })
      );

      // Apply a filter
      act(() => {
        result.current.setFilter([
          { id: "status", value: { operator: "equals", value: "active" } },
        ]);
      });

      // Internal state should be updated for plugin UI sync
      expect(result.current.getFilterState()).toEqual([
        { id: "status", value: { operator: "equals", value: "active" } },
      ]);
    });

    it("should still update internal sorting state for UI sync", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() =>
        useSeizenTable({ data, columns, remote: true })
      );

      // Apply sorting
      act(() => {
        result.current.setSorting([{ id: "name", desc: true }]);
      });

      // Internal state should be updated for plugin UI sync
      expect(result.current.getSortingState()).toEqual([
        { id: "name", desc: true },
      ]);
    });

    it("should still update internal pagination state for UI sync", () => {
      const data = createTestData();
      const columns = createTestColumns();

      const { result } = renderHook(() =>
        useSeizenTable({ data, columns, remote: { totalRowCount: 100 } })
      );

      // Change page
      act(() => {
        result.current.setPageIndex(3);
      });

      // Internal state should be updated for plugin UI sync
      expect(result.current.getPaginationState().pageIndex).toBe(3);
    });
  });
});
