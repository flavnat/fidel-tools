import { Hono } from "hono";
import { getPack, getPipeline, SUPPORTED_LANGS } from "../lang-registry.js";
import { authenticateApiKey } from "../middleware/auth.js";
import { apiRateLimiter } from "../middleware/rateLimiter.js";
import {
    normalize,
    sentenceTokenize,
    stem,
    removeStopwords,
    felig_transliterate,
    sera_transliterate,
} from "@fidel-tools/core";

const nlpRouter = new Hono();

// Apply auth and rate limiting to all NLP endpoints
nlpRouter.use("*", authenticateApiKey);
nlpRouter.use("*", apiRateLimiter);

// 1. Get supported languages metadata
nlpRouter.get("/languages", (c) => {
    return c.json({
        supported: SUPPORTED_LANGS,
        default: "am",
    });
});

// 2. Custom execution Pipeline
nlpRouter.post("/pipeline", async (c) => {
    try {
        const body = await c.req.json();
        const { text, lang = "am", steps = ["normalize", "tokenize", "stopwords", "stem"] } = body;
        if (!text || typeof text !== "string") {
            return c.json({ error: "Missing or invalid 'text' in request body" }, 400);
        }

        const pack = await getPack(lang);
        const pipeline = await getPipeline(lang);

        const result: Record<string, any> = { input: text, lang };
        let current = text;

        if (steps.includes("normalize")) {
            current = normalize(current, pack);
            result.normalized = current;
        }
        if (steps.includes("tokenize")) {
            result.sentences = sentenceTokenize(current, pack);
            result.tokens = current.split(/\s+/).filter(Boolean);
        }
        if (steps.includes("stopwords")) {
            current = removeStopwords(current, pack);
            result.stopwordsRemoved = current;
        }
        if (steps.includes("stem")) {
            const tokenList = current.split(/\s+/).filter(Boolean);
            result.stems = tokenList.map((w) => stem(w, pack));
        }

        return c.json(result);
    } catch (err: any) {
        return c.json({ error: err.message || "Pipeline failed" }, 400);
    }
});

// 3. Normalizer
nlpRouter.post("/normalize", async (c) => {
    try {
        const { text, lang = "am" } = await c.req.json();
        if (!text || typeof text !== "string") {
            return c.json({ error: "Missing or invalid 'text' in request body" }, 400);
        }
        const pack = await getPack(lang);
        const result = normalize(text, pack);
        return c.json({ input: text, normalized: result, lang });
    } catch (err: any) {
        return c.json({ error: err.message }, 400);
    }
});

// 4. Tokenizer
nlpRouter.post("/tokenize", async (c) => {
    try {
        const { text, lang = "am" } = await c.req.json();
        if (!text || typeof text !== "string") {
            return c.json({ error: "Missing or invalid 'text' in request body" }, 400);
        }
        const pack = await getPack(lang);
        const sentences = sentenceTokenize(text, pack);
        const words = text.split(/\s+/).filter(Boolean);
        return c.json({ input: text, sentences, words, lang });
    } catch (err: any) {
        return c.json({ error: err.message }, 400);
    }
});

// 5. Remove Stopwords
nlpRouter.post("/remove-stopwords", async (c) => {
    try {
        const { text, lang = "am" } = await c.req.json();
        if (!text || typeof text !== "string") {
            return c.json({ error: "Missing or invalid 'text' in request body" }, 400);
        }

        const pack = await getPack(lang);
        const result = removeStopwords(text, pack);
        return c.json({ input: text, result, lang });
    } catch (err: any) {
        return c.json({ error: err.message }, 400);
    }
});

// 6. Morphological Stemmer
nlpRouter.post("/stem", async (c) => {
    try {
        const body = await c.req.json();
        const { word, words, lang = "am" } = body;
        const pack = await getPack(lang);

        if (word && typeof word === "string") {
            const stemmed = stem(word, pack);
            return c.json({ input: word, stem: stemmed, lang });
        } else if (Array.isArray(words)) {
            const stems = words.map((w) => ({
                word: w,
                stem: typeof w === "string" ? stem(w, pack) : null,
            }));
            return c.json({ stems, lang });
        }
        return c.json({ error: "Missing 'word' string or 'words' array in request body" }, 400);
    } catch (err: any) {
        return c.json({ error: err.message }, 400);
    }
});

// 7. Transliteration (Felig / SERA)
nlpRouter.post("/transliterate", async (c) => {
    try {
        const { text, direction = "am", type = "felig", lang = "am" } = await c.req.json();
        if (!text || typeof text !== "string") {
            return c.json({ error: "Missing or invalid 'text' in request body" }, 400);
        }

        const pack = await getPack(lang);
        const method = type === "sera" ? sera_transliterate : felig_transliterate;
        const result = method(text, direction === "en" ? "en" : "am", pack);

        return c.json({
            input: text,
            direction,
            type,
            result,
            lang,
        });
    } catch (err: any) {
        return c.json({ error: err.message }, 400);
    }
});

export default nlpRouter;
