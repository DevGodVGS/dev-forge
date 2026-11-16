import React from 'react';
import { 
  ShieldAlert, 
  Play, 
  CheckCircle, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  FileCode, 
  GitPullRequest,
  ExternalLink
} from 'lucide-react';
import { ApiClient } from '../../lib/api-client';

export default async function AuditsPage() {
  const repos = await ApiClient.getRepositories();
  const repo = repos[0] || { id: 'repo-001', fullName: 'acme-eng/payment-gateway-service' };
  const audits = await ApiClient.getAudits(repo.id);
  const audit = audits[0];
  const findings = audit ? await ApiClient.getFindings(audit.id) : [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Trigger Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              WORKFLOW A
            </span>
            <span className="text-xs text-gray-400">Target: {repo.fullName} (main)</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Repository Audit & Remediation Center</h1>
          <p className="text-sm text-gray-400 mt-1">
            Deep AST code inspection across Security, Backend Concurrency, Architecture, and Edge Cases.
          </p>
        </div>

        <form action={async () => {
          'use server';
          await ApiClient.triggerAudit(repo.id);
        }}>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Execute Full Codebase Audit</span>
          </button>
        </form>
      </div>

      {/* Audit Overview Card */}
      {audit && (
        <div className="p-6 rounded-2xl bg-[#11131c] border border-[#1e2235] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1e2235]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-indigo-400">{audit.score || 85}</span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">HEALTH</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-white">Latest Execution: {audit.id}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {audit.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{audit.summary}</p>
                <div className="text-[11px] text-gray-500 mt-1 font-mono">
                  Commit: {audit.commitSha.slice(0, 7)} • Started: {new Date(audit.startedAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Severity Breakdown Badges */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-center">
                <span className="block text-lg font-bold text-rose-400">{audit.findingsCount?.critical || 1}</span>
                <span className="block text-[10px] text-rose-300 uppercase font-semibold">Critical</span>
              </div>
              <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                <span className="block text-lg font-bold text-amber-400">{audit.findingsCount?.high || 1}</span>
                <span className="block text-[10px] text-amber-300 uppercase font-semibold">High</span>
              </div>
              <div className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                <span className="block text-lg font-bold text-blue-400">{audit.findingsCount?.medium || 1}</span>
                <span className="block text-[10px] text-blue-300 uppercase font-semibold">Medium</span>
              </div>
            </div>
          </div>

          {/* Findings List */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-gray-400">
              Identified Code Defects & Vulnerabilities ({findings.length})
            </h3>

            {findings.map((f) => (
              <div key={f.id} className="p-5 rounded-xl bg-[#0d0f18] border border-[#1b1e2e] space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        f.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {f.severity}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-800 text-gray-300 border border-gray-700">
                        {f.category}
                      </span>
                      <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5 text-gray-500" />
                        {f.filePath}:{f.lineNumber}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-white">{f.title}</h4>
                  </div>

                  <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    STATUS: {f.status}
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">{f.description}</p>

                {/* Evidence Code Diff */}
                <div className="rounded-lg bg-[#07080c] border border-[#181b28] p-3 text-xs font-mono text-gray-300 overflow-x-auto">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-sans font-semibold">Evidence:</div>
                  <code className="text-rose-300">{f.evidence}</code>
                </div>

                {/* Recommendation & Acceptance Criteria */}
                <div className="space-y-2 text-xs">
                  <div className="text-indigo-400 font-medium">
                    <span className="text-gray-400 font-normal">Recommendation: </span>
                    {f.recommendation}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(f.acceptanceCriteria || []).map((c, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#131622] text-gray-400 text-[11px] border border-[#1e2235]">
                        <CheckCircle className="w-3 h-3 text-emerald-400" /> {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* GitHub Issue & PR Linkage */}
                <div className="flex items-center justify-between pt-3 border-t border-[#181b28] text-xs">
                  {f.githubIssueId && (
                    <span className="text-gray-400 font-mono flex items-center gap-1">
                      Triaged to Issue #{f.githubIssueId}
                    </span>
                  )}
                  {f.severity === 'CRITICAL' && (
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <GitPullRequest className="w-3.5 h-3.5" />
                      Remediation Branch & PR #101 Created
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
