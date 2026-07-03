function StatBox({
  label,
  value,
  valueColor = "#EAECEF"
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px"
      }}
    >
      <span
        style={{
          color: "#848E9C",
          fontSize: "12px",
          fontWeight: "500"
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: valueColor,
          fontSize: "15px",
          fontWeight: "600"
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default StatBox;