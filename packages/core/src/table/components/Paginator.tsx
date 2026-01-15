import type { SeizenTableInstance } from "../useSeizenTable";
import * as styles from "../styles.css";

export interface PaginatorProps<TData> {
  table: SeizenTableInstance<TData>;
  /**
   * Page size options to display in the dropdown
   * @default [10, 20, 50, 100]
   */
  sizeOptions?: number[];
  /**
   * Whether to show the page size selector
   * @default true
   */
  showPageSizeSelector?: boolean;
  /**
   * Whether to show page info (e.g., "1-10 of 100")
   * @default true
   */
  showPageInfo?: boolean;
}

/**
 * Paginator component for navigating through table pages
 * Displays at the bottom of the table
 */
export function Paginator<TData>({
  table,
  sizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showPageInfo = true,
}: PaginatorProps<TData>) {
  const tanstack = table._tanstackTable;
  const pageCount = tanstack.getPageCount();
  const pageIndex = tanstack.getState().pagination.pageIndex;
  const pageSize = tanstack.getState().pagination.pageSize;

  // Calculate page info
  const totalRows =
    typeof table.remote === "object"
      ? table.remote.totalRowCount
      : tanstack.getFilteredRowModel().rows.length;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  const canPreviousPage = tanstack.getCanPreviousPage();
  const canNextPage = tanstack.getCanNextPage();

  return (
    <div className={styles.paginator}>
      <div className={styles.paginatorLeft}>
        {showPageSizeSelector && (
          <div className={styles.paginatorPageSize}>
            <label htmlFor="page-size-select" className={styles.paginatorLabel}>
              Rows per page:
            </label>
            <select
              id="page-size-select"
              className={styles.paginatorSelect}
              value={pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={styles.paginatorCenter}>
        {showPageInfo && totalRows > 0 && (
          <span className={styles.paginatorInfo}>
            {startRow}-{endRow} of {totalRows}
          </span>
        )}
      </div>

      <div className={styles.paginatorRight}>
        <div className={styles.paginatorButtons}>
          <button
            className={styles.paginatorButton}
            onClick={() => tanstack.firstPage()}
            disabled={!canPreviousPage}
            aria-label="First page"
            title="First page"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 4L7 8L11 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 4V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            className={styles.paginatorButton}
            onClick={() => tanstack.previousPage()}
            disabled={!canPreviousPage}
            aria-label="Previous page"
            title="Previous page"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 4L6 8L10 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className={styles.paginatorPageNumber}>
            Page {pageIndex + 1} of {pageCount || 1}
          </span>
          <button
            className={styles.paginatorButton}
            onClick={() => tanstack.nextPage()}
            disabled={!canNextPage}
            aria-label="Next page"
            title="Next page"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={styles.paginatorButton}
            onClick={() => tanstack.lastPage()}
            disabled={!canNextPage}
            aria-label="Last page"
            title="Last page"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 4L9 8L5 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 4V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
