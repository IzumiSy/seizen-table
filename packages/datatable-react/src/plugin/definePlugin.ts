import type { ReactNode } from "react";
import type { z } from "zod";
import type { Cell, Column, Row } from "@tanstack/react-table";
import type {
  CellContextMenuItemFactory,
  ColumnContextMenuItemFactory,
} from "./contextMenuItem";

// =============================================================================
// Plugin Types
// =============================================================================

/**
 * Plugin position in the DataTable layout.
 *
 * - `left-sider`: IDE-style vertical tab on the left side. Ideal for navigation, tree views.
 * - `right-sider`: IDE-style vertical tab on the right side. Ideal for details, inspectors.
 */
export type PluginPosition = "left-sider" | "right-sider";

/**
 * Slot types available for plugins to render components.
 *
 * - `side-panel`: IDE-style vertical tab side panel (left or right)
 * - `header`: Renders between table header and body rows
 * - `footer`: Renders below the table
 * - `cell`: Custom cell renderer applied to all columns (first match wins)
 * - `inline-row`: Renders below a specific row when opened (first match wins)
 */
export type SlotType =
  | "side-panel"
  | "header"
  | "footer"
  | "cell"
  | "inline-row";

// =============================================================================
// Slot Definitions
// =============================================================================

/**
 * SidePanel slot configuration
 */
export interface SidePanelSlot {
  position: PluginPosition;
  /** Header content displayed at the top of the panel */
  header?: string | ReactNode;
  /** Render function for side panel content */
  render: () => ReactNode;
}

/**
 * Header slot configuration - renders between thead and tbody
 */
export interface HeaderSlot {
  /** Render function for header content */
  render: () => ReactNode;
}

/**
 * Footer slot configuration - renders below the table
 */
export interface FooterSlot {
  /** Render function for footer content */
  render: () => ReactNode;
}

/**
 * Cell slot configuration - custom cell renderer for all columns
 */
export interface CellSlot<TData = unknown> {
  /** Render function receiving cell, column, and row from TanStack Table */
  render: (
    cell: Cell<TData, unknown>,
    column: Column<TData, unknown>,
    row: Row<TData>
  ) => ReactNode;
}

/**
 * Inline row slot configuration - renders below a specific row
 */
export interface InlineRowSlot<TData = unknown> {
  /** Render function receiving the row */
  render: (row: Row<TData>) => ReactNode;
}

/**
 * Context menu items configuration for plugins
 */
export interface ContextMenuItemsSlot<TData = unknown> {
  /** Cell context menu items - shown when right-clicking a cell */
  cell?: CellContextMenuItemFactory<TData, unknown>[];
  /** Column context menu items - shown when right-clicking a column header */
  column?: ColumnContextMenuItemFactory<TData, unknown>[];
}

/**
 * Plugin slots configuration
 */
export interface PluginSlots<TData = unknown> {
  sidePanel?: SidePanelSlot;
  header?: HeaderSlot;
  footer?: FooterSlot;
  cell?: CellSlot<TData>;
  inlineRow?: InlineRowSlot<TData>;
}

// =============================================================================
// Plugin Types
// =============================================================================

/**
 * DataTable plugin type.
 * Use DataTablePlugin<unknown> for plugins that don't use TData in context menu.
 */
export interface DataTablePlugin<TData = unknown> {
  /** Unique plugin identifier */
  id: string;
  /** Plugin display name (used as vertical tab label for side panel plugins) */
  name: string;
  /** Slot configurations */
  slots: PluginSlots<TData>;
  /** Context menu items for cell and column */
  contextMenuItems?: ContextMenuItemsSlot<TData>;
}

/**
 * Type guard to check if a plugin has a side panel slot
 */
export function hasSidePanelSlot(plugin: DataTablePlugin<any>): boolean {
  return plugin.slots.sidePanel !== undefined;
}

/**
 * Get side panel configuration from a plugin
 */
export function getSidePanelSlot(
  plugin: DataTablePlugin<any>
): SidePanelSlot | undefined {
  return plugin.slots.sidePanel;
}

// =============================================================================
// Plugin Definition Types
// =============================================================================

/**
 * Context passed to plugin render function
 */
export interface PluginContext<TArgs> {
  /** Validated configuration from args schema */
  args: TArgs;
}

/**
 * Base options shared by all plugin types
 */
interface BasePluginOptions<TSchema extends z.ZodType> {
  /** Unique plugin identifier */
  id: string;
  /** Plugin display name (used as vertical tab label for side panel plugins) */
  name: string;
  /** Zod schema for configuration validation */
  args: TSchema;
}

/**
 * Slot render function definitions for defineSlotPlugin
 */
export interface DefinePluginSlots<TData, TSchema extends z.ZodType> {
  /** SidePanel slot - renders in left or right side panel */
  sidePanel?: {
    position: PluginPosition;
    header?: string | ((context: PluginContext<z.infer<TSchema>>) => ReactNode);
    render: (context: PluginContext<z.infer<TSchema>>) => () => ReactNode;
  };
  /** Header slot - renders between table header and body */
  header?: {
    render: (context: PluginContext<z.infer<TSchema>>) => () => ReactNode;
  };
  /** Footer slot - renders below the table */
  footer?: {
    render: (context: PluginContext<z.infer<TSchema>>) => () => ReactNode;
  };
  /** Cell slot - custom cell renderer for all columns (first match wins) */
  cell?: {
    render: (
      context: PluginContext<z.infer<TSchema>>
    ) => (
      cell: Cell<TData, unknown>,
      column: Column<TData, unknown>,
      row: Row<TData>
    ) => ReactNode;
  };
  /** Inline row slot - renders below a specific row when opened (first match wins) */
  inlineRow?: {
    render: (
      context: PluginContext<z.infer<TSchema>>
    ) => (row: Row<TData>) => ReactNode;
  };
}

/**
 * Options for defining a slot-based plugin
 */
export interface DefineSlotPluginOptions<TData, TSchema extends z.ZodType>
  extends BasePluginOptions<TSchema> {
  /** Slot configurations */
  slots: DefinePluginSlots<TData, TSchema>;
  /** Context menu items for cell and column */
  contextMenuItems?: {
    cell?: CellContextMenuItemFactory<TData, z.infer<TSchema>>[];
    column?: ColumnContextMenuItemFactory<TData, z.infer<TSchema>>[];
  };
}

export type DefinePluginOptions<
  TData,
  TSchema extends z.ZodType
> = DefineSlotPluginOptions<TData, TSchema>;

/**
 * Define a plugin with type-safe configuration.
 *
 * This function creates a plugin factory with a `configure` method that validates
 * configuration at runtime using the provided Zod schema.
 *
 * @example Slot Plugin with SidePanel
 * ```tsx
 * import { z } from "zod";
 * import { definePlugin, cellContextMenuItem, usePluginContext } from "@izumisy/seizen-datatable-react/plugin";
 *
 * const BulkActionsSchema = z.object({
 *   enableDelete: z.boolean().default(true),
 *   enableExport: z.boolean().default(true),
 * });
 *
 * function createSidePanelRenderer(context: PluginContext<z.infer<typeof BulkActionsSchema>>) {
 *   const { args } = context;
 *   return function SidePanelContent() {
 *     const { selectedRows } = usePluginContext();
 *     if (selectedRows.length === 0) return null;
 *     return (
 *       <div className="bulk-actions">
 *         <span>{selectedRows.length} selected</span>
 *         {args.enableDelete && <button>Delete</button>}
 *         {args.enableExport && <button>Export</button>}
 *       </div>
 *     );
 *   };
 * }
 *
 * const BulkActions = definePlugin({
 *   id: "bulk-actions",
 *   name: "Bulk Actions",
 *   args: BulkActionsSchema,
 *   slots: {
 *     sidePanel: {
 *       position: "right-sider",
 *       render: createSidePanelRenderer,
 *     },
 *   },
 *   contextMenuItems: {
 *     cell: [
 *       cellContextMenuItem("copy-value", (ctx) => ({
 *         label: "Copy value",
 *         onClick: () => navigator.clipboard.writeText(String(ctx.value)),
 *       })),
 *     ],
 *   },
 * });
 *
 * // Usage
 * <DataTable plugins={[BulkActions.configure({ enableDelete: true })]} />
 * ```
 */
export function definePlugin<TData, TSchema extends z.ZodType>(
  options: DefinePluginOptions<TData, TSchema>
) {
  return {
    configure: (config: z.input<TSchema>) => {
      // Validate config with Zod schema
      const validatedArgs = options.args.parse(config);
      const context: PluginContext<z.infer<TSchema>> = { args: validatedArgs };

      const slots: PluginSlots<TData> = {};

      // Build SidePanel slot
      if (options.slots.sidePanel) {
        const sidePanelDef = options.slots.sidePanel;
        const header =
          typeof sidePanelDef.header === "function"
            ? sidePanelDef.header(context)
            : sidePanelDef.header;
        slots.sidePanel = {
          position: sidePanelDef.position,
          header,
          render: sidePanelDef.render(context),
        };
      }

      // Build header slot
      if (options.slots.header) {
        slots.header = {
          render: options.slots.header.render(context),
        };
      }

      // Build footer slot
      if (options.slots.footer) {
        slots.footer = {
          render: options.slots.footer.render(context),
        };
      }

      // Build cell slot
      if (options.slots.cell) {
        slots.cell = {
          render: options.slots.cell.render(context),
        };
      }

      // Build inlineRow slot
      if (options.slots.inlineRow) {
        slots.inlineRow = {
          render: options.slots.inlineRow.render(context),
        };
      }

      return {
        id: options.id,
        name: options.name,
        slots,
        contextMenuItems: options.contextMenuItems,
      } as DataTablePlugin<TData>;
    },
  };
}
