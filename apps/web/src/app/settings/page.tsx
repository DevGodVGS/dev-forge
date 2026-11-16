import React from 'react';
import { Settings, ShieldCheck, Key, Users, Lock, GitBranch } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Organization & Security Governance</h1>
        <p className="text-sm text-gray-400 mt-1">
          Configure tenant boundaries, GitHub App installations, encryption keys, and autonomous safety boundaries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[#11131c] border border-[#1e2235] space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">Autonomous Safety Rules</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d0f18] border border-[#1b1e2e]">
              <div>
                <span className="block font-medium text-white">Human Approval Gate</span>
                <span className="block text-gray-400">Strictly disallow AI agents from merging to main</span>
              </div>
              <span className="text-emerald-400 font-mono font-semibold">ENFORCED</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d0f18] border border-[#1b1e2e]">
              <div>
                <span className="block font-medium text-white">Ephemeral Sandbox Isolation</span>
                <span className="block text-gray-400">Non-root containers for untrusted user code execution</span>
              </div>
              <span className="text-emerald-400 font-mono font-semibold">ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#11131c] border border-[#1e2235] space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">Credentials & Encryption</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d0f18] border border-[#1b1e2e]">
              <div>
                <span className="block font-medium text-white">Secret Encryption at Rest</span>
                <span className="block text-gray-400">AES-256-GCM + AWS KMS envelope encryption</span>
              </div>
              <span className="text-emerald-400 font-mono font-semibold">ENABLED</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d0f18] border border-[#1b1e2e]">
              <div>
                <span className="block font-medium text-white">GitHub App Signature Validation</span>
                <span className="block text-gray-400">HMAC-SHA256 timing-safe verification</span>
              </div>
              <span className="text-emerald-400 font-mono font-semibold">ENABLED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
