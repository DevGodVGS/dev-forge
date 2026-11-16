'use client';

import React from 'react';
import { Bell, ShieldCheck, Terminal } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-[#1e2235] bg-[#0d0f18]/80 backdrop-blur px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#131622] border border-[#1e2235] text-xs text-gray-300">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-gray-400">Org:</span>
          <span className="font-semibold text-white">Acme Engineering</span>
          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">ENTERPRISE</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Human Gate Active (No Auto-Merge)</span>
        </div>

        <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#151824] transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-1.5 right-1.5 ring-2 ring-[#0d0f18]" />
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-[#1e2235]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            AR
          </div>
          <div className="text-left hidden md:block">
            <span className="block text-xs font-semibold text-white">Alex Rivera</span>
            <span className="block text-[10px] text-gray-400">Principal Architect</span>
          </div>
        </div>
      </div>
    </header>
  );
}
