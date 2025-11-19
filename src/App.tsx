import React from 'react';
import { LivePredictionsFeed } from './components/LivePredictionsFeed';
import { ExecutionConsole } from './components/ExecutionConsole';
import { InputPanel } from './components/InputPanel';
import ChatPanel from './components/ChatPanel';
import { TradingChart } from './components/TradingChart';
import { TrendingUp } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white">TradeAI Dashboard</h1>
              <p className="text-slate-400 text-sm">Multi-Asset Trading Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-slate-300">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="p-6 space-y-6 max-w-[1920px] mx-auto">
        {/* Top Row - Trading Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-9">
            <TradingChart />
          </div>
          <div className="lg:col-span-3">
            <InputPanel />
          </div>
        </div>

        {/* Bottom Row - Feeds and Console */}
        <div className="lg:h-[calc(100vh-220px)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:h-full">
            {/* Live Feed */}
            <div className="lg:col-span-4 lg:h-full flex">
              <div className="flex-1 min-h-0">
                <LivePredictionsFeed />
              </div>
            </div>

            {/* Execution Console */}
            <div className="lg:col-span-5 lg:h-full flex">
              <div className="flex-1 min-h-0">
                <ExecutionConsole />
              </div>
            </div>

            {/* Chat */}
            <div className="lg:col-span-3 lg:h-full flex">
              <div className="flex-1 min-h-0">
                <ChatPanel />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
