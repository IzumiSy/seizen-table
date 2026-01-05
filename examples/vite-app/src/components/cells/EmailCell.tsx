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
