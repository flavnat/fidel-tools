import React, { useState, useEffect } from "react";
import {
    Sun,
    Moon,
    Github,
    Sparkles,
    X,
    Code2,
    Copy,
    Check,
} from "lucide-react";
import PreviewPage from "./PreviewPage.tsx";

interface ModalData {
    title: string;
    content: React.ReactNode;
}

function App() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const saved = localStorage.getItem("fidel-theme");
        return (saved as "light" | "dark") || "light";
    });

    const [modal, setModal] = useState<ModalData | null>(null);
    const [logoClicks, setLogoClicks] = useState(0);
    const [isBursting, setIsBursting] = useState(false);
    const [currentPage, setCurrentPage] = useState<"home" | "preview">(() => {
        return window.location.pathname === "/preview" ? "preview" : "home";
    });

    // Fresh load loading screen
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handlePopState = () => {
            setCurrentPage(
                window.location.pathname === "/preview" ? "preview" : "home",
            );
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const navigateTo = (page: "home" | "preview") => {
        setCurrentPage(page);
        window.history.pushState(
            null,
            "",
            page === "preview" ? "/preview" : "/",
        );
    };

    const handleLogoClick = () => {
        if (isBursting) return;
        setLogoClicks((prev) => {
            const next = prev + 1;
            if (next >= 7) {
                setIsBursting(true);
                setTimeout(() => {
                    navigateTo("preview");
                    setIsBursting(false);
                    setLogoClicks(0);
                }, 700);
                return 7;
            }
            return next;
        });
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    // Update theme class on body
    useEffect(() => {
        localStorage.setItem("fidel-theme", theme);
        if (theme === "dark") {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [theme]);

    // Target date set to exactly one month from current date: July 9, 2026
    const calculateTimeLeft = () => {
        const difference = +new Date("2026-07-09T00:00:00+03:00") - +new Date();
        let timeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            const emailToSubmit = email.trim();
            // Optimistically transition UI immediately to handle cold starts gracefully
            setSubmitted(true);
            setEmail("");

            // Fire request in background without holding up the user interface
            const apiUrl = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";
            fetch(`${apiUrl}/notify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: emailToSubmit }),
            }).catch((err) => {
                console.error("Background subscription request failed:", err);
            });
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openAboutModal = () => {
        setModal({
            title: "About ፊደል (Fidel)",
            content: (
                <div className="modal-content-body">
                    <p>
                        We are passionate developers trying to solve our own
                        problem and help in the process.
                    </p>
                    <p style={{ marginTop: "1rem" }}>
                        We want to empower developers building for the Amharic
                        and Ethiopic ecosystem by providing modern,
                        high-performance Natural Language Processing (NLP)
                        tools, stemmers, transliterators, and corpus indexers.
                    </p>
                </div>
            ),
        });
    };

    const openTermsModal = () => {
        setModal({
            title: "Terms of Service & License",
            content: (
                <div className="modal-content-body">
                    <p>
                        Fidel Tools is completely open-source and free to use
                        under the MIT License.
                    </p>
                    <ul
                        style={{
                            marginTop: "1rem",
                            paddingLeft: "1.2rem",
                            lineHeight: "1.6",
                        }}
                    >
                        <li>
                            <strong>Permissive Usage:</strong> You are free to
                            modify, distribute, and build commercial products on
                            top of our code.
                        </li>
                        <li>
                            <strong>No Warranty:</strong> The software is
                            provided "as is", without warranty of any kind,
                            express or implied.
                        </li>
                        <li>
                            <strong>Contribution:</strong> Community
                            contributions, feedback, and pull requests are
                            highly welcome on our GitHub repository.
                        </li>
                    </ul>
                </div>
            ),
        });
    };

    const padZero = (num: number) => String(num).padStart(2, "0");

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

    if (currentPage === "preview") {
        return (
            <>
                <div className="bg-dots"></div>
                <div className="bg-smoke-1"></div>
                <div className="bg-smoke-2"></div>
                <div className="bg-smoke-3"></div>
                <PreviewPage onBackToHome={() => navigateTo("home")} />
            </>
        );
    }

    return (
        <>
            {/* Background halftone mesh and marble animated smoke blobs */}
            <div className="bg-dots"></div>
            <div className="bg-smoke-1"></div>
            <div className="bg-smoke-2"></div>
            <div className="bg-smoke-3"></div>

            <div className="dev-console">
                {/* ─── Top Bar (redesigned matching preview page) ─── */}
                <header className="dc-topbar">
                    <div className="dc-topbar-left">
                        <div className="dc-logo-container">
                            <span
                                className={`dc-logo ${isBursting ? "burst" : ""}`}
                                onClick={handleLogoClick}
                                style={{
                                    cursor: "pointer",
                                    userSelect: "none",
                                    textShadow:
                                        logoClicks > 0 && !isBursting
                                            ? `0 0 ${logoClicks * 6}px var(--brand-color)`
                                            : undefined,
                                    transform:
                                        logoClicks > 0 && !isBursting
                                            ? `scale(${1 + logoClicks * 0.05})`
                                            : undefined,
                                    transition:
                                        "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                }}
                            >
                                ፊደል
                            </span>
                            {isBursting && (
                                <span className="dc-logo-shockwave active"></span>
                            )}
                        </div>
                        <span className="dc-separator">/</span>
                        <span className="dc-title">NLP Tools Suite</span>
                        <span className="dc-version">v1.0.0</span>
                    </div>
                    <div className="dc-topbar-right">
                        <button
                            onClick={openAboutModal}
                            className="dc-back-btn"
                        >
                            About
                        </button>
                        <button
                            onClick={openTermsModal}
                            className="dc-back-btn"
                        >
                            Terms
                        </button>

                        <div
                            style={{
                                display: "flex",
                                gap: "0.5rem",
                                alignItems: "center",
                            }}
                        >
                            {/* GitHub Link Button */}
                            <a
                                href="https://github.com/Yehonatal/fidel-tools"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="icon-btn"
                                style={{
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "8px",
                                    padding: "5px 8px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                aria-label="GitHub Repository"
                            >
                                <Github size={16} />
                            </a>

                            {/* Theme Switcher Button */}
                            <button
                                onClick={toggleTheme}
                                className="icon-btn"
                                style={{
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "8px",
                                    padding: "5px 8px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                aria-label="Toggle light/dark theme"
                            >
                                {theme === "light" ? (
                                    <Moon size={16} />
                                ) : (
                                    <Sun size={16} />
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* ─── Main Body ─── */}
                <div className="dc-body hc-body">
                    {/* Left Panel: Hero & Subscriptions */}
                    <section className="dc-panel hc-hero-panel">
                        <div className="dc-panel-header">
                            <div className="dc-panel-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span className="dc-panel-title">
                                gateway.conf — Premium Launch Info
                            </span>
                        </div>
                        <div
                            className="hc-hero-content"
                            style={{ marginTop: "2rem" }}
                        >
                            {/* Pill Badge */}
                            <div
                                className="card-badge"
                                style={{ marginBottom: "1.5rem" }}
                            >
                                <Sparkles
                                    size={12}
                                    className="card-badge-icon"
                                />
                                <span>
                                    4+ Users Since Jan 2026 (don't worry we'll
                                    bring this up soon)
                                </span>
                            </div>

                            {/* Typography headings */}
                            <h1
                                className="card-title"
                                style={{
                                    fontSize: "2.2rem",
                                    fontWeight: "800",
                                    lineHeight: "1.2",
                                    margin: "0 0 1rem 0",
                                }}
                            >
                                Looking for{" "}
                                <em
                                    className="premium"
                                    style={{
                                        fontStyle: "normal",
                                        background:
                                            "linear-gradient(135deg, #3b82f6, #60a5fa)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    Premium
                                </em>{" "}
                                Ethiopic tools?
                            </h1>

                            <div
                                className="card-subtitle-italic"
                                style={{
                                    fontSize: "1.1rem",
                                    color: "var(--text-secondary)",
                                    marginBottom: "2rem",
                                }}
                            >
                                get ready to build and scale on{" "}
                                <span
                                    className="highlight"
                                    style={{
                                        color: "var(--accent-light-blue)",
                                        fontWeight: "600",
                                    }}
                                >
                                    fidel.tools
                                </span>
                            </div>

                            <p
                                className="card-description"
                                style={{
                                    fontSize: "0.95rem",
                                    color: "var(--text-tertiary)",
                                    lineHeight: "1.6",
                                    maxWidth: "520px",
                                    margin: "0 auto 2rem",
                                }}
                            >
                                Masterfully crafted packages for the modern
                                Ethiopic developer. Our premium developer
                                platform is launching soon.
                            </p>

                            {/* Live Countdown Timer */}
                            <div
                                className="countdown-container"
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    marginBottom: "2.5rem",
                                }}
                            >
                                <div className="countdown-box">
                                    <span className="countdown-number">
                                        {padZero(timeLeft.days)}
                                    </span>
                                    <span className="countdown-label">
                                        Days
                                    </span>
                                </div>
                                <div className="countdown-divider">:</div>
                                <div className="countdown-box">
                                    <span className="countdown-number">
                                        {padZero(timeLeft.hours)}
                                    </span>
                                    <span className="countdown-label">
                                        Hours
                                    </span>
                                </div>
                                <div className="countdown-divider">:</div>
                                <div className="countdown-box">
                                    <span className="countdown-number">
                                        {padZero(timeLeft.minutes)}
                                    </span>
                                    <span className="countdown-label">
                                        Minutes
                                    </span>
                                </div>
                                <div className="countdown-divider">:</div>
                                <div className="countdown-box">
                                    <span className="countdown-number">
                                        {padZero(timeLeft.seconds)}
                                    </span>
                                    <span className="countdown-label">
                                        Seconds
                                    </span>
                                </div>
                            </div>

                            {/* Email notification form */}
                            {!submitted ? (
                                <form
                                    className="notify-form"
                                    onSubmit={handleSubmit}
                                    style={{
                                        width: "100%",
                                        maxWidth: "480px",
                                        margin: "0 auto 2rem",
                                    }}
                                >
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="email-input"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="submit-btn"
                                    >
                                        Notify Me
                                    </button>
                                </form>
                            ) : (
                                <div
                                    className="success-message"
                                    style={{ margin: "0 auto 2rem" }}
                                >
                                    ✓ Thanks! We'll notify you as soon as we
                                    launch.
                                </div>
                            )}

                            {/* Inner Features Tag List */}
                            <div
                                className="card-features"
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "1rem",
                                }}
                            >
                                <div className="card-feature-item">
                                    <Sparkles size={12} />
                                    <span>Multilingual</span>
                                </div>
                                <div className="card-feature-item">
                                    <Sparkles size={12} />
                                    <span>Commercial</span>
                                </div>
                                <div className="card-feature-item">
                                    <Sparkles size={12} />
                                    <span>Support</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right Panel: Developer IDE Quickstart */}
                    <section
                        className="dc-panel hc-code-panel"
                        style={{ background: "#0d1117" }}
                    >
                        <div
                            className="dc-panel-header"
                            style={{
                                background: "#0d1117",
                                borderBottom:
                                    "1px solid rgba(255,255,255,0.04)",
                            }}
                        >
                            <div className="dc-panel-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="dc-code-title-row">
                                <Code2 size={12} />
                                <span className="dc-panel-title">
                                    quickstart.ts
                                </span>
                            </div>
                            <button
                                className="dc-copy-btn"
                                onClick={() =>
                                    copyCode(
                                        "npm install @fidel-tools/core @fidel-tools/lang-am",
                                    )
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

                        <div
                            className="hc-code-content"
                            style={{
                                padding: "1.5rem",
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: "1.5rem",
                                overflowY: "auto",
                            }}
                        >
                            <div>
                                <span
                                    style={{
                                        color: "#8b949e",
                                        display: "block",
                                        marginBottom: "0.5rem",
                                        fontFamily: "monospace",
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    # Install the packages
                                </span>
                                <div
                                    style={{
                                        background: "rgba(0,0,0,0.3)",
                                        padding: "0.75rem 1rem",
                                        borderRadius: "8px",
                                        border: "1px solid rgba(255,255,255,0.05)",
                                        fontFamily: "monospace",
                                        fontSize: "0.85rem",
                                        color: "#f0f6fc",
                                    }}
                                >
                                    <span style={{ color: "#ff7b72" }}>
                                        npm
                                    </span>{" "}
                                    i @fidel-tools/core @fidel-tools/lang-am
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <span
                                    style={{
                                        color: "#8b949e",
                                        display: "block",
                                        marginBottom: "0.5rem",
                                        fontFamily: "monospace",
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    # Initialize and Stem Amharic words
                                </span>
                                <pre
                                    style={{
                                        background: "rgba(0,0,0,0.3)",
                                        border: "1px solid rgba(255,255,255,0.05)",
                                        borderRadius: "8px",
                                        margin: 0,
                                        padding: "1rem",
                                        overflow: "auto",
                                    }}
                                >
                                    <code
                                        style={{
                                            fontSize: "0.8rem",
                                            color: "#c9d1d9",
                                            fontFamily:
                                                "JetBrains Mono, SF Mono, monospace",
                                            lineHeight: "1.6",
                                        }}
                                    >
                                        {`import { Pipeline } from '@fidel-tools/core';
import amPack from '@fidel-tools/lang-am';

// Initialize the NLP pipeline
const nlp = new Pipeline(amPack);

// Stem a word morphologically
const stem = nlp.stem("ልጆቻቸውን");
console.log(stem); // Output: "ልጅ"`}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer
                    className="page-footer"
                    style={{
                        marginTop: "1.5rem",
                        borderTop: "1px solid var(--border-color)",
                        paddingTop: "1.2rem",
                        textAlign: "center",
                        fontSize: "0.75rem",
                        color: "var(--text-tertiary)",
                    }}
                >
                    &copy; {new Date().getFullYear()} Fidel Tools. Open-source
                    under MIT.
                </footer>
            </div>

            {/* Modal View overlay */}
            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div
                        className="modal-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="modal-close-btn"
                            onClick={() => setModal(null)}
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>
                        <h2 className="modal-title">{modal.title}</h2>
                        {modal.content}
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
