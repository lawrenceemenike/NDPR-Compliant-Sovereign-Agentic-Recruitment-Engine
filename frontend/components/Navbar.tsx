'use client';

import React from 'react';
import { ShieldCheck, Cpu, UploadCloud, RefreshCw, Sparkles, Building2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'queue' | 'audit' | 'architecture';
  setActiveTab: (tab: 'queue' | 'audit' | 'architecture') => void;
  onOpenUpload: () => void;
  onSeedDemo: () => void;
  isSeeding: boolean;
  ollamaConnected: boolean;
  candidateCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  onSeedDemo,
  isSeeding,
  ollamaConnected,
  candidateCount,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Entity Name - Cleaned as per request */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-amber-400/40 shadow-sm">
              <span className="font-serif font-bold text-lg text-amber-300">BNH</span>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
                AEGIS<span className="text-amber-600">RECRUIT</span>
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'queue'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>Ingestion Queue</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800 font-mono font-bold">
                  {candidateCount}
                </span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'audit'
                  ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>NDPR Audit & Telemetry</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'architecture'
                  ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>Sovereignty Specs</span>
              </span>
            </button>
          </nav>

          {/* Right Action Bar & Engine Status */}
          <div className="flex items-center space-x-3">
            {/* Engine Status Pill */}
            <div className="hidden lg:flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
              <div className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${ollamaConnected ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
                <span className="text-slate-700 font-mono font-medium">
                  {ollamaConnected ? 'gemma2:9b (Local)' : 'SLM Fallback Engine'}
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> NDPR Active
              </span>
            </div>

            {/* Quick Demo Ingest Button */}
            <button
              onClick={onSeedDemo}
              disabled={isSeeding}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800 shadow-sm transition-all active:scale-95 disabled:opacity-50"
              title="Populate benchmark candidates across BNH subsidiaries"
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-600 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Seeding...' : 'Load Benchmarks'}</span>
            </button>

            {/* Ingest Resume Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <UploadCloud className="w-4 h-4 text-white" />
              <span>Ingest Resume</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
