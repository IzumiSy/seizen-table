import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import {
  ContextMenuProvider,
  useContextMenu,
  useContextMenuHandlers,
  cellContextMenuItem,
  columnContextMenuItem,
} from "./contextMenu";
import type { Cell, Column, Row, Table } from "@tanstack/react-table";
import type { SeizenTablePlugin } from "./definePlugin";

// =============================================================================
// Test Types
// =============================================================================

interface TestRow {
  id: number;
  name: string;
}

// =============================================================================
// Mock Factories
// =============================================================================

function createMockCell(value: unknown = "test value"): Cell<TestRow, unknown> {
  return {
    getValue: () => value,
    id: "test-cell",
    column: createMockColumn(),
    row: createMockRow(),
  } as unknown as Cell<TestRow, unknown>;
}

function createMockColumn(id = "name"): Column<TestRow, unknown> {
  return {
    id,
    getCanSort: () => true,
    toggleVisibility: vi.fn(),
    toggleSorting: vi.fn(),
  } as unknown as Column<TestRow, unknown>;
}

function createMockRow(
  original: TestRow = { id: 1, name: "Alice" }
): Row<TestRow> {
  return {
    id: "0",
    original,
    index: 0,
  } as unknown as Row<TestRow>;
}

function createMockTable(): Table<TestRow> {
  return {
    getSelectedRowModel: () => ({ rows: [] }),
    getAllColumns: () => [],
  } as unknown as Table<TestRow>;
}

function createMockRect(overrides: Partial<DOMRect> = {}): DOMRect {
  return {
    top: 100,
    left: 200,
    bottom: 150,
    right: 300,
    width: 100,
    height: 50,
    x: 200,
    y: 100,
    toJSON: () => ({}),
    ...overrides,
  } as DOMRect;
}

function createMockPlugin(
  overrides: Partial<SeizenTablePlugin<TestRow>> = {}
): SeizenTablePlugin<TestRow> {
  return {
    id: "test-plugin",
    name: "Test Plugin",
    slots: {},
    contextMenuItems: undefined,
    ...overrides,
  };
}

// =============================================================================
// cellContextMenuItem Tests
// =============================================================================

describe("cellContextMenuItem", () => {
  it("should create a cell context menu item factory", () => {
    const factory = cellContextMenuItem<TestRow>("test-item", (_ctx) => ({
      label: "Test Item",
      onClick: () => {},
    }));

    expect(factory.id).toBe("test-item");
    expect(typeof factory.create).toBe("function");
  });

  it("should create item with context values", () => {
    const factory = cellContextMenuItem<TestRow>("copy-value", (ctx) => ({
      label: `Copy "${ctx.value}"`,
      onClick: () => {},
    }));

    const context = {
      cell: createMockCell("Hello"),
      column: createMockColumn(),
      row: createMockRow(),
      value: "Hello",
      selectedRows: [],
      table: createMockTable(),
      pluginArgs: undefined,
      emit: vi.fn(),
    };

    const item = factory.create(context);

    expect(item.label).toBe('Copy "Hello"');
  });

  it("should support visibility based on context", () => {
    const factory = cellContextMenuItem<TestRow>("conditional-item", (ctx) => ({
      label: "Conditional Item",
      onClick: () => {},
      visible: ctx.value !== null,
    }));

    const contextWithValue = {
      cell: createMockCell("value"),
      column: createMockColumn(),
      row: createMockRow(),
      value: "value",
      selectedRows: [],
      table: createMockTable(),
      pluginArgs: undefined,
      emit: vi.fn(),
    };

    const contextWithNull = {
      ...contextWithValue,
      value: null,
    };

    const itemWithValue = factory.create(contextWithValue);
    const itemWithNull = factory.create(contextWithNull);

    expect(itemWithValue.visible).toBe(true);
    expect(itemWithNull.visible).toBe(false);
  });

  it("should support disabled state", () => {
    const factory = cellContextMenuItem<TestRow>("disabled-item", (ctx) => ({
      label: "Disabled Item",
      onClick: () => {},
      disabled: ctx.selectedRows.length === 0,
    }));

    const context = {
      cell: createMockCell(),
      column: createMockColumn(),
      row: createMockRow(),
      value: "test",
      selectedRows: [],
      table: createMockTable(),
      pluginArgs: undefined,
      emit: vi.fn(),
    };

    const item = factory.create(context);

    expect(item.disabled).toBe(true);
  });
});

// =============================================================================
// columnContextMenuItem Tests
// =============================================================================

describe("columnContextMenuItem", () => {
  it("should create a column context menu item factory", () => {
    const factory = columnContextMenuItem<TestRow>("hide-column", (_ctx) => ({
      label: "Hide Column",
      onClick: () => {},
    }));

    expect(factory.id).toBe("hide-column");
    expect(typeof factory.create).toBe("function");
  });

  it("should create item with column context", () => {
    const factory = columnContextMenuItem<TestRow>("sort-asc", (ctx) => ({
      label: "Sort Ascending",
      onClick: () => ctx.column.toggleSorting(false),
      visible: ctx.column.getCanSort(),
    }));

    const column = createMockColumn();
    const context = {
      column,
      table: createMockTable(),
      pluginArgs: undefined,
      emit: vi.fn(),
    };

    const item = factory.create(context);

    expect(item.label).toBe("Sort Ascending");
    expect(item.visible).toBe(true);

    item.onClick();
    expect(column.toggleSorting).toHaveBeenCalledWith(false);
  });
});

// =============================================================================
// ContextMenuProvider Tests
// =============================================================================

describe("ContextMenuProvider", () => {
  const mockEmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should provide context to children", () => {
    let capturedContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      capturedContext = useContextMenu<TestRow>();
      return null;
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[]}
        selectedRows={[]}
        emit={mockEmit}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    expect(capturedContext).not.toBeNull();
    expect(capturedContext!.menuState).toBeNull();
    expect(typeof capturedContext!.openCellMenu).toBe("function");
    expect(typeof capturedContext!.openColumnMenu).toBe("function");
    expect(typeof capturedContext!.closeMenu).toBe("function");
  });

  it("should open cell menu", async () => {
    let capturedContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      capturedContext = useContextMenu<TestRow>();
      return null;
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[]}
        selectedRows={[]}
        emit={mockEmit}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    const cell = createMockCell();
    const column = createMockColumn();
    const row = createMockRow();
    const rect = createMockRect();

    // Open cell menu
    act(() => {
      capturedContext!.openCellMenu(cell, column, row, rect);
    });

    expect(capturedContext!.menuState).not.toBeNull();
    expect(capturedContext!.menuState!.type).toBe("cell");
    expect(capturedContext!.menuState!.position).toEqual({
      top: rect.bottom,
      left: rect.left,
    });
  });

  it("should open column menu", () => {
    let capturedContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      capturedContext = useContextMenu<TestRow>();
      return null;
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[]}
        selectedRows={[]}
        emit={mockEmit}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    const column = createMockColumn();
    const rect = createMockRect();

    act(() => {
      capturedContext!.openColumnMenu(column, rect);
    });

    expect(capturedContext!.menuState).not.toBeNull();
    expect(capturedContext!.menuState!.type).toBe("column");
    expect(capturedContext!.menuState!.position).toEqual({
      top: rect.bottom,
      left: rect.left,
    });
  });

  it("should close menu", () => {
    let capturedContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      capturedContext = useContextMenu<TestRow>();
      return null;
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[]}
        selectedRows={[]}
        emit={mockEmit}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    const cell = createMockCell();
    const column = createMockColumn();
    const row = createMockRow();
    const rect = createMockRect();

    // Open and then close
    act(() => {
      capturedContext!.openCellMenu(cell, column, row, rect);
    });

    expect(capturedContext!.menuState).not.toBeNull();

    act(() => {
      capturedContext!.closeMenu();
    });

    expect(capturedContext!.menuState).toBeNull();
  });

  it("should render cell menu with built-in copy action", () => {
    let capturedContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      capturedContext = useContextMenu<TestRow>();
      return <div data-testid="consumer">Consumer</div>;
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[]}
        selectedRows={[]}
        emit={mockEmit}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    const cell = createMockCell("test value");
    const column = createMockColumn();
    const row = createMockRow();
    const rect = createMockRect();

    act(() => {
      capturedContext!.openCellMenu(cell, column, row, rect);
    });

    // Should render Copy button for cell menu
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });

  it("should render plugin cell menu items", () => {
    const pluginWithCellMenu = createMockPlugin({
      name: "Test Plugin",
      contextMenuItems: {
        cell: [
          cellContextMenuItem("plugin-action", () => ({
            label: "Plugin Action",
            onClick: () => {},
          })),
        ],
      },
    });

    let capturedContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      capturedContext = useContextMenu<TestRow>();
      return null;
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[pluginWithCellMenu]}
        selectedRows={[]}
        emit={mockEmit}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    const cell = createMockCell();
    const column = createMockColumn();
    const row = createMockRow();
    const rect = createMockRect();

    act(() => {
      capturedContext!.openCellMenu(cell, column, row, rect);
    });

    expect(screen.getByText("Plugin Action")).toBeInTheDocument();
    expect(screen.getByText("Test Plugin")).toBeInTheDocument();
  });

  it("should render plugin column menu items", () => {
    const pluginWithColumnMenu = createMockPlugin({
      name: "Column Plugin",
      contextMenuItems: {
        column: [
          columnContextMenuItem("column-action", () => ({
            label: "Column Action",
            onClick: () => {},
          })),
        ],
      },
    });

    let capturedContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      capturedContext = useContextMenu<TestRow>();
      return null;
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[pluginWithColumnMenu]}
        selectedRows={[]}
        emit={mockEmit}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    const column = createMockColumn();
    const rect = createMockRect();

    act(() => {
      capturedContext!.openColumnMenu(column, rect);
    });

    expect(screen.getByText("Column Action")).toBeInTheDocument();
    expect(screen.getByText("Column Plugin")).toBeInTheDocument();
  });

  it("should filter out items with visible: false", () => {
    const pluginWithConditionalItems = createMockPlugin({
      name: "Conditional Plugin",
      contextMenuItems: {
        cell: [
          cellContextMenuItem("visible-item", () => ({
            label: "Visible Item",
            onClick: () => {},
            visible: true,
          })),
          cellContextMenuItem("hidden-item", () => ({
            label: "Hidden Item",
            onClick: () => {},
            visible: false,
          })),
        ],
      },
    });

    let capturedContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      capturedContext = useContextMenu<TestRow>();
      return null;
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[pluginWithConditionalItems]}
        selectedRows={[]}
        emit={mockEmit}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    const cell = createMockCell();
    const column = createMockColumn();
    const row = createMockRow();
    const rect = createMockRect();

    act(() => {
      capturedContext!.openCellMenu(cell, column, row, rect);
    });

    expect(screen.getByText("Visible Item")).toBeInTheDocument();
    expect(screen.queryByText("Hidden Item")).not.toBeInTheDocument();
  });

  it("should close menu on Escape key", async () => {
    let capturedContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      capturedContext = useContextMenu<TestRow>();
      return null;
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[]}
        selectedRows={[]}
        emit={mockEmit}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    const cell = createMockCell();
    const column = createMockColumn();
    const row = createMockRow();
    const rect = createMockRect();

    act(() => {
      capturedContext!.openCellMenu(cell, column, row, rect);
    });

    expect(capturedContext!.menuState).not.toBeNull();

    // Press Escape
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });

    await waitFor(() => {
      expect(capturedContext!.menuState).toBeNull();
    });
  });

  it("should call onClick handler and close menu when item is clicked", async () => {
    const onClickHandler = vi.fn();
    const pluginWithClickHandler = createMockPlugin({
      contextMenuItems: {
        cell: [
          cellContextMenuItem("clickable-item", () => ({
            label: "Clickable Item",
            onClick: onClickHandler,
          })),
        ],
      },
    });

    let capturedContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      capturedContext = useContextMenu<TestRow>();
      return null;
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[pluginWithClickHandler]}
        selectedRows={[]}
        emit={mockEmit}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    const cell = createMockCell();
    const column = createMockColumn();
    const row = createMockRow();
    const rect = createMockRect();

    act(() => {
      capturedContext!.openCellMenu(cell, column, row, rect);
    });

    const menuItem = screen.getByText("Clickable Item");

    act(() => {
      fireEvent.click(menuItem);
    });

    expect(onClickHandler).toHaveBeenCalled();
    await waitFor(() => {
      expect(capturedContext!.menuState).toBeNull();
    });
  });

  it("should not call onClick for disabled items", () => {
    const onClickHandler = vi.fn();
    const pluginWithDisabledItem = createMockPlugin({
      contextMenuItems: {
        cell: [
          cellContextMenuItem("disabled-item", () => ({
            label: "Disabled Item",
            onClick: onClickHandler,
            disabled: true,
          })),
        ],
      },
    });

    let capturedContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      capturedContext = useContextMenu<TestRow>();
      return null;
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[pluginWithDisabledItem]}
        selectedRows={[]}
        emit={mockEmit}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    const cell = createMockCell();
    const column = createMockColumn();
    const row = createMockRow();
    const rect = createMockRect();

    act(() => {
      capturedContext!.openCellMenu(cell, column, row, rect);
    });

    const menuItem = screen.getByText("Disabled Item");

    act(() => {
      fireEvent.click(menuItem);
    });

    expect(onClickHandler).not.toHaveBeenCalled();
  });

  it("should not render column menu if no plugins have column items", () => {
    let capturedContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      capturedContext = useContextMenu<TestRow>();
      return <div data-testid="consumer">Consumer</div>;
    }

    const { container } = render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[]}
        selectedRows={[]}
        emit={mockEmit}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    const column = createMockColumn();
    const rect = createMockRect();

    act(() => {
      capturedContext!.openColumnMenu(column, rect);
    });

    // Menu state is set but no menu should be rendered (no items)
    // The ContextMenuRenderer returns null when sections is empty
    expect(container.querySelector('[class*="contextMenu"]')).toBeNull();
  });

  it("should handle multiple plugins with context menu items", () => {
    const plugin1 = createMockPlugin({
      id: "plugin-1",
      name: "Plugin 1",
      contextMenuItems: {
        cell: [
          cellContextMenuItem("plugin-1-action", () => ({
            label: "Plugin 1 Action",
            onClick: () => {},
          })),
        ],
      },
    });

    const plugin2 = createMockPlugin({
      id: "plugin-2",
      name: "Plugin 2",
      contextMenuItems: {
        cell: [
          cellContextMenuItem("plugin-2-action", () => ({
            label: "Plugin 2 Action",
            onClick: () => {},
          })),
        ],
      },
    });

    let capturedContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      capturedContext = useContextMenu<TestRow>();
      return null;
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[plugin1, plugin2]}
        selectedRows={[]}
        emit={mockEmit}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    const cell = createMockCell();
    const column = createMockColumn();
    const row = createMockRow();
    const rect = createMockRect();

    act(() => {
      capturedContext!.openCellMenu(cell, column, row, rect);
    });

    expect(screen.getByText("Plugin 1")).toBeInTheDocument();
    expect(screen.getByText("Plugin 1 Action")).toBeInTheDocument();
    expect(screen.getByText("Plugin 2")).toBeInTheDocument();
    expect(screen.getByText("Plugin 2 Action")).toBeInTheDocument();
  });
});

// =============================================================================
// useContextMenu Tests
// =============================================================================

describe("useContextMenu", () => {
  it("should throw error when used outside provider", () => {
    function TestComponent() {
      useContextMenu();
      return null;
    }

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useContextMenu must be used within ContextMenuProvider");
  });
});

// =============================================================================
// useContextMenuHandlers Tests
// =============================================================================

describe("useContextMenuHandlers", () => {
  it("should throw error when used outside provider", () => {
    function TestComponent() {
      useContextMenuHandlers();
      return null;
    }

    expect(() => {
      render(<TestComponent />);
    }).toThrow(
      "useContextMenuHandlers must be used within a context menu provider"
    );
  });

  it("should provide handleCellContextMenu handler", () => {
    let handlers: ReturnType<typeof useContextMenuHandlers<TestRow>> | null =
      null;

    function TestConsumer() {
      handlers = useContextMenuHandlers<TestRow>();
      return null;
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[]}
        selectedRows={[]}
        emit={vi.fn()}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    expect(handlers).not.toBeNull();
    expect(typeof handlers!.handleCellContextMenu).toBe("function");
    expect(typeof handlers!.handleColumnContextMenu).toBe("function");
  });

  it("should open cell menu when handleCellContextMenu is called", () => {
    let handlers: ReturnType<typeof useContextMenuHandlers<TestRow>> | null =
      null;
    let contextMenuContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      handlers = useContextMenuHandlers<TestRow>();
      contextMenuContext = useContextMenu<TestRow>();
      return (
        <table>
          <tbody>
            <tr>
              <td data-testid="test-cell">Test</td>
            </tr>
          </tbody>
        </table>
      );
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[]}
        selectedRows={[]}
        emit={vi.fn()}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    const cell = createMockCell();
    const column = createMockColumn();
    const row = createMockRow();

    // Simulate right click event
    const mockEvent = {
      preventDefault: vi.fn(),
      currentTarget: {
        getBoundingClientRect: () => createMockRect(),
      },
    } as unknown as React.MouseEvent<HTMLTableCellElement>;

    act(() => {
      handlers!.handleCellContextMenu(mockEvent, cell, column, row);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(contextMenuContext!.menuState).not.toBeNull();
    expect(contextMenuContext!.menuState!.type).toBe("cell");
  });

  it("should open column menu when handleColumnContextMenu is called", () => {
    let handlers: ReturnType<typeof useContextMenuHandlers<TestRow>> | null =
      null;
    let contextMenuContext: ReturnType<typeof useContextMenu<TestRow>> | null =
      null;

    function TestConsumer() {
      handlers = useContextMenuHandlers<TestRow>();
      contextMenuContext = useContextMenu<TestRow>();
      return (
        <table>
          <thead>
            <tr>
              <th data-testid="test-header">Name</th>
            </tr>
          </thead>
        </table>
      );
    }

    render(
      <ContextMenuProvider
        table={createMockTable()}
        plugins={[]}
        selectedRows={[]}
        emit={vi.fn()}
      >
        <TestConsumer />
      </ContextMenuProvider>
    );

    const column = createMockColumn();

    const mockEvent = {
      preventDefault: vi.fn(),
      currentTarget: {
        getBoundingClientRect: () => createMockRect(),
      },
    } as unknown as React.MouseEvent<HTMLTableCellElement>;

    act(() => {
      handlers!.handleColumnContextMenu(mockEvent, column);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(contextMenuContext!.menuState).not.toBeNull();
    expect(contextMenuContext!.menuState!.type).toBe("column");
  });
});
