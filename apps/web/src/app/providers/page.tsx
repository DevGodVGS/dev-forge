import React from 'react';
import { Cpu, Zap, Activity, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';
import { ApiClient } from '../../lib/api-client';

export default async function ProvidersPage() {
  const data = await ApiClient.getProviders();
  const models = data.models || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
            MULTI-PROVIDER
          </span>
          <span className="text-xs text-gray-400">Zero Single-Vendor Lock-in</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Providers & Model Fabric</h1>
        <p className="text-sm text-gray-400 mt-1">
          Unified adapter abstraction supporting Anthropic Claude, OpenAI GPT-4o, and Google Gemini with dynamic fallback and real-time token cost accounting.
        </p>
      </div>

      {/* Provider Connectivity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'Anthropic Claude', provider: 'ANTHROPIC', status: 'HEALTHY', latency: '85ms', defaultModel: 'claude-3-5-sonnet' },
          { name: 'OpenAI GPT', provider: 'OPENAI', status: 'HEALTHY', latency: '90ms', defaultModel: 'gpt-4o' },
          { name: 'Google Gemini', provider: 'GEMINI', status: 'HEALTHY', latency: '60ms', defaultModel: 'gemini-2.0-flash' }
        ].map((p, i) => (
          <div key={i} className="p-5 rounded-xl bg-[#11131c] border border-[#1e2235] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-base">{p.name}</span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {p.status}
              </span>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Default Model: <span className="text-gray-200 font-mono">{p.defaultModel}</span></div>
              <div>Adapter Ping Latency: <span className="text-emerald-400 font-mono">{p.latency}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Models & Pricing Registry */}
      <div className="p-6 rounded-2xl bg-[#11131c] border border-[#1e2235] space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span>Active Model Registry & Token Economics</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1e2235] text-gray-400 font-mono">
                <th className="py-3 px-4">Model Name</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Context Window</th>
                <th className="py-3 px-4">Max Output</th>
                <th className="py-3 px-4">Input Cost / 1M</th>
                <th className="py-3 px-4">Output Cost / 1M</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2235]">
              {models.map((m: any) => (
                <tr key={m.id} className="hover:bg-[#151824] transition-colors">
                  <td className="py-3 px-4 font-semibold text-white font-mono">{m.name}</td>
                  <td className="py-3 px-4 text-indigo-400 font-mono">{m.provider}</td>
                  <td className="py-3 px-4 text-gray-300 font-mono">{m.contextWindow.toLocaleString()} tokens</td>
                  <td className="py-3 px-4 text-gray-300 font-mono">{m.maxOutputTokens.toLocaleString()} tokens</td>
                  <td className="py-3 px-4 text-emerald-400 font-mono">${m.promptCostPer1M.toFixed(2)}</td>
                  <td className="py-3 px-4 text-emerald-400 font-mono">${m.completionCostPer1M.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
