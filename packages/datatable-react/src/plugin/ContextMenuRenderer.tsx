import {
  useEffect,
  useCallback,
  useState,
  createContext,
  useContext,
} from "react";
import type { ReactNode } from "react";
import type { Cell, Column, Row, Table } from "@tanstack/react-table";
import type { DataTablePlugin } from "./definePlugin";
import type {
  ContextMenuItemEntry,
  CellContextMenuItemContext,
  ColumnContextMenuItemContext,
} from "./contextMenuItem";
import type { EventBus } from "./useEventBus";
import * as styles from "./styles.css";

// =============================================================================
// Types
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
  plugins: DataTablePlugin<TData>[];
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
  plugins: DataTablePlugin<TData>[];
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
