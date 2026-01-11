import { useMemo, type ReactNode } from "react";
import type { Cell, Column, Row } from "@tanstack/react-table";
import type {
  DataTablePlugin,
  PluginPosition,
  SidePanelSlot,
} from "./definePlugin";
import { getSidePanelSlot } from "./definePlugin";
import { usePluginContext } from "./Context";
import * as styles from "./styles.css";

interface PluginRendererProps {
  /**
   * Plugin position to render
   */
  position: PluginPosition;
}

/**
 * Get side panel plugins with their slot configuration for a specific position
 */
function getSidePanelPluginsForPosition(
  plugins: DataTablePlugin<any>[],
  position: PluginPosition
): Array<{ plugin: DataTablePlugin<any>; slot: SidePanelSlot }> {
  return plugins
    .map((plugin) => {
      const slot = getSidePanelSlot(plugin);
      if (slot && slot.position === position) {
        return { plugin, slot };
      }
      return null;
    })
    .filter(
      (item): item is { plugin: DataTablePlugin<any>; slot: SidePanelSlot } =>
        item !== null
    );
}

/**
 * Renders side panel plugins for a specific position
 */
export function SidePanelSlotRenderer({ position }: PluginRendererProps) {
  const { table } = usePluginContext();
  const plugins = table.plugins;
  const activePluginId = table.plugin.getActiveId();
  const setActive = table.plugin.setActive;

  // Get side panel plugins for this position
  const sidePanelPlugins = getSidePanelPluginsForPosition(plugins, position);

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

  const dataPosition = position === "left-sider" ? "left" : "right";
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
// Header Slot Renderer
// =============================================================================

/**
 * Renders all header slots from plugins in registration order
 */
export function HeaderSlotRenderer() {
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
// Footer Slot Renderer
// =============================================================================

/**
 * Renders all footer slots from plugins in registration order
 */
export function FooterSlotRenderer() {
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
// Cell Slot Renderer
// =============================================================================

interface CellSlotRendererProps<TData> {
  cell: Cell<TData, unknown>;
  column: Column<TData, unknown>;
  row: Row<TData>;
  /** Default content to render if no plugin handles the cell */
  children: ReactNode;
}

/**
 * Renders cell content using the first matching plugin cell slot,
 * or falls back to default content
 */
export function CellSlotRenderer<TData>({
  cell,
  column,
  row,
  children,
}: CellSlotRendererProps<TData>) {
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
// Inline Row Slot Renderer
// =============================================================================

interface InlineRowSlotRendererProps<TData = unknown> {
  row: Row<TData>;
  /** Number of columns for colspan */
  colSpan: number;
}

/**
 * Renders inline row content for a specific row.
 * Only renders when:
 * 1. A plugin with inlineRow slot is open (via plugin.open)
 * 2. The openArgs.id matches the row's original.id (supports string or number)
 * First matching plugin wins.
 */
export function InlineRowSlotRenderer<TData>({
  row,
  colSpan,
}: InlineRowSlotRendererProps<TData>) {
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
