import { ArrowRight } from "lucide-react";
import type { PipelineLike } from "./types";

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
        <div className="dc-table-wrapper">
            <div className="dc-table-header">
                <span>Original</span>
                <span></span>
                <span>Stemmed</span>
            </div>
            <div className="dc-table-body">
                {stemmedWords.map((item, idx) => (
                    <div key={idx} className="dc-table-row">
                        <span className="dc-cell-original">
                            {item.original}
                        </span>
                        <span className="dc-cell-arrow">
                            <ArrowRight size={12} />
                        </span>
                        <span className="dc-cell-stemmed">{item.stemmed}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
