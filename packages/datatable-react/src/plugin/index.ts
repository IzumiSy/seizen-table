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
  isSlotPlugin,
  isSidepanelPlugin,
  hasSidepanelSlot,
  getSidepanelSlot,
} from "./definePlugin";
export type {
  // Slot types
  SlotType,
  SidepanelSlot,
  HeaderSlot,
  FooterSlot,
  CellSlot,
  InlineRowSlot,
  PluginSlots,
  // Plugin types
  PluginPosition,
  SlotPlugin,
  SidepanelPlugin,
  ContextMenuOnlyPlugin,
  DataTablePlugin,
  PluginContext,
  // Define options
  DefinePluginSlots,
  DefineSlotPluginOptions,
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

// Slot Renderers
export {
  SidepanelSlotRenderer,
  HeaderSlotRenderer,
  FooterSlotRenderer,
  CellSlotRenderer,
  InlineRowSlotRenderer,
  PluginRenderer, // deprecated alias
} from "./Renderer";

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
