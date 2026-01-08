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
