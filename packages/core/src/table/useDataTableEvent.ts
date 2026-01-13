import { useEffect, useRef } from "react";
import type { DataTableInstance } from "./useDataTable";
import type {
  DataTableEventMap,
  DataTableEventName,
} from "../plugin/useEventBus";

/**
 * Resolves the payload type for an event.
 * - For known events: Uses DataTableEventMap<TData>
 * - For custom events: Falls back to unknown
 */
type ResolveEventPayload<TData, K> = K extends keyof DataTableEventMap<TData>
  ? DataTableEventMap<TData>[K]
  : unknown;

/**
 * Hook to subscribe to DataTable events from application code.
 *
 * This hook allows application code to subscribe to events emitted by
 * the DataTable without needing to be inside a plugin context.
 *
 * @param table - The DataTable instance from useDataTable
 * @param event - The event name to subscribe to
 * @param callback - The callback function to invoke when the event is emitted
 *
 * @example
 * ```tsx
 * function App() {
 *   const table = useDataTable({ data, columns });
 *
 *   // Subscribe to row-click events
 *   useDataTableEvent(table, "row-click", (row) => {
 *     console.log("Row clicked:", row);
 *   });
 *
 *   // Subscribe to selection changes
 *   useDataTableEvent(table, "selection-change", (selectedRows) => {
 *     console.log("Selection changed:", selectedRows);
 *   });
 *
 *   return <DataTable table={table} />;
 * }
 * ```
 */
export function useDataTableEvent<
  TData,
  K extends DataTableEventName | (string & {})
>(
  table: DataTableInstance<TData>,
  event: K,
  callback: (payload: ResolveEventPayload<TData, K>) => void
): void {
  // Use ref to avoid re-subscribing on every callback change
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handler = (payload: unknown) => {
      callbackRef.current(payload as ResolveEventPayload<TData, K>);
    };

    return table.eventBus.subscribe(
      event,
      handler as (payload: unknown) => void
    );
  }, [table.eventBus, event]);
}
