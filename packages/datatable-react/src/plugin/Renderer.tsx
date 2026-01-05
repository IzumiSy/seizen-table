import { useMemo } from "react";
import type {
  DataTablePlugin,
  PluginPosition,
  SidepanelPlugin,
} from "./definePlugin";
import { usePluginContext } from "./Context";
import * as styles from "./styles.css";

interface PluginRendererProps {
  /**
   * Plugin position to render
   */
  position: PluginPosition;
}

/**
 * Check if a plugin is a sidepanel plugin
 */
function isSidepanelPlugin(
  plugin: DataTablePlugin<any>
): plugin is SidepanelPlugin<any> {
  return "position" in plugin && "render" in plugin;
}

/**
 * Renders plugins for a specific position
 */
export function PluginRenderer({ position }: PluginRendererProps) {
  const { table } = usePluginContext();
  const plugins = table.plugins;
  const activePluginId = table.plugin.getActiveId();
  const setActive = table.plugin.setActive;
  // Filter plugins by position
  const sidepanelPlugins = plugins.filter(
    (p) => isSidepanelPlugin(p) && p.position === position
  ) as SidepanelPlugin<any>[];

  // Memoize plugin components to maintain stable references
  const pluginComponents = useMemo(() => {
    return sidepanelPlugins.map((plugin) => ({
      id: plugin.id,
      // Use header if provided, otherwise fallback to name
      header: plugin.header ?? plugin.name,
      Component: plugin.render,
    }));
  }, [sidepanelPlugins]);

  if (sidepanelPlugins.length === 0) {
    return null;
  }

  const dataPosition = position === "left-sider" ? "left" : "right";
  // Check if the active plugin belongs to this position
  const isActiveHere = sidepanelPlugins.some((p) => p.id === activePluginId);

  return (
    <div className={styles.sidepanel} data-position={dataPosition}>
      {/* Vertical tabs */}
      <div className={styles.sidepanelTabs}>
        {sidepanelPlugins.map((plugin) => (
          <button
            key={plugin.id}
            className={styles.sidepanelTab}
            data-active={activePluginId === plugin.id || undefined}
            onClick={() =>
              setActive(activePluginId === plugin.id ? null : plugin.id)
            }
          >
            <span className={styles.sidepanelTabLabel}>{plugin.name}</span>
          </button>
        ))}
      </div>

      {/* Plugin content - render all but only show active */}
      {pluginComponents.map(({ id, header, Component }) => (
        <div
          key={id}
          className={styles.sidepanelContent}
          style={{
            display: isActiveHere && activePluginId === id ? "flex" : "none",
          }}
        >
          <div className={styles.sidepanelHeader}>
            <div className={styles.sidepanelHeaderContent}>
              {typeof header === "string" ? (
                <h3 className={styles.sidepanelHeaderTitle}>{header}</h3>
              ) : (
                header
              )}
            </div>
            <button
              className={styles.sidepanelCloseButton}
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className={styles.sidepanelBody}>
            <Component />
          </div>
        </div>
      ))}
    </div>
  );
}
