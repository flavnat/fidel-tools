import { ChevronDown } from "lucide-react";
import type { PipelineLike } from "./types";

interface PipelineTabProps {
    inputText: string;
    nlp: PipelineLike;
}

export default function PipelineTab({ inputText, nlp }: PipelineTabProps) {
    const lexed = nlp.lexAnalyze(inputText);
    const cleaned = nlp.removeStopwords(lexed);
    const stems = cleaned
        .split(/\s+/)
        .filter((word) => word.length > 0)
        .map((word) => nlp.stem(word));

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-start gap-3 p-3 bg-slate-100/30 dark:bg-zinc-900/10 border border-slate-200/40 dark:border-zinc-800/20 rounded-xl transition-all duration-300">
                <span className="w-5.5 h-5.5 min-w-5.5 rounded-md bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center font-mono text-[10px] font-bold mt-0.5">1</span>
                <div className="flex-1 min-w-0">
                    <span className="block text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Raw Input</span>
                    <span className="block text-xs md:text-sm text-slate-900 dark:text-zinc-100 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{inputText}</span>
                </div>
            </div>
            <div className="flex justify-center text-slate-300 dark:text-zinc-700 py-0.5 opacity-60">
                <ChevronDown size={14} />
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-100/30 dark:bg-zinc-900/10 border border-slate-200/40 dark:border-zinc-800/20 rounded-xl transition-all duration-300">
                <span className="w-5.5 h-5.5 min-w-5.5 rounded-md bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center font-mono text-[10px] font-bold mt-0.5">2</span>
                <div className="flex-1 min-w-0">
                    <span className="block text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Lexical Analysis</span>
                    <span className="block text-xs md:text-sm text-slate-900 dark:text-zinc-100 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{lexed}</span>
                </div>
            </div>
            <div className="flex justify-center text-slate-300 dark:text-zinc-700 py-0.5 opacity-60">
                <ChevronDown size={14} />
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-100/30 dark:bg-zinc-900/10 border border-slate-200/40 dark:border-zinc-800/20 rounded-xl transition-all duration-300">
                <span className="w-5.5 h-5.5 min-w-5.5 rounded-md bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center font-mono text-[10px] font-bold mt-0.5">3</span>
                <div className="flex-1 min-w-0">
                    <span className="block text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Stopword Filter</span>
                    <span className="block text-xs md:text-sm text-slate-900 dark:text-zinc-100 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{cleaned}</span>
                </div>
            </div>
            <div className="flex justify-center text-slate-300 dark:text-zinc-700 py-0.5 opacity-60">
                <ChevronDown size={14} />
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-500/5 dark:bg-blue-500/5 border border-blue-500/20 dark:border-blue-500/15 rounded-xl transition-all duration-300">
                <span className="w-5.5 h-5.5 min-w-5.5 rounded-md bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center font-mono text-[10px] font-bold mt-0.5">4</span>
                <div className="flex-1 min-w-0">
                    <span className="block text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Stemmed Output</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {stems.map((stem, idx) => (
                            <span key={idx} className="bg-blue-600 dark:bg-blue-600 text-white font-mono text-[10px] px-2 py-0.5 rounded font-semibold">
                                {stem}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
