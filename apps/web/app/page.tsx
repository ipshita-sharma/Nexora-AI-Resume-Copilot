"use client";
import type { Route } from "next";
import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  Target,
  MessageSquare,
  Map,
  ArrowUpRight,
  Play,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Zap,
} from "lucide-react";

/* ─────────────────────────────────────────────
   DESIGN TOKENS  (matches your dashboard exactly)
───────────────────────────────────────────── */
const T = {
  bg:        "#0d1117",
  bgCard:    "#161b22",
  bgCardHov: "#1c2128",
  border:    "#21262d",
  borderHov: "#30363d",
  teal:      "#00e5c0",
  tealDim:   "rgba(0,229,192,0.12)",
  tealDimHov:"rgba(0,229,192,0.18)",
  tealBorder:"rgba(0,229,192,0.25)",
  textPri:   "#ffffff",
  textSec:   "#8b949e",
  textTer:   "#484f58",
};

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const METRICS = [
  {
    label: "Resume Analysis",
    value: "Ready",
    delta: "ATS 86",
    pct: 86,
    color: T.teal,
  },
  {
    label: "Skill Gaps",
    value: "2",
    delta: "Detected",
    pct: 65,
    color: "#f0a500",
  },
  {
    label: "Interview Prep",
    value: "Strong",
    delta: "88%",
    pct: 88,
    color: "#a371f7",
  },
  {
    label: "Roadmap",
    value: "Week 4",
    delta: "Active",
    pct: 42,
    color: T.teal,
  },
];

const FEATURES = [
  {
    icon: FileText,
    title: "AI Resume Optimizer",
    desc: "Transform resumes into ATS-friendly, recruiter-ready profiles that land in the right hands.",
    color: T.teal,
  },
  {
    icon: Target,
    title: "JD Match Analyzer",
    desc: "Identify missing skills and optimize every application for the specific role and company.",
    color: "#f0a500",
  },
  {
    icon: MessageSquare,
    title: "AI Interview Coach",
    desc: "Practice technical and behavioral interviews with real-time feedback and structured rubrics.",
    color: "#a371f7",
  },
  {
    icon: Map,
    title: "Personalized Roadmaps",
    desc: "Convert skill gaps into structured weekly execution plans until the offer arrives.",
    color: T.teal,
  },
];

const PILLS = ["Resume Optimizer", "JD Matching", "Mock Interviews", "Skill Roadmaps"];

const SOCIAL_PROOF = [
  { icon: Zap,         text: "ATS-optimized in seconds" },
  { icon: TrendingUp,  text: "Track every career metric" },
  { icon: CheckCircle, text: "Interview-ready in days" },
];

/* ─────────────────────────────────────────────
   ANIMATED BAR
───────────────────────────────────────────── */
function AnimatedBar({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { el.style.width = `${pct}%`; return; }
    el.style.width = "0%";
    const t = setTimeout(() => {
      el.style.transition = "width 1.2s cubic-bezier(0.16,1,0.3,1)";
      el.style.width = `${pct}%`;
    }, delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <div ref={ref} style={{ height: "100%", borderRadius: 2, background: color }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function NexoraHomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: ${T.bg};
          color: ${T.textPri};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* NAV */
        .nx-nav {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;

  width: min(1200px, calc(100% - 32px));
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 24px;

  background: rgba(22, 27, 34, 0.55);

  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);

  border: 1px solid rgba(255,255,255,0.08);

  border-radius: 18px;

  box-shadow:
    0 8px 32px rgba(0,0,0,0.35),
    inset 0 1px 0 rgba(255,255,255,0.04);
}
        .nx-nav-logo {
          display: flex; align-items: center; gap: 10px;
          font-size: 15px; font-weight: 600; color: ${T.textPri};
          text-decoration: none; letter-spacing: -0.02em;
        }
        .nx-nav-logo-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;

  background: linear-gradient(
    135deg,
    rgba(0,229,192,0.25),
    rgba(0,229,192,0.08)
  );

  border: 1px solid rgba(0,229,192,0.3);

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all .25s ease;
}

.nx-nav-logo-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(0,229,192,.35);
}
        .nx-nav-links {
          display: flex; gap: 4px; list-style: none;
        }
        .nx-nav-links a {
          font-size: 13px; font-weight: 400; color: ${T.textSec};
          text-decoration: none; padding: 6px 12px; border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }
        .nx-nav-links a:hover {
  color: ${T.textPri};
  background: rgba(255,255,255,0.05);

  backdrop-filter: blur(10px);

  transform: translateY(-1px);
}
        .nx-nav-right { display: flex; gap: 8px; align-items: center; }

        /* BUTTONS */
        .nx-btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          background: ${T.teal}; color: #0d1117;
          font-size: 13px; font-weight: 600; letter-spacing: -0.01em;
          padding: 8px 18px; border-radius: 8px; border: none;
          cursor: pointer; font-family: inherit; text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
        }
        .nx-btn-primary:hover {
          background: #00f5cf;
          box-shadow: 0 0 20px rgba(0,229,192,0.35);
          transform: translateY(-1px);
        }
        .nx-btn-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: ${T.textSec};
          font-size: 13px; font-weight: 400;
          padding: 8px 18px; border-radius: 8px;
          border: 1px solid ${T.border};
          cursor: pointer; font-family: inherit; text-decoration: none;
          white-space: nowrap;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
        }
        .nx-btn-ghost:hover { color: ${T.textPri}; border-color: ${T.borderHov}; background: rgba(255,255,255,0.04); }

        /* HERO BUTTONS (larger) */
        .nx-btn-hero-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: ${T.teal}; color: #0d1117;
          font-size: 15px; font-weight: 600; letter-spacing: -0.01em;
          padding: 12px 28px; border-radius: 10px; border: none;
          cursor: pointer; font-family: inherit; text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s, box-shadow 0.2s, transform 0.15s;
        }
        .nx-btn-hero-primary:hover {
          background: #00f5cf;
          box-shadow: 0 0 32px rgba(0,229,192,0.4);
          transform: translateY(-1px);
        }
        .nx-btn-hero-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: ${T.bgCard}; color: ${T.textSec};
          font-size: 15px; font-weight: 400;
          padding: 12px 28px; border-radius: 10px;
          border: 1px solid ${T.border};
          cursor: pointer; font-family: inherit; text-decoration: none;
          white-space: nowrap;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
        }
        .nx-btn-hero-ghost:hover { color: ${T.textPri}; border-color: ${T.borderHov}; background: ${T.bgCardHov}; }

        /* CARD — matches dashboard exactly */
        .nx-card {
        position: relative;
overflow: hidden;
  background: rgba(22,27,34,0.72);

  border: 1px solid rgba(255,255,255,0.08);

  border-radius: 20px;

  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);

  transition:
    transform 0.35s cubic-bezier(0.16,1,0.3,1),
    box-shadow 0.35s ease,
    border-color 0.35s ease,
    background 0.35s ease;
    cursor: default;
    
}
        .nx-card:hover {
  transform:
    translateY(-12px)
    scale(1.015);

  border-color: rgba(0,229,192,0.30);

  background: rgba(22,27,34,0.88);

  box-shadow:
    0 30px 80px rgba(0,0,0,0.55),
    0 0 50px rgba(0,229,192,0.12);
}

.nx-card::before {
  content: "";

  position: absolute;

  inset: 0;

  background:
    radial-gradient(
      circle at top,
      rgba(0,229,192,0.10),
      transparent 60%
    );

  opacity: 0;

  transition: opacity 0.35s ease;

  pointer-events: none;
}
.nx-card:hover::before {
  opacity: 1;
}

.nx-card-border {
  position: absolute;

  inset: -1px;

  border-radius: 24px;

  background: linear-gradient(
    135deg,
    rgba(0,229,192,0.55),
    rgba(0,229,192,0.05),
    rgba(0,229,192,0.55)
  );

  opacity: 0;

  transition: opacity 0.3s ease;

  pointer-events: none;
}

.nx-card:hover .nx-card-border {
  opacity: 1;
}
        /* BADGE (teal pill like dashboard) */
        .nx-badge-teal {
          display: inline-flex; align-items: center; gap: 6px;
          background: ${T.tealDim}; color: ${T.teal};
          font-size: 12px; font-weight: 500; letter-spacing: 0.01em;
          padding: 5px 12px; border-radius: 100px;
          border: 1px solid ${T.tealBorder};
        }
        .nx-badge-teal .dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: ${T.teal};
          box-shadow: 0 0 6px ${T.teal};
          animation: nx-pulse 2.5s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* STAT CARD (like dashboard metric cards) */
        .nx-stat-card {
          background: ${T.bgCard};
          border: 1px solid ${T.border};
          border-radius: 12px;
          padding: 20px 24px 24px;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }
        .nx-stat-card:hover {
  border-color: rgba(0,229,192,0.25);

  background: rgba(22,27,34,0.95);

  transform: translateY(-4px);

  box-shadow:
    0 12px 30px rgba(0,0,0,0.35),
    0 0 20px rgba(0,229,192,0.08);
}
        .nx-stat-label {
          font-size: 13px; font-weight: 400; color: ${T.textSec};
          margin-bottom: 8px; letter-spacing: -0.01em;
        }
        .nx-stat-delta {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 600;
          padding: 3px 8px; border-radius: 6px;
          margin-bottom: 10px;
        }
        .nx-stat-value {
          font-size: 42px; font-weight: 700; letter-spacing: -0.03em;
          color: ${T.textPri}; line-height: 1;
        }

        /* FEATURE CARD */
        .nx-feat-card {
        position: relative;
overflow: hidden;
          background: ${T.bgCard};
          border: 1px solid ${T.border};
          border-radius: 12px;
          padding: 24px;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          cursor: default;
        }
        .nx-feat-card:hover {
  transform: translateY(-8px);

  border-color: rgba(0,229,192,0.25);

  background: rgba(22,27,34,0.95);

  box-shadow:
    0 20px 50px rgba(0,0,0,0.45),
    0 0 30px rgba(0,229,192,0.08);
}

.nx-feat-card::before {
  content: "";

  position: absolute;
  inset: 0;

  background:
    radial-gradient(
      circle at top,
      rgba(0,229,192,0.08),
      transparent 60%
    );

  opacity: 0;

  transition: opacity .35s ease;

  pointer-events: none;
}

.nx-feat-card:hover::before {
  opacity: 1;
}

.nx-feature-icon {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.nx-feat-card:hover .nx-feature-icon {
  transform: scale(1.15);

  box-shadow:
    0 0 25px rgba(0,229,192,0.20);
}
.nx-how-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
        /* METRIC ROW */
        .nx-metric-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 0;
          border-top: 1px solid ${T.border};
        }
        .nx-metric-icon {
          width: 28px; height: 28px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* ANIMATIONS */
        @keyframes nx-pulse {
          0%,100% { opacity: 0.7; box-shadow: 0 0 4px ${T.teal}; }
          50%      { opacity: 1;   box-shadow: 0 0 12px ${T.teal}; }
        }
        @keyframes nx-orb1 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(40px,-30px) scale(1.1); }
        }
        @keyframes nx-orb2 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(-30px,40px) scale(1.08); }
        }
          @keyframes auroraFloat {
  0% {
    transform: translateX(-50%) translateY(0px);
  }

  50% {
    transform: translateX(-50%) translateY(40px);
  }

  100% {
    transform: translateX(-50%) translateY(0px);
  }
}
  @keyframes nx-gradient-shift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.nx-gradient-text {
  animation: nx-gradient-shift 6s ease infinite;
}
        @keyframes nx-fadein {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nx-fadein { animation: nx-fadein 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .nx-fadein-1 { animation-delay: 0.1s; }
        .nx-fadein-2 { animation-delay: 0.2s; }
        .nx-fadein-3 { animation-delay: 0.3s; }
        .nx-fadein-4 { animation-delay: 0.4s; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
        }

        /* RESPONSIVE */
        @media (max-width: 960px) {
          .nx-hero-grid { grid-template-columns: 1fr !important; padding: 80px 20px 48px !important; }
          .nx-feat-grid { grid-template-columns: 1fr 1fr !important; }
          .nx-stat-grid { grid-template-columns: 1fr 1fr !important; }
          .nx-how-grid {grid-template-columns: 1fr 1fr !important;}
        }
        @media (max-width: 560px) {
          .nx-feat-grid { grid-template-columns: 1fr !important; }
          .nx-stat-grid { grid-template-columns: 1fr !important; }
          .nx-nav-links { display: none !important; }
          .nx-how-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav className="nx-nav">
        <Link href={"/" as Route} className="nx-nav-logo">
          <div className="nx-nav-logo-icon">
            <Sparkles size={16} color={T.teal} />
          </div>
          Nexora AI
        </Link>
        <ul className="nx-nav-links">
          {["Features", "How It Works"].map((l) => (
  <li key={l}>
    <a href={`#${l.toLowerCase().replace(/\s/g, "-")}`}>
      {l}
    </a>
  </li>
))}
        </ul>
        <div className="nx-nav-right">
          <Link href={"/dashboard" as Route} className="nx-btn-ghost">Sign in</Link>
          <Link href={"/dashboard" as Route} className="nx-btn-primary">
            Get started <ArrowUpRight size={13} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <main style={{ background: T.bg, minHeight: "100vh", paddingTop: 100 }}>
        <section
  style={{
    position: "relative",
    overflow: "hidden",
  }}
>
<div
  style={{
    position: "absolute",
    top: -250,
    left: "50%",
    transform: "translateX(-50%)",
    width: 1400,
    height: 700,
    borderRadius: "50%",
    background: `
      radial-gradient(circle,
      rgba(0,229,192,0.15) 0%,
      transparent 60%)
    `,
    filter: "blur(120px)",
    pointerEvents: "none",
    zIndex: 0,
    animation: "auroraFloat 10s ease-in-out infinite",
  }}
/>
          {/* ambient glow — same teal as dashboard accent */}
          <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
            <div style={{
              position: "absolute", width: 600, height: 600, borderRadius: "50%",
              background: `radial-gradient(circle, ${T.teal}12 0%, transparent 70%)`,
              filter: "blur(80px)", top: -100, left: -100,
              animation: "nx-orb1 14s ease-in-out infinite alternate",
            }} />
            <div style={{
              position: "absolute", width: 500, height: 500, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(163,113,247,0.08) 0%, transparent 70%)",
              filter: "blur(80px)", top: 80, right: -80,
              animation: "nx-orb2 18s ease-in-out infinite alternate",
            }} />
          </div>

          <div
            className="nx-hero-grid"
            style={{
              position: "relative", zIndex: 10,
              maxWidth: 1280, margin: "0 auto",
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 56, padding: "80px 40px 72px",
              alignItems: "center",
            }}
          >
            {/* ── LEFT ───────────────────────────────────────────────────── */}
            <div className="nx-fadein nx-fadein-1">

              {/* badge — exact style from dashboard chips */}
              <div className="nx-badge-teal" style={{ marginBottom: 28 }}>
                <span className="dot" />
                Built for students, interns &amp; early-career professionals
              </div>

              {/* headline */}
              <h1 style={{
                fontSize: "clamp(44px, 5vw, 72px)",
                fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.0,
                color: T.textPri, marginBottom: 12,
              }}>
                <span
  className="nx-gradient-text"
  style={{
    background: `linear-gradient(
      90deg,
      #ffffff,
      ${T.teal},
      #00c4a6,
      #ffffff
    )`,

    backgroundSize: "300% 300%",

    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  }}
>
  Nexora AI
</span>
              </h1>

              <p style={{
                fontSize: 20, fontWeight: 400, letterSpacing: "-0.02em",
                color: T.textSec, marginBottom: 20, lineHeight: 1.4,
              }}>
                Your AI Career Co-Pilot From Campus to Offer Letter.
              </p>

              <p style={{
                fontSize: 15, fontWeight: 400, lineHeight: 1.7,
                color: T.textTer, maxWidth: 440, marginBottom: 32,
                letterSpacing: "-0.005em",
              }}>
                The AI career operating system that helps you optimize resumes,
                benchmark against real job descriptions, practice interviews, and
                follow personalized roadmaps that convert skill gaps into offers.
              </p>

              {/* pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 36 }}>
                {PILLS.map((p) => (
                  <span key={p} style={{
                    fontSize: 12, fontWeight: 400, letterSpacing: "-0.005em",
                    color: T.textSec, background: T.bgCard,
                    border: `1px solid ${T.border}`,
                    borderRadius: 100, padding: "4px 12px", whiteSpace: "nowrap",
                  }}>
                    {p}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
                <Link href={"/dashboard" as Route} className="nx-btn-hero-primary">
                  Get started <ArrowUpRight size={15} />
                </Link>
                <a href="#how-it-works" className="nx-btn-hero-ghost">
  See How It Works
</a>
              </div>
              

              {/* social proof row */}
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {SOCIAL_PROOF.map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon size={13} color={T.teal} />
                    <span style={{ fontSize: 12, color: T.textTer, letterSpacing: "-0.005em" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT — Career Readiness Card ──────────────────────────── */}
            <div className="nx-fadein nx-fadein-2">

              {/* glow behind card */}
              <div
  aria-hidden
  style={{
    position: "absolute",
    inset: -80,
    borderRadius: 40,
    pointerEvents: "none",

    background: `
      radial-gradient(
        ellipse at center,
        rgba(0,229,192,0.18) 0%,
        rgba(0,229,192,0.06) 35%,
        transparent 70%
      )
    `,

    filter: "blur(50px)",
  }}
/>

              {/* main glass card — bg + border matches dashboard cards */}
              <div
  style={{
    padding: 28,
    position: "relative",
    overflow: "hidden",

    background:
      "linear-gradient(180deg, rgba(22,27,34,0.72), rgba(13,17,23,0.85))",

    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",

    border: "1px solid rgba(255,255,255,0.08)",

    boxShadow: `
      0 20px 60px rgba(0,0,0,0.55),
      0 0 50px rgba(0,229,192,0.08),
      inset 0 1px 0 rgba(255,255,255,0.06)
    `,
  }}
>
  <div className="nx-card-border" />

                {/* teal top accent line */}
                <div style={{
                  position: "absolute", top: 0, left: 24, right: 24, height: 1,
                  background: `linear-gradient(90deg, transparent, ${T.teal}50, transparent)`,
                  borderRadius: 1,
                }} />

                {/* card header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textTer, marginBottom: 2 }}>
                      AI CAREER OS
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 600, color: T.textPri, letterSpacing: "-0.02em" }}>
                      Personal Career Intelligence
                    </p>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: "linear-gradient(90deg, rgba(0,229,192,0.12), rgba(0,229,192,0.04))", border: `1px solid ${T.tealBorder}`,
                    borderRadius: 8, padding: "4px 10px",
                    fontSize: 11, fontWeight: 500, color: T.teal,
                  }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: T.teal, boxShadow: `0 0 6px ${T.teal}`,
                      animation: "nx-pulse 2s ease-in-out infinite",
                    }} />
                    AI Active
                  </div>
                </div>

                {/* stat cards row — exact dashboard layout */}
                <div
                  className="nx-stat-grid"
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}
                >
                  {METRICS.map((m, i) => (
                    <div key={m.label} className="nx-stat-card" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <span className="nx-stat-label">{m.label}</span>
                        <span className="nx-stat-delta" style={{
                          background: `${m.color}18`,
                          color: m.color,
                          border: `1px solid ${m.color}30`,
                        }}>
                          {m.delta.startsWith("+") && "↑ "}{m.delta}
                        </span>
                      </div>
                      <div
  className="nx-stat-value"
  style={{
    fontSize:
      typeof m.value === "string" && m.value.length > 3
        ? 24
        : 36,
  }}
>
  {m.value}
</div>

                      <div style={{ marginTop: 12 }}>
                        <AnimatedBar pct={m.pct} color={m.color} delay={400 + i * 100} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* overall score row */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: T.tealDim, border: `1px solid ${T.tealBorder}`,
                  borderRadius: 10, padding: "14px 18px",
                }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: T.teal, marginBottom: 2 }}>
                      AI Career Score
                    </p>
                    <p style={{ fontSize: 11, color: "rgba(0,229,192,0.6)" }}>Powered by resume, interview and job-match analysis</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.04em", color: T.teal, lineHeight: 1 }}>86</span>
                    <span style={{ fontSize: 18, color: "rgba(0,229,192,0.5)", fontWeight: 400 }}>/100</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── DIVIDER ────────────────────────────────────────────────────── */}
        <div style={{ borderTop: `1px solid ${T.border}`, margin: "0 40px" }} />

        {/* ── FEATURES ───────────────────────────────────────────────────── */}
        <section
  id="features"
  style={{
    maxWidth: 1280,
    margin: "0 auto",
    padding: "56px 40px 80px",
  }}
>

          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textTer, marginBottom: 6 }}>
              Platform modules
            </p>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: T.textPri }}>
              Everything you need to get hired
            </h2>
          </div>

          <div
            className="nx-feat-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12
            }}
          >
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="nx-feat-card nx-fadein" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                  {/* icon */}
                  <div className="nx-feature-icon"
                  style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: `${f.color}15`,
                    border: `1px solid ${f.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 16,
                  }}>
                    <Icon size={16} color={f.color} />
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: T.textPri, letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.3 }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.6, color: T.textSec, letterSpacing: "-0.005em" }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CTA BANNER ─────────────────────────────────────────────────── */}
        <section
  id="how-it-works"
  style={{
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 40px 80px",
  }}
>
  <div style={{ marginBottom: 40 }}>
    <p
      style={{
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: T.textTer,
        marginBottom: 6,
      }}
    >
      HOW IT WORKS
    </p>

    <h2
      style={{
        fontSize: 28,
        fontWeight: 700,
        color: T.textPri,
      }}
    >
      Your journey from student to hired
    </h2>
  </div>
  <div className="nx-how-grid">
    
  {[
    
    {
      step: "01",
      title: "Upload Resume",
      desc: "Import your resume and let Nexora analyze ATS compatibility and skill coverage.",
    },
    {
      step: "02",
      title: "Match Jobs",
      desc: "Compare your profile against real job descriptions and discover missing skills.",
    },
    {
      step: "03",
      title: "Practice Interviews",
      desc: "Train with AI-generated technical and HR interview simulations.",
    },
    {
      step: "04",
      title: "Get Roadmap",
      desc: "Receive a personalized execution plan to become interview-ready.",
    },
  ].map((item) => (
    <div
  key={item.step}
  className="nx-card nx-fadein"
  style={{
  padding: 20,
  minHeight: 220,
  }}
>
      <div
  style={{
    width: 42,
    height: 42,
    borderRadius: 12,

    background: "rgba(0,229,192,0.12)",

    border: "1px solid rgba(0,229,192,0.25)",

    color: T.teal,

    fontSize: 14,
    fontWeight: 700,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    marginBottom: 16,
  }}
>
        {item.step}
      </div>

      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: T.textPri,
          marginBottom: 10,
        }}
      >
        {item.title}
      </h3>

      <p
        style={{
          fontSize: 14,
          color: T.textSec,
          lineHeight: 1.7,
        }}
      >
        {item.desc}
      </p>
    </div>
  ))}
</div>
</section>
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px 80px" }}>
          <div style={{
            background: T.bgCard, border: `1px solid ${T.border}`,
            borderRadius: 16, padding: "48px 56px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 24,
            position: "relative", overflow: "hidden",
          }}>
            {/* teal glow accent */}
            <div aria-hidden style={{
              position: "absolute", right: -60, top: -60,
              width: 280, height: 280, borderRadius: "50%",
              background: `radial-gradient(circle, ${T.teal}10 0%, transparent 70%)`,
              filter: "blur(40px)", pointerEvents: "none",
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: T.textPri, marginBottom: 6 }}>
                Ready to land your next role?
              </h2>
              <p style={{ fontSize: 14, color: T.textSec, letterSpacing: "-0.005em" }}>
                Join thousands of students already using Nexora AI to accelerate their careers.
              </p>
            </div>
            <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 10, flexShrink: 0 }}>
              <Link href={"/dashboard" as Route} className="nx-btn-hero-primary">
                Get started free <ArrowUpRight size={15} />
              </Link>
              <a href="#how-it-works" className="nx-btn-hero-ghost">
  See How It Works
</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
