import {
  useDataTable,
  useDataTableEvent,
  DataTable,
  type ColumnDef,
} from "@izumisy/seizen-datatable-react";
import { data, type Person } from "./data";
import { PluginToggleList } from "./plugins/PluginToggle";
import { RowDetailPlugin } from "./plugins/RowDetailPlugin";
import {
  FileExportPlugin,
  CsvExporter,
  JsonlExporter,
  TsvExporter,
} from "./plugins/FileExportPlugin";
import { ColumnControlPlugin } from "./plugins/ColumnControlPlugin";
import { FilterPlugin } from "./plugins/FilterPlugin";
import { AllSlotsDemo } from "./plugins/AllSlotsPlugin";
import {
  StatusBadge,
  DepartmentBadge,
  AvatarName,
  SalaryCell,
  EmailCell,
  DateCell,
  LocationCell,
} from "./components/cells";
import {
  type PluginRegistry,
  usePluginToggle,
} from "./plugins/usePluginToggle";

// =============================================================================
// Plugin Definitions
// =============================================================================

const AVAILABLE_PLUGINS = {
  "row-detail": {
    name: "Row Detail",
    description: "Show row details in sidepanel",
    plugin: RowDetailPlugin.configure({ width: 450 }),
  },
  "column-control": {
    name: "Column Control",
    description: "Toggle column visibility",
    plugin: ColumnControlPlugin.configure({ width: 450 }),
  },
  "file-export": {
    name: "File Export",
    description: "Export data to CSV/JSON/TSV",
    plugin: FileExportPlugin.configure({
      width: 450,
      filename: "users",
      includeHeaders: true,
      exporters: [CsvExporter, JsonlExporter, TsvExporter],
    }),
  },
  filter: {
    name: "Filter",
    description: "Filter data by column values",
    plugin: FilterPlugin.configure({ width: 450 }),
  },
  "all-slots-demo": {
    name: "All Slots Demo",
    description: "Demo plugin using all 5 slots",
    plugin: AllSlotsDemo.configure({
      sidepanelTitle: "All Slots Demo",
      enableCellHighlight: true,
      primaryColor: "#8b5cf6",
    }),
  },
} as const satisfies PluginRegistry;

type PluginId = keyof typeof AVAILABLE_PLUGINS;

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "id",
    header: "ID",
    meta: { filterType: "number" },
    cell: ({ getValue }) => (
      <span style={{ color: "#9ca3af", fontFamily: "monospace" }}>
        #{String(getValue()).padStart(3, "0")}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    meta: { filterType: "string" },
    cell: ({ getValue }) => <AvatarName name={getValue() as string} />,
  },
  {
    accessorKey: "age",
    header: "Age",
    meta: { filterType: "number" },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { filterType: "string" },
    cell: ({ getValue }) => <EmailCell email={getValue() as string} />,
  },
  {
    accessorKey: "department",
    header: "Department",
    meta: {
      filterType: "enum",
      filterEnumValues: [
        "Engineering",
        "Sales",
        "Marketing",
        "HR",
        "Finance",
        "Operations",
      ],
    },
    cell: ({ getValue }) => (
      <DepartmentBadge department={getValue() as string} />
    ),
  },
  {
    accessorKey: "joinedAt",
    header: "Joined At",
    meta: { filterType: "date" },
    cell: ({ getValue }) => <DateCell date={getValue() as string} />,
  },
  {
    accessorKey: "role",
    header: "Role",
    meta: { filterType: "string" },
    cell: ({ getValue }) => (
      <span style={{ fontStyle: "italic", color: "#4b5563" }}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "salary",
    header: "Salary",
    meta: { filterType: "number" },
    cell: ({ getValue }) => <SalaryCell salary={getValue() as number} />,
  },
  {
    accessorKey: "location",
    header: "Location",
    meta: {
      filterType: "enum",
      filterEnumValues: [
        "Tokyo",
        "Osaka",
        "New York",
        "London",
        "Singapore",
        "Berlin",
      ],
    },
    cell: ({ getValue }) => <LocationCell location={getValue() as string} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      filterType: "enum",
      filterEnumValues: ["active", "inactive", "on-leave"],
    },
    cell: ({ getValue }) => (
      <StatusBadge status={getValue() as Person["status"]} />
    ),
  },
];

// =============================================================================
// App Component
// =============================================================================

function App() {
  const { plugins, pluginRegistry, enabledPlugins, togglePlugin, isEnabled } =
    usePluginToggle<Person, PluginId>({
      plugins: AVAILABLE_PLUGINS,
      initialEnabled: ["row-detail", "column-control", "file-export", "filter"],
    });

  const table = useDataTable({
    data,
    columns,
    plugins,
  });

  useDataTableEvent(table, "row-click", (row) => {
    if (isEnabled("all-slots-demo")) {
      // Open inline row when AllSlotsDemo is enabled
      table.plugin.open("all-slots-demo", { id: (row as Person).id });
    } else if (isEnabled("row-detail")) {
      // Fallback to row detail
      table.plugin.open("row-detail", { row });
    }
  });

  return (
    <div style={{ padding: "20px" }}>
      {/* Plugin Toggles */}
      <PluginToggleList
        pluginRegistry={pluginRegistry}
        enabledPlugins={enabledPlugins}
        onToggle={togglePlugin}
      />

      {/* DataTable */}
      <DataTable table={table} />
    </div>
  );
}

export default App;
