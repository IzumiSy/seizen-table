/**
 * Plugin development utilities
 *
 * This module provides types and helpers for creating DataTable plugins.
 * Import from "@izumisy/seizen-datatable-react/plugin" to avoid bundling
 * the entire datatable package.
 */

// definePlugin
export { definePlugin } from "./definePlugin";
export type {
  PluginPosition,
  SidepanelPlugin,
  ContextMenuOnlyPlugin,
  DataTablePlugin,
  PluginContext,
  DefineSidepanelPluginOptions,
  DefineContextMenuPluginOptions,
  DefinePluginOptions,
} from "./definePlugin";

// contextMenuItem
export { contextMenuItem } from "./contextMenuItem";
export type {
  ContextMenuItemEntry,
  ContextMenuItemContext,
  ContextMenuItemFactory,
} from "./contextMenuItem";

// PluginContext
export { usePluginContext, PluginContextProvider } from "./Context";
export type { PluginContextValue, PluginColumnInfo } from "./Context";

// PluginControl (for type-safe plugin.open())
export type { PluginArgsRegistry } from "./usePluginControl";

// Event types
export { useEventBus } from "./useEventBus";
export type {
  EventBusRegistry,
  DataTableEventMap,
  DataTableEventName,
  EventBus,
} from "./useEventBus";
