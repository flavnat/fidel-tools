import { useEffect, useState } from "react";
import { Pipeline } from "@fidel-tools/core";
import amPack from "../../../packages/lang-am/am.json";
import { Check, Code2, Copy, Sun, Moon } from "lucide-react";
import LexicalTab from "./preview-console/LexicalTab";
import PipelineTab from "./preview-console/PipelineTab";
import StemmerTab from "./preview-console/StemmerTab";
import StopwordTab from "./preview-console/StopwordTab";
import TransliteratorTab from "./preview-console/TransliteratorTab";
import { previewTabs } from "./preview-console/tabConfig";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast } from "sonner";
import type {
    LanguagePackLike,
    PipelineLike,
    PreviewTabId,
    TransLang,
} from "./preview-console/types";

const nlp = new Pipeline(amPack as any) as unknown as PipelineLike;
const languagePack = amPack as unknown as LanguagePackLike;

interface PreviewPageProps {
    onBackToHome: () => void;
    theme: "light" | "dark";
    toggleTheme: () => void;
}

export default function PreviewPage({ onBackToHome, theme, toggleTheme }: PreviewPageProps) {
    const [inputText, setInputText] = useState(
        "የገንዘብ ሚኒስቴር ምክር ቤተ ከሃያ ዓመታት በፊት ያወጣውን የ ተጨማሪ እሴት ታክስ ቫት አዋጅን የሚተካ ረቂቅ ተዘጋጀ። ት/ቤት እና መስሪያ ቤት",
    );
    const [activeTab, setActiveTab] = useState<PreviewTabId>("pipeline");
    const [transLang, setTransLang] = useState<TransLang>("am");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => window.clearTimeout(timeout);
    }, [loading]);

    useEffect(() => {
        if (!loading) {
            AOS.init({
                duration: 800,
                easing: "ease-out-cubic",
                once: true,
            });
        }
    }, [loading]);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Snippet copied to clipboard!");
        window.setTimeout(() => setCopied(false), 2000);
    };

    const codeSnippets: Record<PreviewTabId, string> = {
        pipeline: `import { Pipeline } from '@fidel-tools/core';
import amPack from '@fidel-tools/lang-am';

const nlp = new Pipeline(amPack);

const corpus = "${inputText.substring(0, 30)}...";
const lexed = nlp.lexAnalyze(corpus);
const clean = nlp.removeStopwords(lexed);
const words = clean.split(' ');
const stems = words.map((word) => nlp.stem(word));

console.log(stems);`,
        transliterator: `import { Pipeline } from '@fidel-tools/core';
import amPack from '@fidel-tools/lang-am';

const nlp = new Pipeline(amPack);
const word = "${transLang === "am" ? "ወንበር" : "wenber"}";

const result = nlp.feligTransliterate(word, "${transLang}");
console.log(result);`,
        stemmer: `import { Pipeline } from '@fidel-tools/core';
import amPack from '@fidel-tools/lang-am';

const nlp = new Pipeline(amPack);
const stem = nlp.stem("ልጆቻቸውን");

console.log(stem); // → ልጅ`,
        stopword: `import { Pipeline } from '@fidel-tools/core';
import amPack from '@fidel-tools/lang-am';

const nlp = new Pipeline(amPack);
const text = "${inputText.substring(0, 30)}...";
const result = nlp.removeStopwords(text);

console.log(result);`,
        lexical: `import { Pipeline } from '@fidel-tools/core';
import amPack from '@fidel-tools/lang-am';

const nlp = new Pipeline(amPack);
const rawText = "ት/ቤት እና መስሪያ ቤት";
const cleaned = nlp.lexAnalyze(rawText);

console.log(cleaned); // → "ትምህርት ቤት እና መስሪያ ቤት"`,
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case "pipeline":
                return <PipelineTab inputText={inputText} nlp={nlp} />;
            case "transliterator":
                return (
                    <TransliteratorTab
                        inputText={inputText}
                        nlp={nlp}
                        transLang={transLang}
                        setTransLang={setTransLang}
                    />
                );
            case "stemmer":
                return <StemmerTab inputText={inputText} nlp={nlp} />;
            case "stopword":
                return (
                    <StopwordTab
                        inputText={inputText}
                        languagePack={languagePack}
                    />
                );
            case "lexical":
                return (
                    <LexicalTab
                        inputText={inputText}
                        languagePack={languagePack}
                    />
                );
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-slate-50 dark:bg-[#050507] flex justify-center items-center z-[9999] transition-colors duration-500">
                <div className="flex flex-col items-center">
                    <div className="relative font-loga text-7xl md:text-8xl font-light tracking-tight select-none">
                        <span className="text-slate-900/10 dark:text-white/10">ፊደል</span>
                        <span className="absolute left-0 top-0 bg-gradient-to-b from-sky-400 to-blue-500 bg-clip-text text-transparent animate-water-fill">
                            ፊደል
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col gap-4 relative z-10 font-jakarta">
            {/* ─── Top Bar (Mobile Responsive Stacking) ─── */}
            <header 
                className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3.5 px-5 bg-white/65 dark:bg-[#0c0c0e]/75 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-none rounded-2xl transition-all duration-300"
                data-aos="fade-down"
            >
                <div className="flex items-center justify-between w-full sm:w-auto">
                    <div className="flex items-center gap-3">
                        <span 
                            className="font-loga text-2xl font-light text-blue-900 dark:text-sky-400 select-none cursor-pointer hover:opacity-85 transition-all duration-300" 
                            onClick={onBackToHome}
                        >
                            ፊደል
                        </span>
                        <span className="text-slate-400 dark:text-zinc-600 font-light opacity-45 hidden min-[400px]:inline">/</span>
                        <span className="text-xs md:text-sm font-semibold tracking-tight text-slate-800 dark:text-zinc-300 hidden min-[400px]:inline">Developer Console</span>
                        <span className="font-mono text-[9px] bg-slate-200/50 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 px-2 py-0.5 rounded">v2.0.1</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto border-t sm:border-t-0 border-slate-200/40 dark:border-zinc-800/40 pt-2 sm:pt-0">
                    <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                            LIVE
                        </span>
                        <span className="text-[9px] font-bold tracking-wider text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md">INTERNAL</span>
                    </div>
                    
                    <div className="flex gap-2 items-center border-l border-slate-200 dark:border-zinc-800 pl-3">
                        <button
                            onClick={toggleTheme}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800/40 text-slate-500 dark:text-zinc-400 hover:text-slate-955 dark:hover:text-zinc-100 cursor-pointer transition-all duration-200"
                            aria-label="Toggle light/dark theme"
                        >
                            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                        </button>
                    </div>

                    <button 
                        className="bg-transparent border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200" 
                        onClick={onBackToHome}
                    >
                        ← Back
                    </button>
                </div>
            </header>

            {/* ─── Body Grid ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 items-start">
                {/* Sidebar (Responsive Scrollable List on Mobile) */}
                <aside 
                    className="flex flex-col lg:justify-between bg-white/65 dark:bg-[#0c0c0e]/75 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 rounded-2xl p-4 transition-all duration-300 lg:min-h-[500px]"
                    data-aos="fade-right"
                >
                    <div className="flex flex-col lg:gap-1 gap-2.5">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-2 block mb-1 lg:mb-3">Modules</span>
                        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                            {previewTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`flex items-center gap-2.5 p-2 px-3 rounded-xl cursor-pointer text-left transition-all duration-200 shrink-0 ${activeTab === tab.id ? "bg-blue-600 dark:bg-blue-600 text-white shadow-none" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/40 hover:text-slate-955 dark:hover:text-zinc-100"}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <span className={activeTab === tab.id ? "text-white/90" : "text-slate-400 dark:text-zinc-500"}>
                                        {tab.icon}
                                    </span>
                                    <span className="text-xs md:text-sm font-semibold">
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="border-t border-slate-200/50 dark:border-zinc-800/50 pt-3 lg:pt-4 mt-3 lg:mt-4 flex flex-row lg:flex-col gap-3 justify-between items-center lg:items-stretch">
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                            <span className="text-[10px] font-bold text-slate-800 dark:text-zinc-300 uppercase tracking-wider">
                                Pipeline Ready
                            </span>
                        </div>
                        <div className="flex flex-row lg:flex-col gap-4 lg:gap-1.5 text-[10px] sm:text-xs text-slate-500 dark:text-zinc-500 flex-1 justify-end lg:justify-between items-center lg:items-stretch">
                            <div className="flex gap-1.5 lg:justify-between">
                                <span>Pack</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300 font-mono text-[10px] sm:text-[11px]">am</span>
                            </div>
                            <div className="flex gap-1.5 lg:justify-between">
                                <span>Stopwords</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300 font-mono text-[10px] sm:text-[11px]">
                                    {languagePack.stopwords.length}
                                </span>
                            </div>
                            <div className="flex gap-1.5 lg:justify-between">
                                <span>Abbrs</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300 font-mono text-[10px] sm:text-[11px]">
                                    {
                                        Object.keys(languagePack.tokenization?.exceptions || {})
                                            .length
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Workspace Content */}
                <main 
                    className="flex flex-col gap-4 flex-1 min-w-0"
                    data-aos="fade-left"
                >
                    {/* Input Panel with fixed height h-[180px] */}
                    <section className="flex flex-col h-[180px] bg-white/65 dark:bg-[#0c0c0e]/75 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 rounded-2xl overflow-hidden shadow-none transition-all duration-300 shrink-0">
                        <div className="flex items-center justify-between p-3 px-4 border-b border-slate-200/50 dark:border-zinc-800/40 bg-slate-50/50 dark:bg-zinc-900/30 h-[48px] shrink-0">
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-400/80" />
                                <span className="w-2 h-2 rounded-full bg-yellow-400/80" />
                                <span className="w-2 h-2 rounded-full bg-green-400/80" />
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                                input.txt — Amharic Corpus
                            </span>
                        </div>
                        <textarea
                            className="w-full flex-1 bg-transparent border-none outline-none p-4 text-sm md:text-base text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 resize-none leading-relaxed"
                            value={inputText}
                            onChange={(event) =>
                                setInputText(event.target.value)
                            }
                            placeholder="አማርኛ ጽሑፍ እዚህ ያስገቡ..."
                            spellCheck={false}
                        />
                    </section>

                    {/* Split panels (Fluid Stack on Mobile, Fixed Grid on Desktop) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-[440px] shrink-0">
                        <section className="flex flex-col bg-[#0d1117] border border-white/5 rounded-2xl overflow-hidden shadow-none h-[300px] lg:h-full">
                            <div className="flex items-center justify-between p-3 px-4 border-b border-white/5 bg-slate-900/40 h-[48px] shrink-0">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-red-400/85" />
                                    <span className="w-2 h-2 rounded-full bg-yellow-400/85" />
                                    <span className="w-2 h-2 rounded-full bg-green-400/85" />
                                </div>
                                <div className="flex items-center gap-1.5 text-zinc-500">
                                    <Code2 size={12} />
                                    <span className="text-[10px] font-mono">
                                        snippet.ts
                                    </span>
                                </div>
                                <button
                                    className="flex items-center gap-1.5 bg-transparent border border-white/10 hover:border-white/20 text-zinc-400 hover:text-zinc-200 text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all duration-200"
                                    onClick={() =>
                                        copyCode(codeSnippets[activeTab])
                                    }
                                >
                                    {copied ? (
                                        <Check size={11} className="text-green-400" />
                                    ) : (
                                        <Copy size={11} />
                                    )}
                                    <span>{copied ? "Copied!" : "Copy"}</span>
                                </button>
                            </div>
                            <pre className="p-4 overflow-y-auto flex-1 font-mono text-xs text-zinc-300 leading-relaxed bg-black/20">
                                <code>{codeSnippets[activeTab]}</code>
                            </pre>
                        </section>

                        <section className="flex flex-col bg-white/65 dark:bg-[#0c0c0e]/75 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 rounded-2xl overflow-hidden shadow-none transition-all duration-300 h-[400px] lg:h-full">
                            <div className="flex items-center justify-between p-3 px-4 border-b border-slate-200/50 dark:border-zinc-800/40 bg-slate-50/50 dark:bg-zinc-900/30 h-[48px] shrink-0">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-red-400/80" />
                                    <span className="w-2 h-2 rounded-full bg-yellow-400/80" />
                                    <span className="w-2 h-2 rounded-full bg-green-400/80" />
                                </div>
                                <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                                    output — Execution Visualizer
                                </span>
                            </div>

                            <div className="p-4 flex-1 w-full text-slate-900 dark:text-zinc-100 bg-slate-50/30 dark:bg-zinc-900/10 flex flex-col min-h-0">
                                {renderActiveTab()}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
