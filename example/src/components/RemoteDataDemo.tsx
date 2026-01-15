import { useState, useEffect, useCallback } from "react";
import {
  useSeizenTable,
  useSeizenTableEvent,
  SeizenTable,
  type PaginationState,
  type SortingState,
} from "@izumisy/seizen-table";
import { FilterPlugin } from "@izumisy/seizen-table-plugins/filter";
import { ColumnControlPlugin } from "@izumisy/seizen-table-plugins/column-control";

interface GitHubRepository {
  id: string;
  name: string;
  nameWithOwner: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string } | null;
  updatedAt: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
}

interface ConfigurationPanelProps {
  apiToken: string;
  onApiTokenChange: (token: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  error: string | null;
}

function ConfigurationPanel({
  apiToken,
  onApiTokenChange,
  searchQuery,
  onSearchQueryChange,
  error,
}: ConfigurationPanelProps) {
  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
      }}
    >
      <h3
        style={{
          margin: "0 0 12px 0",
          fontSize: "14px",
          fontWeight: 600,
          color: "#374151",
        }}
      >
        GitHub GraphQL API Configuration
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          alignItems: "end",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            API Token (required for GraphQL API)
          </label>
          <input
            type="password"
            value={apiToken}
            onChange={(e) => onApiTokenChange(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxx"
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            Search Query
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="e.g., react, vue, typescript"
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: "12px",
            padding: "8px 12px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      <p
        style={{
          margin: "12px 0 0 0",
          fontSize: "12px",
          color: "#9ca3af",
        }}
      >
        💡 Generate a personal access token at{" "}
        <a
          href="https://github.com/settings/tokens"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#3b82f6" }}
        >
          GitHub Settings → Developer settings → Personal access tokens
        </a>
        . This demo uses the GitHub GraphQL API with server-side pagination.
      </p>
    </div>
  );
}

const columns = [
  {
    accessorKey: "name",
    header: "Repository",
    meta: { filterType: "string" as const },
    cell: ({ row }: { row: { original: GitHubRepository } }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          src={row.original.owner.avatarUrl}
          alt={row.original.owner.login}
          style={{ width: 24, height: 24, borderRadius: "50%" }}
        />
        <a
          href={row.original.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 500 }}
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.nameWithOwner}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    meta: { filterType: "string" as const },
    cell: ({ row }: { row: { original: GitHubRepository } }) => (
      <span
        style={{
          color: "#6b7280",
          fontSize: "13px",
          maxWidth: "300px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          display: "block",
        }}
        title={row.original.description || ""}
      >
        {row.original.description || "-"}
      </span>
    ),
  },
  {
    accessorKey: "primaryLanguage",
    header: "Language",
    meta: { filterType: "string" as const },
    cell: ({ row }: { row: { original: GitHubRepository } }) => {
      const lang = row.original.primaryLanguage?.name;
      if (!lang) return <span style={{ color: "#9ca3af" }}>-</span>;

      const colors: Record<string, string> = {
        TypeScript: "#3178c6",
        JavaScript: "#f7df1e",
        Python: "#3572A5",
        Go: "#00ADD8",
        Rust: "#dea584",
        Java: "#b07219",
        Ruby: "#701516",
        Swift: "#F05138",
        Kotlin: "#A97BFF",
        C: "#555555",
        "C++": "#f34b7d",
        "C#": "#178600",
      };

      return (
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: colors[lang] || "#6b7280",
            }}
          />
          {lang}
        </span>
      );
    },
  },
  {
    accessorKey: "stargazerCount",
    header: "Stars",
    meta: { filterType: "number" as const },
    cell: ({ row }: { row: { original: GitHubRepository } }) => (
      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <span style={{ color: "#fbbf24" }}>★</span>
        {row.original.stargazerCount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "forkCount",
    header: "Forks",
    meta: { filterType: "number" as const },
    cell: ({ row }: { row: { original: GitHubRepository } }) => (
      <span style={{ color: "#6b7280" }}>
        {row.original.forkCount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }: { row: { original: GitHubRepository } }) => {
      const date = new Date(row.original.updatedAt);
      return (
        <span style={{ color: "#6b7280", fontSize: "13px" }}>
          {date.toLocaleDateString()}
        </span>
      );
    },
  },
];

// GraphQL query for searching repositories
const SEARCH_REPOSITORIES_QUERY = `
  query SearchRepositories($query: String!, $first: Int!, $after: String) {
    search(query: $query, type: REPOSITORY, first: $first, after: $after) {
      repositoryCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ... on Repository {
          id
          name
          nameWithOwner
          description
          url
          stargazerCount
          forkCount
          primaryLanguage {
            name
          }
          updatedAt
          owner {
            login
            avatarUrl
          }
        }
      }
    }
  }
`;

// Map sorting state to GitHub GraphQL order
function mapSortingToGitHubOrder(sorting: SortingState): string {
  if (sorting.length === 0) {
    return "sort:stars-desc";
  }

  const sort = sorting[0];
  const direction = sort.desc ? "desc" : "asc";

  switch (sort.id) {
    case "stargazerCount":
      return `sort:stars-${direction}`;
    case "forkCount":
      return `sort:forks-${direction}`;
    case "updatedAt":
      return `sort:updated-${direction}`;
    default:
      return "sort:stars-desc";
  }
}

export function RemoteDataDemo() {
  const [apiToken, setApiToken] = useState("");
  const [searchQuery, setSearchQuery] = useState("react");
  const [data, setData] = useState<GitHubRepository[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursors, setCursors] = useState<Map<number, string>>(new Map());

  // State for remote data fetching
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useSeizenTable({
    data,
    columns,
    plugins: [FilterPlugin.configure({}), ColumnControlPlugin.configure({})],
    remote: totalCount > 0 ? { totalRowCount: totalCount } : true,
  });

  // Subscribe to table events
  useSeizenTableEvent(table, "pagination-change", (value) => {
    console.log("Pagination changed:", value);

    setPagination(value);
  });
  useSeizenTableEvent(table, "sorting-change", (newSorting) => {
    console.log("Sorting changed:", newSorting);

    setSorting(newSorting);
    // Reset pagination and cursors when sorting changes
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setCursors(new Map());
  });

  // Fetch data using GraphQL
  const fetchRepositories = useCallback(async () => {
    if (!apiToken.trim()) {
      setError("API token is required for GitHub GraphQL API");
      return;
    }

    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sortQuery = mapSortingToGitHubOrder(sorting);
      const fullQuery = `${searchQuery} ${sortQuery}`;

      // Get cursor for current page (if not first page)
      const cursor =
        pagination.pageIndex > 0
          ? cursors.get(pagination.pageIndex - 1)
          : undefined;

      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          query: SEARCH_REPOSITORIES_QUERY,
          variables: {
            query: fullQuery,
            first: pagination.pageSize,
            after: cursor,
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid API token. Please check your token.");
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0]?.message || "GraphQL error");
      }

      const searchResult = result.data.search;
      const repositories = searchResult.nodes.filter(
        (node: GitHubRepository | null) => node !== null
      );

      setData(repositories);
      setTotalCount(Math.min(searchResult.repositoryCount, 1000)); // GitHub limits to 1000 results

      // Store cursor for next page
      if (searchResult.pageInfo.endCursor) {
        setCursors((prev) => {
          const newCursors = new Map(prev);
          newCursors.set(pagination.pageIndex, searchResult.pageInfo.endCursor);
          return newCursors;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [apiToken, searchQuery, pagination, sorting, cursors]);

  // Fetch data when pagination, sorting, search query, or token changes
  useEffect(() => {
    if (apiToken.trim() && searchQuery.trim()) {
      fetchRepositories();
    }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    searchQuery,
    apiToken,
  ]);

  // Initial fetch when token is provided
  const handleApiTokenChange = useCallback(
    (token: string) => {
      setApiToken(token);
      if (token.trim() && searchQuery.trim()) {
        // Reset state for new token
        setCursors(new Map());
        setPagination({ pageIndex: 0, pageSize: 10 });
      }
    },
    [searchQuery]
  );

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    // Reset pagination and cursors when search changes
    setCursors(new Map());
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <ConfigurationPanel
        apiToken={apiToken}
        onApiTokenChange={handleApiTokenChange}
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        error={error}
      />

      {/* Table */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <SeizenTable table={table} loading={loading} />
      </div>
    </div>
  );
}
