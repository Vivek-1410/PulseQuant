import StatBox from "./StatBox";

function TickerBar({ ticker, formatCurrency }) {

  if (!ticker) return null;

  return (

    <div
      style={{
        display: "flex",
        gap: "32px",
        padding: "20px 24px",
        backgroundColor: "#181A20",
        borderRadius: "8px",
        border: "1px solid #2B3139",
        marginBottom: "24px",
        flexWrap: "wrap",
        alignItems: "center"
      }}
    >

      {/* PRICE */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: "120px"
        }}
      >

        <span
          style={{
            fontSize: "22px",
            fontWeight: "bold"
          }}
        >
          {ticker.symbol}
        </span>

        <span
          style={{
            color: "#0ECB81",
            fontSize: "20px",
            fontWeight: "bold"
          }}
        >
          {formatCurrency(ticker.price)}
        </span>

      </div>

      {/* Divider */}

      <div
        style={{
          width: "1px",
          height: "40px",
          backgroundColor: "#2B3139"
        }}
      />

      {/* Metrics */}

      <div
        style={{
          display: "flex",
          gap: "32px",
          flexWrap: "wrap",
          flex: 1
        }}
      >

        <StatBox
          label="Mark Price"
          value={formatCurrency(ticker.mark_price)}
        />

        <StatBox
          label="Best Bid"
          value={formatCurrency(ticker.best_bid)}
          valueColor="#0ECB81"
        />

        <StatBox
          label="Best Ask"
          value={formatCurrency(ticker.best_ask)}
          valueColor="#F6465D"
        />

        <StatBox
          label="Funding Rate"
          value={
            ticker.funding_rate
              ? `${(ticker.funding_rate * 100).toFixed(4)}%`
              : "--"
          }
          valueColor="#FCD535"
        />

        <StatBox
          label="24h Volume"
          value={
            ticker.volume
              ? Number(ticker.volume).toLocaleString()
              : "--"
          }
        />

        <StatBox
          label="Open Interest"
          value={
            ticker.open_interest
              ? Number(ticker.open_interest).toLocaleString()
              : "--"
          }
        />

      </div>

    </div>

  );
}

export default TickerBar;