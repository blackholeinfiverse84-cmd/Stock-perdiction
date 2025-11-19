import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Legend
} from 'recharts';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import axios from 'axios';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma7: number;
  ma25: number;
}

export function TradingChart() {
  const [timeframe, setTimeframe] = useState('1H');
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [selectedAsset, setSelectedAsset] = useState('BTC/USDT');

  useEffect(() => {
    // Mock trading data - Replace with real API call
    const generateMockData = () => {
      const data: CandleData[] = [];
      let basePrice = 43000;
      
      for (let i = 30; i >= 0; i--) {
        const change = (Math.random() - 0.5) * 500;
        const open = basePrice;
        const close = basePrice + change;
        const high = Math.max(open, close) + Math.random() * 200;
        const low = Math.min(open, close) - Math.random() * 200;
        const volume = Math.random() * 1000000 + 500000;
        
        const date = new Date();
        date.setHours(date.getHours() - i);
        
        data.push({
          time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          open,
          high,
          low,
          close,
          volume,
          ma7: 0,
          ma25: 0
        });
        
        basePrice = close;
      }
      
      // Calculate moving averages
      for (let i = 0; i < data.length; i++) {
        let sum7 = 0, sum25 = 0, count7 = 0, count25 = 0;
        
        for (let j = Math.max(0, i - 6); j <= i; j++) {
          sum7 += data[j].close;
          count7++;
        }
        
        for (let j = Math.max(0, i - 24); j <= i; j++) {
          sum25 += data[j].close;
          count25++;
        }
        
        data[i].ma7 = sum7 / count7;
        data[i].ma25 = sum25 / count25;
      }
      
      return data;
    };

    setChartData(generateMockData());
    
    // Update data every 10 seconds
    const interval = setInterval(() => {
      setChartData(generateMockData());
    }, 10000);
    
    return () => clearInterval(interval);
  }, [timeframe, selectedAsset]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPositive = data.close >= data.open;
      
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-slate-300 text-xs mb-2">{data.time}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Open:</span>
              <span className="text-white">${data.open.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">High:</span>
              <span className="text-green-400">${data.high.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Low:</span>
              <span className="text-red-400">${data.low.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Close:</span>
              <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                ${data.close.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t border-slate-700">
              <span className="text-slate-400">Volume:</span>
              <span className="text-blue-400">{(data.volume / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const Candle = (props: any) => {
    const { x, y, width, height, open, close, high, low } = props;
    const isPositive = close >= open;
    const color = isPositive ? '#22c55e' : '#ef4444';
    const wickX = x + width / 2;
    
    return (
      <g>
        {/* High-Low wick */}
        <line
          x1={wickX}
          y1={y}
          x2={wickX}
          y2={y + height}
          stroke={color}
          strokeWidth={1}
        />
        {/* Body */}
        <rect
          x={x}
          y={isPositive ? y + height * 0.3 : y}
          width={width}
          height={Math.abs(height * 0.7)}
          fill={color}
          opacity={0.8}
        />
      </g>
    );
  };

  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].close : 0;
  const priceChange = chartData.length > 1 
    ? chartData[chartData.length - 1].close - chartData[chartData.length - 2].close 
    : 0;
  const priceChangePercent = chartData.length > 1
    ? (priceChange / chartData[chartData.length - 2].close) * 100
    : 0;

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800/50 bg-slate-800/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-500" />
            <div>
              <h2 className="text-white">{selectedAsset}</h2>
              <p className="text-sm text-slate-400">Technical Analysis</p>
            </div>
          </div>
          
          {/* Asset Selector */}
          <div className="flex gap-2">
            {['BTC/USDT', 'ETH/USDT', 'SPX'].map((asset) => (
              <button
                key={asset}
                onClick={() => setSelectedAsset(asset)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  selectedAsset === asset
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                }`}
              >
                {asset}
              </button>
            ))}
          </div>
        </div>

        {/* Price Info */}
        <div className="flex items-center gap-4">
          <div>
            <div className="text-2xl text-white">
              ${currentPrice.toFixed(2)}
            </div>
            <div className={`text-sm flex items-center gap-1 ${
              priceChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              <TrendingUp className={`w-4 h-4 ${priceChange < 0 ? 'rotate-180' : ''}`} />
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="ml-auto flex gap-1 bg-slate-800/50 rounded-lg p-1">
            {['15M', '1H', '4H', '1D'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  timeframe === tf
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="price" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="price">Price Action</TabsTrigger>
            <TabsTrigger value="indicators">Indicators</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
          </TabsList>

          {/* Price Action Chart */}
          <TabsContent value="price" className="mt-4">
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickLine={{ stroke: '#334155' }}
                />
                <YAxis 
                  domain={['dataMin - 100', 'dataMax + 100']}
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickLine={{ stroke: '#334155' }}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
                <Line
                  type="monotone"
                  dataKey="ma7"
                  stroke="#22c55e"
                  strokeWidth={1.5}
                  dot={false}
                  name="MA 7"
                />
                <Line
                  type="monotone"
                  dataKey="ma25"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  dot={false}
                  name="MA 25"
                />
              </ComposedChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-slate-400">Price</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-green-500"></div>
                <span className="text-slate-400">MA 7</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-orange-500"></div>
                <span className="text-slate-400">MA 25</span>
              </div>
            </div>
          </TabsContent>

          {/* Indicators Chart */}
          <TabsContent value="indicators" className="mt-4">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Price"
                />
                <Line
                  type="monotone"
                  dataKey="ma7"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  name="MA 7"
                />
                <Line
                  type="monotone"
                  dataKey="ma25"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="MA 25"
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Indicator Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                <div className="text-xs text-slate-400 mb-1">RSI (14)</div>
                <div className="text-lg text-white">64.5</div>
                <div className="text-xs text-yellow-400">Neutral</div>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                <div className="text-xs text-slate-400 mb-1">MACD</div>
                <div className="text-lg text-green-400">+125.3</div>
                <div className="text-xs text-green-400">Bullish</div>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                <div className="text-xs text-slate-400 mb-1">Bollinger</div>
                <div className="text-lg text-white">Mid</div>
                <div className="text-xs text-blue-400">Normal</div>
              </div>
            </div>
          </TabsContent>

          {/* Volume Chart */}
          <TabsContent value="volume" className="mt-4">
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="price"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <YAxis 
                  yAxisId="volume"
                  orientation="right"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  yAxisId="volume"
                  dataKey="volume"
                  fill="#3b82f6"
                  opacity={0.3}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="close"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>

            {/* Volume Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                <div className="text-xs text-slate-400 mb-1">24h Volume</div>
                <div className="text-lg text-white">$18.5M</div>
                <div className="text-xs text-green-400">+12.3%</div>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                <div className="text-xs text-slate-400 mb-1">Avg Volume</div>
                <div className="text-lg text-white">$750K</div>
                <div className="text-xs text-slate-400">Per hour</div>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                <div className="text-xs text-slate-400 mb-1">Volume Trend</div>
                <div className="text-lg text-green-400">↑ High</div>
                <div className="text-xs text-green-400">Above average</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}