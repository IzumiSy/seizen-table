// Demo components for documentation
export { BasicDemo } from "./components/BasicDemo";
export { FilterDemo } from "./components/FilterDemo";
export { PresetFilterDemo } from "./components/PresetFilterDemo";
export { ColumnControlDemo } from "./components/ColumnControlDemo";
export { DataExportDemo } from "./components/DataExportDemo";
export { RowDetailDemo } from "./components/RowDetailDemo";
export { FullDemo } from "./components/FullDemo";
export { ThemingDemo } from "./components/ThemingDemo";

// Demo name type for type-safe demo selection
export type DemoName =
  | "basic"
  | "theming"
  | "filter"
  | "preset-filter"
  | "column-control"
  | "data-export"
  | "row-detail"
  | "full";
