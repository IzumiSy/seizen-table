import { style, globalStyle } from "@vanilla-extract/css";

/**
 * CSS Variables for theming
 * Users can override these in their own CSS:
 *
 * :root {
 *   --sdt-header-bg: #1e293b;
 *   --sdt-header-color: #f1f5f9;
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

export const table = style({
  width: "100%",
  borderCollapse: "collapse",
  borderSpacing: 0,
  fontFamily: `var(--sdt-font-family, ${fallback.fontFamily})`,
  fontSize: `var(--sdt-font-size, ${fallback.fontSize})`,
  lineHeight: `var(--sdt-line-height, ${fallback.lineHeight})`,
  color: `var(--sdt-color-text, ${fallback.colorText})`,
  backgroundColor: `var(--sdt-color-bg, ${fallback.colorBg})`,
  border: `var(--sdt-border-width, ${fallback.borderWidth}) solid var(--sdt-border-color, ${fallback.borderColor})`,
  borderRadius: `var(--sdt-border-radius, ${fallback.borderRadius})`,
  overflow: "hidden",
});

export const thead = style({
  backgroundColor: `var(--sdt-header-bg, ${fallback.headerBg})`,
});

export const th = style({
  padding: `var(--sdt-cell-padding-y, ${fallback.cellPaddingY}) var(--sdt-cell-padding-x, ${fallback.cellPaddingX})`,
  textAlign: "left",
  fontSize: `var(--sdt-header-font-size, ${fallback.headerFontSize})`,
  fontWeight: `var(--sdt-header-font-weight, ${fallback.headerFontWeight})`,
  color: `var(--sdt-header-color, ${fallback.headerColor})`,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: `var(--sdt-border-width, ${fallback.borderWidth}) solid var(--sdt-border-color, ${fallback.borderColor})`,
});

export const td = style({
  padding: `var(--sdt-cell-padding-y, ${fallback.cellPaddingY}) var(--sdt-cell-padding-x, ${fallback.cellPaddingX})`,
  borderBottom: `var(--sdt-border-width, ${fallback.borderWidth}) solid var(--sdt-border-color, ${fallback.borderColor})`,
});

export const tr = style({
  selectors: {
    "&:hover": {
      backgroundColor: `var(--sdt-row-hover-bg, ${fallback.rowHoverBg})`,
    },
    '&[data-selected="true"]': {
      backgroundColor: `var(--sdt-row-selected-bg, ${fallback.rowSelectedBg})`,
    },
  },
});

export const trLast = style({});

// Remove bottom border from last row
globalStyle(`${tr}:last-child ${td}`, {
  borderBottom: "none",
});
