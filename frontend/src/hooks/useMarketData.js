import { useState, useEffect, useCallback } from "react";

import { fetchMarketData } from "../services/api";

function useMarketData() {

    const [ticker, setTicker] = useState(null);

    const [candles, setCandles] = useState([]);

    const [signalData, setSignalData] = useState(null);

    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async (initial = false) => {

        if (initial)
            setLoading(true);

        try {

            const data =
                await fetchMarketData();

            setTicker(data.ticker);

            setCandles(data.candles);

            setSignalData(data.signalData);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            if (initial)
                setLoading(false);

        }

    }, []);

    useEffect(() => {

        loadData(true);

        const interval =
            setInterval(() => {

                loadData(false);

            }, 5000);

        return () => clearInterval(interval);

    }, [loadData]);

    return {

        ticker,

        candles,

        signalData,

        loading

    };

}

export default useMarketData;