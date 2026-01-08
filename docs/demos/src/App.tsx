import { type FC } from "react";
import { HashRouter, Routes, Route, NavLink, Navigate } from "react-router";
import { BasicDemo } from "./components/BasicDemo";
import { FilterDemo } from "./components/FilterDemo";
import { ColumnControlDemo } from "./components/ColumnControlDemo";
import { DataExportDemo } from "./components/DataExportDemo";
import { RowDetailDemo } from "./components/RowDetailDemo";
import { FullDemo } from "./components/FullDemo";
import * as styles from "./styles.css";

const demos: { path: string; component: FC; title: string }[] = [
  {
    path: "basic",
    component: BasicDemo,
    title: "Basic",
  },
  {
    path: "filter",
    component: FilterDemo,
    title: "Filter",
  },
  {
    path: "column-control",
    component: ColumnControlDemo,
    title: "Column Control",
  },
  {
    path: "data-export",
    component: DataExportDemo,
    title: "Data Export",
  },
  {
    path: "row-detail",
    component: RowDetailDemo,
    title: "Row Detail",
  },
  {
    path: "full",
    component: FullDemo,
    title: "Full Demo",
  },
];

function isEmbedded(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.has("embed");
}

function DemoLayout() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h1 className={styles.sidebarTitle}>Seizen UI Demos</h1>
        <nav className={styles.nav}>
          {demos.map(({ path, title }) => (
            <NavLink
              key={path}
              to={`/${path}`}
              className={({ isActive }) =>
                `${styles.navLink}${isActive ? " active" : ""}`
              }
            >
              {title}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className={styles.main}>
        <div className={styles.demoContent}>
          <Routes>
            <Route index element={<Navigate to="/basic" replace />} />
            {demos.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Routes>
        </div>
      </main>
    </div>
  );
}

function EmbeddedView() {
  return (
    <Routes>
      <Route index element={<Navigate to="/basic" replace />} />
      {demos.map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  );
}

export function App() {
  const embed = isEmbedded();

  return <HashRouter>{embed ? <EmbeddedView /> : <DemoLayout />}</HashRouter>;
}
