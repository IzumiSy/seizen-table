# DataAdapter

## Motivation

Enterprise applications fetch data from various sources: GraphQL APIs, REST endpoints, direct SQL queries, etc. The DataAdapter abstraction allows users to:

- Swap data sources without changing table logic
- Implement pagination, sorting, and filtering at the protocol level
- Handle caching and optimistic updates consistently

## Interface Design

```typescript
interface DataAdapterOptions<TData, TFilter = unknown> {
  /**
   * Initial page size
   */
  pageSize?: number;

  /**
   * Initial filter state
   */
  initialFilter?: TFilter;

  /**
   * Pagination mode
   * - "offset": Traditional page-based (page index + page size)
   * - "cursor": Cursor-based (first/after, last/before)
   * @default "offset"
   */
  paginationMode?: "offset" | "cursor";
}

interface OffsetPaginationState {
  mode: "offset";
  /**
   * Current page index (0-based)
   */
  pageIndex: number;
  /**
   * Current page size
   */
  pageSize: number;
}

interface CursorPaginationState {
  mode: "cursor";
  /**
   * Current page size
   */
  pageSize: number;
  /**
   * Start cursor of current page
   */
  startCursor: string | null;
  /**
   * End cursor of current page
   */
  endCursor: string | null;
  /**
   * Whether there is a next page
   */
  hasNextPage: boolean;
  /**
   * Whether there is a previous page
   */
  hasPreviousPage: boolean;
}

type PaginationState = OffsetPaginationState | CursorPaginationState;

interface DataAdapterState<TData> {
  /**
   * Current data array
   */
  data: TData[];

  /**
   * Total count of items (for pagination)
   * Note: May be null for cursor-based pagination if not provided by the API
   */
  totalCount: number | null;

  /**
   * Loading state
   */
  isLoading: boolean;

  /**
   * Error state
   */
  error: Error | null;

  /**
   * Pagination state (offset or cursor based)
   */
  pagination: PaginationState;
}

interface DataAdapterActions<TFilter = unknown> {
  /**
   * Fetch data with current state
   */
  fetch: () => Promise<void>;

  /**
   * Refetch data
   */
  refetch: () => Promise<void>;

  /**
   * Go to next page
   * - Offset mode: increments pageIndex
   * - Cursor mode: uses endCursor as "after"
   */
  nextPage: () => void;

  /**
   * Go to previous page
   * - Offset mode: decrements pageIndex
   * - Cursor mode: uses startCursor as "before"
   */
  previousPage: () => void;

  /**
   * Go to specific page (offset mode only)
   * @throws Error if called in cursor mode
   */
  goToPage: (index: number) => void;

  /**
   * Set page size
   */
  setPageSize: (size: number) => void;

  /**
   * Set filter
   */
  setFilter: (filter: TFilter) => void;

  /**
   * Set sorting
   */
  setSorting: (sorting: SortingState) => void;
}

interface DataAdapter<TData, TFilter = unknown> {
  state: DataAdapterState<TData>;
  actions: DataAdapterActions<TFilter>;
}
```

### Pagination Mode Comparison

| Feature | Offset Mode | Cursor Mode |
|---------|-------------|-------------|
| Jump to page | ✅ `goToPage(n)` | ❌ Not supported |
| Next/Previous | ✅ `nextPage()` / `previousPage()` | ✅ `nextPage()` / `previousPage()` |
| Total count | ✅ Always available | ⚠️ May be null |
| Performance | ⚠️ Slower on large datasets | ✅ Consistent performance |
| Real-time data | ⚠️ May skip/duplicate on changes | ✅ Stable cursor position |
```

## Defining Custom Adapters

Use `defineDataAdapter` to create custom adapters:

```typescript
import { defineDataAdapter } from "@izumisy/seizen-table";

const MyCustomAdapter = defineDataAdapter({
  id: "my-custom-adapter",

  // Initialize adapter state
  initialState: {
    data: [],
    totalCount: 0,
    isLoading: false,
    error: null,
    pageIndex: 0,
    pageSize: 10,
  },

  // Fetch implementation
  fetch: async (state, options) => {
    const response = await myApi.getItems({
      page: state.pageIndex,
      limit: state.pageSize,
    });
    return {
      data: response.items,
      totalCount: response.total,
    };
  },
});
```

## Built-in Adapters

### GraphQL Adapter

```typescript
import { GraphQLAdapter } from "@izumisy/seizen-datatable-adapter-graphql";

// Configure returns an adapter instance
const usersAdapter = GraphQLAdapter.configure({
  client: apolloClient,
  query: GET_USERS_QUERY,
  variables: (state) => ({
    first: state.pageSize,
    offset: state.pageIndex * state.pageSize,
    filter: state.filter,
    orderBy: state.sorting,
  }),
  // Map response to adapter format
  transform: (data) => ({
    data: data.users.nodes,
    totalCount: data.users.totalCount,
  }),
});
```

### REST/OpenAPI Adapter

```typescript
import { RESTAdapter } from "@izumisy/seizen-datatable-adapter-rest";

const usersAdapter = RESTAdapter.configure({
  baseUrl: "/api/users",
  // Builds URL with query params
  buildUrl: (state) => ({
    params: {
      page: state.pageIndex,
      limit: state.pageSize,
      sort: state.sorting?.[0]?.id,
      order: state.sorting?.[0]?.desc ? "desc" : "asc",
    },
  }),
  transform: (response) => ({
    data: response.items,
    totalCount: response.total,
  }),
});
```

### SQL Adapter (for Electron/Tauri apps)

```typescript
import { SQLAdapter } from "@izumisy/seizen-datatable-adapter-sql";

const usersAdapter = SQLAdapter.configure({
  db: sqliteConnection,
  table: "users",
  // Auto-generates SQL with pagination, sorting, filtering
});
```

## Adapter API

The adapter instance provides a framework-agnostic API:

```typescript
const usersAdapter = GraphQLAdapter.configure({
  client: apolloClient,
  query: GET_USERS_QUERY,
  // ...
});

// State (readonly)
usersAdapter.state.data;        // TData[]
usersAdapter.state.totalCount;  // number
usersAdapter.state.isLoading;   // boolean
usersAdapter.state.error;       // Error | null
usersAdapter.state.pageIndex;   // number
usersAdapter.state.pageSize;    // number

// Actions
usersAdapter.fetch();                    // Fetch data
usersAdapter.refetch();                  // Refetch current page
usersAdapter.setPageIndex(2);            // Go to page
usersAdapter.setPageSize(20);            // Change page size
usersAdapter.setFilter({ status: "active" });  // Set filter
usersAdapter.setSorting([{ id: "name", desc: false }]);  // Set sorting

// Subscribe to state changes (for non-React usage)
const unsubscribe = usersAdapter.subscribe((state) => {
  console.log("State updated:", state);
});
```

## Usage with SeizenTable

```tsx
import { useAdapter } from "@izumisy/seizen-table";

const usersAdapter = GraphQLAdapter.configure({
  client: apolloClient,
  query: GET_USERS_QUERY,
  // ...
});

function UsersTable() {
  // useAdapter subscribes to state changes and triggers re-render
  const { state, actions } = useAdapter(usersAdapter);

  return (
    <SeizenTable
      data={state.data}
      columns={columns}
      isLoading={state.isLoading}
    />
  );
}
```
