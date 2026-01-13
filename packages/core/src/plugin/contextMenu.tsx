import {
  useEffect,
  useCallback,
  useState,
  createContext,
  useContext,
} from "react";
import type { ReactNode } from "react";
import type { Cell, Column, Row, Table } from "@tanstack/react-table";
import type { SeizenTablePlugin } from "./definePlugin";
import type { EventBus } from "./useEventBus";
import * as styles from "./styles.css";

// =============================================================================
// Context Menu Item Types
// =============================================================================

/**
 * Context menu item definition (resolved from factory)
 */
export interface ContextMenuItemEntry {
  /** Display label for the menu item */
  label: string;
  /** Optional icon to display alongside the label */
  icon?: ReactNode;
  /** Handler called when the menu item is clicked */
  onClick: () => void;
  /** Whether to show this item (default: true) */
  visible?: boolean;
  /** Whether the item is disabled (default: false) */
  disabled?: boolean;
}

// =============================================================================
// Cell Context Menu
// =============================================================================

/**
 * Context passed to cellContextMenuItem factory function
 */
export interface CellContextMenuItemContext<TData, TArgs = unknown> {
  /** The cell that was right-clicked */
  cell: Cell<TData, unknown>;
  /** The column of the right-clicked cell */
  column: Column<TData, unknown>;
  /** The row containing the right-clicked cell */
  row: Row<TData>;
  /** The raw value of the cell (cell.getValue()) */
  value: unknown;
  /** Currently selected rows in the table */
  selectedRows: TData[];
  /** TanStack Table instance */
  table: Table<TData>;
  /** Plugin configuration args (validated by Zod schema) */
  pluginArgs: TArgs;
  /** Emit an event to the EventBus */
  emit: EventBus["emit"];
}

/**
 * Factory type for creating cell context menu items
 */
export interface CellContextMenuItemFactory<TData, TArgs = unknown> {
  id: string;
  create: (
    ctx: CellContextMenuItemContext<TData, TArgs>
  ) => ContextMenuItemEntry;
}

// =============================================================================
// Column Context Menu
// =============================================================================

/**
 * Context passed to columnContextMenuItem factory function
 */
export interface ColumnContextMenuItemContext<TData, TArgs = unknown> {
  /** The column header that was right-clicked */
  column: Column<TData, unknown>;
  /** TanStack Table instance */
  table: Table<TData>;
  /** Plugin configuration args (validated by Zod schema) */
  pluginArgs: TArgs;
  /** Emit an event to the EventBus */
  emit: EventBus["emit"];
}

/**
 * Factory type for creating column context menu items
 */
export interface ColumnContextMenuItemFactory<TData, TArgs = unknown> {
  id: string;
  create: (
    ctx: ColumnContextMenuItemContext<TData, TArgs>
  ) => ContextMenuItemEntry;
}

// =============================================================================
// Context Menu Item Factory Functions
// =============================================================================

/**
 * Helper function to create a cell context menu item with full context access.
 *
 * The factory function receives context including the clicked cell, column, row,
 * cell value, table instance, and plugin configuration args.
 *
 * @param id - Unique identifier for the menu item
 * @param factory - Factory function that receives context and returns menu item entry
 *
 * @example Basic usage - Filter by cell value
 * ```tsx
 * cellContextMenuItem("filter-by-value", (ctx) => ({
 *   label: `Filter by "${ctx.value}"`,
 *   onClick: () => {
 *     ctx.column.setFilterValue(ctx.value);
 *   },
 * }))
 * ```
 *
 * @example With visibility based on column type
 * ```tsx
 * cellContextMenuItem("copy-value", (ctx) => ({
 *   label: "Copy value",
 *   onClick: () => navigator.clipboard.writeText(String(ctx.value)),
 *   visible: ctx.value != null,
 * }))
 * ```
 */
export function cellContextMenuItem<TData, TArgs = unknown>(
  id: string,
  factory: (
    ctx: CellContextMenuItemContext<TData, TArgs>
  ) => ContextMenuItemEntry
): CellContextMenuItemFactory<TData, TArgs> {
  return {
    id,
    create: factory,
  };
}

/**
 * Helper function to create a column context menu item with full context access.
 *
 * The factory function receives context including the clicked column header,
 * table instance, and plugin configuration args.
 *
 * @param id - Unique identifier for the menu item
 * @param factory - Factory function that receives context and returns menu item entry
 *
 * @example Basic usage - Hide column
 * ```tsx
 * columnContextMenuItem("hide-column", (ctx) => ({
 *   label: "Hide column",
 *   onClick: () => {
 *     ctx.column.toggleVisibility(false);
 *   },
 * }))
 * ```
 *
 * @example Sort column
 * ```tsx
 * columnContextMenuItem("sort-asc", (ctx) => ({
 *   label: "Sort ascending",
 *   onClick: () => {
 *     ctx.column.toggleSorting(false);
 *   },
 *   visible: ctx.column.getCanSort(),
 * }))
 * ```
 */
export function columnContextMenuItem<TData, TArgs = unknown>(
  id: string,
  factory: (
    ctx: ColumnContextMenuItemContext<TData, TArgs>
  ) => ContextMenuItemEntry
): ColumnContextMenuItemFactory<TData, TArgs> {
  return {
    id,
    create: factory,
  };
}

// =============================================================================
// Context Menu State Types
// =============================================================================

export type ContextMenuType = "cell" | "column";

export interface CellContextMenuState<TData> {
  type: "cell";
  position: { top: number; left: number };
  cell: Cell<TData, unknown>;
  column: Column<TData, unknown>;
  row: Row<TData>;
}

export interface ColumnContextMenuState<TData> {
  type: "column";
  position: { top: number; left: number };
  column: Column<TData, unknown>;
}

export type ContextMenuState<TData> =
  | CellContextMenuState<TData>
  | ColumnContextMenuState<TData>
  | null;

export interface ContextMenuContextValue<TData> {
  menuState: ContextMenuState<TData>;
  openCellMenu: (
    cell: Cell<TData, unknown>,
    column: Column<TData, unknown>,
    row: Row<TData>,
    rect: DOMRect
  ) => void;
  openColumnMenu: (column: Column<TData, unknown>, rect: DOMRect) => void;
  closeMenu: () => void;
}

// =============================================================================
// Context
// =============================================================================

export const ContextMenuContext =
  createContext<ContextMenuContextValue<any> | null>(null);

export function useContextMenu<TData>(): ContextMenuContextValue<TData> {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) {
    throw new Error("useContextMenu must be used within ContextMenuProvider");
  }
  return ctx;
}

// =============================================================================
// Provider
// =============================================================================

interface ContextMenuProviderProps<TData> {
  children: ReactNode;
  table: Table<TData>;
  plugins: SeizenTablePlugin<TData>[];
  selectedRows: TData[];
  emit: EventBus["emit"];
}

export function ContextMenuProvider<TData>({
  children,
  table,
  plugins,
  selectedRows,
  emit,
}: ContextMenuProviderProps<TData>) {
  const [menuState, setMenuState] = useState<ContextMenuState<TData>>(null);

  const openCellMenu = useCallback(
    (
      cell: Cell<TData, unknown>,
      column: Column<TData, unknown>,
      row: Row<TData>,
      rect: DOMRect
    ) => {
      setMenuState({
        type: "cell",
        position: { top: rect.bottom, left: rect.left },
        cell,
        column,
        row,
      });
    },
    []
  );

  const openColumnMenu = useCallback(
    (column: Column<TData, unknown>, rect: DOMRect) => {
      setMenuState({
        type: "column",
        position: { top: rect.bottom, left: rect.left },
        column,
      });
    },
    []
  );

  const closeMenu = useCallback(() => {
    setMenuState(null);
  }, []);

  return (
    <ContextMenuContext.Provider
      value={{ menuState, openCellMenu, openColumnMenu, closeMenu }}
    >
      {children}
      {menuState && (
        <ContextMenuRenderer
          menuState={menuState}
          table={table}
          plugins={plugins}
          selectedRows={selectedRows}
          emit={emit}
          onClose={closeMenu}
        />
      )}
    </ContextMenuContext.Provider>
  );
}

// =============================================================================
// Renderer
// =============================================================================

interface ContextMenuRendererProps<TData> {
  menuState: NonNullable<ContextMenuState<TData>>;
  table: Table<TData>;
  plugins: SeizenTablePlugin<TData>[];
  selectedRows: TData[];
  emit: EventBus["emit"];
  onClose: () => void;
}

interface MenuSection {
  pluginName: string | null;
  items: ContextMenuItemEntry[];
}

function ContextMenuRenderer<TData>({
  menuState,
  table,
  plugins,
  selectedRows,
  emit,
  onClose,
}: ContextMenuRendererProps<TData>) {
  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Build menu sections
  const sections: MenuSection[] = [];

  if (menuState.type === "cell") {
    // Built-in Copy action
    const copyItems: ContextMenuItemEntry[] = [
      {
        label: "Copy",
        onClick: () => {
          const value = menuState.cell.getValue();
          navigator.clipboard.writeText(String(value ?? ""));
          onClose();
        },
      },
    ];
    sections.push({ pluginName: null, items: copyItems });

    // Plugin cell context menu items
    for (const plugin of plugins) {
      const cellItems = plugin.contextMenuItems?.cell;
      if (!cellItems || cellItems.length === 0) continue;

      const context: CellContextMenuItemContext<TData, unknown> = {
        cell: menuState.cell,
        column: menuState.column,
        row: menuState.row,
        value: menuState.cell.getValue(),
        selectedRows,
        table,
        pluginArgs: undefined,
        emit,
      };

      const resolvedItems = cellItems
        .map((factory) => factory.create(context))
        .filter((item) => item.visible !== false);

      if (resolvedItems.length > 0) {
        sections.push({ pluginName: plugin.name, items: resolvedItems });
      }
    }
  } else if (menuState.type === "column") {
    // Plugin column context menu items
    for (const plugin of plugins) {
      const columnItems = plugin.contextMenuItems?.column;
      if (!columnItems || columnItems.length === 0) continue;

      const context: ColumnContextMenuItemContext<TData, unknown> = {
        column: menuState.column,
        table,
        pluginArgs: undefined,
        emit,
      };

      const resolvedItems = columnItems
        .map((factory) => factory.create(context))
        .filter((item) => item.visible !== false);

      if (resolvedItems.length > 0) {
        sections.push({ pluginName: plugin.name, items: resolvedItems });
      }
    }
  }

  // Don't render if no items
  if (sections.length === 0 || sections.every((s) => s.items.length === 0)) {
    return null;
  }

  return (
    <>
      {/* Overlay to capture outside clicks */}
      <div className={styles.contextMenuOverlay} onClick={onClose} />

      {/* Menu */}
      <div
        className={styles.contextMenu}
        style={{
          top: menuState.position.top,
          left: menuState.position.left,
        }}
      >
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={styles.contextMenuSection}>
            {section.pluginName && (
              <div className={styles.contextMenuSectionLabel}>
                {section.pluginName}
              </div>
            )}
            {section.items.map((item, itemIndex) => (
              <button
                key={itemIndex}
                className={styles.contextMenuItem}
                data-disabled={item.disabled || undefined}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    onClose();
                  }
                }}
              >
                {item.icon && (
                  <span className={styles.contextMenuItemIcon}>
                    {item.icon}
                  </span>
                )}
                <span className={styles.contextMenuItemLabel}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

// =============================================================================
// useContextMenuHandlers Hook
// =============================================================================

/**
 * Hook to get context menu handlers for table cells and column headers.
 *
 * This hook provides event handlers that:
 * - Prevent default browser context menu
 * - Calculate element position (DOMRect)
 * - Open the appropriate context menu type
 *
 * @example
 * ```tsx
 * const handlers = useContextMenuHandlers<Person>();
 *
 * <td onContextMenu={(e) => handlers.handleCellContextMenu(e, cell, column, row)}>
 *   {content}
 * </td>
 *
 * <th onContextMenu={(e) => handlers.handleColumnContextMenu(e, column)}>
 *   {header}
 * </th>
 * ```
 *
 * @returns Object with handleCellContextMenu and handleColumnContextMenu functions
 */
export function useContextMenuHandlers<TData>() {
  const ctx = useContext(
    ContextMenuContext
  ) as ContextMenuContextValue<TData> | null;

  if (!ctx) {
    throw new Error(
      "useContextMenuHandlers must be used within a context menu provider (SeizenTable.Root or ContextMenuProvider)"
    );
  }

  const { openCellMenu, openColumnMenu } = ctx;

  const handleCellContextMenu = useCallback(
    (
      e: React.MouseEvent<HTMLTableCellElement>,
      cell: Cell<TData, unknown>,
      column: Column<TData, unknown>,
      row: Row<TData>
    ) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      openCellMenu(cell, column, row, rect);
    },
    [openCellMenu]
  );

  const handleColumnContextMenu = useCallback(
    (
      e: React.MouseEvent<HTMLTableCellElement>,
      column: Column<TData, unknown>
    ) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      openColumnMenu(column, rect);
    },
    [openColumnMenu]
  );

  return {
    /**
     * Handler for cell context menu events.
     * Call this in the onContextMenu prop of table cells.
     */
    handleCellContextMenu,

    /**
     * Handler for column header context menu events.
     * Call this in the onContextMenu prop of table header cells.
     */
    handleColumnContextMenu,
  };
}
