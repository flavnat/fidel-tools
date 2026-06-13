import type { PipelineLike, TransLang, TransType } from "./types";

interface TransliteratorTabProps {
    inputText: string;
    nlp: PipelineLike;
    transLang: TransLang;
    setTransLang: (lang: TransLang) => void;
    transType: TransType;
    setTransType: (type: TransType) => void;
}

export default function TransliteratorTab({
    inputText,
    nlp,
    transLang,
    setTransLang,
    transType,
    setTransType,
}: TransliteratorTabProps) {
    const result =
        transType === "felig"
            ? nlp.feligTransliterate(inputText, transLang)
            : nlp.seraTransliterate(inputText, transLang);

    return (
        <div className="flex flex-col gap-3.5 w-full flex-1 overflow-y-auto min-h-0">
            {/* Step 1: Configuration */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/30 border border-slate-200/50 dark:border-zinc-800/40 rounded-xl p-3.5 flex gap-3 items-start shrink-0">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    D
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Transliteration Configuration
                    </div>
                    <div className="flex flex-wrap gap-4 items-center mt-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                Direction
                            </span>
                            <div className="flex bg-slate-200/50 dark:bg-zinc-950/50 border border-slate-200/70 dark:border-zinc-800/70 rounded-lg p-0.5 gap-0.5">
                                <button
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all duration-200 ${transLang === "am" ? "bg-blue-600 text-white shadow-none" : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"}`}
                                    onClick={() => setTransLang("am")}
                                >
                                    AM → ASCII
                                </button>
                                <button
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all duration-200 ${transLang === "en" ? "bg-blue-600 text-white shadow-none" : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"}`}
                                    onClick={() => setTransLang("en")}
                                >
                                    ASCII → AM
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                Engine
                            </span>
                            <div className="flex bg-slate-200/50 dark:bg-zinc-950/50 border border-slate-200/70 dark:border-zinc-800/70 rounded-lg p-0.5 gap-0.5">
                                <button
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all duration-200 ${transType === "felig" ? "bg-blue-600 text-white shadow-none" : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"}`}
                                    onClick={() => setTransType("felig")}
                                >
                                    Felig
                                </button>
                                <button
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all duration-200 ${transType === "sera" ? "bg-blue-600 text-white shadow-none" : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"}`}
                                    onClick={() => setTransType("sera")}
                                >
                                    SERA
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 2: Transliteration Result */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/30 border border-slate-200/50 dark:border-zinc-800/40 rounded-xl p-3.5 flex gap-3 items-start flex-1 min-h-0">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    TR
                </div>
                <div className="flex-1 min-w-0 flex flex-col h-full">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2 shrink-0">
                        Transliterated Output
                    </div>
                    <div className="text-sm md:text-base text-sky-600 dark:text-sky-400 font-semibold font-mono bg-slate-200/30 dark:bg-zinc-950/20 border border-slate-200/45 dark:border-zinc-800/40 p-4 rounded-xl break-all leading-relaxed flex-1 overflow-y-auto min-h-0 pr-1">
                        {result}
                    </div>
                </div>
            </div>
        </div>
    );
}
