/**
 * Plugin development utilities
 *
 * This module provides types and helpers for creating SeizenTable plugins.
 * Import from "@izumisy/seizen-table/plugin" to avoid bundling the entire SeizenTable package.
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
  SeizenTablePlugin,
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
export {
  usePluginContext,
  PluginContextProvider,
  usePluginArgs,
} from "./Context";
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

// SeizenTablePlugins compound components
export { SeizenTablePlugins } from "./SeizenTablePlugins";
export type {
  SidePanelProps,
  InlineRowProps,
  CellProps,
} from "./SeizenTablePlugins";

// PluginControl (for type-safe plugin.open())
export type { PluginArgsRegistry } from "./usePluginControl";

// Event types
export { useEventBus } from "./useEventBus";
export type {
  SeizenTableEventMap,
  SeizenTableEventName,
  EventBusRegistry,
  EventBus,
} from "./useEventBus";
