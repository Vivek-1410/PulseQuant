function SignalPanel({ signalData }) {

  if (!signalData) return null;

  return (

    <div
      style={{
        backgroundColor: "#181A20",
        padding: "24px",
        borderRadius: "8px",
        border: "1px solid #2B3139",
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
              margin: 0,

              color:
                signalData.signal === "LONG"
                  ? "#0ECB81"
                  : signalData.signal === "SHORT"
                  ? "#F6465D"
                  : "#FCD535"
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

        {/* MARKET REGIME */}

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

        <h3>
          Reasoning
        </h3>

        <ul>

          {signalData.reason.map((item, index) => (

            <li key={index}>
              {item}
            </li>

          ))}

        </ul>

      </div>

    </div>

  );

}

export default SignalPanel;