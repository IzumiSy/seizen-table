import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMockTable,
  pluginMockState,
  initPluginMockState,
  setupPluginMocks,
  getPluginContextValue,
  getPluginArgsValue,
  MOCK_FILTER_OPERATORS,
  MOCK_FILTER_OPERATOR_LABELS,
} from "../test-utils";
import type { PluginColumnInfo } from "@izumisy/seizen-table/plugin";

// =============================================================================
// Mock Setup
// =============================================================================

const defaultColumns: PluginColumnInfo[] = [
  {
    key: "name",
    header: "Name",
    filterMeta: { filterType: "string" },
  },
  {
    key: "age",
    header: "Age",
    filterMeta: { filterType: "number" },
  },
  {
    key: "status",
    header: "Status",
    filterMeta: {
      filterType: "enum",
      filterEnumValues: ["Active", "Inactive", "Pending"],
    },
  },
  {
    key: "createdAt",
    header: "Created At",
    filterMeta: { filterType: "date" },
  },
  {
    key: "id",
    header: "ID",
    // No filterMeta - not filterable
  },
];

const defaultPluginArgs = { width: 320, disableGlobalSearch: false };

// Mock the plugin module - uses shared mock state functions
vi.mock("@izumisy/seizen-table/plugin", () => ({
  usePluginContext: vi.fn(() => getPluginContextValue()),
  usePluginArgs: vi.fn(() => getPluginArgsValue()),
  DEFAULT_FILTER_OPERATORS: MOCK_FILTER_OPERATORS,
  FILTER_OPERATOR_LABELS: MOCK_FILTER_OPERATOR_LABELS,
}));

// Import components after mocking
import {
  FilterPanel,
  FilterPluginPanel,
  GlobalSearchHeader,
  FilterItemRow,
  ValueInput,
  useFilterEvents,
  generateFilterId,
  getOperatorsForColumn,
  getDefaultOperator,
  operatorRequiresValue,
  type FilterItem,
} from "./component";

// =============================================================================
// Test Setup
// =============================================================================

// Helper to setup mocks with default values
function setupMocks(options: Parameters<typeof setupPluginMocks>[0] = {}) {
  return setupPluginMocks({
    ...options,
    defaultColumns,
    defaultPluginArgs,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  initPluginMockState({ defaultColumns, defaultPluginArgs });
});

// =============================================================================
// Helper Function Tests
// =============================================================================

describe("Helper Functions", () => {
  describe("generateFilterId", () => {
    it("generates unique IDs", () => {
      const id1 = generateFilterId();
      const id2 = generateFilterId();
      expect(id1).not.toBe(id2);
    });

    it("generates IDs with filter prefix", () => {
      const id = generateFilterId();
      expect(id).toMatch(/^filter-/);
    });
  });

  describe("getOperatorsForColumn", () => {
    it("returns string operators for string filter type", () => {
      const column: PluginColumnInfo = {
        key: "name",
        header: "Name",
        filterMeta: { filterType: "string" },
      };
      const operators = getOperatorsForColumn(column);
      expect(operators).toContain("contains");
      expect(operators).toContain("equals");
      expect(operators).toContain("starts_with");
    });

    it("returns number operators for number filter type", () => {
      const column: PluginColumnInfo = {
        key: "age",
        header: "Age",
        filterMeta: { filterType: "number" },
      };
      const operators = getOperatorsForColumn(column);
      expect(operators).toContain("equals");
      expect(operators).toContain("gt");
      expect(operators).toContain("lte");
    });

    it("returns empty array for column without filterMeta", () => {
      const column: PluginColumnInfo = {
        key: "id",
        header: "ID",
      };
      const operators = getOperatorsForColumn(column);
      expect(operators).toEqual([]);
    });

    it("uses custom operators if provided", () => {
      const column: PluginColumnInfo = {
        key: "name",
        header: "Name",
        filterMeta: {
          filterType: "string",
          filterOperators: ["equals", "contains"],
        },
      };
      const operators = getOperatorsForColumn(column);
      expect(operators).toEqual(["equals", "contains"]);
    });
  });

  describe("getDefaultOperator", () => {
    it("returns first operator for the column type", () => {
      const column: PluginColumnInfo = {
        key: "name",
        header: "Name",
        filterMeta: { filterType: "string" },
      };
      const operator = getDefaultOperator(column);
      expect(operator).toBe("contains");
    });

    it("returns contains as fallback for columns without operators", () => {
      const column: PluginColumnInfo = {
        key: "id",
        header: "ID",
      };
      const operator = getDefaultOperator(column);
      expect(operator).toBe("contains");
    });
  });

  describe("operatorRequiresValue", () => {
    it("returns false for is_empty operator", () => {
      expect(operatorRequiresValue("is_empty")).toBe(false);
    });

    it("returns false for is_not_empty operator", () => {
      expect(operatorRequiresValue("is_not_empty")).toBe(false);
    });

    it("returns true for contains operator", () => {
      expect(operatorRequiresValue("contains")).toBe(true);
    });

    it("returns true for equals operator", () => {
      expect(operatorRequiresValue("equals")).toBe(true);
    });

    it("returns true for gt operator", () => {
      expect(operatorRequiresValue("gt")).toBe(true);
    });
  });
});

// =============================================================================
// ValueInput Tests
// =============================================================================

describe("ValueInput", () => {
  const stringColumn: PluginColumnInfo = {
    key: "name",
    header: "Name",
    filterMeta: { filterType: "string" },
  };

  const numberColumn: PluginColumnInfo = {
    key: "age",
    header: "Age",
    filterMeta: { filterType: "number" },
  };

  const dateColumn: PluginColumnInfo = {
    key: "createdAt",
    header: "Created At",
    filterMeta: { filterType: "date" },
  };

  const enumColumn: PluginColumnInfo = {
    key: "status",
    header: "Status",
    filterMeta: {
      filterType: "enum",
      filterEnumValues: ["Active", "Inactive", "Pending"],
    },
  };

  it("renders text input for string filter type", () => {
    render(
      <ValueInput
        column={stringColumn}
        operator="contains"
        value=""
        onChange={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText("Value...")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
  });

  it("renders number input for number filter type", () => {
    render(
      <ValueInput
        column={numberColumn}
        operator="equals"
        value=""
        onChange={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText("Value...")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveAttribute("type", "number");
  });

  it("renders date input for date filter type", () => {
    render(
      <ValueInput
        column={dateColumn}
        operator="equals"
        value=""
        onChange={vi.fn()}
      />
    );

    // Date inputs don't have role="textbox" - we check by type
    const input = document.querySelector('input[type="date"]');
    expect(input).toBeInTheDocument();
  });

  it("renders select for enum filter type", () => {
    render(
      <ValueInput
        column={enumColumn}
        operator="equals"
        value=""
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders nothing for is_empty operator", () => {
    const { container } = render(
      <ValueInput
        column={stringColumn}
        operator="is_empty"
        value=""
        onChange={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for is_not_empty operator", () => {
    const { container } = render(
      <ValueInput
        column={stringColumn}
        operator="is_not_empty"
        value=""
        onChange={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("calls onChange when text input value changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ValueInput
        column={stringColumn}
        operator="contains"
        value=""
        onChange={onChange}
      />
    );

    await user.type(screen.getByRole("textbox"), "test");
    expect(onChange).toHaveBeenCalled();
  });

  it("calls onChange when enum select value changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ValueInput
        column={enumColumn}
        operator="equals"
        value=""
        onChange={onChange}
      />
    );

    await user.selectOptions(screen.getByRole("combobox"), "Active");
    expect(onChange).toHaveBeenCalledWith("Active");
  });
});

// =============================================================================
// FilterItemRow Tests
// =============================================================================

describe("FilterItemRow", () => {
  const mockFilter: FilterItem = {
    id: "filter-1",
    columnKey: "name",
    columnHeader: "Name",
    operator: "contains",
    value: "test",
  };

  const stringColumn: PluginColumnInfo = {
    key: "name",
    header: "Name",
    filterMeta: { filterType: "string" },
  };

  it("displays column header", () => {
    render(
      <FilterItemRow
        filter={mockFilter}
        column={stringColumn}
        onOperatorChange={vi.fn()}
        onValueChange={vi.fn()}
        onRemove={vi.fn()}
      />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("shows operator selector with correct value", () => {
    render(
      <FilterItemRow
        filter={mockFilter}
        column={stringColumn}
        onOperatorChange={vi.fn()}
        onValueChange={vi.fn()}
        onRemove={vi.fn()}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("contains");
  });

  it("shows available operators for the column type", () => {
    render(
      <FilterItemRow
        filter={mockFilter}
        column={stringColumn}
        onOperatorChange={vi.fn()}
        onValueChange={vi.fn()}
        onRemove={vi.fn()}
      />
    );

    expect(screen.getByText("Contains")).toBeInTheDocument();
    expect(screen.getByText("Equals")).toBeInTheDocument();
    expect(screen.getByText("Starts with")).toBeInTheDocument();
  });

  it("calls onOperatorChange when operator is changed", async () => {
    const user = userEvent.setup();
    const onOperatorChange = vi.fn();

    render(
      <FilterItemRow
        filter={mockFilter}
        column={stringColumn}
        onOperatorChange={onOperatorChange}
        onValueChange={vi.fn()}
        onRemove={vi.fn()}
      />
    );

    await user.selectOptions(screen.getByRole("combobox"), "equals");
    expect(onOperatorChange).toHaveBeenCalledWith("equals");
  });

  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(
      <FilterItemRow
        filter={mockFilter}
        column={stringColumn}
        onOperatorChange={vi.fn()}
        onValueChange={vi.fn()}
        onRemove={onRemove}
      />
    );

    await user.click(screen.getByTitle("Remove filter"));
    expect(onRemove).toHaveBeenCalled();
  });
});

// =============================================================================
// FilterPanel Tests
// =============================================================================

describe("FilterPanel", () => {
  it("renders empty state when no filters are applied", () => {
    render(<FilterPanel />);

    expect(screen.getByText("No filters applied")).toBeInTheDocument();
    expect(
      screen.getByText("Select a column above to add a filter")
    ).toBeInTheDocument();
  });

  it("shows message when no filterable columns exist", () => {
    setupMocks({ columns: [] });
    render(<FilterPanel />);

    expect(
      screen.getByText("No filterable columns configured")
    ).toBeInTheDocument();
  });

  it("shows dropdown with filterable columns only", () => {
    render(<FilterPanel />);

    const select = screen.getByRole("combobox");
    const options = within(select).getAllByRole("option");

    // Should have placeholder + 4 filterable columns (not ID)
    expect(options).toHaveLength(5);
    expect(options[0]).toHaveTextContent("+ Add filter...");
    expect(options[1]).toHaveTextContent("Name");
    expect(options[2]).toHaveTextContent("Age");
    expect(options[3]).toHaveTextContent("Status");
    expect(options[4]).toHaveTextContent("Created At");
  });

  it("adds a filter when column is selected from dropdown", async () => {
    const user = userEvent.setup();
    render(<FilterPanel />);

    await user.selectOptions(screen.getByRole("combobox"), "name");

    // Filter should be added
    expect(screen.getByText("Active filters (AND)")).toBeInTheDocument();
    // The column header "Name" should appear in filter item
    expect(screen.getAllByText("Name").length).toBeGreaterThan(0);
  });

  it("removes column from dropdown after adding filter", async () => {
    const user = userEvent.setup();
    render(<FilterPanel />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "name");

    // Name should no longer be in dropdown options
    const options = within(select).getAllByRole("option");
    expect(options.map((o) => o.textContent)).not.toContain("Name");
  });

  it("shows Clear all button when filters exist", async () => {
    const user = userEvent.setup();
    render(<FilterPanel />);

    await user.selectOptions(screen.getByRole("combobox"), "name");

    expect(screen.getByText("Clear all")).toBeInTheDocument();
  });

  it("clears all filters when Clear all is clicked", async () => {
    const user = userEvent.setup();
    const { table } = setupMocks();
    render(<FilterPanel />);

    // Add a filter
    await user.selectOptions(screen.getByRole("combobox"), "name");
    expect(screen.getByText("Active filters (AND)")).toBeInTheDocument();

    // Clear all
    await user.click(screen.getByText("Clear all"));

    expect(screen.getByText("No filters applied")).toBeInTheDocument();
    expect(table.setFilter).toHaveBeenCalledWith([]);
  });

  it("shows Apply Filters button when filters exist", async () => {
    const user = userEvent.setup();
    render(<FilterPanel />);

    await user.selectOptions(screen.getByRole("combobox"), "name");

    expect(screen.getByText("Apply Filters")).toBeInTheDocument();
  });

  it("applies filters to table when Apply Filters is clicked", async () => {
    const user = userEvent.setup();
    const { table } = setupMocks();
    render(<FilterPanel />);

    // Add a filter and set value
    await user.selectOptions(screen.getByRole("combobox"), "name");

    // Find the text input and type a value
    const valueInput = screen.getByPlaceholderText("Value...");
    await user.type(valueInput, "John");

    // Apply filters
    await user.click(screen.getByText("Apply Filters"));

    expect(table.setFilter).toHaveBeenCalledWith([
      {
        id: "name",
        value: {
          operator: "contains",
          value: "John",
        },
      },
    ]);
  });

  it("does not apply filters with empty values", async () => {
    const user = userEvent.setup();
    const { table } = setupMocks();
    render(<FilterPanel />);

    // Add a filter without setting value
    await user.selectOptions(screen.getByRole("combobox"), "name");

    // Apply filters
    await user.click(screen.getByText("Apply Filters"));

    expect(table.setFilter).toHaveBeenCalledWith([]);
  });

  it("applies filters with is_empty operator even without value", async () => {
    const user = userEvent.setup();
    const { table } = setupMocks();
    render(<FilterPanel />);

    // Add a filter
    const addFilterSelect = screen.getByRole("combobox");
    await user.selectOptions(addFilterSelect, "name");

    // Change operator to is_empty (after adding filter, we have 2 comboboxes)
    const comboboxes = screen.getAllByRole("combobox");
    // First combobox is add filter dropdown, second is operator dropdown
    const operatorSelect = comboboxes[1];
    await user.selectOptions(operatorSelect, "is_empty");

    // Apply filters
    await user.click(screen.getByText("Apply Filters"));

    expect(table.setFilter).toHaveBeenCalledWith([
      {
        id: "name",
        value: {
          operator: "is_empty",
          value: "",
        },
      },
    ]);
  });

  it("removes filter when remove button is clicked", async () => {
    const user = userEvent.setup();
    render(<FilterPanel />);

    // Add a filter
    await user.selectOptions(screen.getByRole("combobox"), "name");
    expect(screen.getByText("Active filters (AND)")).toBeInTheDocument();

    // Remove filter
    await user.click(screen.getByTitle("Remove filter"));

    expect(screen.getByText("No filters applied")).toBeInTheDocument();
  });

  it("can add multiple filters", async () => {
    const user = userEvent.setup();
    render(<FilterPanel />);

    // Add first filter
    let addFilterSelect = screen.getAllByRole("combobox")[0];
    await user.selectOptions(addFilterSelect, "name");

    // Add second filter (first combobox is still the add filter dropdown)
    addFilterSelect = screen.getAllByRole("combobox")[0];
    await user.selectOptions(addFilterSelect, "age");

    // Should have 2 filter items
    const removeButtons = screen.getAllByTitle("Remove filter");
    expect(removeButtons).toHaveLength(2);
  });

  it("disables dropdown when all filterable columns are used", async () => {
    const user = userEvent.setup();
    setupMocks({
      columns: [
        { key: "name", header: "Name", filterMeta: { filterType: "string" } },
      ],
    });
    render(<FilterPanel />);

    // Add the only filterable column
    const addFilterSelect = screen.getByRole("combobox");
    await user.selectOptions(addFilterSelect, "name");

    // First combobox (add filter dropdown) should be disabled
    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes[0]).toBeDisabled();
  });
});

// =============================================================================
// GlobalSearchHeader Tests
// =============================================================================

describe("GlobalSearchHeader", () => {
  it("renders global search input by default", () => {
    // GlobalSearchInput uses getGlobalFilter, so we need to add it to the mock
    const mockTableWithGlobalFilter = createMockTable();
    (mockTableWithGlobalFilter as any).getGlobalFilter = vi.fn(() => "");
    (mockTableWithGlobalFilter as any).setGlobalFilter = vi.fn();
    setupMocks({ table: mockTableWithGlobalFilter });

    render(<GlobalSearchHeader />);

    expect(
      screen.getByPlaceholderText("Search all columns...")
    ).toBeInTheDocument();
  });

  it("renders nothing when disableGlobalSearch is true", () => {
    setupMocks({
      pluginArgs: { width: 320, disableGlobalSearch: true },
    });
    const { container } = render(<GlobalSearchHeader />);

    expect(container).toBeEmptyDOMElement();
  });
});

// =============================================================================
// FilterPluginPanel Tests
// =============================================================================

describe("FilterPluginPanel", () => {
  it("renders with correct width from plugin args", () => {
    setupMocks({ pluginArgs: { width: 400, disableGlobalSearch: false } });
    const { container } = render(<FilterPluginPanel />);

    const panel = container.firstChild as HTMLElement;
    expect(panel.style.width).toBe("400px");
  });

  it("contains FilterPanel component", () => {
    render(<FilterPluginPanel />);

    expect(screen.getByText("No filters applied")).toBeInTheDocument();
  });
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

    it("auto-applies filter when value is provided", () => {
      const { table } = setupMocks();

      const newFilter: FilterItem = {
        id: "filter-1",
        columnKey: "name",
        columnHeader: "Name",
        operator: "equals",
        value: "John",
      };

      const addFilterWithValue = vi.fn().mockReturnValue(newFilter);

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

    it("does not auto-apply when value is null", () => {
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

      expect(table.setFilter).not.toHaveBeenCalled();
    });

    it("replaces existing filter for the same column", () => {
      const { table } = setupMocks();

      const existingFilter: FilterItem = {
        id: "filter-old",
        columnKey: "name",
        columnHeader: "Name",
        operator: "contains",
        value: "Old",
      };

      const newFilter: FilterItem = {
        id: "filter-new",
        columnKey: "name",
        columnHeader: "Name",
        operator: "equals",
        value: "New",
      };

      const addFilterWithValue = vi.fn().mockReturnValue(newFilter);

      renderHook(() =>
        useFilterEvents({
          filters: [existingFilter],
          addFilterWithValue,
        })
      );

      pluginMockState.eventCallbacks.emit("filter:add-request", {
        columnKey: "name",
        value: "New",
      });

      // Should only have the new filter, replacing the old one
      expect(table.setFilter).toHaveBeenCalledWith([
        {
          id: "name",
          value: {
            operator: "equals",
            value: "New",
          },
        },
      ]);
    });

    it("preserves other filters when adding new one", () => {
      const { table } = setupMocks();

      const existingFilter: FilterItem = {
        id: "filter-age",
        columnKey: "age",
        columnHeader: "Age",
        operator: "gt",
        value: "25",
      };

      const newFilter: FilterItem = {
        id: "filter-name",
        columnKey: "name",
        columnHeader: "Name",
        operator: "equals",
        value: "John",
      };

      const addFilterWithValue = vi.fn().mockReturnValue(newFilter);

      renderHook(() =>
        useFilterEvents({
          filters: [existingFilter],
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
            operator: "gt",
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
        columnKey: "nonexistent",
        value: "test",
      });

      expect(table.setFilter).not.toHaveBeenCalled();
    });
  });
});
