import { useMemo, type ReactNode } from "react";
import type { Cell, Column, Row } from "@tanstack/react-table";
import type {
  SeizenTablePlugin,
  PluginPosition,
  SidePanelSlot,
} from "./definePlugin";
import { getSidePanelSlot } from "./definePlugin";
import { usePluginContext } from "./Context";
import * as styles from "./styles.css";

// =============================================================================
// Internal Helpers
// =============================================================================

/**
 * Get side panel plugins with their slot configuration for a specific position
 */
function getSidePanelPluginsForPosition(
  plugins: SeizenTablePlugin<any>[],
  position: PluginPosition
): Array<{ plugin: SeizenTablePlugin<any>; slot: SidePanelSlot }> {
  return plugins
    .map((plugin) => {
      const slot = getSidePanelSlot(plugin);
      if (slot && slot.position === position) {
        return { plugin, slot };
      }
      return null;
    })
    .filter(
      (item): item is { plugin: SeizenTablePlugin<any>; slot: SidePanelSlot } =>
        item !== null
    );
}

// =============================================================================
// SidePanel
// =============================================================================

export interface SidePanelProps {
  /**
   * Position of the side panel
   */
  position: "left" | "right";
}

/**
 * Renders plugin side panels for the specified position.
 *
 * Place this component outside of SeizenTable.Content to position
 * side panels to the left or right of the main table content.
 *
 * @example
 * ```tsx
 * <SeizenTable.Root table={table}>
 *   <SeizenTablePlugins.SidePanel position="left" />
 *   <SeizenTable.Content>
 *     <SeizenTable.Table>...</SeizenTable.Table>
 *   </SeizenTable.Content>
 *   <SeizenTablePlugins.SidePanel position="right" />
 * </SeizenTable.Root>
 * ```
 */
export function SidePanel({ position }: SidePanelProps) {
  const internalPosition = position === "left" ? "left-sider" : "right-sider";
  const { table } = usePluginContext();
  const plugins = table.plugins;
  const activePluginId = table.plugin.getActiveId();
  const setActive = table.plugin.setActive;

  // Get side panel plugins for this position
  const sidePanelPlugins = getSidePanelPluginsForPosition(
    plugins,
    internalPosition
  );

  // Memoize plugin components to maintain stable references
  const pluginComponents = useMemo(() => {
    return sidePanelPlugins.map(({ plugin, slot }) => ({
      id: plugin.id,
      name: plugin.name,
      // Use header if provided, otherwise fallback to name
      header: slot.header ?? plugin.name,
      Component: slot.render,
    }));
  }, [sidePanelPlugins]);

  if (sidePanelPlugins.length === 0) {
    return null;
  }

  const dataPosition = position;
  // Check if the active plugin belongs to this position
  const isActiveHere = sidePanelPlugins.some(
    ({ plugin }) => plugin.id === activePluginId
  );

  return (
    <div className={styles.sidePanel} data-position={dataPosition}>
      {/* Vertical tabs */}
      <div className={styles.sidePanelTabs}>
        {pluginComponents.map(({ id, name }) => (
          <button
            key={id}
            className={styles.sidePanelTab}
            data-active={activePluginId === id || undefined}
            onClick={() => setActive(activePluginId === id ? null : id)}
          >
            <span className={styles.sidePanelTabLabel}>{name}</span>
          </button>
        ))}
      </div>

      {/* Plugin content - render all but only show active */}
      {pluginComponents.map(({ id, header, Component }) => (
        <div
          key={id}
          className={styles.sidePanelContent}
          style={{
            display: isActiveHere && activePluginId === id ? "flex" : "none",
          }}
        >
          <div className={styles.sidePanelHeader}>
            <div className={styles.sidePanelHeaderContent}>
              {typeof header === "string" ? (
                <h3 className={styles.sidePanelHeaderTitle}>{header}</h3>
              ) : (
                header
              )}
            </div>
            <button
              className={styles.sidePanelCloseButton}
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className={styles.sidePanelBody}>
            <Component />
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Header
// =============================================================================

/**
 * Renders all plugin header slots.
 *
 * Place this component above the table to render plugin-provided
 * header content (e.g., filter bars, toolbars).
 *
 * @example
 * ```tsx
 * <SeizenTable.Content>
 *   <SeizenTablePlugins.Header />
 *   <SeizenTable.Table>...</SeizenTable.Table>
 * </SeizenTable.Content>
 * ```
 */
export function Header() {
  const { table } = usePluginContext();
  const plugins = table.plugins;

  // Collect all header slots
  const headerSlots = plugins
    .filter((p) => p.slots.header !== undefined)
    .map((p) => ({ id: p.id, render: p.slots.header!.render }));

  if (headerSlots.length === 0) {
    return null;
  }

  return (
    <>
      {headerSlots.map(({ id, render: Render }) => (
        <div key={id} className={styles.headerSlot} data-plugin-id={id}>
          <Render />
        </div>
      ))}
    </>
  );
}

// =============================================================================
// Footer
// =============================================================================

/**
 * Renders all plugin footer slots.
 *
 * Place this component below the table to render plugin-provided
 * footer content.
 *
 * @example
 * ```tsx
 * <SeizenTable.Content>
 *   <SeizenTable.Table>...</SeizenTable.Table>
 *   <SeizenTablePlugins.Footer />
 *   <SeizenTable.Paginator />
 * </SeizenTable.Content>
 * ```
 */
export function Footer() {
  const { table } = usePluginContext();
  const plugins = table.plugins;

  // Collect all footer slots
  const footerSlots = plugins
    .filter((p) => p.slots.footer !== undefined)
    .map((p) => ({ id: p.id, render: p.slots.footer!.render }));

  if (footerSlots.length === 0) {
    return null;
  }

  return (
    <>
      {footerSlots.map(({ id, render: Render }) => (
        <div key={id} className={styles.footerSlot} data-plugin-id={id}>
          <Render />
        </div>
      ))}
    </>
  );
}

// =============================================================================
// InlineRow
// =============================================================================

export interface InlineRowProps<TData> {
  /**
   * The TanStack Table Row object
   */
  row: Row<TData>;

  /**
   * Number of columns for colspan (typically row.getVisibleCells().length)
   */
  colSpan: number;
}

/**
 * Renders inline row content for a specific row when a plugin is active.
 *
 * Use this component after <SeizenTable.Row> to render expandable content
 * provided by plugins (e.g., row details panel).
 *
 * @example
 * ```tsx
 * <SeizenTable.Body>
 *   {(row) => (
 *     <>
 *       <SeizenTable.Row row={row} />
 *       <SeizenTablePlugins.InlineRow row={row} colSpan={row.getVisibleCells().length} />
 *     </>
 *   )}
 * </SeizenTable.Body>
 * ```
 */
export function InlineRow<TData>({ row, colSpan }: InlineRowProps<TData>) {
  const { table, openArgs } = usePluginContext();
  const plugins = table.plugins;
  const activePluginId = table.plugin.getActiveId();

  // Get row id from original data (supports various id field types)
  const rowData = row.original as Record<string, unknown>;
  const rowId = rowData.id;

  // Check if any plugin with inlineRow slot is open and matches this row
  const activeInlineRowPlugin = plugins.find((p) => {
    if (!p.slots.inlineRow) return false;
    if (p.id !== activePluginId) return false;
    // Check if openArgs.id matches this row's id (convert to string for comparison)
    const args = openArgs as { id?: string | number } | undefined;
    return rowId !== undefined && String(args?.id) === String(rowId);
  });

  if (!activeInlineRowPlugin) {
    return null;
  }

  const renderInlineRow = activeInlineRowPlugin.slots.inlineRow!.render;

  return (
    <tr className={styles.inlineRow} data-plugin-id={activeInlineRowPlugin.id}>
      <td colSpan={colSpan} className={styles.inlineRowCell}>
        {renderInlineRow(row as any)}
      </td>
    </tr>
  );
}

// =============================================================================
// CellSlot
// =============================================================================

export interface CellSlotProps<TData> {
  /**
   * The TanStack Table Cell object
   */
  cell: Cell<TData, unknown>;

  /**
   * The TanStack Table Column object
   */
  column: Column<TData, unknown>;

  /**
   * The TanStack Table Row object
   */
  row: Row<TData>;

  /**
   * Default content to render if no plugin handles the cell
   */
  children: ReactNode;
}

/**
 * Renders cell content using plugin cell slots, or falls back to children.
 *
 * Use this component to wrap cell content when you want plugins to be able
 * to customize cell rendering.
 *
 * @example
 * ```tsx
 * <SeizenTable.Cell cell={cell} row={row}>
 *   <SeizenTablePlugins.CellSlot cell={cell} column={cell.column} row={row}>
 *     {flexRender(cell.column.columnDef.cell, cell.getContext())}
 *   </SeizenTablePlugins.CellSlot>
 * </SeizenTable.Cell>
 * ```
 */
export function CellSlot<TData>({
  cell,
  column,
  row,
  children,
}: CellSlotProps<TData>) {
  const { table } = usePluginContext();
  const plugins = table.plugins;

  // Find first plugin with a cell slot (first match wins)
  const cellPlugin = plugins.find((p) => p.slots.cell !== undefined);

  if (cellPlugin && cellPlugin.slots.cell) {
    return (
      <>
        {cellPlugin.slots.cell.render(cell as any, column as any, row as any)}
      </>
    );
  }

  return <>{children}</>;
}

// =============================================================================
// Namespace Export
// =============================================================================

/**
 * SeizenTablePlugins - Compound components for plugin-provided UI slots.
 *
 * These components render content provided by SeizenTable plugins.
 * Use them to compose custom layouts with plugin integration.
 */
export const SeizenTablePlugins = {
  SidePanel,
  Header,
  Footer,
  InlineRow,
  CellSlot,
} as const;
