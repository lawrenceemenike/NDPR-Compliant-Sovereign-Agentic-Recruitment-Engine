'use client';

import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [refId, setRefId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultReport, setResultReport] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMessage('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setErrorMessage('');
    }
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    setResultReport(null);

    try {
      if (activeMode === 'upload') {
        if (!file) {
          setErrorMessage('Please select a PDF or TXT resume file.');
          setIsProcessing(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        if (refId.trim()) {
          formData.append('external_ref_id', refId.trim());
        }

        const resp = await fetch('/api/candidates/upload', {
          method: 'POST',
          body: formData,
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.detail || 'Failed to process resume');
        }

        const data = await resp.json();
        setResultReport(data);
        onSuccess();
      } else {
        if (!textInput.trim()) {
          setErrorMessage('Please paste candidate resume text.');
          setIsProcessing(false);
          return;
        }

        const resp = await fetch('/api/candidates/text-ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: textInput,
            external_ref_id: refId.trim() || undefined,
          }),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.detail || 'Failed to process resume');
        }

        const data = await resp.json();
        setResultReport(data);
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during NDPR processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTextInput('');
    setRefId('');
    setResultReport(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Ingest Sovereign Candidate Resume</h3>
              <p className="text-xs text-slate-500 font-medium">Enforces NDPR PII Redaction & Multi-Agent Evaluation</p>
            </div>
          </div>

          <button onClick={resetForm} className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ingestion Mode Toggle */}
        {!resultReport && (
          <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 text-xs font-bold">
            <button
              onClick={() => setActiveMode('upload')}
              className={`py-3.5 px-4 border-b-2 transition-all ${
                activeMode === 'upload' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Upload Document (PDF / TXT)
            </button>
            <button
              onClick={() => setActiveMode('paste')}
              className={`py-3.5 px-4 border-b-2 transition-all ${
                activeMode === 'paste' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Direct Text Sanitizer
            </button>
          </div>
        )}

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {resultReport ? (
            /* Result Success Banner */
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">Candidate Successfully Ingested & Evaluated</h4>
                    <p className="text-xs text-emerald-700 font-medium">NDPR Masking Passed • Multi-Agent Consensus Recorded</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs pt-2 border-t border-emerald-200 font-mono">
                  <div className="p-3 rounded-xl bg-white border border-emerald-200">
                    <span className="text-slate-500 text-[10px] font-semibold">Reference ID:</span>
                    <p className="text-slate-900 font-bold">{resultReport.candidate.external_ref_id}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-emerald-200">
                    <span className="text-slate-500 text-[10px] font-semibold">Composite Score:</span>
                    <p className="text-emerald-700 font-bold">{resultReport.evaluation.composite_score}/100</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-emerald-200">
                    <span className="text-slate-500 text-[10px] font-semibold">Subsidiary Fit:</span>
                    <p className="text-amber-800 font-bold">BNH {resultReport.evaluation.matched_subsidiary}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-emerald-200">
                    <span className="text-slate-500 text-[10px] font-semibold">Recommendation:</span>
                    <p className="text-slate-800 font-bold">{resultReport.evaluation.recommendation}</p>
                  </div>
                </div>

                {/* NDPR Sanitization Summary */}
                <div className="p-3.5 rounded-xl bg-white border border-emerald-300 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-emerald-800 font-bold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> NDPR Redaction Proof
                    </span>
                    <span className="font-mono text-[11px]">{resultReport.ndpr_shield_report.compliance_token}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] font-medium">
                    PII Scrubbed: {resultReport.ndpr_shield_report.pii_counts.phones} Phone(s), {resultReport.ndpr_shield_report.pii_counts.emails} Email(s), {resultReport.ndpr_shield_report.pii_counts.nin_bvn} NIN/BVN(s), {resultReport.ndpr_shield_report.pii_counts.addresses} Address(es) in {resultReport.ndpr_shield_report.execution_ms}ms.
                  </p>
                </div>
              </div>

              <button
                onClick={resetForm}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Close & View Ingestion Queue
              </button>
            </div>
          ) : (
            /* Upload / Paste Form */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Optional Candidate Reference Tag
                </label>
                <input
                  type="text"
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                  placeholder="e.g. BNH-CAND-2026 or leave blank for auto-UUID"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
                />
              </div>

              {activeMode === 'upload' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Candidate Curriculum Vitae (PDF or TXT)
                  </label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/70"
                    onClick={() => document.getElementById('resume-file-input')?.click()}
                  >
                    <input
                      id="resume-file-input"
                      type="file"
                      accept=".pdf,.txt"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    {file ? (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB • Ready to sanitize</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800">
                          Click to browse or drag and drop resume here
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Supports PDF and Plain Text formats
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Paste Raw Resume Text (Include phone, email, addresses to test redaction)
                  </label>
                  <textarea
                    rows={8}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste unmasked CV text here. Eg: Adebayo Babatunde, +234 803 123 4567, NIN: 12345678901, Lekki Phase 1, Lagos..."
                    className="w-full p-3.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
                  />
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Security Attestation Notice */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-slate-900">NDPR Edge Quarantine:</strong> All identifying Nigerian phone numbers, NIN/BVN identifiers, and municipal addresses will be cryptographically redacted before passing to local Ollama inference.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sanitizing & Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sanitize & Evaluate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
