from flask import Flask
from flask_cors import CORS

import pandas as pd

from market_data.ticker import get_btc_ticker
from market_data.candles import get_candles
from strategy.backtest import run_backtest

from strategy.signals import generate_signal

app = Flask(__name__)

CORS(app)

# =========================
# HOME
# =========================

@app.route("/")
def home():

    return {
        "message": "Trading Bot Backend Running"
    }

# =========================
# TICKER
# =========================

@app.route("/ticker")
def ticker():

    return get_btc_ticker()

# =========================
# CANDLES
# =========================

@app.route("/candles")
def candles():

    return get_candles()

# =========================
# SIGNAL
# =========================

@app.route("/signal")
def signal():

    candles = get_candles()

    df = pd.DataFrame(candles)

    return generate_signal(df)

@app.route("/backtest")
def backtest():

    return run_backtest()

# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":

    app.run(debug=True)