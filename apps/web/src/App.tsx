import React, { useState, useEffect } from "react";
import { Sun, Moon, Github, Sparkles, X } from "lucide-react";

interface ModalData {
    title: string;
    content: React.ReactNode;
}

function App() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const saved = localStorage.getItem("fidel-theme");
        return (saved as "light" | "dark") || "light";
    });

    const [modal, setModal] = useState<ModalData | null>(null);

    // Toggle theme
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
            setSubmitted(true);
            setEmail("");
        }
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

    return (
        <>
            {/* Background halftone mesh and marble animated smoke blobs */}
            <div className="bg-dots"></div>
            <div className="bg-smoke-1"></div>
            <div className="bg-smoke-2"></div>
            <div className="bg-smoke-3"></div>

            <div className="page-wrapper">
                {/* Floating Top Navigation Header */}
                <header className="nav-header">
                    <div className="nav-brand">
                        <span className="nav-title">ፊደል</span>
                        <div className="badge-group">
                            <span className="badge-pill free">Free</span>
                            <span className="badge-pill premium">Premium</span>
                        </div>
                    </div>

                    <div className="nav-menu">
                        <button
                            onClick={openAboutModal}
                            className="nav-link-btn"
                        >
                            About
                        </button>
                        <button
                            onClick={openTermsModal}
                            className="nav-link-btn"
                        >
                            Terms
                        </button>

                        <div className="nav-actions">
                            {/* GitHub Link Button */}
                            <a
                                href="https://github.com/Yehonatal/fidel-tools"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="icon-btn"
                                aria-label="GitHub Repository"
                            >
                                <Github size={16} />
                            </a>

                            {/* Theme Switcher Button */}
                            <button
                                onClick={toggleTheme}
                                className="icon-btn"
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

                {/* Central Card */}
                <main className="main-content">
                    <section className="coming-soon-card">
                        {/* Pill Badge */}
                        <div className="card-badge">
                            <Sparkles size={12} className="card-badge-icon" />
                            <span>
                                0+ Users Since Jan 2026 (don't worry we'll bring
                                this up soon)
                            </span>
                        </div>

                        {/* Typography headings */}
                        <h1 className="card-title">
                            Looking for <em className="premium">Premium</em>{" "}
                            Ethiopic tools?
                        </h1>

                        <div className="card-subtitle-italic">
                            get ready to build and scale on{" "}
                            <span className="highlight">fidel.tools</span>
                        </div>

                        <p className="card-description">
                            Masterfully crafted packages for the modern Ethiopic
                            developer. Our premium developer platform is
                            launching soon.
                        </p>

                        {/* Live Countdown Timer */}
                        <div className="countdown-container">
                            <div className="countdown-box">
                                <span className="countdown-number">
                                    {padZero(timeLeft.days)}
                                </span>
                                <span className="countdown-label">Days</span>
                            </div>
                            <div className="countdown-divider">:</div>
                            <div className="countdown-box">
                                <span className="countdown-number">
                                    {padZero(timeLeft.hours)}
                                </span>
                                <span className="countdown-label">Hours</span>
                            </div>
                            <div className="countdown-divider">:</div>
                            <div className="countdown-box">
                                <span className="countdown-number">
                                    {padZero(timeLeft.minutes)}
                                </span>
                                <span className="countdown-label">Minutes</span>
                            </div>
                            <div className="countdown-divider">:</div>
                            <div className="countdown-box">
                                <span className="countdown-number">
                                    {padZero(timeLeft.seconds)}
                                </span>
                                <span className="countdown-label">Seconds</span>
                            </div>
                        </div>

                        {/* Email notification form */}
                        {!submitted ? (
                            <form
                                className="notify-form"
                                onSubmit={handleSubmit}
                            >
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="email-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className="submit-btn">
                                    Notify Me
                                </button>
                            </form>
                        ) : (
                            <div className="success-message">
                                ✓ Thanks! We'll notify you as soon as we launch.
                            </div>
                        )}

                        {/* Inner Features Tag List */}
                        <div className="card-features">
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
                    </section>
                </main>

                {/* Footer */}
                <footer className="page-footer">
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
