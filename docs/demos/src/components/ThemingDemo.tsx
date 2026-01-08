import { useState, useEffect } from "react";
import { useDataTable, DataTable } from "@izumisy/seizen-datatable-react";

const themes = {
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
  monokai: {
    "--szui-color-text": "#f8f8f2",
    "--szui-color-bg": "#272822",
    "--szui-header-bg": "#1e1f1c",
    "--szui-header-color": "#a6e22e",
    "--szui-border-color": "#3e3d32",
    "--szui-row-hover-bg": "#3e3d32",
    "--szui-row-selected-bg": "#49483e",
  },
  dracula: {
    "--szui-color-text": "#f8f8f2",
    "--szui-color-bg": "#282a36",
    "--szui-header-bg": "#21222c",
    "--szui-header-color": "#bd93f9",
    "--szui-border-color": "#44475a",
    "--szui-row-hover-bg": "#44475a",
    "--szui-row-selected-bg": "#6272a4",
  },
  nord: {
    "--szui-color-text": "#eceff4",
    "--szui-color-bg": "#2e3440",
    "--szui-header-bg": "#3b4252",
    "--szui-header-color": "#88c0d0",
    "--szui-border-color": "#4c566a",
    "--szui-row-hover-bg": "#3b4252",
    "--szui-row-selected-bg": "#434c5e",
  },
} as const;

type ThemeName = keyof typeof themes;

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
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("light");
  const table = useDataTable({ data, columns });

  useEffect(() => {
    const theme = themes[currentTheme];
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    return () => {
      Object.keys(theme).forEach((key) => {
        document.documentElement.style.removeProperty(key);
      });
    };
  }, [currentTheme]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(Object.keys(themes) as ThemeName[]).map((themeName) => (
          <button
            key={themeName}
            onClick={() => setCurrentTheme(themeName)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border:
                currentTheme === themeName
                  ? "2px solid #6366f1"
                  : "1px solid #d1d5db",
              background: currentTheme === themeName ? "#eef2ff" : "#fff",
              color: currentTheme === themeName ? "#4f46e5" : "#374151",
              fontWeight: currentTheme === themeName ? 600 : 400,
              cursor: "pointer",
              textTransform: "capitalize",
              transition: "all 0.15s ease",
            }}
          >
            {themeName}
          </button>
        ))}
      </div>
      <div
        style={{
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <DataTable table={table} />
      </div>
    </div>
  );
}
