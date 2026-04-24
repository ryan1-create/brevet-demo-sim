"use client";

import { useState, useEffect } from "react";
import NavBar from "./NavBar";

function FrameworkCard({ card, value, onChange, focused, onFocus, onBlur, fullWidth = false, dotColor }) {
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className={`card ${focused ? "focused" : ""} ${value ? "filled" : ""} ${fullWidth ? "full" : ""}`}>
      <div className="card-header">
        <div className="card-label">
          <span className="dot" style={dotColor ? { background: dotColor } : undefined} />
          <span>{card.number} · {card.name}</span>
        </div>
        <div className="word-count">{wordCount} WORDS</div>
      </div>
      <h3 className="card-heading">{card.heading}</h3>
      <p className="card-prompt">{card.prompt}</p>
      <textarea
        className="card-textarea"
        placeholder="Start typing. Your team's response goes here."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <style jsx>{`
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: var(--elevation-1);
          padding: 24px;
          display: flex;
          flex-direction: column;
          height: 360px;
          position: relative;
          transition: border-color 150ms var(--ease-state),
                      box-shadow 150ms var(--ease-state),
                      transform 200ms var(--ease-state);
          overflow: hidden;
        }
        .card.full {
          height: 260px;
        }
        .card.focused {
          border-color: var(--ink);
          box-shadow: var(--elevation-2);
          transform: translateY(-1px);
        }
        .card.focused::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--accent);
          animation: scaleInY 200ms var(--ease-entry);
          transform-origin: top;
        }
        @keyframes scaleInY {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .card-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .card-label .dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--r1-slate);
        }
        .word-count {
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: 11px;
          color: var(--ink-3);
          letter-spacing: 0.04em;
        }
        .card-heading {
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 22px;
          line-height: 1.15;
          letter-spacing: -0.015em;
          color: var(--ink);
          margin-bottom: 8px;
        }
        .card-prompt {
          font-size: 13px;
          font-style: italic;
          color: var(--ink-2);
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .card-textarea {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: "Inter", sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: var(--ink);
          resize: none;
          padding: 0;
        }
        .card-textarea::placeholder {
          color: var(--ink-3);
          opacity: 0.7;
        }
        .card-textarea::selection {
          background: var(--accent-soft);
        }
      `}</style>
    </div>
  );
}

export default function ChallengeCanvas({ scenario, teamName, currentRound, score, onSubmit, onRoundChange }) {
  const frameworkCards = scenario?.motion?.frameworkCards || [];
  const [responses, setResponses] = useState(Array(frameworkCards.length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [saveIndicator, setSaveIndicator] = useState("saved"); // "saved" | "saving"
  const [secondsSinceSave, setSecondsSinceSave] = useState(4);
  const [briefOpen, setBriefOpen] = useState(false);

  // Simulated save behavior
  useEffect(() => {
    if (responses.some((r) => r.length > 0)) {
      setSaveIndicator("saving");
      const timeout = setTimeout(() => {
        setSaveIndicator("saved");
        setSecondsSinceSave(0);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [responses]);

  // Count up seconds since save
  useEffect(() => {
    if (saveIndicator === "saved") {
      const interval = setInterval(() => {
        setSecondsSinceSave((s) => s + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [saveIndicator]);

  const filledCount = responses.filter((r) => r.trim().length > 0).length;
  const allFilled = filledCount === frameworkCards.length && frameworkCards.length > 0;

  const handleSubmit = () => {
    if (!allFilled || !onSubmit) return;

    // Combine responses into submission string with labels
    const submission = frameworkCards
      .map((card, i) => `${card.heading}:\n${responses[i]}`)
      .join("\n\n");

    onSubmit(submission, responses);
  };

  const handleReset = () => {
    if (confirm("Discard all responses and start over?")) {
      setResponses(Array(frameworkCards.length).fill(""));
    }
  };

  if (!scenario || frameworkCards.length === 0) {
    return <div style={{ padding: 48 }}>Loading challenge...</div>;
  }

  // First 3 cards in a grid, 4th card full-width
  const topCards = frameworkCards.slice(0, 3);
  const bottomCard = frameworkCards[3];

  return (
    <div className="page">
      <NavBar currentRound={currentRound} teamName={teamName} score={score} onRoundChange={onRoundChange} />

      {/* Challenge strip */}
      <div className="challenge-strip">
        <div className="strip-left">
          <span className="strip-label">CHALLENGE</span>
          <span className="client-name">{scenario.client.name}</span>
          <div className="strip-divider" />
          <span className="motion-label">{scenario.motion.name}</span>
        </div>
        <div className="strip-right">
          <div className="save-indicator">
            <div className={`save-dot ${saveIndicator}`} />
            <span>
              {saveIndicator === "saving"
                ? "Saving…"
                : secondsSinceSave === 0
                ? "Just saved"
                : `Saved ${secondsSinceSave}s ago`}
            </span>
          </div>
          <button className="brief-btn" onClick={() => setBriefOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2.5" y="1.5" width="9" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4.5 4.5 L9.5 4.5 M4.5 7 L9.5 7 M4.5 9.5 L7.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            View Scenario Brief
          </button>
        </div>
      </div>

      {/* Scenario brief drawer */}
      {briefOpen && (
        <>
          <div className="brief-scrim" onClick={() => setBriefOpen(false)} />
          <aside className="brief-drawer">
            <div className="brief-head">
              <div className="brief-head-label">SCENARIO BRIEF</div>
              <button className="brief-close" onClick={() => setBriefOpen(false)} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 3 L11 11 M11 3 L3 11" stroke="#4A5963" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="brief-body">
              <div className="brief-section">
                <div className="brief-badge">
                  ROUND {scenario.motion.number} · {scenario.motion.name.toUpperCase()}
                </div>
                <h3 className="brief-client">{scenario.client.name}</h3>
                <p className="brief-subtitle">{scenario.subtitle}</p>
              </div>

              <div className="brief-stats">
                {scenario.stakes.map((stat) => (
                  <div key={stat.label} className={`brief-stat ${stat.urgent ? "urgent" : ""}`}>
                    <div className="brief-stat-num">{stat.value}</div>
                    <div className="brief-stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="brief-section">
                <div className="brief-section-label">THE DECISION MAKERS</div>
                <div className="brief-personas">
                  {scenario.personas.map((p) => (
                    <div key={p.name} className="brief-persona">
                      <div className="brief-persona-role">{p.role}</div>
                      <div className="brief-persona-name">{p.name}</div>
                      <div className="brief-persona-tag">&ldquo;{p.tagline}&rdquo;</div>
                      <div className="brief-persona-rows">
                        <div><span className="brief-micro-label">FEARS</span> {p.fears}</div>
                        <div><span className="brief-micro-label">WANTS</span> {p.wants}</div>
                        <div><span className="brief-micro-label">LEVERS</span> {p.levers}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="brief-section">
                <div className="brief-section-label">YOUR MISSION</div>
                <p className="brief-mission">{scenario.mission}</p>
              </div>

              <div className="brief-section">
                <div className="brief-section-label">CONTEXT</div>
                <ul className="brief-context">
                  {scenario.context.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Framework grid */}
      <div className="framework">
        <div className="top-row">
          {topCards.map((card, i) => (
            <FrameworkCard
              key={card.number}
              card={card}
              value={responses[i]}
              onChange={(val) => {
                const next = [...responses];
                next[i] = val;
                setResponses(next);
              }}
              focused={focusedIndex === i}
              onFocus={() => setFocusedIndex(i)}
              onBlur={() => setFocusedIndex(null)}
              dotColor={scenario?.motion?.roundColor}
            />
          ))}
        </div>
        {bottomCard && (
          <div className="bottom-row">
            <FrameworkCard
              card={bottomCard}
              value={responses[3]}
              onChange={(val) => {
                const next = [...responses];
                next[3] = val;
                setResponses(next);
              }}
              focused={focusedIndex === 3}
              onFocus={() => setFocusedIndex(3)}
              onBlur={() => setFocusedIndex(null)}
              fullWidth
              dotColor={scenario?.motion?.roundColor}
            />
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="action-bar">
        <div className="progress">
          <div className="progress-dots">
            {frameworkCards.map((_, i) => (
              <div
                key={i}
                className={`progress-dot ${responses[i]?.trim() ? "filled" : ""}`}
              />
            ))}
          </div>
          <div className="progress-label">
            {filledCount} OF {frameworkCards.length} COMPLETE
          </div>
        </div>
        <div className="actions">
          <button className="ghost-btn" onClick={handleReset}>
            Discard &amp; Restart
          </button>
          <button
            className={`submit-btn ${allFilled ? "ready" : ""}`}
            onClick={handleSubmit}
            disabled={!allFilled}
          >
            SUBMIT FOR COACHING →
          </button>
        </div>
      </div>

      <style jsx>{`
        .page {
          width: 100%;
          min-height: 100vh;
          background: var(--canvas);
          display: flex;
          flex-direction: column;
        }

        .challenge-strip {
          height: 56px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          flex-shrink: 0;
        }
        .strip-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .strip-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .client-name {
          font-family: "Inter Tight", sans-serif;
          font-weight: 600;
          font-size: 15px;
          color: var(--ink);
          letter-spacing: -0.01em;
        }
        .strip-divider {
          width: 1px;
          height: 16px;
          background: var(--border);
        }
        .motion-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--ink-2);
        }
        .strip-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .save-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--ink-3);
        }
        .save-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--success);
          transition: background 200ms ease;
        }
        .save-dot.saving {
          background: var(--amber);
          animation: pulse 1s ease-in-out infinite;
        }
        .brief-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--ink-2);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: color 150ms var(--ease-state), background 150ms var(--ease-state);
        }
        .brief-btn:hover {
          color: var(--ink);
          background: var(--surface-2);
        }

        .framework {
          flex: 1;
          padding: 24px 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .top-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .bottom-row {
          display: block;
        }

        .action-bar {
          height: 92px;
          border-top: 1px solid var(--border);
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .progress {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .progress-dots {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: transparent;
          border: 1px solid var(--border-strong);
          transition: background 200ms var(--ease-state), border-color 200ms var(--ease-state);
        }
        .progress-dot.filled {
          background: var(--ink);
          border-color: var(--ink);
        }
        .progress-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .ghost-btn {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--ink-3);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          transition: color 150ms var(--ease-state);
        }
        .ghost-btn:hover {
          color: var(--ink-2);
        }
        .submit-btn {
          background: var(--surface-2);
          color: var(--ink-3);
          border: none;
          border-radius: 12px;
          padding: 14px 32px;
          font-family: "Inter", sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: not-allowed;
          transition: all 300ms var(--ease-state);
        }
        .submit-btn.ready {
          background: var(--accent);
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(232, 93, 46, 0.25);
        }
        .submit-btn.ready:hover {
          background: var(--accent-deep);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(232, 93, 46, 0.35);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* ============ Scenario Brief Drawer ============ */
        .brief-scrim {
          position: fixed;
          inset: 0;
          background: rgba(15, 27, 34, 0.3);
          z-index: 40;
          animation: scrimIn 280ms var(--ease-state);
        }
        @keyframes scrimIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .brief-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 480px;
          max-width: 100vw;
          height: 100vh;
          background: var(--surface);
          border-left: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          z-index: 50;
          animation: drawerIn 280ms var(--ease-state);
        }
        @keyframes drawerIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .brief-head {
          height: 56px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .brief-head-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-2);
        }
        .brief-close {
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
        .brief-close:hover {
          background: var(--surface-2);
        }
        .brief-body {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }
        .brief-section {
          margin-bottom: 32px;
        }
        .brief-section:last-child {
          margin-bottom: 0;
        }
        .brief-section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-bottom: 12px;
        }
        .brief-badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-bottom: 12px;
        }
        .brief-client {
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 32px;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin-bottom: 8px;
        }
        .brief-subtitle {
          font-size: 15px;
          line-height: 1.5;
          color: var(--ink-2);
        }
        .brief-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 20px 0;
          margin-bottom: 32px;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .brief-stat {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }
        .brief-stat-num {
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: 24px;
          line-height: 1;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }
        .brief-stat.urgent .brief-stat-num {
          color: var(--accent);
        }
        .brief-stat-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          line-height: 1.2;
        }
        .brief-personas {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .brief-persona {
          padding: 20px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface-2);
        }
        .brief-persona-role {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-bottom: 4px;
        }
        .brief-persona-name {
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 18px;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .brief-persona-tag {
          font-size: 13px;
          font-style: italic;
          color: var(--ink-2);
          margin-bottom: 12px;
        }
        .brief-persona-rows {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 13px;
          color: var(--ink-2);
          line-height: 1.4;
        }
        .brief-micro-label {
          display: inline-block;
          min-width: 56px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--ink-3);
          margin-right: 8px;
        }
        .brief-mission {
          font-family: "Inter Tight", sans-serif;
          font-weight: 600;
          font-size: 18px;
          line-height: 1.4;
          letter-spacing: -0.01em;
          color: var(--ink);
        }
        .brief-context {
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .brief-context li {
          font-size: 13px;
          color: var(--ink-2);
          line-height: 1.5;
          padding-left: 16px;
          position: relative;
        }
        .brief-context li::before {
          content: "·";
          position: absolute;
          left: 0;
          font-weight: 700;
          color: var(--ink-3);
        }
      `}</style>
    </div>
  );
}
