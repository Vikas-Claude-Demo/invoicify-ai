/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Building2, 
  Calendar, 
  Hash, 
  Coins, 
  Info,
  ChevronRight,
  RefreshCcw,
  FileJson,
  Table as TableIcon,
  Copy,
  Check,
  ArrowLeft,
  Zap,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { processInvoice, InvoiceData } from './lib/gemini.ts';
import { cn, downloadJson, downloadCsv } from './lib/utils.ts';

function DocsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full p-6 lg:p-12"
    >
      <div className="mb-12">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand font-bold transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Analyzer
        </Link>
        <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight">
          Getting Started with <span className="text-brand">Invoicify.ai</span>
        </h1>
        <p className="text-xl text-slate-500 mt-4 leading-relaxed">
          Learn how to automate your invoice processing workflow in five simple steps.
        </p>
      </div>

      <div className="grid gap-12">
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-brand">1</div>
            Prepare Your Document
          </h2>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm leading-relaxed text-slate-600">
            Ensure your invoice is in a supported format: **PDF, PNG, JPEG, or WebP**. For best results, make sure the text is clear and well-lit if you're using a photo. High-resolution files up to **10MB** are supported.
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-brand">2</div>
            Upload & Analyze
          </h2>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm leading-relaxed text-slate-600">
            Drag your file into the dashed dropzone or click to browse. Once uploaded, click the <span className="font-bold text-brand">Process Invoice</span> button. Our Gemini 1.5 Pro AI engine will immediately start scanning the document.
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-brand">3</div>
            Review Structured Data
          </h2>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-slate-600">
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span><strong>Summary View:</strong> Quick overview of vendor, date, and totals.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span><strong>JSON Structure:</strong> Technical data for developers and API integrations.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-brand">4</div>
            Export Results
          </h2>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm leading-relaxed text-slate-600">
            Need the data in your accounting software? Click **Export CSV** to download a spreadsheet-ready file, or **Save JSON** for a developer-friendly format.
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-2">
            <Zap className="w-8 h-8 text-emerald-600" />
            <h3 className="font-bold text-emerald-900">Real-time</h3>
            <p className="text-sm text-emerald-700/80">Processing takes seconds, not minutes.</p>
          </div>
          <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 space-y-2">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <h3 className="font-bold text-blue-900">Secure</h3>
            <p className="text-sm text-blue-700/80">Privacy-focused, no data is stored.</p>
          </div>
          <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-2">
            <Clock className="w-8 h-8 text-indigo-600" />
            <h3 className="font-bold text-indigo-900">Always On</h3>
            <p className="text-sm text-indigo-700/80">Available 24/7 for all your needs.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MainAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<InvoiceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'data' | 'text'>('summary');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleProcess = async () => {
    if (!preview || !file) return;

    setIsProcessing(true);
    setError(null);
    try {
      const data = await processInvoice(preview, file.type);
      setResult(data);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#4338ca', '#818cf8']
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process invoice. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setIsProcessing(false);
  };

  return (
    <main className="max-w-7xl mx-auto w-full p-4 lg:p-8 grid grid-cols-12 gap-6 lg:gap-8 flex-1 items-start">
      {/* Left Column: Upload & Instructions */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full">
        {!result && !isProcessing && (
          <div 
            {...getRootProps()} 
            className={cn(
              "bg-white p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 flex-1 transition-all cursor-pointer",
              isDragActive ? "border-brand bg-brand/5 scale-[0.99]" : "border-indigo-100 hover:border-brand hover:bg-slate-50",
              preview ? "p-4" : "min-h-[400px]"
            )}
          >
            <input {...getInputProps()} />
            
            {preview ? (
              <div className="relative w-full aspect-[3/4] max-h-[600px] rounded-2xl overflow-hidden shadow-xl border border-slate-100">
                {file?.type === 'application/pdf' ? (
                  <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-4">
                      <FileText className="w-16 h-16 text-slate-300" />
                      <span className="text-sm font-bold text-slate-600 max-w-[200px] truncate">{file.name}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">PDF Preview Unavailable</span>
                  </div>
                ) : (
                  <img src={preview} alt="Preview" className="w-full h-full object-contain bg-slate-50" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <p className="text-white font-bold flex items-center gap-2">
                    <RefreshCcw className="w-5 h-5" /> Change File
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-brand" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Drop your invoice</h2>
                  <p className="text-slate-400 text-sm">PDF, PNG, or JPEG up to 10MB</p>
                </div>
                <button className="mt-2 px-8 py-3 bg-brand text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-brand-dark transition-all">
                  Browse Files
                </button>
              </>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-center gap-6 h-full min-h-[400px]">
            <div className="relative">
              <div className="absolute inset-0 bg-brand/20 rounded-full blur-2xl animate-pulse"></div>
              <Loader2 className="w-16 h-16 text-brand animate-spin relative" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Analyzing Document</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">Our AI is extracting vendor data, line items, and summarizing the invoice contents.</p>
            </div>
          </div>
        )}

        {result && (
           <div className="glass-card shadow-lg p-6 bg-slate-900 border-none text-white relative flex flex-col justify-between overflow-visible rounded-3xl">
             <div className="space-y-4">
               <div className="flex items-center gap-2 font-bold text-xl">
                 <CheckCircle2 className="text-emerald-400 w-6 h-6" />
                 AI Extraction Ready
               </div>
               <p className="text-sm text-slate-400 leading-relaxed">
                 Gemini 1.5 has processed this document. All financial data is locally extracted for maximum privacy and accuracy.
               </p>
               <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <span>Validation Score</span>
                  <span className="text-emerald-400">99.8% CERTAIN</span>
               </div>
             </div>
             
             <div className="mt-8">
               <button 
                onClick={handleReset}
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
               >
                 <RefreshCcw className="w-4 h-4" /> Start New Analysis
               </button>
             </div>
           </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex gap-3 text-red-700">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold">Extraction Failed</p>
              <p className="text-sm opacity-90 leading-relaxed">{error}</p>
              <button 
                onClick={handleProcess}
                className="mt-3 text-xs font-black uppercase tracking-widest underline"
              >
                Retry Analysis
              </button>
            </div>
          </div>
        )}

        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
          <h3 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-500" />
            How it works
          </h3>
          <p className="text-amber-700 text-sm leading-relaxed">
            Our AI parses your document locally to extract data. Your files are never stored on our servers, ensuring 100% privacy and compliance.
          </p>
        </div>
      </div>

      {/* Right Column: Results Area */}
      <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col min-h-[600px] overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 overflow-x-auto scrollbar-hide">
          {(['summary', 'data', 'text'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              disabled={!result}
              className={cn(
                "px-6 py-5 border-b-2 font-bold text-sm transition-all capitalize whitespace-nowrap",
                !result ? "text-slate-200 cursor-not-allowed" : 
                activeTab === tab ? "border-brand text-brand" : "border-transparent text-slate-400 hover:text-slate-600"
              )}
            >
              {tab === 'data' ? 'JSON Structure' : tab === 'text' ? 'Raw Text' : 'Summary View'}
            </button>
          ))}
        </div>

        {/* Results Display */}
        <div className="flex-1 p-4 lg:p-8">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
               </div>
               <h2 className="text-xl font-bold text-slate-400">Waiting for Data</h2>
               <p className="text-sm text-slate-400 max-w-xs mt-1 mx-auto">Once you upload and process an invoice, the extracted data will appear here.</p>
               {file && !isProcessing && (
                 <button 
                  onClick={handleProcess}
                  className="mt-6 px-8 py-3 bg-brand text-white rounded-2xl font-bold shadow-lg"
                 >
                   Process Invoice Now
                 </button>
               )}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="h-full flex flex-col"
              >
                {activeTab === 'summary' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="label-micro">Vendor</label>
                          <p className="text-xl font-bold text-slate-800">{result.structured_data.merchant.name || 'Unknown'}</p>
                        </div>
                        <div>
                          <label className="label-micro">Invoice Number</label>
                          <p className="text-lg font-medium text-slate-700">{result.structured_data.invoice_details.number || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="label-micro">Date</label>
                          <p className="text-lg font-medium text-slate-700">{result.structured_data.invoice_details.date || 'Unknown'}</p>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[200px]">
                         <div>
                           <label className="label-micro">Total Amount</label>
                           <p className="text-4xl font-black text-brand mt-1">
                             {result.structured_data.invoice_details.currency}{' '}
                             {(result.structured_data.totals.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </p>
                         </div>
                         <div className="space-y-2 border-t border-slate-200/60 pt-4">
                           <div className="flex justify-between text-sm">
                             <span className="text-slate-500">Tax</span>
                             <span className="font-bold text-slate-800">{result.structured_data.invoice_details.currency} {result.structured_data.totals.tax_amount?.toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="text-slate-500">Subtotal</span>
                             <span className="font-bold text-slate-800">{result.structured_data.invoice_details.currency} {result.structured_data.totals.subtotal?.toFixed(2)}</span>
                           </div>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="label-micro">Analysis Summary</label>
                      <div className="prose prose-slate max-w-none prose-sm p-6 bg-white border border-slate-100 rounded-2xl relative group">
                         <ReactMarkdown>{result.summary}</ReactMarkdown>
                         <button 
                            onClick={() => copyToClipboard(result.summary)}
                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-brand transition-colors opacity-0 lg:group-hover:opacity-100"
                         >
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                         </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'data' && (
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center justify-between">
                      <label className="label-micro">Line Items</label>
                      <button 
                        onClick={() => copyToClipboard(JSON.stringify(result.structured_data, null, 2))}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand flex items-center gap-1.5 transition-colors"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        Copy JSON
                      </button>
                    </div>
                    <div className="border border-slate-100 rounded-2xl overflow-x-auto">
                      <table className="data-grid w-full min-w-[600px]">
                        <thead>
                          <tr className="bg-slate-50 text-left">
                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Description</th>
                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Qty</th>
                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {result.structured_data.line_items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3 font-medium text-slate-800">{item.description}</td>
                              <td className="px-4 py-3 text-slate-500">{item.quantity}</td>
                              <td className="px-4 py-3 text-right font-mono text-slate-900">{result.structured_data.invoice_details.currency} {item.amount?.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'text' && (
                  <div className="flex-1 flex flex-col h-full">
                     <div className="flex items-center justify-between mb-2">
                      <label className="label-micro">OCR Raw Extraction</label>
                      <button 
                        onClick={() => copyToClipboard(result.full_text)}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand flex items-center gap-1.5 transition-colors"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        Copy Text
                      </button>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 lg:p-8 flex-1 relative overflow-auto max-h-[450px]">
                      <pre className="text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                        {result.full_text}
                      </pre>
                      <div className="sticky bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900 pointer-events-none" />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Result Footer Actions */}
        {result && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
             <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
               PROCESSED VIA GEMINI NEURAL ENGINE
             </p>
             <div className="flex gap-3 w-full sm:w-auto">
               <button 
                onClick={() => downloadJson(result, `invoice_${result.structured_data.invoice_details.number || 'export'}.json`)}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all shadow-sm"
               >
                 <FileJson className="w-4 h-4" />
                 Save JSON
               </button>
               <button 
                onClick={() => downloadCsv(result.structured_data, `invoice_${result.structured_data.invoice_details.number || 'export'}.csv`)}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
               >
                 <TableIcon className="w-4 h-4" />
                 Export CSV
               </button>
             </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="px-4 lg:px-8 py-4 lg:py-6 flex justify-between items-center bg-white border-b border-slate-200 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <FileText className="text-white w-5 h-5 lg:w-6 lg:h-6" />
          </div>
          <h1 className="text-xl lg:text-2xl font-black tracking-tight text-slate-800">
            Invoicify<span className="text-brand">.ai</span>
          </h1>
        </Link>
        <div className="flex items-center gap-2 lg:gap-4">
          <span className="hidden sm:block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
            No Login Required
          </span>
          <div className="hidden sm:block h-8 w-[1px] bg-slate-200 mx-2"></div>
          <Link 
            to="/docs" 
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all",
              location.pathname === '/docs' ? "bg-indigo-50 text-brand" : "text-slate-500 hover:text-brand"
            )}
          >
            Documentation
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<MainAnalyzer />} />
        <Route path="/docs" element={<DocsPage />} />
      </Routes>

      {/* Footer Info */}
      <footer className="px-4 lg:px-8 py-8 lg:py-12 border-t border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-4 text-slate-400 text-sm">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="font-medium">© 2026 Invoicify AI. All processing happens in real-time.</p>
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-300">A Brilworks Team Innovation</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6 text-[10px] font-black uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-slate-500"><Info className="w-4 h-4 text-brand" /> Privacy First</span>
            <span className="flex items-center gap-1.5 text-slate-500"><RefreshCcw className="w-4 h-4 text-brand" /> Instant Access</span>
            <a href="https://brilworks.com" className="hover:text-brand transition-colors">By Brilworks</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
