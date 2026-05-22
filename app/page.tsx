'use client';

import { useState } from 'react';
import { ArrowRight, BookOpen, Hourglass, Search } from 'lucide-react';

type CaseBrief = {
  caseName: string;
  facts: string;
  issue: string;
  ruling: string;
  doctrine: string;
};

const mockCase: CaseBrief = {
  caseName: 'Smith v. United States',
  facts:
    'A federal agent intercepted a package that contained a controlled substance. Smith argued the search violated his Fourth Amendment rights because the package was opened without a warrant. The court reviewed the facts of the seizure and the chain of custody from the delivery service to the federal investigation.',
  issue:
    'Whether the warrantless opening of a package by law enforcement after it was stopped in transit violates the Fourth Amendment when the package was in the hands of a third-party carrier.',
  ruling:
    'The Supreme Court held that the search was constitutional under the third-party doctrine because the package was voluntarily entrusted to the carrier, and Smith had no reasonable expectation of privacy in the package’s contents once it left his control.',
  doctrine:
    'The decision reinforces the third-party doctrine and clarifies that the expectation of privacy in physical packages entrusted to third parties is significantly diminished once those packages are transferred to common carriers.',
};

const fieldOrder: Array<{ id: keyof CaseBrief; title: string }> = [
  { id: 'caseName', title: 'Name of Case' },
  { id: 'facts', title: 'Facts' },
  { id: 'issue', title: 'Issue' },
  { id: 'ruling', title: 'Ruling' },
  { id: 'doctrine', title: 'Doctrine' },
];

export default function HomePage() {
  const [url, setUrl] = useState('https://www.supremecourt.gov/opinions/22pdf/22-1234.pdf');
  const [isLoading, setIsLoading] = useState(false);
  const [brief, setBrief] = useState<CaseBrief | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setBrief(null);

    window.setTimeout(() => {
      setBrief(mockCase);
      setIsLoading(false);
    }, 750);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-10">
        <header className="space-y-6 pb-10">
          <div className="max-w-3xl space-y-4">
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1 text-sm text-slate-600 shadow-sm">
              Phase 1 prototype
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Legal Case Briefer for law students.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-700">
              Paste a case URL, click Brief It, and instantly preview a clean, structured legal brief
              with the key facts, issue, ruling, and doctrine.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="case-url">
              Case URL
            </label>
            <input
              id="case-url"
              type="url"
              required
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Enter a legal case URL"
              className="min-h-[56px] rounded-2xl border border-slate-300 bg-white px-5 text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200"
            />
            <button
              type="submit"
              className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-base font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
            >
              <Search size={18} />
              Brief It
            </button>
          </form>
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
                This interface is built for students who want to move from dense opinions to usable brief elements quickly. Each section is clearly separated, and the case text uses a serif style for readability.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Status</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">
                    {isLoading ? 'Summarizing...' : brief ? 'Brief ready' : 'Waiting for input'}
                  </p>
                </div>
                {isLoading ? <Hourglass className="h-8 w-8 animate-spin text-slate-500" /> : <ArrowRight className="h-8 w-8 text-slate-500" />}
              </div>
              <p className="mt-4 text-slate-600 leading-7">
                {isLoading
                  ? 'Mock loader active to show the state before the summary appears.'
                  : brief
                  ? 'A polished case brief with facts, issue, ruling, and doctrine is displayed below.'
                  : 'Paste a case URL and click Brief It to see this layout in action.'}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Mock case brief</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Structured sections</h3>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {brief ? 'Displayed from mock data.' : 'No case loaded yet.'}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="animate-pulse rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft">
                      <div className="h-5 w-1/3 rounded-full bg-slate-200" />
                      <div className="mt-5 space-y-4">
                        <div className="h-4 w-full rounded-full bg-slate-200" />
                        <div className="h-4 w-5/6 rounded-full bg-slate-200" />
                        <div className="h-4 w-4/6 rounded-full bg-slate-200" />
                      </div>
                    </div>
                  ))
                : brief
                ? fieldOrder.map((field) => (
                    <article key={field.id} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft">
                      <h4 className="text-lg font-semibold text-slate-950">{field.title}</h4>
                      <p className="mt-4 text-slate-700 leading-8 font-serif">
                        {brief[field.id]}
                      </p>
                    </article>
                  ))
                : fieldOrder.map((field) => (
                    <article key={field.id} className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500 shadow-none">
                      <h4 className="text-lg font-semibold text-slate-700">{field.title}</h4>
                      <p className="mt-4 leading-8 text-slate-500">This section will show the case {field.title.toLowerCase()} after you click Brief It.</p>
                    </article>
                  ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
