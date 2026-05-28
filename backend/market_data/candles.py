import requests
import time
import pandas as pd

from ta.trend import EMAIndicator
from ta.momentum import RSIIndicator
from ta.volatility import AverageTrueRange

BASE_URL = "https://api.india.delta.exchange"

def get_candles():

    symbol = "BTCUSD"

    resolution = "15m"

    # FETCH ENOUGH CANDLES FOR EMA200 STABILITY

    end_time = int(time.time())

    start_time = end_time - (15 * 60 * 500)

    url = f"{BASE_URL}/v2/history/candles"

    params = {
        "resolution": resolution,
        "symbol": symbol,
        "start": start_time,
        "end": end_time
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        res_json = response.json()

        # VALIDATE RESPONSE

        if (
            "result" not in res_json
            or not res_json["result"]
        ):

            print(
                f"No candle data returned: {res_json}"
            )

            return []

        data = res_json["result"]

        # DATAFRAME

        df = pd.DataFrame(data)

        # CLEAN DATA TYPES

        numeric_cols = [
            "open",
            "high",
            "low",
            "close",
            "volume"
        ]

        for col in numeric_cols:

            df[col] = pd.to_numeric(
                df[col],
                errors="coerce"
            )

        # SORT CHRONOLOGICALLY

        df = df.sort_values(
            "time",
            ascending=True
        )

        # =========================
        # EMA20
        # =========================

        ema20 = EMAIndicator(
            close=df["close"],
            window=20
        )

        df["ema20"] = ema20.ema_indicator()

        # =========================
        # EMA200
        # =========================

        ema200 = EMAIndicator(
            close=df["close"],
            window=200
        )

        df["ema200"] = ema200.ema_indicator()

        # =========================
        # RSI
        # =========================

        rsi = RSIIndicator(
            close=df["close"],
            window=14
        )

        df["rsi"] = rsi.rsi()

        # =========================
        # ATR
        # =========================

        atr = AverageTrueRange(
            high=df["high"],
            low=df["low"],
            close=df["close"],
            window=14
        )

        df["atr"] = atr.average_true_range()

        # =========================
        # EMA DISTANCE (%)
        # =========================

        df["ema_distance"] = (
            (
                df["ema20"]
                - df["ema200"]
            )
            / df["ema200"]
        ) * 100

        # =========================
        # VOLUME MOVING AVERAGE
        # =========================

        df["volume_ma"] = (
            df["volume"]
            .rolling(window=20)
            .mean()
        )

        # REMOVE NaN ROWS

        df = df.dropna()

        # RETURN JSON

        return df.to_dict(
            orient="records"
        )

    except Exception as e:

        print(
            f"Error fetching candles: {e}"
        )

        return []