import requests
import pandas as pd
import time
import os

BASE_URL = "https://api.india.delta.exchange"
DATA_FOLDER = "dataset"
CSV_FILE = f"{DATA_FOLDER}/HUSD_5m.csv"

# =========================
# CREATE DATASET FOLDER
# =========================
os.makedirs(DATA_FOLDER, exist_ok=True)

# =========================
# DOWNLOAD FUNCTION
# =========================
def download_deep_data(days_to_fetch=90):
    symbol = "HUSD"
    resolution = "15m"
    limit = 1000  # Max safe amount of candles per API request

    # CALCULATE TIMESTAMPS
    end_time = int(time.time())
    start_time = end_time - (days_to_fetch * 24 * 60 * 60)

    all_candles = []
    current_end = end_time

    print(f"Fetching {days_to_fetch} days of historical data...")

    # =========================
    # PAGINATION LOOP
    # =========================
    while current_end > start_time:
        # Calculate start time for this specific chunk
        chunk_start = max(start_time, current_end - (15 * 60 * limit))

        params = {
            "resolution": resolution,
            "symbol": symbol,
            "start": chunk_start,
            "end": current_end
        }

        try:
            response = requests.get(
                f"{BASE_URL}/v2/history/candles", 
                params=params, 
                timeout=10
            )
            response.raise_for_status()
            res_json = response.json()

            if "result" not in res_json or not res_json["result"]:
                print("Reached end of available data on Delta.")
                break

            data = res_json["result"]
            all_candles.extend(data)

            print(f"Fetched {len(data)} candles... Going deeper...")

            # Move the 'end' time backward for the next loop
            current_end = chunk_start - 1
            
            # Anti-ban: Sleep for half a second to respect API rate limits
            time.sleep(0.5)

        except Exception as e:
            print(f"Error fetching data chunk: {e}")
            break

    # =========================
    # PROCESS DATA
    # =========================
    if not all_candles:
        print("No new data fetched.")
        return

    df = pd.DataFrame(all_candles)

    # CLEAN NUMERIC TYPES
    numeric_cols = ["open", "high", "low", "close", "volume"]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # =========================
    # APPEND & CLEANUP
    # =========================
    if os.path.exists(CSV_FILE):
        old_df = pd.read_csv(CSV_FILE)
        df = pd.concat([old_df, df])

    # Remove overlapping candles fetched at the edges of chunks
    df = df.drop_duplicates(subset=["time"])
    
    # Sort from Oldest -> Newest (Crucial for Backtester!)
    df = df.sort_values("time", ascending=True)

    # Save to CSV
    df.to_csv(CSV_FILE, index=False)
    print(f"✅ Success! Dataset now has {len(df)} total candles.")

# =========================
# RUN
# =========================
if __name__ == "__main__":
    # You can change 90 to 180 or 365 to fetch 6 or 12 months!
    download_deep_data(days_to_fetch=90)