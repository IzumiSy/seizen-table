interface DemoPreviewProps {
  demo: string;
  height?: number;
}

export function DemoPreview({ demo, height = 400 }: DemoPreviewProps) {
  const baseUrl = import.meta.env.DEV
    ? "http://localhost:5184"
    : "/seizen-ui/demos";

  return (
    <iframe
      src={`${baseUrl}/?embed#/${demo}`}
      style={{
        width: "100%",
        height: `${height}px`,
        border: "none",
        marginBlock: "1rem",
      }}
    />
  );
}
