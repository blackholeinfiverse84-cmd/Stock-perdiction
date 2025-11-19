import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import axios from 'axios';

interface Prediction {
  id: string;
  asset: string;
  symbol: string;
  direction: 'long' | 'short';
  confidence: number;
  entryPrice: number;
  timestamp: string;
  timeframe: string;
}

export function LivePredictionsFeed() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    // Mock API call to /feed/live
    const fetchPredictions = async () => {
      try {
        // In production, replace with: await axios.get('/feed/live')
        const mockData: Prediction[] = [
          {
            id: '1',
            asset: 'Bitcoin',
            symbol: 'BTC/USDT',
            direction: 'long',
            confidence: 87.5,
            entryPrice: 43250.50,
            timestamp: new Date().toISOString(),
            timeframe: '15m'
          },
          {
            id: '2',
            asset: 'Ethereum',
            symbol: 'ETH/USDT',
            direction: 'short',
            confidence: 82.3,
            entryPrice: 2285.75,
            timestamp: new Date(Date.now() - 120000).toISOString(),
            timeframe: '5m'
          },
          {
            id: '3',
            asset: 'S&P 500',
            symbol: 'SPX',
            direction: 'long',
            confidence: 75.8,
            entryPrice: 4521.30,
            timestamp: new Date(Date.now() - 240000).toISOString(),
            timeframe: '1h'
          }
        ];
        setPredictions(mockData);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
    };

    fetchPredictions();
    const interval = setInterval(fetchPredictions, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800/50 bg-slate-800/30">
        <h2 className="text-white flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          Live Predictions
        </h2>
        <p className="text-sm text-slate-400 mt-1">Real-time AI signals</p>
      </div>

      <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {predictions.map((prediction) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              layout
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white">{prediction.asset}</span>
                    <span className="text-xs text-slate-400">{prediction.symbol}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{prediction.timeframe}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                  prediction.direction === 'long' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {prediction.direction === 'long' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm uppercase">{prediction.direction}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Entry Price</span>
                  <span className="text-white">${prediction.entryPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Confidence</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full ${
                          prediction.confidence >= 80 ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-white">{prediction.confidence}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
