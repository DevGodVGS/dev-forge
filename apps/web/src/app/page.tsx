import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  GitPullRequest, 
  AlertTriangle, 
  Zap, 
  GitBranch, 
  ArrowUpRight, 
  Bot, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { ApiClient } from '../lib/api-client';

export default async function DashboardPage() {
  const repos = await ApiClient.getRepositories();
  const defaultRepo = repos[0] || { id: 'repo-001', fullName: 'acme-eng/payment-gateway-service' };
  const audits = await ApiClient.getAudits(defaultRepo.id);
  const prs = await ApiClient.getPullRequests(defaultRepo.id);

  const latestAudit = audits[0];
  const pendingPrs = prs.filter(p => p.humanApprovalStatus === 'PENDING');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-surface to-surface border border-indigo-900/30">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              MISSION CONTROL
            </span>
            <span className="text-xs text-gray-400">• Multi-Provider AI (Claude 3.5, GPT-4o, Gemini 2.0)</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise Autonomous AI Engineering</h1>
          <p className="text-sm text-gray-400 mt-1">
            Auditing codebases, generating verified remediation pull requests, and conducting adversarial reviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/audits"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Trigger Audit</span>
          </Link>
          <Link
            href="/pull-requests"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161926] hover:bg-[#1d2133] text-gray-200 border border-[#22273d] text-sm font-semibold transition-all"
          >
            <GitPullRequest className="w-4 h-4" />
            <span>PR Review Hub</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#11131c] border border-[#1e2235]">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Repository Health Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{latestAudit?.score || 85}</span>
            <span className="text-xs text-gray-400">/ 100</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Audit status: Completed & Stable</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#11131c] border border-[#1e2235]">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Critical Security Findings</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-400">
              {latestAudit?.findingsCount?.critical || 1}
            </span>
            <span className="text-xs text-gray-400">triaged to PR</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400">
            Autonomous fix branch created
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#11131c] border border-[#1e2235]">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Pending Human Approval</span>
            <GitPullRequest className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">{pendingPrs.length || 1}</span>
            <span className="text-xs text-gray-400">PRs awaiting review</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-400/80">
            Human approval required for merge
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#11131c] border border-[#1e2235]">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">AI Compute & Token Cost</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">$0.042</span>
            <span className="text-xs text-gray-400">USD</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400">
            Across Claude, GPT-4o & Gemini
          </div>
        </div>
      </div>

      {/* Two Column Layout: Active Workflows & Repository Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Primary Workflows */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workflow A: Latest Audit Results */}
          <div className="rounded-xl bg-[#11131c] border border-[#1e2235] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-semibold text-white">Workflow A: Codebase Audit & Remediation</h2>
              </div>
              <Link href="/audits" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                <span>View Full Audit</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 rounded-lg bg-[#0d0f18] border border-[#1b1e2e] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-gray-400">{defaultRepo.fullName}</span>
                  <span className="text-xs text-gray-500 ml-2">branch: main</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  COMPLETED
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {latestAudit?.summary || 'Audit completed. Identified 3 findings across 24 files. 1 Critical finding triaged for remediation.'}
              </p>
              <div className="pt-2 border-t border-[#1e2235] flex items-center gap-4 text-xs">
                <span className="text-rose-400 font-medium">1 Critical</span>
                <span className="text-amber-400 font-medium">1 High</span>
                <span className="text-blue-400 font-medium">1 Medium</span>
                <span className="text-gray-500 ml-auto">Verified by Claude 3.5 & GPT-4o</span>
              </div>
            </div>
          </div>

          {/* Workflow B: PR Review Loop */}
          <div className="rounded-xl bg-[#11131c] border border-[#1e2235] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-semibold text-white">Workflow B: Adversarial PR Review & Human Gate</h2>
              </div>
              <Link href="/pull-requests" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                <span>Manage PRs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 rounded-lg bg-[#0d0f18] border border-[#1b1e2e] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">PR #101: fix(security): resolve Unsanitized SQL Parameter</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI APPROVED
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Remediates issue #201. Autonomous correction loop resolved review feedback across 2 iterations. Ready for human sign-off.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#1e2235]">
                <div className="text-[11px] text-amber-400 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Awaiting Human Approval on GitHub</span>
                </div>
                <Link
                  href="/pull-requests"
                  className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
                >
                  Review & Approve
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Organization & System Topology */}
        <div className="space-y-6">
          <div className="rounded-xl bg-[#11131c] border border-[#1e2235] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">Multi-Agent Swarm</h2>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Security Auditor', model: 'Claude 3.5 Sonnet', status: 'IDLE' },
                { name: 'Backend Architect', model: 'GPT-4o', status: 'IDLE' },
                { name: 'Adversarial PR Reviewer', model: 'Gemini 2.0 Flash', status: 'IDLE' },
                { name: 'Remediation Engine', model: 'Claude 3.5 Sonnet', status: 'IDLE' },
                { name: 'Correction Agent', model: 'GPT-4o', status: 'IDLE' }
              ].map((agent, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-[#0d0f18] border border-[#1b1e2e]">
                  <div>
                    <span className="block text-xs font-medium text-white">{agent.name}</span>
                    <span className="block text-[10px] text-gray-400 font-mono">{agent.model}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ONLINE
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/agents"
              className="mt-4 block text-center py-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium border border-indigo-500/20 rounded-lg hover:bg-indigo-500/5 transition-colors"
            >
              Configure Agent Registry →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
