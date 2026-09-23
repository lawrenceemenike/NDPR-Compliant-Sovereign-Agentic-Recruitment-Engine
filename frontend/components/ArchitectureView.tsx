'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Server, 
  Layers, 
  Lock, 
  CheckCircle, 
  Zap, 
  Landmark, 
  Building, 
  Sprout, 
  Compass,
  ArrowRight,
  Database
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50/60 via-white to-amber-50/60 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            Sovereign Edge Infrastructure
          </span>
          <span className="text-xs text-slate-500 font-mono font-medium">
            BNH High-Trust Architecture Mandate
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif tracking-tight">
          NDPR-Compliant Sovereign Agentic Intelligence Pipeline
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
          AegisRecruit enforces mathematical isolation of candidate personal data. 
          No candidate resume, name, phone number, national identity code, or municipal address ever traverses public internet networks or external multi-tenant LLM APIs.
        </p>
      </div>

      {/* Visual Pipeline Architecture */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-600" />
          End-to-End Sovereign Data Journey
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="glass-panel p-5 rounded-2xl space-y-2 border border-blue-200 bg-blue-50/40 relative shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-xs font-mono font-extrabold text-blue-700">
              01
            </div>
            <h4 className="text-sm font-bold text-slate-900">Ingestion Gateway</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              PDF/TXT documents received via authenticated executive endpoints.
            </p>
            <div className="pt-2 text-[11px] font-mono font-bold text-blue-700">
              PyPDF • Async Streaming
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-5 rounded-2xl space-y-2 border border-emerald-200 bg-emerald-50/40 relative shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xs font-mono font-extrabold text-emerald-700">
              02
            </div>
            <h4 className="text-sm font-bold text-slate-900">NDPR Shield Middleware</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Regex & NLP strip Nigerian phone numbers, NIN/BVN, addresses, and prompt injection attempts.
            </p>
            <div className="pt-2 text-[11px] font-mono font-bold text-emerald-700">
              Pre-Context Quarantine
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-5 rounded-2xl space-y-2 border border-amber-200 bg-amber-50/40 relative shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xs font-mono font-extrabold text-amber-800">
              03
            </div>
            <h4 className="text-sm font-bold text-slate-900">Local Gemma 2 (9B) SLM</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Ollama container processes 100% sanitized text in strict JSON mode on local host.
            </p>
            <div className="pt-2 text-[11px] font-mono font-bold text-amber-700">
              Zero Cloud API Exfiltration
            </div>
          </div>

          {/* Step 4 */}
          <div className="glass-panel p-5 rounded-2xl space-y-2 border border-purple-200 bg-purple-50/40 relative shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-xs font-mono font-extrabold text-purple-700">
              04
            </div>
            <h4 className="text-sm font-bold text-slate-900">Multi-Agent Deliberation</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Screener, Institutional Assessor, and Synthesizer produce board-ready executive card.
            </p>
            <div className="pt-2 text-[11px] font-mono font-bold text-purple-700">
              Multi-Agent Consensus
            </div>
          </div>
        </div>
      </div>

      {/* Brendan Nicholas Holdings Subsidiaries Matrix */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-600" />
          Brendan Nicholas Holdings Portfolio Alignment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          <div className="glass-panel p-4 rounded-2xl border border-amber-200 bg-amber-50/50 shadow-sm space-y-2">
            <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>BNH Energy</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              SCADA telemetry, power grid IoT, offshore systems, and renewable automation.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 shadow-sm space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-900 text-xs font-bold">
              <Landmark className="w-4 h-4 text-indigo-600" />
              <span>BNH GovTech</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Federal civil registries, biometric verification, customs clearing, and civic portals.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 shadow-sm space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-900 text-xs font-bold">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>BNH Property</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Smart tenant platforms, automated lease contracts, and commercial facility systems.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-teal-200 bg-teal-50/50 shadow-sm space-y-2">
            <div className="flex items-center gap-1.5 text-teal-900 text-xs font-bold">
              <Sprout className="w-4 h-4 text-teal-600" />
              <span>BNH Agribusiness</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Grain exchange platforms, warehouse receipt ledgers, and rural supply chain sync.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-violet-200 bg-violet-50/50 shadow-sm space-y-2">
            <div className="flex items-center gap-1.5 text-violet-900 text-xs font-bold">
              <Compass className="w-4 h-4 text-violet-600" />
              <span>BNH HoldCo</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Enterprise architecture, portfolio fintech, security governance, and executive oversight.
            </p>
          </div>
        </div>
      </div>

      {/* Regulatory Standards Compliance Accord */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-300 bg-emerald-50/60 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm font-bold text-emerald-950 uppercase tracking-wider">
              Statutory Compliance Alignment
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
            Nigeria Data Protection Act (NDPA 2023)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700 pt-2 font-medium">
          <div className="space-y-1">
            <strong className="text-slate-900 font-bold">Article 24 (Data Minimization):</strong>
            <p className="text-slate-600 leading-relaxed">
              Only skills and career tenure are transmitted to the reasoning core; identity tokens are purged.
            </p>
          </div>

          <div className="space-y-1">
            <strong className="text-slate-900 font-bold">Article 29 (Security of Processing):</strong>
            <p className="text-slate-600 leading-relaxed">
              Zero cross-border transfer. Weights execute locally on on-premise hardware.
            </p>
          </div>

          <div className="space-y-1">
            <strong className="text-slate-900 font-bold">Section 39 (Regulatory Auditability):</strong>
            <p className="text-slate-600 leading-relaxed">
              Every redaction is hashed and recorded in PostgreSQL for immediate verification by regulators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
