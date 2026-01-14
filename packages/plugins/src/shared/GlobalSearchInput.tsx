import { useState, useCallback, useRef, useEffect } from "react";
import { usePluginContext } from "@izumisy/seizen-table/plugin";

// =============================================================================
// Types
// =============================================================================

export interface GlobalSearchInputProps {
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Input width (CSS value) */
  width?: string | number;
  /** Visual variant */
  variant?: "default" | "compact";
}

// =============================================================================
// Global Search Input Component
// =============================================================================

/**
 * A reusable global search input component for filtering table data.
 * Uses debounced input to avoid excessive re-renders.
 */
export function GlobalSearchInput({
  placeholder = "Search...",
  debounceMs = 300,
  width = 200,
  variant = "compact",
}: GlobalSearchInputProps) {
  const { table } = usePluginContext();
  const [searchValue, setSearchValue] = useState(
    () => table.getGlobalFilter() ?? ""
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);

      // Debounce the global filter update
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        table.setGlobalFilter(value);
      }, debounceMs);
    },
    [table, debounceMs]
  );

  const handleClear = useCallback(() => {
    setSearchValue("");
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    table.setGlobalFilter("");
  }, [table]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const isCompact = variant === "compact";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        position: "relative",
      }}
    >
      {/* Search icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9ca3af"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: "absolute",
          left: "10px",
          pointerEvents: "none",
        }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>

      {/* Search input */}
      <input
        type="text"
        value={searchValue}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          padding: isCompact ? "6px 32px" : "6px 32px 6px 32px",
          fontSize: isCompact ? "13px" : "14px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          outline: "none",
          backgroundColor: "#fff",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#3b82f6";
          e.currentTarget.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.1)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#d1d5db";
          e.currentTarget.style.boxShadow = "none";
        }}
      />

      {/* Clear button - only show when there's a value */}
      {searchValue && (
        <button
          onClick={handleClear}
          style={{
            position: "absolute",
            right: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "18px",
            height: "18px",
            padding: 0,
            fontSize: "14px",
            color: "#9ca3af",
            backgroundColor: "transparent",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#f3f4f6";
            e.currentTarget.style.color = "#6b7280";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#9ca3af";
          }}
          title="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
