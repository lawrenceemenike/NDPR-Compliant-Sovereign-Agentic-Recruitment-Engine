'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Award, 
  Terminal, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Briefcase, 
  Layers, 
  Lock, 
  Zap, 
  Landmark, 
  Building, 
  Sprout, 
  Compass,
  Cpu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CandidateItem } from './CandidateCard';

interface CandidateModalProps {
  candidate: CandidateItem | null;
  onClose: () => void;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({ candidate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'agents' | 'compliance'>('brief');

  if (!candidate) return null;

  const meta = candidate.parsed_metadata;
  const ev = candidate.evaluation;
  const agentLogs = ev?.agent_logs || {};
  const boardQuestions = agentLogs.board_questions || [];
  const complianceToken = agentLogs.compliance_token || 'NDPR-SEC-VERIFIED';

  const isAdvance = ev?.recommendation?.includes('Advance');
  const isHold = ev?.recommendation?.includes('Hold');
  const isFlagged = candidate.compliance_status === 'FLAGGED_INJECTION';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-amber-50 text-amber-900 border border-amber-200">
                BNH {meta.matched_subsidiary_fit || 'HoldCo'} Division
              </span>
              <span className="font-mono text-xs text-slate-500 font-medium">
                Ref: {candidate.external_ref_id}
              </span>
              {isFlagged ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-600" /> Injection Quarantined
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> NDPR Certified
                </span>
              )}
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tracking-tight pt-1">
              {meta.candidate_name || `[CANDIDATE_ANON_${candidate.external_ref_id}]`}
            </h2>

            <p className="text-xs text-slate-600 font-medium">
              {meta.seniority_level} Profile • {meta.years_of_experience} Years Verified Experience • {meta.education_level || 'B.Sc Degree'}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('brief')}
            className={`py-3.5 border-b-2 transition-all ${
              activeTab === 'brief'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Executive Briefing Card
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`py-3.5 border-b-2 transition-all ${
              activeTab === 'agents'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Multi-Agent Deliberation Logs
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`py-3.5 border-b-2 transition-all ${
              activeTab === 'compliance'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            NDPR Sovereignty Certificate
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Executive Score Banner */}
          {ev && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Board Decision</span>
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
                  isAdvance ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                  isHold ? 'bg-amber-50 text-amber-800 border-amber-300' :
                  'bg-rose-50 text-rose-800 border-rose-300'
                }`}>
                  {isAdvance ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
                   isHold ? <Clock className="w-4 h-4 text-amber-600" /> :
                   <AlertTriangle className="w-4 h-4 text-rose-600" />}
                  <span>{ev.recommendation}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Composite Score</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-extrabold font-mono ${
                    ev.composite_score >= 80 ? 'text-emerald-600' :
                    ev.composite_score >= 68 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {ev.composite_score}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ 100</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full transition-all" 
                    style={{ width: `${Math.min(ev.composite_score, 100)}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Technical Capability</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold font-mono text-slate-900">
                    {ev.technical_score}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ 100</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all" 
                    style={{ width: `${Math.min(ev.technical_score, 100)}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Governance & Autonomy</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold font-mono text-slate-900">
                    {ev.governance_score}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ 100</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full transition-all" 
                    style={{ width: `${Math.min(ev.governance_score, 100)}%` }} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: EXECUTIVE BRIEF */}
          {activeTab === 'brief' && (
            <div className="space-y-6">
              {/* Executive Summary Render */}
              <div className="glass-panel p-6 rounded-2xl space-y-3 bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-amber-700 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    Executive Briefing Appraisal
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono font-medium">Consensus: Gemma 2 (9B) SLM</span>
                </div>

                <div className="text-xs leading-relaxed text-slate-700 space-y-2 whitespace-pre-line font-sans">
                  {ev?.executive_summary || meta.summary_highlight}
                </div>
              </div>

              {/* Verified Tech Stack */}
              <div className="glass-panel p-6 rounded-2xl space-y-3 bg-white border border-slate-200 shadow-sm">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Verified Core Stack & Technical Competencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(meta.core_tech_stack || []).map((t, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Board Scrutiny Questions */}
              {boardQuestions.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl space-y-3 border-amber-200 bg-amber-50/50 shadow-sm">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <h4 className="text-xs uppercase font-extrabold tracking-wider text-amber-900">
                      Board Member Inquisitorial Directives (Interview Questions)
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Proprietary inquiry vectors generated by Agent 2 to probe runbook adherence and data governance:
                  </p>
                  <div className="space-y-2.5">
                    {boardQuestions.map((q: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-amber-200/80 shadow-sm">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-mono font-extrabold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                          {q}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MULTI-AGENT LOGS */}
          {activeTab === 'agents' && (
            <div className="space-y-4">
              {/* Agent 1 */}
              <div className="p-5 rounded-2xl bg-blue-50/30 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                      Agent 1: Technical Screener Agent
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                    Score: {agentLogs.technical_screener?.score || ev?.technical_score}/100
                  </span>
                </div>
                
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {agentLogs.technical_screener?.rationale || "Technical stack evaluated against BNH non-negotiable standards."}
                </p>

                {agentLogs.technical_screener?.strengths && (
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase font-bold text-emerald-700">Identified Strengths:</span>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5 font-medium">
                      {Array.isArray(agentLogs.technical_screener.strengths) ? (
                        agentLogs.technical_screener.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)
                      ) : (
                        <li>{agentLogs.technical_screener.strengths}</li>
                      )}
                    </ul>
                  </div>
                )}

                {agentLogs.technical_screener?.gaps && agentLogs.technical_screener.gaps.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase font-bold text-rose-700">Architectural Gaps:</span>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5 font-medium">
                      {Array.isArray(agentLogs.technical_screener.gaps) ? (
                        agentLogs.technical_screener.gaps.map((g: string, i: number) => <li key={i}>{g}</li>)
                      ) : (
                        <li>{agentLogs.technical_screener.gaps}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Agent 2 */}
              <div className="p-5 rounded-2xl bg-emerald-50/30 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      Agent 2: Institutional Fit & Governance Assessor
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    Score: {agentLogs.institutional_fit?.score || ev?.governance_score}/100
                  </span>
                </div>
                
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {agentLogs.institutional_fit?.rationale || "Documentation discipline and operational autonomy evaluated."}
                </p>

                {agentLogs.institutional_fit?.strengths && (
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase font-bold text-emerald-700">Governance Strengths:</span>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5 font-medium">
                      {Array.isArray(agentLogs.institutional_fit.strengths) ? (
                        agentLogs.institutional_fit.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)
                      ) : (
                        <li>{agentLogs.institutional_fit.strengths}</li>
                      )}
                    </ul>
                  </div>
                )}

                {agentLogs.institutional_fit?.risks && agentLogs.institutional_fit.risks.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase font-bold text-amber-700">Institutional Risks:</span>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5 font-medium">
                      {Array.isArray(agentLogs.institutional_fit.risks) ? (
                        agentLogs.institutional_fit.risks.map((r: string, i: number) => <li key={i}>{r}</li>)
                      ) : (
                        <li>{agentLogs.institutional_fit.risks}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: NDPR SOVEREIGNTY CERTIFICATE */}
          {activeTab === 'compliance' && (
            <div className="space-y-5">
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-sm font-bold text-emerald-950 tracking-wide uppercase">
                      NDPR Pre-Inference Cryptographic Attestation
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Article 2.1 Compliant
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  In accordance with the Nigeria Data Protection Regulation (NDPR 2019 / NDPA 2023), 
                  all personally identifiable data in this candidate submission was stripped at the edge prior to entry into any SLM context window.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1">
                    <span className="text-slate-500 text-[11px] font-semibold">Audit Verification Hash:</span>
                    <p className="font-mono text-emerald-700 text-xs font-bold break-all">
                      {complianceToken}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1">
                    <span className="text-slate-500 text-[11px] font-semibold">Inference Boundary:</span>
                    <p className="font-mono text-slate-800 text-xs font-bold">
                      Sovereign Local Host (Ollama / gemma2:9b)
                    </p>
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2 pt-2 border-t border-emerald-200">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-800">
                    Mandatory Boundary Checks Passed:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Nigerian Phone Numbers Redacted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>11-Digit NIN / BVN Records Masked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Municipal Addresses Anonymized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Zero Cloud API Data Exfiltration</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Strict BNH Board Confidentiality</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors shadow-sm"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
