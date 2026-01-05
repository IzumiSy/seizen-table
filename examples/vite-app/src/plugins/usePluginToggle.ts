import { useMemo, useState } from "react";
import type { DataTablePlugin } from "@izumisy/seizen-datatable-react/plugin";

// =============================================================================
// Types
// =============================================================================

export type PluginDefinition = {
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugin: DataTablePlugin<any>;
};

export type PluginRegistry<TId extends string = string> = Record<
  TId,
  PluginDefinition
>;

export type UsePluginToggleOptions<TId extends string> = {
  plugins: PluginRegistry<TId>;
  initialEnabled?: TId[];
};

// =============================================================================
// usePluginToggle Hook
// =============================================================================

export function usePluginToggle<TData, TId extends string>({
  plugins: pluginRegistry,
  initialEnabled = [],
}: UsePluginToggleOptions<TId>) {
  const [enabledPlugins, setEnabledPlugins] = useState<Set<TId>>(
    new Set(initialEnabled)
  );

  const togglePlugin = (id: TId) => {
    setEnabledPlugins((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const plugins = useMemo(() => {
    return (Object.keys(pluginRegistry) as TId[])
      .filter((id) => enabledPlugins.has(id))
      .map((id) => pluginRegistry[id].plugin) as DataTablePlugin<TData>[];
  }, [enabledPlugins, pluginRegistry]);

  const isEnabled = (id: TId) => enabledPlugins.has(id);

  return {
    plugins,
    pluginRegistry,
    enabledPlugins,
    togglePlugin,
    isEnabled,
  };
}
