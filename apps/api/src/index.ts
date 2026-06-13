import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { serve } from "@hono/node-server";
import { apiReference } from "@scalar/hono-api-reference";
import notifyRouter from "./routes/notify.js";
import nlpRouter from "./routes/nlp.js";
import { initDb } from "./db.js";

const app = new OpenAPIHono();

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

// Mount active sub-routers
app.route("/api/v1/notify", notifyRouter);
app.route("/notify", notifyRouter); // Direct mount fallback for frontend subscriber form
app.route("/api/v1/nlp", nlpRouter);

// Base health check & status endpoint (Industry Standard API Root)
app.get("/", (c) => {
    return c.json({
        name: "fidel-tools-api",
        description: "Production-ready OpenAPI-compliant API for Amharic NLP pre-processing",
        version: "1.0.0",
        status: "operational",
        documentation: "/docs",
        endpoints: {
            health: { path: "/", method: "GET", status: "active" },
            docs: { path: "/docs", method: "GET", status: "active" },
            openapi: { path: "/openapi.json", method: "GET", status: "active" },
        },
    });
});

// OpenAPI Spec Generation
app.doc("/openapi.json", {
    openapi: "3.0.0",
    info: {
        title: "ፊደል Tools API",
        version: "1.0.0",
        description: "ፊደል (Fidel) Tools is a developer-first suite of high-performance natural language processing APIs built specifically for Ethiopic languages. This reference provides interactive documentation for our production-grade NLP preprocessing endpoints (normalization, tokenization, stopword removal, morphological stemming, transliteration).",
    },
});

// Custom CSS styling for Scalar to align with Fidel Tools landing page design system
const customCss = `
  /* Fonts & Radius */
  :root {
    --scalar-font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --scalar-font-code: 'JetBrains Mono', 'Fira Code', monospace;
    --scalar-radius: 12px;
    --scalar-color-accent: #2563eb !important; /* Vibrant Blue Accent */
  }

  /* Force Transparent backgrounds to let the site's premium background circles and dots shine through */
  body, 
  html, 
  .scalar-app, 
  #scalar-header, 
  .sidebar, 
  .sidebar-header, 
  .sidebar-search, 
  .main, 
  .section, 
  .content, 
  .api-client,
  .api-reference {
    background: transparent !important;
    background-color: transparent !important;
  }

  /* Style headers and text elements to fit the brand color scheme */
  .dark-mode {
    --scalar-color-1: #f4f4f5 !important;
    --scalar-color-2: #a1a1aa !important;
    --scalar-color-3: #71717a !important;
    --scalar-border-color: rgba(255, 255, 255, 0.08) !important;
    --scalar-background-1: transparent !important;
    --scalar-background-2: rgba(255, 255, 255, 0.02) !important;
    --scalar-background-3: rgba(255, 255, 255, 0.04) !important;
  }

  :root:not(.dark-mode) {
    --scalar-color-1: #0f172a !important;
    --scalar-color-2: #475569 !important;
    --scalar-color-3: #64748b !important;
    --scalar-border-color: rgba(0, 0, 0, 0.08) !important;
    --scalar-background-1: transparent !important;
    --scalar-background-2: rgba(0, 0, 0, 0.02) !important;
    --scalar-background-3: rgba(0, 0, 0, 0.04) !important;
  }

  /* Glassmorphism card overlays for structural panels (Code blocks, parameter lists, etc.) */
  .references-classic .section,
  .api-client-panel,
  .code-block,
  .card,
  .sidebar-group,
  .parameter-item {
    background: rgba(255, 255, 255, 0.03) !important;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 12px;
  }

  /* Make sure sidebar links look clean */
  .sidebar-link {
    border-radius: 8px;
    margin: 2px 0;
  }

  /* Hide the Client Libraries / Code Generation section completely */
  .scalar-client-libraries,
  .client-libraries,
  .scalar-api-client-section,
  .api-client-select,
  .download-client,
  .download-button,
  .api-client-section,
  [data-testid="client-libraries"] {
    display: none !important;
  }
`;

// Scalar Documentation
app.get("/docs", (c, next) => {
    const themeParam = c.req.query("theme") || "dark";
    const forceDarkModeState = themeParam === "light" ? "light" : "dark";
    return apiReference({
        theme: "saturn",
        spec: { url: "/openapi.json" },
        pageTitle: "ፊደል Tools API Reference",
        customCss,
        forceDarkModeState,
    })(c, next);
});

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
