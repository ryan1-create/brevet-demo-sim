"use client";

import { useEffect, useRef, useState } from "react";
import { getMockLeaderboard } from "@/lib/mockLeaderboard";
import { MOTIONS, MOTION_ORDER } from "@/lib/scenarios";

const ROUND_LABELS = MOTION_ORDER.map((id) => {
  const m = Object.values(MOTIONS).find((x) => x.id === id);
  return m ? m.name : "";
});

export default function NavBar({
  currentRound = 1,
  teamName = "Vanguard Partners",
  score = 287,
  onRoundChange,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [roundMenuOpen, setRoundMenuOpen] = useState(false);
  const roundMenuRef = useRef(null);
  const leaderboard = getMockLeaderboard(teamName, score);
  const myRank = leaderboard.find((r) => r.isYou)?.rank || 3;

  // Close round menu on outside click
  useEffect(() => {
    if (!roundMenuOpen) return;
    const onClick = (e) => {
      if (roundMenuRef.current && !roundMenuRef.current.contains(e.target)) {
        setRoundMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [roundMenuOpen]);

  const jumpToRound = (roundNumber) => {
    setRoundMenuOpen(false);
    onRoundChange && onRoundChange(roundNumber);
  };

  const renderDot = (i) => {
    const roundNumber = i + 1;
    const state =
      i < currentRound - 1 ? "completed" : i === currentRound - 1 ? "current" : "upcoming";
    return <span key={i} className={`dot ${state}`} />;
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-left">
          <div className="brand">
            <img
              className="brand-mark"
              src="/brevet-chevron.svg"
              alt="Brevet"
              height="28"
            />
          </div>
          <div className="v-divider" />
          <div className="sub-label">SALES SIMULATION</div>
        </div>

        <div className="nav-center" ref={roundMenuRef}>
          <button
            className={`round-trigger ${roundMenuOpen ? "open" : ""}`}
            onClick={() => setRoundMenuOpen((o) => !o)}
            type="button"
            aria-haspopup="true"
            aria-expanded={roundMenuOpen}
          >
            <span className="round-label">
              ROUND {String(currentRound).padStart(2, "0")} · {ROUND_LABELS[currentRound - 1]?.toUpperCase()}
            </span>
            <span className="dots">{[0, 1, 2, 3].map(renderDot)}</span>
            <svg className="caret" width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {roundMenuOpen && (
            <div className="round-menu" role="menu">
              {ROUND_LABELS.map((name, i) => {
                const roundNumber = i + 1;
                const isCurrent = roundNumber === currentRound;
                const motion = Object.values(MOTIONS).find((m) => m.id === MOTION_ORDER[i]);
                return (
                  <button
                    key={roundNumber}
                    className={`round-option ${isCurrent ? "current" : ""}`}
                    onClick={() => jumpToRound(roundNumber)}
                    type="button"
                    role="menuitem"
                  >
                    <span className="opt-dot" style={{ background: motion?.roundColor || "#888" }} />
                    <span className="opt-num">ROUND {String(roundNumber).padStart(2, "0")}</span>
                    <span className="opt-name">{name}</span>
                    {isCurrent && <span className="opt-badge">CURRENT</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="nav-right">
          <div className="team-pill">
            <span className="team-name">{teamName.toUpperCase()}</span>
            <span className="pip" />
            <span>
              <span className="score">{score}</span>
              <span className="pts">pts</span>
            </span>
          </div>

          <button className="rank-chip" onClick={() => setDrawerOpen(true)}>
            RANK {String(myRank).padStart(2, "0")}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M3.5 2 L6.5 5 L3.5 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Leaderboard drawer */}
      {drawerOpen && (
        <>
          <div className="scrim" onClick={() => setDrawerOpen(false)} />
          <aside className="drawer">
            <div className="drawer-head">
              <div className="label">LIVE LEADERBOARD</div>
              <button
                className="drawer-close"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 3 L11 11 M11 3 L3 11"
                    stroke="#4A5963"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="drawer-list">
              {leaderboard.map((t) => (
                <div
                  key={t.team + t.rank}
                  className={`team-row ${t.rank <= 3 ? "top" : ""} ${t.isYou ? "you" : ""}`}
                >
                  <div className="rank">{String(t.rank).padStart(2, "0")}</div>
                  <div className="mid">
                    <div className="name">{t.team}</div>
                    <div className="detail">{t.detail}</div>
                  </div>
                  <div className="score">{t.score}</div>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="label">10 of 24 teams shown · ⟲ refreshed 12s ago</div>
            </div>
          </aside>
        </>
      )}

      <style jsx>{`
        .nav {
          width: 100%;
          height: 72px;
          background: var(--canvas);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          animation: navFade 400ms var(--ease-entry) 200ms both;
        }
        @keyframes navFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .nav-left {
          display: flex;
          align-items: center;
          padding-left: 32px;
          gap: 16px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .brand-mark {
          display: block;
          width: auto;
          height: 24px;
          object-fit: contain;
        }
        .wordmark {
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: var(--ink);
          letter-spacing: 0.04em;
        }
        .v-divider {
          width: 1px;
          height: 24px;
          background: var(--border);
        }
        .sub-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        .nav-center {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
        }
        .round-trigger {
          display: flex;
          align-items: center;
          gap: 14px;
          background: transparent;
          border: 1px solid transparent;
          padding: 8px 14px;
          border-radius: 999px;
          cursor: pointer;
          font: inherit;
          transition: background 150ms var(--ease-state), border-color 150ms var(--ease-state);
          color: inherit;
        }
        .round-trigger:hover,
        .round-trigger.open {
          background: rgba(15, 27, 34, 0.04);
          border-color: var(--border);
        }
        .round-label {
          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-2);
          white-space: nowrap;
        }
        .dots {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          box-sizing: border-box;
        }
        .dot.completed {
          background: var(--ink);
        }
        .dot.current {
          width: 10px;
          height: 10px;
          background: var(--accent);
          animation: dotPulse 2s var(--ease-state) infinite;
        }
        .dot.upcoming {
          background: transparent;
          border: 1px solid var(--border-strong);
        }
        .caret {
          color: var(--ink-3);
          transition: transform 200ms var(--ease-state);
          flex-shrink: 0;
        }
        .round-trigger.open .caret {
          transform: rotate(180deg);
        }

        .round-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 340px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 12px 32px rgba(15, 27, 34, 0.12), 0 4px 12px rgba(15, 27, 34, 0.06);
          z-index: 200;
          animation: menuIn 180ms var(--ease-state);
        }
        @keyframes menuIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .round-option {
          display: grid;
          grid-template-columns: 10px auto 1fr auto;
          align-items: center;
          gap: 12px;
          width: 100%;
          background: transparent;
          border: none;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          font: inherit;
          text-align: left;
          color: var(--ink);
          transition: background 120ms var(--ease-state);
        }
        .round-option:hover {
          background: var(--surface-2);
        }
        .round-option.current {
          background: rgba(232, 93, 46, 0.08);
        }
        .opt-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          display: inline-block;
        }
        .opt-num {
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: var(--ink-3);
        }
        .opt-name {
          font-family: "Inter Tight", sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: var(--ink);
        }
        .opt-badge {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--accent);
          padding: 2px 6px;
          border: 1px solid var(--accent);
          border-radius: 999px;
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.08); }
        }

        .nav-right {
          margin-left: auto;
          padding-right: 32px;
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .team-pill {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 6px 12px;
          height: 36px;
        }
        .team-pill .team-name {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-2);
        }
        .team-pill .pip {
          width: 1px;
          height: 16px;
          background: var(--border);
        }
        .team-pill .score {
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: 18px;
          color: var(--ink);
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .team-pill .pts {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-left: 4px;
        }

        .rank-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--accent-soft);
          border: 1px solid var(--accent);
          border-radius: 999px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent-deep);
          transition: background 150ms var(--ease-state);
          height: 28px;
        }
        .rank-chip:hover {
          background: #fff;
        }

        /* Drawer */
        .scrim {
          position: fixed;
          inset: 0;
          background: rgba(15, 27, 34, 0.3);
          z-index: 40;
          animation: fadeIn 280ms var(--ease-state);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 400px;
          max-width: 100vw;
          height: 100vh;
          background: var(--surface);
          border-left: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          z-index: 50;
          animation: slideIn 280ms var(--ease-state);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .drawer-head {
          height: 56px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .drawer-head .label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-2);
        }
        .drawer-close {
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 4px;
          transition: background 150ms var(--ease-state);
        }
        .drawer-close:hover {
          background: var(--surface-2);
        }
        .drawer-list {
          flex: 1;
          overflow-y: auto;
        }
        .team-row {
          display: grid;
          grid-template-columns: 48px 1fr auto;
          gap: 12px;
          align-items: center;
          height: 56px;
          padding: 0 16px;
          border-bottom: 1px solid var(--border);
          position: relative;
        }
        .team-row .rank {
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: 20px;
          color: var(--ink-2);
          font-variant-numeric: tabular-nums;
        }
        .team-row.top .rank {
          color: var(--ink);
        }
        .team-row .mid {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .team-row .name {
          font-family: "Inter Tight", sans-serif;
          font-weight: 600;
          font-size: 15px;
          color: var(--ink);
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .team-row .detail {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .team-row .score {
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: 16px;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
        }
        .team-row.you {
          background: var(--accent-soft);
        }
        .team-row.you::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--accent);
        }
        .drawer-foot {
          height: 48px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }
        .drawer-foot .label {
          font-size: 11px;
          color: var(--ink-3);
          letter-spacing: 0.02em;
          text-transform: none;
          font-weight: 400;
        }
      `}</style>
    </>
  );
}
