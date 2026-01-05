import { useCallback, useRef } from "react";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

// =============================================================================
// Event Types
// =============================================================================

/**
 * Registry for custom event types.
 *
 * Plugin authors can extend this interface via module augmentation
 * to provide type-safe custom events.
 *
 * @example
 * ```typescript
 * // In your plugin file:
 * declare module "@izumisy/seizen-datatable-react/plugin" {
 *   interface EventBusRegistry {
 *     "my-plugin:action": { itemId: string; action: "create" | "delete" };
 *     "my-plugin:complete": { success: boolean };
 *   }
 * }
 * ```
 */
export interface EventBusRegistry {
  // Empty by default - plugins extend this via module augmentation
}

/**
 * Map of built-in event names to their payload types.
 *
 * DataTable automatically emits these events:
 * - State change events: data, selection, filter, sorting, pagination
 * - Action events: row-click
 *
 * Plugins can extend EventBusRegistry to add custom events.
 *
 * @typeParam TData - The type of row data. Defaults to `unknown`.
 */
export interface DataTableEventMap<TData = unknown> extends EventBusRegistry {
  /**
   * Emitted when table data changes.
   * Payload is the entire data array.
   */
  "data-change": TData[];

  /**
   * Emitted when row selection changes.
   * Payload is the array of selected rows.
   */
  "selection-change": TData[];

  /**
   * Emitted when column filters change.
   */
  "filter-change": ColumnFiltersState;

  /**
   * Emitted when sorting changes.
   */
  "sorting-change": SortingState;

  /**
   * Emitted when pagination changes.
   */
  "pagination-change": PaginationState;

  /**
   * Emitted when a table row is clicked.
   * Payload is the clicked row data.
   */
  "row-click": TData;
}

/**
 * All known event names (built-in events)
 */
export type DataTableEventName = keyof DataTableEventMap;

// =============================================================================
// Event Bus Hook
// =============================================================================

/**
 * Hook to create an event bus for plugin communication.
 *
 * This provides a simple pub/sub mechanism that allows the application
 * to communicate with plugins without tight coupling.
 *
 * @example
 * ```tsx
 * // In useDataTable:
 * const eventBus = useEventBus();
 *
 * // Application emits events:
 * eventBus.emit("row-click", row);
 *
 * // Plugins subscribe via usePluginContext:
 * const { useEvent } = usePluginContext();
 * useEvent("row-click", (row) => {
 *   console.log("Row clicked:", row);
 * });
 * ```
 */
export function useEventBus() {
  const listenersRef = useRef<Map<string, Set<(payload: unknown) => void>>>(
    new Map()
  );

  const emit = useCallback(
    <K extends DataTableEventName | (string & {})>(
      event: K,
      payload: K extends DataTableEventName ? DataTableEventMap[K] : unknown
    ) => {
      const listeners = listenersRef.current.get(event);
      if (listeners) {
        listeners.forEach((callback) => callback(payload));
      }
    },
    []
  );

  const subscribe = useCallback(
    <K extends DataTableEventName | (string & {})>(
      event: K,
      callback: (
        payload: K extends DataTableEventName ? DataTableEventMap[K] : unknown
      ) => void
    ) => {
      if (!listenersRef.current.has(event)) {
        listenersRef.current.set(event, new Set());
      }
      listenersRef.current
        .get(event)!
        .add(callback as (payload: unknown) => void);

      return () => {
        listenersRef.current
          .get(event)
          ?.delete(callback as (payload: unknown) => void);
      };
    },
    []
  );

  return {
    /**
     * Emit an event to all subscribers
     */
    emit,

    /**
     * Subscribe to an event
     * @returns Unsubscribe function
     */
    subscribe,
  };
}

export type EventBus = ReturnType<typeof useEventBus>;
