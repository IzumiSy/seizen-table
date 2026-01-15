import { vi } from "vitest";
import type { SeizenTableInstance } from "../../src/table/useSeizenTable";
import type { EventBus } from "../../src/plugin/useEventBus";

// =============================================================================
// Test Row Type
// =============================================================================

export interface TestRow {
  id: number;
  name: string;
}

// =============================================================================
// Mock EventBus
// =============================================================================

/**
 * Create a mock EventBus for testing.
 * This mock maintains a real listener registry so emit() actually calls subscribers.
 */
export function createMockEventBus(): EventBus {
  const listeners = new Map<string, Set<(payload: unknown) => void>>();

  return {
    emit: vi.fn((event: string, payload: unknown) => {
      const eventListeners = listeners.get(event);
      if (eventListeners) {
        eventListeners.forEach((callback) => callback(payload));
      }
    }) as EventBus["emit"],
    subscribe: vi.fn((event: string, callback: (payload: unknown) => void) => {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(callback);

      return () => {
        listeners.get(event)?.delete(callback);
      };
    }) as EventBus["subscribe"],
  };
}

// =============================================================================
// Mock Table Instance
// =============================================================================

/**
 * Create a mock SeizenTableInstance for testing.
 * Allows overriding specific properties while providing sensible defaults.
 */
export function createMockTableInstance(
  overrides: Partial<SeizenTableInstance<TestRow>> = {}
): SeizenTableInstance<TestRow> {
  const eventBus = overrides.eventBus ?? createMockEventBus();

  const mockPlugin = {
    open: vi.fn(),
    close: vi.fn(),
    isOpen: vi.fn(() => false),
    getActiveId: vi.fn(() => null),
    setActive: vi.fn(),
    _state: { id: null, args: undefined },
  };

  return {
    getData: () => [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ],
    getColumns: () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Name" },
    ],
    getSelectedRows: () => [],
    setSelectedRows: vi.fn(),
    clearSelection: vi.fn(),
    getFilterState: () => [],
    setFilter: vi.fn(),
    getGlobalFilter: () => "",
    setGlobalFilter: vi.fn(),
    getSortingState: () => [],
    setSorting: vi.fn(),
    getPaginationState: () => ({ pageIndex: 0, pageSize: 10 }),
    setPageIndex: vi.fn(),
    setPageSize: vi.fn(),
    getColumnVisibility: () => ({}),
    setColumnVisibility: vi.fn(),
    toggleColumnVisibility: vi.fn(),
    getColumnOrder: () => [],
    setColumnOrder: vi.fn(),
    moveColumn: vi.fn(),
    plugins: [],
    plugin: mockPlugin as SeizenTableInstance<TestRow>["plugin"],
    eventBus: eventBus as SeizenTableInstance<TestRow>["eventBus"],
    remote: false,
    _tanstackTable: {} as SeizenTableInstance<TestRow>["_tanstackTable"],
    ...overrides,
  };
}
