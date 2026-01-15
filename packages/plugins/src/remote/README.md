# Remote Data

A minimal hook for managing remote data state with SeizenTable.

## Installation

```typescript
import { useRemoteData } from "@izumisy/seizen-table-plugins/remote";
```

## Usage

```tsx
import { useSeizenTable, SeizenTable, useSeizenTableEvent } from "@izumisy/seizen-table";
import { useRemoteData } from "@izumisy/seizen-table-plugins/remote";

function MyRemoteTable() {
  const remote = useRemoteData<MyData>();

  const table = useSeizenTable({
    data: remote.data,
    columns,
    remote: remote.getRemoteOptions(),
  });

  // Fetch data on pagination change
  useSeizenTableEvent(table, "pagination-change", (pagination) => {
    fetchData(pagination, table.getState().sorting);
  });

  // Fetch data on sorting change (reset to first page)
  useSeizenTableEvent(table, "sorting-change", (sorting) => {
    remote.clearCursors();
    table.setPageIndex(0);
    fetchData({ pageIndex: 0, pageSize: table.getState().pagination.pageSize }, sorting);
  });

  async function fetchData(pagination, sorting) {
    remote.setLoading(true);
    try {
      const result = await api.getData({
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        cursor: remote.getCursor(pagination.pageIndex - 1), // for cursor-based pagination
        sort: sorting,
      });

      remote.setData(result.items, {
        totalCount: result.total,
        cursor: result.nextCursor, // for cursor-based pagination
      });
    } catch (err) {
      remote.setError(err);
    } finally {
      remote.setLoading(false);
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchData(table.getState().pagination, table.getState().sorting);
  }, []);

  return <SeizenTable table={table} loading={remote.loading} />;
}
```

## API

### `useRemoteData<TData>()`

Returns a state object for managing remote data.

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `data` | `TData[]` | Current data array |
| `loading` | `boolean` | Loading state |
| `error` | `Error \| null` | Error state |
| `totalCount` | `number` | Total row count from server |
| `setLoading` | `(loading: boolean) => void` | Set loading state |
| `setData` | `(data, options?) => void` | Set data with optional totalCount and cursor |
| `setError` | `(error) => void` | Set error state |
| `getCursor` | `(pageIndex: number) => string \| undefined` | Get cursor for a page |
| `clearCursors` | `() => void` | Clear all stored cursors |
| `getRemoteOptions` | `() => RemoteOptions` | Get remote options for useSeizenTable |

## Design Philosophy

This hook intentionally only manages **data-related state**:
- `data`, `loading`, `error`, `totalCount`, `cursors`

**Pagination, sorting, and filters are managed by the table** via `useSeizenTable`.
This avoids state duplication and keeps the API simple.

Use `useSeizenTableEvent` to react to table state changes and trigger data fetching.
