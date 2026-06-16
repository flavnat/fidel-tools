import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeSnippetProps {
  title?: string;
  code: string;
}

export default function CodeSnippet({ title = "Implementation Snippet", code }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-900 bg-[#f9f9fb] dark:bg-black/90 rounded-lg overflow-hidden transition-all shadow-xs">
      {/* Code Header */}
      <div className="bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900 px-4 py-2.5 flex items-center justify-between text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
        <span>{title.toUpperCase()}</span>
        <button
          onClick={handleCopy}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-bold">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>COPY CODE</span>
            </>
          )}
        </button>
      </div>
      {/* Code Content - Expanded height and increased text size */}
      <div className="p-4 text-sm font-mono text-zinc-800 dark:text-zinc-200 overflow-x-auto leading-relaxed max-h-[500px] overflow-y-auto">
        <pre className="whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
