import pandas as pd
from ta.trend import EMAIndicator
from ta.momentum import RSIIndicator
from ta.volatility import AverageTrueRange

# =========================
# SYSTEM PARAMETERS
# =========================
CSV_FILE = "dataset/HUSD_5m.csv"
FEE_RATE = 0.0002                       # 0.02% Limit/Maker Fee
INITIAL_BALANCE = 50.0                 # Starting Balance
RISK_PER_TRADE = 0.05               # Risk 2% of account balance per trade
MAX_LEVERAGE = 100                      

# =========================
# LOAD DATASET
# =========================
def load_dataset():
    df = pd.read_csv(CSV_FILE)
    df = df.sort_values("time", ascending=True)

    # Strategy 1 Indicators (Trend)
    df["ema20"] = EMAIndicator(close=df["close"], window=20).ema_indicator()
    df["ema200"] = EMAIndicator(close=df["close"], window=200).ema_indicator()
    df["rsi"] = RSIIndicator(close=df["close"], window=14).rsi()
    df["ema_distance"] = ((df["ema20"] - df["ema200"]) / df["ema200"]) * 100
    
    # Strategy 2 Indicators (Breakout)
    # We shift by 1 so the current close is compared to the PREVIOUS 20 candles
    df["highest_high"] = df["high"].rolling(window=20).max().shift(1)
    df["lowest_low"] = df["low"].rolling(window=20).min().shift(1)

    # Shared Indicators (Volatility & Volume)
    df["atr"] = AverageTrueRange(high=df["high"], low=df["low"], close=df["close"], window=14).average_true_range()
    df["volume_ma"] = df["volume"].rolling(window=20).mean()

    df = df.dropna()
    return df

# =========================
# BACKTEST ENGINE
# =========================
def run_backtest():
    try:
        df = load_dataset()
    except FileNotFoundError:
        print(f"⚠️ ERROR: Could not find {CSV_FILE}.")
        return []

    trades = []
    current_trade = {} 
    
    current_balance = INITIAL_BALANCE
    position = None
    entry_price = 0
    stop_loss = 0
    take_profit = 0
    qty = 0 
    
    total_fees = 0
    wins = 0
    losses = 0

    for i in range(1, len(df)):
        candle = df.iloc[i]
        prev_candle = df.iloc[i-1]

        current_close = candle["close"]
        current_high = candle["high"]
        current_low = candle["low"]
        current_volume = candle["volume"]
        
        atr = candle["atr"]
        vol_ma = candle["volume_ma"]

        # -------------------------------------
        # STRATEGY 1: EMA + RSI PULLBACK
        # -------------------------------------
        up_trend = (candle["ema20"] > candle["ema200"]) and (candle["ema_distance"] > 0.15)
        down_trend = (candle["ema20"] < candle["ema200"]) and (candle["ema_distance"] < -0.15)

        rsi_long_trigger = (prev_candle["rsi"] <= 55) and (candle["rsi"] > 55)
        rsi_short_trigger = (prev_candle["rsi"] >= 45) and (candle["rsi"] < 45)
        vol_confirm = current_volume > vol_ma

        ema_long = up_trend and rsi_long_trigger and vol_confirm
        ema_short = down_trend and rsi_short_trigger and vol_confirm

        # -------------------------------------
        # STRATEGY 2: VOLATILITY BREAKOUT
        # -------------------------------------
        # Volume must be DOUBLE the 20-period average for a valid breakout
        vol_spike = current_volume > (vol_ma * 2.0) 
        
        breakout_long = (current_close > candle["highest_high"]) and vol_spike
        breakout_short = (current_close < candle["lowest_low"]) and vol_spike

        # -------------------------------------
        # COMBINED MASTER SIGNALS (OR LOGIC)
        # -------------------------------------
        long_signal = ema_long or breakout_long
        short_signal = ema_short or breakout_short

        # Identify which strategy triggered for logging
        trigger_reason = "Unknown"
        if breakout_long or breakout_short:
            trigger_reason = "BREAKOUT"
        elif ema_long or ema_short:
            trigger_reason = "EMA_TREND"

        # =========================
        # OPEN LONG
        # =========================
        if position is None and long_signal:
            position = "LONG"
            entry_price = current_close
            stop_loss = entry_price - (atr * 1.5)
            take_profit = entry_price + (atr * 4.5)  

            sl_distance = entry_price - stop_loss
            risk_amount = current_balance * RISK_PER_TRADE
            qty = risk_amount / sl_distance
            
            max_qty = (current_balance * MAX_LEVERAGE) / entry_price
            if qty > max_qty:
                qty = max_qty

            trade_notional = qty * entry_price
            entry_fee = trade_notional * FEE_RATE
            
            current_balance -= entry_fee
            total_fees += entry_fee

            current_trade = {
                "Type": "LONG",
                "Strategy": trigger_reason,
                "Entry Time": candle["time"],
                "Entry Price": entry_price,
                "Qty (BTC)": qty,
                "Entry Fee": entry_fee
            }

        # =========================
        # OPEN SHORT
        # =========================
        elif position is None and short_signal:
            position = "SHORT"
            entry_price = current_close
            stop_loss = entry_price + (atr * 1.5)
            take_profit = entry_price - (atr * 4.5)  

            sl_distance = stop_loss - entry_price
            risk_amount = current_balance * RISK_PER_TRADE
            qty = risk_amount / sl_distance
            
            max_qty = (current_balance * MAX_LEVERAGE) / entry_price
            if qty > max_qty:
                qty = max_qty

            trade_notional = qty * entry_price
            entry_fee = trade_notional * FEE_RATE
            
            current_balance -= entry_fee
            total_fees += entry_fee

            current_trade = {
                "Type": "SHORT",
                "Strategy": trigger_reason,
                "Entry Time": candle["time"],
                "Entry Price": entry_price,
                "Qty (BTC)": qty,
                "Entry Fee": entry_fee
            }

        # =========================
        # MANAGE POSITIONS
        # =========================
        elif position == "LONG":
            hit_sl = current_low <= stop_loss
            hit_tp = current_high >= take_profit

            if hit_sl or hit_tp:
                exit_price = stop_loss if hit_sl else take_profit
                
                exit_notional = qty * exit_price
                exit_fee = exit_notional * FEE_RATE
                
                gross_pnl = (exit_price - entry_price) * qty
                net_pnl = gross_pnl - exit_fee - current_trade["Entry Fee"]
                
                current_balance += (gross_pnl - exit_fee)
                total_fees += exit_fee

                if net_pnl > 0:
                    wins += 1
                else:
                    losses += 1

                current_trade["Exit Time"] = candle["time"]
                current_trade["Exit Price"] = round(exit_price, 2)
                current_trade["Net PnL"] = round(net_pnl, 2)
                current_trade["Balance After"] = round(current_balance, 2)
                trades.append(current_trade)
                
                current_trade = {} 
                position = None

        elif position == "SHORT":
            hit_sl = current_high >= stop_loss
            hit_tp = current_low <= take_profit

            if hit_sl or hit_tp:
                exit_price = stop_loss if hit_sl else take_profit
                
                exit_notional = qty * exit_price
                exit_fee = exit_notional * FEE_RATE
                
                gross_pnl = (entry_price - exit_price) * qty
                net_pnl = gross_pnl - exit_fee - current_trade["Entry Fee"]
                
                current_balance += (gross_pnl - exit_fee)
                total_fees += exit_fee

                if net_pnl > 0:
                    wins += 1
                else:
                    losses += 1

                current_trade["Exit Time"] = candle["time"]
                current_trade["Exit Price"] = round(exit_price, 2)
                current_trade["Net PnL"] = round(net_pnl, 2)
                current_trade["Balance After"] = round(current_balance, 2)
                trades.append(current_trade)
                
                current_trade = {}
                position = None

    # =========================
    # PERFORMANCE METRICS
    # =========================
    total_trades = wins + losses
    win_rate = (wins / total_trades * 100) if total_trades > 0 else 0
    net_profit = current_balance - INITIAL_BALANCE

    print("\n=======================================")
    print("      DUAL-ENGINE BACKTEST RESULTS     ")
    print("=======================================")
    print(f" Initial Balance       : ${INITIAL_BALANCE}")
    print(f" Final Balance         : ${round(current_balance, 2)}")
    print(f" Total Net Profit      : ${round(net_profit, 2)}")
    print(f" Total Executed Trades : {total_trades}")
    print(f" Profitable Wins       : {wins}")
    print(f" Unprofitable Losses   : {losses}")
    print(f" Win Rate Percentage   : {round(win_rate, 2)}%")
    print(f" Total Fees Paid       : ${round(total_fees, 2)}")
    print("=======================================\n")

    if trades:
        trades_df = pd.DataFrame(trades)
        export_path = "dataset/trade_log.csv"
        trades_df.to_csv(export_path, index=False)
        print(f"📊 Detailed Trade Log saved to: {export_path}")

    return trades

if __name__ == "__main__":
    run_backtest()