def generate_signal(df):

    if len(df) < 2:

        return {
            "signal": "WAIT",
            "confidence": 0,
            "reason": ["Not enough data"]
        }

    latest = df.iloc[-1]

    confidence = 0

    reasons = []

    # =========================
    # TREND
    # =========================

    bullish_trend = (
        latest["ema20"]
        >
        latest["ema200"]
    )

    bearish_trend = (
        latest["ema20"]
        <
        latest["ema200"]
    )

    # =========================
    # RSI
    # =========================

    bullish_rsi = latest["rsi"] > 55

    bearish_rsi = latest["rsi"] < 45

    # =========================
    # VOLUME
    # =========================

    high_volume = (
        latest["volume"]
        >
        latest["volume_ma"]
    )

    # =========================
    # CONFIDENCE BUILDING
    # =========================

    if bullish_trend:

        confidence += 40

        reasons.append(
            "EMA20 above EMA200"
        )

    if bullish_rsi:

        confidence += 30

        reasons.append(
            "RSI bullish momentum"
        )

    if high_volume:

        confidence += 20

        reasons.append(
            "High volume confirmation"
        )

    # =========================
    # LONG
    # =========================

    if (
        bullish_trend
        and bullish_rsi
    ):

        return {

            "signal": "LONG",

            "confidence": confidence,

            "market_regime": "BULLISH",

            "reason": reasons
        }

    # =========================
    # SHORT
    # =========================

    confidence = 0

    reasons = []

    if bearish_trend:

        confidence += 40

        reasons.append(
            "EMA20 below EMA200"
        )

    if bearish_rsi:

        confidence += 30

        reasons.append(
            "RSI bearish momentum"
        )

    if high_volume:

        confidence += 20

        reasons.append(
            "High volume confirmation"
        )

    if (
        bearish_trend
        and bearish_rsi
    ):

        return {

            "signal": "SHORT",

            "confidence": confidence,

            "market_regime": "BEARISH",

            "reason": reasons
        }

    # =========================
    # WAIT
    # =========================

    return {

        "signal": "WAIT",

        "confidence": 20,

        "market_regime": "SIDEWAYS",

        "reason": [
            "No strong confirmation"
        ]
    }