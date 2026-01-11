import type { ReactNode } from "react";
import { SidepanelSlotRenderer } from "../../plugin/SlotRenderer";
import * as styles from "../styles.css";

export interface DataTableContentProps {
  /**
   * Child components (DataTable.Table, DataTable.Pagination, or custom elements)
   */
  children: ReactNode;
}

/**
 * Main content container that arranges children vertically.
 *
 * This component handles the layout between sidepanels and main content area,
 * allowing you to compose Table, Pagination, and other elements freely.
 *
 * @example
 * ```tsx
 * <DataTable.Root table={table}>
 *   <DataTable.Content>
 *     <DataTable.Table>
 *       <DataTable.Header table={table} />
 *       <DataTable.Body table={table} />
 *     </DataTable.Table>
 *     <DataTable.Pagination table={table} />
 *   </DataTable.Content>
 * </DataTable.Root>
 * ```
 *
 * @example With custom elements
 * ```tsx
 * <DataTable.Root table={table}>
 *   <DataTable.Content>
 *     <div className="custom-toolbar">Toolbar</div>
 *     <DataTable.Table>...</DataTable.Table>
 *     <DataTable.Pagination table={table} />
 *   </DataTable.Content>
 * </DataTable.Root>
 * ```
 */
export function DataTableContent({ children }: DataTableContentProps) {
  return (
    <>
      {/* Left Sidepanel */}
      <SidepanelSlotRenderer position="left-sider" />

      {/* Main Content: vertical layout for table, pagination, and other elements */}
      <div className={styles.mainContent}>{children}</div>

      {/* Right Sidepanel */}
      <SidepanelSlotRenderer position="right-sider" />
    </>
  );
}
