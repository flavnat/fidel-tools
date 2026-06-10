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
    const lexicalItems = inputText.split(/\s+/).map((word) => {
        const clean = sanitizeToken(word);
        const expansion = languagePack.abbreviations[clean];
        return {
            original: word,
            expanded: expansion || null,
            isAbbreviation: Boolean(expansion),
        };
    });

    return (
        <div className="dc-table-wrapper">
            <div className="dc-table-header dc-table-lexical">
                <span>Token</span>
                <span>Expansion</span>
                <span>Type</span>
            </div>
            <div className="dc-table-body">
                {lexicalItems.map((item, idx) => (
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
        </div>
    );
}
