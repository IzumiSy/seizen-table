export const DepartmentBadge = ({ department }: { department: string }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    Engineering: { bg: "#dbeafe", text: "#1e40af" },
    Design: { bg: "#f3e8ff", text: "#7c3aed" },
    Marketing: { bg: "#fce7f3", text: "#be185d" },
    Sales: { bg: "#ffedd5", text: "#c2410c" },
    HR: { bg: "#d1fae5", text: "#047857" },
  };
  const style = colors[department] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.text,
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: 500,
      }}
    >
      {department}
    </span>
  );
};
