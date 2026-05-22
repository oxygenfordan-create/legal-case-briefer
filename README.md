# legal-case-briefer
An AI-powered legal tech tool built to parse, structure, and generate high-legibility legal case briefs using the standard IRAC framework.

**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header.tsx';
import Sidebar from './components/Sidebar.tsx';
import BriefingLoader from './components/BriefingLoader.tsx';
import BriefViewer from './components/BriefViewer.tsx';
import { CaseBrief } from './types.ts';
import { mockCases } from './mockData.ts';
import { 
  Sparkles, 
  BookOpen, 
  AlertCircle, 
  Link2, 
  Info,
  Scale,
  Gavel,
  Compass,
  FileCheck2,
  Trash2,
  Lightbulb
} from 'lucide-react';

// Specific popular cases we can map if entered or clicked
const PRE_MAPPED_CASES: Record<string, Partial<CaseBrief>> = {
  'roe-v-wade': {
    id: 'roe-v-wade',
    title: 'Roe v. Wade',
    citation: '410 U.S. 113',
    court: 'Supreme Court of the United States',
    date: 'January 22, 1973',
    justices: 'Blackmun (Author), Burger, Douglas, Brennan, Stewart, Marshall, Powell; White, Rehnquist (Dissenting)',
    category: 'Fourteenth Amendment, Due Process, Privacy Rights',
    keyDoctrineSummary: "The constitutional right to privacy under the Due Process Clause protects a woman's fundamental right to choose to have an abortion.",
    originalUrl: 'https://supreme.justia.com/cases/federal/us/410/113/',
    wordCount: 18200,
    readTimeMinutes: 60,
    brief: {
      name: 'Jane Roe, et al. v. Henry Wade, District Attorney of Dallas County, Texas',
      facts: [
        'In 1970, Jane Roe (a legal pseudonym for Norma McCorvey), a single pregnant woman residing in Texas, sought to terminate her pregnancy by abortion.',
        'Texas criminal statutes prohibited performing or attempting an abortion except on medical advice for the purpose of saving the life of the mother.',
        'Roe filed a class-action lawsuit in the federal district court in Dallas on behalf of herself and all other women similarly situated, claiming these statutes violated her personal liberty and privacy protected by the First, Fourth, Fifth, Ninth, and Fourteenth Amendments.',
        'A mock doctor (Hallford) also intervened representing medical practitioners prosecuted under the act, and a married childless couple (the Does) filed separate suits.'
      ],
      issue: "Does the United States Constitution recognize a woman's right to terminate her pregnancy by abortion under the concept of personal liberty and privacy?",
      ruling: "Yes. (7-2 decision). The Supreme Court held that a woman's right to an abortion falls within the constitutional right to privacy protected by the Due Process Clause of the Fourteenth Amendment. This right, however, must be balanced against compelling state interests in safeguarding maternal health and protecting potential life, leading to the court establishing a restrictive trimester framework.",
      doctrine: "The Right of Privacy, whether it be founded in the Fourteenth Amendment's concept of personal liberty or the Ninth Amendment's reservation of rights to the people, is broad enough to encompass a woman's decision whether or not to terminate her pregnancy. State regulation of abortion must be tailored to compelling state interests, which vary over three trimesters of pregnancy."
    },
    originalTextExcerpt: `Texas statutes make it a crime to procure an abortion, or to attempt one, except with respect to "an abortion procured or attempted by medical advice for the purpose of saving the life of the mother."

We forthwith acknowledge our awareness of the sensitive and emotional nature of the abortion controversy, of the vigorous opposing views, even among physicians, and of the deep-seated convictions that characterize the people who participate in this debate.

The Constitution does not explicitly mention any right of privacy. In a line of decisions, however, going back perhaps as far as Union Pacific R. Co. v. Botsford (1891), the Court has recognized that a right of personal privacy, or a guarantee of certain areas or zones of privacy, does exist under the Constitution... This right of privacy, whether it be founded in the Fourteenth Amendment's concept of personal liberty and restrictions upon state action, as we feel it is, or, as the District Court determined, in the Ninth Amendment's reservation of rights to the people, is broad enough to encompass a woman's decision whether or not to terminate her pregnancy.`
  },
  'gideon-v-wainwright': {
    id: 'gideon-v-wainwright',
    title: 'Gideon v. Wainwright',
    citation: '372 U.S. 335',
    court: 'Supreme Court of the United States',
    date: 'March 18, 1963',
    justices: 'Black (Author), Douglas, Clark, Harlan, Brennan, White, Goldberg',
    category: 'Sixth Amendment, Right to Counsel, Due Process Clause',
    keyDoctrineSummary: "The Sixth Amendment's guarantee of counsel is a fundamental right essential to a fair trial and applies to states through the Fourteenth Amendment.",
    originalUrl: 'https://supreme.justia.com/cases/federal/us/372/335/',
    wordCount: 11400,
    readTimeMinutes: 38,
    brief: {
      name: 'Clarence Earl Gideon v. Louie L. Wainwright, Director of Division of Corrections, Florida',
      facts: [
        'Clarence Earl Gideon was charged in a Florida state court with breaking and entering into a bay harbor poolroom with intent to commit a misdemeanor crime.',
        'Appearing in court without money and without a lawyer, Gideon asked the court to appoint counsel for him. The judge denied the request, stating that under Florida law, the state was only required to appoint counsel for defendants in capital offenses (punishable by death).',
        'Gideon conducted his own defense, was found guilty, and was sentenced to five years in the state prison.',
        'Gideon filed a habeas corpus petition in the Florida Supreme Court, claiming his Sixth Amendment right to counsel had been denied. It was rejected. He then wrote a handwritten pencil petition on prison paper to the Supreme Court of the United States.'
      ],
      issue: "Does the Fourteenth Amendment's Due Process Clause extend the Sixth Amendment's right to counsel to indigent defendants accused of non-capital felony offenses in state courts?",
      ruling: "Yes. (9-0 decision. Unanimous). The Supreme Court ruled that the right to assistance of counsel is fundamental and essential to a fair trial. It overruled Betts v. Brady (1942), holding that the Fourteenth Amendment's Due Process Clause mandates that states provide lawyers to indigent defendants charged with serious crimes.",
      doctrine: "The Sixth Amendment guarantee of counsel is a fundamental right made obligatory upon the States by the Fourteenth Amendment. Any person haled into court who is too poor to hire a lawyer cannot be assured a fair trial unless counsel is provided for him. Law and lawyers are necessities, not luxuries, in criminal courts."
    },
    originalTextExcerpt: `Gideon conducted his defense about as well as could be expected from a layman. He made an opening statement to the jury, cross-examined the State's witnesses, presented witnesses in his own behalf, declined to testify himself, and made a short argument "emphasizing his innocence to the charge contained in the Information filed against him."

Governments, both state and federal, quite properly spend vast sums of money to establish machinery to try defendants accused of crime. Lawyers to prosecute are everywhere deemed essential to protect the public's interest... That government hires lawyers to prosecute and defendants who have the money hire lawyers to defend are the strongest indications of the widespread belief that lawyers in criminal courts are necessities, not luxuries.`
  },
  'nyt-v-sullivan': {
id: 'nyt-v-sullivan',
    title: 'New York Times Co. v. Sullivan',
    citation: '376 U.S. 254',
    court: 'Supreme Court of the United States',
    date: 'March 9, 1964',
    justices: 'Brennan (Author), Warren, Black, Douglas, Clark, Harlan, Stewart, White, Goldberg',
    category: 'First Amendment, Freedom of Speech, Libel Law',
    keyDoctrineSummary: "To sustain a claim of defamation, a public official must prove that the material was published with 'actual malice' — knowledge of falsity or reckless disregard.",
    originalUrl: 'https://supreme.justia.com/cases/federal/us/376/254/',
    wordCount: 16900,
    readTimeMinutes: 56,
    brief: {
      name: 'The New York Times Company v. L. B. Sullivan',
      facts: [
        'In 1960, the New York Times published a full-page fund-raising advertisement titled "Heed Their Rising Voices" purchased by civil rights leaders.',
        'The advertisement charged that the arrest of the Rev. Martin Luther King Jr. in Montgomery, Alabama was part of an orchestrated campaign by local authorities to destroy King\'s civil rights efforts.',
        'L. B. Sullivan, the Montgomery City Commissioner in charge of police, filed a libel lawsuit in Alabama court claiming that the allegations, which had small factual inaccuracies (e.g., police padlocking a college dining hall), defamed him by association.',
        'Under Alabama law, Sullivan did not have to prove he suffered financial harm. The jury awarded Sullivan $500,000 in damages, which was affirmed by the Alabama Supreme Court.'
      ],
      issue: "Does Alabama's civil libel law, which does not require a public official to prove actual malice, unconstitutionally abridge freedom of speech and press protected by the First and Fourteenth Amendments?",
      ruling: "Yes. (9-0 decision. Unanimous). The Supreme Court ruled that the First Amendment protects the publication of all statements, even false ones, about the conduct of public officials, unless the statements are made with 'actual malice' (with knowledge that they were false or with reckless disregard of the truth).",
      doctrine: "A State cannot, under the First or Fourteenth Amendments, award damages to a public official for defamatory falsehood relating to his official conduct unless he proves 'actual malice' — that is, with knowledge that it was false or with reckless disregard of whether it was false or not."
    },
    originalTextExcerpt: `We are required in this case to determine for the first time the extent to which the constitutional protections for speech and press limit a State's power to award damages in a libel action brought by a public official against critics of his official conduct.

The protection of the First and Fourteenth Amendments is not limited to the truth. Authoritative interpretations of the First Amendment guarantee have consistently held that some degree of abuse is inseparable from the proper use of everything; and that in no instance is this more true than in that of the press.

Thus, we consider this case against the background of a profound national commitment to the principle that debate on public issues should be uninhibited, robust, and wide-open, and that it may well include vehement, caustic, and sometimes unpleasantly sharp attacks on government and public officials.`
  }
};
export default function App() {
  const [cases, setCases] = useState<CaseBrief[]>(mockCases);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('brown-v-board');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [isBriefing, setIsBriefing] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string>('');

  // Selected case object lookup
  const currentBrief = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Helper to trigger loader mock demo
  const handleBriefIt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputUrl.trim()) {
      setInputError('Please paste a valid legal case URL first.');
      return;
    }

    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
      setInputError('URL must start with http:// or https://');
      return;
    }

    setInputError('');
    setIsBriefing(true);
  };

  // Callback once the BriefingLoader is complete (simulate LLM finishing)
  const handleBriefingComplete = () => {
    setIsBriefing(false);
     // Check if the URL matches one of our pre-mapped cases
    const trimmedUrl = inputUrl.trim().toLowerCase();
    
    let key = '';
    if (trimmedUrl.includes('roe') || trimmedUrl.includes('410/113')) {
      key = 'roe-v-wade';
    } else if (trimmedUrl.includes('gideon') || trimmedUrl.includes('372/335')) {
      key = 'gideon-v-wainwright';
    } else if (trimmedUrl.includes('sullivan') || trimmedUrl.includes('376/254')) {
      key = 'nyt-v-sullivan';
    }

    if (key && PRE_MAPPED_CASES[key]) {
      const targetCase = PRE_MAPPED_CASES[key] as CaseBrief;
      
      // Add only if not already present
      if (!cases.some((c) => c.id === targetCase.id)) {
        setCases((prev) => [...prev, targetCase]);
      }
      setSelectedCaseId(targetCase.id);
    } else {
      // Dynamic parse fallback for a genuine generic experience
      const urlObj = new URL(inputUrl);
      const host = urlObj.hostname;
      const pathname = urlObj.pathname;
      const pathParts = pathname.split('/').filter(Boolean);
      const possibleName = pathParts[pathParts.length - 1] 
        ? pathParts[pathParts.length - 1].replace(/[-_]/g, ' ') 
        : 'Ex Parte Appeal Doc';

  const capitalizedName = possibleName
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const citationNum = Math.floor(Math.random() * 500) + ' U.S. ' + (Math.floor(Math.random() * 800) + 100);

      const dynamicCase: CaseBrief = {
        id: 'dyn-' + Date.now(),
        title: capitalizedName || 'Pasted Custom Legal Hearing',
        citation: citationNum,
        court: 'United States Court of Appeals for ' + (['the First', 'the Ninth', 'the District of Columbia', 'the Federal'][Math.floor(Math.random() * 4)]) + ' Circuit',
        date: 'October Term, 2024',
        justices: 'Chief Judge presiding with Consolidated Bench panel',
        category: 'Administrative Law, Statutory Clarification',
        keyDoctrineSummary: "Federal regulatory agencies must abide strictly by the procedural constraints of the Administrative Procedure Act (APA).",
        originalUrl: inputUrl,
        wordCount: 8400,
        readTimeMinutes: 28,
        brief: {
          name: capitalizedName + ' v. Regulatory Commission & Associates',
          facts: [
            `The petitioners file this emergency injunction to address standard reviews hosted on the website domain (${host}).`,
            'Under state regulatory statutes, administrative guidelines are subject to constitutional due process reviews, requiring public comment periods before implementation.',
            `The primary record shows procedural deviations occurred on or around recent fiscal cycles, leading the district courts to issue static rulings prior to final agency findings.`
          ],
          issue: `Does the disputed regulation, published on ${host}, exceed the jurisdiction granted under statutory boundaries, violating core procedural due process and public notice guidelines?`,
          ruling: 'Yes. (3-0 Unanimous Appellate Opinion). The Court ruled that agencies must adhere strictly to statutory guidelines, declaring the contested guidelines procedurally void.',
          doctrine: 'Administrative agencies lack inherent power to create binding commands outside of explicit legislative grants. Procedural shortcuts violate the Administrative Procedure Act.'
        },
        originalTextExcerpt: `OPINION OF THE COURT:
We take up in this appeal a critical review of the administrative procedural timelines published on the disputed digital domains. The petitioners argue that direct policy updates skipped notice-and-comment requirements.

Having carefully weighed the record, we conclude that the rule of law demands absolute fidelity to procedural constraints. Any agency directive issued without rigorous adherence to public input mandates is void ab initio...`
      };

      setCases((prev) => [...prev, dynamicCase]);
      setSelectedCaseId(dynamicCase.id);
    }

    // Reset input
    setInputUrl('');
  };

  // Quick fill buttons
  const selectQuickFeed = (url: string) => {
    setInputUrl(url);
    setInputError('');
  };

  const handleResetWorkspace = () => {
    if (confirm('Are you sure you want to restore original landmark cases?')) {
      setCases(mockCases);
      setSelectedCaseId(mockCases[0].id);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans" id="app-root">
      {/* Platform Banner/Header */}
      <Header />

{/* Main Container */}
      <div className="flex flex-1 overflow-hidden" id="main-workspace-grid">
        
        {/* Sidebar */}
        <Sidebar
          cases={cases}
          selectedCaseId={selectedCaseId}
          onSelectCase={setSelectedCaseId}
          onAddNewCustomUrl={() => {
            const el = document.getElementById('url-input-box');
            el?.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Workspace Panel */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10">
          <div className="mx-auto max-w-5xl space-y-8" id="dashboard-body">
            
            {/* HERO SECTION */}
            <div className="border-b border-slate-200 pb-6" id="app-hero">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                <Sparkles className="h-3 w-3 text-slate-705" /> Phase 1 Live Prototype
              </span>
              
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
                Instant Legal Case Digest
              </h2>
              
              <p className="mt-2 text-sm text-slate-500 max-w-2xl leading-relaxed">
                Empower your class preparation. Paste legal report URLs from **Justia, Oyez, or CourtListener** to instantly compile precise briefs.
              </p>

  {/* INPUT BAR */}
              <form onSubmit={handleBriefIt} className="mt-6" id="briefing-input-form">
                <div className="flex flex-col sm:flex-row gap-2 max-w-3xl">
                  <div className="relative flex-1">
                    <Link2 className="absolute top-3 left-3 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="url"
                      id="url-input-box"
                      placeholder="Paste Case URL (e.g., https://supreme.justia.com/cases/federal/us/410/113/)"
                      value={inputUrl}
                      onChange={(e) => {
                        setInputUrl(e.target.value);
                        if (inputError) setInputError('');
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white px-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-300 focus:outline-hidden shadow-2xs"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-hidden transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>Brief It</span>

            </button>
                </div>
                
                {inputError && (
                  <p className="mt-2 text-xs font-medium text-red-650 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {inputError}
                  </p>
                )}
              </form>

              {/* Quick Fill Links */}
              <div className="mt-4" id="quick-fill-demo-feeds">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Test and demo feeds (Autofill popular Court URLs):
                </span>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => selectQuickFeed('https://supreme.justia.com/cases/federal/us/410/113/')}
                    className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Gavel className="h-3 w-3 text-slate-500" />
                    <span>Roe v. Wade (Abortion Rights)</span>
                  </button>
                  <button
                  onClick={() => selectQuickFeed('https://supreme.justia.com/cases/federal/us/372/335/')}
                    className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Scale className="h-3 w-3 text-slate-500" />
                    <span>Gideon v. Wainwright (Right to Counsel)</span>
                  </button>
                  <button
                    onClick={() => selectQuickFeed('https://supreme.justia.com/cases/federal/us/376/254/')}
                    className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Compass className="h-3 w-3 text-slate-500" />
                    <span>NYT v. Sullivan (First Amendment Libel)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* DYNAMIC VIEW CONTAINER */}
            <div className="min-h-96" id="dashboard-workspace-workspace">
              {isBriefing ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8">
                  <BriefingLoader onComplete={handleBriefingComplete} url={inputUrl} />
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <BriefViewer currentBrief={currentBrief} />
                </div>
              )}
            </div>
{/* LAW STUDENT ORIENTATION GUIDE (Notion Accordion / Footer) */}
            <div className="rounded-xl border border-slate-250 bg-slate-100/50 p-6 space-y-4" id="jurisguide-faq">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-4.5 w-4.5 text-slate-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    JurisBrief Briefing Orientation Checklist
                  </h3>
                </div>
                
                <button
                  onClick={handleResetWorkspace}
                  className="text-xs text-slate-400 hover:text-slate-650 flex items-center gap-1.5 focus:outline-hidden cursor-pointer"
                  title="Reset list of cases"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Reset Workspace</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs" id="faq-columns">
                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-3xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                    <FileCheck2 className="h-4 w-4 text-slate-600" /> IRAC Method Formulation
                  </span>
                  <p className="text-slate-550 leading-relaxed text-[11px]">
                    JurisBrief parses cases strictly matching the standard **IRAC framework** (Issue, Ruling, Analysis, Conclusion) mapped into our 5 sections for easy outline reviews.
                  </p>
                </div>
                   <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-3xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className="h-4 w-4 text-slate-600" /> Active Highlighting Mode
                  </span>
                  <p className="text-slate-550 leading-relaxed text-[11px]">
                    Use our **Active Highlighting** in the Facts tab to isolate procedural postures or specific material facts for your morning cold calls.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-3xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                    <BookOpen className="h-4 w-4 text-slate-600" /> PDF Preparation
                  </span>
                  <p className="text-slate-550 leading-relaxed text-[11px]">
                    Once briefings complete, click **Export PDF** to produce print-ready standard brief sheets to tuck inside your textbook folders.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

