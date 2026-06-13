import type { LanguagePackLike } from "./types";
import { sanitizeToken } from "./utils";

interface LexicalTabProps {
    inputText: string;
    languagePack: LanguagePackLike;
}

export default function LexicalTab({
    inputText,
    languagePack,
}: LexicalTabProps) {
    const tokens = inputText.split(/\s+/).filter((word) => word.length > 0);

    const abbreviations = tokens
        .map((word) => {
            const clean = sanitizeToken(word);
            const expansionList = languagePack.tokenization?.exceptions?.[clean];
            return {
                original: word,
                expanded: expansionList ? expansionList.join(" ") : null,
            };
        })
        .filter((item) => item.expanded !== null);

    return (
        <div className="flex flex-col gap-3.5 w-full flex-1 overflow-y-auto min-h-0">
            {/* Step 1: Abbreviations */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/30 border border-slate-200/50 dark:border-zinc-800/40 rounded-xl p-3.5 flex gap-3 items-start shrink-0">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    A
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Abbreviations Detected
                    </div>
                    {abbreviations.length > 0 ? (
                        <div className="flex flex-col gap-1.5">
                            {abbreviations.map((abbr, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs md:text-sm font-mono">
                                    <span className="text-slate-800 dark:text-zinc-200 font-semibold">{abbr.original}</span>
                                    <span className="text-slate-400 dark:text-zinc-600">→</span>
                                    <span className="text-sky-600 dark:text-sky-400 font-bold">{abbr.expanded}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs md:text-sm text-slate-500 dark:text-zinc-500 font-mono italic">
                            No abbreviations detected in current corpus
                        </div>
                    )}
                </div>
            </div>

            {/* Step 2: Full Token Stream */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/30 border border-slate-200/50 dark:border-zinc-800/40 rounded-xl p-3.5 flex gap-3 items-start flex-1 min-h-0">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    N
                </div>
                <div className="flex-1 min-w-0 flex flex-col h-full">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2 shrink-0">
                        Normalized Token Stream
                    </div>
                    <div className="flex flex-wrap gap-1.5 overflow-y-auto flex-1 min-h-0 align-content-start pr-1">
                        {tokens.map((word, idx) => {
                            const clean = sanitizeToken(word);
                            const isAbbr = Boolean(languagePack.tokenization?.exceptions?.[clean]);
                            return (
                                <span
                                    key={idx}
                                    className={`inline-flex items-center gap-1.5 p-1 px-2.5 rounded-lg text-xs font-mono font-medium border transition-all duration-150 h-fit ${isAbbr ? "bg-blue-600/10 border-blue-600/20 text-blue-600 dark:text-blue-400" : "bg-slate-200/50 dark:bg-zinc-800/50 border-slate-300/30 dark:border-zinc-700/30 text-slate-700 dark:text-zinc-300"}`}
                                >
                                    {word}
                                    {isAbbr && (
                                        <span className="text-[8px] font-extrabold uppercase bg-blue-600 text-white px-1 rounded">
                                            Abbr
                                        </span>
                                    )}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
