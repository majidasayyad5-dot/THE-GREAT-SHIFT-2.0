import React from 'react';
import { NavSection } from '../../types/bi';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface SiteFooterProps {
  onNavigate: (section: NavSection) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-16 bg-[#091124] text-white border-t border-slate-800 rounded-3xl p-8 sm:p-12 font-sans select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Brand & Subtitle */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-white">
              THE GREAT SHIFT 2.0
            </span>
          </div>
          <p className="text-xs text-slate-400">
            AI Business Intelligence &amp; Growth Analyzer
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-mono pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>AI analyzes. Humans decide.</span>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-300">
          <button
            onClick={() => onNavigate('dashboard')}
            className="hover:text-teal-400 transition-colors cursor-pointer"
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('my_business')}
            className="hover:text-teal-400 transition-colors cursor-pointer"
          >
            Business Profile
          </button>
          <button
            onClick={() => onNavigate('manage_affairs')}
            className="hover:text-teal-400 transition-colors cursor-pointer"
          >
            Manage Affairs
          </button>
          <button
            onClick={() => onNavigate('analyze')}
            className="hover:text-teal-400 transition-colors cursor-pointer"
          >
            Analyze Data
          </button>
          <button
            onClick={() => onNavigate('insights')}
            className="hover:text-teal-400 transition-colors cursor-pointer"
          >
            Insights
          </button>
          <button
            onClick={() => onNavigate('methodology')}
            className="hover:text-teal-400 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="hover:text-teal-400 transition-colors cursor-pointer"
          >
            Settings
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
        <span>© 2026 THE GREAT SHIFT 2.0. Created by <strong>Majida Sayyad</strong> (B.Com IT • First Year).</span>
        <span>Zero Exposure Protocol · No Bank or Card Credentials Requested</span>
      </div>
    </footer>
  );
};
