import type { FC } from "react";
import { BasicDemo } from "./components/BasicDemo";
import { FilterDemo } from "./components/FilterDemo";
import { ColumnControlDemo } from "./components/ColumnControlDemo";
import { DataExportDemo } from "./components/DataExportDemo";
import { RowDetailDemo } from "./components/RowDetailDemo";
import { FullDemo } from "./components/FullDemo";

const demos: Record<string, FC> = {
  basic: BasicDemo,
  filter: FilterDemo,
  "column-control": ColumnControlDemo,
  "data-export": DataExportDemo,
  "row-detail": RowDetailDemo,
  full: FullDemo,
};

function getDemo(): string {
  const hash = window.location.hash.slice(1);
  if (hash && demos[hash]) return hash;

  const params = new URLSearchParams(window.location.search);
  const demo = params.get("demo");
  if (demo && demos[demo]) return demo;

  return "basic";
}

export function App() {
  const demoName = getDemo();
  const DemoComponent = demos[demoName];

  return (
    <div style={{ padding: "1rem" }}>
      <DemoComponent />
    </div>
  );
}
