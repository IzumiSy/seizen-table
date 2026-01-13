import "@izumisy/seizen-table/styles.css";
import {
  BasicDemo,
  FilterDemo,
  ColumnControlDemo,
  DataExportDemo,
  RowDetailDemo,
  FullDemo,
  ThemingDemo,
  type DemoName,
} from "@izumisy/seizen-table-example";

interface DemoPreviewProps {
  demo: DemoName;
  height?: number;
}

const demoComponents: Record<DemoName, React.ComponentType> = {
  basic: BasicDemo,
  theming: ThemingDemo,
  filter: FilterDemo,
  "column-control": ColumnControlDemo,
  "data-export": DataExportDemo,
  "row-detail": RowDetailDemo,
  full: FullDemo,
};

export function DemoPreview({ demo, height = 400 }: DemoPreviewProps) {
  const DemoComponent = demoComponents[demo];

  if (!DemoComponent) {
    return <div>Unknown demo: {demo}</div>;
  }

  return (
    <div
      className="not-content"
      style={{
        minHeight: `${height}px`,
        marginBlock: "1rem",
      }}
    >
      <DemoComponent />
    </div>
  );
}
