import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  ExternalLink, 
  Tag, 
  CheckCircle2, 
  XCircle, 
  ArrowUpDown, 
  Grid, 
  Table as TableIcon, 
  Code2, 
  Percent, 
  IndianRupee,
  Layers,
  Sparkles
} from 'lucide-react';
import { ScrapedProduct } from '../types';
import sampleData from '../example_data.json';

interface ScraperPreviewProps {
  currentQuery: string;
}

export const ScraperPreview: React.FC<ScraperPreviewProps> = ({ currentQuery }) => {
  const [products] = useState<ScrapedProduct[]>(sampleData as ScrapedProduct[]);
  const [filterText, setFilterText] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'discount'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'json'>('grid');

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesQuery =
          p.title.toLowerCase().includes(filterText.toLowerCase()) ||
          p.brand.toLowerCase().includes(filterText.toLowerCase()) ||
          p.description.toLowerCase().includes(filterText.toLowerCase());

        if (!matchesQuery) return false;

        if (stockFilter === 'in_stock') return p.stock_status === 'In Stock';
        if (stockFilter === 'out_of_stock') return p.stock_status !== 'In Stock';
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price_inr - b.price_inr;
        if (sortBy === 'price_desc') return b.price_inr - a.price_inr;
        if (sortBy === 'discount') return b.discount_percent - a.discount_percent;
        return 0;
      });
  }, [products, filterText, stockFilter, sortBy]);

  const handleExportCSV = () => {
    if (!filteredProducts.length) return;
    const headers = Object.keys(filteredProducts[0]).join(',');
    const rows = filteredProducts.map((p) =>
      Object.values(p)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mdcomputers_${currentQuery.replace(/\s+/g, '_')}_scraped.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredProducts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mdcomputers_${currentQuery.replace(/\s+/g, '_')}_scraped.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="bg-[#111113] rounded-2xl p-5 border border-[#1F2937] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Sample Query Output
              </span>
              <span className="text-xs text-[#94A3B8]">
                Extracted from <code className="bg-[#18181B] text-slate-300 px-1 py-0.5 rounded font-mono border border-[#27272A]">mdcomputers.in/?route=product/search&search={currentQuery}</code>
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#F8FAFC] mt-1">
              Scraped Results Explorer ({filteredProducts.length} Items)
            </h2>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-export-csv"
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3.5 py-2 rounded-xl transition-colors shadow-sm border border-indigo-500/30 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              id="btn-export-json"
              onClick={handleExportJSON}
              className="inline-flex items-center space-x-1.5 bg-[#18181B] hover:bg-[#27272A] text-[#E2E8F0] text-xs font-medium px-3.5 py-2 rounded-xl transition-colors border border-[#27272A] hover:border-[#3F3F46] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Filters and View Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-3 border-t border-[#1F2937] items-center">
          {/* Search filter */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by title, brand, spec..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#27272A] bg-[#18181B] text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
          </div>

          {/* Stock Filter */}
          <div className="lg:col-span-3">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full text-xs py-1.5 px-2.5 rounded-xl border border-[#27272A] bg-[#18181B] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="all">All Availability (In & Out of Stock)</option>
              <option value="in_stock">In Stock Only</option>
              <option value="out_of_stock">Out of Stock Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs py-1.5 px-2.5 rounded-xl border border-[#27272A] bg-[#18181B] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="default">Sort by Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Highest Discount %</option>
            </select>
          </div>

          {/* View Mode Buttons */}
          <div className="lg:col-span-2 flex justify-end space-x-1 bg-[#18181B] p-1 rounded-xl border border-[#27272A]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#27272A] text-[#F8FAFC] shadow-sm border border-[#3F3F46]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              title="Cards Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#27272A] text-[#F8FAFC] shadow-sm border border-[#3F3F46]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              title="Spreadsheet Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'json' ? 'bg-[#27272A] text-[#F8FAFC] shadow-sm border border-[#3F3F46]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              title="Raw JSON View"
            >
              <Code2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.product_id}
              className="bg-[#111113] rounded-2xl border border-[#1F2937] p-4 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail & Badges */}
                <div className="relative rounded-xl overflow-hidden bg-[#18181B] aspect-4/3 mb-3.5 border border-[#27272A] flex items-center justify-center">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Stock Badge */}
                  <span
                    className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1 ${
                      product.stock_status === 'In Stock'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {product.stock_status === 'In Stock' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-rose-400" />
                    )}
                    <span>{product.stock_status}</span>
                  </span>

                  {/* Discount Badge */}
                  {product.discount_percent > 0 && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-xs">
                      {product.discount_percent}% OFF
                    </span>
                  )}
                </div>

                {/* Brand & ID */}
                <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
                  <span className="font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {product.brand}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">ID: #{product.product_id}</span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-[#F8FAFC] line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
                  {product.title}
                </h3>

                {/* Short Spec */}
                <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1.5">
                  {product.description}
                </p>
              </div>

              {/* Price & Action Link */}
              <div className="pt-3 mt-3 border-t border-[#1F2937] flex items-center justify-between">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-base font-bold text-[#F8FAFC]">
                      ₹{product.price_inr.toLocaleString('en-IN')}
                    </span>
                    {product.mrp_inr > product.price_inr && (
                      <span className="text-xs text-slate-500 line-through">
                        ₹{product.mrp_inr.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#64748B]">Incl. all taxes</span>
                </div>

                <a
                  href={product.product_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-xs font-medium text-[#E2E8F0] hover:text-indigo-400 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <span>MD Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-[#111113] rounded-2xl border border-[#1F2937] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D0D0F] text-[#94A3B8] font-semibold border-b border-[#1F2937] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Price (₹)</th>
                  <th className="py-3 px-4">MRP (₹)</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937] text-[#E2E8F0]">
                {filteredProducts.map((p) => (
                  <tr key={p.product_id} className="hover:bg-[#18181B]/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-[#F8FAFC] max-w-xs truncate">
                      {p.title}
                    </td>
                    <td className="py-3 px-4 text-[#94A3B8]">{p.brand}</td>
                    <td className="py-3 px-4 font-bold text-[#F8FAFC]">
                      ₹{p.price_inr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-slate-500 line-through">
                      ₹{p.mrp_inr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      {p.discount_percent > 0 ? (
                        <span className="text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {p.discount_percent}%
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          p.stock_status === 'In Stock'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {p.stock_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={p.product_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center space-x-1"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* JSON View */}
      {viewMode === 'json' && (
        <div className="bg-[#111113] rounded-2xl p-4 border border-[#1F2937] shadow-sm">
          <pre className="text-xs text-[#CBD5E1] bg-[#0A0A0B] p-3 rounded-xl border border-[#27272A] font-mono overflow-x-auto max-h-[500px]">
            <code>{JSON.stringify(filteredProducts, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
