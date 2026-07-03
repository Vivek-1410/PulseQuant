const BASE_URL = "http://127.0.0.1:5000";

export async function fetchMarketData() {

    const [
        tickerRes,
        candlesRes,
        signalRes
    ] = await Promise.all([

        fetch(`${BASE_URL}/ticker`),
        fetch(`${BASE_URL}/candles`),
        fetch(`${BASE_URL}/signal`)

    ]);

    return {

        ticker: await tickerRes.json(),

        candles: await candlesRes.json(),

        signalData: await signalRes.json()

    };

}

export async function fetchBacktest(){

    const res = await fetch(
        "http://127.0.0.1:5000/backtest"
    );

    return await res.json();

}