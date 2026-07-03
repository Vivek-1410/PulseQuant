import useBacktest from "../hooks/useBacktest";
import BacktestSummary from "../components/BacktestSummary";
import TradeTable from "../components/TradeTable";

function Backtest() {

    const {

        summary,

        loading

    } = useBacktest();

    if (loading) {

        return <h1>Loading...</h1>;

    }

    return (

        <div>

            <h1>Backtest Results</h1>

            <BacktestSummary
                summary={summary}
            />

            <h2
                style={{
                    marginBottom: "20px"
                }}
            >
                Trade History
            </h2>

            {summary.trades && summary.trades.length > 0 ? (

                <TradeTable trades={summary.trades} />

            ) : (

                <p>No trades found.</p>

            )}

        </div>

    );

}

export default Backtest;