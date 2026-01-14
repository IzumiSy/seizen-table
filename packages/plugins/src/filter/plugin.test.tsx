import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  pluginMockState,
  initPluginMockState,
  setupPluginMocks,
  getPluginContextValue,
  getPluginArgsValue,
  MOCK_FILTER_OPERATORS,
  MOCK_FILTER_OPERATOR_LABELS,
} from "../test-utils";

// =============================================================================
// Mock Setup
// =============================================================================

const defaultPluginArgs = { width: 320, disableGlobalSearch: false };

// Mock the plugin module - uses shared mock state functions
vi.mock("@izumisy/seizen-table/plugin", () => ({
  usePluginContext: vi.fn(() => getPluginContextValue()),
  usePluginArgs: vi.fn(() => getPluginArgsValue()),
  DEFAULT_FILTER_OPERATORS: MOCK_FILTER_OPERATORS,
  FILTER_OPERATOR_LABELS: MOCK_FILTER_OPERATOR_LABELS,
  definePlugin: vi.fn(),
  cellContextMenuItem: vi.fn(),
}));

// Import after mocking
import { useFilterEvents } from "./plugin";

// =============================================================================
// Test Setup
// =============================================================================

// Helper to setup mocks with default values
function setupMocks(options: Parameters<typeof setupPluginMocks>[0] = {}) {
  return setupPluginMocks({
    ...options,
    defaultColumns: [],
    defaultPluginArgs,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  initPluginMockState({ defaultColumns: [], defaultPluginArgs });
});

// =============================================================================
// useFilterEvents Hook Tests
// =============================================================================

describe("useFilterEvents", () => {
  describe("filter:add-request event", () => {
    it("calls addFilterWithValue when event is emitted", () => {
      setupMocks();
      const addFilterWithValue = vi.fn().mockReturnValue({
        id: "filter-1",
        columnKey: "name",
        columnHeader: "Name",
        operator: "equals",
        value: "John",
      });

      renderHook(() =>
        useFilterEvents({
          filters: [],
          addFilterWithValue,
        })
      );

      pluginMockState.eventCallbacks.emit("filter:add-request", {
        columnKey: "name",
        value: "John",
      });

      expect(addFilterWithValue).toHaveBeenCalledWith("name", "John");
    });

    it("applies filter to table when value is provided", () => {
      const { table } = setupMocks();
      const addFilterWithValue = vi.fn().mockReturnValue({
        id: "filter-1",
        columnKey: "name",
        columnHeader: "Name",
        operator: "equals",
        value: "John",
      });

      renderHook(() =>
        useFilterEvents({
          filters: [],
          addFilterWithValue,
        })
      );

      pluginMockState.eventCallbacks.emit("filter:add-request", {
        columnKey: "name",
        value: "John",
      });

      expect(table.setFilter).toHaveBeenCalledWith([
        {
          id: "name",
          value: {
            operator: "equals",
            value: "John",
          },
        },
      ]);
    });

    it("does not apply filter when value is null", () => {
      const { table } = setupMocks();
      const addFilterWithValue = vi.fn().mockReturnValue({
        id: "filter-1",
        columnKey: "name",
        columnHeader: "Name",
        operator: "equals",
        value: "",
      });

      renderHook(() =>
        useFilterEvents({
          filters: [],
          addFilterWithValue,
        })
      );

      pluginMockState.eventCallbacks.emit("filter:add-request", {
        columnKey: "name",
        value: null,
      });

      expect(addFilterWithValue).toHaveBeenCalledWith("name", null);
      expect(table.setFilter).not.toHaveBeenCalled();
    });

    it("replaces existing filter for the same column", () => {
      const { table } = setupMocks();
      const existingFilters = [
        {
          id: "filter-old",
          columnKey: "name",
          columnHeader: "Name",
          operator: "equals" as const,
          value: "OldValue",
        },
      ];
      const addFilterWithValue = vi.fn().mockReturnValue({
        id: "filter-new",
        columnKey: "name",
        columnHeader: "Name",
        operator: "equals",
        value: "NewValue",
      });

      renderHook(() =>
        useFilterEvents({
          filters: existingFilters,
          addFilterWithValue,
        })
      );

      pluginMockState.eventCallbacks.emit("filter:add-request", {
        columnKey: "name",
        value: "NewValue",
      });

      expect(table.setFilter).toHaveBeenCalledWith([
        {
          id: "name",
          value: {
            operator: "equals",
            value: "NewValue",
          },
        },
      ]);
    });

    it("preserves other column filters when adding new filter", () => {
      const { table } = setupMocks();
      const existingFilters = [
        {
          id: "filter-age",
          columnKey: "age",
          columnHeader: "Age",
          operator: "equals" as const,
          value: "25",
        },
      ];
      const addFilterWithValue = vi.fn().mockReturnValue({
        id: "filter-name",
        columnKey: "name",
        columnHeader: "Name",
        operator: "equals",
        value: "John",
      });

      renderHook(() =>
        useFilterEvents({
          filters: existingFilters,
          addFilterWithValue,
        })
      );

      pluginMockState.eventCallbacks.emit("filter:add-request", {
        columnKey: "name",
        value: "John",
      });

      expect(table.setFilter).toHaveBeenCalledWith([
        {
          id: "age",
          value: {
            operator: "equals",
            value: "25",
          },
        },
        {
          id: "name",
          value: {
            operator: "equals",
            value: "John",
          },
        },
      ]);
    });

    it("skips filters with empty value when applying", () => {
      const { table } = setupMocks();
      const existingFilters = [
        {
          id: "filter-age",
          columnKey: "age",
          columnHeader: "Age",
          operator: "equals" as const,
          value: "", // Empty value - should be skipped
        },
      ];
      const addFilterWithValue = vi.fn().mockReturnValue({
        id: "filter-name",
        columnKey: "name",
        columnHeader: "Name",
        operator: "equals",
        value: "John",
      });

      renderHook(() =>
        useFilterEvents({
          filters: existingFilters,
          addFilterWithValue,
        })
      );

      pluginMockState.eventCallbacks.emit("filter:add-request", {
        columnKey: "name",
        value: "John",
      });

      // Only the new filter should be applied, empty one is skipped
      expect(table.setFilter).toHaveBeenCalledWith([
        {
          id: "name",
          value: {
            operator: "equals",
            value: "John",
          },
        },
      ]);
    });

    it("includes is_empty operator filters even without value", () => {
      const { table } = setupMocks();
      const existingFilters = [
        {
          id: "filter-age",
          columnKey: "age",
          columnHeader: "Age",
          operator: "is_empty" as const,
          value: "", // is_empty doesn't need a value
        },
      ];
      const addFilterWithValue = vi.fn().mockReturnValue({
        id: "filter-name",
        columnKey: "name",
        columnHeader: "Name",
        operator: "equals",
        value: "John",
      });

      renderHook(() =>
        useFilterEvents({
          filters: existingFilters,
          addFilterWithValue,
        })
      );

      pluginMockState.eventCallbacks.emit("filter:add-request", {
        columnKey: "name",
        value: "John",
      });

      // Both filters should be applied
      expect(table.setFilter).toHaveBeenCalledWith([
        {
          id: "age",
          value: {
            operator: "is_empty",
            value: "",
          },
        },
        {
          id: "name",
          value: {
            operator: "equals",
            value: "John",
          },
        },
      ]);
    });

    it("does not call setFilter when addFilterWithValue returns undefined", () => {
      const { table } = setupMocks();
      const addFilterWithValue = vi.fn().mockReturnValue(undefined);

      renderHook(() =>
        useFilterEvents({
          filters: [],
          addFilterWithValue,
        })
      );

      pluginMockState.eventCallbacks.emit("filter:add-request", {
        columnKey: "unknown-column",
        value: "test",
      });

      expect(addFilterWithValue).toHaveBeenCalledWith("unknown-column", "test");
      expect(table.setFilter).not.toHaveBeenCalled();
    });
  });
});
