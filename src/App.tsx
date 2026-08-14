import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CodeViewer } from './components/CodeViewer';
import { ScraperPreview } from './components/ScraperPreview';
import { GithubGuide } from './components/GithubGuide';
import { ArchitectureDoc } from './components/ArchitectureDoc';
import { ActiveTab, ScraperConfig } from './types';
import { generatePythonScript } from './utils/pythonCode';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('code');
  const [config, setConfig] = useState<ScraperConfig>({
    searchTerm: 'external harddrive',
    pages: 2,
    outputFormat: 'csv',
    delay: 1.5,
    timeout: 15,
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  });

  const handleDownloadScript = () => {
    const script = generatePythonScript(config);
    const element = document.createElement('a');
    const file = new Blob([script], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'mdcomputers_scraper.py';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E2E8F0] flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadScript={handleDownloadScript}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'code' && (
          <CodeViewer config={config} setConfig={setConfig} />
        )}

        {activeTab === 'preview' && (
          <ScraperPreview currentQuery={config.searchTerm} />
        )}

        {activeTab === 'github' && <GithubGuide />}

        {activeTab === 'architecture' && <ArchitectureDoc />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1F2937] bg-[#111113] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#F8FAFC]">MDComputers Scraper Suite</span>
            <span>•</span>
            <span>Target: <code className="text-indigo-400 font-mono">mdcomputers.in</code></span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('code')}
              className="hover:text-[#F8FAFC] transition-colors"
            >
              Python Code
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className="hover:text-[#F8FAFC] transition-colors"
            >
              Results Explorer
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className="hover:text-[#F8FAFC] transition-colors"
            >
              GitHub Setup
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
