export const LocationCell = ({ location }: { location: string }) => (
  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
    <span>📍</span>
    {location}
  </span>
);
