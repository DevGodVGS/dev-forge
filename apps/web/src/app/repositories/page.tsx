import React from 'react';
import Link from 'next/link';
import { GitBranch, Shield, Lock, ExternalLink, Plus, CheckCircle2 } from 'lucide-react';
import { ApiClient } from '../../lib/api-client';

export default async function RepositoriesPage() {
  const repos = await ApiClient.getRepositories();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Connected Repositories</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage repositories integrated via GitHub App with automated auditing and remediation policies.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20">
          <Plus className="w-4 h-4" />
          <span>Connect Repository</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo) => (
          <div key={repo.id} className="p-5 rounded-xl bg-[#11131c] border border-[#1e2235] space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base hover:text-indigo-400 transition-colors">
                    {repo.fullName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3" /> Private
                    </span>
                    <span>•</span>
                    <span>Branch: {repo.defaultBranch}</span>
                    <span>•</span>
                    <span className="text-indigo-400 font-mono">{repo.language || 'TypeScript'}</span>
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#0d0f18] border border-[#1b1e2e] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Continuous Audit & Remediation Enabled</span>
              </div>
              <span className="text-gray-400 font-mono">Policy: STRICT</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1e2235]">
              <Link
                href={`/audits?repo=${repo.id}`}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                View Audit History →
              </Link>
              <a
                href={repo.cloneUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
