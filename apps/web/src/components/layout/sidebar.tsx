'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  GitBranch, 
  ShieldAlert, 
  GitPullRequest, 
  Bot, 
  Cpu, 
  Settings,
  Sparkles
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/repositories', label: 'Repositories', icon: GitBranch },
  { href: '/audits', label: 'Audit Center', icon: ShieldAlert },
  { href: '/pull-requests', label: 'PR Review Hub', icon: GitPullRequest },
  { href: '/agents', label: 'AI Agent Center', icon: Bot },
  { href: '/providers', label: 'AI Providers & Models', icon: Cpu },
  { href: '/settings', label: 'Organization & Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[#1e2235] bg-[#0d0f18] flex flex-col h-screen select-none">
      <div className="h-16 flex items-center px-6 border-b border-[#1e2235] gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-base tracking-tight text-white block">DevForge</span>
          <span className="text-[10px] text-gray-400 font-mono tracking-wider block">AUTONOMOUS AI SAAS</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#151824]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1e2235]">
        <div className="bg-[#131622] p-3 rounded-lg border border-[#1e2235]">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Control Plane</span>
            <span className="text-emerald-400 font-mono text-[10px]">HEALTHY</span>
          </div>
          <p className="text-[11px] text-gray-500">PostgreSQL + Redis + Multi-AI</p>
        </div>
      </div>
    </aside>
  );
}
