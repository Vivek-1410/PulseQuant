import requests

BASE_URL = "https://api.india.delta.exchange"

def get_btc_ticker():

    symbol = "BTCUSD"

    url = f"{BASE_URL}/v2/tickers/{symbol}"

    response = requests.get(url)

    data = response.json()["result"]

    return {
        "symbol": data["symbol"],
        "price": data["close"],
        "mark_price": data["mark_price"],
        "funding_rate": data["funding_rate"],
        "best_bid": data["quotes"]["best_bid"],
        "best_ask": data["quotes"]["best_ask"],
        "volume": data["volume"],
        "open_interest": data["oi_contracts"]
    }