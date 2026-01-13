// =============================================================================
// Exporter Interface
// =============================================================================

/**
 * Column definition for export
 */
export interface ExportColumn {
  key: string;
  header: string;
}

/**
 * Exporter interface for converting data to different formats
 */
export interface Exporter {
  /** Unique identifier for the exporter */
  id: string;
  /** Display name for the exporter */
  name: string;
  /** File extension (e.g., "csv", "jsonl") */
  extension: string;
  /** MIME type for the file */
  mimeType: string;
  /** Convert data to string */
  convert: (
    data: unknown[],
    columns: ExportColumn[],
    options: ExportOptions
  ) => string;
}

/**
 * Export options passed to the exporter
 */
export interface ExportOptions {
  /** Whether to include headers (for formats that support it) */
  includeHeaders: boolean;
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Format a value for export
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/**
 * Escape a value for CSV (handle commas, quotes, newlines)
 */
function escapeCSVValue(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// =============================================================================
// Built-in Exporters
// =============================================================================

/**
 * CSV Exporter
 */
export const CsvExporter: Exporter = {
  id: "csv",
  name: "CSV",
  extension: "csv",
  mimeType: "text/csv;charset=utf-8;",
  convert: (data, columns, options) => {
    const lines: string[] = [];

    // Add header row
    if (options.includeHeaders) {
      const headerRow = columns.map((col) => escapeCSVValue(col.header));
      lines.push(headerRow.join(","));
    }

    // Add data rows
    for (const row of data) {
      const rowData = row as Record<string, unknown>;
      const values = columns.map((col) => {
        const value = rowData[col.key];
        return escapeCSVValue(formatValue(value));
      });
      lines.push(values.join(","));
    }

    return lines.join("\n");
  },
};

/**
 * JSONL (JSON Lines) Exporter
 */
export const JsonlExporter: Exporter = {
  id: "jsonl",
  name: "JSONL",
  extension: "jsonl",
  mimeType: "application/jsonl;charset=utf-8;",
  convert: (data, columns) => {
    const lines: string[] = [];

    for (const row of data) {
      const rowData = row as Record<string, unknown>;
      const obj: Record<string, unknown> = {};
      for (const col of columns) {
        obj[col.key] = rowData[col.key];
      }
      lines.push(JSON.stringify(obj));
    }

    return lines.join("\n");
  },
};

/**
 * TSV (Tab-Separated Values) Exporter
 */
export const TsvExporter: Exporter = {
  id: "tsv",
  name: "TSV",
  extension: "tsv",
  mimeType: "text/tab-separated-values;charset=utf-8;",
  convert: (data, columns, options) => {
    const lines: string[] = [];

    // Add header row
    if (options.includeHeaders) {
      const headerRow = columns.map((col) => col.header);
      lines.push(headerRow.join("\t"));
    }

    // Add data rows
    for (const row of data) {
      const rowData = row as Record<string, unknown>;
      const values = columns.map((col) => {
        const value = rowData[col.key];
        // Replace tabs and newlines in values
        return formatValue(value).replace(/[\t\n]/g, " ");
      });
      lines.push(values.join("\t"));
    }

    return lines.join("\n");
  },
};
