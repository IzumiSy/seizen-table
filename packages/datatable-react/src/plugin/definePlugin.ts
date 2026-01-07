import type { ReactNode } from "react";
import type { z } from "zod";
import type { Cell, Column, Row } from "@tanstack/react-table";
import type { ContextMenuItemFactory } from "./contextMenuItem";

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
 * - `sidepanel`: IDE-style vertical tab sidepanel (left or right)
 * - `header`: Renders between table header and body rows
 * - `footer`: Renders below the table
 * - `cell`: Custom cell renderer applied to all columns (first match wins)
 * - `inlineRow`: Renders below a specific row when opened (first match wins)
 */
export type SlotType = "sidepanel" | "header" | "footer" | "cell" | "inlineRow";

// =============================================================================
// Slot Definitions
// =============================================================================

/**
 * Sidepanel slot configuration
 */
export interface SidepanelSlot {
  position: PluginPosition;
  /** Header content displayed at the top of the panel */
  header?: string | ReactNode;
  /** Render function for sidepanel content */
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
 * Plugin slots configuration
 */
export interface PluginSlots<TData = unknown> {
  sidepanel?: SidepanelSlot;
  header?: HeaderSlot;
  footer?: FooterSlot;
  cell?: CellSlot<TData>;
  inlineRow?: InlineRowSlot<TData>;
}

// =============================================================================
// Plugin Types
// =============================================================================

/**
 * Base plugin interface - all plugins have id and name
 */
interface BasePlugin {
  id: string;
  name: string;
}

/**
 * Plugin with slots - can have any combination of slots
 */
export interface SlotPlugin<TData = unknown> extends BasePlugin {
  slots: PluginSlots<TData>;
  contextMenu?: {
    items: ContextMenuItemFactory<TData, unknown>[];
  };
}

/**
 * @deprecated Use SlotPlugin instead. Kept for backward compatibility.
 * Sidepanel plugin - renders UI in sidepanel and optionally adds context menu items
 */
export interface SidepanelPlugin<TData = unknown> extends BasePlugin {
  position: PluginPosition;
  /** Header content displayed at the top of the panel when open. Can be a string or ReactNode. */
  header?: string | ReactNode;
  render: () => ReactNode;
  contextMenu?: {
    items: ContextMenuItemFactory<TData, unknown>[];
  };
}

/**
 * Context menu only plugin - only adds items to the row context menu
 */
export interface ContextMenuOnlyPlugin<TData = unknown> extends BasePlugin {
  contextMenu: {
    items: ContextMenuItemFactory<TData, unknown>[];
  };
}

/**
 * Plugin can be a slot plugin, sidepanel plugin (legacy), or context menu only plugin.
 * Use DataTablePlugin<unknown> for plugins that don't use TData in context menu.
 */
export type DataTablePlugin<TData = unknown> =
  | SlotPlugin<TData>
  | SidepanelPlugin<TData>
  | ContextMenuOnlyPlugin<TData>;

/**
 * Type guard to check if a plugin is a slot plugin
 */
export function isSlotPlugin(
  plugin: DataTablePlugin<any>
): plugin is SlotPlugin<any> {
  return "slots" in plugin;
}

/**
 * Type guard to check if a plugin is a legacy sidepanel plugin
 */
export function isSidepanelPlugin(
  plugin: DataTablePlugin<any>
): plugin is SidepanelPlugin<any> {
  return "position" in plugin && "render" in plugin && !("slots" in plugin);
}

/**
 * Type guard to check if a plugin has a sidepanel (either slot or legacy)
 */
export function hasSidepanelSlot(
  plugin: DataTablePlugin<any>
): plugin is SlotPlugin<any> | SidepanelPlugin<any> {
  return isSlotPlugin(plugin)
    ? plugin.slots.sidepanel !== undefined
    : isSidepanelPlugin(plugin);
}

/**
 * Get sidepanel configuration from a plugin (normalizes legacy and slot plugins)
 */
export function getSidepanelSlot(
  plugin: DataTablePlugin<any>
): SidepanelSlot | undefined {
  if (isSlotPlugin(plugin)) {
    return plugin.slots.sidepanel;
  }
  if (isSidepanelPlugin(plugin)) {
    return {
      position: plugin.position,
      header: plugin.header,
      render: plugin.render,
    };
  }
  return undefined;
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
  /** Plugin display name (used as vertical tab label for sidepanel plugins) */
  name: string;
  /** Zod schema for configuration validation */
  args: TSchema;
}

/**
 * Options for defining a context menu only plugin
 */
export interface DefineContextMenuPluginOptions<
  TData,
  TSchema extends z.ZodType
> extends BasePluginOptions<TSchema> {
  contextMenu: {
    items: ContextMenuItemFactory<TData, z.infer<TSchema>>[];
  };
}

/**
 * Slot render function definitions for defineSlotPlugin
 */
export interface DefinePluginSlots<TData, TSchema extends z.ZodType> {
  /** Sidepanel slot - renders in left or right sidepanel */
  sidepanel?: {
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
  /** Optional context menu configuration */
  contextMenu?: {
    items: ContextMenuItemFactory<TData, z.infer<TSchema>>[];
  };
}

export type DefinePluginOptions<TData, TSchema extends z.ZodType> =
  | DefineSlotPluginOptions<TData, TSchema>
  | DefineContextMenuPluginOptions<TData, TSchema>;

/**
 * Define a plugin with type-safe configuration.
 *
 * This function creates a plugin factory with a `configure` method that validates
 * configuration at runtime using the provided Zod schema.
 *
 * @example Slot Plugin with Sidepanel
 * ```tsx
 * import { z } from "zod";
 * import { definePlugin, contextMenuItem, usePluginContext } from "@izumisy/seizen-datatable-react/plugin";
 *
 * const BulkActionsSchema = z.object({
 *   enableDelete: z.boolean().default(true),
 *   enableExport: z.boolean().default(true),
 * });
 *
 * function createSidepanelRenderer(context: PluginContext<z.infer<typeof BulkActionsSchema>>) {
 *   const { args } = context;
 *   return function SidepanelContent() {
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
 *     sidepanel: {
 *       position: "right-sider",
 *       render: createSidepanelRenderer,
 *     },
 *   },
 *   contextMenu: {
 *     items: [
 *       contextMenuItem("delete", (ctx) => ({
 *         label: `Delete ${ctx.selectedRows.length} items`,
 *         onClick: () => handleDelete(ctx.selectedRows),
 *         visible: ctx.pluginArgs.enableDelete,
 *       })),
 *     ],
 *   },
 * });
 *
 * // Usage
 * <DataTable plugins={[BulkActions.configure({ enableDelete: true })]} />
 * ```
 *
 * @example Context Menu Only Plugin
 * ```tsx
 * const RowActions = definePlugin({
 *   id: "row-actions",
 *   name: "Row Actions",
 *   args: z.object({
 *     enableCopyId: z.boolean().default(true),
 *   }),
 *   contextMenu: {
 *     items: [
 *       contextMenuItem("copy-id", (ctx) => ({
 *         label: "Copy ID",
 *         onClick: () => navigator.clipboard.writeText(ctx.row.id),
 *         visible: ctx.pluginArgs.enableCopyId,
 *       })),
 *     ],
 *   },
 * });
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

      // Check if it's a slot-based plugin
      if ("slots" in options) {
        const slotOptions = options as DefineSlotPluginOptions<TData, TSchema>;
        const slots: PluginSlots<TData> = {};

        // Build sidepanel slot
        if (slotOptions.slots.sidepanel) {
          const sidepanelDef = slotOptions.slots.sidepanel;
          const header =
            typeof sidepanelDef.header === "function"
              ? sidepanelDef.header(context)
              : sidepanelDef.header;
          slots.sidepanel = {
            position: sidepanelDef.position,
            header,
            render: sidepanelDef.render(context),
          };
        }

        // Build header slot
        if (slotOptions.slots.header) {
          slots.header = {
            render: slotOptions.slots.header.render(context),
          };
        }

        // Build footer slot
        if (slotOptions.slots.footer) {
          slots.footer = {
            render: slotOptions.slots.footer.render(context),
          };
        }

        // Build cell slot
        if (slotOptions.slots.cell) {
          slots.cell = {
            render: slotOptions.slots.cell.render(context),
          };
        }

        // Build inlineRow slot
        if (slotOptions.slots.inlineRow) {
          slots.inlineRow = {
            render: slotOptions.slots.inlineRow.render(context),
          };
        }

        return {
          id: options.id,
          name: options.name,
          slots,
          contextMenu: slotOptions.contextMenu,
        } as SlotPlugin<TData>;
      }

      // Context menu only plugin
      const contextMenuOptions = options as DefineContextMenuPluginOptions<
        TData,
        TSchema
      >;
      return {
        id: options.id,
        name: options.name,
        contextMenu: contextMenuOptions.contextMenu,
      } as ContextMenuOnlyPlugin<TData>;
    },
  };
}
