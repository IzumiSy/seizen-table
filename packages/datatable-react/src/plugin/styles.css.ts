import { style } from "@vanilla-extract/css";

/**
 * CSS Variables for theming (sidepanel-related)
 * Users can override these in their own CSS:
 *
 * :root {
 *   --szui-sidepanel-bg: #f9fafb;
 *   --szui-sidepanel-width: 40px;
 * }
 */

// Fallback values for CSS Variables
const fallback = {
  fontSize: "14px",
  colorText: "#1f2937",
  headerBg: "#f9fafb",
  headerColor: "#6b7280",
  headerFontSize: "12px",
  headerFontWeight: "600",
  borderColor: "#e5e7eb",
  borderWidth: "1px",
  cellPaddingX: "12px",
  cellPaddingY: "10px",
  sidepanelBg: "#f9fafb",
  sidepanelWidth: "35px",
  sidepanelTabBg: "transparent",
  sidepanelTabHoverBg: "#e5e7eb",
  sidepanelTabActiveBg: "#ffffff",
};

// SidePanel container
export const sidepanel = style({
  display: "flex",
  selectors: {
    '&[data-position="left"]': {
      flexDirection: "row",
    },
    '&[data-position="right"]': {
      flexDirection: "row-reverse",
    },
  },
});

// Vertical tabs container
export const sidepanelTabs = style({
  display: "flex",
  flexDirection: "column",
  width: `var(--szui-sidepanel-width, ${fallback.sidepanelWidth})`,
  flexShrink: 0,
  backgroundColor: `var(--szui-sidepanel-bg, ${fallback.sidepanelBg})`,
  borderLeft: `var(--szui-border-width, ${fallback.borderWidth}) solid var(--szui-border-color, ${fallback.borderColor})`,
});

// Content area (header + body)
export const sidepanelContent = style({
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  borderLeft: `var(--szui-border-width, ${fallback.borderWidth}) solid var(--szui-border-color, ${fallback.borderColor})`,
});

// Header bar with title and close button
export const sidepanelHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: `var(--szui-cell-padding-y, ${fallback.cellPaddingY}) var(--szui-cell-padding-x, ${fallback.cellPaddingX})`,
  borderBottom: `var(--szui-border-width, ${fallback.borderWidth}) solid var(--szui-border-color, ${fallback.borderColor})`,
  backgroundColor: `var(--szui-header-bg, ${fallback.headerBg})`,
  flexShrink: 0,
});

// Wrapper for header content (title or custom ReactNode)
export const sidepanelHeaderContent = style({
  flex: 1,
  minWidth: 0,
  writingMode: "horizontal-tb",
});

// Default title style when header is a string
export const sidepanelHeaderTitle = style({
  margin: 0,
  fontSize: `var(--szui-font-size, ${fallback.fontSize})`,
  fontWeight: "600",
  color: `var(--szui-color-text, ${fallback.colorText})`,
});

// Close button
export const sidepanelCloseButton = style({
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "18px",
  color: `var(--szui-header-color, ${fallback.headerColor})`,
  padding: "4px",
  lineHeight: 1,
  selectors: {
    "&:hover": {
      color: `var(--szui-color-text, ${fallback.colorText})`,
    },
  },
});

// Scrollable body area
export const sidepanelBody = style({
  flex: 1,
  overflow: "auto",
});

// Individual tab button
export const sidepanelTab = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 8px",
  cursor: "pointer",
  border: "none",
  backgroundColor: `var(--szui-sidepanel-tab-bg, ${fallback.sidepanelTabBg})`,
  borderBottom: `var(--szui-border-width, ${fallback.borderWidth}) solid var(--szui-border-color, ${fallback.borderColor})`,
  selectors: {
    "&:hover": {
      backgroundColor: `var(--szui-sidepanel-tab-hover-bg, ${fallback.sidepanelTabHoverBg})`,
    },
    "&[data-active]": {
      backgroundColor: `var(--szui-sidepanel-tab-active-bg, ${fallback.sidepanelTabActiveBg})`,
    },
  },
});

// Vertical tab label text
export const sidepanelTabLabel = style({
  writingMode: "vertical-lr",
  textOrientation: "mixed",
  fontSize: `var(--szui-header-font-size, ${fallback.headerFontSize})`,
  fontWeight: `var(--szui-header-font-weight, ${fallback.headerFontWeight})`,
  color: `var(--szui-header-color, ${fallback.headerColor})`,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  whiteSpace: "nowrap",
});

// =============================================================================
// Header Slot Styles
// =============================================================================

export const headerSlot = style({
  borderBottom: `var(--szui-border-width, ${fallback.borderWidth}) solid var(--szui-border-color, ${fallback.borderColor})`,
});

// =============================================================================
// Footer Slot Styles
// =============================================================================

export const footerSlot = style({
  borderTop: `var(--szui-border-width, ${fallback.borderWidth}) solid var(--szui-border-color, ${fallback.borderColor})`,
});

// =============================================================================
// Inline Row Slot Styles
// =============================================================================

export const inlineRow = style({
  backgroundColor: `var(--szui-sidepanel-bg, ${fallback.sidepanelBg})`,
});

export const inlineRowCell = style({
  padding: `var(--szui-cell-padding-y, ${fallback.cellPaddingY}) var(--szui-cell-padding-x, ${fallback.cellPaddingX})`,
  borderBottom: `var(--szui-border-width, ${fallback.borderWidth}) solid var(--szui-border-color, ${fallback.borderColor})`,
});

// =============================================================================
// Context Menu Styles
// =============================================================================

export const contextMenuOverlay = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
});

export const contextMenu = style({
  position: "fixed",
  zIndex: 1001,
  minWidth: "180px",
  maxWidth: "280px",
  backgroundColor: "#ffffff",
  border: `var(--szui-border-width, ${fallback.borderWidth}) solid var(--szui-border-color, ${fallback.borderColor})`,
  borderRadius: "6px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  padding: "4px 0",
  overflow: "hidden",
});

export const contextMenuSection = style({
  borderTop: `var(--szui-border-width, ${fallback.borderWidth}) solid var(--szui-border-color, ${fallback.borderColor})`,
  marginTop: "4px",
  paddingTop: "4px",
  selectors: {
    "&:first-child": {
      borderTop: "none",
      marginTop: 0,
      paddingTop: 0,
    },
  },
});

export const contextMenuSectionLabel = style({
  fontSize: "11px",
  fontWeight: "600",
  color: `var(--szui-header-color, ${fallback.headerColor})`,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  padding: "4px 12px 6px",
  margin: 0,
});

export const contextMenuItem = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  padding: "8px 12px",
  fontSize: `var(--szui-font-size, ${fallback.fontSize})`,
  color: `var(--szui-color-text, ${fallback.colorText})`,
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
  selectors: {
    "&:hover": {
      backgroundColor: `var(--szui-sidepanel-tab-hover-bg, ${fallback.sidepanelTabHoverBg})`,
    },
    "&[data-disabled]": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    "&[data-disabled]:hover": {
      backgroundColor: "transparent",
    },
  },
});

export const contextMenuItemIcon = style({
  flexShrink: 0,
  width: "16px",
  height: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const contextMenuItemLabel = style({
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
