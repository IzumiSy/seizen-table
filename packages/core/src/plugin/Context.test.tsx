import { describe, it, expect, vi } from "vitest";
import { act, waitFor } from "@testing-library/react";
import { render } from "@testing-library/react";
import {
  PluginContextProvider,
  usePluginContext,
  PluginArgsProvider,
  usePluginArgs,
} from "./Context";
import type {
  ColumnFiltersState,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import {
  createMockTableInstance,
  type TestRow,
} from "../../tests/utils/mockTable";

// =============================================================================
// PluginContextProvider Tests
// =============================================================================

describe("PluginContextProvider", () => {
  describe("context value", () => {
    it("should provide table instance to children", () => {
      const mockTable = createMockTableInstance();
      let capturedContext: ReturnType<typeof usePluginContext> | null = null;

      function TestConsumer() {
        capturedContext = usePluginContext();
        return null;
      }

      render(
        <PluginContextProvider table={mockTable}>
          <TestConsumer />
        </PluginContextProvider>
      );

      expect(capturedContext).not.toBeNull();
      expect(capturedContext!.table).toBeDefined();
    });

    it("should provide data to context", () => {
      const testData = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];
      const mockTable = createMockTableInstance({
        getData: () => testData,
      });

      let capturedContext: ReturnType<typeof usePluginContext> | null = null;

      function TestConsumer() {
        capturedContext = usePluginContext();
        return null;
      }

      render(
        <PluginContextProvider table={mockTable}>
          <TestConsumer />
        </PluginContextProvider>
      );

      expect(capturedContext!.data).toEqual(testData);
    });

    it("should provide columns info to context", () => {
      const mockTable = createMockTableInstance({
        getColumns: () => [
          { accessorKey: "id", header: "ID" },
          { accessorKey: "name", header: "Name" },
        ],
      });

      let capturedContext: ReturnType<typeof usePluginContext> | null = null;

      function TestConsumer() {
        capturedContext = usePluginContext();
        return null;
      }

      render(
        <PluginContextProvider table={mockTable}>
          <TestConsumer />
        </PluginContextProvider>
      );

      expect(capturedContext!.columns).toHaveLength(2);
      expect(capturedContext!.columns[0]).toEqual({
        key: "id",
        header: "ID",
        filterMeta: undefined,
      });
      expect(capturedContext!.columns[1]).toEqual({
        key: "name",
        header: "Name",
        filterMeta: undefined,
      });
    });

    it("should provide selectedRows to context", () => {
      const selectedRows = [{ id: 1, name: "Alice" }];
      const mockTable = createMockTableInstance({
        getSelectedRows: () => selectedRows,
      });

      let capturedContext: ReturnType<typeof usePluginContext> | null = null;

      function TestConsumer() {
        capturedContext = usePluginContext();
        return null;
      }

      render(
        <PluginContextProvider table={mockTable}>
          <TestConsumer />
        </PluginContextProvider>
      );

      expect(capturedContext!.selectedRows).toEqual(selectedRows);
    });

    it("should provide openArgs from plugin state", () => {
      const mockTable = createMockTableInstance();
      mockTable.plugin._state = { id: "test-plugin", args: { rowId: 123 } };

      let capturedContext: ReturnType<typeof usePluginContext> | null = null;

      function TestConsumer() {
        capturedContext = usePluginContext();
        return null;
      }

      render(
        <PluginContextProvider table={mockTable}>
          <TestConsumer />
        </PluginContextProvider>
      );

      expect(capturedContext!.openArgs).toEqual({ rowId: 123 });
    });

    it("should provide useEvent hook", () => {
      const mockTable = createMockTableInstance();

      let capturedContext: ReturnType<typeof usePluginContext> | null = null;

      function TestConsumer() {
        capturedContext = usePluginContext();
        return null;
      }

      render(
        <PluginContextProvider table={mockTable}>
          <TestConsumer />
        </PluginContextProvider>
      );

      expect(capturedContext!.useEvent).toBeDefined();
      expect(typeof capturedContext!.useEvent).toBe("function");
    });
  });

  describe("column order", () => {
    it("should respect column order when set", () => {
      const mockTable = createMockTableInstance({
        getColumns: () => [
          { accessorKey: "id", header: "ID" },
          { accessorKey: "name", header: "Name" },
          { accessorKey: "age", header: "Age" },
        ],
        getColumnOrder: () => ["age", "name", "id"],
      });

      let capturedContext: ReturnType<typeof usePluginContext> | null = null;

      function TestConsumer() {
        capturedContext = usePluginContext();
        return null;
      }

      render(
        <PluginContextProvider table={mockTable}>
          <TestConsumer />
        </PluginContextProvider>
      );

      expect(capturedContext!.columns.map((c) => c.key)).toEqual([
        "age",
        "name",
        "id",
      ]);
    });
  });

  describe("event emission", () => {
    it("should emit data-change event when data changes", async () => {
      let currentData = [{ id: 1, name: "Alice" }];
      const mockTable = createMockTableInstance({
        getData: () => currentData,
      });

      const { rerender } = render(
        <PluginContextProvider table={mockTable}>
          <div>Test</div>
        </PluginContextProvider>
      );

      // Change data
      currentData = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];

      rerender(
        <PluginContextProvider table={mockTable}>
          <div>Test</div>
        </PluginContextProvider>
      );

      await waitFor(() => {
        expect(mockTable.eventBus.emit).toHaveBeenCalledWith(
          "data-change",
          currentData
        );
      });
    });

    it("should emit selection-change event when selection changes", async () => {
      let currentSelection: TestRow[] = [];
      const mockTable = createMockTableInstance({
        getSelectedRows: () => currentSelection,
      });

      const { rerender } = render(
        <PluginContextProvider table={mockTable}>
          <div>Test</div>
        </PluginContextProvider>
      );

      // Change selection
      currentSelection = [{ id: 1, name: "Alice" }];

      rerender(
        <PluginContextProvider table={mockTable}>
          <div>Test</div>
        </PluginContextProvider>
      );

      await waitFor(() => {
        expect(mockTable.eventBus.emit).toHaveBeenCalledWith(
          "selection-change",
          currentSelection
        );
      });
    });

    it("should emit filter-change event when filters change", async () => {
      let currentFilters: ColumnFiltersState = [];
      const mockTable = createMockTableInstance({
        getFilterState: () => currentFilters,
      });

      const { rerender } = render(
        <PluginContextProvider table={mockTable}>
          <div>Test</div>
        </PluginContextProvider>
      );

      // Change filters
      currentFilters = [{ id: "name", value: "Alice" }];

      rerender(
        <PluginContextProvider table={mockTable}>
          <div>Test</div>
        </PluginContextProvider>
      );

      await waitFor(() => {
        expect(mockTable.eventBus.emit).toHaveBeenCalledWith(
          "filter-change",
          currentFilters
        );
      });
    });

    it("should emit sorting-change event when sorting changes", async () => {
      let currentSorting: SortingState = [];
      const mockTable = createMockTableInstance({
        getSortingState: () => currentSorting,
      });

      const { rerender } = render(
        <PluginContextProvider table={mockTable}>
          <div>Test</div>
        </PluginContextProvider>
      );

      // Change sorting
      currentSorting = [{ id: "name", desc: false }];

      rerender(
        <PluginContextProvider table={mockTable}>
          <div>Test</div>
        </PluginContextProvider>
      );

      await waitFor(() => {
        expect(mockTable.eventBus.emit).toHaveBeenCalledWith(
          "sorting-change",
          currentSorting
        );
      });
    });

    it("should emit pagination-change event when pagination changes", async () => {
      let currentPagination: PaginationState = { pageIndex: 0, pageSize: 10 };
      const mockTable = createMockTableInstance({
        getPaginationState: () => currentPagination,
      });

      const { rerender } = render(
        <PluginContextProvider table={mockTable}>
          <div>Test</div>
        </PluginContextProvider>
      );

      // Change pagination
      currentPagination = { pageIndex: 2, pageSize: 20 };

      rerender(
        <PluginContextProvider table={mockTable}>
          <div>Test</div>
        </PluginContextProvider>
      );

      await waitFor(() => {
        expect(mockTable.eventBus.emit).toHaveBeenCalledWith(
          "pagination-change",
          currentPagination
        );
      });
    });

    it("should not emit event when value is the same", () => {
      const data = [{ id: 1, name: "Alice" }];
      const mockTable = createMockTableInstance({
        getData: () => data,
      });

      const { rerender } = render(
        <PluginContextProvider table={mockTable}>
          <div>Test</div>
        </PluginContextProvider>
      );

      // Clear mock calls
      vi.clearAllMocks();

      // Rerender with same data
      rerender(
        <PluginContextProvider table={mockTable}>
          <div>Test</div>
        </PluginContextProvider>
      );

      expect(mockTable.eventBus.emit).not.toHaveBeenCalledWith(
        "data-change",
        expect.anything()
      );
    });
  });

  describe("useEvent hook", () => {
    it("should subscribe to events", async () => {
      const mockTable = createMockTableInstance();
      const callback = vi.fn();

      function TestConsumer() {
        const { useEvent } = usePluginContext();
        useEvent("selection-change", callback);
        return null;
      }

      render(
        <PluginContextProvider table={mockTable}>
          <TestConsumer />
        </PluginContextProvider>
      );

      expect(mockTable.eventBus.subscribe).toHaveBeenCalledWith(
        "selection-change",
        expect.any(Function)
      );
    });

    it("should call callback when event is emitted", () => {
      const mockTable = createMockTableInstance();
      const callback = vi.fn();

      function TestConsumer() {
        const { useEvent } = usePluginContext();
        useEvent("custom-event", callback);
        return null;
      }

      render(
        <PluginContextProvider table={mockTable}>
          <TestConsumer />
        </PluginContextProvider>
      );

      // Simulate event emission
      act(() => {
        mockTable.eventBus.emit("custom-event", { data: "test" });
      });

      expect(callback).toHaveBeenCalledWith({ data: "test" });
    });
  });
});

// =============================================================================
// usePluginContext Tests
// =============================================================================

describe("usePluginContext", () => {
  it("should throw error when used outside provider", () => {
    function TestComponent() {
      usePluginContext();
      return null;
    }

    expect(() => {
      render(<TestComponent />);
    }).toThrow("usePluginContext must be used within a SeizenTable component");
  });

  it("should return context when used inside provider", () => {
    const mockTable = createMockTableInstance();
    let capturedContext: ReturnType<typeof usePluginContext> | null = null;

    function TestConsumer() {
      capturedContext = usePluginContext();
      return null;
    }

    render(
      <PluginContextProvider table={mockTable}>
        <TestConsumer />
      </PluginContextProvider>
    );

    expect(capturedContext).not.toBeNull();
  });
});

// =============================================================================
// PluginArgsProvider Tests
// =============================================================================

describe("PluginArgsProvider", () => {
  it("should provide args to children", () => {
    const testArgs = { columns: ["id", "name"], title: "Test Plugin" };
    let capturedArgs: typeof testArgs | null = null;

    function TestConsumer() {
      capturedArgs = usePluginArgs<typeof testArgs>();
      return null;
    }

    render(
      <PluginArgsProvider args={testArgs}>
        <TestConsumer />
      </PluginArgsProvider>
    );

    expect(capturedArgs).toEqual(testArgs);
  });

  it("should handle undefined args", () => {
    let capturedArgs: unknown = "initial";

    function TestConsumer() {
      capturedArgs = usePluginArgs<unknown>();
      return null;
    }

    render(
      <PluginArgsProvider args={undefined}>
        <TestConsumer />
      </PluginArgsProvider>
    );

    expect(capturedArgs).toBeUndefined();
  });

  it("should handle nested providers", () => {
    const outerArgs = { level: "outer" };
    const innerArgs = { level: "inner" };
    let capturedInnerArgs: typeof innerArgs | null = null;

    function TestConsumer() {
      capturedInnerArgs = usePluginArgs<typeof innerArgs>();
      return null;
    }

    render(
      <PluginArgsProvider args={outerArgs}>
        <PluginArgsProvider args={innerArgs}>
          <TestConsumer />
        </PluginArgsProvider>
      </PluginArgsProvider>
    );

    // Inner provider should override outer
    expect(capturedInnerArgs).toEqual(innerArgs);
  });
});

// =============================================================================
// usePluginArgs Tests
// =============================================================================

describe("usePluginArgs", () => {
  it("should return undefined when used without provider", () => {
    let capturedArgs: unknown = "initial";

    function TestComponent() {
      capturedArgs = usePluginArgs<unknown>();
      return null;
    }

    render(<TestComponent />);

    expect(capturedArgs).toBeUndefined();
  });

  it("should return typed args", () => {
    interface MyPluginConfig {
      columns: string[];
      title: string;
    }

    const testArgs: MyPluginConfig = {
      columns: ["id", "name"],
      title: "Test Plugin",
    };

    let capturedArgs: MyPluginConfig | null = null;

    function TestConsumer() {
      capturedArgs = usePluginArgs<MyPluginConfig>();
      return null;
    }

    render(
      <PluginArgsProvider args={testArgs}>
        <TestConsumer />
      </PluginArgsProvider>
    );

    expect(capturedArgs!.columns).toEqual(["id", "name"]);
    expect(capturedArgs!.title).toBe("Test Plugin");
  });
});
