'use client';

import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  Briefcase, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles,
  Zap,
  Building,
  Landmark,
  Sprout,
  Compass
} from 'lucide-react';

export interface CandidateItem {
  id: string;
  external_ref_id: string;
  compliance_status: string;
  parsed_metadata: {
    candidate_name: string;
    years_of_experience: number;
    core_tech_stack: string[];
    seniority_level: string;
    matched_subsidiary_fit: string;
    summary_highlight: string;
    education_level?: string;
  };
  raw_document_type: string;
  created_at: string;
  evaluation?: {
    id: string;
    technical_score: number;
    governance_score: number;
    composite_score: number;
    recommendation: string;
    matched_subsidiary: string;
    executive_summary: string;
    agent_logs?: any;
  } | null;
}

interface CandidateCardProps {
  candidate: CandidateItem;
  onSelect: (candidate: CandidateItem) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onSelect }) => {
  const meta = candidate.parsed_metadata;
  const ev = candidate.evaluation;

  // Modern vibrant subsidiary styling for white background
  const getSubsidiaryTheme = (sub: string) => {
    switch (sub?.toLowerCase()) {
      case 'energy':
        return {
          icon: Zap,
          badge: 'bg-amber-50 text-amber-900 border-amber-200',
          indicator: 'bg-amber-500',
        };
      case 'govtech':
        return {
          icon: Landmark,
          badge: 'bg-indigo-50 text-indigo-900 border-indigo-200',
          indicator: 'bg-indigo-500',
        };
      case 'property':
        return {
          icon: Building,
          badge: 'bg-emerald-50 text-emerald-900 border-emerald-200',
          indicator: 'bg-emerald-500',
        };
      case 'agribusiness':
        return {
          icon: Sprout,
          badge: 'bg-teal-50 text-teal-900 border-teal-200',
          indicator: 'bg-teal-500',
        };
      default:
        return {
          icon: Compass,
          badge: 'bg-violet-50 text-violet-900 border-violet-200',
          indicator: 'bg-violet-500',
        };
    }
  };

  const subTheme = getSubsidiaryTheme(meta.matched_subsidiary_fit || ev?.matched_subsidiary || 'HoldCo');
  const SubIcon = subTheme.icon;

  const isAdvance = ev?.recommendation?.includes('Advance');
  const isHold = ev?.recommendation?.includes('Hold');
  const isReject = ev?.recommendation?.includes('Reject');
  const isFlagged = candidate.compliance_status === 'FLAGGED_INJECTION';

  return (
    <div 
      onClick={() => onSelect(candidate)}
      className="glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer relative overflow-hidden flex flex-col justify-between group border border-slate-200/80 bg-white"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase border flex items-center gap-1.5 ${subTheme.badge}`}>
              <SubIcon className="w-3.5 h-3.5" />
              <span>BNH {meta.matched_subsidiary_fit || 'HoldCo'}</span>
            </span>

            {isFlagged ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                <span>Quarantined</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>NDPR Masked</span>
              </span>
            )}
          </div>

          <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            {candidate.external_ref_id}
          </span>
        </div>

        {/* Candidate Anonymous Token Identifier */}
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-1">
          <span className="font-mono text-slate-900">{meta.candidate_name || `[CANDIDATE_ANON_${candidate.external_ref_id}]`}</span>
        </h3>

        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="font-semibold text-slate-700">{meta.seniority_level} Profile</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {meta.years_of_experience} yrs exp
          </span>
          <span>•</span>
          <span className="text-slate-500 text-[11px] truncate max-w-[140px]">{meta.education_level || 'B.Sc'}</span>
        </div>

        {/* Summary Snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 font-normal">
          {meta.summary_highlight || "Executive dossier evaluated by sovereign multi-agent screener."}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {(meta.core_tech_stack || []).slice(0, 5).map((tech, i) => (
            <span 
              key={i} 
              className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
            >
              {tech}
            </span>
          ))}
          {(meta.core_tech_stack || []).length > 5 && (
            <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
              +{meta.core_tech_stack.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Evaluation Scores & Recommendation Footer */}
      <div className="pt-3 border-t border-slate-100">
        {ev ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Composite:</span>
                <span className={`text-xl font-extrabold font-mono ${
                  ev.composite_score >= 80 ? 'text-emerald-600' :
                  ev.composite_score >= 68 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {ev.composite_score}
                </span>
                <span className="text-[11px] text-slate-400">/100</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                <span>Tech: <strong className="text-slate-800">{ev.technical_score}</strong></span>
                <span>Gov: <strong className="text-slate-800">{ev.governance_score}</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide flex items-center gap-1.5 border ${
                isAdvance ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                isHold ? 'bg-amber-50 text-amber-800 border-amber-300' :
                'bg-rose-50 text-rose-800 border-rose-300'
              }`}>
                {isAdvance ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> :
                 isHold ? <Clock className="w-3.5 h-3.5 text-amber-600" /> :
                 <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                <span>{ev.recommendation}</span>
              </div>

              <span className="text-xs text-amber-700 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                Board Brief <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Awaiting Deliberation...</span>
            <span className="text-amber-700 font-bold flex items-center gap-1">
              View Profile <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
