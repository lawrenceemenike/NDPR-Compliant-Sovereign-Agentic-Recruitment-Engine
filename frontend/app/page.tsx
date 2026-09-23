'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  UploadCloud, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  BarChart3,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { CandidateCard, CandidateItem } from '../components/CandidateCard';
import { CandidateModal } from '../components/CandidateModal';
import { AuditView } from '../components/AuditView';
import { ArchitectureView } from '../components/ArchitectureView';
import { UploadModal } from '../components/UploadModal';

export default function RecruitmentDashboard() {
  const [activeTab, setActiveTab] = useState<'queue' | 'audit' | 'architecture'>('queue');
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ollamaConnected, setOllamaConnected] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('ALL');
  const [selectedRecommendation, setSelectedRecommendation] = useState('ALL');

  // Audit Metrics state
  const [auditData, setAuditData] = useState<{ metrics: any; logs: any[] }>({
    metrics: {
      total_audit_events: 0,
      total_pii_tokens_redacted: 0,
      phones_masked: 0,
      emails_masked: 0,
      nin_bvn_masked: 0,
      addresses_masked: 0,
      injections_quarantined: 0,
      ndpr_compliance_rate: "100.0%",
      sovereignty_status: "Strict Local Context Guarantee",
    },
    logs: [],
  });
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  // Fetch candidates
  const fetchCandidates = useCallback(async () => {
    try {
      const resp = await fetch('/api/candidates');
      if (resp.ok) {
        const data = await resp.json();
        setCandidates(data);
      }
    } catch (e) {
      console.error("Failed to fetch candidates", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch audit logs & metrics
  const fetchAuditLogs = useCallback(async () => {
    setIsAuditLoading(true);
    try {
      const resp = await fetch('/api/audit-logs');
      if (resp.ok) {
        const data = await resp.json();
        setAuditData(data);
      }
    } catch (e) {
      console.error("Failed to fetch audit logs", e);
    } finally {
      setIsAuditLoading(false);
    }
  }, []);

  // Check health and Ollama connectivity
  const checkHealth = useCallback(async () => {
    try {
      const resp = await fetch('/api/health');
      if (resp.ok) {
        const data = await resp.json();
        setOllamaConnected(data.ollama_connected ?? true);
      }
    } catch (e) {
      setOllamaConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
    fetchAuditLogs();
    checkHealth();
  }, [fetchCandidates, fetchAuditLogs, checkHealth]);

  // Seed demo data handler
  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      const resp = await fetch('/api/candidates/demo-seed', { method: 'POST' });
      if (resp.ok) {
        await fetchCandidates();
        await fetchAuditLogs();
      }
    } catch (e) {
      console.error("Failed to seed benchmark candidates", e);
    } finally {
      setIsSeeding(false);
    }
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const meta = c.parsed_metadata;
    const ev = c.evaluation;

    // Search query
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      !searchQuery ||
      c.external_ref_id.toLowerCase().includes(searchLower) ||
      (meta.candidate_name && meta.candidate_name.toLowerCase().includes(searchLower)) ||
      (meta.core_tech_stack && meta.core_tech_stack.some(t => t.toLowerCase().includes(searchLower))) ||
      (meta.summary_highlight && meta.summary_highlight.toLowerCase().includes(searchLower));

    // Subsidiary filter
    const sub = meta.matched_subsidiary_fit || ev?.matched_subsidiary || 'HoldCo';
    const matchesSubsidiary = 
      selectedSubsidiary === 'ALL' || sub.toLowerCase() === selectedSubsidiary.toLowerCase();

    // Recommendation filter
    const rec = ev?.recommendation || '';
    const matchesRecommendation =
      selectedRecommendation === 'ALL' ||
      (selectedRecommendation === 'Advance' && rec.includes('Advance')) ||
      (selectedRecommendation === 'Hold' && rec.includes('Hold')) ||
      (selectedRecommendation === 'Reject' && rec.includes('Reject'));

    return matchesSearch && matchesSubsidiary && matchesRecommendation;
  });

  // Calculate executive metrics
  const totalEvaluated = candidates.filter(c => c.evaluation).length;
  const advancedCount = candidates.filter(c => c.evaluation?.recommendation?.includes('Advance')).length;
  const advanceRate = totalEvaluated > 0 ? Math.round((advancedCount / totalEvaluated) * 100) : 0;
  const avgCompositeScore = totalEvaluated > 0
    ? (candidates.reduce((acc, c) => acc + (c.evaluation?.composite_score || 0), 0) / totalEvaluated).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Top Executive Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onSeedDemo={handleSeedDemo}
        isSeeding={isSeeding}
        ollamaConnected={ollamaConnected}
        candidateCount={candidates.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: INGESTION QUEUE */}
        {activeTab === 'queue' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top KPI Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl space-y-1.5 border border-slate-200/80 bg-white">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span className="uppercase tracking-wider">Candidate Stream</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                    <Users className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-slate-900">{candidates.length}</span>
                  <span className="text-xs text-slate-500 font-medium">profiles ingested</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">100% Anonymized at edge</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl space-y-1.5 border border-emerald-200 bg-emerald-50/40">
                <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
                  <span className="uppercase tracking-wider">Board Advance Rate</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/80 border border-emerald-300 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-emerald-700">{advanceRate}%</span>
                  <span className="text-xs text-emerald-800 font-semibold">{advancedCount} approved</span>
                </div>
                <p className="text-[11px] text-emerald-700">Exceeds BNH technical threshold</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl space-y-1.5 border border-blue-200 bg-blue-50/40">
                <div className="flex items-center justify-between text-blue-800 text-xs font-semibold">
                  <span className="uppercase tracking-wider">Mean Composite Score</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-100/80 border border-blue-300 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-700" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-blue-700">{avgCompositeScore}</span>
                  <span className="text-xs text-blue-800 font-medium">/ 100</span>
                </div>
                <p className="text-[11px] text-blue-700">55% Tech • 45% Governance</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl space-y-1.5 border border-slate-200/80 bg-white">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span className="uppercase tracking-wider">NDPR Quarantine</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-emerald-600">
                    {auditData.metrics.total_pii_tokens_redacted || 0}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">PII purged</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">NIN, BVN, Phones & Addresses</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="glass-panel p-5 rounded-2xl space-y-4 border border-slate-200/80 bg-white shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search */}
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, skill (e.g. Python, Docker), or domain..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
                  />
                </div>

                {/* Recommendation Filter Buttons */}
                <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                  <span className="text-xs text-slate-600 font-semibold mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-slate-500" /> Recommendation:
                  </span>
                  {[
                    { label: 'All', value: 'ALL' },
                    { label: 'Advance', value: 'Advance' },
                    { label: 'Review', value: 'Hold' },
                    { label: 'Reject', value: 'Reject' },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setSelectedRecommendation(filter.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                        selectedRecommendation === filter.value
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subsidiary Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-600 font-semibold shrink-0">
                  BNH Portfolio Alignment:
                </span>
                {['ALL', 'Energy', 'GovTech', 'Property', 'Agribusiness', 'HoldCo'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubsidiary(sub)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
                      selectedSubsidiary === sub
                        ? 'bg-amber-600 text-white shadow-sm border border-amber-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {sub === 'ALL' ? 'All Divisions' : `BNH ${sub}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Candidate Grid */}
            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-500 font-medium">Loading sovereign candidate stream...</p>
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="glass-panel p-12 rounded-2xl text-center space-y-4 border-dashed border-slate-300 bg-white">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No Candidate Profiles Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {candidates.length === 0
                      ? 'No resumes have been ingested into AegisRecruit yet. Ingest a candidate resume or load standard BNH benchmarks.'
                      : 'No candidate profiles matched the specified subsidiary and recommendation filters.'}
                  </p>
                </div>
                {candidates.length === 0 && (
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleSeedDemo}
                      disabled={isSeeding}
                      className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 flex items-center gap-2 shadow-sm"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>{isSeeding ? 'Seeding...' : 'Load Benchmark Profiles'}</span>
                    </button>
                    <button
                      onClick={() => setIsUploadOpen(true)}
                      className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                    >
                      Upload Resume
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onSelect={setSelectedCandidate}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AUDIT & SECURITY LOG */}
        {activeTab === 'audit' && (
          <AuditView
            metrics={auditData.metrics}
            logs={auditData.logs}
            onRefresh={fetchAuditLogs}
            isLoading={isAuditLoading}
          />
        )}

        {/* TAB 3: ARCHITECTURE SPECS */}
        {activeTab === 'architecture' && <ArchitectureView />}
      </main>

      {/* Candidate Detail Modal */}
      <CandidateModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />

      {/* Resume Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {
          fetchCandidates();
          fetchAuditLogs();
        }}
      />
    </div>
  );
}
