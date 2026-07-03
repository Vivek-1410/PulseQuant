function Card({ title, value, color = "#fff" }) {
  return (
    <div
      style={{
        background: "#181A20",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #2B3139",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}
    >
      <span
        style={{
          color: "#848E9C",
          fontSize: "14px"
        }}
      >
        {title}
      </span>

      <span
        style={{
          color,
          fontSize: "28px",
          fontWeight: "bold"
        }}
      >
        {value}
      </span>
    </div>
  );
}

function BacktestSummary({ summary }) {

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}
    >

      <Card
        title="Net Profit"
        value={`$${summary.net_profit}`}
        color={
          summary.net_profit >= 0
            ? "#0ECB81"
            : "#F6465D"
        }
      />

      <Card
        title="Win Rate"
        value={`${summary.win_rate}%`}
      />

      <Card
        title="Trades"
        value={summary.total_trades}
      />

      <Card
        title="Fees"
        value={`$${summary.fees}`}
      />

      <Card
        title="Wins"
        value={summary.wins}
        color="#0ECB81"
      />

      <Card
        title="Losses"
        value={summary.losses}
        color="#F6465D"
      />

    </div>

  );

}

export default BacktestSummary;