# PulseQuant

PulseQuant is a quantitative crypto trading research platform built using Flask, React, and Python.

The project focuses on:

- real-time crypto market analytics
- technical signal generation
- historical data collection
- backtesting strategies
- quantitative trading research

---

## Features

- Live BTC futures dashboard
- Candlestick chart visualization
- EMA20 / EMA200 overlays
- RSI and ATR analytics
- Signal engine (LONG / SHORT / WAIT)
- Historical market data downloader
- CSV dataset generation
- Strategy backtesting engine
- Trade logging system
- Momentum scanner architecture

---

## Tech Stack

### Frontend

- React
- Lightweight Charts

### Backend

- Flask
- Python
- Pandas

### Quant / Analytics

- ta library
- EMA / RSI / ATR indicators
- Backtesting engine

### Data Source

- Delta Exchange API

---

## Project Structure

```bash
backend/
frontend/
dataset/
scanner/
strategy/
```

---

## Setup

### Backend

```bash
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Future Improvements

- Machine learning signal ranking
- Multi-coin momentum scanner
- Open interest analytics
- Paper trading engine
- AI-assisted trade filtering
- Live alert system

---

## Disclaimer

This project is built for educational and research purposes only.
It is not financial advice.
