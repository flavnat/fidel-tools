import { useState } from "react";
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const lexicalItems = inputText.split(/\s+/).map((word) => {
        const clean = sanitizeToken(word);
        const expansionList = languagePack.tokenization?.exceptions?.[clean];
        const expansion = expansionList ? expansionList.join(" ") : null;
        return {
            original: word,
            expanded: expansion,
            isAbbreviation: Boolean(expansionList),
        };
    });

    const totalPages = Math.ceil(lexicalItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = lexicalItems.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="dc-table-wrapper">
            <div className="dc-table-header dc-table-lexical">
                <span>Token</span>
                <span>Expansion</span>
                <span>Type</span>
            </div>
            <div className="dc-table-body">
                {paginatedItems.map((item, idx) => (
                    <div
                        key={idx}
                        className={`dc-table-row dc-table-lexical ${item.isAbbreviation ? "dc-row-highlight" : ""}`}
                    >
                        <span className="dc-cell-original">
                            {item.original}
                        </span>
                        <span className="dc-cell-stemmed">
                            {item.expanded || "—"}
                        </span>
                        <span
                            className={`dc-lex-badge ${item.isAbbreviation ? "abbr" : "norm"}`}
                        >
                            {item.isAbbreviation ? "ABBR" : "NORM"}
                        </span>
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
