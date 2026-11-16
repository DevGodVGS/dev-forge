'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GitBranch, 
  Shield, 
  Lock, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  Loader2,
  Search
} from 'lucide-react';
import { ApiClient } from '../../lib/api-client';
import { Repository } from '@devforge/shared-types';

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [fullName, setFullName] = useState('');
  const [cloneUrl, setCloneUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadRepositories();
  }, []);

  async function loadRepositories() {
    setLoading(true);
    try {
      const data = await ApiClient.getRepositories();
      setRepos(data || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }

  function validateFullName(val: string): boolean {
    const regex = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
    return regex.test(val.trim());
  }

  function handleFullNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setFullName(val);
    if (val && !cloneUrl) {
      setCloneUrl(`https://github.com/${val.trim()}.git`);
    }
    if (errorMessage) setErrorMessage('');
  }

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    if (!validateFullName(fullName)) {
      setErrorMessage('Repository name must be in "owner/repository" format (e.g., DevGodVGS/dev-forge).');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    try {
      const newRepo = await ApiClient.connectRepository(fullName.trim(), cloneUrl.trim() || undefined);
      setRepos(prev => [newRepo, ...prev.filter(r => r.id !== newRepo.id)]);
      setSuccessMessage(`Successfully connected ${fullName.trim()}!`);
      setTimeout(() => {
        setSuccessMessage('');
        setModalOpen(false);
        setFullName('');
        setCloneUrl('');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect repository.');
    } finally {
      setSubmitting(false);
    }
  }

  const filteredRepos = repos.filter(r => 
    r.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Connected Repositories</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage repositories integrated via GitHub App with automated auditing and remediation policies.
          </p>
        </div>
        <button 
          onClick={() => { setModalOpen(true); setErrorMessage(''); setSuccessMessage(''); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Connect Repository</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 bg-[#11131c] border border-[#1e2235] px-4 py-2 rounded-xl">
        <Search className="w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Filter repositories by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none text-sm text-white placeholder-gray-500 focus:outline-none w-full"
        />
      </div>

      {/* Repositories Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-gray-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          <span>Loading repositories...</span>
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="p-8 text-center bg-[#11131c] border border-[#1e2235] rounded-xl text-gray-400">
          <p>No repositories match your filter or none connected yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.map((repo) => (
            <div key={repo.id} className="p-5 rounded-xl bg-[#11131c] border border-[#1e2235] space-y-4 hover:border-indigo-500/40 transition-colors">
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
      )}

      {/* Connect Repository Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#11131c] border border-[#1e2235] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2235]">
              <div className="flex items-center gap-2 text-white font-semibold">
                <GitBranch className="w-5 h-5 text-indigo-400" />
                <span>Connect GitHub Repository</span>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConnect} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Repository Full Name <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. DevGodVGS/dev-forge"
                  value={fullName}
                  onChange={handleFullNameChange}
                  className="w-full px-3 py-2 bg-[#0d0f18] border border-[#1e2235] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Target repository format: &lt;organization-or-user&gt;/&lt;repository-name&gt;
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Clone URL (Git HTTPS)
                </label>
                <input 
                  type="text"
                  placeholder="https://github.com/DevGodVGS/dev-forge.git"
                  value={cloneUrl}
                  onChange={(e) => setCloneUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d0f18] border border-[#1e2235] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Default Branch</label>
                  <input 
                    type="text" 
                    value="main" 
                    disabled 
                    className="w-full px-3 py-2 bg-[#0d0f18]/60 border border-[#1b1e2e] rounded-xl text-xs text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Policy Profile</label>
                  <input 
                    type="text" 
                    value="STRICT (Automated Audit & Remediation)" 
                    disabled 
                    className="w-full px-3 py-2 bg-[#0d0f18]/60 border border-[#1b1e2e] rounded-xl text-xs text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e2235]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Connect Repository</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
