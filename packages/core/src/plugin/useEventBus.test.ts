import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEventBus } from "./useEventBus";

// =============================================================================
// useEventBus Hook Tests
// =============================================================================

describe("useEventBus", () => {
  describe("emit and subscribe", () => {
    it("should call subscriber when event is emitted", () => {
      const { result } = renderHook(() => useEventBus());
      const callback = vi.fn();

      result.current.subscribe("row-click", callback);

      act(() => {
        result.current.emit("row-click", { id: 1, name: "Test" });
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({ id: 1, name: "Test" });
    });

    it("should call multiple subscribers for the same event", () => {
      const { result } = renderHook(() => useEventBus());
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      result.current.subscribe("row-click", callback1);
      result.current.subscribe("row-click", callback2);

      act(() => {
        result.current.emit("row-click", { id: 1 });
      });

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it("should not call subscriber for different events", () => {
      const { result } = renderHook(() => useEventBus());
      const callback = vi.fn();

      result.current.subscribe("row-click", callback);

      act(() => {
        result.current.emit("selection-change", []);
      });

      expect(callback).not.toHaveBeenCalled();
    });

    it("should handle multiple different events", () => {
      const { result } = renderHook(() => useEventBus());
      const rowClickCallback = vi.fn();
      const selectionCallback = vi.fn();

      result.current.subscribe("row-click", rowClickCallback);
      result.current.subscribe("selection-change", selectionCallback);

      act(() => {
        result.current.emit("row-click", { id: 1 });
        result.current.emit("selection-change", [{ id: 1 }, { id: 2 }]);
      });

      expect(rowClickCallback).toHaveBeenCalledWith({ id: 1 });
      expect(selectionCallback).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
    });
  });

  describe("unsubscribe", () => {
    it("should unsubscribe when calling returned function", () => {
      const { result } = renderHook(() => useEventBus());
      const callback = vi.fn();

      const unsubscribe = result.current.subscribe("row-click", callback);

      act(() => {
        result.current.emit("row-click", { id: 1 });
      });
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();

      act(() => {
        result.current.emit("row-click", { id: 2 });
      });
      expect(callback).toHaveBeenCalledTimes(1); // Still 1, not called again
    });

    it("should only unsubscribe the specific callback", () => {
      const { result } = renderHook(() => useEventBus());
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const unsubscribe1 = result.current.subscribe("row-click", callback1);
      result.current.subscribe("row-click", callback2);

      unsubscribe1();

      act(() => {
        result.current.emit("row-click", { id: 1 });
      });

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple unsubscribes safely", () => {
      const { result } = renderHook(() => useEventBus());
      const callback = vi.fn();

      const unsubscribe = result.current.subscribe("row-click", callback);

      // Multiple unsubscribes should not throw
      unsubscribe();
      unsubscribe();
      unsubscribe();

      act(() => {
        result.current.emit("row-click", { id: 1 });
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("emit without subscribers", () => {
    it("should not throw when emitting event with no subscribers", () => {
      const { result } = renderHook(() => useEventBus());

      expect(() => {
        act(() => {
          result.current.emit("row-click", { id: 1 });
        });
      }).not.toThrow();
    });

    it("should not throw when emitting after all subscribers unsubscribed", () => {
      const { result } = renderHook(() => useEventBus());
      const callback = vi.fn();

      const unsubscribe = result.current.subscribe("row-click", callback);
      unsubscribe();

      expect(() => {
        act(() => {
          result.current.emit("row-click", { id: 1 });
        });
      }).not.toThrow();
    });
  });

  describe("custom events", () => {
    it("should handle custom event names", () => {
      const { result } = renderHook(() => useEventBus());
      const callback = vi.fn();

      result.current.subscribe("my-custom-event", callback);

      act(() => {
        result.current.emit("my-custom-event", { custom: "data" });
      });

      expect(callback).toHaveBeenCalledWith({ custom: "data" });
    });
  });

  describe("built-in events", () => {
    it("should handle data-change event", () => {
      const { result } = renderHook(() => useEventBus());
      const callback = vi.fn();

      result.current.subscribe("data-change", callback);

      const data = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];
      act(() => {
        result.current.emit("data-change", data);
      });

      expect(callback).toHaveBeenCalledWith(data);
    });

    it("should handle selection-change event", () => {
      const { result } = renderHook(() => useEventBus());
      const callback = vi.fn();

      result.current.subscribe("selection-change", callback);

      const selectedRows = [{ id: 1, name: "Alice" }];
      act(() => {
        result.current.emit("selection-change", selectedRows);
      });

      expect(callback).toHaveBeenCalledWith(selectedRows);
    });

    it("should handle filter-change event", () => {
      const { result } = renderHook(() => useEventBus());
      const callback = vi.fn();

      result.current.subscribe("filter-change", callback);

      const filters = [{ id: "name", value: "Alice" }];
      act(() => {
        result.current.emit("filter-change", filters);
      });

      expect(callback).toHaveBeenCalledWith(filters);
    });

    it("should handle sorting-change event", () => {
      const { result } = renderHook(() => useEventBus());
      const callback = vi.fn();

      result.current.subscribe("sorting-change", callback);

      const sorting = [{ id: "name", desc: false }];
      act(() => {
        result.current.emit("sorting-change", sorting);
      });

      expect(callback).toHaveBeenCalledWith(sorting);
    });

    it("should handle pagination-change event", () => {
      const { result } = renderHook(() => useEventBus());
      const callback = vi.fn();

      result.current.subscribe("pagination-change", callback);

      const pagination = { pageIndex: 2, pageSize: 20 };
      act(() => {
        result.current.emit("pagination-change", pagination);
      });

      expect(callback).toHaveBeenCalledWith(pagination);
    });
  });

  describe("stability", () => {
    it("emit and subscribe functions should be stable across renders", () => {
      const { result, rerender } = renderHook(() => useEventBus());

      const emit1 = result.current.emit;
      const subscribe1 = result.current.subscribe;

      rerender();

      expect(result.current.emit).toBe(emit1);
      expect(result.current.subscribe).toBe(subscribe1);
    });

    it("should maintain subscribers across re-renders", () => {
      const { result, rerender } = renderHook(() => useEventBus());
      const callback = vi.fn();

      result.current.subscribe("row-click", callback);

      rerender();
      rerender();

      act(() => {
        result.current.emit("row-click", { id: 1 });
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("should handle undefined payload", () => {
      const { result } = renderHook(() => useEventBus());
      const callback = vi.fn();

      result.current.subscribe("row-click", callback);

      act(() => {
        result.current.emit("row-click", undefined as never);
      });

      expect(callback).toHaveBeenCalledWith(undefined);
    });

    it("should handle null payload", () => {
      const { result } = renderHook(() => useEventBus());
      const callback = vi.fn();

      result.current.subscribe("row-click", callback);

      act(() => {
        result.current.emit("row-click", null as never);
      });

      expect(callback).toHaveBeenCalledWith(null);
    });

    it("should handle empty string event name", () => {
      const { result } = renderHook(() => useEventBus());
      const callback = vi.fn();

      result.current.subscribe("", callback);

      act(() => {
        result.current.emit("", "payload");
      });

      expect(callback).toHaveBeenCalledWith("payload");
    });
  });
});
