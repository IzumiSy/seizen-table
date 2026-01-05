import { style, globalStyle } from "@vanilla-extract/css";

/**
 * CSS Variables for theming
 * Users can override these in their own CSS:
 *
 * :root {
 *   --szui-header-bg: #1e293b;
 *   --szui-header-color: #f1f5f9;
 * }
 */

// Fallback values for CSS Variables
const fallback = {
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: "14px",
  lineHeight: "1.5",
  colorText: "#1f2937",
  colorBg: "#ffffff",
  headerBg: "#f9fafb",
  headerColor: "#6b7280",
  headerFontSize: "12px",
  headerFontWeight: "600",
  borderColor: "#e5e7eb",
  borderWidth: "1px",
  borderRadius: "8px",
  cellPaddingX: "12px",
  cellPaddingY: "10px",
  rowHoverBg: "#f3f4f6",
  rowSelectedBg: "#eff6ff",
};

// Container for the entire DataTable with sidepanels
export const container = style({
  display: "flex",
  fontFamily: `var(--szui-font-family, ${fallback.fontFamily})`,
  fontSize: `var(--szui-font-size, ${fallback.fontSize})`,
  lineHeight: `var(--szui-line-height, ${fallback.lineHeight})`,
  color: `var(--szui-color-text, ${fallback.colorText})`,
  backgroundColor: `var(--szui-color-bg, ${fallback.colorBg})`,
  border: `var(--szui-border-width, ${fallback.borderWidth}) solid var(--szui-border-color, ${fallback.borderColor})`,
  borderRadius: `var(--szui-border-radius, ${fallback.borderRadius})`,
  overflow: "hidden",
});

// Wrapper for the main table
export const tableWrapper = style({
  flex: 1,
  overflow: "auto",
});

export const table = style({
  width: "100%",
  borderCollapse: "collapse",
  borderSpacing: 0,
});

export const thead = style({
  backgroundColor: `var(--szui-header-bg, ${fallback.headerBg})`,
});

export const th = style({
  padding: `var(--szui-cell-padding-y, ${fallback.cellPaddingY}) var(--szui-cell-padding-x, ${fallback.cellPaddingX})`,
  textAlign: "left",
  fontSize: `var(--szui-header-font-size, ${fallback.headerFontSize})`,
  fontWeight: `var(--szui-header-font-weight, ${fallback.headerFontWeight})`,
  color: `var(--szui-header-color, ${fallback.headerColor})`,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: `var(--szui-border-width, ${fallback.borderWidth}) solid var(--szui-border-color, ${fallback.borderColor})`,
});

export const td = style({
  padding: `var(--szui-cell-padding-y, ${fallback.cellPaddingY}) var(--szui-cell-padding-x, ${fallback.cellPaddingX})`,
  borderBottom: `var(--szui-border-width, ${fallback.borderWidth}) solid var(--szui-border-color, ${fallback.borderColor})`,
});

export const tr = style({
  selectors: {
    "&:hover": {
      backgroundColor: `var(--szui-row-hover-bg, ${fallback.rowHoverBg})`,
    },
    "&[data-selected]": {
      backgroundColor: `var(--szui-row-selected-bg, ${fallback.rowSelectedBg})`,
    },
  },
});

export const trLast = style({});

// Remove bottom border from last row
globalStyle(`${tr}:last-child ${td}`, {
  borderBottom: "none",
});
