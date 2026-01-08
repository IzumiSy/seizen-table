import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  height: "100vh",
});

export const sidebar = style({
  width: "260px",
  borderRight: "1px solid #e0e0e0",
  padding: "1rem",
  overflowY: "auto",
  flexShrink: 0,
  backgroundColor: "#fafafa",
});

export const sidebarTitle = style({
  margin: "0 0 1.5rem 0",
  fontSize: "1.1rem",
  fontWeight: 600,
  color: "#333",
});

export const nav = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});

export const navLink = style({
  display: "block",
  padding: "0.6rem 0.75rem",
  borderRadius: "6px",
  textDecoration: "none",
  color: "#555",
  fontSize: "0.9rem",
  transition: "background-color 0.15s, color 0.15s",
  selectors: {
    "&:hover": {
      backgroundColor: "#e8e8e8",
    },
    "&.active": {
      backgroundColor: "#007acc",
      color: "#fff",
    },
  },
});

export const main = style({
  flex: 1,
  overflow: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "2rem",
});

export const demoContent = style({
  width: "100%",
  maxWidth: "1200px",
});
