import useMarketData from "../hooks/useMarketData";

import Header from "../components/Header";
import TickerBar from "../components/TickerBar";
import FeaturePanel from "../components/FeaturePanel";
import SignalPanel from "../components/SignalPanel";
import ChartPanel from "../components/ChartPanel";

function Dashboard() {

    const {
        ticker,
        candles,
        signalData,
        loading
    } = useMarketData();

    const latestCandle =
        candles.length > 0
            ? candles[candles.length - 1]
            : null;

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

    const getMarketRegime = () => {

        if (!latestCandle)
            return "UNKNOWN";

        if (latestCandle.ema20 > latestCandle.ema200)
            return "BULLISH TREND";

        if (latestCandle.ema20 < latestCandle.ema200)
            return "BEARISH TREND";

        return "SIDEWAYS";
    };

    const getSignal = () => {

        if (!latestCandle)
            return "WAIT";

        if (
            latestCandle.ema20 > latestCandle.ema200 &&
            latestCandle.rsi > 55
        )
            return "LONG";

        if (
            latestCandle.ema20 < latestCandle.ema200 &&
            latestCandle.rsi < 45
        )
            return "SHORT";

        return "WAIT";
    };

    return (

        <div
            style={{
                backgroundColor:"#0B0E11",
                color:"#EAECEF",
                minHeight:"100vh"
            }}
        >

            <Header loading={loading} />

            <main
                style={{
                    padding:"24px",
                    maxWidth:"1600px",
                    margin:"0 auto"
                }}
            >

                <TickerBar
                    ticker={ticker}
                    formatCurrency={formatCurrency}
                />

                <FeaturePanel
                    latestCandle={latestCandle}
                    getSignal={getSignal}
                    getMarketRegime={getMarketRegime}
                />

                <SignalPanel
                    signalData={signalData}
                />

                <ChartPanel
                    loading={loading}
                    candles={candles}
                />

            </main>

        </div>

    );
}

export default Dashboard;