import React from 'react';
import { Layers, ShieldCheck, Code, Globe, Terminal, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ArchitectureDoc: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-[#111113] rounded-2xl p-6 border border-[#1F2937] shadow-sm">
        <div className="flex items-center space-x-2 text-indigo-400 mb-2">
          <Layers className="w-5 h-5" />
          <h3 className="text-base font-bold text-[#F8FAFC]">MDComputers DOM & OpenCart Architecture</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-3xl">
          MDComputers (<code className="bg-[#18181B] text-slate-300 px-1 py-0.5 rounded border border-[#27272A] font-mono">mdcomputers.in</code>) is powered by OpenCart with a responsive custom storefront theme.
          The Python scraper uses modular CSS selectors to withstand layout shifts and extract clean metadata.
        </p>
      </div>

      {/* Selector Breakdown Table */}
      <div className="bg-[#111113] rounded-2xl border border-[#1F2937] shadow-sm overflow-hidden">
        <div className="p-4 bg-[#0D0D0F] border-b border-[#1F2937]">
          <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
            Target CSS Selectors & Extraction Rules
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#16161A] text-[#94A3B8] font-semibold border-b border-[#1F2937]">
              <tr>
                <th className="py-2.5 px-4">Field</th>
                <th className="py-2.5 px-4">Primary CSS Selector</th>
                <th className="py-2.5 px-4">Fallback Selector</th>
                <th className="py-2.5 px-4">Parsing Logic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937] text-[#E2E8F0] font-mono text-[11px]">
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-[#F8FAFC]">Product Card</td>
                <td className="py-3 px-4 text-indigo-400">.product-layout</td>
                <td className="py-3 px-4 text-slate-400">.product-item-container</td>
                <td className="py-3 px-4 font-sans text-[#94A3B8]">Card container wrapper</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-[#F8FAFC]">Title</td>
                <td className="py-3 px-4 text-indigo-400">h4 a</td>
                <td className="py-3 px-4 text-slate-400">.title a, .name a</td>
                <td className="py-3 px-4 font-sans text-[#94A3B8]">Extracted as clean text strip</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-[#F8FAFC]">Product Link</td>
                <td className="py-3 px-4 text-indigo-400">h4 a[href]</td>
                <td className="py-3 px-4 text-slate-400">a.product-img</td>
                <td className="py-3 px-4 font-sans text-[#94A3B8]">urljoin(BASE_URL, href)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-[#F8FAFC]">Selling Price</td>
                <td className="py-3 px-4 text-indigo-400">.price-new</td>
                <td className="py-3 px-4 text-slate-400">.price</td>
                <td className="py-3 px-4 font-sans text-[#94A3B8]">Regex clean digits to integer INR</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-[#F8FAFC]">MRP / Old Price</td>
                <td className="py-3 px-4 text-indigo-400">.price-old</td>
                <td className="py-3 px-4 text-slate-400">fallback to Selling Price</td>
                <td className="py-3 px-4 font-sans text-[#94A3B8]">Used for % discount calculation</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-[#F8FAFC]">Image Thumbnail</td>
                <td className="py-3 px-4 text-indigo-400">.image img[src]</td>
                <td className="py-3 px-4 text-slate-400">img[data-src]</td>
                <td className="py-3 px-4 font-sans text-[#94A3B8]">Lazy load fallback handling</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-[#F8FAFC]">Stock Availability</td>
                <td className="py-3 px-4 text-indigo-400">.stock, .label-stock</td>
                <td className="py-3 px-4 text-slate-400">button[disabled]</td>
                <td className="py-3 px-4 font-sans text-[#94A3B8]">Classifies In Stock vs Out of Stock</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-[#F8FAFC]">Pagination</td>
                <td className="py-3 px-4 text-indigo-400">.pagination li.active + li</td>
                <td className="py-3 px-4 text-slate-400">ul.pagination a[rel='next']</td>
                <td className="py-3 px-4 font-sans text-[#94A3B8]">Query param <code className="text-indigo-300 bg-[#18181B] px-1 py-0.5 rounded border border-[#27272A]">&page=N</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Practices & Polite Scraping Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#111113] rounded-2xl p-5 border border-[#1F2937] shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">Polite Crawler Best Practices</h4>
          </div>
          <ul className="text-xs text-[#94A3B8] space-y-2">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-[#F8FAFC]">Realistic Headers:</strong> Includes standard Desktop Chrome User-Agent, Accept, and Referer headers.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-[#F8FAFC]">Request Throttling:</strong> Incorporates a default 1.5-second sleep interval between pagination requests.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-[#F8FAFC]">Session Reuse:</strong> Utilizes <code className="text-indigo-300 bg-[#18181B] px-1 py-0.5 rounded border border-[#27272A]">requests.Session()</code> for TCP connection reuse and lower latency.</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#111113] rounded-2xl p-5 border border-[#1F2937] shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">Error Recovery & Edge Cases</h4>
          </div>
          <ul className="text-xs text-[#94A3B8] space-y-2">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong className="text-[#F8FAFC]">Missing Old Price:</strong> When products are not discounted, MRP safely falls back to current price.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong className="text-[#F8FAFC]">Empty Result Detection:</strong> Gracefully checks for <code className="text-indigo-300 bg-[#18181B] px-1 py-0.5 rounded border border-[#27272A]">.content-empty</code> or 0 card conditions without crashing.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong className="text-[#F8FAFC]">Deduplication:</strong> Uses a <code className="text-indigo-300 bg-[#18181B] px-1 py-0.5 rounded border border-[#27272A]">seen_urls</code> hash set to guarantee 0 duplicate entries.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
