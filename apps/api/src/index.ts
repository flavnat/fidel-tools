import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { serve } from "@hono/node-server";
import notifyRouter from "./routes/notify.js";
import nlpRouter from "./routes/nlp.js";
import { initDb } from "./db.js";

const app = new Hono();

// Initialize DB schema & default developer API keys
initDb().catch((err) => {
    console.error("Database initialization failed on startup:", err);
});

// Global Middlewares
app.use(
    "*",
    cors({
        origin: "*",
        allowMethods: ["GET", "POST", "OPTIONS"],
        allowHeaders: ["Content-Type", "x-api-key", "Authorization"],
    }),
);
app.use("*", logger());
app.use("*", prettyJSON());

// Base health check & status endpoint (Industry Standard API Root)
app.get("/", (c) => {
    return c.json({
        name: "fidel-tools-api",
        description: "Production-ready Hono API for Amharic NLP pre-processing",
        version: "1.0.0",
        status: "operational",
        documentation: "https://github.com/Yehonatal/fidel-tools",
        endpoints: {
            health: { path: "/", method: "GET", status: "active" },
            notify: { path: "/api/v1/notify", method: "POST", status: "active" },
            nlp: {
                pipeline: { path: "/api/v1/nlp/pipeline", method: "POST" },
                normalize: { path: "/api/v1/nlp/normalize", method: "POST" },
                tokenize: { path: "/api/v1/nlp/tokenize", method: "POST" },
                removeStopwords: { path: "/api/v1/nlp/remove-stopwords", method: "POST" },
                stem: { path: "/api/v1/nlp/stem", method: "POST" },
                transliterate: { path: "/api/v1/nlp/transliterate", method: "POST" },
            },
        },
    });
});

// Mount active sub-routers
app.route("/api/v1/notify", notifyRouter);
app.route("/notify", notifyRouter); // Direct mount fallback for frontend subscriber form
app.route("/api/v1/nlp", nlpRouter);

// Unhandled error recovery handler
app.onError((err, c) => {
    console.error("Unhandled API Exception:", err);
    return c.json({ error: "Internal Server Error", message: err.message }, 500);
});

// Start serve instance
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
console.log(`Server listening on port ${port}`);
serve({
    fetch: app.fetch,
    port,
});

export default app;
