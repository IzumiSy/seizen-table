/**
 * Plugin development utilities
 *
 * This module provides types and helpers for creating DataTable plugins.
 * Import from "@izumisy/seizen-datatable-react/plugin" to avoid bundling
 * the entire datatable package.
 */

// definePlugin
export {
  definePlugin,
  hasSidePanelSlot,
  getSidePanelSlot,
} from "./definePlugin";
export type {
  // Slot types
  SlotType,
  SidePanelSlot,
  HeaderSlot,
  FooterSlot,
  CellSlot,
  InlineRowSlot,
  PluginSlots,
  ContextMenuItemsSlot,
  // Plugin types
  PluginPosition,
  DataTablePlugin,
  PluginContext,
  // Define options
  DefinePluginSlots,
  DefineSlotPluginOptions,
  DefinePluginOptions,
} from "./definePlugin";

// Context Menu
export {
  cellContextMenuItem,
  columnContextMenuItem,
  useContextMenuHandlers,
} from "./contextMenu";
export type {
  ContextMenuItemEntry,
  CellContextMenuItemContext,
  CellContextMenuItemFactory,
  ColumnContextMenuItemContext,
  ColumnContextMenuItemFactory,
} from "./contextMenu";

// PluginContext
export { usePluginContext, PluginContextProvider } from "./Context";
export type {
  PluginContextValue,
  PluginColumnInfo,
  // Filter types
  FilterType,
  FilterOperator,
  StringFilterOperator,
  NumberFilterOperator,
  DateFilterOperator,
  EnumFilterOperator,
  ColumnFilterMeta,
} from "./Context";
export { DEFAULT_FILTER_OPERATORS, FILTER_OPERATOR_LABELS } from "./Context";

// DataTablePlugins compound components
export { DataTablePlugins } from "./DataTablePlugins";
export type {
  SidePanelProps,
  InlineRowProps,
  CellSlotProps,
} from "./DataTablePlugins";

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
