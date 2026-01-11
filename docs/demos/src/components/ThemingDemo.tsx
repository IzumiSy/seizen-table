import { useState, useEffect } from "react";
import { useDataTable, DataTable } from "@izumisy/seizen-datatable-react";

const colorThemes = {
  custom: {
    "--szui-color-text": "#eceff4",
    "--szui-color-bg": "#2e3440",
    "--szui-header-bg": "#3b4252",
    "--szui-header-color": "#88c0d0",
    "--szui-border-color": "#4c566a",
    "--szui-row-hover-bg": "#3b4252",
    "--szui-row-selected-bg": "#434c5e",
  },
  light: {
    "--szui-color-text": "#1f2937",
    "--szui-color-bg": "#ffffff",
    "--szui-header-bg": "#f9fafb",
    "--szui-header-color": "#6b7280",
    "--szui-border-color": "#e5e7eb",
    "--szui-row-hover-bg": "#f3f4f6",
    "--szui-row-selected-bg": "#eff6ff",
  },
  dark: {
    "--szui-color-text": "#f9fafb",
    "--szui-color-bg": "#111827",
    "--szui-header-bg": "#1f2937",
    "--szui-header-color": "#9ca3af",
    "--szui-border-color": "#374151",
    "--szui-row-hover-bg": "#1f2937",
    "--szui-row-selected-bg": "#1e3a5f",
  },
} as const;

const spacingThemes = {
  compact: {
    "--szui-cell-padding-x": "0.5rem",
    "--szui-cell-padding-y": "0.375rem",
    "--szui-table-gap": "0",
  },
  default: {
    "--szui-cell-padding-x": "12px",
    "--szui-cell-padding-y": "10px",
    "--szui-table-gap": "0",
  },
  comfortable: {
    "--szui-cell-padding-x": "1.5rem",
    "--szui-cell-padding-y": "1rem",
    "--szui-table-gap": "0.25rem",
  },
} as const;

type ColorThemeName = keyof typeof colorThemes;
type SpacingThemeName = keyof typeof spacingThemes;

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "status", header: "Status" },
];

const data = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    department: "Engineering",
    status: "active",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    department: "Design",
    status: "active",
  },
  {
    id: 3,
    name: "Carol Williams",
    email: "carol@example.com",
    department: "Marketing",
    status: "inactive",
  },
  {
    id: 4,
    name: "David Brown",
    email: "david@example.com",
    department: "Sales",
    status: "active",
  },
];

export function ThemingDemo() {
  const [colorTheme, setColorTheme] = useState<ColorThemeName>("custom");
  const [spacingTheme, setSpacingTheme] = useState<SpacingThemeName>("compact");
  const table = useDataTable({ data, columns });

  useEffect(() => {
    const theme = {
      ...colorThemes[colorTheme],
      ...spacingThemes[spacingTheme],
    };
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    return () => {
      Object.keys(theme).forEach((key) => {
        document.documentElement.style.removeProperty(key);
      });
    };
  }, [colorTheme, spacingTheme]);

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          minWidth: "200px",
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#6b7280",
            }}
          >
            Color Theme
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {(Object.keys(colorThemes) as ColorThemeName[]).map((themeName) => (
              <button
                key={themeName}
                onClick={() => setColorTheme(themeName)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border:
                    colorTheme === themeName
                      ? "2px solid #6366f1"
                      : "1px solid #d1d5db",
                  background: colorTheme === themeName ? "#eef2ff" : "#fff",
                  color: colorTheme === themeName ? "#4f46e5" : "#374151",
                  fontWeight: colorTheme === themeName ? 600 : 400,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.15s ease",
                }}
              >
                {themeName}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#6b7280",
            }}
          >
            Spacing Theme
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {(Object.keys(spacingThemes) as SpacingThemeName[]).map(
              (themeName) => (
                <button
                  key={themeName}
                  onClick={() => setSpacingTheme(themeName)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border:
                      spacingTheme === themeName
                        ? "2px solid #6366f1"
                        : "1px solid #d1d5db",
                    background: spacingTheme === themeName ? "#eef2ff" : "#fff",
                    color: spacingTheme === themeName ? "#4f46e5" : "#374151",
                    fontWeight: spacingTheme === themeName ? 600 : 400,
                    cursor: "pointer",
                    textTransform: "capitalize",
                    transition: "all 0.15s ease",
                  }}
                >
                  {themeName}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <DataTable table={table} />
      </div>
    </div>
  );
}
