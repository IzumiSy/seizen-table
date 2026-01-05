import type { ReactNode } from "react";
import type { z } from "zod";
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
 * Base plugin interface - all plugins have id and name
 */
interface BasePlugin {
  id: string;
  name: string;
}

/**
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
 * Plugin can be either a sidepanel plugin or a context menu only plugin.
 * Use DataTablePlugin<unknown> for plugins that don't use TData in context menu.
 */
export type DataTablePlugin<TData = unknown> =
  | SidepanelPlugin<TData>
  | ContextMenuOnlyPlugin<TData>;

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
 * Options for defining a sidepanel plugin
 */
export interface DefineSidepanelPluginOptions<TData, TSchema extends z.ZodType>
  extends BasePluginOptions<TSchema> {
  /** Plugin position in the DataTable layout */
  position: PluginPosition;
  /** Header content displayed at the top of the panel. Can be a string or ReactNode. If not provided, name is used. */
  header?: string | ((context: PluginContext<z.infer<TSchema>>) => ReactNode);
  /** Render function that receives context with validated args and returns a React component */
  render: (context: PluginContext<z.infer<TSchema>>) => () => ReactNode;
  /** Optional context menu configuration */
  contextMenu?: {
    items: ContextMenuItemFactory<TData, z.infer<TSchema>>[];
  };
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

export type DefinePluginOptions<TData, TSchema extends z.ZodType> =
  | DefineSidepanelPluginOptions<TData, TSchema>
  | DefineContextMenuPluginOptions<TData, TSchema>;

/**
 * Define a plugin with type-safe configuration.
 *
 * This function creates a plugin factory with a `configure` method that validates
 * configuration at runtime using the provided Zod schema.
 *
 * @example Sidepanel Plugin
 * ```tsx
 * import { z } from "zod";
 * import { definePlugin, contextMenuItem, usePluginContext } from "@izumisy/seizen-datatable-react/plugin";
 *
 * const BulkActionsSchema = z.object({
 *   enableDelete: z.boolean().default(true),
 *   enableExport: z.boolean().default(true),
 * });
 *
 * function BulkActionsRenderer(context: PluginContext<z.infer<typeof BulkActionsSchema>>) {
 *   const { args } = context;
 *   return function Render() {
 *     const { selectedRows, useOnChange } = usePluginContext();
 *     useOnChange("selection", (selection) => {
 *       console.log("Selection changed:", selection);
 *     });
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
 *   position: "right-sider",
 *   args: BulkActionsSchema,
 *   render: BulkActionsRenderer,
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
 *   // No position or render - context menu only
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
    configure: (config: z.infer<TSchema>) => {
      // Validate config with Zod schema
      const validatedArgs = options.args.parse(config);
      const context: PluginContext<z.infer<TSchema>> = { args: validatedArgs };

      // Check if it's a sidepanel plugin
      if ("position" in options && "render" in options) {
        const sidepanelOptions = options as DefineSidepanelPluginOptions<
          TData,
          TSchema
        >;
        // Resolve header: string stays as string, function gets called
        const header =
          typeof sidepanelOptions.header === "function"
            ? sidepanelOptions.header(context)
            : sidepanelOptions.header;
        return {
          id: options.id,
          name: options.name,
          position: sidepanelOptions.position,
          header,
          render: sidepanelOptions.render(context),
          contextMenu: sidepanelOptions.contextMenu,
        } as SidepanelPlugin<TData>;
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
