import { useState, useEffect, useCallback } from "react";
import {
  useSeizenTable,
  SeizenTable,
  useSeizenTableEvent,
} from "@izumisy/seizen-table";
import { FilterPlugin } from "@izumisy/seizen-table-plugins/filter";
import { ColumnControlPlugin } from "@izumisy/seizen-table-plugins/column-control";
import { useRemoteData } from "@izumisy/seizen-table-plugins/remote";

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
    accessorFn: (row: GitHubRepository) => row.primaryLanguage?.name ?? null,
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

// Filter value type from FilterPlugin
interface FilterValue {
  operator: string;
  value: string;
}

// Build GitHub search query from sorting and filters
function buildGitHubQuery(
  searchQuery: string,
  sorting: { id: string; desc: boolean }[],
  filters: { id: string; value: unknown }[]
): string {
  const parts: string[] = [searchQuery];

  // Add sorting
  if (sorting.length > 0) {
    const sort = sorting[0];
    const direction = sort.desc ? "desc" : "asc";
    switch (sort.id) {
      case "stargazerCount":
        parts.push(`sort:stars-${direction}`);
        break;
      case "forkCount":
        parts.push(`sort:forks-${direction}`);
        break;
      case "updatedAt":
        parts.push(`sort:updated-${direction}`);
        break;
      default:
        parts.push("sort:stars-desc");
    }
  } else {
    parts.push("sort:stars-desc");
  }

  // Add filters
  for (const filter of filters) {
    const filterValue = filter.value as FilterValue;
    const value = filterValue?.value;
    if (!value || !value.trim()) continue;

    switch (filter.id) {
      case "primaryLanguage":
        parts.push(`language:${value}`);
        break;
      case "owner":
        parts.push(`user:${value}`);
        break;
      case "name":
        parts.push(`${value} in:name`);
        break;
      case "description":
        parts.push(`${value} in:description`);
        break;
      case "stargazerCount":
        parts.push(`stars:${value}`);
        break;
      case "forkCount":
        parts.push(`forks:${value}`);
        break;
    }
  }

  return parts.join(" ").trim();
}

export function RemoteDataDemo() {
  // GitHub API specific state
  const [apiToken, setApiToken] = useState("");
  const [searchQuery, setSearchQuery] = useState("react");

  // Remote data state (data, loading, error, totalCount, cursors)
  const remote = useRemoteData<GitHubRepository>();

  // Create table instance
  const table = useSeizenTable({
    data: remote.data,
    columns,
    plugins: [
      FilterPlugin.configure({ disableGlobalSearch: true }),
      ColumnControlPlugin.configure({}),
    ],
    remote: remote.getRemoteOptions(),
  });

  // Fetch data from GitHub GraphQL API
  const fetchRepositories = useCallback(
    async (
      pagination: { pageIndex: number; pageSize: number },
      sorting: { id: string; desc: boolean }[],
      filters: { id: string; value: unknown }[]
    ) => {
      if (!apiToken.trim()) {
        remote.setError(
          new Error("API token is required for GitHub GraphQL API")
        );
        return;
      }

      if (!searchQuery.trim()) {
        remote.setError(new Error("Please enter a search query"));
        return;
      }

      remote.setLoading(true);
      remote.setError(null);

      try {
        const query = buildGitHubQuery(searchQuery, sorting, filters);

        const response = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
          body: JSON.stringify({
            query: SEARCH_REPOSITORIES_QUERY,
            variables: {
              query,
              first: pagination.pageSize,
              after: remote.getCursor(pagination.pageIndex - 1),
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

        // Set data with totalCount and cursor
        remote.setData(repositories, {
          totalCount: Math.min(searchResult.repositoryCount, 1000), // GitHub limits to 1000
          cursor: searchResult.pageInfo.endCursor,
        });
      } catch (err) {
        remote.setError(
          err instanceof Error ? err : new Error("Failed to fetch data")
        );
        remote.setData([], { totalCount: 0 });
      } finally {
        remote.setLoading(false);
      }
    },
    [apiToken, searchQuery, remote]
  );

  // Subscribe to table events
  useSeizenTableEvent(table, "pagination-change", (pagination) => {
    fetchRepositories(
      pagination,
      table.getSortingState(),
      table.getFilterState()
    );
  });

  useSeizenTableEvent(table, "sorting-change", (sorting) => {
    remote.clearCursors();
    table.setPageIndex(0);
    fetchRepositories(
      { pageIndex: 0, pageSize: table.getPaginationState().pageSize },
      sorting,
      table.getFilterState()
    );
  });

  useSeizenTableEvent(table, "filter-change", (filters) => {
    remote.clearCursors();
    table.setPageIndex(0);
    fetchRepositories(
      { pageIndex: 0, pageSize: table.getPaginationState().pageSize },
      table.getSortingState(),
      filters
    );
  });

  // Initial fetch when API token is set
  useEffect(() => {
    if (apiToken.trim() && searchQuery.trim()) {
      fetchRepositories(
        table.getPaginationState(),
        table.getSortingState(),
        table.getFilterState()
      );
    }
  }, [apiToken, searchQuery]);

  // Handle API token change
  const handleApiTokenChange = useCallback((token: string) => {
    setApiToken(token);
  }, []);

  // Handle search query change
  const handleSearchQueryChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      remote.clearCursors();
      table.setPageIndex(0);
    },
    [remote, table]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <ConfigurationPanel
        apiToken={apiToken}
        onApiTokenChange={handleApiTokenChange}
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        error={remote.error?.message ?? null}
      />

      {/* Table */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <SeizenTable table={table} loading={remote.loading} />
      </div>
    </div>
  );
}
