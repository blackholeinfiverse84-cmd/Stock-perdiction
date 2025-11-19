import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, CheckCircle2, XCircle, Clock, Zap } from 'lucide-react';
import { Badge } from './ui/badge';

interface ExecutionEvent {
  id: string;
  timestamp: string;
  type: 'entry' | 'exit' | 'analysis' | 'alert';
  status: 'success' | 'pending' | 'failed';
  asset: string;
  action: string;
  details: string;
  price?: number;
  pnl?: number;
}

export function ExecutionConsole() {
  const [events, setEvents] = useState<ExecutionEvent[]>([]);

  useEffect(() => {
    // Mock execution events
    const mockEvents: ExecutionEvent[] = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        type: 'entry',
        status: 'success',
        asset: 'BTC/USDT',
        action: 'LONG Entry Executed',
        details: 'AI model confidence 87.5% - Entered long position at support level',
        price: 43250.50,
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        type: 'analysis',
        status: 'pending',
        asset: 'ETH/USDT',
        action: 'Signal Analysis',
        details: 'Monitoring RSI divergence, awaiting confirmation',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        type: 'exit',
        status: 'success',
        asset: 'SPX',
        action: 'Target Reached',
        details: 'Closed position at 5% profit target',
        price: 4550.20,
        pnl: 226.01,
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 480000).toISOString(),
        type: 'alert',
        status: 'failed',
        asset: 'AAPL',
        action: 'Entry Rejected',
        details: 'Market conditions outside acceptable risk parameters',
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        type: 'entry',
        status: 'success',
        asset: 'EUR/USD',
        action: 'SHORT Entry Executed',
        details: 'Resistance rejection pattern confirmed - 82.3% confidence',
        price: 1.0735,
      },
    ];

    setEvents(mockEvents);

    // Simulate new events
    const interval = setInterval(() => {
      const newEvent: ExecutionEvent = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: ['entry', 'analysis', 'alert'][Math.floor(Math.random() * 3)] as any,
        status: ['success', 'pending'][Math.floor(Math.random() * 2)] as any,
        asset: ['BTC/USDT', 'ETH/USDT', 'SPX', 'AAPL'][Math.floor(Math.random() * 4)],
        action: 'New AI Decision',
        details: 'Processing market data and technical indicators',
      };
      setEvents(prev => [newEvent, ...prev].slice(0, 10));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'entry':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'exit':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'analysis':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'alert':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-slate-800/50 bg-slate-800/30">
        <h2 className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-500" />
          Execution Console
        </h2>
        <p className="text-sm text-slate-400 mt-1">AI decision log & trade execution</p>
      </div>

      <div className="p-4 space-y-3 h-[calc(100vh-220px)] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getStatusIcon(event.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white">{event.action}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getTypeColor(event.type)}`}
                      >
                        {event.type.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-blue-400">{event.asset}</span>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed mb-3">
                    {event.details}
                  </p>

                  {(event.price || event.pnl !== undefined) && (
                    <div className="flex items-center gap-4 pt-2 border-t border-slate-700/50">
                      {event.price && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Price:</span>
                          <span className="text-sm text-white">${event.price.toLocaleString()}</span>
                        </div>
                      )}
                      {event.pnl !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">P&L:</span>
                          <span className={`text-sm ${event.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {event.pnl >= 0 ? '+' : ''}${event.pnl.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
