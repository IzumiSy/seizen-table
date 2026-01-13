import { useState, useCallback, useMemo } from "react";

// =============================================================================
// Types
// =============================================================================

/**
 * Registry for plugin open() args types.
 *
 * Plugin authors can extend this interface via module augmentation
 * to provide type-safe args for their plugins.
 *
 * @example
 * ```typescript
 * // In your plugin file:
 * declare module "@izumisy/seizen-table/plugin" {
 *   interface PluginArgsRegistry {
 *     "my-plugin": { row: MyRowType; mode: "view" | "edit" };
 *   }
 * }
 * ```
 */
export interface PluginArgsRegistry {
  // Empty by default - plugins extend this via module augmentation
}

/**
 * Internal plugin state.
 * @internal
 */
export interface PluginInternalState {
  /** ID of the currently open plugin, or null if no plugin is open. */
  id: string | null;
  /** Arguments passed to the plugin via open(). */
  args: unknown;
}

/**
 * Plugin control interface returned by usePluginControl.
 */
export interface PluginControl {
  /**
   * Open a plugin's side panel.
   *
   * When a plugin registers its args type via module augmentation,
   * the args parameter becomes type-safe.
   *
   * @param pluginId - ID of the plugin to open
   * @param args - Arguments to pass to the plugin (accessible via openArgs in usePluginContext)
   *
   * @example
   * ```typescript
   * // With registered plugin (type-safe)
   * table.plugin.open("row-detail", { row }); // ✅
   * table.plugin.open("row-detail", { foo: 1 }); // ❌ Type error
   *
   * // With unregistered plugin (requires explicit type or uses unknown)
   * table.plugin.open("custom-plugin" as const, { data: 123 });
   * ```
   */
  open: <K extends keyof PluginArgsRegistry>(
    pluginId: K,
    args: PluginArgsRegistry[K]
  ) => void;

  /**
   * Close the currently open plugin's side panel.
   */
  close: () => void;

  /**
   * Set the active plugin. If pluginId is provided, opens that plugin; otherwise closes the current plugin.
   * Useful as a callback for UI components.
   * @param pluginId - ID of the plugin to open, or null/undefined to close
   */
  setActive: (pluginId: string | null | undefined) => void;

  /**
   * Check if a specific plugin is currently open.
   * @param pluginId - ID of the plugin to check
   * @returns true if the specified plugin is open
   */
  isOpen: (pluginId: string) => boolean;

  /**
   * Get the ID of the currently active (open) plugin.
   * @returns The plugin ID or null if no plugin is open
   */
  getActiveId: () => string | null;

  /**
   * Internal state of the currently open plugin.
   * @internal
   */
  _state: PluginInternalState;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Internal hook for managing plugin open/close state.
 * Used by useSeizenTable to provide plugin control interface.
 *
 * @internal
 */
export function usePluginControl(): PluginControl {
  const [openPluginId, setOpenPluginId] = useState<string | null>(null);
  const [openPluginArgs, setOpenPluginArgs] = useState<unknown>(undefined);

  const open = useCallback((pluginId: string, args?: unknown) => {
    setOpenPluginId(pluginId);
    setOpenPluginArgs(args);
  }, []);

  const close = useCallback(() => {
    setOpenPluginId(null);
    setOpenPluginArgs(undefined);
  }, []);

  const setActive = useCallback((pluginId: string | null | undefined) => {
    if (pluginId) {
      setOpenPluginId(pluginId);
      setOpenPluginArgs(undefined);
    } else {
      setOpenPluginId(null);
      setOpenPluginArgs(undefined);
    }
  }, []);

  const isOpen = useCallback(
    (pluginId: string) => openPluginId === pluginId,
    [openPluginId]
  );

  const getActiveId = useCallback(() => openPluginId, [openPluginId]);

  const pluginControl = useMemo<PluginControl>(
    () => ({
      open,
      close,
      setActive,
      isOpen,
      getActiveId,
      _state: {
        id: openPluginId,
        args: openPluginArgs,
      },
    }),
    [open, close, setActive, isOpen, getActiveId, openPluginId, openPluginArgs]
  );

  return pluginControl;
}
