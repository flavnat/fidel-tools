import { useEffect, useState } from "react";
import { Pipeline } from "@fidel-tools/core";
import amPack from "../../../packages/lang-am/am.json";
import { Check, Code2, Copy } from "lucide-react";
import LexicalTab from "./preview-console/LexicalTab";
import PipelineTab from "./preview-console/PipelineTab";
import StemmerTab from "./preview-console/StemmerTab";
import StopwordTab from "./preview-console/StopwordTab";
import TransliteratorTab from "./preview-console/TransliteratorTab";
import { previewTabs } from "./preview-console/tabConfig";
import type {
    LanguagePackLike,
    PipelineLike,
    PreviewTabId,
    TransLang,
    TransType,
} from "./preview-console/types";

const nlp = new Pipeline(amPack as any) as unknown as PipelineLike;
const languagePack = amPack as unknown as LanguagePackLike;

interface PreviewPageProps {
    onBackToHome: () => void;
}

export default function PreviewPage({ onBackToHome }: PreviewPageProps) {
    const [inputText, setInputText] = useState(
        "የገንዘብ ሚኒስቴር ምክር ቤተ ከሃያ ዓመታት በፊት ያወጣውን የ ተጨማሪ እሴት ታክስ ቫት አዋጅን የሚተካ ረቂቅ ተዘጋጀ። ት/ቤት እና መስሪያ ቤት",
    );
    const [activeTab, setActiveTab] = useState<PreviewTabId>("pipeline");
    const [transLang, setTransLang] = useState<TransLang>("am");
    const [transType, setTransType] = useState<TransType>("felig");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => window.clearTimeout(timeout);
    }, [loading]);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    const codeSnippets: Record<PreviewTabId, string> = {
        pipeline: `import { Pipeline } from '@fidel-tools/core';
import amPack from '@fidel-tools/lang-am';

const nlp = new Pipeline(amPack);

const corpus = "${inputText.substring(0, 30)}...";
const lexed = nlp.lexAnalyze(corpus);
const clean = nlp.removeStopwords(lexed);
const words = clean.split(' ');
const stems = words.map((word) => nlp.stem(word));

console.log(stems);`,
        transliterator: `import { Pipeline } from '@fidel-tools/core';
import amPack from '@fidel-tools/lang-am';

const nlp = new Pipeline(amPack);
const word = "${transLang === "am" ? "ወንበር" : "wenber"}";

const result = nlp.${transType === "felig" ? "feligTransliterate" : "seraTransliterate"}(word, "${transLang}");
console.log(result);`,
        stemmer: `import { Pipeline } from '@fidel-tools/core';
import amPack from '@fidel-tools/lang-am';

const nlp = new Pipeline(amPack);
const stem = nlp.stem("ልጆቻቸውን");

console.log(stem); // → ልጅ`,
        stopword: `import { Pipeline } from '@fidel-tools/core';
import amPack from '@fidel-tools/lang-am';

const nlp = new Pipeline(amPack);
const text = "${inputText.substring(0, 30)}...";
const result = nlp.removeStopwords(text);

console.log(result);`,
        lexical: `import { Pipeline } from '@fidel-tools/core';
import amPack from '@fidel-tools/lang-am';

const nlp = new Pipeline(amPack);
const rawText = "ት/ቤት እና መስሪያ ቤት";
const cleaned = nlp.lexAnalyze(rawText);

console.log(cleaned); // → "ትምህርት ቤት እና መስሪያ ቤት"`,
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case "pipeline":
                return <PipelineTab inputText={inputText} nlp={nlp} />;
            case "transliterator":
                return (
                    <TransliteratorTab
                        inputText={inputText}
                        nlp={nlp}
                        transLang={transLang}
                        transType={transType}
                    />
                );
            case "stemmer":
                return <StemmerTab inputText={inputText} nlp={nlp} />;
            case "stopword":
                return (
                    <StopwordTab
                        inputText={inputText}
                        languagePack={languagePack}
                    />
                );
            case "lexical":
                return (
                    <LexicalTab
                        inputText={inputText}
                        languagePack={languagePack}
                    />
                );
        }
    };

    if (loading) {
        return (
            <div className="loader-overlay">
                <div className="loader-content">
                    <div className="logo-fill-container">
                        <span className="logo-fill-bg">ፊደል</span>
                        <span
                            className="logo-fill-fg"
                            style={{ animationDuration: "1.5s" }}
                        >
                            ፊደል
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dev-console">
            <header className="dc-topbar">
                <div className="dc-topbar-left">
                    <span className="dc-logo" onClick={onBackToHome}>
                        ፊደል
                    </span>
                    <span className="dc-separator">/</span>
                    <span className="dc-title">Developer Console</span>
                    <span className="dc-version">v2.0.1</span>
                </div>
                <div className="dc-topbar-right">
                    <span className="dc-badge-live">
                        <span className="dc-pulse" />
                        LIVE
                    </span>
                    <span className="dc-badge-internal">INTERNAL</span>
                    <button className="dc-back-btn" onClick={onBackToHome}>
                        ← Back
                    </button>
                </div>
            </header>

            <div className="dc-body">
                <aside className="dc-sidebar">
                    <div className="dc-sidebar-section">
                        <span className="dc-sidebar-label">Modules</span>
                        <nav className="dc-nav">
                            {previewTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`dc-nav-item ${activeTab === tab.id ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <span className="dc-nav-icon">
                                        {tab.icon}
                                    </span>
                                    <span className="dc-nav-label">
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="dc-sidebar-status">
                        <div className="dc-status-row">
                            <span className="dc-status-dot" />
                            <span className="dc-status-text">
                                Pipeline Ready
                            </span>
                        </div>
                        <div className="dc-status-meta">
                            <div className="dc-meta-row">
                                <span>Language Pack</span>
                                <span className="dc-meta-val">am</span>
                            </div>
                            <div className="dc-meta-row">
                                <span>Stopwords</span>
                                <span className="dc-meta-val">
                                    {languagePack.stopwords.length}
                                </span>
                            </div>
                            <div className="dc-meta-row">
                                <span>Abbreviations</span>
                                <span className="dc-meta-val">
                                    {
                                        Object.keys(languagePack.tokenization?.exceptions || {})
                                            .length
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="dc-workspace">
                    <section className="dc-panel dc-input-panel">
                        <div className="dc-panel-header">
                            <div className="dc-panel-dots">
                                <span />
                                <span />
                                <span />
                            </div>
                            <span className="dc-panel-title">
                                input.txt — Amharic Corpus
                            </span>
                        </div>
                        <textarea
                            className="dc-textarea"
                            value={inputText}
                            onChange={(event) =>
                                setInputText(event.target.value)
                            }
                            placeholder="አማርኛ ጽሑፍ እዚህ ያስገቡ..."
                            spellCheck={false}
                        />

                        {activeTab === "transliterator" && (
                            <div className="dc-config-bar">
                                <div className="dc-config-group">
                                    <span className="dc-config-label">
                                        Direction
                                    </span>
                                    <div className="dc-toggle">
                                        <button
                                            className={
                                                transLang === "am"
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() => setTransLang("am")}
                                        >
                                            AM → ASCII
                                        </button>
                                        <button
                                            className={
                                                transLang === "en"
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() => setTransLang("en")}
                                        >
                                            ASCII → AM
                                        </button>
                                    </div>
                                </div>
                                <div className="dc-config-group">
                                    <span className="dc-config-label">
                                        Engine
                                    </span>
                                    <div className="dc-toggle">
                                        <button
                                            className={
                                                transType === "felig"
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setTransType("felig")
                                            }
                                        >
                                            Felig
                                        </button>
                                        <button
                                            className={
                                                transType === "sera"
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() => setTransType("sera")}
                                        >
                                            SERA
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <div className="dc-split">
                        <section className="dc-panel dc-code-panel">
                            <div className="dc-panel-header dc-panel-header-dark">
                                <div className="dc-panel-dots">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                                <div className="dc-code-title-row">
                                    <Code2 size={12} />
                                    <span className="dc-panel-title">
                                        snippet.ts
                                    </span>
                                </div>
                                <button
                                    className="dc-copy-btn"
                                    onClick={() =>
                                        copyCode(codeSnippets[activeTab])
                                    }
                                >
                                    {copied ? (
                                        <Check size={12} />
                                    ) : (
                                        <Copy size={12} />
                                    )}
                                    <span>{copied ? "Copied!" : "Copy"}</span>
                                </button>
                            </div>
                            <pre className="dc-code-content">
                                <code>{codeSnippets[activeTab]}</code>
                            </pre>
                        </section>

                        <section className="dc-panel dc-output-panel">
                            <div className="dc-panel-header">
                                <div className="dc-panel-dots">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                                <span className="dc-panel-title">
                                    output — Execution Visualizer
                                </span>
                            </div>

                            <div className="dc-output-body">
                                {renderActiveTab()}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
