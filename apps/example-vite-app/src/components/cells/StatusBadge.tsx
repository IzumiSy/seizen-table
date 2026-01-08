import type { Person } from "../../data";

export const StatusBadge = ({ status }: { status: Person["status"] }) => {
  const styles: Record<Person["status"], { bg: string; text: string }> = {
    active: { bg: "#dcfce7", text: "#166534" },
    inactive: { bg: "#fee2e2", text: "#991b1b" },
    "on-leave": { bg: "#fef3c7", text: "#92400e" },
  };
  const style = styles[status];
  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.text,
        padding: "2px 8px",
        borderRadius: "9999px",
        fontSize: "12px",
        fontWeight: 500,
      }}
    >
      {status === "on-leave"
        ? "On Leave"
        : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
