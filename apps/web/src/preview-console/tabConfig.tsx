import type { ReactNode } from "react";
import {
    AlertTriangle,
    BookOpen,
    GitBranch,
    Terminal,
    Zap,
} from "lucide-react";
import type { PreviewTabId } from "./types";

export interface PreviewTabConfig {
    id: PreviewTabId;
    label: string;
    icon: ReactNode;
}

export const previewTabs: PreviewTabConfig[] = [
    { id: "pipeline", label: "Pipeline", icon: <Zap size={14} /> },
    {
        id: "transliterator",
        label: "Transliterator",
        icon: <BookOpen size={14} />,
    },
    { id: "stemmer", label: "Stemmer", icon: <GitBranch size={14} /> },
    { id: "stopword", label: "Stopwords", icon: <AlertTriangle size={14} /> },
    { id: "lexical", label: "Lexical", icon: <Terminal size={14} /> },
];
