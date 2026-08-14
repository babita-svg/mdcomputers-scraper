import React from 'react';
import { Terminal, Eye, GitBranch, Layers, Github, ExternalLink, Download } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onDownloadScript: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onDownloadScript }) => {
  return (
    <header className="border-b border-[#1F2937] bg-[#0D0D0F]/90 backdrop-blur sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md font-mono font-bold text-lg border border-indigo-400/30">
              MD
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-semibold text-[#F8FAFC] tracking-tight">
                  MDComputers Scraper
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Python 3.10+
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] hidden sm:block">
                E-Commerce Catalog & Price Intelligence Scraper
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2 bg-[#16161A] p-1 rounded-xl border border-[#27272A]">
            <button
              id="nav-tab-code"
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-[#27272A] text-[#F8FAFC] shadow-sm font-semibold border border-[#3F3F46]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#27272A]/40'
              }`}
            >
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Python Script</span>
            </button>

            <button
              id="nav-tab-preview"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'preview'
                  ? 'bg-[#27272A] text-[#F8FAFC] shadow-sm font-semibold border border-[#3F3F46]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#27272A]/40'
              }`}
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Data Playground</span>
            </button>

            <button
              id="nav-tab-github"
              onClick={() => setActiveTab('github')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'github'
                  ? 'bg-[#27272A] text-[#F8FAFC] shadow-sm font-semibold border border-[#3F3F46]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#27272A]/40'
              }`}
            >
              <GitBranch className="w-4 h-4 text-slate-300" />
              <span>GitHub Publish</span>
            </button>

            <button
              id="nav-tab-architecture"
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all hidden md:flex ${
                activeTab === 'architecture'
                  ? 'bg-[#27272A] text-[#F8FAFC] shadow-sm font-semibold border border-[#3F3F46]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#27272A]/40'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>DOM Schema</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-download-script-nav"
              onClick={onDownloadScript}
              className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl transition-all shadow-sm border border-indigo-500/30 cursor-pointer"
              title="Download Python script (.py)"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download .py</span>
            </button>

            <a
              id="btn-link-mdcomputers"
              href="https://mdcomputers.in/?route=product/search&search=external%20harddrive"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-[#94A3B8] hover:text-[#F8FAFC] bg-[#16161A] hover:bg-[#27272A] border border-[#27272A] px-3 py-2 rounded-xl transition-colors hidden lg:flex"
            >
              <span>Target Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
