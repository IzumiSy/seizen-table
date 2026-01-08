export const SalaryCell = ({ salary }: { salary: number }) => (
  <span style={{ fontFamily: "monospace", fontWeight: 500 }}>
    ${salary.toLocaleString()}
  </span>
);
