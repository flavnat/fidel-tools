import { Info } from "lucide-react";
import type { PipelineLike, TransLang, TransType } from "./types";

interface TransliteratorTabProps {
    inputText: string;
    nlp: PipelineLike;
    transLang: TransLang;
    transType: TransType;
}

export default function TransliteratorTab({
    inputText,
    nlp,
    transLang,
    transType,
}: TransliteratorTabProps) {
    const result =
        transType === "felig"
            ? nlp.feligTransliterate(inputText, transLang)
            : nlp.seraTransliterate(inputText, transLang);

    return (
        <div className="dc-result-block">
            <span className="dc-result-label">Transliteration Output</span>
            <div className="dc-result-value">{result}</div>
            <div className="dc-info-box">
                <Info size={13} />
                <p>
                    <strong>Felig</strong> targets search-friendly outputs.{" "}
                    <strong>SERA</strong> targets precise Unicode-mapped
                    linguistic transliteration.
                </p>
            </div>
        </div>
    );
}
