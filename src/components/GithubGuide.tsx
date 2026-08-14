import React, { useState } from 'react';
import { 
  Github, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  FolderGit2, 
  Share2, 
  ArrowRight, 
  CheckCircle2, 
  Laptop, 
  Sparkles,
  Layers
} from 'lucide-react';

export const GithubGuide: React.FC = () => {
  const [username, setUsername] = useState('kumarib4351');
  const [repoName, setRepoName] = useState('mdcomputers-scraper');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const repoUrl = `https://github.com/${username.trim() || '<username>'}/${repoName.trim() || 'mdcomputers-scraper'}`;

  const gitCommands = `# 1. Initialize Git repository
git init

# 2. Add all scraper code and documentation files
git add mdcomputers_scraper.py requirements.txt README.md .gitignore

# 3. Commit the code
git commit -m "feat: initial commit of MDComputers Python web scraper"

# 4. Set default branch to main
git branch -M main

# 5. Link to your GitHub remote repository
git remote add origin ${repoUrl}.git

# 6. Push code to GitHub
git push -u origin main`;

  const ghCliCommand = `gh repo create ${repoName} --public --source=. --remote=origin --push`;

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Shareable Link Box */}
      <div className="bg-gradient-to-r from-[#111113] via-[#18181B] to-[#111113] rounded-2xl p-6 text-white border border-[#1F2937] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Your Shareable GitHub Link
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
              Publish & Share Your MDComputers Scraper Code
            </h3>
            <p className="text-xs text-[#94A3B8] max-w-xl leading-relaxed">
              Once pushed to GitHub, your repository will be publicly accessible at the link below:
            </p>
            <div className="flex items-center space-x-2 font-mono text-xs sm:text-sm bg-[#0A0A0B] px-3.5 py-2.5 rounded-xl border border-[#27272A] text-indigo-300">
              <Github className="w-4 h-4 text-white shrink-0" />
              <span className="truncate">{repoUrl}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              id="btn-copy-repo-url"
              onClick={() => handleCopy(repoUrl, 'repoUrl')}
              className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm border border-indigo-500/30 cursor-pointer"
            >
              {copiedSection === 'repoUrl' ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedSection === 'repoUrl' ? 'Link Copied!' : 'Copy Shareable Link'}</span>
            </button>

            <a
              id="btn-open-github-new"
              href="https://github.com/new"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-[#18181B] hover:bg-[#27272A] text-[#E2E8F0] text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-[#27272A] hover:border-[#3F3F46]"
            >
              <span>Create on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Dynamic Link Configurator */}
      <div className="bg-[#111113] rounded-2xl p-5 border border-[#1F2937] shadow-sm">
        <h4 className="text-sm font-semibold text-[#F8FAFC] mb-3 flex items-center space-x-2">
          <FolderGit2 className="w-4 h-4 text-indigo-400" />
          <span>Configure Repository Metadata</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1">
              GitHub Username / Organization
            </label>
            <input
              id="input-github-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. your-github-handle"
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-[#27272A] bg-[#18181B] text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1">
              Repository Name
            </label>
            <input
              id="input-github-reponame"
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="e.g. mdcomputers-scraper"
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-[#27272A] bg-[#18181B] text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Step by Step Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method 1: AI Studio Direct Export */}
        <div className="bg-[#111113] rounded-2xl p-5 sm:p-6 border border-[#1F2937] shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              <span>Method 1 (Fastest)</span>
            </div>
            <h4 className="text-base font-bold text-[#F8FAFC]">
              Direct AI Studio GitHub Export
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Export this exact workspace with the Python scraper, dependencies, and configuration directly into a new GitHub repository:
            </p>

            <ol className="text-xs text-[#CBD5E1] space-y-2.5 list-decimal list-inside bg-[#0D0D0F] p-4 rounded-xl border border-[#1F2937]">
              <li>
                Click on the <strong className="text-white">Settings menu</strong> (top right in Google AI Studio).
              </li>
              <li>
                Select <strong className="text-white">Export to GitHub</strong>.
              </li>
              <li>
                Authorize your GitHub account and choose the repository name (e.g. <code className="text-indigo-400 bg-[#18181B] px-1 py-0.5 rounded">{repoName}</code>).
              </li>
              <li>
                AI Studio commits and pushes all files automatically.
              </li>
            </ol>
          </div>

          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center space-x-2 text-xs text-indigo-300">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Includes <code>mdcomputers_scraper.py</code>, <code>requirements.txt</code>, and <code>README.md</code>.</span>
          </div>
        </div>

        {/* Method 2: Terminal / Git CLI */}
        <div className="bg-[#111113] rounded-2xl p-5 sm:p-6 border border-[#1F2937] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#18181B] text-[#94A3B8] border border-[#27272A]">
              <Terminal className="w-3 h-3 text-indigo-400" />
              <span>Method 2</span>
            </div>
            <button
              id="btn-copy-git-commands"
              onClick={() => handleCopy(gitCommands, 'gitCommands')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1 cursor-pointer"
            >
              {copiedSection === 'gitCommands' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'gitCommands' ? 'Copied Steps!' : 'Copy Commands'}</span>
            </button>
          </div>

          <h4 className="text-base font-bold text-[#F8FAFC]">
            Standard Git Terminal Workflow
          </h4>

          <div className="bg-[#0A0A0B] rounded-xl p-3.5 text-[#CBD5E1] font-mono text-[11px] overflow-x-auto leading-relaxed border border-[#27272A]">
            <pre>{gitCommands}</pre>
          </div>

          {/* GitHub CLI alternative */}
          <div className="pt-2 border-t border-[#1F2937]">
            <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
              <span className="font-semibold text-[#F8FAFC]">Or using GitHub CLI (gh):</span>
              <button
                onClick={() => handleCopy(ghCliCommand, 'ghCli')}
                className="text-indigo-400 hover:underline text-[11px] cursor-pointer"
              >
                {copiedSection === 'ghCli' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="bg-[#0A0A0B] text-indigo-300 font-mono text-[11px] p-2 rounded-lg border border-[#27272A]">
              $ {ghCliCommand}
            </div>
          </div>
        </div>
      </div>

      {/* Files in Repository Checklist */}
      <div className="bg-[#111113] rounded-2xl p-5 border border-[#1F2937] shadow-sm">
        <h4 className="text-sm font-semibold text-[#F8FAFC] mb-3 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Files Ready for GitHub Repository</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-[#0D0D0F] rounded-xl border border-[#1F2937]">
            <div className="font-mono text-xs font-bold text-[#F8FAFC]">mdcomputers_scraper.py</div>
            <div className="text-[11px] text-[#94A3B8] mt-1">Core scraping engine & CLI parser</div>
          </div>
          <div className="p-3 bg-[#0D0D0F] rounded-xl border border-[#1F2937]">
            <div className="font-mono text-xs font-bold text-[#F8FAFC]">requirements.txt</div>
            <div className="text-[11px] text-[#94A3B8] mt-1">requests, beautifulsoup4, pandas</div>
          </div>
          <div className="p-3 bg-[#0D0D0F] rounded-xl border border-[#1F2937]">
            <div className="font-mono text-xs font-bold text-[#F8FAFC]">README.md</div>
            <div className="text-[11px] text-[#94A3B8] mt-1">Usage, CLI flags & documentation</div>
          </div>
          <div className="p-3 bg-[#0D0D0F] rounded-xl border border-[#1F2937]">
            <div className="font-mono text-xs font-bold text-[#F8FAFC]">.gitignore</div>
            <div className="text-[11px] text-[#94A3B8] mt-1">Standard Python & Node ignores</div>
          </div>
        </div>
      </div>
    </div>
  );
};
