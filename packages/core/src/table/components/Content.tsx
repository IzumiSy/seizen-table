import * as styles from "../styles.css";

/**
 * Main content container that arranges children vertically.
 *
 * This is a pure layout component. Use SeizenTablePlugins.SidePanel,
 * SeizenTablePlugins.Header, and SeizenTablePlugins.Footer to add plugin content.
 */
export function TableContent({ children }: React.PropsWithChildren) {
  return <div className={styles.mainContent}>{children}</div>;
}
