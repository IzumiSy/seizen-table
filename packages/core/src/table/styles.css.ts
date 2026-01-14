import { style, globalStyle, keyframes } from "@vanilla-extract/css";

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

// Container for the entire SeizenTable with side panels
export const container = style({
  display: "flex",
  flexDirection: "row",
  fontFamily: `var(--szui-font-family, ${fallback.fontFamily})`,
  fontSize: `var(--szui-font-size, ${fallback.fontSize})`,
  lineHeight: `var(--szui-line-height, ${fallback.lineHeight})`,
  color: `var(--szui-color-text, ${fallback.colorText})`,
  backgroundColor: `var(--szui-color-bg, ${fallback.colorBg})`,
  border: `var(--szui-border-width, ${fallback.borderWidth}) solid var(--szui-border-color, ${fallback.borderColor})`,
  borderRadius: `var(--szui-border-radius, ${fallback.borderRadius})`,
  overflow: "hidden",
});

// Main content wrapper (contains table and pagination, excludes side panels)
export const mainContent = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

// Wrapper for the main table
export const tableWrapper = style({
  position: "relative",
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

// =============================================================================
// Paginator Styles
// =============================================================================

export const paginator = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  borderTop: `var(--szui-border-width, ${fallback.borderWidth}) solid var(--szui-border-color, ${fallback.borderColor})`,
  backgroundColor: `var(--szui-header-bg, ${fallback.headerBg})`,
  gap: "16px",
  flexWrap: "wrap",
  fontSize: "13px",
});

export const paginatorLeft = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flex: "0 0 auto",
});

export const paginatorCenter = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "1 1 auto",
  minWidth: "120px",
});

export const paginatorRight = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flex: "0 0 auto",
});

export const paginatorPageSize = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const paginatorLabel = style({
  color: `var(--szui-header-color, ${fallback.headerColor})`,
  fontSize: "13px",
  fontWeight: "500",
  whiteSpace: "nowrap",
});

export const paginatorSelect = style({
  padding: "4px 8px",
  fontSize: "13px",
  border: `1px solid var(--szui-border-color, ${fallback.borderColor})`,
  borderRadius: "4px",
  backgroundColor: `var(--szui-color-bg, ${fallback.colorBg})`,
  color: `var(--szui-color-text, ${fallback.colorText})`,
  cursor: "pointer",
  outline: "none",
  selectors: {
    "&:hover": {
      borderColor: "#9ca3af",
    },
    "&:focus": {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
  },
});

export const paginatorInfo = style({
  color: `var(--szui-header-color, ${fallback.headerColor})`,
  fontSize: "13px",
  fontWeight: "500",
  whiteSpace: "nowrap",
});

export const paginatorButtons = style({
  display: "flex",
  alignItems: "center",
  gap: "4px",
});

export const paginatorButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  padding: "0",
  border: `1px solid var(--szui-border-color, ${fallback.borderColor})`,
  borderRadius: "4px",
  backgroundColor: `var(--szui-color-bg, ${fallback.colorBg})`,
  color: `var(--szui-color-text, ${fallback.colorText})`,
  cursor: "pointer",
  outline: "none",
  transition: "all 0.15s ease",
  selectors: {
    "&:hover:not(:disabled)": {
      backgroundColor: `var(--szui-row-hover-bg, ${fallback.rowHoverBg})`,
      borderColor: "#9ca3af",
    },
    "&:active:not(:disabled)": {
      transform: "scale(0.95)",
    },
    "&:disabled": {
      opacity: 0.4,
      cursor: "not-allowed",
    },
    "&:focus-visible": {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
  },
});

export const paginatorPageNumber = style({
  color: `var(--szui-header-color, ${fallback.headerColor})`,
  fontSize: "13px",
  fontWeight: "500",
  whiteSpace: "nowrap",
  padding: "0 8px",
});
// =============================================================================
// Loading Overlay Styles
// =============================================================================

export const loadingOverlay = style({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: `var(--szui-loading-overlay-bg, rgba(255, 255, 255, 0.8))`,
  zIndex: 10,
  backdropFilter: "blur(1px)",
});

const spinAnimation = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

export const spinner = style({
  width: `var(--szui-spinner-size, 32px)`,
  height: `var(--szui-spinner-size, 32px)`,
  color: `var(--szui-spinner-color, #3b82f6)`,
});

// Global styles for spinner SVG animation
globalStyle(`${spinner} svg`, {
  animation: `${spinAnimation} 1s linear infinite`,
});
