import { AlertTriangle } from "lucide-react";
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
    const stopwordItems = inputText.split(/\s+/).map((word) => {
        const cleanWord = sanitizeToken(word);
        return {
            word,
            isStopword: languagePack.stopwords.includes(cleanWord),
        };
    });

    return (
        <div className="dc-result-block">
            <span className="dc-result-label">Token Classification</span>
            <div className="dc-stopword-tags">
                {stopwordItems.map((item, idx) => (
                    <span
                        key={idx}
                        className={`dc-sw-tag ${item.isStopword ? "filtered" : "kept"}`}
                    >
                        {item.word}
                        <span className="dc-sw-status">
                            {item.isStopword ? "×" : "✓"}
                        </span>
                    </span>
                ))}
            </div>
            <div className="dc-info-box dc-info-warn">
                <AlertTriangle size={13} />
                <p>
                    Filtered tokens carry negligible semantic weight. Removing
                    them improves search precision by ~40%.
                </p>
            </div>
        </div>
    );
}
