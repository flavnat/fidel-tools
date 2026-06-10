import { ChevronRight } from "lucide-react";
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
        <div className="dc-flow">
            <div className="dc-flow-step">
                <span className="dc-flow-num">1</span>
                <div className="dc-flow-content">
                    <span className="dc-flow-label">Raw Input</span>
                    <span className="dc-flow-text">{inputText}</span>
                </div>
            </div>
            <div className="dc-flow-arrow">
                <ChevronRight size={14} />
            </div>

            <div className="dc-flow-step">
                <span className="dc-flow-num">2</span>
                <div className="dc-flow-content">
                    <span className="dc-flow-label">Lexical Analysis</span>
                    <span className="dc-flow-text">{lexed}</span>
                </div>
            </div>
            <div className="dc-flow-arrow">
                <ChevronRight size={14} />
            </div>

            <div className="dc-flow-step">
                <span className="dc-flow-num">3</span>
                <div className="dc-flow-content">
                    <span className="dc-flow-label">Stopword Filter</span>
                    <span className="dc-flow-text">{cleaned}</span>
                </div>
            </div>
            <div className="dc-flow-arrow">
                <ChevronRight size={14} />
            </div>

            <div className="dc-flow-step dc-flow-step-final">
                <span className="dc-flow-num">4</span>
                <div className="dc-flow-content">
                    <span className="dc-flow-label">Stemmed Output</span>
                    <div className="dc-flow-tags">
                        {stems.map((stem, idx) => (
                            <span key={idx} className="dc-tag">
                                {stem}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
