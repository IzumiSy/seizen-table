import { vi } from "vitest";
import type { PluginColumnInfo } from "@izumisy/seizen-table/plugin";

// =============================================================================
// Mock Table Instance
// =============================================================================

export interface MockTableInstance {
  getColumnVisibility: ReturnType<typeof vi.fn>;
  setColumnVisibility: ReturnType<typeof vi.fn>;
  toggleColumnVisibility: ReturnType<typeof vi.fn>;
  getSortingState: ReturnType<typeof vi.fn>;
  setSorting: ReturnType<typeof vi.fn>;
  getColumnOrder: ReturnType<typeof vi.fn>;
  moveColumn: ReturnType<typeof vi.fn>;
  getData: ReturnType<typeof vi.fn>;
  getSelectedRows: ReturnType<typeof vi.fn>;
  getFilterState: ReturnType<typeof vi.fn>;
  getPaginationState: ReturnType<typeof vi.fn>;
  getColumns: ReturnType<typeof vi.fn>;
  eventBus: {
    emit: ReturnType<typeof vi.fn>;
    subscribe: ReturnType<typeof vi.fn>;
  };
  plugin: {
    _state: {
      args: unknown;
    };
  };
}

export interface CreateMockTableOptions {
  columnVisibility?: Record<string, boolean>;
  sorting?: Array<{ id: string; desc: boolean }>;
  columnOrder?: string[];
  data?: unknown[];
  selectedRows?: unknown[];
}

/**
 * Creates a mock table instance for testing.
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
  } = options;

  return {
    getColumnVisibility: vi.fn(() => columnVisibility),
    setColumnVisibility: vi.fn(),
    toggleColumnVisibility: vi.fn(),
    getSortingState: vi.fn(() => sorting),
    setSorting: vi.fn(),
    getColumnOrder: vi.fn(() => columnOrder),
    moveColumn: vi.fn(),
    getData: vi.fn(() => data),
    getSelectedRows: vi.fn(() => selectedRows),
    getFilterState: vi.fn(() => []),
    getPaginationState: vi.fn(() => ({ pageIndex: 0, pageSize: 10 })),
    getColumns: vi.fn(() => []),
    eventBus: {
      emit: vi.fn(),
      subscribe: vi.fn(() => vi.fn()), // returns unsubscribe function
    },
    plugin: {
      _state: {
        args: undefined,
      },
    },
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
