import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePluginControl } from "./usePluginControl";

// =============================================================================
// usePluginControl Hook Tests
// =============================================================================

describe("usePluginControl", () => {
  describe("initial state", () => {
    it("should have no active plugin initially", () => {
      const { result } = renderHook(() => usePluginControl());

      expect(result.current.getActiveId()).toBeNull();
      expect(result.current._state.id).toBeNull();
      expect(result.current._state.args).toBeUndefined();
    });

    it("should return false for isOpen on any plugin", () => {
      const { result } = renderHook(() => usePluginControl());

      expect(result.current.isOpen("any-plugin")).toBe(false);
      expect(result.current.isOpen("filter")).toBe(false);
      expect(result.current.isOpen("row-detail")).toBe(false);
    });
  });

  describe("open", () => {
    it("should open a plugin with args", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("row-detail" as never, { rowId: 123 } as never);
      });

      expect(result.current.getActiveId()).toBe("row-detail");
      expect(result.current.isOpen("row-detail")).toBe(true);
      expect(result.current._state.id).toBe("row-detail");
      expect(result.current._state.args).toEqual({ rowId: 123 });
    });

    it("should open a plugin without args", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("filter" as never, undefined as never);
      });

      expect(result.current.getActiveId()).toBe("filter");
      expect(result.current.isOpen("filter")).toBe(true);
      expect(result.current._state.args).toBeUndefined();
    });

    it("should replace current plugin when opening another", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("filter" as never, { type: "string" } as never);
      });

      expect(result.current.isOpen("filter")).toBe(true);

      act(() => {
        result.current.open("row-detail" as never, { rowId: 456 } as never);
      });

      expect(result.current.isOpen("filter")).toBe(false);
      expect(result.current.isOpen("row-detail")).toBe(true);
      expect(result.current._state.args).toEqual({ rowId: 456 });
    });

    it("should update args when opening the same plugin again", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("row-detail" as never, { rowId: 1 } as never);
      });

      expect(result.current._state.args).toEqual({ rowId: 1 });

      act(() => {
        result.current.open("row-detail" as never, { rowId: 2 } as never);
      });

      expect(result.current.isOpen("row-detail")).toBe(true);
      expect(result.current._state.args).toEqual({ rowId: 2 });
    });
  });

  describe("close", () => {
    it("should close the current plugin", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("filter" as never, {} as never);
      });

      expect(result.current.isOpen("filter")).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.getActiveId()).toBeNull();
      expect(result.current.isOpen("filter")).toBe(false);
      expect(result.current._state.id).toBeNull();
      expect(result.current._state.args).toBeUndefined();
    });

    it("should be safe to call when no plugin is open", () => {
      const { result } = renderHook(() => usePluginControl());

      expect(() => {
        act(() => {
          result.current.close();
        });
      }).not.toThrow();

      expect(result.current.getActiveId()).toBeNull();
    });

    it("should clear args when closing", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("row-detail" as never, { rowId: 123 } as never);
      });

      expect(result.current._state.args).toEqual({ rowId: 123 });

      act(() => {
        result.current.close();
      });

      expect(result.current._state.args).toBeUndefined();
    });
  });

  describe("setActive", () => {
    it("should open a plugin when passed a plugin id", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.setActive("filter");
      });

      expect(result.current.isOpen("filter")).toBe(true);
      expect(result.current.getActiveId()).toBe("filter");
    });

    it("should close plugin when passed null", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("filter" as never, {} as never);
      });

      act(() => {
        result.current.setActive(null);
      });

      expect(result.current.getActiveId()).toBeNull();
      expect(result.current.isOpen("filter")).toBe(false);
    });

    it("should close plugin when passed undefined", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("filter" as never, {} as never);
      });

      act(() => {
        result.current.setActive(undefined);
      });

      expect(result.current.getActiveId()).toBeNull();
    });

    it("should clear args when using setActive (unlike open)", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("row-detail" as never, { rowId: 123 } as never);
      });

      expect(result.current._state.args).toEqual({ rowId: 123 });

      // setActive clears args
      act(() => {
        result.current.setActive("row-detail");
      });

      expect(result.current.isOpen("row-detail")).toBe(true);
      expect(result.current._state.args).toBeUndefined();
    });
  });

  describe("isOpen", () => {
    it("should return true only for the active plugin", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("filter" as never, {} as never);
      });

      expect(result.current.isOpen("filter")).toBe(true);
      expect(result.current.isOpen("row-detail")).toBe(false);
      expect(result.current.isOpen("column-control")).toBe(false);
    });

    it("should update when active plugin changes", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("filter" as never, {} as never);
      });

      expect(result.current.isOpen("filter")).toBe(true);

      act(() => {
        result.current.open("row-detail" as never, {} as never);
      });

      expect(result.current.isOpen("filter")).toBe(false);
      expect(result.current.isOpen("row-detail")).toBe(true);
    });
  });

  describe("getActiveId", () => {
    it("should return the current plugin id", () => {
      const { result } = renderHook(() => usePluginControl());

      expect(result.current.getActiveId()).toBeNull();

      act(() => {
        result.current.open("filter" as never, {} as never);
      });

      expect(result.current.getActiveId()).toBe("filter");
    });

    it("should return null after close", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("filter" as never, {} as never);
      });

      act(() => {
        result.current.close();
      });

      expect(result.current.getActiveId()).toBeNull();
    });
  });

  describe("stability", () => {
    it("open function should be stable across renders", () => {
      const { result, rerender } = renderHook(() => usePluginControl());

      const open1 = result.current.open;
      rerender();
      const open2 = result.current.open;

      expect(open1).toBe(open2);
    });

    it("close function should be stable across renders", () => {
      const { result, rerender } = renderHook(() => usePluginControl());

      const close1 = result.current.close;
      rerender();
      const close2 = result.current.close;

      expect(close1).toBe(close2);
    });

    it("setActive function should be stable across renders", () => {
      const { result, rerender } = renderHook(() => usePluginControl());

      const setActive1 = result.current.setActive;
      rerender();
      const setActive2 = result.current.setActive;

      expect(setActive1).toBe(setActive2);
    });

    it("isOpen function should update when state changes", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("filter" as never, {} as never);
      });

      // isOpen should be a new function since it depends on openPluginId
      // but it's wrapped in useCallback with openPluginId as dependency
      expect(result.current.isOpen("filter")).toBe(true);
    });
  });

  describe("_state internal state", () => {
    it("should expose internal state correctly", () => {
      const { result } = renderHook(() => usePluginControl());

      expect(result.current._state).toEqual({
        id: null,
        args: undefined,
      });

      act(() => {
        result.current.open("my-plugin" as never, { data: "test" } as never);
      });

      expect(result.current._state).toEqual({
        id: "my-plugin",
        args: { data: "test" },
      });
    });

    it("should update _state when closing", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("my-plugin" as never, { data: "test" } as never);
      });

      act(() => {
        result.current.close();
      });

      expect(result.current._state).toEqual({
        id: null,
        args: undefined,
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty string as plugin id", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("" as never, {} as never);
      });

      expect(result.current.getActiveId()).toBe("");
      expect(result.current.isOpen("")).toBe(true);
    });

    it("should handle complex args objects", () => {
      const { result } = renderHook(() => usePluginControl());

      const complexArgs = {
        nested: {
          deeply: {
            value: [1, 2, 3],
          },
        },
        fn: () => "test",
        date: new Date("2024-01-01"),
      };

      act(() => {
        result.current.open("plugin" as never, complexArgs as never);
      });

      expect(result.current._state.args).toBe(complexArgs);
    });

    it("should handle rapid open/close cycles", () => {
      const { result } = renderHook(() => usePluginControl());

      act(() => {
        result.current.open("a" as never, {} as never);
        result.current.open("b" as never, {} as never);
        result.current.close();
        result.current.open("c" as never, {} as never);
      });

      expect(result.current.getActiveId()).toBe("c");
    });
  });
});
