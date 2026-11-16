import React from 'react';
import { 
  GitPullRequest, 
  ShieldCheck, 
  RotateCw, 
  CheckCircle2, 
  ExternalLink,
  Bot,
  AlertCircle
} from 'lucide-react';
import { ApiClient } from '../../lib/api-client';

export default async function PullRequestsPage() {
  const repos = await ApiClient.getRepositories();
  const repo = repos[0] || { id: 'repo-001', fullName: 'acme-eng/payment-gateway-service' };
  const prs = await ApiClient.getPullRequests(repo.id);
  const pr = prs[0];
  const reviews = pr ? await ApiClient.getReviews(pr.id) : [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              WORKFLOW B
            </span>
            <span className="text-xs text-gray-400">Target: {repo.fullName}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">PR Review Hub & Human Gate</h1>
          <p className="text-sm text-gray-400 mt-1">
            Multi-agent adversarial review loop with automated correction agent iterations and human approval.
          </p>
        </div>

        {pr && (
          <div className="flex items-center gap-3">
            <form action={async () => {
              'use server';
              await ApiClient.triggerReview(pr.id);
            }}>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161926] hover:bg-[#1d2133] text-gray-200 border border-[#22273d] text-sm font-semibold transition-all"
              >
                <RotateCw className="w-4 h-4 text-purple-400" />
                <span>Rerun Adversarial Review</span>
              </button>
            </form>

            <form action={async () => {
              'use server';
              await ApiClient.approvePullRequest(pr.id);
            }}>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Grant Human Sign-Off</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Main PR Detail Card */}
      {pr && (
        <div className="p-6 rounded-2xl bg-[#11131c] border border-[#1e2235] space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[#1e2235]">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-white">#{pr.githubPrNumber}</span>
                <h2 className="text-lg font-semibold text-white">{pr.title}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI: {pr.aiReviewStatus}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  HUMAN: {pr.humanApprovalStatus}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                <span>Branch: <span className="text-indigo-400">{pr.sourceBranch}</span></span>
                <span>→</span>
                <span>Target: <span className="text-gray-300">{pr.targetBranch}</span></span>
                <span>•</span>
                <span>Author: {pr.authorLogin}</span>
              </div>
            </div>

            <a
              href={pr.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d0f18] border border-[#1e2235] text-xs text-gray-300 hover:text-white transition-colors"
            >
              <span>Inspect on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Adversarial Review Iterations Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-gray-400">
              Review & Correction Loop History
            </h3>

            {/* Iteration 1 */}
            <div className="p-5 rounded-xl bg-[#0d0f18] border border-[#1b1e2e] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-semibold text-white">Iteration 1: Initial Adversarial Review</span>
                  <span className="text-xs text-gray-400 font-mono">(Gemini 2.0 Flash)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  CHANGES REQUESTED
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Adversarial reviewer identified missing integration unit test asserting rejection of malformed SQL payloads.
              </p>
              <div className="p-3 rounded bg-[#08090e] border border-[#181b28] text-xs text-rose-300 font-mono">
                Review Comment: Add regression spec under tests/auth.spec.ts verifying SQL payload denial.
              </div>
            </div>

            {/* Iteration 2 */}
            <div className="p-5 rounded-xl bg-[#0d0f18] border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-white">Iteration 2: Correction & Resolution</span>
                  <span className="text-xs text-gray-400 font-mono">(GPT-4o Correction Agent + Gemini 2.0 Verification)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  APPROVED
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Correction agent pushed commit <code className="text-indigo-400 font-mono">c781fe0</code> adding parameterized query and integration tests. All checks passing. Zero unresolved blocking findings remain.
              </p>
            </div>
          </div>

          {/* Human Gate Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/20 to-[#0d0f18] border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-white">Human Approval Gate Enforced</span>
                <span className="block text-xs text-gray-400">
                  DevForge never auto-merges to main. Human review and explicit merge on GitHub are required.
                </span>
              </div>
            </div>
            <form action={async () => {
              'use server';
              await ApiClient.approvePullRequest(pr.id);
            }}>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                Sign Off & Ready to Merge
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
