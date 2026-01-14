import { vi } from "vitest";
import type { PluginColumnInfo, EventBus } from "@izumisy/seizen-table/plugin";
import type { SeizenTableInstance } from "@izumisy/seizen-table";

// =============================================================================
// Mock Table Instance
// =============================================================================

/**
 * Keys of SeizenTableInstance that are methods (functions).
 * These will be mocked with vi.fn().
 */
type SeizenTableMethodKeys = {
  [K in keyof SeizenTableInstance<unknown>]: SeizenTableInstance<unknown>[K] extends (
    ...args: any[]
  ) => any
    ? K
    : never;
}[keyof SeizenTableInstance<unknown>];

/**
 * Mock version of SeizenTableInstance where all methods are vi.fn() mocks.
 * This type is derived from the real SeizenTableInstance to stay in sync
 * with the core API automatically.
 */
export type MockTableInstance = {
  [K in SeizenTableMethodKeys]: ReturnType<typeof vi.fn>;
} & {
  // Non-method properties with mock-friendly types
  plugins: Array<unknown>;
  plugin: {
    _state: {
      args: unknown;
    };
  };
  eventBus: {
    [K in keyof EventBus]: ReturnType<typeof vi.fn>;
  };
  _tanstackTable: unknown;
};

export interface CreateMockTableOptions {
  columnVisibility?: Record<string, boolean>;
  sorting?: Array<{ id: string; desc: boolean }>;
  columnOrder?: string[];
  data?: unknown[];
  selectedRows?: unknown[];
  globalFilter?: string;
  pagination?: { pageIndex: number; pageSize: number };
}

/**
 * Creates a mock table instance for testing.
 * All methods from SeizenTableInstance are mocked with vi.fn().
 */
export function createMockTable(
  options: CreateMockTableOptions = {}
): MockTableInstance {
  const {
    columnVisibility = {},
    sorting = [],
    columnOrder = [],
    data = [],
    selectedRows = [],
    globalFilter = "",
    pagination = { pageIndex: 0, pageSize: 10 },
  } = options;

  return {
    // Selection
    getSelectedRows: vi.fn(() => selectedRows),
    setSelectedRows: vi.fn(),
    clearSelection: vi.fn(),

    // Filtering
    getFilterState: vi.fn(() => []),
    setFilter: vi.fn(),
    getGlobalFilter: vi.fn(() => globalFilter),
    setGlobalFilter: vi.fn(),

    // Sorting
    getSortingState: vi.fn(() => sorting),
    setSorting: vi.fn(),

    // Pagination
    getPaginationState: vi.fn(() => pagination),
    setPageIndex: vi.fn(),
    setPageSize: vi.fn(),

    // Data
    getData: vi.fn(() => data),
    getColumns: vi.fn(() => []),

    // Column Visibility
    getColumnVisibility: vi.fn(() => columnVisibility),
    setColumnVisibility: vi.fn(),
    toggleColumnVisibility: vi.fn(),

    // Column Order
    getColumnOrder: vi.fn(() => columnOrder),
    setColumnOrder: vi.fn(),
    moveColumn: vi.fn(),

    // Non-method properties
    plugins: [],
    plugin: {
      _state: {
        args: undefined,
      },
    },
    eventBus: {
      emit: vi.fn(),
      subscribe: vi.fn(() => vi.fn()), // returns unsubscribe function
    },
    _tanstackTable: {},
  };
}

// =============================================================================
// Mock Plugin Context
// =============================================================================

export interface EventCallbackStore {
  callbacks: Map<string, Function>;
  emit: (event: string, payload: unknown) => void;
}

export interface CreateMockPluginContextOptions {
  table?: MockTableInstance;
  columns?: PluginColumnInfo[];
  data?: unknown[];
  selectedRows?: unknown[];
  openArgs?: unknown;
}

export interface MockPluginContextResult {
  table: MockTableInstance;
  columns: PluginColumnInfo[];
  data: unknown[];
  selectedRows: unknown[];
  openArgs: unknown;
  eventCallbacks: EventCallbackStore;
  useEvent: (event: string, callback: Function) => void;
}

/**
 * Creates mock values for testing plugin components.
 * The returned `eventCallbacks` object allows you to manually trigger events
 * that were subscribed via `useEvent`.
 */
export function createMockPluginContext(
  options: CreateMockPluginContextOptions = {}
): MockPluginContextResult {
  const {
    table = createMockTable(),
    columns = [],
    data = [],
    selectedRows = [],
    openArgs = undefined,
  } = options;

  // Store for event callbacks registered via useEvent
  const callbacks = new Map<string, Function>();
  const eventCallbacks: EventCallbackStore = {
    callbacks,
    emit: (event: string, payload: unknown) => {
      const callback = callbacks.get(event);
      if (callback) {
        callback(payload);
      }
    },
  };

  // Mock useEvent that stores callbacks for later invocation
  const useEvent = (event: string, callback: Function) => {
    callbacks.set(event, callback);
  };

  return {
    table,
    columns,
    data,
    selectedRows,
    openArgs,
    eventCallbacks,
    useEvent,
  };
}
