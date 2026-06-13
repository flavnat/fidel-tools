import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { PipelineLike } from "./types";

interface StemmerTabProps {
    inputText: string;
    nlp: PipelineLike;
}

export default function StemmerTab({ inputText, nlp }: StemmerTabProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const stemmedWords = nlp
        .lexAnalyze(inputText)
        .split(/\s+/)
        .filter((word) => word.length > 0)
        .map((word) => ({
            original: word,
            stemmed: nlp.stem(word),
        }));

    const totalPages = Math.ceil(stemmedWords.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedWords = stemmedWords.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="dc-table-wrapper">
            <div className="dc-table-header">
                <span>Original</span>
                <span></span>
                <span>Stemmed</span>
            </div>
            <div className="dc-table-body">
                {paginatedWords.map((item, idx) => (
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
            {totalPages > 1 && (
                <div className="dc-pagination">
                    <button
                        className="dc-pagination-btn"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="dc-pagination-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="dc-pagination-btn"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
