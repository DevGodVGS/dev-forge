import React from 'react';
import { Bot, Shield, Wrench, Cpu, Sliders } from 'lucide-react';
import { ApiClient } from '../../lib/api-client';

export default async function AgentsPage() {
  const agents = await ApiClient.getAgents();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
            ENGINEERING ORG
          </span>
          <span className="text-xs text-gray-400">{agents.length} Specialized Agents Configured</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Agent Center & Registry</h1>
        <p className="text-sm text-gray-400 mt-1">
          Specialized development agents assigned to independent workstreams with deterministic tool access and provider routing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="p-5 rounded-xl bg-[#11131c] border border-[#1e2235] space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">{agent.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <span className="font-mono text-indigo-400">{agent.role}</span>
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                {agent.defaultProvider}
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">{agent.description}</p>

            <div className="p-3 rounded-lg bg-[#0d0f18] border border-[#1b1e2e] space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-gray-400" />
                  Allocated Model:
                </span>
                <span className="text-white font-mono">{agent.defaultModel}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sliders className="w-3.5 h-3.5 text-gray-400" />
                  Temperature / Max Tokens:
                </span>
                <span className="text-gray-300 font-mono">{agent.temperature} / {agent.maxTokens}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1e2235]">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2 font-medium">
                <Wrench className="w-3.5 h-3.5 text-gray-500" />
                <span>Permitted Sandboxed Tools:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {agent.allowedTools.map((tool, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-[#131622] text-gray-300 text-[11px] font-mono border border-[#1e2235]">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
