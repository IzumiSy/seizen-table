# Remote Table State

Utilities for managing remote data source state with SeizenTable.

## Installation

These utilities are included in `@izumisy/seizen-table-plugins`.

```typescript
import {
  useRemoteTableState,
  useBindRemoteTableEvents,
} from "@izumisy/seizen-table-plugins/remote";
```

## Usage

```tsx
import { useSeizenTable, SeizenTable } from "@izumisy/seizen-table";
import {
  useRemoteTableState,
  useBindRemoteTableEvents,
} from "@izumisy/seizen-table-plugins/remote";

function MyRemoteTable() {
  // 1. Create remote state
  const remote = useRemoteTableState<MyData>({
    initialPagination: { pageIndex: 0, pageSize: 10 },
  });

  // 2. Create table with remote data
  const table = useSeizenTable({
    data: remote.data,
    columns,
    remote: remote.getRemoteOptions(),
  });

  // 3. Bind table events to remote state
  useBindRemoteTableEvents(table, remote);

  // 4. Fetch data when query state changes
  useEffect(() => {
    fetchData();
  }, [remote.pagination, remote.sorting, remote.filters]);

  async function fetchData() {
    remote.setLoading(true);
    try {
      const result = await api.getData({
        page: remote.pagination.pageIndex,
        pageSize: remote.pagination.pageSize,
        sort: remote.sorting,
        filters: remote.filters,
        cursor: remote.getCurrentCursor(), // for cursor-based pagination
      });

      remote.setData(result.items, {
        totalCount: result.total,
        cursor: result.nextCursor, // optional, for cursor-based pagination
      });
    } catch (err) {
      remote.setError(err);
    } finally {
      remote.setLoading(false);
    }
  }

  return <SeizenTable table={table} loading={remote.loading} />;
}
```

## API

### `useRemoteTableState<TData>(options?)`

Returns a state object for managing remote table data.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialPagination` | `PaginationState` | `{ pageIndex: 0, pageSize: 10 }` | Initial pagination state |
| `initialSorting` | `SortingState` | `[]` | Initial sorting state |
| `initialFilters` | `ColumnFiltersState` | `[]` | Initial filters state |

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `data` | `TData[]` | Current data |
| `loading` | `boolean` | Loading state |
| `error` | `Error \| null` | Error state |
| `pagination` | `PaginationState` | Current pagination |
| `sorting` | `SortingState` | Current sorting |
| `filters` | `ColumnFiltersState` | Current filters |
| `totalCount` | `number` | Total row count from server |
| `setPagination` | `(pagination) => void` | Update pagination |
| `setSorting` | `(sorting) => void` | Update sorting |
| `setFilters` | `(filters) => void` | Update filters |
| `setLoading` | `(loading) => void` | Update loading state |
| `setData` | `(data, options?) => void` | Set data with optional totalCount and cursor |
| `setError` | `(error) => void` | Set error |
| `resetToFirstPage` | `() => void` | Reset to first page and clear cursors |
| `reset` | `() => void` | Reset all state to initial values |
| `getCurrentCursor` | `() => string \| undefined` | Get cursor for current page |
| `getRemoteOptions` | `() => RemoteOptions` | Get options for `useSeizenTable` |

### `useBindRemoteTableEvents(table, remote, options?)`

Binds SeizenTable events to remote state.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `resetOnSortingChange` | `boolean` | `true` | Reset to first page when sorting changes |
| `resetOnFilterChange` | `boolean` | `true` | Reset to first page when filters change |
