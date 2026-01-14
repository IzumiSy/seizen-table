# PresetFilter Plugin

A header-based plugin that provides preset filter buttons and a global search bar for quick filtering.

## Features

- **Preset Filter Buttons**: Define named filter presets that users can apply with a single click
- **Button Group UI**: Displays presets as a toggleable button group in the header
- **Global Search**: Optional right-aligned search bar for filtering across all columns
- **"All" Button**: Built-in button to clear all filters and show all data

## Usage

```tsx
import { PresetFilterPlugin } from "@izumisy/seizen-table-plugins/preset-filter";

const table = useSeizenTable({
  data,
  columns,
  plugins: [
    PresetFilterPlugin.configure({
      presets: [
        {
          id: "active",
          label: "Active",
          filters: [
            { columnKey: "status", operator: "equals", value: "active" },
          ],
        },
        {
          id: "high-value",
          label: "High Value",
          filters: [
            { columnKey: "amount", operator: "gte", value: "1000" },
          ],
        },
        {
          id: "recent",
          label: "Recent",
          filters: [
            { columnKey: "createdAt", operator: "after", value: "2024-01-01" },
          ],
        },
      ],
      allLabel: "Show All",
      enableGlobalSearch: true,
      searchPlaceholder: "Search orders...",
    }),
  ],
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `presets` | `Preset[]` | Required | Array of preset filter definitions |
| `allLabel` | `string` | `"All"` | Label for the "All" button that clears filters |
| `enableGlobalSearch` | `boolean` | `true` | Enable the global search bar |
| `searchPlaceholder` | `string` | `"Search..."` | Placeholder text for the search input |
| `searchDebounceMs` | `number` | `300` | Debounce delay for search in milliseconds |

## Preset Definition

Each preset has the following structure:

```typescript
interface Preset {
  id: string;      // Unique identifier
  label: string;   // Button display text
  filters: FilterCondition[];
}

interface FilterCondition {
  columnKey: string;       // Column accessor key
  operator: FilterOperator; // Filter operator
  value?: string;          // Filter value (optional for is_empty/is_not_empty)
}
```

## Supported Filter Operators

### String Operators
- `contains` - Contains the value
- `not_contains` - Does not contain the value
- `equals` - Exact match
- `not_equals` - Not an exact match
- `starts_with` - Starts with the value
- `ends_with` - Ends with the value
- `is_empty` - Cell is empty
- `is_not_empty` - Cell is not empty

### Number Operators
- `eq` - Equal to
- `neq` - Not equal to
- `gt` - Greater than
- `gte` - Greater than or equal to
- `lt` - Less than
- `lte` - Less than or equal to

### Date Operators
- `before` - Before the date
- `after` - After the date
- `on` - On the exact date

### Enum Operators
- `is` - Is the value
- `is_not` - Is not the value

## Notes

- Columns must have `meta.filterType` defined for filtering to work
- Multiple filter conditions in a preset are combined with AND logic
- The global search works across all searchable columns
- Preset selection is exclusive - only one preset can be active at a time
