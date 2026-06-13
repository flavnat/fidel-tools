import { Hono } from "hono";
import { pool } from "../db.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const notifyRouter = new Hono();

// Apply public rate limiter to subscription requests: maximum 10 submissions per minute per IP address
notifyRouter.use(
    "/",
    rateLimiter({
        windowMs: 60 * 1000,
        max: 10,
        keyGenerator: (c) => {
            // Retrieve client IP address
            const forwarded = c.req.header("x-forwarded-for");
            if (forwarded) {
                return forwarded.split(",")[0].trim();
            }
            return "ip-unknown";
        },
    }),
);

notifyRouter.post("/", async (c) => {
    try {
        const { email } = await c.req.json();
        if (!email || typeof email !== "string" || !email.includes("@")) {
            return c.json({ error: "Invalid email address" }, 400);
        }

        const emailLower = email.trim().toLowerCase();

        // Insert email into PostgreSQL database, avoiding duplicates via ON CONFLICT
        await pool.query(
            "INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING",
            [emailLower],
        );

        return c.json({ success: true, message: "Subscribed successfully" });
    } catch (error: any) {
        console.error("Subscription endpoint error:", error);
        return c.json(
            { error: "Internal server error", details: error.message },
            500,
        );
    }
});

export default notifyRouter;
