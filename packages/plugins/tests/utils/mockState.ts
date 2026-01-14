import type { PluginColumnInfo } from "@izumisy/seizen-table/plugin";
import {
  createMockPluginContext,
  type MockTableInstance,
  type EventCallbackStore,
  type MockPluginContextResult,
} from "./mocks";

// =============================================================================
// Mutable State for vi.mock Hoisting Workaround
// =============================================================================

/**
 * Global mutable state that can be referenced by vi.mock factories.
 * vi.mock is hoisted, so we need to use a separate module to hold state
 * that the mock factory can reference.
 */
export const pluginMockState = {
  table: null as unknown as MockTableInstance,
  columns: [] as PluginColumnInfo[],
  pluginArgs: {} as unknown,
  useEvent: (() => {}) as (event: string, callback: Function) => void,
  eventCallbacks: {
    callbacks: new Map<string, Function>(),
    emit: () => {},
  } as EventCallbackStore,
};

/**
 * Returns the mock value for usePluginContext.
 * Use this in vi.mock to avoid duplicating the mock object structure.
 */
export function getPluginContextValue() {
  return {
    table: pluginMockState.table,
    columns: pluginMockState.columns,
    data: [],
    selectedRows: [],
    openArgs: undefined,
    useEvent: pluginMockState.useEvent,
  };
}

/**
 * Returns the mock value for usePluginArgs.
 */
export function getPluginArgsValue() {
  return pluginMockState.pluginArgs;
}

/**
 * Initialize or reset the mock state.
 * Call this in beforeEach to reset state between tests.
 */
export function initPluginMockState(config: {
  defaultColumns?: PluginColumnInfo[];
  defaultPluginArgs?: unknown;
}): void {
  const { defaultColumns = [], defaultPluginArgs = {} } = config;

  const mockContext = createMockPluginContext({
    columns: defaultColumns,
  });

  pluginMockState.table = mockContext.table;
  pluginMockState.columns = defaultColumns;
  pluginMockState.pluginArgs = defaultPluginArgs;
  pluginMockState.useEvent = mockContext.useEvent;
  pluginMockState.eventCallbacks = mockContext.eventCallbacks;
}

/**
 * Update mock state for a specific test.
 */
export function setupPluginMocks(options: {
  table?: MockTableInstance;
  columns?: PluginColumnInfo[];
  pluginArgs?: unknown;
  defaultColumns?: PluginColumnInfo[];
  defaultPluginArgs?: unknown;
}): MockPluginContextResult {
  const {
    columns,
    defaultColumns = pluginMockState.columns,
    defaultPluginArgs = pluginMockState.pluginArgs,
  } = options;

  const mockContext = createMockPluginContext({
    table: options.table,
    columns: columns ?? defaultColumns,
  });

  pluginMockState.table = mockContext.table;
  pluginMockState.columns = columns ?? defaultColumns;
  pluginMockState.pluginArgs = options.pluginArgs ?? defaultPluginArgs;
  pluginMockState.useEvent = mockContext.useEvent;
  pluginMockState.eventCallbacks = mockContext.eventCallbacks;

  return mockContext;
}

// Note: For filter constants (DEFAULT_FILTER_OPERATORS, FILTER_OPERATOR_LABELS),
// use vi.importActual in vi.mock to get the real values from the core package.
// Example:
//   vi.mock("@izumisy/seizen-table/plugin", async (importOriginal) => {
//     const actual = await importOriginal<typeof import("@izumisy/seizen-table/plugin")>();
//     return {
//       ...actual,
//       usePluginContext: vi.fn(() => getPluginContextValue()),
//       usePluginArgs: vi.fn(() => getPluginArgsValue()),
//     };
//   });
