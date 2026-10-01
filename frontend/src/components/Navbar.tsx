import React, { useState } from 'react';
import { Search, Play, UserCheck, Bell, Sparkles, LogOut, ChevronDown, Shield, BadgeCheck } from 'lucide-react';
import type { User } from '../types';

interface NavbarProps {
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  onRunDemo: () => void;
  onNewSearchClick: () => void;
  currentUser: User | null;
  onLogout: () => void;
  onSwitchUser: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  demoMode, 
  setDemoMode, 
  onRunDemo, 
  currentUser,
  onLogout,
  onSwitchUser
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-[#0d1117] border-b border-[#1e293b] px-6 flex items-center justify-between z-10">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-72 sm:w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cases, camera IDs, or candidates..."
            className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Demo Search Action */}
        <button
          onClick={onRunDemo}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Run Demo Search</span>
        </button>

        {/* Demo Mode Toggle */}
        <div className="hidden sm:flex items-center gap-2 bg-[#161b22] px-3 py-1.5 rounded-lg border border-[#1e293b]">
          <span className="text-[11px] font-mono font-semibold uppercase text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Demo Mode
          </span>
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
              demoMode ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                demoMode ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Notifications */}
        <button className="w-9 h-9 rounded-lg bg-[#161b22] border border-[#1e293b] flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-2 right-2 animate-ping" />
        </button>

        {/* User Info with Interactive Dropdown */}
        <div className="relative pl-3 border-l border-[#1e293b]">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#161b22] transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-cyan-600 border border-cyan-400/40 flex items-center justify-center text-white font-bold text-xs shadow-md">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-slate-200 leading-tight">
                {currentUser?.name || 'Investigator Miller'}
              </p>
              <p className="text-[10px] text-cyan-400 font-mono">
                {currentUser?.badge_number || 'SOC-LEAD-007'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Popover Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#121824] border border-[#1e293b] rounded-xl shadow-2xl p-3 z-50 space-y-2 font-mono">
              <div className="pb-2 border-b border-[#1e293b]">
                <p className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  {currentUser?.name || 'Senior Investigator Miller'}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {currentUser?.email || 'demo@findtrace.ai'}
                </p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded w-max">
                  <BadgeCheck className="w-3 h-3" />
                  {currentUser?.agency || 'Metropolitan CCTV Unit'}
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onSwitchUser();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-[#161b22] hover:text-cyan-400 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Switch Account / Sign In</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-red-400 hover:bg-red-950/30 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
