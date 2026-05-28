import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  LineSeries
} from "lightweight-charts";

function BTCChart({ candles }) {
  // References to keep the chart instance alive across renders
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const ema20SeriesRef = useRef(null);
  const ema200SeriesRef = useRef(null);
  
  // Track if we need to auto-fit the zoom
  const isFirstLoad = useRef(true);

  // ==========================================
  // 1. INITIALIZE CHART (Runs ONLY once on mount)
  // ==========================================
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create the chart instance
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 600,
      layout: {
        background: { color: "#181A20" }, // Matched to modern terminal UI
        textColor: "#EAECEF"
      },
      grid: {
        vertLines: { color: "#2B3139" },
        horzLines: { color: "#2B3139" }
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: "#2B3139" },
      timeScale: {
        borderColor: "#2B3139",
        timeVisible: true,
        secondsVisible: false
      },
      handleScroll: true,
      handleScale: true
    });

    // Add Series and save references
    candleSeriesRef.current = chart.addSeries(CandlestickSeries);
    
    ema20SeriesRef.current = chart.addSeries(LineSeries, {
      color: "#00ff99",
      lineWidth: 2
    });
    
    ema200SeriesRef.current = chart.addSeries(LineSeries, {
      color: "#ff4444",
      lineWidth: 2
    });

    chartRef.current = chart;

    // Handle Window Resize seamlessly
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
    };
  }, []); // <-- Empty dependency array ensures this NEVER runs on data updates


  // ==========================================
  // 2. UPDATE DATA (Runs whenever 'candles' changes)
  // ==========================================
  useEffect(() => {
    if (!candles || candles.length === 0 || !chartRef.current) return;

    // Fast mapping (Single pass instead of multiple heavy filters/sorts)
    const formattedCandles = [];
    const formattedEMA20 = [];
    const formattedEMA200 = [];

    // Lightweight charts requires strictly ascending time order
    const sortedData = [...candles].sort((a, b) => Number(a.time) - Number(b.time));

    sortedData.forEach((candle) => {
      const time = Number(candle.time);
      
      formattedCandles.push({
        time,
        open: Number(candle.open),
        high: Number(candle.high),
        low: Number(candle.low),
        close: Number(candle.close)
      });

      formattedEMA20.push({ time, value: Number(candle.ema20) });
      formattedEMA200.push({ time, value: Number(candle.ema200) });
    });

    // Push new data to the existing chart instance (preserves zoom state!)
    candleSeriesRef.current.setData(formattedCandles);
    ema20SeriesRef.current.setData(formattedEMA20);
    ema200SeriesRef.current.setData(formattedEMA200);

    // Auto-fit content ONLY on the very first data load
    if (isFirstLoad.current) {
      chartRef.current.timeScale().fitContent();
      isFirstLoad.current = false;
    }

  }, [candles]); // <-- This runs every 5 seconds, but only touches the data

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: "100%",
        marginTop: "10px"
      }}
    />
  );
}

export default BTCChart;