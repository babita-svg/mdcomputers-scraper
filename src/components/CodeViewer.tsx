import React, { useState } from 'react';
import { Copy, Check, Download, Play, Terminal, Sliders, RefreshCw, FileCode, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ScraperConfig } from '../types';
import { generatePythonScript } from '../utils/pythonCode';

interface CodeViewerProps {
  config: ScraperConfig;
  setConfig: React.Dispatch<React.SetStateAction<ScraperConfig>>;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ config, setConfig }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'script' | 'requirements' | 'quickstart'>('script');

  const pythonScript = generatePythonScript(config);

  const requirementsTxt = `requests>=2.31.0
beautifulsoup4>=4.12.0
pandas>=2.0.0
lxml>=5.0.0
tabulate>=0.9.0`;

  const runCommand = `python mdcomputers_scraper.py --search "${config.searchTerm}" --pages ${config.pages} --output mdcomputers_${config.searchTerm.toLowerCase().replace(/\s+/g, '_')}.${config.outputFormat}`;

  const handleCopyCode = () => {
    const textToCopy = activeSubTab === 'script' ? pythonScript : requirementsTxt;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(runCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Command Quick Runner */}
      <div className="bg-[#111113] text-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#1F2937]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                CLI Command
              </span>
              <span className="text-xs text-[#94A3B8]">Ready to execute in terminal</span>
            </div>
            <p className="text-sm text-slate-200 font-mono break-all bg-[#0A0A0B] px-3 py-2 rounded-lg border border-[#27272A]">
              $ {runCommand}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              id="btn-copy-cli-command"
              onClick={handleCopyCmd}
              className="inline-flex items-center space-x-1.5 bg-[#18181B] hover:bg-[#27272A] text-[#E2E8F0] text-xs font-medium px-3.5 py-2.5 rounded-xl transition-all border border-[#27272A] hover:border-[#3F3F46] cursor-pointer"
            >
              {copiedCmd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCmd ? 'Copied Command!' : 'Copy CLI Command'}</span>
            </button>

            <button
              id="btn-download-script-main"
              onClick={() => handleDownloadFile('mdcomputers_scraper.py', pythonScript)}
              className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm border border-indigo-500/30 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download .py</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters Sidebar + Code Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Configuration Controls */}
        <div className="lg:col-span-4 bg-[#111113] rounded-2xl p-5 border border-[#1F2937] shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Script Parameters</h3>
            </div>
            <button
              onClick={() =>
                setConfig({
                  searchTerm: 'external harddrive',
                  pages: 2,
                  outputFormat: 'csv',
                  delay: 1.5,
                  timeout: 15,
                  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                })
              }
              className="text-xs text-[#94A3B8] hover:text-indigo-400 flex items-center space-x-1 transition-colors cursor-pointer"
              title="Reset to defaults"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Term Input */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
              Search Query
            </label>
            <input
              id="input-config-search-term"
              type="text"
              value={config.searchTerm}
              onChange={(e) => setConfig((prev) => ({ ...prev, searchTerm: e.target.value }))}
              placeholder="e.g. external harddrive, RTX 4070"
              className="w-full text-sm px-3 py-2 rounded-xl border border-[#27272A] bg-[#18181B] text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-medium placeholder-slate-500"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['external harddrive', 'RTX 4070', 'DDR5 RAM', '1TB SSD', 'Cabinet'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setConfig((prev) => ({ ...prev, searchTerm: preset }))}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    config.searchTerm === preset
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-medium'
                      : 'bg-[#18181B] text-[#94A3B8] border-[#27272A] hover:bg-[#27272A] hover:text-[#F8FAFC]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Pages To Scrape */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#94A3B8]">Max Pages</label>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                {config.pages} {config.pages === 1 ? 'page' : 'pages'} (~{config.pages * 20} items)
              </span>
            </div>
            <input
              id="input-config-pages"
              type="range"
              min="1"
              max="5"
              step="1"
              value={config.pages}
              onChange={(e) => setConfig((prev) => ({ ...prev, pages: parseInt(e.target.value) || 1 }))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] mt-0.5">
              <span>1 page</span>
              <span>3 pages</span>
              <span>5 pages</span>
            </div>
          </div>

          {/* Output Format */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['csv', 'json'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setConfig((prev) => ({ ...prev, outputFormat: fmt }))}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    config.outputFormat === fmt
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm font-semibold'
                      : 'bg-[#18181B] text-[#94A3B8] border-[#27272A] hover:bg-[#27272A] hover:text-[#F8FAFC]'
                  }`}
                >
                  <span className="uppercase font-mono font-bold">{fmt}</span>
                  <span className="text-[11px] opacity-80">
                    {fmt === 'csv' ? '(Spreadsheet)' : '(Structured)'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Crawl Delay */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#94A3B8]">Polite Crawl Delay</label>
              <span className="text-xs font-mono font-medium text-indigo-400">
                {config.delay}s / request
              </span>
            </div>
            <input
              id="input-config-delay"
              type="range"
              min="0.5"
              max="4.0"
              step="0.5"
              value={config.delay}
              onChange={(e) => setConfig((prev) => ({ ...prev, delay: parseFloat(e.target.value) || 1.0 }))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-[#64748B] mt-1">
              Prevents IP rate-limiting by pacing consecutive page requests.
            </p>
          </div>

          {/* Built-in Features Checklist */}
          <div className="bg-[#0D0D0F] p-3.5 rounded-xl border border-[#1F2937] space-y-2">
            <h4 className="text-xs font-semibold text-[#F8FAFC] flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scraper Architecture Specs</span>
            </h4>
            <ul className="text-[11px] text-[#94A3B8] space-y-1.5">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>OpenCart DOM parser (`.product-layout`)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Clean INR Currency extraction (₹)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Automated Discount % & MRP math</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Stock availability & cart button parser</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Code Display & File Switcher */}
        <div className="lg:col-span-8 bg-[#111113] rounded-2xl border border-[#1F2937] shadow-sm overflow-hidden flex flex-col">
          {/* File Tab Header */}
          <div className="bg-[#0D0D0F] px-4 py-3 border-b border-[#1F2937] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveSubTab('script')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  activeSubTab === 'script'
                    ? 'bg-[#1F2937] text-indigo-300 font-semibold border border-[#374151]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>mdcomputers_scraper.py</span>
              </button>

              <button
                onClick={() => setActiveSubTab('requirements')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  activeSubTab === 'requirements'
                    ? 'bg-[#1F2937] text-indigo-300 font-semibold border border-[#374151]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <span>requirements.txt</span>
              </button>

              <button
                onClick={() => setActiveSubTab('quickstart')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  activeSubTab === 'quickstart'
                    ? 'bg-[#1F2937] text-indigo-300 font-semibold border border-[#374151]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>How to Run</span>
              </button>
            </div>

            {/* Copy / Download Actions */}
            <div className="flex items-center space-x-2">
              <button
                id="btn-copy-code-tab"
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-1.5 bg-[#18181B] hover:bg-[#27272A] text-[#E2E8F0] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border border-[#27272A] cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
              </button>

              {activeSubTab === 'script' && (
                <button
                  id="btn-download-script-secondary"
                  onClick={() => handleDownloadFile('mdcomputers_scraper.py', pythonScript)}
                  className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .py</span>
                </button>
              )}

              {activeSubTab === 'requirements' && (
                <button
                  onClick={() => handleDownloadFile('requirements.txt', requirementsTxt)}
                  className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download requirements.txt</span>
                </button>
              )}
            </div>
          </div>

          {/* Code Viewer Body */}
          <div className="p-4 overflow-x-auto max-h-[620px] font-mono text-xs leading-relaxed text-[#CBD5E1] bg-[#0A0A0B] select-text">
            {activeSubTab === 'script' && (
              <pre className="whitespace-pre">
                <code>{pythonScript}</code>
              </pre>
            )}

            {activeSubTab === 'requirements' && (
              <pre className="whitespace-pre">
                <code>{requirementsTxt}</code>
              </pre>
            )}

            {activeSubTab === 'quickstart' && (
              <div className="space-y-4 font-sans text-[#E2E8F0] py-2">
                <h4 className="text-sm font-semibold text-white">How to execute locally:</h4>
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-[#94A3B8] font-sans block mb-1">1. Install requirements:</span>
                    <div className="bg-[#111113] p-2.5 rounded-lg border border-[#1F2937] text-emerald-400">
                      pip install -r requirements.txt
                    </div>
                  </div>

                  <div>
                    <span className="text-[#94A3B8] font-sans block mb-1">2. Run with default search ("external harddrive"):</span>
                    <div className="bg-[#111113] p-2.5 rounded-lg border border-[#1F2937] text-emerald-400">
                      python mdcomputers_scraper.py
                    </div>
                  </div>

                  <div>
                    <span className="text-[#94A3B8] font-sans block mb-1">3. Custom search with 2 pages and CSV output:</span>
                    <div className="bg-[#111113] p-2.5 rounded-lg border border-[#1F2937] text-emerald-400">
                      python mdcomputers_scraper.py -s "external harddrive" -p 2 -o harddrives.csv
                    </div>
                  </div>

                  <div>
                    <span className="text-[#94A3B8] font-sans block mb-1">4. Custom search with JSON output:</span>
                    <div className="bg-[#111113] p-2.5 rounded-lg border border-[#1F2937] text-emerald-400">
                      python mdcomputers_scraper.py -s "rtx 4070" -p 1 -o rtx_gpus.json --format json
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
