import type { PluginRegistry } from "./usePluginToggle";

export {
  usePluginToggle,
  type PluginDefinition,
  type PluginRegistry,
  type UsePluginToggleOptions,
} from "./usePluginToggle";

// =============================================================================
// PluginToggleItem Component
// =============================================================================

function PluginToggleItem({
  name,
  description,
  enabled,
  onToggle,
}: {
  name: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        backgroundColor: enabled ? "#eff6ff" : "#f9fafb",
        borderRadius: "6px",
        cursor: "pointer",
        border: `1px solid ${enabled ? "#3b82f6" : "#e5e7eb"}`,
        transition: "all 0.15s ease",
      }}
    >
      <input
        type="checkbox"
        checked={enabled}
        onChange={onToggle}
        style={{ width: "16px", height: "16px", cursor: "pointer" }}
      />
      <div>
        <div style={{ fontWeight: 500, fontSize: "13px", color: "#111827" }}>
          {name}
        </div>
        <div style={{ fontSize: "11px", color: "#6b7280" }}>{description}</div>
      </div>
    </label>
  );
}

// =============================================================================
// PluginToggleList Component
// =============================================================================

export function PluginToggleList<TId extends string>({
  pluginRegistry,
  enabledPlugins,
  onToggle,
}: {
  pluginRegistry: PluginRegistry<TId>;
  enabledPlugins: Set<TId>;
  onToggle: (id: TId) => void;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <h3
        style={{
          margin: "0 0 12px",
          fontSize: "14px",
          fontWeight: 600,
          color: "#374151",
        }}
      >
        Plugins
      </h3>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {(
          Object.entries(pluginRegistry) as [TId, PluginRegistry<TId>[TId]][]
        ).map(([id, { name, description }]) => (
          <PluginToggleItem
            key={id}
            name={name}
            description={description}
            enabled={enabledPlugins.has(id)}
            onToggle={() => onToggle(id)}
          />
        ))}
      </div>
    </div>
  );
}
