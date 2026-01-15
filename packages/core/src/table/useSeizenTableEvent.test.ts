import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSeizenTableEvent } from "./useSeizenTableEvent";
import type { SeizenTableInstance } from "./useSeizenTable";
import type { EventBus } from "../plugin/useEventBus";
import type { SortingState, PaginationState } from "@tanstack/react-table";
import {
  createMockEventBus,
  createMockTableInstance,
  type TestRow,
} from "../../tests/utils/mockTable";

// =============================================================================
// useSeizenTableEvent Hook Tests
// =============================================================================

describe("useSeizenTableEvent", () => {
  let mockEventBus: EventBus;
  let mockTable: SeizenTableInstance<TestRow>;

  beforeEach(() => {
    mockEventBus = createMockEventBus();
    mockTable = createMockTableInstance({ eventBus: mockEventBus });
  });

  describe("subscription", () => {
    it("should subscribe to events on mount", () => {
      const callback = vi.fn();

      renderHook(() =>
        useSeizenTableEvent(mockTable, "sorting-change", callback)
      );

      expect(mockEventBus.subscribe).toHaveBeenCalledWith(
        "sorting-change",
        expect.any(Function)
      );
    });

    it("should call callback when event is emitted", async () => {
      const callback = vi.fn();
      const sorting: SortingState = [{ id: "name", desc: false }];

      renderHook(() =>
        useSeizenTableEvent(mockTable, "sorting-change", callback)
      );

      act(() => {
        mockEventBus.emit("sorting-change", sorting);
      });

      await waitFor(() => {
        expect(callback).toHaveBeenCalledWith(sorting);
      });
    });

    it("should call callback for pagination-change event", async () => {
      const callback = vi.fn();
      const pagination: PaginationState = { pageIndex: 2, pageSize: 20 };

      renderHook(() =>
        useSeizenTableEvent(mockTable, "pagination-change", callback)
      );

      act(() => {
        mockEventBus.emit("pagination-change", pagination);
      });

      await waitFor(() => {
        expect(callback).toHaveBeenCalledWith(pagination);
      });
    });

    it("should not call callback for different events", () => {
      const callback = vi.fn();

      renderHook(() =>
        useSeizenTableEvent(mockTable, "sorting-change", callback)
      );

      act(() => {
        mockEventBus.emit("pagination-change", { pageIndex: 0, pageSize: 10 });
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("unsubscription", () => {
    it("should unsubscribe on unmount", () => {
      const callback = vi.fn();

      const { unmount } = renderHook(() =>
        useSeizenTableEvent(mockTable, "sorting-change", callback)
      );

      unmount();

      // After unmount, emitting should not call the callback
      act(() => {
        mockEventBus.emit("sorting-change", [{ id: "name", desc: true }]);
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("callback updates", () => {
    it("should use latest callback without re-subscribing", async () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const { rerender } = renderHook(
        ({ callback }) =>
          useSeizenTableEvent(mockTable, "sorting-change", callback),
        { initialProps: { callback: callback1 } }
      );

      // First emit
      act(() => {
        mockEventBus.emit("sorting-change", [{ id: "name", desc: false }]);
      });

      await waitFor(() => {
        expect(callback1).toHaveBeenCalledTimes(1);
      });

      // Update callback
      rerender({ callback: callback2 });

      // Second emit should use new callback
      act(() => {
        mockEventBus.emit("sorting-change", [{ id: "name", desc: true }]);
      });

      await waitFor(() => {
        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback1).toHaveBeenCalledTimes(1); // Still 1, not called again
      });

      // Should only subscribe once (not re-subscribe on callback change)
      expect(mockEventBus.subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe("multiple subscriptions", () => {
    it("should handle multiple useSeizenTableEvent calls for different events", async () => {
      const sortingCallback = vi.fn();
      const paginationCallback = vi.fn();

      renderHook(() => {
        useSeizenTableEvent(mockTable, "sorting-change", sortingCallback);
        useSeizenTableEvent(mockTable, "pagination-change", paginationCallback);
      });

      act(() => {
        mockEventBus.emit("sorting-change", [{ id: "name", desc: false }]);
        mockEventBus.emit("pagination-change", { pageIndex: 1, pageSize: 20 });
      });

      await waitFor(() => {
        expect(sortingCallback).toHaveBeenCalledWith([
          { id: "name", desc: false },
        ]);
        expect(paginationCallback).toHaveBeenCalledWith({
          pageIndex: 1,
          pageSize: 20,
        });
      });
    });
  });

  describe("event bus stability", () => {
    it("should not re-subscribe when table reference changes but eventBus is same", () => {
      const callback = vi.fn();

      const { rerender } = renderHook(
        ({ table }) => useSeizenTableEvent(table, "sorting-change", callback),
        { initialProps: { table: mockTable } }
      );

      // Create new table with same eventBus
      const newTable = createMockTableInstance({ eventBus: mockEventBus });

      rerender({ table: newTable });

      // Should only have subscribed once since eventBus is the same
      expect(mockEventBus.subscribe).toHaveBeenCalledTimes(1);
    });

    it("should re-subscribe when eventBus changes", () => {
      const callback = vi.fn();
      const newEventBus = createMockEventBus();

      const { rerender } = renderHook(
        ({ table }) => useSeizenTableEvent(table, "sorting-change", callback),
        { initialProps: { table: mockTable } }
      );

      // Create new table with different eventBus
      const newTable = createMockTableInstance({ eventBus: newEventBus });

      rerender({ table: newTable });

      // Should have subscribed to both event buses
      expect(mockEventBus.subscribe).toHaveBeenCalledTimes(1);
      expect(newEventBus.subscribe).toHaveBeenCalledTimes(1);
    });
  });
});
