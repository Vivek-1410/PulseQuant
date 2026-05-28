import { useEffect, useState, useCallback } from "react";

import BTCChart from "./charts/BTCChart";

// =========================
// REUSABLE STAT BOX
// =========================

const StatBox = ({
  label,
  value,
  valueColor = "#EAECEF"
}) => (

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

// =========================
// APP
// =========================

function App() {

  const [ticker, setTicker] = useState(null);

  const [candles, setCandles] = useState([]);

  const [signalData, setSignalData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // LATEST CANDLE
  // =========================

  const latestCandle =
    candles.length > 0
      ? candles[candles.length - 1]
      : null;

  // =========================
  // MARKET REGIME
  // =========================

  const getMarketRegime = () => {

    if (!latestCandle)
      return "UNKNOWN";

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

  // =========================
  // SIGNAL ENGINE
  // =========================

  const getSignal = () => {

    if (!latestCandle)
      return "WAIT";

    if (
      latestCandle.ema20 >
      latestCandle.ema200
      &&
      latestCandle.rsi > 55
    ) {
      return "LONG";
    }

    if (
      latestCandle.ema20 <
      latestCandle.ema200
      &&
      latestCandle.rsi < 45
    ) {
      return "SHORT";
    }

    return "WAIT";
  };

  // =========================
  // FETCH DATA
  // =========================

  const fetchData = useCallback(
    async (isInitial = false) => {

      if (isInitial)
        setLoading(true);

      try {

        const [
          tickerRes,
          candlesRes,
          signalRes
        ] = await Promise.all([

          fetch(
            "http://127.0.0.1:5000/ticker"
          ),

          fetch(
            "http://127.0.0.1:5000/candles"
          ),

          fetch(
            "http://127.0.0.1:5000/signal"
          )
        ]);

        const tickerData =
          await tickerRes.json();

        const candlesData =
          await candlesRes.json();

        const signal =
          await signalRes.json();

        setTicker(tickerData);

        setCandles(candlesData);

        setSignalData(signal);

      } catch (error) {

        console.error(
          "Data Fetch Error:",
          error
        );

      } finally {

        if (isInitial)
          setLoading(false);
      }
    },
    []
  );

  // =========================
  // POLLING
  // =========================

  useEffect(() => {

    fetchData(true);

    const interval =
      setInterval(() => {

        fetchData(false);

      }, 5000);

    return () =>
      clearInterval(interval);

  }, [fetchData]);

  // =========================
  // FORMATTERS
  // =========================

  const formatCurrency = (val) => {

    if (!val) return "--";

    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD"
      }
    ).format(val);
  };

  // =========================
  // UI
  // =========================

  return (

    <div
      style={{
        backgroundColor: "#0B0E11",
        color: "#EAECEF",
        minHeight: "100vh",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      }}
    >

      {/* HEADER */}

      <header
        style={{
          padding: "16px 24px",
          backgroundColor: "#181A20",
          borderBottom:
            "1px solid #2B3139",

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center"
        }}
      >

        <h1
          style={{
            margin: 0,
            fontSize: "20px",
            color: "#FCD535"
          }}
        >
          ⚡ Delta Bot Dashboard
        </h1>

        {loading && (

          <span
            style={{
              color: "#FCD535",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            Connecting to market...
          </span>
        )}

      </header>

      {/* MAIN */}

      <main
        style={{
          padding: "24px",
          maxWidth: "1600px",
          margin: "0 auto"
        }}
      >

        {/* TICKER BAR */}

        {ticker && (

          <div
            style={{
              display: "flex",
              gap: "32px",
              padding: "20px 24px",
              backgroundColor:
                "#181A20",

              borderRadius: "8px",

              border:
                "1px solid #2B3139",

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
                {formatCurrency(
                  ticker.price
                )}
              </span>

            </div>

            {/* DIVIDER */}

            <div
              style={{
                width: "1px",
                height: "40px",
                backgroundColor:
                  "#2B3139"
              }}
            />

            {/* METRICS */}

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
                value={formatCurrency(
                  ticker.mark_price
                )}
              />

              <StatBox
                label="Best Bid"
                value={formatCurrency(
                  ticker.best_bid
                )}
                valueColor="#0ECB81"
              />

              <StatBox
                label="Best Ask"
                value={formatCurrency(
                  ticker.best_ask
                )}
                valueColor="#F6465D"
              />

              <StatBox
                label="Funding Rate"
                value={
                  ticker.funding_rate
                    ? `${(
                        ticker.funding_rate *
                        100
                      ).toFixed(4)}%`
                    : "--"
                }
                valueColor="#FCD535"
              />

              <StatBox
                label="24h Volume"
                value={
                  ticker.volume
                    ? Number(
                        ticker.volume
                      ).toLocaleString()
                    : "--"
                }
              />

              <StatBox
                label="Open Interest"
                value={
                  ticker.open_interest
                    ? Number(
                        ticker.open_interest
                      ).toLocaleString()
                    : "--"
                }
              />

            </div>

          </div>
        )}

        {/* FEATURE PANEL */}

        {latestCandle && (

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",

              gap: "20px",

              marginBottom: "24px"
            }}
          >

            {/* RSI */}

            <div
              style={{
                backgroundColor:
                  "#181A20",

                padding: "20px",

                borderRadius: "8px",

                border:
                  "1px solid #2B3139"
              }}
            >

              <h3 style={{ marginTop: 0 }}>
                RSI (14)
              </h3>

              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",

                  color:
                    latestCandle.rsi > 70
                      ? "#F6465D"
                      : latestCandle.rsi < 30
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
                backgroundColor:
                  "#181A20",

                padding: "20px",

                borderRadius: "8px",

                border:
                  "1px solid #2B3139"
              }}
            >

              <h3 style={{ marginTop: 0 }}>
                ATR
              </h3>

              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold"
                }}
              >
                {latestCandle.atr.toFixed(2)}
              </p>

            </div>

            {/* TREND STRENGTH */}

            <div
              style={{
                backgroundColor:
                  "#181A20",

                padding: "20px",

                borderRadius: "8px",

                border:
                  "1px solid #2B3139"
              }}
            >

              <h3 style={{ marginTop: 0 }}>
                Trend Strength
              </h3>

              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",

                  color:
                    latestCandle.ema_distance > 0
                      ? "#0ECB81"
                      : "#F6465D"
                }}
              >
                {latestCandle.ema_distance.toFixed(2)}%
              </p>

            </div>

            {/* MARKET REGIME */}

            <div
              style={{
                backgroundColor:
                  "#181A20",

                padding: "20px",

                borderRadius: "8px",

                border:
                  "1px solid #2B3139"
              }}
            >

              <h3 style={{ marginTop: 0 }}>
                Market Regime
              </h3>

              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",

                  color:
                    getMarketRegime() ===
                    "BULLISH TREND"
                      ? "#0ECB81"
                      : "#F6465D"
                }}
              >
                {getMarketRegime()}
              </p>

            </div>

            {/* LOCAL SIGNAL */}

            <div
              style={{
                backgroundColor:
                  "#181A20",

                padding: "20px",

                borderRadius: "8px",

                border:
                  "1px solid #2B3139"
              }}
            >

              <h3 style={{ marginTop: 0 }}>
                Local Signal
              </h3>

              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",

                  color:
                    getSignal() === "LONG"
                      ? "#0ECB81"
                      : getSignal() === "SHORT"
                      ? "#F6465D"
                      : "#FCD535"
                }}
              >
                {getSignal()}
              </p>

            </div>

            {/* VOLUME CONDITION */}

            <div
              style={{
                backgroundColor:
                  "#181A20",

                padding: "20px",

                borderRadius: "8px",

                border:
                  "1px solid #2B3139"
              }}
            >

              <h3 style={{ marginTop: 0 }}>
                Volume Condition
              </h3>

              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",

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
        )}

        {/* STRATEGY ENGINE */}

        {signalData && (

          <div
            style={{
              backgroundColor: "#181A20",

              padding: "24px",

              borderRadius: "8px",

              border:
                "1px solid #2B3139",

              marginBottom: "24px"
            }}
          >

            <h2
              style={{
                marginTop: 0,
                marginBottom: "20px"
              }}
            >
              Strategy Engine
            </h2>

            <div
              style={{
                display: "flex",
                gap: "40px",
                flexWrap: "wrap"
              }}
            >

              {/* SIGNAL */}

              <div>

                <p
                  style={{
                    color: "#848E9C"
                  }}
                >
                  Signal
                </p>

                <h1
                  style={{
                    color:
                      signalData.signal === "LONG"
                        ? "#0ECB81"
                        : signalData.signal === "SHORT"
                        ? "#F6465D"
                        : "#FCD535",

                    margin: 0
                  }}
                >
                  {signalData.signal}
                </h1>

              </div>

              {/* CONFIDENCE */}

              <div>

                <p
                  style={{
                    color: "#848E9C"
                  }}
                >
                  Confidence
                </p>

                <h1
                  style={{
                    margin: 0
                  }}
                >
                  {signalData.confidence}%
                </h1>

              </div>

              {/* REGIME */}

              <div>

                <p
                  style={{
                    color: "#848E9C"
                  }}
                >
                  Market Regime
                </p>

                <h1
                  style={{
                    margin: 0
                  }}
                >
                  {signalData.market_regime}
                </h1>

              </div>

            </div>

            {/* REASONING */}

            <div
              style={{
                marginTop: "24px"
              }}
            >

              <h3>Reasoning</h3>

              <ul>

                {signalData.reason.map(
                  (item, index) => (

                    <li key={index}>
                      {item}
                    </li>
                  )
                )}

              </ul>

            </div>

          </div>
        )}

        {/* CHART */}

        <div
          style={{
            backgroundColor: "#181A20",

            padding: "16px",

            borderRadius: "8px",

            border:
              "1px solid #2B3139",

            minHeight: "600px"
          }}
        >

          {!loading &&
          candles.length === 0 ? (

            <div
              style={{
                display: "flex",

                justifyContent:
                  "center",

                alignItems:
                  "center",

                height: "600px",

                color: "#848E9C"
              }}
            >
              Waiting for chart data...
            </div>

          ) : (

            <BTCChart candles={candles} />
          )}

        </div>

      </main>

    </div>
  );
}

export default App;