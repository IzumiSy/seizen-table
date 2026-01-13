import { useEffect, useRef } from "react";
import type { SeizenTableInstance } from "./useSeizenTable";
import type {
  SeizenTableEventMap,
  SeizenTableEventName,
} from "../plugin/useEventBus";

/**
 * Resolves the payload type for an event.
 * - For known events: Uses SeizenTableEventMap<TData>
 * - For custom events: Falls back to unknown
 */
type ResolveEventPayload<TData, K> = K extends keyof SeizenTableEventMap<TData>
  ? SeizenTableEventMap<TData>[K]
  : unknown;

/**
 * Hook to subscribe to SeizenTable events from application code.
 *
 * This hook allows application code to subscribe to events emitted by
 * the SeizenTable without needing to be inside a plugin context.
 *
 * @param table - The SeizenTable instance from useSeizenTable
 * @param event - The event name to subscribe to
 * @param callback - The callback function to invoke when the event is emitted
 *
 * @example
 * ```tsx
 * function App() {
 *   const table = useSeizenTable({ data, columns });
 *
 *   // Subscribe to row-click events
 *   useSeizenTableEvent(table, "row-click", (row) => {
 *     console.log("Row clicked:", row);
 *   });
 *
 *   // Subscribe to selection changes
 *   useSeizenTableEvent(table, "selection-change", (selectedRows) => {
 *     console.log("Selection changed:", selectedRows);
 *   });
 *
 *   return <SeizenTable table={table} />;
 * }
 * ```
 */
export function useSeizenTableEvent<
  TData,
  K extends SeizenTableEventName | (string & {})
>(
  table: SeizenTableInstance<TData>,
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
