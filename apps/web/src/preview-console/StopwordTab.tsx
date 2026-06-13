import type { LanguagePackLike } from "./types";
import { sanitizeToken } from "./utils";

interface StopwordTabProps {
    inputText: string;
    languagePack: LanguagePackLike;
}

export default function StopwordTab({
    inputText,
    languagePack,
}: StopwordTabProps) {
    const tokens = inputText.split(/\s+/).filter((word) => word.length > 0);
    const stopwordItems = tokens.map((word) => {
        const cleanWord = sanitizeToken(word);
        return {
            word,
            isStopword: languagePack.stopwords.includes(cleanWord),
        };
    });

    const stopwordCount = stopwordItems.filter((i) => i.isStopword).length;

    return (
        <div className="flex flex-col gap-3.5 w-full flex-1 overflow-y-auto min-h-0">
            {/* Step 1: Stopword Summary */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/30 border border-slate-200/50 dark:border-zinc-800/40 rounded-xl p-3.5 flex gap-3 items-start shrink-0">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    W
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                        Stopword Statistics
                    </div>
                    <div className="text-xs md:text-sm text-slate-700 dark:text-zinc-300 font-mono leading-relaxed">
                        Found <span className="font-bold text-red-500">{stopwordCount}</span> stopwords out of <span className="font-bold text-slate-900 dark:text-white">{tokens.length}</span> tokens.
                    </div>
                </div>
            </div>

            {/* Step 2: Stopwords Classification Map */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/30 border border-slate-200/50 dark:border-zinc-800/40 rounded-xl p-3.5 flex gap-3 items-start flex-1 min-h-0">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    SF
                </div>
                <div className="flex-1 min-w-0 flex flex-col h-full">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2 shrink-0">
                        Stopwords Classification Map
                    </div>
                    <div className="flex flex-wrap gap-1.5 overflow-y-auto flex-1 min-h-0 align-content-start pr-1">
                        {stopwordItems.map((item, idx) => (
                            <span
                                key={idx}
                                className={`inline-flex items-center gap-1.5 p-1 px-2.5 rounded-lg text-xs font-mono font-semibold border transition-all duration-150 shrink-0 h-fit ${item.isStopword ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"}`}
                            >
                                {item.word}
                                <span className="text-[9px] opacity-75">
                                    {item.isStopword ? "×" : "✓"}
                                </span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
