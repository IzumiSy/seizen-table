export const DateCell = ({ date }: { date: string }) => {
  const formatted = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return <span style={{ color: "#6b7280" }}>{formatted}</span>;
};
