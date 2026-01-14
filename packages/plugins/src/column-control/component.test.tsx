import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMockTable,
  createMockPluginContext,
  type MockTableInstance,
} from "../test-utils";
import type { PluginColumnInfo } from "@izumisy/seizen-table/plugin";

// =============================================================================
// Mock Setup
// =============================================================================

const defaultColumns: PluginColumnInfo[] = [
  { key: "name", header: "Name" },
  { key: "age", header: "Age" },
  { key: "email", header: "Email" },
];

// Variables to hold mock return values - these will be updated per test
let mockTable: MockTableInstance;
let mockColumns: PluginColumnInfo[];
let mockPluginArgs: unknown;
let mockUseEvent: (event: string, callback: Function) => void;

// Mock the plugin module
vi.mock("@izumisy/seizen-table/plugin", () => ({
  usePluginContext: vi.fn(() => ({
    table: mockTable,
    columns: mockColumns,
    data: [],
    selectedRows: [],
    openArgs: undefined,
    useEvent: mockUseEvent,
  })),
  usePluginArgs: vi.fn(() => mockPluginArgs),
}));

// Import components after mocking
import { ColumnControlPanel, VisibilityTab, SorterTab } from "./component";

// =============================================================================
// Test Setup
// =============================================================================

function setupMocks(
  options: {
    table?: MockTableInstance;
    columns?: PluginColumnInfo[];
    pluginArgs?: unknown;
  } = {}
) {
  const mockContext = createMockPluginContext({
    table: options.table,
    columns: options.columns ?? defaultColumns,
  });

  mockTable = mockContext.table;
  mockColumns = options.columns ?? defaultColumns;
  mockPluginArgs = options.pluginArgs ?? { width: 280 };
  mockUseEvent = mockContext.useEvent;

  return mockContext;
}

beforeEach(() => {
  vi.clearAllMocks();
  setupMocks();
});

// =============================================================================
// VisibilityTab Tests
// =============================================================================

describe("VisibilityTab", () => {
  it("renders all columns", () => {
    render(<VisibilityTab />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("shows checkboxes as checked when columns are visible", () => {
    setupMocks({
      table: createMockTable({
        columnVisibility: { name: true, age: true, email: true },
      }),
    });
    render(<VisibilityTab />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  it("shows checkbox as unchecked when column is hidden", () => {
    setupMocks({
      table: createMockTable({
        columnVisibility: { name: true, age: false, email: true },
      }),
    });
    render(<VisibilityTab />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked(); // name
    expect(checkboxes[1]).not.toBeChecked(); // age
    expect(checkboxes[2]).toBeChecked(); // email
  });

  it("calls toggleColumnVisibility when checkbox is clicked", async () => {
    const user = userEvent.setup();
    const { table } = setupMocks({
      table: createMockTable({
        columnVisibility: { name: true, age: true, email: true },
      }),
    });
    render(<VisibilityTab />);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]); // Click "Age" checkbox

    expect(table.toggleColumnVisibility).toHaveBeenCalledWith("age");
  });

  it("filters columns by search query", async () => {
    const user = userEvent.setup();
    render(<VisibilityTab />);

    const searchInput = screen.getByPlaceholderText("Search columns...");
    await user.type(searchInput, "name");

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.queryByText("Age")).not.toBeInTheDocument();
    expect(screen.queryByText("Email")).not.toBeInTheDocument();
  });

  it("filters columns case-insensitively", async () => {
    const user = userEvent.setup();
    render(<VisibilityTab />);

    const searchInput = screen.getByPlaceholderText("Search columns...");
    await user.type(searchInput, "EMAIL");

    expect(screen.queryByText("Name")).not.toBeInTheDocument();
    expect(screen.queryByText("Age")).not.toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("shows all columns when search is cleared", async () => {
    const user = userEvent.setup();
    render(<VisibilityTab />);

    const searchInput = screen.getByPlaceholderText("Search columns...");
    await user.type(searchInput, "name");
    expect(screen.queryByText("Age")).not.toBeInTheDocument();

    await user.clear(searchInput);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });
});

// =============================================================================
// SorterTab Tests
// =============================================================================

describe("SorterTab", () => {
  it("shows empty state when no sorting is applied", () => {
    setupMocks({
      table: createMockTable({ sorting: [] }),
    });
    render(<SorterTab />);

    expect(screen.getByText("No sorting applied")).toBeInTheDocument();
    expect(
      screen.getByText("Select a column above to add sorting")
    ).toBeInTheDocument();
  });

  it("shows dropdown with available columns", () => {
    setupMocks({
      table: createMockTable({ sorting: [] }),
    });
    render(<SorterTab />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    // Check options
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4); // placeholder + 3 columns
    expect(options[0]).toHaveTextContent("+ Add sort column...");
    expect(options[1]).toHaveTextContent("Name");
    expect(options[2]).toHaveTextContent("Age");
    expect(options[3]).toHaveTextContent("Email");
  });

  it("adds sorting when column is selected from dropdown", async () => {
    const user = userEvent.setup();
    const { table } = setupMocks({
      table: createMockTable({ sorting: [] }),
    });
    render(<SorterTab />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "name");

    expect(table.setSorting).toHaveBeenCalledWith([
      { id: "name", desc: false },
    ]);
  });

  it("displays active sorters", () => {
    setupMocks({
      table: createMockTable({
        sorting: [{ id: "name", desc: false }],
      }),
    });
    render(<SorterTab />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("↑ ASC")).toBeInTheDocument();
  });

  it("excludes already sorted columns from dropdown", () => {
    setupMocks({
      table: createMockTable({
        sorting: [{ id: "name", desc: false }],
      }),
    });
    render(<SorterTab />);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3); // placeholder + 2 remaining columns
    expect(options.map((o) => o.textContent)).not.toContain("Name");
  });

  it("toggles sort direction when direction button is clicked", async () => {
    const user = userEvent.setup();
    const { table } = setupMocks({
      table: createMockTable({
        sorting: [{ id: "name", desc: false }],
      }),
    });
    render(<SorterTab />);

    const directionButton = screen.getByText("↑ ASC");
    await user.click(directionButton);

    expect(table.setSorting).toHaveBeenCalledWith([{ id: "name", desc: true }]);
  });

  it("removes sorter when remove button is clicked", async () => {
    const user = userEvent.setup();
    const { table } = setupMocks({
      table: createMockTable({
        sorting: [
          { id: "name", desc: false },
          { id: "age", desc: true },
        ],
      }),
    });
    render(<SorterTab />);

    const removeButtons = screen.getAllByText("×");
    await user.click(removeButtons[0]); // Remove first sorter (name)

    expect(table.setSorting).toHaveBeenCalledWith([{ id: "age", desc: true }]);
  });

  it("clears all sorters when Clear all button is clicked", async () => {
    const user = userEvent.setup();
    const { table } = setupMocks({
      table: createMockTable({
        sorting: [
          { id: "name", desc: false },
          { id: "age", desc: true },
        ],
      }),
    });
    render(<SorterTab />);

    const clearAllButton = screen.getByText("Clear all");
    await user.click(clearAllButton);

    expect(table.setSorting).toHaveBeenCalledWith([]);
  });

  it("shows DESC indicator for descending sort", () => {
    setupMocks({
      table: createMockTable({
        sorting: [{ id: "name", desc: true }],
      }),
    });
    render(<SorterTab />);

    expect(screen.getByText("↓ DESC")).toBeInTheDocument();
  });

  it("shows priority numbers for multiple sorters", () => {
    setupMocks({
      table: createMockTable({
        sorting: [
          { id: "name", desc: false },
          { id: "age", desc: true },
        ],
      }),
    });
    render(<SorterTab />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});

// =============================================================================
// ColumnControlPanel Tests
// =============================================================================

describe("ColumnControlPanel", () => {
  it("renders with visibility tab active by default", () => {
    render(<ColumnControlPanel />);

    // Both tabs should be visible
    expect(screen.getByText("Visibility")).toBeInTheDocument();
    expect(screen.getByText("Sorter")).toBeInTheDocument();

    // Search input (visibility tab content) should be visible
    expect(
      screen.getByPlaceholderText("Search columns...")
    ).toBeInTheDocument();
  });

  it("switches to sorter tab when clicked", async () => {
    const user = userEvent.setup();
    render(<ColumnControlPanel />);

    const sorterTab = screen.getByText("Sorter");
    await user.click(sorterTab);

    // Sorter tab content should be visible
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("No sorting applied")).toBeInTheDocument();

    // Visibility tab content should not be visible
    expect(
      screen.queryByPlaceholderText("Search columns...")
    ).not.toBeInTheDocument();
  });

  it("switches back to visibility tab when clicked", async () => {
    const user = userEvent.setup();
    render(<ColumnControlPanel />);

    // Switch to sorter tab
    await user.click(screen.getByText("Sorter"));
    expect(
      screen.queryByPlaceholderText("Search columns...")
    ).not.toBeInTheDocument();

    // Switch back to visibility tab
    await user.click(screen.getByText("Visibility"));
    expect(
      screen.getByPlaceholderText("Search columns...")
    ).toBeInTheDocument();
  });

  it("applies width from plugin args", () => {
    setupMocks({ pluginArgs: { width: 350 } });
    const { container } = render(<ColumnControlPanel />);

    const panel = container.firstChild as HTMLElement;
    expect(panel.style.width).toBe("350px");
  });
});
