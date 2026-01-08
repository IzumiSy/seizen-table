export const AvatarName = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
  ];
  const colorIndex = name.length % colors.length;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          backgroundColor: colors[colorIndex],
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: 600,
        }}
      >
        {initials}
      </div>
      <span style={{ fontWeight: 500 }}>{name}</span>
    </div>
  );
};

export const EmailCell = ({ email }: { email: string }) => (
  <a
    href={`mailto:${email}`}
    style={{
      color: "#3b82f6",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    }}
    onClick={(e) => e.stopPropagation()}
  >
    {email}
  </a>
);

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

export const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, { bg: string; text: string }> = {
    active: { bg: "#dcfce7", text: "#166534" },
    inactive: { bg: "#fee2e2", text: "#991b1b" },
  };
  const style = styles[status] || { bg: "#f3f4f6", text: "#374151" };
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
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const SalaryCell = ({ salary }: { salary: number }) => (
  <span style={{ fontFamily: "monospace", fontWeight: 500 }}>
    ${salary.toLocaleString()}
  </span>
);

export const LocationCell = ({ location }: { location: string }) => (
  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
    <span>📍</span>
    {location}
  </span>
);
