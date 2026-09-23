'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  FileText, 
  Search, 
  RefreshCw, 
  Download, 
  Hash, 
  CheckCircle, 
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Fingerprint
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  event_type: string;
  details: any;
  timestamp: string;
}

interface AuditViewProps {
  metrics: {
    total_audit_events: number;
    total_pii_tokens_redacted: number;
    phones_masked: number;
    emails_masked: number;
    nin_bvn_masked: number;
    addresses_masked: number;
    injections_quarantined: number;
    ndpr_compliance_rate: string;
    sovereignty_status: string;
  };
  logs: AuditLogEntry[];
  onRefresh: () => void;
  isLoading: boolean;
}

export const AuditView: React.FC<AuditViewProps> = ({ metrics, logs, onRefresh, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = 
      filterType === 'ALL' || log.event_type === filterType;

    return matchesSearch && matchesType;
  });

  const exportAuditJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bnh_ndpr_audit_logs_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-2xl space-y-2 border border-emerald-200 bg-emerald-50/50 shadow-sm">
          <div className="flex items-center justify-between text-emerald-900 text-xs">
            <span className="font-bold uppercase tracking-wider">PII Masked</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-700">
              {metrics.total_pii_tokens_redacted || 0}
            </span>
            <span className="text-xs text-emerald-800 font-semibold">tokens scrubbed</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">Strict local pre-context redaction</p>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-2xl space-y-2 border border-rose-200 bg-rose-50/50 shadow-sm">
          <div className="flex items-center justify-between text-rose-900 text-xs">
            <span className="font-bold uppercase tracking-wider">Injections Blocked</span>
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-rose-700">
              {metrics.injections_quarantined || 0}
            </span>
            <span className="text-xs text-rose-800 font-semibold">adversarial threats</span>
          </div>
          <p className="text-[11px] text-rose-700 font-medium">Quarantined before SLM parsing</p>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-2xl space-y-2 border border-amber-200 bg-amber-50/50 shadow-sm">
          <div className="flex items-center justify-between text-amber-900 text-xs">
            <span className="font-bold uppercase tracking-wider">NDPR Compliance</span>
            <Lock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-800">
              {metrics.ndpr_compliance_rate || "100.0%"}
            </span>
            <span className="text-xs text-amber-700 font-bold">certified</span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium">NDPC Nigeria regulatory standard</p>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-5 rounded-2xl space-y-2 border border-blue-200 bg-blue-50/50 shadow-sm">
          <div className="flex items-center justify-between text-blue-900 text-xs">
            <span className="font-bold uppercase tracking-wider">Audit Events</span>
            <Hash className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-blue-700">
              {metrics.total_audit_events || 0}
            </span>
            <span className="text-xs text-blue-800 font-semibold">immutable logs</span>
          </div>
          <p className="text-[11px] text-blue-700 font-medium">Cryptographically verifiable</p>
        </div>
      </div>

      {/* Breakdown Badges Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Masked Entity Ledger:</span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Phones: <strong>{metrics.phones_masked || 0}</strong></span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Emails: <strong>{metrics.emails_masked || 0}</strong></span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
            <Fingerprint className="w-3.5 h-3.5 text-amber-600" />
            <span>NIN/BVN: <strong>{metrics.nin_bvn_masked || 0}</strong></span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>Addresses: <strong>{metrics.addresses_masked || 0}</strong></span>
          </span>
        </div>

        <button
          onClick={exportAuditJSON}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Regulatory Audit (NDPC)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Ref ID, token, or event..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-500 shadow-sm"
          >
            <option value="ALL">All Event Types</option>
            <option value="NDPR_PII_REDACTION">NDPR_PII_REDACTION</option>
            <option value="PROMPT_INJECTION_QUARANTINE">PROMPT_INJECTION_QUARANTINE</option>
            <option value="AGENT_EVALUATION_COMPLETED">AGENT_EVALUATION_COMPLETED</option>
          </select>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Timestamp (UTC)</th>
                <th className="p-4">Event Type</th>
                <th className="p-4">Candidate Ref</th>
                <th className="p-4">Compliance Token</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-sans">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isRedaction = log.event_type === 'NDPR_PII_REDACTION';
                  const isInjection = log.event_type === 'PROMPT_INJECTION_QUARANTINE';
                  const isExpanded = expandedLogId === log.id;
                  const token = log.details?.compliance_token || 'N/A';
                  const refId = log.details?.external_ref_id || 'System';

                  return (
                    <React.Fragment key={log.id}>
                      <tr 
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <td className="p-4 text-slate-500 font-sans text-xs whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {isRedaction ? (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              NDPR_PII_REDACTION
                            </span>
                          ) : isInjection ? (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                              PROMPT_INJECTION_QUARANTINE
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                              {log.event_type}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-slate-900 font-bold whitespace-nowrap">
                          {refId}
                        </td>
                        <td className="p-4 text-emerald-700 font-mono text-[11px] font-bold whitespace-nowrap">
                          {token}
                        </td>
                        <td className="p-4 text-slate-700 font-sans text-xs font-medium">
                          {isRedaction ? (
                            <span>
                              {log.details.pii_counts ? (
                                `Masked ${Object.values(log.details.pii_counts).reduce((a: any, b: any) => a + b, 0)} PII entities in ${log.details.execution_ms || 0.5}ms`
                              ) : 'Redacted PII tokens'}
                            </span>
                          ) : isInjection ? (
                            <span className="text-rose-700 font-bold">
                              Quarantined adversarial override command
                            </span>
                          ) : (
                            <span>Composite: {log.details.composite_score} ({log.details.recommendation})</span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable JSON details */}
                      {isExpanded && (
                        <tr className="bg-slate-900 text-slate-100">
                          <td colSpan={5} className="p-5 border-t border-b border-slate-800 font-mono text-xs">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-slate-400 font-sans text-xs">
                                <span className="font-semibold text-white">Immutable Audit Signature Record:</span>
                                <span>Record ID: {log.id}</span>
                              </div>
                              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto text-emerald-400 text-xs">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
