import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Settings, 
  HelpCircle, 
  Shield, 
  Cpu, 
  HardDrive, 
  Database, 
  Activity,
  History,
  UserCheck,
  UserPlus
} from 'lucide-react';
import type { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  currentUser?: User | null;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed,
  currentUser,
  onOpenAuth 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-search', label: 'New Search', icon: Search },
    { id: 'history', label: 'Search History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help / About', icon: HelpCircle },
  ];

  return (
    <aside className={`bg-[#0d1117] border-r border-[#1e293b] flex flex-col transition-all duration-300 z-20 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 text-left hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg text-slate-100 tracking-wider font-mono">FindTrace <span className="text-cyan-400">AI</span></h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Search • Track • Verify</p>
            </div>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161b22]'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        {/* Quick Auth Section in Sidebar */}
        <div className="pt-3 mt-3 border-t border-[#1e293b]/70 space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-[10px] uppercase font-mono text-slate-500 tracking-wider font-semibold">
              Authentication
            </p>
          )}
          <button
            onClick={() => onOpenAuth ? onOpenAuth('signin') : setActiveTab('login')}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/40'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-[#161b22]'
            }`}
            title="Sign In"
          >
            <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            {!isCollapsed && <span>Sign In</span>}
          </button>

          <button
            onClick={() => onOpenAuth ? onOpenAuth('signup') : setActiveTab('login')}
            className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold text-slate-400 hover:text-emerald-300 hover:bg-[#161b22] transition-all cursor-pointer"
            title="Sign Up"
          >
            <UserPlus className="w-4 h-4 text-emerald-400 shrink-0" />
            {!isCollapsed && <span>Sign Up (Register)</span>}
          </button>
        </div>
      </nav>

      {/* System Diagnostics Status */}
      {!isCollapsed && (
        <div className="p-4 border-t border-[#1e293b] bg-[#0a0d14]/60 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase tracking-wider">
            <span>System Status</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between bg-[#161b22] px-2.5 py-1.5 rounded border border-slate-800">
              <span className="flex items-center gap-2 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                AI Engine
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Online
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#161b22] px-2.5 py-1.5 rounded border border-slate-800">
              <span className="flex items-center gap-2 text-slate-300">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                Storage
              </span>
              <span className="text-emerald-400 text-[11px] font-mono">● Online</span>
            </div>
            <div className="flex items-center justify-between bg-[#161b22] px-2.5 py-1.5 rounded border border-slate-800">
              <span className="flex items-center gap-2 text-slate-300">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                Database
              </span>
              <span className="text-emerald-400 text-[11px] font-mono">● Online</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
