'use client';

import { useState } from 'react';
import { BookOpen, Highlight, Printer, FileText } from 'lucide-react';

type BriefSections = {
  caseName: string;
  factsBackground: string;
  issue: string;
  ruleDoctrine: string;
  analysis: string;
  conclusion: string;
};

const sectionOrder: Array<{ id: keyof BriefSections; title: string }> = [
  { id: 'caseName', title: 'Name of Case' },
  { id: 'factsBackground', title: 'FACTS & BACKGROUND' },
  { id: 'issue', title: 'ISSUE' },
  { id: 'ruleDoctrine', title: 'RULE / DOCTRINE' },
  { id: 'analysis', title: 'APPLICATION / ANALYSIS' },
  { id: 'conclusion', title: 'CONCLUSION / RULING' },
];

function extractCaseName(text: string) {
  const vCase = text.match(/([A-Z][\w\s.&,'–-]{1,200}? v\. [A-Z][\w\s.&,'–-]{1,200})/);
  if (vCase) return vCase[1].trim();
  const firstLine = text.split('\n').find((l) => l.trim().length > 5);
  return (firstLine || text.substring(0, 60)).trim();
}

const handleParseCase = (rawText: string) => {
  // Simple, powerful keyword splitter
  const sections: any = {
    name: "Extracted Legal Document",
    facts: "No explicit facts found. Paste the full text background below.",
    issue: "Review the opinion text to isolate the core legal question.",
    rule: "Scan text sections for governing statutes or precedent cases.",
    analysis: "Look for the court's application of the rule to the facts.",
    conclusion: "Look for the final disposition (e.g., Affirmed, Reversed).",
  };

  const lines = rawText.split('\n');
  let currentSection = 'facts';

  // Basic regex parser to chunk the text locally
  lines.forEach(line => {
    const lower = line.toLowerCase();
    if (lower.includes('vs.') || lower.includes('v.')) sections.name = line.trim();
    else if (lower.includes('fact') || lower.includes('background')) currentSection = 'facts';
    else if (lower.includes('issue') || lower.includes('whether')) currentSection = 'issue';
    else if (lower.includes('rule') || lower.includes('precedent')) currentSection = 'rule';
    else if (lower.includes('argued') || lower.includes('analysis') || lower.includes('discussion')) currentSection = 'analysis';
    else if (lower.includes('held') || lower.includes('conclude') || lower.includes('judgment')) currentSection = 'conclusion';
    
    if (line.trim() && currentSection !== 'name') {
      sections[currentSection] += '\n' + line;
    }
  });

  // Clean out default strings if text was appended
  if (sections.facts.includes('\n')) sections.facts = sections.facts.replace("No explicit facts found. Paste the full text background below.\n", "");
  
  return sections;
};

export default function HomePage() {
  const [rawText, setRawText] = useState('');
  const [brief, setBrief] = useState<BriefSections | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | keyof BriefSections>('all');

  const handleParseClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const s = handleParseCase(rawText || '');
      const mapped = {
        caseName: s.name || extractCaseName(rawText),
        factsBackground: s.facts || '',
        issue: s.issue || '',
        ruleDoctrine: s.rule || '',
        analysis: s.analysis || '',
        conclusion: s.conclusion || '',
      } as BriefSections;
      setBrief(mapped);
      setIsProcessing(false);
      setActiveTab('all');
    }, 250);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-10">
        <header className="space-y-6 pb-10">
          <div className="max-w-3xl space-y-4">
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1 text-sm text-slate-600 shadow-sm">
              Client-side utility
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">It'sMeOxy: Legal Case Briefer for law students.</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-700">
              Paste full case text or a court opinion below, then click "Parse Case Text" to
              generate readable brief sections entirely in your browser.
            </p>
          </div>

          <div className="mt-6">
            <label htmlFor="case-text" className="mb-2 block text-sm font-medium text-slate-700">Paste Full Case Text / Court Opinion Here</label>
            <textarea
              id="case-text"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full min-h-[220px] rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-200"
              placeholder="Paste the full opinion text here. The app will try to detect facts, issue, rule, analysis, and conclusion sections."
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleParseClick}
                disabled={isProcessing || !rawText.trim()}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                <FileText className="h-4 w-4" />
                Parse Case Text
              </button>
              <button
                onClick={() => { setRawText(''); setBrief(null); }}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
              >
                Clear
              </button>
              <button
                onClick={handlePrint}
                className="ml-auto inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Printer className="h-4 w-4" />
                Print / Export
              </button>
            </div>
          </div>
        </header>

        <section className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Quick brief preview</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">Clean structure for sustained reading</h2>
                </div>
                <BookOpen className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600 leading-7">
                The live parser runs entirely in your browser—no server, no API keys. Use highlight mode to emphasize sections while studying.
              </p>
            </div>

            <aside className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Controls</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{isProcessing ? 'Processing...' : brief ? 'Case Analyzed Locally' : 'No brief'}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <button
                    onClick={() => setHighlightMode((s) => !s)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ${highlightMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'}`}
                  >
                    <Highlight className="h-4 w-4" />
                    {highlightMode ? 'Highlighting' : 'Highlight Mode'}
                  </button>
                </div>
              </div>
              <p className="mt-4 text-slate-600 leading-7">Download or print this page to create study sheets. The layout is optimized for clean reading and export.</p>
            </aside>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('all')} className={`px-3 py-2 rounded-md ${activeTab === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200'}`}>
                  All
                </button>
                {sectionOrder.map((s) => (
                  <button key={s.id} onClick={() => setActiveTab(s.id)} className={`px-3 py-2 rounded-md ${activeTab === s.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200'}`}>
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {isProcessing ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft">
                    <div className="h-5 w-1/3 rounded-full bg-slate-200" />
                    <div className="mt-5 space-y-4">
                      <div className="h-4 w-full rounded-full bg-slate-200" />
                      <div className="h-4 w-5/6 rounded-full bg-slate-200" />
                    </div>
                  </div>
                ))
              ) : brief ? (
                // show selected tab or all
                (activeTab === 'all' ? sectionOrder : sectionOrder.filter((s) => s.id === activeTab)).map((field) => (
                  <article key={field.id} className={`overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft ${highlightMode ? 'ring-4 ring-slate-100' : ''}`}>
                    <h4 className="text-lg font-semibold text-slate-950">{field.title}</h4>
                    <p className="mt-4 text-slate-700 leading-8 font-serif">
                      {String(brief[field.id as keyof BriefSections]) || '—'}
                    </p>
                  </article>
                ))
              ) : (
                sectionOrder.map((field) => (
                  <article key={field.id} className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500 shadow-none">
                    <h4 className="text-lg font-semibold text-slate-700">{field.title}</h4>
                    <p className="mt-4 leading-8 text-slate-500">This section will show parsed content after you click "Parse Case Text".</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
