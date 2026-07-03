function FeaturePanel({ latestCandle }) {

  if (!latestCandle) return null;

  const getMarketRegime = () => {

    if (
      latestCandle.ema20 >
      latestCandle.ema200
    ) {
      return "BULLISH TREND";
    }

    if (
      latestCandle.ema20 <
      latestCandle.ema200
    ) {
      return "BEARISH TREND";
    }

    return "SIDEWAYS";
  };

  const getSignal = () => {

    if (
      latestCandle.ema20 >
      latestCandle.ema200 &&
      latestCandle.rsi > 55
    ) {
      return "LONG";
    }

    if (
      latestCandle.ema20 <
      latestCandle.ema200 &&
      latestCandle.rsi < 45
    ) {
      return "SHORT";
    }

    return "WAIT";
  };

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(220px,1fr))",
        gap: "20px",
        marginBottom: "24px"
      }}
    >

      {/* RSI */}

      <div
        style={{
          backgroundColor:"#181A20",
          padding:"20px",
          borderRadius:"8px",
          border:"1px solid #2B3139"
        }}
      >

        <h3 style={{marginTop:0}}>
          RSI (14)
        </h3>

        <p
          style={{
            fontSize:"24px",
            fontWeight:"bold",

            color:
              latestCandle.rsi>70
                ? "#F6465D"
                : latestCandle.rsi<30
                ? "#0ECB81"
                : "#FCD535"
          }}
        >
          {latestCandle.rsi.toFixed(2)}
        </p>

      </div>

      {/* ATR */}

      <div
        style={{
          backgroundColor:"#181A20",
          padding:"20px",
          borderRadius:"8px",
          border:"1px solid #2B3139"
        }}
      >

        <h3 style={{marginTop:0}}>
          ATR
        </h3>

        <p
          style={{
            fontSize:"24px",
            fontWeight:"bold"
          }}
        >
          {latestCandle.atr.toFixed(2)}
        </p>

      </div>

      {/* TREND */}

      <div
        style={{
          backgroundColor:"#181A20",
          padding:"20px",
          borderRadius:"8px",
          border:"1px solid #2B3139"
        }}
      >

        <h3 style={{marginTop:0}}>
          Trend Strength
        </h3>

        <p
          style={{
            fontSize:"24px",
            fontWeight:"bold",

            color:
              latestCandle.ema_distance>0
                ? "#0ECB81"
                : "#F6465D"
          }}
        >
          {latestCandle.ema_distance.toFixed(2)}%
        </p>

      </div>

      {/* MARKET */}

      <div
        style={{
          backgroundColor:"#181A20",
          padding:"20px",
          borderRadius:"8px",
          border:"1px solid #2B3139"
        }}
      >

        <h3 style={{marginTop:0}}>
          Market Regime
        </h3>

        <p
          style={{
            fontSize:"20px",
            fontWeight:"bold",

            color:
              getMarketRegime()==="BULLISH TREND"
                ? "#0ECB81"
                : "#F6465D"
          }}
        >
          {getMarketRegime()}
        </p>

      </div>

      {/* SIGNAL */}

      <div
        style={{
          backgroundColor:"#181A20",
          padding:"20px",
          borderRadius:"8px",
          border:"1px solid #2B3139"
        }}
      >

        <h3 style={{marginTop:0}}>
          Local Signal
        </h3>

        <p
          style={{
            fontSize:"28px",
            fontWeight:"bold",

            color:
              getSignal()==="LONG"
                ? "#0ECB81"
                : getSignal()==="SHORT"
                ? "#F6465D"
                : "#FCD535"
          }}
        >
          {getSignal()}
        </p>

      </div>

      {/* VOLUME */}

      <div
        style={{
          backgroundColor:"#181A20",
          padding:"20px",
          borderRadius:"8px",
          border:"1px solid #2B3139"
        }}
      >

        <h3 style={{marginTop:0}}>
          Volume Condition
        </h3>

        <p
          style={{
            fontSize:"20px",
            fontWeight:"bold",

            color:
              latestCandle.volume >
              latestCandle.volume_ma
                ? "#0ECB81"
                : "#F6465D"
          }}
        >

          {
            latestCandle.volume >
            latestCandle.volume_ma
              ? "HIGH VOLUME"
              : "LOW VOLUME"
          }

        </p>

      </div>

    </div>

  );

}

export default FeaturePanel;