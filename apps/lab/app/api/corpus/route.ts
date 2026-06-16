import { NextRequest, NextResponse } from "next/server";
import { nlp } from "@/lib/nlp";

export async function POST(req: NextRequest) {
  try {
    const { documents }: { documents: Array<{ id: string; content: string }> } = await req.json();
    if (!Array.isArray(documents)) {
      return NextResponse.json({ error: "Missing or invalid documents array" }, { status: 400 });
    }

    const startTime = Date.now();
    let totalTokens = 0;
    const invertedIndex: Record<string, Array<{ id: string; count: number }>> = {};
    const unreducedTokens: string[] = [];

    documents.forEach((doc) => {
      const normalized = nlp.normalize(doc.content);
      const lexed = nlp.lexAnalyze(normalized);
      const cleaned = nlp.removeStopwords(lexed);
      const tokens = cleaned.split(/\s+/).filter(Boolean);
      totalTokens += tokens.length;

      tokens.forEach((w) => {
        const stemmed = nlp.stem(w);
        if (!stemmed) return;

        if (stemmed === w && w.length > 3) {
          unreducedTokens.push(w);
        }

        if (!invertedIndex[stemmed]) {
          invertedIndex[stemmed] = [];
        }

        const docEntry = invertedIndex[stemmed].find((entry) => entry.id === doc.id);
        if (docEntry) {
          docEntry.count++;
        } else {
          invertedIndex[stemmed].push({ id: doc.id, count: 1 });
        }
      });
    });

    const elapsedMs = Date.now() - startTime;
    const uniqueStems = Object.keys(invertedIndex).length;

    const uniqueUnreduced = Array.from(new Set(unreducedTokens)).slice(0, 50);

    return NextResponse.json({
      invertedIndex,
      stats: {
        totalDocuments: documents.length,
        totalTokensProcessed: totalTokens,
        uniqueStemsCount: uniqueStems,
        processingTimeMs: elapsedMs,
        unreducedTokens: uniqueUnreduced,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
  }
}
