import BTCChart from "../charts/BTCChart";

function ChartPanel({ loading, candles }) {

  return (

    <div
      style={{
        backgroundColor: "#181A20",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #2B3139",
        minHeight: "600px"
      }}
    >

      {
        !loading &&
        candles.length === 0 ?

        (

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "600px",
              color: "#848E9C"
            }}
          >

            Waiting for chart data...

          </div>

        )

        :

        (

          <BTCChart
            candles={candles}
          />

        )

      }

    </div>

  );

}

export default ChartPanel;