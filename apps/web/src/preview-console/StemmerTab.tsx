import type { PipelineLike } from "./types";
import { ArrowRight } from "lucide-react";

interface StemmerTabProps {
    inputText: string;
    nlp: PipelineLike;
}

export default function StemmerTab({ inputText, nlp }: StemmerTabProps) {
    const stemmedWords = nlp
        .lexAnalyze(inputText)
        .split(/\s+/)
        .filter((word) => word.length > 0)
        .map((word) => ({
            original: word,
            stemmed: nlp.stem(word),
        }));

    return (
        <div className="flex flex-col gap-3.5 w-full flex-1 overflow-y-auto min-h-0">
            {/* Step 1: Stemmer Context Info */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/30 border border-slate-200/50 dark:border-zinc-800/40 rounded-xl p-3.5 flex gap-3 items-start shrink-0">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    M
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                        Morphological Analyzer Configuration
                    </div>
                    <div className="text-xs md:text-sm text-slate-600 dark:text-zinc-400 font-mono leading-relaxed">
                        Algorithm: Ethiopic Grammar Rule Stemmer (Amharic context-aware)
                    </div>
                </div>
            </div>

            {/* Step 2: Stem Mapping Stream */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/30 border border-slate-200/50 dark:border-zinc-800/40 rounded-xl p-3.5 flex gap-3 items-start flex-1 min-h-0">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    S
                </div>
                <div className="flex-1 min-w-0 flex flex-col h-full">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2 shrink-0">
                        Stem Mapping Stream
                    </div>
                    <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 min-h-0 pr-1">
                        {stemmedWords.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-2 bg-slate-200/20 dark:bg-zinc-950/20 border border-slate-200/40 dark:border-zinc-800/20 rounded-lg text-xs md:text-sm font-mono transition-all duration-200 shrink-0"
                            >
                                <span className="text-slate-800 dark:text-zinc-300 font-medium break-all flex-1">
                                    {item.original}
                                </span>
                                <ArrowRight size={12} className="text-slate-400 dark:text-zinc-600 shrink-0" />
                                <span className="text-sky-600 dark:text-sky-400 font-bold break-all flex-1 text-right">
                                    {item.stemmed}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
