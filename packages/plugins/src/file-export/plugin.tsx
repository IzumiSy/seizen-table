import { useState, useCallback } from "react";
import { z } from "zod";
import {
  definePlugin,
  usePluginContext,
  usePluginArgs,
} from "@izumisy/seizen-table/plugin";
import { CsvExporter, type Exporter } from "./exporters";

// =============================================================================
// Module Augmentation for Type-Safe Plugin Args & Events
// =============================================================================

declare module "@izumisy/seizen-table/plugin" {
  interface PluginArgsRegistry {
    "file-export": Record<string, never>; // No args needed for open
  }

  interface EventBusRegistry {
    "file-export:start": { format: string; rowCount: number };
    "file-export:complete": { filename: string; format: string };
    "file-export:error": { error: Error };
  }
}

// =============================================================================
// Plugin Definition
// =============================================================================

/**
 * Schema for File Export plugin configuration
 */
const FileExportSchema = z.object({
  /** Width of the side panel */
  width: z.number().default(300),
  /** Default filename (without extension) */
  filename: z.string().default("export"),
  /** Whether to include headers by default */
  includeHeaders: z.boolean().default(true),
  /** Available exporters */
  exporters: z.array(z.custom<Exporter>()).default([CsvExporter]),
});

type FileExportConfig = z.infer<typeof FileExportSchema>;

/**
 * Download a string as a file
 */
function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * FileExportPanel - Main panel component for the plugin
 */
function FileExportPanel() {
  const args = usePluginArgs<FileExportConfig>();
  const { data, columns, table } = usePluginContext();
  const [filename, setFilename] = useState(args.filename);
  const [includeHeaders, setIncludeHeaders] = useState(args.includeHeaders);
  const [selectedExporterId, setSelectedExporterId] = useState(
    args.exporters[0]?.id ?? "csv"
  );
  const [exported, setExported] = useState(false);

  // Filter columns based on visibility
  const columnVisibility = table.getColumnVisibility();
  const visibleColumns = columns.filter(
    (col) => columnVisibility[col.key] !== false
  );

  const selectedExporter =
    args.exporters.find((e) => e.id === selectedExporterId) ??
    args.exporters[0];

  const handleExport = useCallback(() => {
    if (!selectedExporter) return;

    const content = selectedExporter.convert(data, visibleColumns, {
      includeHeaders,
    });
    const fullFilename = `${filename}.${selectedExporter.extension}`;
    downloadFile(content, fullFilename, selectedExporter.mimeType);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }, [data, visibleColumns, filename, includeHeaders, selectedExporter]);

  const previewContent = selectedExporter
    ? selectedExporter.convert(data.slice(0, 3), visibleColumns, {
        includeHeaders,
      })
    : "No exporter selected";

  return (
    <div
      style={{
        width: args.width,
        padding: "16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Stats */}
      <div
        style={{
          padding: "12px",
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
        }}
      >
        <div
          style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}
        >
          Rows to export
        </div>
        <div style={{ fontSize: "24px", fontWeight: 600, color: "#111827" }}>
          {data.length}
        </div>
      </div>

      {/* Format selector */}
      {args.exporters.length > 1 && (
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 500,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Format
          </label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {args.exporters.map((exporter) => (
              <button
                key={exporter.id}
                onClick={() => setSelectedExporterId(exporter.id)}
                style={{
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color:
                    selectedExporterId === exporter.id ? "#fff" : "#374151",
                  backgroundColor:
                    selectedExporterId === exporter.id ? "#3b82f6" : "#f3f4f6",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {exporter.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filename input */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: 500,
            color: "#374151",
            marginBottom: "6px",
          }}
        >
          Filename
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 12px",
              fontSize: "14px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            .{selectedExporter?.extension ?? ""}
          </span>
        </div>
      </div>

      {/* Include headers checkbox (only for formats that support it) */}
      {(selectedExporter?.id === "csv" || selectedExporter?.id === "tsv") && (
        <div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              color: "#374151",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={includeHeaders}
              onChange={(e) => setIncludeHeaders(e.target.checked)}
              style={{ width: "16px", height: "16px" }}
            />
            Include headers
          </label>
        </div>
      )}

      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={data.length === 0 || !selectedExporter}
        style={{
          padding: "10px 16px",
          fontSize: "14px",
          fontWeight: 500,
          color: "#fff",
          backgroundColor: exported
            ? "#10b981"
            : data.length === 0
            ? "#9ca3af"
            : "#3b82f6",
          border: "none",
          borderRadius: "6px",
          cursor: data.length === 0 ? "not-allowed" : "pointer",
          transition: "background-color 0.2s",
        }}
      >
        {exported
          ? "✓ Exported!"
          : `Export ${selectedExporter?.name ?? "File"}`}
      </button>

      {/* Preview */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 500,
            color: "#374151",
            marginBottom: "6px",
          }}
        >
          Preview (first 3 rows)
        </div>
        <div
          style={{
            padding: "8px",
            backgroundColor: "#f9fafb",
            borderRadius: "6px",
            fontSize: "11px",
            fontFamily: "monospace",
            overflow: "auto",
            maxHeight: "200px",
            whiteSpace: "pre",
            color: "#4b5563",
          }}
        >
          {previewContent || "No data"}
        </div>
      </div>
    </div>
  );
}

/**
 * File Export Plugin
 *
 * Provides a UI for exporting table data to various file formats.
 * Supports CSV, JSONL, JSON, TSV out of the box, and custom exporters.
 *
 * @example
 * ```tsx
 * import {
 *   FileExportPlugin,
 *   CsvExporter,
 *   JsonlExporter,
 * } from "@izumisy/seizen-table-plugins/file-export";
 *
 * // Single format (CSV only - default)
 * const table = useSeizenTable({
 *   plugins: [FileExportPlugin],
 * });
 *
 * // Multiple formats
 * const table = useSeizenTable({
 *   plugins: [
 *     FileExportPlugin.configure({
 *       filename: "users",
 *       exporters: [CsvExporter, JsonlExporter],
 *     }),
 *   ],
 * });
 *
 * // Custom exporter
 * const MyExporter: Exporter = {
 *   id: "my-format",
 *   name: "My Format",
 *   extension: "txt",
 *   mimeType: "text/plain",
 *   convert: (data, columns, options) => {
 *     // Custom conversion logic
 *     return data.map(row => Object.values(row).join(" | ")).join("\n");
 *   },
 * };
 * ```
 */
export const FileExportPlugin = definePlugin({
  id: "file-export",
  name: "Export",
  args: FileExportSchema,
  slots: {
    sidePanel: {
      position: "right-sider",
      header: "File Export",
      render: FileExportPanel,
    },
  },
});
