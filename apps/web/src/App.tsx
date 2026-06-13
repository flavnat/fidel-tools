import React, { useState, useEffect } from "react";
import {
    Sun,
    Moon,
    Github,
    Play,
    X,
    Code2,
    Copy,
    Check,
    BookOpen,
} from "lucide-react";
import PreviewPage from "./PreviewPage.tsx";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster, toast } from "sonner";

const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";

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
    const [currentPage, setCurrentPage] = useState<"home" | "preview" | "docs">(() => {
        if (window.location.pathname === "/preview") return "preview";
        if (window.location.pathname === "/docs") return "docs";
        return "home";
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
        // Initialize AOS
        if (!loading) {
            AOS.init({
                duration: 800,
                easing: "ease-out-cubic",
                once: true,
            });
        }
    }, [loading, currentPage]);

    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;
            if (path === "/preview") setCurrentPage("preview");
            else if (path === "/docs") setCurrentPage("docs");
            else setCurrentPage("home");
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const navigateTo = (page: "home" | "preview" | "docs") => {
        setCurrentPage(page);
        let path = "/";
        if (page === "preview") path = "/preview";
        if (page === "docs") path = "/docs";
        window.history.pushState(null, "", path);
    };

    const handleLogoClick = () => {
        if (isBursting) return;
        setLogoClicks((prev) => {
            const next = prev + 1;
            if (next >= 7) {
                setIsBursting(true);
                toast.success("Easter Egg Activated! 🥚", {
                    description: "You are now officially a Certified Ethiopic NLP Scholar! 📜",
                    duration: 5000,
                });
                setTimeout(() => {
                    setIsBursting(false);
                    setLogoClicks(0);
                }, 1000);
                return 7;
            }
            return next;
        });
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    // Update theme class on body & document element for Tailwind v4
    useEffect(() => {
        localStorage.setItem("fidel-theme", theme);
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
            document.body.classList.add("dark");
            document.body.style.backgroundColor = "#050507";
            document.body.style.color = "#e8eaed";
        } else {
            root.classList.remove("dark");
            document.body.classList.remove("dark");
            document.body.style.backgroundColor = "#f8fafc";
            document.body.style.color = "#0f172a";
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
            setSubmitted(true);
            setEmail("");

            toast.success("Subscribed successfully!", {
                description: "We will notify you at " + emailToSubmit + " once we launch.",
            });

            // Fire request in background without holding up the user interface
            const apiUrl =
                (import.meta as any).env?.VITE_API_URL ||
                "http://localhost:3000";
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
        toast.success("Command copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const openAboutModal = () => {
        setModal({
            title: "About ፊደል (Fidel)",
            content: (
                <div className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed space-y-4">
                    <p>
                        We are passionate developers trying to solve our own
                        problem and help in the process.
                    </p>
                    <p>
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
                <div className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed space-y-4">
                    <p>
                        Fidel Tools is completely open-source and free to use
                        under the MIT License.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
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
            <div className="fixed inset-0 bg-slate-50 dark:bg-[#050507] flex justify-center items-center z-[9999] transition-colors duration-500">
                <div className="flex flex-col items-center">
                    <div className="relative font-loga text-7xl md:text-8xl font-light tracking-tight select-none">
                        <span className="text-slate-900/10 dark:text-white/10">ፊደል</span>
                        <span className="absolute left-0 top-0 bg-gradient-to-b from-sky-400 to-blue-500 bg-clip-text text-transparent animate-water-fill">
                            ፊደል
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" theme={theme} richColors />
            {/* Background elements wrapped to prevent scrolling */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="bg-dots absolute inset-0 text-slate-955/[0.045] dark:text-white/[0.015] transition-colors duration-500"></div>
                <div className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] bg-[radial-gradient(circle,rgba(148,163,184,0.18)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_70%)] blur-[80px] animate-drift-1 transition-all duration-500"></div>
                <div className="absolute -bottom-[15%] -right-[10%] w-[75vw] h-[75vw] bg-[radial-gradient(circle,rgba(203,213,225,0.22)_0%,transparent_75%)] dark:bg-[radial-gradient(circle,rgba(14,165,233,0.06)_0%,transparent_75%)] blur-[100px] animate-drift-2 transition-all duration-500"></div>
                <div className="absolute top-[35%] left-[20%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(186,230,253,0.12)_0%,transparent_80%)] dark:bg-[radial-gradient(circle,rgba(99,102,241,0.03)_0%,transparent_80%)] blur-[90px] animate-drift-3 transition-all duration-500"></div>
            </div>

            {currentPage === "preview" ? (
                <PreviewPage 
                    onBackToHome={() => navigateTo("home")} 
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            ) : currentPage === "docs" ? (
                <div className="w-full min-h-screen flex flex-col relative z-10">
                    <div className="flex justify-between items-center p-4 bg-white/65 dark:bg-[#0c0c0e]/75 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <img src="/Fidel.png" alt="Fidel Logo" className="h-6 w-auto" />
                            <span className="text-slate-900 dark:text-white font-bold font-loga text-sm tracking-wide">ፊደል Tools API Reference</span>
                        </div>
                        <button
                            onClick={() => navigateTo("home")}
                            className="bg-transparent border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200"
                        >
                            Back to Home
                        </button>
                    </div>
                    <iframe 
                        src={`${API_URL}/docs?theme=${theme}`} 
                        className="w-full flex-grow h-[calc(100vh-60px)] border-none bg-transparent"
                        allowTransparency={true}
                        title="ፊደል Tools API Documentation"
                    />
                </div>
            ) : (
                <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col gap-4 relative z-10 font-jakarta">
                    {/* ─── Top Bar (Mobile First Stacking) ─── */}
                    <header 
                        className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3.5 px-5 bg-white/65 dark:bg-[#0c0c0e]/75 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-2xl transition-all duration-300"
                        data-aos="fade-down"
                    >
                        <div className="flex items-center justify-between w-full sm:w-auto">
                            <div className="flex items-center gap-2.5">
                                <div className="relative inline-flex items-center">
                                    <span
                                        className={`font-loga text-2xl font-light text-blue-900 dark:text-sky-400 select-none hover:opacity-85 cursor-pointer transition-all duration-300 ${isBursting ? "animate-logo-burst" : ""}`}
                                        onClick={handleLogoClick}
                                        style={{
                                            textShadow:
                                                logoClicks > 0 && !isBursting
                                                    ? `0 0 ${logoClicks * 6}px ${theme === "light" ? "#1e3a8a" : "#38bdf8"}`
                                                    : undefined,
                                            transform:
                                                logoClicks > 0 && !isBursting
                                                    ? `scale(${1 + logoClicks * 0.05})`
                                                    : undefined,
                                        }}
                                    >
                                        ፊደል
                                    </span>
                                    {isBursting && (
                                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.6)_0%,rgba(56,189,248,0)_70%)] pointer-events-none animate-shockwave z-1"></span>
                                    )}
                                </div>
                                <span className="text-slate-400 dark:text-zinc-600 font-light opacity-45 hidden min-[400px]:inline">/</span>
                                <span className="text-xs md:text-sm font-semibold tracking-tight text-slate-800 dark:text-zinc-300 hidden min-[400px]:inline">NLP Tools Suite</span>
                                <span className="font-mono text-[9px] bg-slate-200/50 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 px-2 py-0.5 rounded">v1.0.0</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto border-t sm:border-t-0 border-slate-200/40 dark:border-zinc-800/40 pt-2 sm:pt-0">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={openAboutModal}
                                    className="bg-transparent border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200"
                                >
                                    About
                                </button>
                                <button
                                    onClick={openTermsModal}
                                    className="bg-transparent border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200"
                                >
                                    Terms
                                </button>
                                <button
                                    onClick={() => navigateTo("docs")}
                                    className="bg-transparent border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200 inline-flex items-center gap-1"
                                >
                                    <BookOpen size={12} />
                                    Docs
                                </button>
                            </div>

                            <div className="flex gap-2 items-center border-l border-slate-200 dark:border-zinc-800 pl-3">
                                <a
                                    href="https://github.com/Yehonatal/fidel-tools"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800/40 text-slate-500 dark:text-zinc-400 hover:text-slate-955 dark:hover:text-zinc-100 transition-all duration-200"
                                    aria-label="GitHub Repository"
                                >
                                    <Github size={16} />
                                </a>

                                <button
                                    onClick={toggleTheme}
                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800/40 text-slate-500 dark:text-zinc-400 hover:text-slate-955 dark:hover:text-zinc-100 cursor-pointer transition-all duration-200"
                                    aria-label="Toggle light/dark theme"
                                >
                                    {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* ─── Main Body ─── */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4 items-start">
                        {/* Left Panel: Hero & Subscriptions */}
                        <section 
                            className="flex flex-col justify-between p-5 md:p-10 bg-white/65 dark:bg-[#0c0c0e]/75 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-2xl transition-all duration-300"
                            data-aos="fade-right"
                        >
                            <div>
                                <div className="flex gap-1.5 mb-6 opacity-60">
                                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                </div>

                                <div className="inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-6">
                                    <Code2 size={11} className="text-sky-600 dark:text-sky-400" />
                                    <span>4+ Active Developers Since Jan 2026</span>
                                </div>

                                <h1 className="text-2xl min-[400px]:text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.15] mb-4 select-none text-slate-900 dark:text-zinc-50">
                                    Looking for{" "}
                                    <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-500 bg-clip-text text-transparent">
                                        Premium
                                    </span>{" "}
                                    Ethiopic Tools?
                                </h1>

                                <div className="text-sm md:text-lg text-slate-600 dark:text-zinc-400 font-medium italic mb-6">
                                    Get ready to build and scale on{" "}
                                    <span className="text-sky-600 dark:text-sky-400 font-semibold not-italic">
                                        fidel.tools
                                    </span>
                                </div>

                                <p className="text-slate-500 dark:text-zinc-500 text-xs md:text-base leading-relaxed max-w-xl mb-8">
                                    Masterfully crafted packages for the modern Ethiopic developer. Our premium developer platform is launching soon. Subscribe below to stay informed.
                                </p>

                                {/* Live Countdown Timer */}
                                <div className="flex items-center gap-2 md:gap-3 mb-8 flex-wrap">
                                    <div className="flex flex-col items-center justify-center bg-slate-100/50 dark:bg-zinc-900/50 border border-slate-200/50 dark:border-zinc-800/40 rounded-xl w-14 h-14 min-[380px]:w-16 min-[380px]:h-16 md:w-20 md:h-20 shadow-none">
                                        <span className="text-sm md:text-2xl font-bold text-slate-900 dark:text-zinc-100">
                                            {padZero(timeLeft.days)}
                                        </span>
                                        <span className="text-[8px] md:text-[9px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mt-1">
                                            Days
                                        </span>
                                    </div>
                                    <div className="text-lg font-medium text-slate-400 dark:text-zinc-600 flex items-center h-14 min-[380px]:h-16 md:h-20">:</div>
                                    <div className="flex flex-col items-center justify-center bg-slate-100/50 dark:bg-zinc-900/50 border border-slate-200/50 dark:border-zinc-800/40 rounded-xl w-14 h-14 min-[380px]:w-16 min-[380px]:h-16 md:w-20 md:h-20 shadow-none">
                                        <span className="text-sm md:text-2xl font-bold text-slate-900 dark:text-zinc-100">
                                            {padZero(timeLeft.hours)}
                                        </span>
                                        <span className="text-[8px] md:text-[9px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mt-1">
                                            Hours
                                        </span>
                                    </div>
                                    <div className="text-lg font-medium text-slate-400 dark:text-zinc-600 flex items-center h-14 min-[380px]:h-16 md:h-20">:</div>
                                    <div className="flex flex-col items-center justify-center bg-slate-100/50 dark:bg-zinc-900/50 border border-slate-200/50 dark:border-zinc-800/40 rounded-xl w-14 h-14 min-[380px]:w-16 min-[380px]:h-16 md:w-20 md:h-20 shadow-none">
                                        <span className="text-sm md:text-2xl font-bold text-slate-900 dark:text-zinc-100">
                                            {padZero(timeLeft.minutes)}
                                        </span>
                                        <span className="text-[8px] md:text-[9px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mt-1">
                                            Mins
                                        </span>
                                    </div>
                                    <div className="text-lg font-medium text-slate-400 dark:text-zinc-600 flex items-center h-14 min-[380px]:h-16 md:h-20">:</div>
                                    <div className="flex flex-col items-center justify-center bg-slate-100/50 dark:bg-zinc-900/50 border border-slate-200/50 dark:border-zinc-800/40 rounded-xl w-14 h-14 min-[380px]:w-16 min-[380px]:h-16 md:w-20 md:h-20 shadow-none">
                                        <span className="text-sm md:text-2xl font-bold text-slate-900 dark:text-zinc-100">
                                            {padZero(timeLeft.seconds)}
                                        </span>
                                        <span className="text-[8px] md:text-[9px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mt-1">
                                            Secs
                                        </span>
                                    </div>
                                </div>

                                {/* Email notification form */}
                                {!submitted ? (
                                    <form
                                        className="flex items-center w-full max-w-md bg-slate-100/80 dark:bg-zinc-955/80 border border-slate-200 dark:border-zinc-800 focus-within:border-sky-500 dark:focus-within:border-sky-500 shadow-none p-1 rounded-xl gap-2 focus-within:shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300"
                                        onSubmit={handleSubmit}
                                    >
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-xs md:text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 min-w-0"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="bg-sky-600 dark:bg-sky-500 text-white font-semibold text-xs md:text-sm px-3.5 py-2 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 cursor-pointer shadow-none active:scale-95 transition-all duration-200 shrink-0"
                                        >
                                            Notify Me
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-green-700 dark:text-green-400 text-xs md:text-sm font-semibold bg-green-500/10 border border-green-500/20 px-4 py-2.5 rounded-xl inline-block">
                                        ✓ Thanks! We'll notify you as soon as we launch.
                                    </div>
                                )}

                                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => navigateTo("preview")}
                                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs md:text-sm px-5 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.15)] cursor-pointer active:scale-95 transition-all duration-200 w-full sm:w-auto"
                                    >
                                        <Play size={12} className="text-white fill-white" />
                                        Try the Interactive Demo
                                    </button>
                                    <button
                                        onClick={() => navigateTo("docs")}
                                        className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-semibold text-xs md:text-sm px-5 py-2.5 rounded-xl border border-slate-200/50 dark:border-zinc-700/50 cursor-pointer active:scale-95 transition-all duration-200 w-full sm:w-auto"
                                    >
                                        <BookOpen size={12} />
                                        View API Docs
                                    </button>
                                </div>
                            </div>

                            {/* Inner Features Tag List */}
                            <div className="flex flex-wrap gap-4 border-t border-slate-200/50 dark:border-zinc-800/50 pt-5 mt-5 w-full">
                                <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold tracking-wider text-slate-500 dark:text-zinc-500 uppercase">
                                    <Check size={11} className="text-sky-500" />
                                    <span>Multilingual Support</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold tracking-wider text-slate-500 dark:text-zinc-500 uppercase">
                                    <Check size={11} className="text-sky-500" />
                                    <span>Commercial Grade</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold tracking-wider text-slate-500 dark:text-zinc-500 uppercase">
                                    <Check size={11} className="text-sky-500" />
                                    <span>Dedicated SLA</span>
                                </div>
                            </div>
                        </section>

                        {/* Right Panel: Developer IDE Quickstart */}
                        <section 
                            className="flex flex-col bg-[#0d1117] border border-white/5 shadow-none rounded-2xl overflow-hidden"
                            data-aos="fade-left"
                        >
                            <div className="flex items-center justify-between p-3 px-4 border-b border-white/5 bg-slate-900/40">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-red-400/80"></span>
                                    <span className="w-2 h-2 rounded-full bg-yellow-400/80"></span>
                                    <span className="w-2 h-2 rounded-full bg-green-400/80"></span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Code2 size={12} className="text-zinc-500" />
                                    <span className="text-[10px] font-mono text-zinc-500">quickstart.ts</span>
                                </div>
                                <button
                                    className="flex items-center gap-1.5 bg-transparent border border-white/10 hover:border-white/20 text-zinc-400 hover:text-zinc-200 text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-all duration-200"
                                    onClick={() =>
                                        copyCode(
                                            "npm install @fidel-tools/core @fidel-tools/lang-am",
                                        )
                                    }
                                >
                                    {copied ? (
                                        <Check size={11} className="text-green-400" />
                                    ) : (
                                        <Copy size={11} />
                                    )}
                                    <span>{copied ? "Copied!" : "Copy"}</span>
                                </button>
                            </div>

                            <div className="p-4 md:p-5 flex-1 flex flex-col gap-5">
                                <div>
                                    <span className="font-mono text-xs text-zinc-500 block mb-2">
                                        # Install the packages
                                    </span>
                                    <div className="bg-black/35 p-3 rounded-lg border border-white/5 font-mono text-sm text-zinc-100 flex items-center justify-between overflow-x-auto">
                                        <span className="whitespace-nowrap pr-2">
                                            <span className="text-red-400">npm</span> i @fidel-tools/core @fidel-tools/lang-am
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col min-h-0">
                                    <span className="font-mono text-xs text-zinc-500 block mb-2">
                                        # Initialize and Stem Amharic words
                                    </span>
                                    <pre className="bg-black/35 border border-white/5 rounded-lg p-4 overflow-auto flex-1 font-mono text-xs md:text-sm text-zinc-300 leading-relaxed max-h-[260px] md:max-h-none">
                                        <code>
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
                    <footer className="w-full text-center border-t border-slate-200/50 dark:border-zinc-800/40 py-6 text-xs text-slate-500 dark:text-zinc-500 font-medium select-none">
                        &copy; {new Date().getFullYear()} Fidel Tools. Open-source under MIT.
                    </footer>
                </div>
            )}

            {/* Modal View overlay */}
            {modal && (
                <div 
                    className="fixed inset-0 bg-slate-900/30 dark:bg-black/60 backdrop-blur-md flex justify-center items-center z-[1000] p-4 transition-all duration-300"
                    onClick={() => setModal(null)}
                >
                    <div
                        className="bg-white dark:bg-[#0c0c0e]/95 border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 w-full max-w-[500px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative text-left transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                        data-aos="zoom-in"
                        data-aos-duration="250"
                    >
                        <button
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-all duration-200"
                            onClick={() => setModal(null)}
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-4 tracking-tight">
                            {modal.title}
                        </h2>
                        {modal.content}
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
